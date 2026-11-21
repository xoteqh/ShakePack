/**
 * shake-preview.js
 */

(function() {
    window.shakeCurves = {
        'soft-shake-1': { fx: 'S_Shake', frames: 19, type: 'power', a: 0.5 },
        'soft-shake-2': { fx: 'S_DissolveShake', frames: 19, type: 'power', a: 0.7 },
        'soft-shake-3': { fx: 'S_DissolveShake', frames: 19, type: 'power', a: 0.4 },
        'soft-shake-4': { fx: 'S_Shake', frames: 22, type: 'power', a: 0.3 },
        'soft-shake-5': { fx: 'S_Shake', frames: 22, type: 'power', a: 0.3 },
        'soft-shake-6': { fx: 'S_Shake', frames: 22, type: 'expo', a: 1.5 },
        'soft-shake-7': { fx: 'S_Shake', frames: 22, type: 'expo', a: 1.2 },
        'soft-shake-8': { fx: 'S_Shake', frames: 22, type: 'expo', a: 1.5 },
        'soft-shake-9': { fx: 'S_DissolveShake', frames: 22, type: 'smooth' },
        'soft-shake-10': { fx: 'S_DissolveShake', frames: 22, type: 'smooth' },
        'soft-shake-11': { fx: 'S_DissolveShake', frames: 22, type: 'smooth' },
        'soft-shake-12': { fx: 'S_DissolveShake', frames: 22, type: 'smooth' },
        'soft-shake-13': { fx: 'S_Shake', frames: 22, type: 'smooth' },
        'soft-shake-14': { fx: 'S_Shake', frames: 22, type: 'smooth' },
        'soft-shake-15': { fx: 'S_DissolveShake', frames: 22, type: 'smooth' },
        'hard-shake-1': { fx: 'S_DissolveShake', frames: 19, type: 'power', a: 0.3 },
        'hard-shake-2': { fx: 'S_Shake', frames: 19, type: 'power', a: 0.2 },
        'hard-shake-3': { fx: 'S_DissolveShake', frames: 19, type: 'power', a: 0.3 },
        'hard-shake-4': { fx: 'S_DissolveShake', frames: 19, type: 'power', a: 0.3 },
        'hard-shake-5': { fx: 'S_Shake', frames: 19, type: 'power', a: 1 },
        'hard-shake-6': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1 },
        'hard-shake-7': { fx: 'S_Shake', frames: 19, type: 'expo', a: 1.5 },
        'hard-shake-8': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1.5 },
        'hard-shake-9': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1.5 },
        'hard-shake-10': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1.2 },
        'hard-shake-11': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'hard-shake-12': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'hard-shake-13': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'hard-shake-14': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'hard-shake-15': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'dirty-shake-1': { fx: 'S_DissolveShake', frames: 19, type: 'power', a: 0.3 },
        'dirty-shake-2': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 2 },
        'dirty-shake-3': { fx: 'S_DissolveShake', frames: 19, type: 'power', a: 0.2 },
        'dirty-shake-4': { fx: 'S_DissolveShake', frames: 19, type: 'power', a: 0.15 },
        'dirty-shake-5': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 0.6 },
        'dirty-shake-6': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1.5 },
        'dirty-shake-7': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1.5 },
        'dirty-shake-8': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1.5 },
        'dirty-shake-9': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1 },
        'dirty-shake-10': { fx: 'S_DissolveShake', frames: 19, type: 'expo', a: 1.5 },
        'dirty-shake-11': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'dirty-shake-12': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'dirty-shake-13': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'dirty-shake-14': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'dirty-shake-15': { fx: 'S_DissolveShake', frames: 19, type: 'smooth' },
        'fast-shake-1': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 0.25 },
        'fast-shake-2': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 0.4 },
        'fast-shake-3': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 4 },
        'fast-shake-4': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 4 },
        'fast-shake-5': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 4 },
        'fast-shake-6': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 4 },
        'fast-shake-7': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 0.5 },
        'fast-shake-8': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 0.6 },
        'fast-shake-9': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 2 },
        'fast-shake-10': { fx: 'S_DissolveShake', frames: 8, type: 'expo', a: 0.4 },
        'fast-shake-11': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 1 },
        'fast-shake-12': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 1 },
        'fast-shake-13': { fx: 'S_Shake', frames: 8, type: 'power', a: 1 },
        'fast-shake-14': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 1 },
        'fast-shake-15': { fx: 'S_DissolveShake', frames: 8, type: 'power', a: 1 }
    };

    window.shakeEnvelope = function(t, curve) {
        t = Math.max(0, Math.min(1, Number(t) || 0));
        curve = curve || {};
        if (curve.type === 'smooth') {
            return 1 - (t * t * (3 - 2 * t));
        }
        if (curve.type === 'power') {
            var p = typeof curve.a === 'number' ? curve.a : 0.5;
            return 1 - Math.pow(t, p);
        }
        var d = typeof curve.a === 'number' ? curve.a : 1.5;
        return Math.exp(-d * t * 3) * (1 - Math.pow(t, 10));
    };

    window.getShakePreviewInfo = function(id) {
        var params = (window.shakeParams && window.shakeParams[id]) || { freq: 5, amp: 2 };
        var meta = (window.shakeCurves && window.shakeCurves[id]) ||
            { fx: 'S_Shake', frames: 19, type: 'expo', a: 1.5 };
        return {
            freq: params.freq,
            amp: params.amp,
            frames: meta.frames,
            fx: meta.fx,
            curve: { type: meta.type, a: meta.a },
            duration: meta.frames / 12
        };
    };

    function wave(t, freq, seed) {
        return Math.sin(2 * Math.PI * freq * t + seed) * 0.72 +
               Math.sin(2 * Math.PI * freq * 0.37 * t + seed * 1.7) * 0.28;
    }

    window.buildPreviewKeyframes = function(info) {
        info = info || window.getShakePreviewInfo('');
        var freq = info.freq || 5;
        var amp = (info.amp || 2) * 5;
        var duration = info.duration || (info.frames || 19) / 12;
        var steps = Math.min(240, Math.max(48, Math.ceil(freq * duration * 8)));
        var css = '';

        for (var i = 0; i <= steps; i++) {
            var p = i / steps;
            var t = p * duration;
            var env = window.shakeEnvelope(p, info.curve);
            var x = wave(t, freq, 0.4) * amp * env;
            var y = wave(t, freq * 0.83, 2.1) * amp * env;
            var r = wave(t, freq * 0.5, 4.2) * (info.amp || 2) * 0.4 * env;
            css += (p * 100).toFixed(2) + '% { transform: translate(' +
                   x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px) rotate(' +
                   r.toFixed(2) + 'deg); } ';
        }
        css += '100% { transform: translate(0, 0) rotate(0deg); }';
        return css;
    };

    window.shakeSparkSVG = function(idOrInfo, extraClass) {
        var info = (typeof idOrInfo === 'string') ? window.getShakePreviewInfo(idOrInfo) : idOrInfo;
        if (!info) info = { curve: { type: 'expo', a: 1.5 } };

        var W = 120, H = 20, N = 48;
        var pts = [], area = ['0,' + H];
        for (var i = 0; i <= N; i++) {
            var p = i / N;
            var e = window.shakeEnvelope(p, info.curve);
            var px = (p * W).toFixed(1);
            var py = (H - 2 - e * (H - 4)).toFixed(1);
            pts.push(px + ',' + py);
            area.push(px + ',' + py);
        }
        area.push(W + ',' + H);

        return '<svg class="shake-spark' + (extraClass ? ' ' + extraClass : '') +
               '" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
               '<polygon points="' + area.join(' ') + '" fill="currentColor" opacity="0.12"></polygon>' +
               '<polyline points="' + pts.join(' ') + '" fill="none" stroke="currentColor" ' +
               'stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>' +
               '</svg>';
    };
})();
