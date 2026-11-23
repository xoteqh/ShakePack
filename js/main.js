/**
 * main.js
 */

document.addEventListener('DOMContentLoaded', function() {
    
    if (!window.allShakes || !window.allShakes.length || !window.shakeParams) {
        console.error("Presets not loaded! Check js/presets.js");
        return;
    }

    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.shake-btn');
        if (btn) {
            if (e.target.closest('.fav-star') || e.target.closest('.preview-btn') || e.target.closest('.tune-btn')) return;
            if (e.target.closest('#favorites-list')) return;

            var id = btn.id;
            if (window.allShakes.includes(id) && typeof window.applyPreset === 'function') {
                window.applyPreset(id);
            }
        }
    });

    function shakeNameById(id) {
        var btn = document.getElementById(id);
        var title = btn && btn.querySelector('.btn-title');
        return title ? title.innerText : id;
    }

    function runSlotMachine(finalId, onDone) {
        var btn = document.getElementById('random-shake-btn');
        var span = btn && btn.querySelector('.random-text');
        if (!btn || !span) { onDone(); return; }
        if (btn.dataset.slots === 'true') return;

        btn.dataset.slots = 'true';
        var originalText = span.innerText;
        var steps = [];
        for (var i = 0; i < 9; i++) {
            steps.push(window.allShakes[Math.floor(Math.random() * window.allShakes.length)]);
        }
        steps.push(finalId);

        btn.classList.add('slot-machine');
        var index = 0;
        var timers = [];
        btn._slotTimers = timers;

        if (!window._slotCleanupBound) {
            window._slotCleanupBound = true;
            window.addEventListener('beforeunload', function() {
                document.querySelectorAll('.random-btn').forEach(function(b) {
                    if (b._slotTimers) b._slotTimers.forEach(clearTimeout);
                });
            });
        }

        function later(fn, delay) {
            timers.push(setTimeout(fn, delay));
        }

        function tick() {
            if (index < steps.length) {
                span.innerText = shakeNameById(steps[index]);
                index++;
                later(tick, index < steps.length ? 55 + index * 14 : 0);
            } else {
                try {
                    onDone();
                } catch (e) {
                    console.error('applyPreset failed:', e);
                }
                btn.classList.remove('slot-machine');

                later(function() {
                    span.classList.add('slot-fade');
                    later(function() {
                        var lang = localStorage.getItem('shakePackLang') || 'en';
                        var tr = window.translations && window.translations[lang];
                        span.innerText = tr && tr.random ? tr.random : originalText;
                        span.classList.remove('slot-fade');
                        btn.dataset.slots = 'false';
                        btn._slotTimers = null;
                    }, 320);
                }, 3000);
            }
        }
        tick();
    }

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
                var finalId = window.allShakes[randomIndex];
                runSlotMachine(finalId, function() {
                    if (typeof window.applyPreset === 'function') window.applyPreset(finalId);
                });
            }

            var self = this;
            if (self.clickTimeout) clearTimeout(self.clickTimeout);
            self.classList.remove('clicked');
            void self.offsetWidth;
            self.classList.add('clicked');
            self.clickTimeout = setTimeout(function() { self.classList.remove('clicked'); }, 320);
        });
    });

    const shakeBtns = document.querySelectorAll('.shake-btn');
    shakeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (e.target.closest('.tune-btn')) return;
            this.classList.remove('stagger-in');
            this.style.animationDelay = '';
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
    if (window.updateSapphireLabel) window.updateSapphireLabel();

    document.querySelectorAll('.theme-toggle[tabindex]').forEach(function(el) {
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });

    console.log("Shake Pack initialized successfully! 🚀");
});