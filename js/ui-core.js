/**
 * ui-core.js
 * Базовые визуальные эффекты интерфейса: курсор, тултипы, свечение, частицы.
 */

(function() {
    // --- СЛОВАРЬ ПЕРЕВОДОВ ---
    const translations = {
        en: {
            selectTheme: "Select Theme",
            settings: "Settings",
            tabGeneral: "General",
            tabInterface: "Interface",
            tabCursor: "Cursor",
            tabLanguage: "Language",
            random: "RANDOM SHAKE",
            applyAll: "APPLY TO ALL SELECTED",
            catSoft: "Soft & Smooth",
            catHard: "Hard & Punchy",
            catDirty: "Dirty & Rough",
            catFast: "Fast Shakes",
            github: "github",
            xote: "xote",
            version: "v0.0.3 Alpha",
            close: "Done",
            // Настройки
            interfaceScale: "Interface Scale",
            cursorSize: "Cursor Size",
            cursorEffects: "Cursor Effects",
            customCursor: "Custom Cursor",
            cursorGlow: "Cursor Glow",
            cursorStyle: "Cursor Style",
            enableCursor: "Enable the neon cursor",
            showGlow: "Show glow behind cursor",
            adjustCursor: "Adjust the size of the custom neon cursor.",
            cursorCircle: "Circle",
            cursorDiamond: "Diamond",
            cursorSquare: "Square",
            // Тултипы
            tipPreview: "Click to see preview",
            tipAddFav: "Add to favorites",
            tipRemFav: "Remove from favorites",
            tipApply: "Click to apply to timeline (select a layer first)",
            tipCategory: "Click to view shakes",
            tipTheme: "Change UI Theme",
            tipFavorites: "Open Favorites",
            tipHelp: "How to use",
            tipSettings: "Settings",
            tipRandom: "Surprise me! Apply a random shake",
            tipApplyAll: "Apply random shake to ALL selected layers",
            // Панели
            howToUse: "How to use",
            favoritesTitle: "Favorite Shakes",
            emptyFavorites: "No favorites yet. Click ⭐ on any shake!",
            // Темы
            themeClassic: "Neon Classic",
            themeGold: "Golden Glow",
            themeBlue: "Deep Blue",
            themeRed: "Crimson Fire",
            themeGreen: "Neon Green",
            themePurple: "Neon Purple",
            themePink: "Pink Glow",
            themeGrim: "Grim Dark"
        },
        ru: {
            selectTheme: "Выбрать Тему",
            settings: "Настройки",
            tabGeneral: "Основное",
            tabInterface: "Интерфейс",
            tabCursor: "Курсор",
            tabLanguage: "Язык",
            random: "СЛУЧАЙНЫЙ ШЕЙК",
            applyAll: "ПРИМЕНИТЬ КО ВСЕМ",
            catSoft: "Мягкие и плавные",
            catHard: "Жесткие и мощные",
            catDirty: "Грязные и грубые",
            catFast: "Быстрые шейки",
            github: "github",
            xote: "xote",
            version: "v0.0.3 Alpha",
            close: "Готово",
            // Настройки
            interfaceScale: "Масштаб интерфейса",
            cursorSize: "Размер курсора",
            cursorEffects: "Эффекты курсора",
            customCursor: "Свой курсор",
            cursorGlow: "Свечение курсора",
            cursorStyle: "Стиль курсора",
            enableCursor: "Включить неоновый курсор",
            showGlow: "Показывать свечение за курсором",
            adjustCursor: "Настройте размер кастомного неонового курсора.",
            cursorCircle: "Круг",
            cursorDiamond: "Алмаз",
            cursorSquare: "Квадрат",
            // Тултипы
            tipPreview: "Нажми, чтобы посмотреть превью",
            tipAddFav: "Добавить в избранное",
            tipRemFav: "Удалить из избранного",
            tipApply: "Нажми, чтобы применить (сначала выдели слой)",
            tipCategory: "Нажми, чтобы открыть папку",
            tipTheme: "Сменить тему",
            tipFavorites: "Открыть избранное",
            tipHelp: "Как пользоваться",
            tipSettings: "Настройки",
            tipRandom: "Удиви меня! Применить случайный шейк",
            tipApplyAll: "Применить шейки ко всем выделенным слоям",
            // Панели
            howToUse: "Как пользоваться",
            favoritesTitle: "Избранные шейки",
            emptyFavorites: "Пока нет избранных шейков. Нажми ⭐ на любом шейке!",
            // Темы
            themeClassic: "Неоновый классический",
            themeGold: "Золотое свечение",
            themeBlue: "Глубокий синий",
            themeRed: "Багровый огонь",
            themeGreen: "Неоновый зеленый",
            themePurple: "Неоновый фиолетовый",
            themePink: "Розовое свечение",
            themeGrim: "Мрачная"
        }
    };

    window.applyLanguage = function(lang) {
        const t = translations[lang] || translations.en;
        
        const safeSet = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text;
        };

        safeSet('text-select-theme', t.selectTheme);
        safeSet('text-settings', t.settings);
        safeSet('text-tab-general', t.tabGeneral);
        safeSet('text-tab-interface', t.tabInterface);
        safeSet('text-tab-cursor', t.tabCursor);
        safeSet('text-tab-language', t.tabLanguage);
        safeSet('text-random', t.random);
        safeSet('text-apply-all', t.applyAll);
        safeSet('text-cat-soft', t.catSoft);
        safeSet('text-cat-hard', t.catHard);
        safeSet('text-cat-dirty', t.catDirty);
        safeSet('text-cat-fast', t.catFast);
        safeSet('text-github', t.github);
        safeSet('text-xote', t.xote);
        safeSet('text-version', t.version);

        // Заголовки настроек
        const settingTitles = document.querySelectorAll('.settings-title');
        if (settingTitles.length >= 8) {
            settingTitles[0].innerText = t.interfaceScale; 
            settingTitles[1].innerText = t.cursorSize;
            settingTitles[2].innerText = t.cursorEffects;
            settingTitles[3].innerText = t.cursorStyle;
            settingTitles[4].innerText = t.interfaceScale; 
            settingTitles[5].innerText = t.cursorSize; 
            settingTitles[6].innerText = t.cursorEffects;
            settingTitles[7].innerText = t.cursorStyle;
        }

        // Описания под переключателями
        safeSet('text-custom-cursor', t.customCursor);
        safeSet('text-custom-cursor-2', t.customCursor);
        safeSet('text-enable-cursor', t.enableCursor);
        safeSet('text-enable-cursor-2', t.enableCursor);
        safeSet('text-cursor-glow', t.cursorGlow);
        safeSet('text-cursor-glow-2', t.cursorGlow);
        safeSet('text-show-glow', t.showGlow);
        safeSet('text-show-glow-2', t.showGlow);
        safeSet('text-adjust-cursor', t.adjustCursor);

        // Перевод стилей курсора
        const cursorLabels = document.querySelectorAll('.cursor-style-option span');
        if (cursorLabels.length >= 6) {
            cursorLabels[0].innerText = t.cursorCircle;
            cursorLabels[1].innerText = t.cursorDiamond;
            cursorLabels[2].innerText = t.cursorSquare;
            cursorLabels[3].innerText = t.cursorCircle; 
            cursorLabels[4].innerText = t.cursorDiamond;
            cursorLabels[5].innerText = t.cursorSquare;
        }

        // Кнопки закрытия
        const closeHelpBtn = document.getElementById('close-help');
        if (closeHelpBtn) closeHelpBtn.innerText = t.close;

        const closeSettingsBtn = document.getElementById('close-settings');
        if (closeSettingsBtn) closeSettingsBtn.innerText = t.close;

        const closeThemeBtn = document.getElementById('close-theme');
        if (closeThemeBtn) closeThemeBtn.innerText = t.close;

        const closeFavoritesBtn = document.getElementById('close-favorites');
        if (closeFavoritesBtn) closeFavoritesBtn.innerText = t.close;

        const closePreviewBtn = document.getElementById('close-preview');
        if (closePreviewBtn) closePreviewBtn.innerText = t.close;

        // Панели
        safeSet('text-how-to-use', t.howToUse);
        safeSet('text-favorites', t.favoritesTitle);
        
        // Названия тем
        const themeNames = document.querySelectorAll('.theme-name');
        if (themeNames.length >= 8) {
            themeNames[0].innerText = t.themeClassic;
            themeNames[1].innerText = t.themeGold;
            themeNames[2].innerText = t.themeBlue;
            themeNames[3].innerText = t.themeRed;
            themeNames[4].innerText = t.themeGreen;
            themeNames[5].innerText = t.themePurple;
            themeNames[6].innerText = t.themePink;
            themeNames[7].innerText = t.themeGrim;
        }

        // Текст в пустом избранном
        const favList = document.getElementById('favorites-list');
        if (favList && favList.innerHTML.includes('No favorites yet')) {
            favList.innerHTML = `<div style="text-align: center; color: #8e8e9c; font-size: 12px; margin-top: 20px;">${t.emptyFavorites}</div>`;
        }

        const helpRu = document.getElementById('help-text-ru');
        const helpEn = document.getElementById('help-text-en');
        if (helpRu && helpEn) {
            if (lang === 'ru') {
                helpRu.style.display = 'block';
                helpEn.style.display = 'none';
            } else {
                helpEn.style.display = 'block';
                helpRu.style.display = 'none';
            }
        }
    };

    // --- УПРАВЛЕНИЕ ПОЛОСОЙ ЗАГРУЗКИ ---
    window.showLoadingBar = function() {
        const barContainer = document.getElementById('loading-bar-container');
        const barFill = document.getElementById('loading-bar-fill');
        if (!barContainer || !barFill) return;
        
        barContainer.classList.add('active');
        barFill.style.transition = 'none'; 
        barFill.style.width = '0%';
        
        setTimeout(() => {
            barFill.style.transition = 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            barFill.style.width = '75%'; 
        }, 50);
    };

    window.hideLoadingBar = function(isSuccess) {
        const barContainer = document.getElementById('loading-bar-container');
        const barFill = document.getElementById('loading-bar-fill');
        if (!barContainer || !barFill) return;
        
        barFill.style.transition = 'width 0.2s ease-out';
        barFill.style.width = '100%';
        
        if (isSuccess === false) {
            barFill.style.background = '#ff3366';
            barFill.style.boxShadow = '0 0 10px #ff3366';
        } else {
            barFill.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
            barFill.style.boxShadow = '0 0 10px var(--primary)';
        }

        setTimeout(() => {
            barContainer.classList.remove('active');
            setTimeout(() => { barFill.style.width = '0%'; }, 300);
        }, 500);
    };

    // --- ГЛОБАЛЬНЫЕ УВЕДОМЛЕНИЯ ---
    window.showError = function(msg) {
        var toast = document.getElementById('error-toast');
        if (toast) {
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(function() { toast.classList.remove('show'); }, 2500);
        }
    };

    window.showSuccess = function(msg) {
        var toast = document.getElementById('success-toast');
        if (toast) {
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(function() { toast.classList.remove('show'); }, 2500);
        }
    };

    // --- 0. ГЛОБАЛЬНЫЙ ФИКС РАЗМЕРА КУРСОРА И СИСТЕМНОГО КУРСОРА ---
    const globalCursor = document.getElementById('custom-cursor');
    const globalGlow = document.getElementById('mouse-glow');
    const globalSavedSize = localStorage.getItem('shakePackCursorSize') || '100';
    const isCustomCursorEnabled = localStorage.getItem('shakePackCustomCursor') !== 'false';

    let savedCursorStyle = localStorage.getItem('shakePackCursorStyle') || 'circle';
    
    if (savedCursorStyle === 'arrow' || savedCursorStyle === 'triangle') {
        savedCursorStyle = 'circle';
        localStorage.setItem('shakePackCursorStyle', 'circle');
    }

    if (globalCursor) {
        globalCursor.classList.remove('style-circle', 'style-diamond', 'style-square');
        if (savedCursorStyle !== 'circle') {
            globalCursor.classList.add('style-' + savedCursorStyle);
        }
    }
    
    if (!isCustomCursorEnabled) {
        document.body.classList.add('system-cursor');
        if (globalCursor) globalCursor.style.display = 'none';
    }
    
    document.querySelectorAll('input[type="range"]').forEach(el => {
        el.style.cursor = isCustomCursorEnabled ? 'none' : 'pointer';
    });

    if (globalCursor) {
        const scaleFactor = globalSavedSize / 100;
        globalCursor.style.setProperty('--cursor-scale', scaleFactor);
        if (globalGlow) {
            globalGlow.style.width = (80 * scaleFactor) + 'px';
            globalGlow.style.height = (80 * scaleFactor) + 'px';
        }
    }

    // --- 1. КАСТОМНЫЙ НЕОНОВЫЙ КУРСОР ---
    const customCursor = document.getElementById('custom-cursor');
    
    if (customCursor) {
        document.body.style.cursor = 'none';

        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('button, input, .theme-toggle, .theme-option, .fav-star, .preview-btn, .lang-btn, .random-btn, .shake-btn, .category-btn, .toggle-switch, .cursor-style-option, .scale-option, .slider-thumb')) {
                customCursor.classList.add('hover-active');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('button, input, .theme-toggle, .theme-option, .fav-star, .preview-btn, .lang-btn, .random-btn, .shake-btn, .category-btn, .toggle-switch, .cursor-style-option, .scale-option, .slider-thumb')) {
                customCursor.classList.remove('hover-active');
            }
        });
        
        document.addEventListener('mousedown', () => {
            customCursor.style.setProperty('--click-scale', '0.8');
        });
        document.addEventListener('mouseup', () => {
            customCursor.style.setProperty('--click-scale', '1');
        });

        document.body.addEventListener('mouseleave', () => customCursor.classList.add('hidden'));
        document.body.addEventListener('mouseenter', () => customCursor.classList.remove('hidden'));
    }

    // --- 2. СВЕЧЕНИЕ ЗА КУРСОРОМ ---
    const mouseGlow = document.getElementById('mouse-glow');
    if (mouseGlow) {
        document.addEventListener('mousemove', (e) => {
            mouseGlow.style.left = e.clientX + 'px';
            mouseGlow.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.shake-btn, .category-btn, .random-btn, #secret-xote, .theme-toggle, .theme-option, .close-btn, .fav-star, .preview-btn, .lang-btn')) {
                mouseGlow.classList.add('active');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.shake-btn, .category-btn, .random-btn, #secret-xote, .theme-toggle, .theme-option, .close-btn, .fav-star, .preview-btn, .lang-btn')) {
                mouseGlow.classList.remove('active');
            }
        });
    }

    // --- 3. КАСТОМНЫЕ ПОДСКАЗКИ (ТУЛТИПЫ) ---
    const tooltip = document.getElementById('custom-tooltip');
    if (tooltip) {
        document.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.clientX + 'px';
            tooltip.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            const savedLang = localStorage.getItem('shakePackLang') || 'en';
            const t = translations[savedLang] || translations.en;
            let text = '';

            if (target.closest('.preview-btn')) text = t.tipPreview;
            else if (target.closest('.fav-star')) {
                text = target.closest('.fav-star').classList.contains('active') ? t.tipRemFav : t.tipAddFav;
            }
            else if (target.closest('.shake-btn')) text = t.tipApply;
            else if (target.closest('.category-btn')) text = t.tipCategory;
            else if (target.closest('#theme-toggle')) text = t.tipTheme;
            else if (target.closest('#favorites-toggle')) text = t.tipFavorites;
            else if (target.closest('#help-toggle')) text = t.tipHelp;
            else if (target.closest('#settings-toggle')) text = t.tipSettings;
            else if (target.closest('#random-shake-btn')) text = t.tipRandom;
            else if (target.closest('#apply-all-btn')) text = t.tipApplyAll;
            else return;

            tooltip.innerText = text;
            tooltip.classList.add('show');
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.fav-star')) {
                const star = e.target.closest('.fav-star');
                setTimeout(() => {
                    const savedLang = localStorage.getItem('shakePackLang') || 'en';
                    const t = translations[savedLang] || translations.en;
                    tooltip.innerText = star.classList.contains('active') ? t.tipRemFav : t.tipAddFav;
                }, 10);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.shake-btn') || e.target.closest('.category-btn') || e.target.closest('.random-btn') || e.target.closest('.theme-toggle') || e.target.closest('#favorites-toggle') || e.target.closest('#help-toggle') || e.target.closest('#settings-toggle')) {
                tooltip.classList.remove('show');
            }
        });
    }

    // --- 4. ЧАСТИЦЫ ПРИ КЛИКЕ ---
    function createParticles(e) {
        if (localStorage.getItem('shakePackCursorGlow') === 'false') return;

        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00ffcc';
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('click-particle');
            
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            particle.style.backgroundColor = primaryColor;
            particle.style.boxShadow = `0 0 10px ${primaryColor}`;

            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            particle.style.setProperty('--px', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--py', Math.sin(angle) * distance + 'px');

            const duration = 0.5 + Math.random() * 0.4;
            particle.style.animation = `particleFly ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), duration * 1000);
        }
    }

    window.createSparks = function(x, y, count) {
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'click-particle';
            spark.style.left = x + 'px';
            spark.style.top = y + 'px';
            spark.style.backgroundColor = 'var(--primary)';
            spark.style.boxShadow = '0 0 10px var(--primary)';
            spark.style.zIndex = '100000001';
            
            const angle = Math.random() * Math.PI * 2;
            const dist = 20 + Math.random() * 40;
            spark.style.setProperty('--px', Math.cos(angle) * dist + 'px');
            spark.style.setProperty('--py', Math.sin(angle) * dist + 'px');
            
            const dur = 0.3 + Math.random() * 0.3;
            spark.style.animation = `particleFly ${dur}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
            
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), dur * 1000);
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const buttons = document.querySelectorAll('.shake-btn:not(#favorites-list .shake-btn), .category-btn, .random-btn, .theme-toggle, .theme-option, .close-btn, .lang-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return;
                if (e.target.closest('#favorites-list')) return;
                createParticles(e);
            });
        });
    });

    // --- 5. ПАСХАЛКА ---
    const xoteBtn = document.getElementById('secret-xote');
    if (xoteBtn) {
        xoteBtn.addEventListener('click', function(e) {
            const colors = ['#00ffcc', '#ff00cc', '#ffffff', '#ff3366', '#00ccff', '#ffff00'];
            
            const clickX = e.clientX;
            const clickY = e.clientY;

            for (let i = 0; i < 15; i++) {
                const letter = document.createElement('span');
                letter.innerText = 'W';
                letter.className = 'secret-letter';
                
                letter.style.left = clickX + 'px';
                letter.style.top = clickY + 'px';
                
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                letter.style.color = randomColor;
                letter.style.textShadow = '0 0 10px ' + randomColor + ', 0 0 20px ' + randomColor;
                letter.style.setProperty('--x', (Math.random() - 0.5) * 400 + 'px');
                letter.style.setProperty('--y', (Math.random() - 0.5) * 400 - 100 + 'px');
                letter.style.setProperty('--r', (Math.random() - 0.5) * 720 + 'deg');
                document.body.appendChild(letter);
                setTimeout(() => letter.remove(), 1200);
            }
        });
    }

    // --- 6. НАСТРОЙКИ (ТАБЫ, МАСШТАБ, КУРСОР, ЯЗЫК) ---
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');
    
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-tab-content');

    if (settingsToggle && settingsPanel) {
        settingsToggle.addEventListener('click', () => settingsPanel.classList.add('active'));
        if (closeSettings) closeSettings.addEventListener('click', () => settingsPanel.classList.remove('active'));

        // Переключение вкладок
        settingsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                settingsTabs.forEach(t => t.classList.remove('active'));
                settingsContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const targetId = 'tab-' + tab.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            });
        });

        // ==========================================
        // ГЕНЕРАЦИЯ И СИНХРОНИЗАЦИЯ МАСШТАБА
        // ==========================================
        const scaleContainers = document.querySelectorAll('.scale-list-container');
        const mainContainer = document.querySelector('.container');
        const savedScale = localStorage.getItem('shakePackScale') || '1';
        
        const scales = [
            {v: '0.5', t: '50%'}, {v: '0.6', t: '60%'}, {v: '0.7', t: '70%'}, 
            {v: '0.8', t: '80%'}, {v: '0.9', t: '90%'}, {v: '1', t: '100%'}, 
            {v: '1.1', t: '110%'}, {v: '1.2', t: '120%'}, {v: '1.3', t: '130%'}, 
            {v: '1.4', t: '140%'}, {v: '1.5', t: '150%'}
        ];

        scaleContainers.forEach(container => {
            let html = '';
            scales.forEach(s => {
                const isActive = s.v === savedScale ? 'active' : '';
                html += `<div class="scale-option ${isActive}" data-scale="${s.v}"><span>${s.t}</span></div>`;
            });
            container.innerHTML = html;
        });

        function applyScale(scaleValue) {
            if (mainContainer) mainContainer.style.zoom = scaleValue;
            document.querySelectorAll('.scale-option').forEach(opt => {
                if (opt.getAttribute('data-scale') === scaleValue) opt.classList.add('active');
                else opt.classList.remove('active');
            });
        }
        
        applyScale(savedScale);

        document.querySelectorAll('.scale-option').forEach(opt => {
            opt.addEventListener('click', function() {
                const newScale = this.getAttribute('data-scale');
                applyScale(newScale);
                localStorage.setItem('shakePackScale', newScale);
            });
        });

        // ==========================================
        // ГЕНЕРАЦИЯ И СИНХРОНИЗАЦИЯ КУРСОРА (РАЗМЕР)
        // ==========================================
        const cursorSliders = document.querySelectorAll('.cursor-slider');
        const cursorTexts = document.querySelectorAll('.cursor-size-text');
        const customCursor = document.getElementById('custom-cursor');
        const mouseGlow = document.getElementById('mouse-glow');

        const savedCursorSize = localStorage.getItem('shakePackCursorSize') || '100';
        
        function applyCursorSize(size) {
            if (!customCursor) return;
            const scaleFactor = size / 100;
            customCursor.style.setProperty('--cursor-scale', scaleFactor);
            
            if (mouseGlow) {
                const glowSize = 80 * scaleFactor;
                mouseGlow.style.width = glowSize + 'px';
                mouseGlow.style.height = glowSize + 'px';
            }

            cursorSliders.forEach(slider => slider.value = size);
            cursorTexts.forEach(txt => txt.innerText = size);
        }
        
        applyCursorSize(savedCursorSize);

        cursorSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const val = e.target.value;
                applyCursorSize(val);
                localStorage.setItem('shakePackCursorSize', val);
            });
        });

        // ==========================================
        // ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА
        // ==========================================
        const savedLang = localStorage.getItem('shakePackLang') || 'en';
        window.applyLanguage(savedLang);

        const optLangEn = document.getElementById('lang-option-en');
        const optLangRu = document.getElementById('lang-option-ru');

        function updateLangUI(lang) {
            if (!optLangEn || !optLangRu) return;
            if (lang === 'ru') {
                optLangRu.classList.add('active');
                optLangEn.classList.remove('active');
            } else {
                optLangEn.classList.add('active');
                optLangRu.classList.remove('active');
            }
        }

        // Применяем визуальное выделение при загрузке
        updateLangUI(savedLang);

        // Обработчик клика для Английского
        if (optLangEn) {
            optLangEn.addEventListener('click', () => {
                window.applyLanguage('en');
                localStorage.setItem('shakePackLang', 'en');
                updateLangUI('en');
            });
        }

        // Обработчик клика для Русского
        if (optLangRu) {
            optLangRu.addEventListener('click', () => {
                window.applyLanguage('ru');
                localStorage.setItem('shakePackLang', 'ru');
                updateLangUI('ru');
            });
        }
    }

    // ==========================================
    // 7. НАСТРОЙКИ КУРСОРА (ВКЛ/ВЫКЛ И СТИЛИ)
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        const togglesCustom = document.querySelectorAll('#toggle-custom-cursor, #toggle-custom-cursor-general');
        const togglesGlow = document.querySelectorAll('#toggle-cursor-glow, #toggle-cursor-glow-general');
        const cursorEl = document.getElementById('custom-cursor');
        const glowEl = document.getElementById('mouse-glow');

        function applyCursorToggle(isEnabled) {
            if (!cursorEl) return;
            if (isEnabled) {
                cursorEl.style.display = 'block';
                document.body.classList.remove('system-cursor');
            } else {
                cursorEl.style.display = 'none';
                document.body.classList.add('system-cursor');
            }
            togglesCustom.forEach(t => {
                if (isEnabled) t.classList.add('active');
                else t.classList.remove('active');
            });
        }

        if (togglesCustom.length > 0) {
            if (isCustomCursorEnabled) applyCursorToggle(true);
            else applyCursorToggle(false);

            togglesCustom.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const isNowActive = !toggle.classList.contains('active');
                    applyCursorToggle(isNowActive);
                    localStorage.setItem('shakePackCustomCursor', isNowActive);
                });
            });
        }

        function applyGlowToggle(isEnabled) {
            if (!glowEl) return;
            if (isEnabled) glowEl.style.display = 'block';
            else glowEl.style.display = 'none';
            
            togglesGlow.forEach(t => {
                if (isEnabled) t.classList.add('active');
                else t.classList.remove('active');
            });
        }

        if (togglesGlow.length > 0) {
            const savedGlow = localStorage.getItem('shakePackCursorGlow') !== 'false';
            applyGlowToggle(savedGlow);

            togglesGlow.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const isNowActive = !toggle.classList.contains('active');
                    applyGlowToggle(isNowActive);
                    localStorage.setItem('shakePackCursorGlow', isNowActive);
                });
            });
        }

        const cursorStyleOptions = document.querySelectorAll('.cursor-style-option');
        
        cursorStyleOptions.forEach(opt => {
            if (opt.getAttribute('data-style') === savedCursorStyle) opt.classList.add('active');
            else opt.classList.remove('active');
        });

        cursorStyleOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                cursorStyleOptions.forEach(o => o.classList.remove('active'));
                
                const newStyle = opt.getAttribute('data-style');
                document.querySelectorAll(`.cursor-style-option[data-style="${newStyle}"]`).forEach(o => o.classList.add('active'));

                localStorage.setItem('shakePackCursorStyle', newStyle);

                if (cursorEl) {
                    cursorEl.classList.remove('style-circle', 'style-diamond', 'style-square');
                    if (newStyle !== 'circle') {
                        cursorEl.classList.add('style-' + newStyle);
                    }
                }
            });
        });
    });
})();