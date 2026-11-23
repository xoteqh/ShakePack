/**
 * themes.js
 */

(function() {
    const particleConfigs = {
        default: { particles: { number: { value: 30 }, color: { value: "#00ffcc" }, size: { value: 3 }, move: { speed: 1.5 } } },
        gold:    { particles: { number: { value: 30 }, color: { value: "#ffcc00" }, size: { value: 3 }, move: { speed: 1.5 } } },
        blue:    { particles: { number: { value: 30 }, color: { value: "#00ccff" }, size: { value: 3 }, move: { speed: 1.5 } } },
        red:     { particles: { number: { value: 30 }, color: { value: "#ff0033" }, size: { value: 3 }, move: { speed: 1.5 } } },
        green:   { particles: { number: { value: 30 }, color: { value: "#00ff88" }, size: { value: 3 }, move: { speed: 1.5 } } },
        purple:  { particles: { number: { value: 30 }, color: { value: "#aa55ff" }, size: { value: 3 }, move: { speed: 1.5 } } },
        pink:    { particles: { number: { value: 30 }, color: { value: "#ff66b2" }, size: { value: 3 }, move: { speed: 1.5 } } },
        grim:    { particles: { number: { value: 30 }, color: { value: "#aaaaaa" }, size: { value: 3 }, move: { speed: 1.5 } } },
        frost:   { particles: { number: { value: 30 }, color: { value: "#B9EEFF" }, size: { value: 3 }, move: { speed: 1.5 } } },
        sunset:  { particles: { number: { value: 30 }, color: { value: "#FF7A45" }, size: { value: 3 }, move: { speed: 1.5 } } },
        cosmos:  { particles: { number: { value: 30 }, color: { value: "#5B6CFF" }, size: { value: 3 }, move: { speed: 1.5 } } },
        volt:    { particles: { number: { value: 30 }, color: { value: "#FFEA00" }, size: { value: 3 }, move: { speed: 1.5 } } }
    };

    const themeNames = Object.keys(particleConfigs);
    let initParticlesTimer = null;

    function setThemeClass(theme) {
        themeNames.forEach(function(name) {
            document.body.classList.remove('theme-' + name);
        });
        document.body.className = document.body.className.replace(/\s+/g, ' ').trim();
        document.body.classList.add('theme-' + (themeNames.indexOf(theme) >= 0 ? theme : 'default'));
    }

    document.addEventListener('DOMContentLoaded', () => {
        // --- 1. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ---
        const savedTheme = localStorage.getItem('shakePackTheme') || 'default';
        
        setThemeClass(savedTheme);

        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-theme') === savedTheme);
        });

        initParticlesTimer = setTimeout(() => {
            initParticlesTimer = null;
            if (typeof particlesJS !== 'undefined') {
                const initialConfig = particleConfigs[savedTheme] || particleConfigs.default;
                particlesJS("particles-js", initialConfig);
            }
        }, 50);

        // --- 2. ОТКРЫТИЕ ССЫЛКИ НА GITHUB ---
        const githubLink = document.getElementById('github-link');
        if (githubLink) {
            githubLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                const url = "https://github.com/xoteqh/ShakePack";
                const isCEP = typeof __adobe_cep__ !== 'undefined' ||
                              navigator.userAgent.indexOf("AdobeScript") >= 0;
                const canOpenNative = isCEP && window.cep &&
                    window.cep.util &&
                    typeof window.cep.util.openURLInDefaultBrowser === 'function';

                if (canOpenNative) {
                    window.cep.util.openURLInDefaultBrowser(url);
                } else {
                    window.open(url, "_blank");
                }
            });
        }

        // --- 3. ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМ ---
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
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                const theme = option.getAttribute('data-theme');

                if (initParticlesTimer) {
                    clearTimeout(initParticlesTimer);
                    initParticlesTimer = null;
                }

                setThemeClass(theme);

                if (typeof particlesJS !== 'undefined') {
                    particlesJS("particles-js", particleConfigs[theme] || particleConfigs.default);
                }

                localStorage.setItem('shakePackTheme', theme);
                
                if (themePanel) themePanel.classList.remove('active');
            });
        });
    });
})();