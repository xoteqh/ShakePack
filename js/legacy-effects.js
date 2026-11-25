/**
 * legacy-effects.js
 */

(function() {
    window.applyPreset = function(presetInput) {
        if (typeof CSInterface === 'undefined') return;
        if (window.showLoadingBar) window.showLoadingBar();
        var csInterface = new CSInterface();
        
        var isApplyAll = Array.isArray(presetInput);
        var presetIds = isApplyAll ? presetInput : [presetInput];
        var presetArrayStr = JSON.stringify(presetIds);
        var usePlayhead = !isApplyAll;
        var tuningsStr = JSON.stringify(presetIds.map(function(id) {
            return window.getShakeTuning
                ? window.getShakeTuning(id)
                : { strength: 1, speed: 1, blur: 1 };
        }));

        var script = `(function() {
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) return "ERROR_NO_COMP";
            
            if (comp.selectedLayers.length === 0) return "ERROR_NO_LAYER";
            
            var presets = ${presetArrayStr};
            var tunings = ${tuningsStr};
            var isApplyAll = ${isApplyAll};
            var usePlayhead = ${usePlayhead};
            if (!presets || presets.length === 0) return "SUCCESS";
            var mutStrength = 1, mutSpeed = 1, mutBlur = 1;
            var createdLayers = [];

            function normalizeName(value) {
                return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            }
            function scaleFor(name) {
                var n = normalizeName(name);
                if (n.indexOf('motionblur') >= 0) {
                    return (n.indexOf('length') >= 0 || n.indexOf('amount') >= 0) ? mutBlur : 1;
                }
                if (n.indexOf('blur') >= 0 && n.indexOf('length') >= 0) return mutBlur;
                if (n.indexOf('speed') >= 0 || n.indexOf('freq') >= 0) return mutSpeed;
                if (n.indexOf('amp') >= 0 || n.indexOf('dissolvepercent') >= 0 || n.indexOf('zdist') >= 0) return mutStrength;
                return 1;
            }
            function propScale(prop) {
                return scaleFor(((prop && prop.name) || '') + ' ' + ((prop && prop.matchName) || ''));
            }
            
            var targetLayers = comp.selectedLayers;
            if (targetLayers.length === 0) return "ERROR_NO_LAYER";
            
            function hasSapphire() {
                try {
                    var effects = app.effects;
                    var hasShake = false, hasDissolve = false;
                    for (var i = 0; i < effects.length; i++) {
                        var name = (effects[i].matchName || '') + '|' + (effects[i].displayName || '');
                        if (name.indexOf('S_Shake') >= 0) hasShake = true;
                        if (name.indexOf('S_DissolveShake') >= 0) hasDissolve = true;
                    }
                    return hasShake || hasDissolve;
                } catch (e) {
                    return false;
                }
            }
            if (!hasSapphire()) return "ERROR_FX_MISSING";

            function cleanupLayers() {
                for (var ci = 0; ci < createdLayers.length; ci++) {
                    try { createdLayers[ci].remove(); } catch (e) {}
                }
            }
            
            app.beginUndoGroup("Apply Shake Preset");
            
            try {
            var layersToProcess = isApplyAll ? targetLayers : [targetLayers[0]];
            var fx = null;
            var anyFxMissing = false;
            
            function findFxProp(fx, name) {
                try { var p = fx.property(name); if (p) return p; } catch(e) {}
                try {
                    var key = normalizeName(name);
                    if (!key) return null;
                    var fallback = null;
                    for (var i = 1; i <= fx.numProperties; i++) {
                        var cand = fx.property(i);
                        var cn = normalizeName((cand && cand.name) || '');
                        var mn = normalizeName((cand && cand.matchName) || '');
                        if (cn === key || mn === key) return cand;
                        if ((cn.indexOf(key) >= 0 || mn.indexOf(key) >= 0) &&
                            (!fallback || cn.length < normalizeName((fallback.name || '')))) fallback = cand;
                    }
                    return fallback;
                } catch(e) {}
                return null;
            }
            function prop(fx, name) { return findFxProp(fx, name); }

            function setProp(fx, name, value) {
                try {
                    var p = findFxProp(fx, name);
                    if (!p) return;
                    var scaled = typeof value === 'boolean' ? value : value * scaleFor(name);
                    // У Sapphire Dissolve Speed минимум 1 — не даём ползунку Speed уйти ниже
                    if (typeof scaled === 'number' && normalizeName(name).indexOf('dissolvespeed') >= 0 && scaled < 1) scaled = 1;
                    p.setValue(scaled);
                } catch(e) {}
            }

            function setExp(prop, startVal, powerVal, duration) {
                try {
                    var sv = startVal * propScale(prop);
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              sv + " * (1 - Math.pow(progress, " + powerVal + "));";
                    prop.expressionEnabled = true;
                    prop.expression = exp;
                } catch(e) {}
            }

            function setExpExpo(prop, startVal, decayRate, duration) {
                try {
                    var sv = startVal * propScale(prop);
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              sv + " * Math.exp(-" + decayRate + " * progress * 3) * (1 - Math.pow(progress, 10));";
                    prop.expressionEnabled = true;
                    prop.expression = exp;
                } catch(e) {}
            }

            function setExpZDist(prop, startVal, endVal, powerVal, duration) {
                try {
                    var mul = propScale(prop);
                    var sv = startVal * mul;
                    var ev = endVal * mul;
                    var diff = sv - ev;
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              sv + " - (" + diff + " * Math.pow(progress, " + powerVal + "));";
                    prop.expressionEnabled = true;
                    prop.expression = exp;
                } catch(e) {}
            }
            
            function setExpSmooth(prop, startVal, endVal, duration) {
                try {
                    var mul = propScale(prop);
                    var sv = startVal * mul;
                    var ev = endVal * mul;
                    var diff = sv - ev;
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              "var smoothProgress = progress * progress * (3 - 2 * progress);\\n" +
                              sv + " - (" + diff + " * smoothProgress);";
                    prop.expressionEnabled = true;
                    prop.expression = exp;
                } catch(e) {}
            }
            
            for (var k = 0; k < layersToProcess.length; k++) {
                var targetLayer = layersToProcess[k];
                var presetId = isApplyAll ? presets[k % presets.length] : presets[0];
                var tune = tunings[k % tunings.length] || {};
                mutStrength = isFinite(tune.strength) ? tune.strength : 1;
                mutSpeed = isFinite(tune.speed) ? tune.speed : 1;
                mutBlur = isFinite(tune.blur) ? tune.blur : 1;

                var layerName = "SHAKE";
                var frames = 19; 
                
                if (presetId === 'soft-shake-1') { layerName = "SHAKE - Soft 1"; }
                else if (presetId === 'soft-shake-2') { layerName = "SHAKE - Soft 2"; }
                else if (presetId === 'soft-shake-3') { layerName = "SHAKE - Soft 3"; }
                else if (presetId === 'soft-shake-4') { layerName = "SHAKE - Soft 4"; frames = 22; }
                else if (presetId === 'soft-shake-5') { layerName = "SHAKE - Soft 5"; frames = 22; }
                else if (presetId === 'soft-shake-6') { layerName = "SHAKE - Soft 6"; frames = 22; }
                else if (presetId === 'soft-shake-7') { layerName = "SHAKE - Soft 7"; frames = 22; }
                else if (presetId === 'soft-shake-8') { layerName = "SHAKE - Soft 8"; frames = 22; }
                else if (presetId === 'soft-shake-9') { layerName = "SHAKE - Soft 9"; frames = 22; }
                else if (presetId === 'soft-shake-10') { layerName = "SHAKE - Soft 10"; frames = 22; }
                else if (presetId === 'soft-shake-11') { layerName = "SHAKE - Soft 11"; frames = 22; }
                else if (presetId === 'soft-shake-12') { layerName = "SHAKE - Soft 12"; frames = 22; }
                else if (presetId === 'soft-shake-13') { layerName = "SHAKE - Soft 13"; frames = 22; }
                else if (presetId === 'soft-shake-14') { layerName = "SHAKE - Soft 14"; frames = 22; }
                else if (presetId === 'soft-shake-15') { layerName = "SHAKE - Soft 15"; frames = 22; }
                else if (presetId === 'hard-shake-1') { layerName = "SHAKE - Hard 1"; }
                else if (presetId === 'hard-shake-2') { layerName = "SHAKE - Hard 2"; }
                else if (presetId === 'hard-shake-3') { layerName = "SHAKE - Hard 3"; }
                else if (presetId === 'hard-shake-4') { layerName = "SHAKE - Hard 4"; }
                else if (presetId === 'hard-shake-5') { layerName = "SHAKE - Hard 5"; }
                else if (presetId === 'hard-shake-6') { layerName = "SHAKE - Hard 6"; }
                else if (presetId === 'hard-shake-7') { layerName = "SHAKE - Hard 7"; frames = 19; }
                else if (presetId === 'hard-shake-8') { layerName = "SHAKE - Hard 8"; frames = 19; }
                else if (presetId === 'hard-shake-9') { layerName = "SHAKE - Hard 9"; frames = 19; }
                else if (presetId === 'hard-shake-10') { layerName = "SHAKE - Hard 10"; frames = 19; }
                else if (presetId === 'hard-shake-11') { layerName = "SHAKE - Hard 11"; frames = 19; }
                else if (presetId === 'hard-shake-12') { layerName = "SHAKE - Hard 12"; frames = 19; }
                else if (presetId === 'hard-shake-13') { layerName = "SHAKE - Hard 13"; frames = 19; }
                else if (presetId === 'hard-shake-14') { layerName = "SHAKE - Hard 14"; frames = 19; }
                else if (presetId === 'hard-shake-15') { layerName = "SHAKE - Hard 15"; frames = 19; }
                else if (presetId === 'dirty-shake-1') { layerName = "SHAKE - Dirty 1"; }
                else if (presetId === 'dirty-shake-2') { layerName = "SHAKE - Dirty 2"; }
                else if (presetId === 'dirty-shake-3') { layerName = "SHAKE - Dirty 3"; }
                else if (presetId === 'dirty-shake-4') { layerName = "SHAKE - Dirty 4"; }
                else if (presetId === 'dirty-shake-5') { layerName = "SHAKE - Dirty 5"; frames = 19; }
                else if (presetId === 'dirty-shake-6') { layerName = "SHAKE - Dirty 6"; frames = 19; }
                else if (presetId === 'dirty-shake-7') { layerName = "SHAKE - Dirty 7"; frames = 19; }
                else if (presetId === 'dirty-shake-8') { layerName = "SHAKE - Dirty 8"; frames = 19; }
                else if (presetId === 'dirty-shake-9') { layerName = "SHAKE - Dirty 9"; frames = 19; }
                else if (presetId === 'dirty-shake-10') { layerName = "SHAKE - Dirty 10"; frames = 19; }
                else if (presetId === 'dirty-shake-11') { layerName = "SHAKE - Dirty 11"; frames = 19; }
                else if (presetId === 'dirty-shake-12') { layerName = "SHAKE - Dirty 12"; frames = 19; }
                else if (presetId === 'dirty-shake-13') { layerName = "SHAKE - Dirty 13"; frames = 19; }
                else if (presetId === 'dirty-shake-14') { layerName = "SHAKE - Dirty 14"; frames = 19; }
                else if (presetId === 'dirty-shake-15') { layerName = "SHAKE - Dirty 15"; frames = 19; }
                else if (presetId === 'fast-shake-1') { layerName = "SHAKE - Fast 1"; frames = 8; }
                else if (presetId === 'fast-shake-2') { layerName = "SHAKE - Fast 2"; frames = 8; }
                else if (presetId === 'fast-shake-3') { layerName = "SHAKE - Fast 3"; frames = 8; }
                else if (presetId === 'fast-shake-4') { layerName = "SHAKE - Fast 4"; frames = 8; }
                else if (presetId === 'fast-shake-5') { layerName = "SHAKE - Fast 5"; frames = 8; }
                else if (presetId === 'fast-shake-6') { layerName = "SHAKE - Fast 6"; frames = 8; }
                else if (presetId === 'fast-shake-7') { layerName = "SHAKE - Fast 7"; frames = 8; }
                else if (presetId === 'fast-shake-8') { layerName = "SHAKE - Fast 8"; frames = 8; }
                else if (presetId === 'fast-shake-9') { layerName = "SHAKE - Fast 9"; frames = 8; }
                else if (presetId === 'fast-shake-10') { layerName = "SHAKE - Fast 10"; frames = 8; }
                else if (presetId === 'fast-shake-11') { layerName = "SHAKE - Fast 11"; frames = 8; }
                else if (presetId === 'fast-shake-12') { layerName = "SHAKE - Fast 12"; frames = 8; }
                else if (presetId === 'fast-shake-13') { layerName = "SHAKE - Fast 13"; frames = 8; }
                else if (presetId === 'fast-shake-14') { layerName = "SHAKE - Fast 14"; frames = 8; }
                else if (presetId === 'fast-shake-15') { layerName = "SHAKE - Fast 15"; frames = 8; }

                var adjLayer = comp.layers.addSolid([1, 1, 1], layerName, comp.width, comp.height, comp.pixelAspect);
                createdLayers.push(adjLayer);
                adjLayer.adjustmentLayer = true;
                adjLayer.moveBefore(targetLayer);
                adjLayer.label = 10;  
                
                var duration = frames * comp.frameDuration; 
                var startTime = usePlayhead ? comp.time : targetLayer.inPoint;
                
                adjLayer.inPoint = startTime;
                adjLayer.outPoint = startTime + duration;
                
                if (presetId === 'soft-shake-1') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 4.70);
                        setProp(fx, "Phase", 3.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.26);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Amplitude"), 1.300, 0.5, duration);
                        setExpZDist(prop(fx, "Z Dist"), 1.100, 1.000, 0.5, duration);
                    }
                } 
                else if (presetId === 'soft-shake-2') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.000);
                        setProp(fx, "Amplitude", 2.600);
                        setProp(fx, "Frequency", 5.90);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.200);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 15.00, 0.7, duration);
                    }
                }
                else if (presetId === 'soft-shake-3') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.000);
                        setProp(fx, "Amplitude", 5.000);
                        setProp(fx, "Frequency", 5.90);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.200);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 7.00, 0.4, duration);
                    }
                }
                else if (presetId === 'soft-shake-4') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 5.00);
                        setProp(fx, "Phase", 0.000);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.500);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Rand Freq", 1.200);
                        setProp(fx, "X Wave Amp", 80.00);
                        setProp(fx, "X Wave Freq", 1.060);
                        setProp(fx, "Y Rand Amp", 76.00);
                        setProp(fx, "Y Rand Freq", 1.000);
                        setProp(fx, "Y Wave Amp", 0.00);
                        setProp(fx, "Y Wave Freq", 0.550);
                        setExp(prop(fx, "Amplitude"), 1.200, 0.3, duration);
                    }
                }
                else if (presetId === 'soft-shake-5') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 4.00);
                        setProp(fx, "Phase", 0.000);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.300);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Rand Freq", 2.000);
                        setProp(fx, "X Wave Amp", 45.00);
                        setProp(fx, "X Wave Freq", 1.700);
                        setProp(fx, "Y Rand Amp", 96.00);
                        setProp(fx, "Y Rand Freq", 1.000);
                        setProp(fx, "Y Wave Amp", 0.00);
                        setProp(fx, "Y Wave Freq", 0.500);
                        setExp(prop(fx, "Amplitude"), 1.300, 0.3, duration);
                    }
                }
                else if (presetId === 'soft-shake-6') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 6.00);
                        setProp(fx, "Phase", 0.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.40);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 30.00);
                        setProp(fx, "X Wave Freq", 1.03);
                        setProp(fx, "Y Wave Amp", 21.00);
                        setProp(fx, "Y Wave Freq", 0.65);
                        setExpExpo(prop(fx, "Amplitude"), 2.300, 1.5, duration);
                    }
                }
                else if (presetId === 'soft-shake-7') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 3.00);
                        setProp(fx, "Phase", 0.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.10);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 94.00);
                        setProp(fx, "X Wave Freq", 1.62);
                        setProp(fx, "Y Wave Amp", 24.00);
                        setProp(fx, "Y Wave Freq", 0.80);
                        setExpExpo(prop(fx, "Amplitude"), 1.000, 1.2, duration);
                    }
                }
                else if (presetId === 'soft-shake-8') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 5.50);
                        setProp(fx, "Phase", 0.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.30);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 64.00);
                        setProp(fx, "X Wave Freq", 0.86);
                        setProp(fx, "Y Wave Amp", 45.00);
                        setProp(fx, "Y Wave Freq", 0.88);
                        setExpExpo(prop(fx, "Amplitude"), 1.600, 1.5, duration);
                    }
                }
                else if (presetId === 'soft-shake-9') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.000);
                        setProp(fx, "Amplitude", 2.600);
                        setProp(fx, "Frequency", 2.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 39.00);
                        setProp(fx, "X Wave Freq", 2.790);
                        setProp(fx, "Y Wave Amp", 24.00);
                        setProp(fx, "Y Wave Freq", 1.990);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 14.00, 0.00, duration);
                    }
                }
                else if (presetId === 'soft-shake-10') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 1.900);
                        setProp(fx, "Amplitude", 2.300);
                        setProp(fx, "Frequency", 5.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.500);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 50.00);
                        setProp(fx, "X Wave Freq", 1.100);
                        setProp(fx, "Y Wave Amp", 25.00);
                        setProp(fx, "Y Wave Freq", 1.140);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 13.00, 0.00, duration);
                    }
                }
                else if (presetId === 'soft-shake-11') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.100);
                        setProp(fx, "Amplitude", 3.200);
                        setProp(fx, "Frequency", 6.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 87.00);
                        setProp(fx, "X Wave Freq", 0.670);
                        setProp(fx, "Y Wave Amp", 51.00);
                        setProp(fx, "Y Wave Freq", 0.720);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 12.00, 0.00, duration);
                    }
                }
                else if (presetId === 'soft-shake-12') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.200);
                        setProp(fx, "Amplitude", 3.300);
                        setProp(fx, "Frequency", 6.50);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.900);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 60.00);
                        setProp(fx, "X Wave Freq", 0.820);
                        setProp(fx, "Y Wave Amp", 85.00);
                        setProp(fx, "Y Wave Freq", 0.640);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 14.00, 0.00, duration);
                    }
                }
                else if (presetId === 'soft-shake-13') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 4.00);
                        setProp(fx, "Phase", 0.000);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.200);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 55.00);
                        setProp(fx, "X Wave Freq", 0.660);
                        setProp(fx, "Y Wave Amp", 34.00);
                        setProp(fx, "Y Wave Freq", 0.530);
                        setExpSmooth(prop(fx, "Amplitude"), 1.800, 0.00, duration);
                    }
                }
                else if (presetId === 'soft-shake-14') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 5.00);
                        setProp(fx, "Phase", 0.000);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.200);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 51.00);
                        setProp(fx, "X Wave Freq", 0.810);
                        setProp(fx, "Y Wave Amp", 24.00);
                        setProp(fx, "Y Wave Freq", 0.790);
                        setExpSmooth(prop(fx, "Amplitude"), 1.000, 0.00, duration);
                    }
                }
                else if (presetId === 'soft-shake-15') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.300);
                        setProp(fx, "Amplitude", 2.800);
                        setProp(fx, "Frequency", 4.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.900);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 60.00);
                        setProp(fx, "X Wave Freq", 0.590);
                        setProp(fx, "Y Wave Amp", 41.00);
                        setProp(fx, "Y Wave Freq", 1.090);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 16.00, 0.00, duration);
                    }
                }
                else if (presetId === 'hard-shake-1') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.40);
                        setProp(fx, "Amplitude", 3.60);
                        setProp(fx, "Frequency", 6.40);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.500);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "Z Rand Freq", 1.000);
                        setProp(fx, "Z Wave Amp", 0.00);
                        setProp(fx, "Z Wave Freq", 0.500);
                        setProp(fx, "Z Phase", 0.000);
                        setExp(prop(fx, "Dissolve Percent"), 12.00, 0.3, duration);
                        setExp(prop(fx, "Z Rand Amp"), 100.00, 0.3, duration);
                    }
                }
                else if (presetId === 'hard-shake-2') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 4.70);
                        setProp(fx, "Phase", 3.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.26);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Amplitude"), 1.300, 0.2, duration);
                        setExpZDist(prop(fx, "Z Dist"), 1.100, 1.000, 0.2, duration);
                    }
                }
                else if (presetId === 'hard-shake-3') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 1.700);
                        setProp(fx, "Amplitude", 2.500);
                        setProp(fx, "Frequency", 3.40);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.300);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "Z Rand Freq", 1.000);
                        setProp(fx, "Z Wave Amp", 0.00);
                        setProp(fx, "Z Wave Freq", 0.500);
                        setProp(fx, "Z Phase", 3.800);
                        setProp(fx, "X Rand Amp", 192.00);
                        setProp(fx, "Y Rand Amp", 96.00);
                        setExp(prop(fx, "Dissolve Percent"), 9.00, 0.3, duration);
                        setExp(prop(fx, "Z Rand Amp"), 300.00, 0.3, duration);
                    }
                }
                else if (presetId === 'hard-shake-4') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.400);
                        setProp(fx, "Amplitude", 2.000);
                        setProp(fx, "Frequency", 10.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.200);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Rand Freq", 1.000);
                        setProp(fx, "X Wave Amp", 93.00);
                        setProp(fx, "X Wave Freq", 0.920);
                        setProp(fx, "Y Rand Amp", 56.00);
                        setProp(fx, "Y Rand Freq", 1.000);
                        setProp(fx, "Y Wave Amp", 0.00);
                        setProp(fx, "Y Wave Freq", 0.500);
                        setExp(prop(fx, "Dissolve Percent"), 18.00, 0.3, duration);
                    }
                }
                else if (presetId === 'hard-shake-5') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 5.00);
                        setProp(fx, "Phase", 0.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.500);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 76.00);
                        setProp(fx, "X Wave Freq", 1.06);
                        setProp(fx, "Y Wave Amp", 25.00);
                        setProp(fx, "Y Wave Freq", 1.39);
                        setExp(prop(fx, "Amplitude"), 1.200, 1.0, duration);
                    }
                }
                else if (presetId === 'hard-shake-6') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.100);
                        setProp(fx, "Amplitude", 2.700);
                        setProp(fx, "Frequency", 7.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 72.00);
                        setProp(fx, "X Wave Freq", 0.980);
                        setProp(fx, "Y Wave Amp", 37.00);
                        setProp(fx, "Y Wave Freq", 1.390);
                        setExpExpo(prop(fx, "Dissolve Percent"), 22.00, 1.0, duration);
                    }
                }
                else if (presetId === 'hard-shake-7') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 4.00);
                        setProp(fx, "Phase", 0.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.10);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 51.00);
                        setProp(fx, "X Wave Freq", 0.58);
                        setProp(fx, "Y Wave Amp", 49.00);
                        setProp(fx, "Y Wave Freq", 0.67);
                        setExpExpo(prop(fx, "Amplitude"), 2.600, 1.5, duration);
                    }
                }
                else if (presetId === 'hard-shake-8') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.800);
                        setProp(fx, "Amplitude", 3.200);
                        setProp(fx, "Frequency", 8.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 62.00);
                        setProp(fx, "X Wave Freq", 0.830);
                        setProp(fx, "Y Wave Amp", 30.00);
                        setProp(fx, "Y Wave Freq", 0.880);
                        setExpExpo(prop(fx, "Dissolve Percent"), 23.00, 1.5, duration);
                    }
                }
                else if (presetId === 'hard-shake-9') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.600);
                        setProp(fx, "Amplitude", 3.000);
                        setProp(fx, "Frequency", 6.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.500);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 48.00);
                        setProp(fx, "X Wave Freq", 0.900);
                        setProp(fx, "Y Wave Amp", 30.00);
                        setProp(fx, "Y Wave Freq", 1.130);
                        setExpExpo(prop(fx, "Dissolve Percent"), 28.00, 1.5, duration);
                    }
                }
                else if (presetId === 'hard-shake-10') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.100);
                        setProp(fx, "Amplitude", 2.700);
                        setProp(fx, "Frequency", 7.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 70.00);
                        setProp(fx, "X Wave Freq", 0.970);
                        setProp(fx, "Y Wave Amp", 38.00);
                        setProp(fx, "Y Wave Freq", 0.730);
                        setProp(fx, "X Rand Amp", 0.00);
                        setProp(fx, "Y Rand Amp", 0.00);
                        setExpExpo(prop(fx, "Dissolve Percent"), 30.00, 1.2, duration);
                    }
                }
                else if (presetId === 'hard-shake-11') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.400);
                        setProp(fx, "Amplitude", 2.800);
                        setProp(fx, "Frequency", 8.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.900);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 82.00);
                        setProp(fx, "X Wave Freq", 0.840);
                        setProp(fx, "Y Wave Amp", 78.00);
                        setProp(fx, "Y Wave Freq", 0.850);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 12.00, 0.00, duration);
                    }
                }
                else if (presetId === 'hard-shake-12') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.200);
                        setProp(fx, "Amplitude", 2.700);
                        setProp(fx, "Frequency", 10.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 114.00);
                        setProp(fx, "X Wave Freq", 0.600);
                        setProp(fx, "Y Wave Amp", 46.00);
                        setProp(fx, "Y Wave Freq", 0.560);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 14.00, 0.00, duration);
                    }
                }
                else if (presetId === 'hard-shake-13') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.300);
                        setProp(fx, "Amplitude", 3.100);
                        setProp(fx, "Frequency", 12.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.900);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 81.00);
                        setProp(fx, "X Wave Freq", 0.560);
                        setProp(fx, "Y Wave Amp", 59.00);
                        setProp(fx, "Y Wave Freq", 0.670);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 13.00, 0.00, duration);
                    }
                }
                else if (presetId === 'hard-shake-14') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.400);
                        setProp(fx, "Amplitude", 3.100);
                        setProp(fx, "Frequency", 9.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 92.00);
                        setProp(fx, "X Wave Freq", 0.600);
                        setProp(fx, "Y Wave Amp", 78.00);
                        setProp(fx, "Y Wave Freq", 0.580);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 13.50, 0.00, duration);
                    }
                }
                else if (presetId === 'hard-shake-15') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.500);
                        setProp(fx, "Amplitude", 3.200);
                        setProp(fx, "Frequency", 10.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 112.00);
                        setProp(fx, "X Wave Freq", 0.800);
                        setProp(fx, "Y Wave Amp", 43.00);
                        setProp(fx, "Y Wave Freq", 0.500);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 14.00, 0.00, duration);
                    }
                }
                else if (presetId === 'dirty-shake-1') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.400);
                        setProp(fx, "Frequency", 3.10);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.000);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "Dissolve Percent", 24.00); 
                        setExp(prop(fx, "Amplitude"), 3.200, 0.3, duration); 
                    }
                }
                else if (presetId === 'dirty-shake-2') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.400);
                        setProp(fx, "Amplitude", 3.700); 
                        setProp(fx, "Frequency", 17.10);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.600);
                        setProp(fx, "Seed", 0.960);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExpExpo(prop(fx, "Dissolve Percent"), 31.00, 2.0, duration);
                    }
                }
                else if (presetId === 'dirty-shake-3') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.500);
                        setProp(fx, "Amplitude", 3.800); 
                        setProp(fx, "Frequency", 14.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Seed", 0.310);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 28.00, 0.2, duration); 
                    }
                }
                else if (presetId === 'dirty-shake-4') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.600);
                        setProp(fx, "Amplitude", 3.900);
                        setProp(fx, "Frequency", 17.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Seed", 0.450);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 29.00, 0.15, duration);
                    }
                }
                else if (presetId === 'dirty-shake-5') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 1.900);
                        setProp(fx, "Amplitude", 3.100);
                        setProp(fx, "Frequency", 9.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 62.00);
                        setProp(fx, "X Wave Freq", 0.590);
                        setProp(fx, "Y Wave Amp", 41.00);
                        setProp(fx, "Y Wave Freq", 0.760);
                        setExpExpo(prop(fx, "Dissolve Percent"), 18.00, 0.6, duration);
                    }
                }
                else if (presetId === 'dirty-shake-6') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.400);
                        setProp(fx, "Amplitude", 3.400);
                        setProp(fx, "Frequency", 8.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.500);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 78.00);
                        setProp(fx, "X Wave Freq", 0.840);
                        setProp(fx, "Y Wave Amp", 54.00);
                        setProp(fx, "Y Wave Freq", 1.200);
                        setExpExpo(prop(fx, "Dissolve Percent"), 22.00, 1.5, duration);
                    }
                }
                else if (presetId === 'dirty-shake-7') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.300);
                        setProp(fx, "Amplitude", 2.700);
                        setProp(fx, "Frequency", 11.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 68.00);
                        setProp(fx, "X Wave Freq", 0.620);
                        setProp(fx, "Y Wave Amp", 40.00);
                        setProp(fx, "Y Wave Freq", 0.850);
                        setExpExpo(prop(fx, "Dissolve Percent"), 28.00, 1.5, duration);
                    }
                }
                else if (presetId === 'dirty-shake-8') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.600);
                        setProp(fx, "Amplitude", 2.900);
                        setProp(fx, "Frequency", 13.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 64.00);
                        setProp(fx, "X Wave Freq", 0.840);
                        setProp(fx, "Y Wave Amp", 24.00);
                        setProp(fx, "Y Wave Freq", 0.710);
                        setExpExpo(prop(fx, "Dissolve Percent"), 25.00, 1.5, duration);
                    }
                }
                else if (presetId === 'dirty-shake-9') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.700);
                        setProp(fx, "Amplitude", 2.900);
                        setProp(fx, "Frequency", 11.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 76.00);
                        setProp(fx, "X Wave Freq", 0.740);
                        setProp(fx, "Y Wave Amp", 32.00);
                        setProp(fx, "Y Wave Freq", 0.900);
                        setExpExpo(prop(fx, "Dissolve Percent"), 23.00, 1.0, duration);
                    }
                }
                else if (presetId === 'dirty-shake-10') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.900);
                        setProp(fx, "Amplitude", 3.200);
                        setProp(fx, "Frequency", 12.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 84.00);
                        setProp(fx, "X Wave Freq", 0.640);
                        setProp(fx, "Y Wave Amp", 38.00);
                        setProp(fx, "Y Wave Freq", 0.840);
                        setExpExpo(prop(fx, "Dissolve Percent"), 28.00, 1.5, duration);
                    }
                }
                else if (presetId === 'dirty-shake-11') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.600);
                        setProp(fx, "Amplitude", 3.200);
                        setProp(fx, "Frequency", 12.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 95.00);
                        setProp(fx, "X Wave Freq", 0.670);
                        setProp(fx, "Y Wave Amp", 47.00);
                        setProp(fx, "Y Wave Freq", 0.640);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 14.00, 0.00, duration);
                    }
                }
                else if (presetId === 'dirty-shake-12') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.300);
                        setProp(fx, "Amplitude", 2.900);
                        setProp(fx, "Frequency", 11.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.900);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 102.00);
                        setProp(fx, "X Wave Freq", 0.620);
                        setProp(fx, "Y Wave Amp", 63.00);
                        setProp(fx, "Y Wave Freq", 0.720);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 14.00, 0.00, duration);
                    }
                }
                else if (presetId === 'dirty-shake-13') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.600);
                        setProp(fx, "Amplitude", 3.200);
                        setProp(fx, "Frequency", 13.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 87.00);
                        setProp(fx, "X Wave Freq", 0.730);
                        setProp(fx, "Y Wave Amp", 42.00);
                        setProp(fx, "Y Wave Freq", 0.740);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 13.50, 0.00, duration);
                    }
                }
                else if (presetId === 'dirty-shake-14') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.700);
                        setProp(fx, "Amplitude", 3.400);
                        setProp(fx, "Frequency", 11.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.900);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 71.00);
                        setProp(fx, "X Wave Freq", 0.630);
                        setProp(fx, "Y Wave Amp", 53.00);
                        setProp(fx, "Y Wave Freq", 0.620);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 13.50, 0.00, duration);
                    }
                }
                else if (presetId === 'dirty-shake-15') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.800);
                        setProp(fx, "Amplitude", 3.500);
                        setProp(fx, "Frequency", 10.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.000);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 85.00);
                        setProp(fx, "X Wave Freq", 0.530);
                        setProp(fx, "Y Wave Amp", 58.00);
                        setProp(fx, "Y Wave Freq", 0.800);
                        setExpSmooth(prop(fx, "Dissolve Percent"), 13.00, 0.00, duration);
                    }
                }
                else if (presetId === 'fast-shake-1') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.400);
                        setProp(fx, "Amplitude", 2.600);
                        setProp(fx, "Frequency", 9.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.250);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 19.00, 0.25, duration);
                    }
                }
                else if (presetId === 'fast-shake-2') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.800);
                        setProp(fx, "Amplitude", 1.600);
                        setProp(fx, "Frequency", 23.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.380);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 30.00, 0.4, duration);
                    }
                }
                else if (presetId === 'fast-shake-3') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.000);
                        setProp(fx, "Amplitude", 0.600);
                        setProp(fx, "Frequency", 20.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.180);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 10.00, 4.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-4') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.000);
                        setProp(fx, "Amplitude", 1.000);
                        setProp(fx, "Frequency", 14.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.180);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 28.00, 4.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-5') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.200);
                        setProp(fx, "Amplitude", 1.300);
                        setProp(fx, "Frequency", 12.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.050);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 27.00, 4.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-6') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 7.000);
                        setProp(fx, "Amplitude", 2.500);
                        setProp(fx, "Frequency", 9.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.500);
                        setProp(fx, "Seed", 0.480);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(prop(fx, "Dissolve Percent"), 15.00, 4.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-7') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 1.500);
                        setProp(fx, "Amplitude", 2.300);
                        setProp(fx, "Frequency", 18.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.600);
                        setProp(fx, "Seed", 0.000);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Rand Amp", 0.00);
                        setProp(fx, "X Rand Freq", 1.250);
                        setProp(fx, "X Wave Amp", 167.00);
                        setProp(fx, "X Wave Freq", 1.290);
                        setProp(fx, "X Phase", 0.000);
                        setProp(fx, "Y Rand Amp", 0.00);
                        setProp(fx, "Y Rand Freq", 1.230);
                        setProp(fx, "Y Wave Amp", 65.00);
                        setProp(fx, "Y Wave Freq", 0.900);
                        setProp(fx, "Y Phase", 0.000);
                        setProp(fx, "Z Rand Amp", 0.00);
                        setProp(fx, "Z Rand Freq", 1.000);
                        setProp(fx, "Z Wave Amp", 0.00);
                        setProp(fx, "Z Wave Freq", 0.500);
                        setProp(fx, "Z Phase", 0.000);
                        setExp(prop(fx, "Dissolve Percent"), 16.00, 0.5, duration);
                    }
                }
                else if (presetId === 'fast-shake-8') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.000);
                        setProp(fx, "Amplitude", 1.600);
                        setProp(fx, "Frequency", 10.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.500);
                        setProp(fx, "Seed", 0.000);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Rand Amp", 0.00);
                        setProp(fx, "X Rand Freq", 1.000);
                        setProp(fx, "X Wave Amp", 199.00);
                        setProp(fx, "X Wave Freq", 0.790);
                        setProp(fx, "X Phase", 0.000);
                        setProp(fx, "Y Rand Amp", 36.00);
                        setProp(fx, "Y Rand Freq", 1.000);
                        setProp(fx, "Y Wave Amp", 27.00);
                        setProp(fx, "Y Wave Freq", 0.960);
                        setProp(fx, "Y Phase", 0.000);
                        setProp(fx, "Z Rand Amp", 0.00);
                        setProp(fx, "Z Rand Freq", 1.000);
                        setProp(fx, "Z Wave Amp", 0.00);
                        setProp(fx, "Z Wave Freq", 0.500);
                        setProp(fx, "Z Phase", 0.000);
                        setExp(prop(fx, "Dissolve Percent"), 20.00, 0.6, duration);
                    }
                }
                else if (presetId === 'fast-shake-9') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.700);
                        setProp(fx, "Amplitude", 2.000); 
                        setProp(fx, "Frequency", 8.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 79.00);
                        setProp(fx, "X Wave Freq", 0.570);
                        setProp(fx, "Y Wave Amp", 35.00);
                        setProp(fx, "Y Wave Freq", 1.150);
                        setExp(prop(fx, "Dissolve Percent"), 22.00, 2.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-10') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.300);
                        setProp(fx, "Amplitude", 3.300);
                        setProp(fx, "Frequency", 9.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 65.00);
                        setProp(fx, "X Wave Freq", 1.050);
                        setProp(fx, "Y Wave Amp", 40.00);
                        setProp(fx, "Y Wave Freq", 1.230);
                        setExpExpo(prop(fx, "Dissolve Percent"), 18.00, 0.4, duration); 
                    }
                }
                else if (presetId === 'fast-shake-11') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.600);
                        setProp(fx, "Amplitude", 3.100);
                        setProp(fx, "Frequency", 13.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.900);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 106.00);
                        setProp(fx, "X Wave Freq", 0.520);
                        setProp(fx, "Y Wave Amp", 65.00);
                        setProp(fx, "Y Wave Freq", 0.610);
                        setExp(prop(fx, "Dissolve Percent"), 21.00, 1.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-12') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.100);
                        setProp(fx, "Amplitude", 3.100);
                        setProp(fx, "Frequency", 12.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.900);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 63.00);
                        setProp(fx, "X Wave Freq", 0.670);
                        setProp(fx, "Y Wave Amp", 54.00);
                        setProp(fx, "Y Wave Freq", 0.820);
                        setExp(prop(fx, "Dissolve Percent"), 20.00, 1.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-13') {
                    fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 7.00);
                        setProp(fx, "Phase", 0.000);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.200);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 94.00);
                        setProp(fx, "X Wave Freq", 0.750);
                        setProp(fx, "Y Wave Amp", 44.00);
                        setProp(fx, "Y Wave Freq", 0.770);
                        setExp(prop(fx, "Amplitude"), 2.000, 1.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-14') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.200);
                        setProp(fx, "Amplitude", 2.900);
                        setProp(fx, "Frequency", 9.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.000);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 110.00);
                        setProp(fx, "X Wave Freq", 0.620);
                        setProp(fx, "Y Wave Amp", 72.00);
                        setProp(fx, "Y Wave Freq", 0.870);
                        setExp(prop(fx, "Dissolve Percent"), 18.00, 1.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-15') {
                    fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Transition Dir", 1);
                        setProp(fx, "Dissolve Speed", 2.800);
                        setProp(fx, "Amplitude", 3.100);
                        setProp(fx, "Frequency", 11.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.000);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "X Wave Amp", 119.00);
                        setProp(fx, "X Wave Freq", 0.610);
                        setProp(fx, "Y Wave Amp", 75.00);
                        setProp(fx, "Y Wave Freq", 0.740);
                        setExp(prop(fx, "Dissolve Percent"), 20.00, 1.0, duration);
                    }
                }
                if (!fx) anyFxMissing = true;
            }
                if (anyFxMissing) {
                    cleanupLayers();
                    app.endUndoGroup();
                    return "ERROR_FX_MISSING";
                }
            } catch (e) {
                cleanupLayers();
                app.endUndoGroup();
                return "ERROR_SCRIPT: " + (e.message || e);
            }

            app.endUndoGroup();
            return 'SUCCESS';
        })();`;

        csInterface.evalScript(script, function(result) {
            setTimeout(function() {
                if (window.refreshNeonCursor) window.refreshNeonCursor();
            }, 50);
            if (window.hideLoadingBar) window.hideLoadingBar(result === "SUCCESS");
            if (result === "SUCCESS") {
                if (window.showSuccess) window.showSuccess("Shake applied successfully!");
            } else if (result === "ERROR_NO_COMP") {
                if (window.showError) window.showError("Open a composition first!");
            } else if (result === "ERROR_NO_LAYER") {
                if (window.showError) window.showError("Please select a layer first!");
            } else if (result === "ERROR_FX_MISSING") {
                if (window.showError) window.showError("Sapphire plugin not found!");
            } else if (result === "EvalScript error.") {
                if (window.showError) window.showError("Script Error.");
            } else if (String(result).indexOf("ERROR_SCRIPT") === 0) {
                if (window.showError) window.showError("Script error: " + String(result).replace("ERROR_SCRIPT: ", ""));
            } else {
                if (window.showError) window.showError("Error: " + result);
            }
        });
    };
})();