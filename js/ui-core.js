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
            version: "v0.2.0 Beta",
            close: "Done",
            placeholderName: "My Custom Shake",
            cancelBtn: "Cancel",
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
            tipTune: "Customize this shake",
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
            tipSapphire: "Shows whether Sapphire is installed",
            tipCustomPresets: "Create your own shake",
            tipMyPresets: "Open your saved presets",
            tuneTitle: "Shake Settings",
            tuneStrength: "Strength",
            tuneSpeed: "Speed",
            tuneBlur: "Motion Blur",
            tuneReset: "Reset",
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
            themeGrim: "Grim Dark",
            themeFrost: "Frost White",
            themeSunset: "Sunset",
            themeCosmos: "Cosmos",
            themeVolt: "Volt",
            // Custom Presets
            createShakeTitle: "Create Shake",
            myPresetsTitle: "My Presets",
            savePreset: "Save Preset",
            presetName: "Preset Name",
            amplitude: "Amplitude (Strength)",
            frequency: "Frequency (Speed)",
            duration: "Duration (Frames)",
            tags: "Tags",
            preview: "Preview",
            previewTitle: "Shake Preview",
            previewPlaceholder: "Select a shake...",
            applyBtn: "Apply",
            deleteBtn: "Delete",
            exportAll: "Export",
            importFile: "Import File",
            noPresets: "No custom presets yet.",
            presetSaved: "Preset saved!",
            presetApplied: "Preset applied!",
            framesShort: "frames",
            saveSelected: "Save Selected",
            // Индикатор Sapphire
            sapphireChecking: "Sapphire: checking...",
            sapphireActive: "Sapphire: active",
            sapphireMissing: "Sapphire: not found",
            sapphireNoAE: "Sapphire: AE only",
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
            version: "v0.2.0 Beta",
            close: "Готово",
            placeholderName: "Мой кастомный шейк",
            cancelBtn: "Отмена",
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
            tipTune: "Настроить этот шейк",
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
            tipSapphire: "Показывает, установлен ли Sapphire",
            tipCustomPresets: "Создать свой шейк",
            tipMyPresets: "Открыть сохраненные пресеты",
            tuneTitle: "Настройки шейка",
            tuneStrength: "Сила",
            tuneSpeed: "Скорость",
            tuneBlur: "Motion Blur",
            tuneReset: "Сбросить",
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
            themeGrim: "Мрачная",
            themeFrost: "Белый неон",
            themeSunset: "Закат",
            themeCosmos: "Космос",
            themeVolt: "Вольт",
            // Custom Presets
            createShakeTitle: "Создать Шейк",
            myPresetsTitle: "Мои Пресеты",
            savePreset: "Сохранить Пресет",
            presetName: "Название пресета",
            amplitude: "Амплитуда (Сила)",
            frequency: "Частота (Скорость)",
            duration: "Длительность (Кадры)",
            tags: "Теги",
            preview: "Превью",
            previewTitle: "Превью шейка",
            previewPlaceholder: "Выбери шейк...",
            applyBtn: "Применить",
            deleteBtn: "Удалить",
            exportAll: "Экспорт",
            importFile: "Импорт",
            noPresets: "Пока нет кастомных пресетов.",
            presetSaved: "Пресет сохранен!",
            presetApplied: "Пресет применен!",
            framesShort: "кадров",
            saveSelected: "Сохранить выбранные",
            // Индикатор Sapphire
            sapphireChecking: "Sapphire: проверка...",
            sapphireActive: "Sapphire: активен",
            sapphireMissing: "Sapphire: не найден",
            sapphireNoAE: "Sapphire: только в AE",
        }
    };

    (function() {
        var probe = document.createElement('div');
        probe.style.cssText = 'display:flex;gap:10px;position:absolute;visibility:hidden;width:0;height:0';
        var a = document.createElement('div');
        var b = document.createElement('div');
        a.style.width = '1px';
        b.style.width = '1px';
        probe.appendChild(a);
        probe.appendChild(b);
        document.body.appendChild(probe);
        var supported = (b.getBoundingClientRect().left - a.getBoundingClientRect().right) >= 9;
        document.body.removeChild(probe);
        if (!supported) document.body.classList.add('no-flex-gap');
    })();

    window.translations = translations;

    window.applyLanguage = function(lang) {
        const validLang = translations[lang] ? lang : 'en';
        const t = translations[validLang];
        window.currentLang = validLang;
        document.documentElement.lang = validLang;
        
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
        safeSet('github-link', t.github);
        safeSet('secret-xote', t.xote);
        const xoteEl = document.getElementById('secret-xote');
        if (xoteEl) xoteEl.setAttribute('data-text', t.xote);
        safeSet('text-version', t.version);

        document.querySelectorAll('.settings-title[data-i18n]').forEach(function(el) {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerText = t[key];
        });

        safeSet('text-custom-cursor', t.customCursor);
        safeSet('text-custom-cursor-2', t.customCursor);
        safeSet('text-enable-cursor', t.enableCursor);
        safeSet('text-enable-cursor-2', t.enableCursor);
        safeSet('text-cursor-glow', t.cursorGlow);
        safeSet('text-cursor-glow-2', t.cursorGlow);
        safeSet('text-show-glow', t.showGlow);
        safeSet('text-show-glow-2', t.showGlow);
        safeSet('text-adjust-cursor', t.adjustCursor);

        document.querySelectorAll('.cursor-style-option span[data-i18n]').forEach(function(el) {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerText = t[key];
        });

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

        const tuneCloseBtn = document.getElementById('tune-close');
        if (tuneCloseBtn) tuneCloseBtn.innerText = t.close;

        safeSet('tune-title', t.tuneTitle);
        safeSet('tune-label-strength', t.tuneStrength);
        safeSet('tune-label-speed', t.tuneSpeed);
        safeSet('tune-label-blur', t.tuneBlur);
        safeSet('tune-reset', t.tuneReset);

        // Панели
        safeSet('text-how-to-use', t.howToUse);
        safeSet('text-favorites', t.favoritesTitle);
        safeSet('text-preview-title', t.previewTitle);

        const previewTitleEl = document.getElementById('preview-title');
        if (previewTitleEl && !previewTitleEl.classList.contains('has-shake')) {
            previewTitleEl.innerText = t.previewPlaceholder;
        }

        if (window.updateSapphireLabel) window.updateSapphireLabel();
        
        // Названия тем
        const themeNames = document.querySelectorAll('.theme-name');
        if (themeNames.length >= 12) {
            themeNames[0].innerText = t.themeClassic;
            themeNames[1].innerText = t.themeGold;
            themeNames[2].innerText = t.themeBlue;
            themeNames[3].innerText = t.themeRed;
            themeNames[4].innerText = t.themeGreen;
            themeNames[5].innerText = t.themePurple;
            themeNames[6].innerText = t.themePink;
            themeNames[7].innerText = t.themeGrim;
            themeNames[8].innerText = t.themeFrost;
            themeNames[9].innerText = t.themeSunset;
            themeNames[10].innerText = t.themeCosmos;
            themeNames[11].innerText = t.themeVolt;
        }

        safeSet('text-custom-presets-title', t.createShakeTitle);
        safeSet('text-my-presets-title', t.myPresetsTitle);
        safeSet('cp-export-btn', t.exportAll);
        safeSet('cp-import-btn', t.importFile);
        safeSet('cp-confirm-export-btn', t.saveSelected);
        safeSet('close-custom-presets', t.close);
        safeSet('close-my-presets', t.close);

        document.querySelectorAll('.cp-card-btn.apply').forEach(function(btn) { btn.innerText = t.applyBtn; });
        document.querySelectorAll('.cp-card-btn.delete').forEach(function(btn) { btn.innerText = t.deleteBtn; });

        const cpNameInput = document.getElementById('cp-name');
        if (cpNameInput) cpNameInput.placeholder = t.placeholderName;

        const cpSaveBtn = document.getElementById('cp-save-btn');
        if (cpSaveBtn) {
            const span = cpSaveBtn.querySelector('.random-text');
            if (span) span.innerText = t.savePreset;
        }

        const favList = document.getElementById('favorites-list');
        const favEmpty = favList && favList.querySelector('[data-empty-favorites]');
        if (favEmpty) favEmpty.innerText = t.emptyFavorites;

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
    let loadingShowTimer = null, loadingHideTimer = null, loadingResetTimer = null;

    window.showLoadingBar = function() {
        const barContainer = document.getElementById('loading-bar-container');
        const barFill = document.getElementById('loading-bar-fill');
        if (!barContainer || !barFill) return;
        
        if (loadingShowTimer) clearTimeout(loadingShowTimer);
        if (loadingHideTimer) clearTimeout(loadingHideTimer);
        if (loadingResetTimer) clearTimeout(loadingResetTimer);

        barContainer.classList.add('active');
        barFill.style.transition = 'none'; 
        barFill.style.width = '0%';
        barFill.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
        barFill.style.boxShadow = '0 0 10px var(--primary)';
        
        loadingShowTimer = setTimeout(() => {
            loadingShowTimer = null;
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

        if (loadingShowTimer) clearTimeout(loadingShowTimer);
        if (loadingHideTimer) clearTimeout(loadingHideTimer);
        if (loadingResetTimer) clearTimeout(loadingResetTimer);

        loadingHideTimer = setTimeout(() => {
            loadingHideTimer = null;
            barContainer.classList.remove('active');
            loadingResetTimer = setTimeout(() => {
                loadingResetTimer = null;
                barFill.style.width = '0%';
            }, 300);
        }, 500);
    };

    let errorToastTimer = null, successToastTimer = null;

    window.showError = function(msg) {
        var toast = document.getElementById('error-toast');
        if (toast) {
            if (errorToastTimer) clearTimeout(errorToastTimer);
            toast.innerText = msg;
            toast.classList.add('show');
            errorToastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2500);
        }
    };

    window.showSuccess = function(msg) {
        var toast = document.getElementById('success-toast');
        if (toast) {
            if (successToastTimer) clearTimeout(successToastTimer);
            toast.innerText = msg;
            toast.classList.add('show');
            successToastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2500);
        }
    };

    const globalCursor = document.getElementById('custom-cursor');
    const globalGlow = document.getElementById('mouse-glow');
    const rawCursorSize = Number(localStorage.getItem('shakePackCursorSize'));
    const globalSavedSize = isFinite(rawCursorSize) ? Math.max(50, Math.min(150, rawCursorSize)) : 100;
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

        let lastMouseX = 0, lastMouseY = 0;

        document.addEventListener('mousemove', (e) => {
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
            customCursor.style.opacity = '1';
        });

        window.refreshNeonCursor = function() {
            if (!customCursor || document.body.classList.contains('system-cursor')) return;

            document.body.classList.add('system-cursor');
            void document.body.offsetWidth;

            setTimeout(function() {
                document.body.classList.remove('system-cursor');
                document.body.style.cursor = 'none';
                void document.body.offsetWidth;

                customCursor.style.display = 'none';
                void customCursor.offsetWidth;
                customCursor.style.display = 'block';
                customCursor.style.left = lastMouseX + 'px';
                customCursor.style.top = lastMouseY + 'px';

                document.dispatchEvent(new MouseEvent('mousemove', {
                    clientX: lastMouseX,
                    clientY: lastMouseY,
                    bubbles: true
                }));
            }, 30);
        };

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('button, input, .theme-toggle, .theme-option, .fav-star, .preview-btn, .tune-btn, .lang-btn, .random-btn, .shake-btn, .category-btn, .toggle-switch, .cursor-style-option, .scale-option, .slider-thumb, #sapphire-status')) {
                customCursor.classList.add('hover-active');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const sel = 'button, input, .theme-toggle, .theme-option, .fav-star, .preview-btn, .tune-btn, .lang-btn, .random-btn, .shake-btn, .category-btn, .toggle-switch, .cursor-style-option, .scale-option, .slider-thumb, #sapphire-status';
            const from = e.target.closest(sel);
            const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(sel) : null;
            if (from && from === to) return;
            if (from) customCursor.classList.remove('hover-active');
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
            if (e.target.closest('.shake-btn, .category-btn, .random-btn, #secret-xote, .theme-toggle, .theme-option, .close-btn, .fav-star, .preview-btn, .tune-btn, .lang-btn, #sapphire-status')) {
                mouseGlow.classList.add('active');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const sel = '.shake-btn, .category-btn, .random-btn, #secret-xote, .theme-toggle, .theme-option, .close-btn, .fav-star, .preview-btn, .tune-btn, .lang-btn, #sapphire-status';
            const from = e.target.closest(sel);
            const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(sel) : null;
            if (from && from === to) return;
            if (from) mouseGlow.classList.remove('active');
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

            if (target.closest('.tune-btn')) text = t.tipTune;
            else if (target.closest('.preview-btn')) text = t.tipPreview;
            else if (target.closest('.fav-star')) {
                text = target.closest('.fav-star').classList.contains('active') ? t.tipRemFav : t.tipAddFav;
            }
            else if (target.closest('.shake-btn')) text = t.tipApply;
            else if (target.closest('.category-btn')) text = t.tipCategory;
            else if (target.closest('#theme-toggle')) text = t.tipTheme;
            else if (target.closest('#favorites-toggle')) text = t.tipFavorites;
            else if (target.closest('#help-toggle')) text = t.tipHelp;
            else if (target.closest('#settings-toggle')) text = t.tipSettings;
            else if (target.closest('#custom-presets-toggle')) text = t.tipCustomPresets;
            else if (target.closest('#custom-presets-list-toggle')) text = t.tipMyPresets;
            else if (target.closest('#random-shake-btn')) text = t.tipRandom;
            else if (target.closest('#apply-all-btn')) text = t.tipApplyAll;
            else if (target.closest('#sapphire-status')) text = t.tipSapphire;
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
            if (e.target.closest('.shake-btn') || e.target.closest('.category-btn') || e.target.closest('.random-btn') || e.target.closest('.preview-btn') || e.target.closest('.fav-star') || e.target.closest('.tune-btn') || e.target.closest('.theme-toggle') || e.target.closest('#favorites-toggle') || e.target.closest('#help-toggle') || e.target.closest('#settings-toggle') || e.target.closest('#custom-presets-toggle') || e.target.closest('#custom-presets-list-toggle') || e.target.closest('#sapphire-status')) {
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
        const buttons = Array.prototype.filter.call(
            document.querySelectorAll('.shake-btn, .category-btn, .random-btn, .theme-toggle, .theme-option, .close-btn, .lang-btn'),
            function(btn) { return !btn.closest('#favorites-list'); }
        );
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return;
                if (e.target.closest('#favorites-list')) return;
                if (e.target.closest('.tune-btn')) return;
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

        settingsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                settingsTabs.forEach(t => t.classList.remove('active'));
                settingsContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const targetId = 'tab-' + tab.getAttribute('data-tab');
                const targetContent = document.getElementById(targetId);
                if (targetContent) targetContent.classList.add('active');
            });
        });

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

        const cursorSliders = document.querySelectorAll('.cursor-slider');
        const cursorTexts = document.querySelectorAll('.cursor-size-text');
        const customCursor = document.getElementById('custom-cursor');
        const mouseGlow = document.getElementById('mouse-glow');

        const savedCursorSize = globalSavedSize;
        
        function applyCursorSize(size) {
            if (!customCursor) return;
            const numericSize = isFinite(Number(size)) ? Math.max(50, Math.min(150, Number(size))) : 100;
            const scaleFactor = numericSize / 100;
            customCursor.style.setProperty('--cursor-scale', scaleFactor);
            
            if (mouseGlow) {
                const glowSize = 80 * scaleFactor;
                mouseGlow.style.width = glowSize + 'px';
                mouseGlow.style.height = glowSize + 'px';
            }

            cursorSliders.forEach(slider => slider.value = numericSize);
            cursorTexts.forEach(txt => txt.innerText = numericSize);
        }
        
        applyCursorSize(savedCursorSize);

        cursorSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const val = e.target.value;
                applyCursorSize(val);
                localStorage.setItem('shakePackCursorSize', val);
            });
        });

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

        updateLangUI(savedLang);

        if (optLangEn) {
            optLangEn.addEventListener('click', () => {
                localStorage.setItem('shakePackLang', 'en');
                window.applyLanguage('en');
                updateLangUI('en');
            });
        }

        if (optLangRu) {
            optLangRu.addEventListener('click', () => {
                localStorage.setItem('shakePackLang', 'ru');
                window.applyLanguage('ru');
                updateLangUI('ru');
            });
        }
    }
    // --- УПРАВЛЕНИЕ ПАНЕЛЯМИ ПРЕСЕТОВ ---
    const cpToggle = document.getElementById('custom-presets-toggle');
    const cpListToggle = document.getElementById('custom-presets-list-toggle');
    const cpPanel = document.getElementById('custom-presets-panel');
    const cpClose = document.getElementById('close-custom-presets');
    const myPresetsPanel = document.getElementById('my-presets-panel');
    const myPresetsClose = document.getElementById('close-my-presets');

    if (cpToggle && cpPanel) {
        cpToggle.addEventListener('click', () => cpPanel.classList.add('active'));
    }
    if (cpClose) {
        cpClose.addEventListener('click', () => cpPanel.classList.remove('active'));
    }

    if (cpListToggle && myPresetsPanel) {
        cpListToggle.addEventListener('click', () => myPresetsPanel.classList.add('active'));
    }
    if (myPresetsClose) {
        myPresetsClose.addEventListener('click', () => myPresetsPanel.classList.remove('active'));
    }

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
                var sapphire = document.getElementById('sapphire-status');
                if (sapphire) {
                    sapphire.style.cursor = '';
                    sapphire.querySelectorAll('*').forEach(function(n) { n.style.cursor = ''; });
                }
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