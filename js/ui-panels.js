/**
 * ui-panels.js
 */

(function() {
    // --- 1. ПАНЕЛЬ СПРАВКИ ---
    const helpToggle = document.getElementById('help-toggle');
    const helpPanel = document.getElementById('help-panel');
    const closeHelp = document.getElementById('close-help');

    if (helpToggle && helpPanel) {
        helpToggle.addEventListener('click', () => helpPanel.classList.add('active'));
        if (closeHelp) closeHelp.addEventListener('click', () => helpPanel.classList.remove('active'));
    }

    // --- 2. ПАНЕЛЬ ПРЕВЬЮ ---
    const previewPanel = document.getElementById('preview-panel');
    const closePreview = document.getElementById('close-preview');
    const previewLayer = document.getElementById('preview-layer');
    const previewTitle = document.getElementById('preview-title');

    if (closePreview && previewPanel) {
        closePreview.addEventListener('click', () => {
            previewPanel.classList.remove('active');
            if (previewLayer) previewLayer.style.animation = 'none';
        });
    }

    window.showPreview = function(shakeId, shakeName) {
        if (!previewPanel || !previewTitle || !previewLayer) return;

        previewPanel.classList.add('active');
        previewTitle.innerText = shakeName;

        const info = window.getShakePreviewInfo
            ? window.getShakePreviewInfo(shakeId)
            : { freq: 5, amp: 2, frames: 19, fx: 'S_Shake',
                curve: { type: 'expo', a: 1.5 }, duration: 1.58 };

        const paramsEl = document.getElementById('preview-params');
        if (paramsEl) {
            paramsEl.innerHTML = '<span>' + info.fx + '</span>' +
                '<span>Freq ' + info.freq + ' Hz</span>' +
                '<span>Amp ' + info.amp + '</span>' +
                '<span>' + info.frames + ' frames</span>' +
                '<span>AE ' + (info.frames / 24).toFixed(2) + ' s (x2 slow-mo)</span>';
        }

        const curveEl = document.getElementById('preview-curve');
        if (curveEl && window.shakeSparkSVG) {
            curveEl.innerHTML = window.shakeSparkSVG(info, 'shake-spark-large');
        }

        const animName = 'shake_' + shakeId.replace(/-/g, '_');
        const css = '@keyframes ' + animName + ' { ' +
            (window.buildPreviewKeyframes ? window.buildPreviewKeyframes(info) : '') + ' }';

        const oldStyle = document.getElementById('dynamic-shake-style');
        if (oldStyle) oldStyle.remove();

        const styleSheet = document.createElement("style");
        styleSheet.id = 'dynamic-shake-style';
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        previewLayer.style.animation = 'none';
        void previewLayer.offsetWidth;
        previewLayer.style.animation = animName + ' ' + info.duration.toFixed(2) + 's linear infinite';
    };

    // --- 3. АККОРДЕОНЫ ---
    window.toggleCategory = function(id, btn) {
        var content = document.getElementById(id);
        var category = btn.parentElement;
        
        if (category.dataset.animating === "true") return;
        category.dataset.animating = "true";

        if (category.classList.contains('open')) {
            var currentHeight = content.getBoundingClientRect().height;
            content.style.maxHeight = currentHeight + "px";
            content.offsetHeight;
            category.classList.remove('open');
            content.style.maxHeight = "0px";
            setTimeout(function() { category.dataset.animating = "false"; }, 600);
        } else {
            category.classList.add('open');
            content.style.maxHeight = content.scrollHeight + "px";
            setTimeout(function() {
                content.style.maxHeight = "none";
                category.dataset.animating = "false";
            }, 600); 
        }
    };
})();