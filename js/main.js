/**
 * main.js (внутри папки js)
 * Главный файл, который инициализирует все модули и связывает их.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Проверяем, загрузились ли базовые данные (presets.js)
    if (!window.allShakes || !window.shakeParams) {
        console.error("Presets not loaded! Check js/presets.js");
        return;
    }

    // 2. Инициализация кастомного курсора, тултипов, частиц и настроек (ui-core.js)
    // (Они инициализируются сами внутри своего файла при DOMContentLoaded, 
    // поэтому здесь нам не нужно ничего дополнительно вызывать)

    // 3. Инициализация панелей, справки и аккордеонов (ui-panels.js)
    // (Тоже инициализируются сами внутри себя)

    // 4. Инициализация тем и частиц (themes.js)
    // (Инициализируется сама)

    // 5. Инициализация избранного (favorites.js)
    // (Инициализируется само)

    // 6. Инициализация игры (game.js)
    // (Инициализируется само)

    // ==========================================
    // 7. ОБРАБОТКА КЛИКОВ НА КАРТОЧКИ ШЕЙКОВ
    // ==========================================
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.shake-btn');
        if (btn) {
            // Не применяем шейк, если кликнули по звезде или глазику
            if (e.target.closest('.fav-star') || e.target.closest('.preview-btn')) return;
            // Не применяем шейк, если мы внутри панели избранного (там своя логика)
            if (e.target.closest('#favorites-list')) return;

            var id = btn.id;
            if (window.allShakes.includes(id) && typeof window.applyPreset === 'function') {
                window.applyPreset(id);
            }
        }
    });

    // ==========================================
    // 8. КНОПКИ RANDOM SHAKE И APPLY ALL
    // ==========================================
    var actionButtons = document.querySelectorAll('#random-shake-btn, #apply-all-btn');
    
    actionButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (this.id === 'apply-all-btn') {
                var randomIds = [];
                for (var i = 0; i < 50; i++) {
                    var randomIndex = Math.floor(Math.random() * window.allShakes.length);
                    randomIds.push(window.allShakes[randomIndex]);
                }
                if (typeof window.applyPreset === 'function') window.applyPreset(randomIds); 
            } else {
                var randomIndex = Math.floor(Math.random() * window.allShakes.length);
                if (typeof window.applyPreset === 'function') window.applyPreset(window.allShakes[randomIndex]);
            }

            // Анимация нажатия
            this.classList.remove('clicked');
            void this.offsetWidth;
            this.classList.add('clicked');
        });

        btn.addEventListener('click', function() {
            if (this.timeoutId) clearTimeout(this.timeoutId);
            var self = this;
            this.timeoutId = setTimeout(function() { self.classList.remove('clicked'); }, 200); 
        });
    });

    // ==========================================
    // 9. АНИМАЦИЯ НАЖАТИЯ НА МАЛЕНЬКИЕ КАРТОЧКИ
    // ==========================================
    const shakeBtns = document.querySelectorAll('.shake-btn');
    shakeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.remove('clicked');
            void this.offsetWidth; 
            this.classList.add('clicked');
        });

        btn.addEventListener('animationend', function(e) {
            if (e.animationName === 'borderPulse') {
                this.classList.remove('clicked');
            }
        });
    });

    // ==========================================
    // 10. СЧЁТЧИК ШЕЙКОВ В ПАПКАХ
    // ==========================================
    document.querySelectorAll('.category').forEach(function(category) {
        var count = category.querySelectorAll('.shake-btn').length;
        var countSpan = category.querySelector('.category-btn .count');
        if (countSpan) {
            countSpan.textContent = count;
        }
    });

    console.log("Shake Pack initialized successfully! 🚀");
});