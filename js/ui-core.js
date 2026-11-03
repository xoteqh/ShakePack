/**
 * ui-core.js
 * Базовые визуальные эффекты интерфейса: курсор, тултипы, свечение, частицы.
 */

(function() {
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

    // Применяем сохраненный стиль курсора при загрузке
    let savedCursorStyle = localStorage.getItem('shakePackCursorStyle') || 'circle';
    
    // ФИКС: Если остался старый стиль (стрелка или треугольник), сбрасываем на круг
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
    
    // Если кастомный курсор выключен, сразу ставим системный класс
    if (!isCustomCursorEnabled) {
        document.body.classList.add('system-cursor');
        if (globalCursor) globalCursor.style.display = 'none';
    }
    // Принудительно прячем курсор у ползунков и инпутов, если включен кастомный
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

        // Умное отслеживание наведения на ЛЮБЫЕ кликабельные элементы
        document.addEventListener('mouseover', (e) => {
            // Если навели на кнопку, инпут, переключатель или элемент с data-style
            if (e.target.closest('button, input, .theme-toggle, .theme-option, .fav-star, .preview-btn, .lang-btn, .random-btn, .shake-btn, .category-btn, .toggle-switch, .cursor-style-option, .scale-option, .slider-thumb')) {
                customCursor.classList.add('hover-active');
            }
        });

        document.addEventListener('mouseout', (e) => {
            // Если увели с кликабельного элемента
            if (e.target.closest('button, input, .theme-toggle, .theme-option, .fav-star, .preview-btn, .lang-btn, .random-btn, .shake-btn, .category-btn, .toggle-switch, .cursor-style-option, .scale-option, .slider-thumb')) {
                customCursor.classList.remove('hover-active');
            }
        });
        
        // Эффект нажатия: уменьшаем через отдельную CSS-переменную
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
            let text = '';

            if (target.closest('.preview-btn')) text = 'Click to see preview';
            else if (target.closest('.fav-star')) {
                text = target.closest('.fav-star').classList.contains('active') ? 'Remove from favorites' : 'Add to favorites';
            }
            else if (target.closest('.shake-btn')) text = 'Click to apply to timeline (select a layer first)';
            else if (target.closest('.category-btn')) text = 'Click to view shakes';
            else if (target.closest('#theme-toggle')) text = 'Change UI Theme';
            else if (target.closest('#favorites-toggle')) text = 'Open Favorites';
            else if (target.closest('#help-toggle')) text = 'How to use';
            else if (target.closest('#settings-toggle')) text = 'Settings';
            else if (target.closest('#random-shake-btn')) text = 'Surprise me! Apply a random shake';
            else if (target.closest('#apply-all-btn')) text = 'Apply random shake to ALL selected layers';
            else return;

            tooltip.innerText = text;
            tooltip.classList.add('show');
        });
        // Обновляем текст тултипа при клике на звезду (не уводя курсор)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.fav-star')) {
                const star = e.target.closest('.fav-star');
                // Проверяем состояние ПОСЛЕ клика (с небольшой задержкой, чтобы класс успел обновиться)
                setTimeout(() => {
                    tooltip.innerText = star.classList.contains('active') ? 'Remove from favorites' : 'Add to favorites';
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
        // Проверяем, включен ли Glow, иначе частицы не создаем
        if (localStorage.getItem('shakePackCursorGlow') === 'false') return;

        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00ffcc';
        // ... дальше идет твой старый код
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
            for (let i = 0; i < 15; i++) {
                const letter = document.createElement('span');
                letter.innerText = 'W';
                letter.className = 'secret-letter';
                letter.style.left = e.pageX + 'px';
                letter.style.top = e.pageY + 'px';
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

    // --- 6. НАСТРОЙКИ (ТАБЫ, МАСШТАБ, КУРСОР) ---
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
            {v: '0.8', t: '80%'}, {v: '0.9', t: '90%'}, {v: '1', t: '100% (Default)'}, 
            {v: '1.1', t: '110%'}, {v: '1.2', t: '120%'}, {v: '1.3', t: '130%'}, 
            {v: '1.4', t: '140%'}, {v: '1.5', t: '150%'}
        ];

        // Генерируем кнопки в оба контейнера
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
    }

    // ==========================================
    // 7. НАСТРОЙКИ КУРСОРА (ВКЛ/ВЫКЛ И СТИЛИ)
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        const togglesCustom = document.querySelectorAll('#toggle-custom-cursor, #toggle-custom-cursor-general');
        const togglesGlow = document.querySelectorAll('#toggle-cursor-glow, #toggle-cursor-glow-general');
        const cursorEl = document.getElementById('custom-cursor');
        const glowEl = document.getElementById('mouse-glow');

        // --- 1. Логика кастомного курсора ---
        function applyCursorToggle(isEnabled) {
            if (!cursorEl) return;
            if (isEnabled) {
                cursorEl.style.display = 'block';
                document.body.classList.remove('system-cursor');
            } else {
                cursorEl.style.display = 'none';
                document.body.classList.add('system-cursor');
            }
            // Синхронизируем ВСЕ кнопки (и в General, и в Cursor)
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

        // --- 2. Логика свечения за курсором ---
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

        // --- 3. Логика стилей курсора ---
        const cursorStyleOptions = document.querySelectorAll('.cursor-style-option');
        
        cursorStyleOptions.forEach(opt => {
            if (opt.getAttribute('data-style') === savedCursorStyle) opt.classList.add('active');
            else opt.classList.remove('active');
        });

        cursorStyleOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                // Убираем активный класс у ВСЕХ кнопок во всех вкладках
                cursorStyleOptions.forEach(o => o.classList.remove('active'));
                
                // Добавляем активный класс ВСЕМ кнопкам с таким же data-style
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