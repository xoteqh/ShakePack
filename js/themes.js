/**
 * themes.js
 * Логика переключения цветовых тем и обновления фоновых частиц.
 */

(function() {
    // Конфигурации частиц для всех тем (цвета подхватываются из CSS, но мы задаем базовые)
    const particleConfigs = {
        default: { particles: { number: { value: 30 }, color: { value: "#00ffcc" }, size: { value: 3 }, move: { speed: 1.5 } } },
        gold:    { particles: { number: { value: 30 }, color: { value: "#ffcc00" }, size: { value: 3 }, move: { speed: 1.5 } } },
        blue:    { particles: { number: { value: 30 }, color: { value: "#00ccff" }, size: { value: 3 }, move: { speed: 1.5 } } },
        red:     { particles: { number: { value: 30 }, color: { value: "#ff0033" }, size: { value: 3 }, move: { speed: 1.5 } } },
        green:   { particles: { number: { value: 30 }, color: { value: "#00ff88" }, size: { value: 3 }, move: { speed: 1.5 } } },
        purple:  { particles: { number: { value: 30 }, color: { value: "#aa55ff" }, size: { value: 3 }, move: { speed: 1.5 } } }
    };

    // Инициализация частиц при загрузке
    document.addEventListener('DOMContentLoaded', () => {
        const savedTheme = localStorage.getItem('shakePackTheme') || 'default';
        
        // Применяем сохраненную тему к body
        document.body.className = 'theme-' + savedTheme;

        // Запускаем частицы с небольшой задержкой, чтобы CSS успел примениться
        setTimeout(() => {
            if (typeof particlesJS !== 'undefined') {
                const initialConfig = particleConfigs[savedTheme] || particleConfigs.default;
                particlesJS("particles-js", initialConfig);
            }
        }, 50);
    });

    // Логика переключения тем
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('theme-toggle');
        const themePanel = document.getElementById('theme-panel');
        const closeTheme = document.getElementById('close-theme');
        const themeOptions = document.querySelectorAll('.theme-option');

        if (themeToggle && themePanel) {
            themeToggle.addEventListener('click', () => themePanel.classList.add('active'));
            if (closeTheme) closeTheme.addEventListener('click', () => themePanel.classList.remove('active'));
        }

        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Визуальное выделение
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                const theme = option.getAttribute('data-theme');

                // Меняем класс у body
                document.body.className = document.body.className.replace(/theme-\w+/g, '');
                document.body.classList.add(`theme-${theme}`);

                // Обновляем частицы
                if (typeof particlesJS !== 'undefined') {
                    particlesJS("particles-js", particleConfigs[theme] || particleConfigs.default);
                }

                // Сохраняем в память
                localStorage.setItem('shakePackTheme', theme);
                
                // Автоматически закрываем панель
                if (themePanel) themePanel.classList.remove('active');
            });
        });
    });
})();