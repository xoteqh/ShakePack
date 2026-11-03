/**
 * legacy-effects.js
 * Старый проверенный движок для применения шейков (с красными часиками).
 */

(function() {
    window.applyPreset = function(presetInput) {
        if (typeof CSInterface === 'undefined') return;
        var csInterface = new CSInterface();
        
        var isApplyAll = Array.isArray(presetInput);
        var presetArrayStr = isApplyAll ? JSON.stringify(presetInput) : JSON.stringify([presetInput]);
        var usePlayhead = !isApplyAll;

        // Создаем скрипт, который будет выполнен внутри After Effects
        var script = `(function() {
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) return "ERROR_NO_COMP";
            
            if (comp.selectedLayers.length === 0) return "ERROR_NO_LAYER";
            
            var presets = ${presetArrayStr};
            var isApplyAll = ${isApplyAll};
            var usePlayhead = ${usePlayhead};
            
            // Собираем только подходящие слои
            var targetLayers = [];
            for (var i = 0; i < comp.selectedLayers.length; i++) {
                var l = comp.selectedLayers[i];
                if (!l.nullLayer && !l.adjustmentLayer) {
                    targetLayers.push(l);
                }
            }
            
            if (targetLayers.length === 0) return "ERROR_BAD_LAYER";
            
            app.beginUndoGroup("Apply Shake Preset");
            
            var layersToProcess = isApplyAll ? targetLayers : [targetLayers[0]];
            
            function setProp(fx, name, value) {
                try { fx.property(name).setValue(value); } catch(e) {}
            }

            function setExp(prop, startVal, powerVal, duration) {
                try {
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              startVal + " * (1 - Math.pow(progress, " + powerVal + "));";
                    prop.expressionEnabled = true;
                    prop.expression = exp;
                } catch(e) {}
            }

            function setExpExpo(prop, startVal, decayRate, duration) {
                try {
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              startVal + " * Math.exp(-" + decayRate + " * progress * 3) * (1 - Math.pow(progress, 10));";
                    prop.expressionEnabled = true;
                    prop.expression = exp;
                } catch(e) {}
            }

            function setExpZDist(prop, startVal, endVal, powerVal, duration) {
                try {
                    var diff = startVal - endVal;
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              startVal + " - (" + diff + " * Math.pow(progress, " + powerVal + "));";
                    prop.expressionEnabled = true;
                    prop.expression = exp;
                } catch(e) {}
            }
            
            function setExpSmooth(prop, startVal, endVal, duration) {
                try {
                    var diff = startVal - endVal;
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              "var smoothProgress = progress * progress * (3 - 2 * progress);\\n" +
                              startVal + " - (" + diff + " * smoothProgress);";
                    prop.expressionEnabled = true;
                    prop.expression = exp;
                } catch(e) {}
            }
            
            for (var k = 0; k < layersToProcess.length; k++) {
                var targetLayer = layersToProcess[k];
                var presetId = isApplyAll ? presets[k % presets.length] : presets[0];

                var layerName = "SHAKE";
                var frames = 19; 
                
                // --- ТВОЙ СТАРЫЙ КОД С if/else ---
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

                var adjLayer = comp.layers.addSolid([1, 1, 1], layerName, comp.width, comp.height, comp.pixelAspect);
                adjLayer.adjustmentLayer = true;
                adjLayer.moveToBeginning(); 
                adjLayer.label = 10; 
                
                var duration = frames * comp.frameDuration; 
                var startTime = usePlayhead ? comp.time : targetLayer.inPoint;
                
                adjLayer.inPoint = startTime;
                adjLayer.outPoint = startTime + duration;
                
                // --- ТВОЙ СТАРЫЙ БЛОК if/else ДЛЯ ЭФФЕКТОВ ---
                if (presetId === 'soft-shake-1') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 4.70);
                        setProp(fx, "Phase", 3.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.26);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Amplitude"), 1.300, 0.5, duration);
                        setExpZDist(fx.property("Z Dist"), 1.100, 1.000, 0.5, duration);
                    }
                } 
                else if (presetId === 'soft-shake-2') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.000);
                        setProp(fx, "Amplitude", 2.600);
                        setProp(fx, "Frequency", 5.90);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.200);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 15.00, 0.7, duration);
                    }
                }
                else if (presetId === 'soft-shake-3') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.000);
                        setProp(fx, "Amplitude", 5.000);
                        setProp(fx, "Frequency", 5.90);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.200);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 7.00, 0.4, duration);
                    }
                }
                else if (presetId === 'soft-shake-4') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
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
                        setExp(fx.property("Amplitude"), 1.200, 0.3, duration);
                    }
                }
                else if (presetId === 'soft-shake-5') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
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
                        setExp(fx.property("Amplitude"), 1.300, 0.3, duration);
                    }
                }
                else if (presetId === 'soft-shake-6') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
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
                        setExpExpo(fx.property("Amplitude"), 2.300, 1.5, duration);
                    }
                }
                else if (presetId === 'soft-shake-7') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
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
                        setExpExpo(fx.property("Amplitude"), 1.000, 1.2, duration);
                    }
                }
                else if (presetId === 'soft-shake-8') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
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
                        setExpExpo(fx.property("Amplitude"), 1.600, 1.5, duration);
                    }
                }
                else if (presetId === 'soft-shake-9') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpSmooth(fx.property("Dissolve Percent"), 14.00, 0.00, duration);
                    }
                }
                else if (presetId === 'soft-shake-10') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpSmooth(fx.property("Dissolve Percent"), 13.00, 0.00, duration);
                    }
                }
                else if (presetId === 'hard-shake-1') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExp(fx.property("Dissolve Percent"), 12.00, 0.3, duration);
                        setExp(fx.property("Z Rand Amp"), 100.00, 0.3, duration);
                    }
                }
                else if (presetId === 'hard-shake-2') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
                    if (fx) {
                        setProp(fx, "Frequency", 4.70);
                        setProp(fx, "Phase", 3.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.26);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Amplitude"), 1.300, 0.2, duration);
                        setExpZDist(fx.property("Z Dist"), 1.100, 1.000, 0.2, duration);
                    }
                }
                else if (presetId === 'hard-shake-3') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExp(fx.property("Dissolve Percent"), 9.00, 0.3, duration);
                        setExp(fx.property("Z Rand Amp"), 300.00, 0.3, duration);
                    }
                }
                else if (presetId === 'hard-shake-4') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExp(fx.property("Dissolve Percent"), 18.00, 0.3, duration);
                    }
                }
                else if (presetId === 'hard-shake-5') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
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
                        setExp(fx.property("Amplitude"), 1.200, 1.0, duration);
                    }
                }
                else if (presetId === 'hard-shake-6') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 22.00, 1.0, duration);
                    }
                }
                else if (presetId === 'hard-shake-7') {
                    var fx = adjLayer.Effects.addProperty("S_Shake");
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
                        setExpExpo(fx.property("Amplitude"), 2.600, 1.5, duration);
                    }
                }
                else if (presetId === 'hard-shake-8') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 23.00, 1.5, duration);
                    }
                }
                else if (presetId === 'hard-shake-9') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 28.00, 1.5, duration);
                    }
                }
                else if (presetId === 'hard-shake-10') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 30.00, 1.2, duration);
                    }
                }
                else if (presetId === 'dirty-shake-1') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.400);
                        setProp(fx, "Frequency", 3.10);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 1.000);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setProp(fx, "Dissolve Percent", 24.00); 
                        setExp(fx.property("Amplitude"), 3.200, 0.3, duration); 
                    }
                }
                else if (presetId === 'dirty-shake-2') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.400);
                        setProp(fx, "Amplitude", 3.700); 
                        setProp(fx, "Frequency", 17.10);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.600);
                        setProp(fx, "Seed", 0.960);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExpExpo(fx.property("Dissolve Percent"), 31.00, 2.0, duration);
                    }
                }
                else if (presetId === 'dirty-shake-3') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.500);
                        setProp(fx, "Amplitude", 3.800); 
                        setProp(fx, "Frequency", 14.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Seed", 0.310);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 28.00, 0.2, duration); 
                    }
                }
                else if (presetId === 'dirty-shake-4') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.600);
                        setProp(fx, "Amplitude", 3.900);
                        setProp(fx, "Frequency", 17.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.700);
                        setProp(fx, "Seed", 0.450);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 29.00, 0.15, duration);
                    }
                }
                else if (presetId === 'dirty-shake-5') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 18.00, 0.6, duration);
                    }
                }
                else if (presetId === 'dirty-shake-6') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 22.00, 1.5, duration);
                    }
                }
                else if (presetId === 'dirty-shake-7') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 28.00, 1.5, duration);
                    }
                }
                else if (presetId === 'dirty-shake-8') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 25.00, 1.5, duration);
                    }
                }
                else if (presetId === 'dirty-shake-9') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 23.00, 1.0, duration);
                    }
                }
                else if (presetId === 'dirty-shake-10') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 28.00, 1.5, duration);
                    }
                }
                else if (presetId === 'fast-shake-1') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.400);
                        setProp(fx, "Amplitude", 2.600);
                        setProp(fx, "Frequency", 9.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.250);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 19.00, 0.25, duration);
                    }
                }
                else if (presetId === 'fast-shake-2') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.800);
                        setProp(fx, "Amplitude", 1.600);
                        setProp(fx, "Frequency", 23.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.380);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 30.00, 0.4, duration);
                    }
                }
                else if (presetId === 'fast-shake-3') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 2.000);
                        setProp(fx, "Amplitude", 0.600);
                        setProp(fx, "Frequency", 20.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.180);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 10.00, 4.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-4') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.000);
                        setProp(fx, "Amplitude", 1.000);
                        setProp(fx, "Frequency", 14.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.180);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 28.00, 4.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-5') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 3.200);
                        setProp(fx, "Amplitude", 1.300);
                        setProp(fx, "Frequency", 12.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.800);
                        setProp(fx, "Seed", 0.050);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 27.00, 4.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-6') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                    if (fx) {
                        setProp(fx, "Dissolve Speed", 7.000);
                        setProp(fx, "Amplitude", 2.500);
                        setProp(fx, "Frequency", 9.00);
                        setProp(fx, "Motion Blur", true);
                        setProp(fx, "Mo Blur Length", 0.500);
                        setProp(fx, "Seed", 0.480);
                        setProp(fx, "Wrap X", 3);
                        setProp(fx, "Wrap Y", 3);
                        setExp(fx.property("Dissolve Percent"), 15.00, 4.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-7') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExp(fx.property("Dissolve Percent"), 16.00, 0.5, duration);
                    }
                }
                else if (presetId === 'fast-shake-8') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExp(fx.property("Dissolve Percent"), 20.00, 0.6, duration);
                    }
                }
                else if (presetId === 'fast-shake-9') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExp(fx.property("Dissolve Percent"), 22.00, 2.0, duration);
                    }
                }
                else if (presetId === 'fast-shake-10') {
                    var fx = adjLayer.Effects.addProperty("S_DissolveShake");
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
                        setExpExpo(fx.property("Dissolve Percent"), 18.00, 0.4, duration); 
                    }
                }
            }
            
            app.endUndoGroup();
            return 'SUCCESS';
        })();`;

        csInterface.evalScript(script, function(result) {
            if (result === "SUCCESS") {
                if (window.showSuccess) window.showSuccess("Shake applied successfully!");
            } else if (result === "ERROR_NO_COMP") {
                if (window.showError) window.showError("Open a composition first!");
            } else if (result === "ERROR_NO_LAYER") {
                if (window.showError) window.showError("Please select a layer first!");
            } else if (result === "ERROR_BAD_LAYER") {
                if (window.showError) window.showError("Cannot shake a Null or Adjustment Layer!");
            } else if (result === "ERROR_FX_MISSING") {
                if (window.showError) window.showError("Sapphire plugin not found!");
            } else if (result === "EvalScript error.") {
                if (window.showError) window.showError("Script Error.");
            } else {
                // Если что-то пошло не так, покажем ошибку
                if (window.showError) window.showError("Error: " + result);
            }
        });
    };
})();