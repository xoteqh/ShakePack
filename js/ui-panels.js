/**
 * ui-panels.js
 * Логика работы с панелями: справка, превью, переключение языков и аккордеоны (папки).
 */

(function() {
    // --- 1. ПАНЕЛЬ СПРАВКИ И ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ ---
    const helpToggle = document.getElementById('help-toggle');
    const helpPanel = document.getElementById('help-panel');
    const closeHelp = document.getElementById('close-help');
    
    const btnRu = document.getElementById('btn-lang-ru');
    const btnEn = document.getElementById('btn-lang-en');
    const textRu = document.getElementById('help-text-ru');
    const textEn = document.getElementById('help-text-en');

    if (helpToggle && helpPanel) {
        helpToggle.addEventListener('click', () => helpPanel.classList.add('active'));
        if (closeHelp) closeHelp.addEventListener('click', () => helpPanel.classList.remove('active'));

        if (btnRu && btnEn && textRu && textEn) {
            btnRu.addEventListener('click', () => {
                btnRu.classList.add('active');
                btnEn.classList.remove('active');
                textRu.style.display = 'block';
                textEn.style.display = 'none';
            });

            btnEn.addEventListener('click', () => {
                btnEn.classList.add('active');
                btnRu.classList.remove('active');
                textEn.style.display = 'block';
                textRu.style.display = 'none';
            });
        }
    }

    // --- 2. ПАНЕЛЬ ПРЕВЬЮ (ВИЗУАЛЬНЫЙ ТЕСТ ШЕЙКА) ---
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

    // Глобальная функция для запуска превью (вызывается из favorites.js или из карточек)
    window.showPreview = function(shakeId, shakeName) {
        if (!previewPanel || !previewTitle || !previewLayer) return;

        previewPanel.classList.add('active');
        previewTitle.innerText = shakeName;
        
        // Берем реальные параметры из presets.js (window.shakeParams)
        const params = (window.shakeParams && window.shakeParams[shakeId]) || { freq: 5, amp: 2 };
        
        const duration = 2.0; 
        const maxAmp = params.amp * 6; 
        const animName = 'shake_' + shakeId.replace(/-/g, '_');

        let keyframes = '';
        const steps = 20;
        
        for (let i = 0; i <= steps; i++) {
            const progress = (i / steps) * 0.8; 
            const percent = progress * 100;
            const currentAmp = maxAmp * Math.exp(-3 * progress);
            
            const offsetX = (Math.random() - 0.5) * currentAmp;
            const offsetY = (Math.random() - 0.5) * currentAmp;
            const rotate = (Math.random() - 0.5) * currentAmp * 0.1;

            keyframes += `
                ${percent}% { 
                    transform: translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg); 
                }
            `;
        }

        keyframes += `
            80% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        `;

        const css = `
            @keyframes ${animName} {
                ${keyframes}
            }
        `;

        const oldStyle = document.getElementById('dynamic-shake-style');
        if (oldStyle) oldStyle.remove();

        const styleSheet = document.createElement("style");
        styleSheet.id = 'dynamic-shake-style';
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        previewLayer.style.animation = 'none';
        void previewLayer.offsetWidth; 
        previewLayer.style.animation = `${animName} ${duration}s linear infinite`;
    };

    // --- 3. АККОРДЕОНЫ (ПАПКИ С ШЕЙКАМИ) ---
    // Заменяем старую функцию toggleCategory на более плавную и защищенную от двойных кликов
    window.toggleCategory = function(id, btn) {
        var content = document.getElementById(id);
        var category = btn.parentElement;
        
        if (category.dataset.animating === "true") return;
        category.dataset.animating = "true";

        if (category.classList.contains('open')) {
            var currentHeight = content.getBoundingClientRect().height;
            content.style.maxHeight = currentHeight + "px";
            content.offsetHeight; // Трюк для перерисовки
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