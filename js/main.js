/**
 * main.js
 */

document.addEventListener('DOMContentLoaded', function() {
    
    if (!window.allShakes || !window.shakeParams) {
        console.error("Presets not loaded! Check js/presets.js");
        return;
    }

    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.shake-btn');
        if (btn) {
            if (e.target.closest('.fav-star') || e.target.closest('.preview-btn')) return;
            if (e.target.closest('#favorites-list')) return;

            var id = btn.id;
            if (window.allShakes.includes(id) && typeof window.applyPreset === 'function') {
                window.applyPreset(id);
            }
        }
    });

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

    document.querySelectorAll('.category').forEach(function(category) {
        var count = category.querySelectorAll('.shake-btn').length;
        var countSpan = category.querySelector('.category-btn .count');
        if (countSpan) {
            countSpan.textContent = count;
        }
    });

    function isInsideAE() {
        return typeof __adobe_cep__ !== 'undefined' ||
               navigator.userAgent.indexOf("AdobeScript") >= 0;
    }

    window.updateSapphireLabel = function() {
        var el = document.getElementById('sapphire-status');
        var label = document.getElementById('sapphire-status-label');
        if (!el || !label) return;
        var lang = window.currentLang || localStorage.getItem('shakePackLang') || 'en';
        var t = (window.translations && window.translations[lang]) || {};
        var state = window.sapphireStatus || 'checking';
        var texts = {
            checking: t.sapphireChecking,
            ok: t.sapphireActive,
            missing: t.sapphireMissing,
            noae: t.sapphireNoAE
        };
        label.innerText = texts[state] || state;

        if (!document.body.classList.contains('system-cursor')) {
            el.style.cursor = 'none';
            var kids = el.querySelectorAll('*');
            for (var i = 0; i < kids.length; i++) kids[i].style.cursor = 'none';
        }
    };

    window.setSapphireStatus = function(state) {
        window.sapphireStatus = state;
        var el = document.getElementById('sapphire-status');
        if (!el) return;
        el.classList.remove('checking', 'ok', 'missing', 'noae');
        el.classList.add(state);
        window.updateSapphireLabel();
    };

    function checkSapphire() {
        if (!isInsideAE() || typeof CSInterface === 'undefined') {
            window.setSapphireStatus('noae');
            return;
        }
        window.setSapphireStatus('checking');

        var script = `(function() {
            try {
                var effects = app.effects;
                var hasShake = false, hasDissolve = false;
                for (var i = 0; i < effects.length; i++) {
                    var name = (effects[i].matchName || '') + '|' + (effects[i].displayName || '');
                    if (name.indexOf('S_Shake') >= 0) hasShake = true;
                    if (name.indexOf('S_DissolveShake') >= 0) hasDissolve = true;
                }
                return (hasShake && hasDissolve) ? 'SAPPHIRE_OK' : 'SAPPHIRE_MISSING';
            } catch (e) {
                return 'SAPPHIRE_MISSING';
            }
        })();`;

        var csInterface = new CSInterface();
        csInterface.evalScript(script, function(result) {
            window.setSapphireStatus(result === 'SAPPHIRE_OK' ? 'ok' : 'missing');
        });
    }

    checkSapphire();

    console.log("Shake Pack initialized successfully! 🚀");
});