/**
 * shake-tuner.js
 */

(function() {
    const STORAGE_KEY = 'shakePackTune';
    let tuning = {};

    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) tuning = saved;
    } catch (e) {
        tuning = {};
    }

    function clamp(value) {
        const num = Number(value);
        if (!isFinite(num)) return 1;
        return Math.max(0.5, Math.min(3, num));
    }

    function readValue(id, key) {
        const entry = tuning[id];
        const raw = entry ? entry[key] : undefined;
        return (typeof raw === 'number' && isFinite(raw)) ? clamp(raw) : 1;
    }

    window.getShakeTuning = function(id) {
        return {
            strength: readValue(id, 'strength'),
            speed: readValue(id, 'speed'),
            blur: readValue(id, 'blur')
        };
    };

    function saveTuning() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tuning));
        } catch (e) {}
    }

    function isTuned(id) {
        return ['strength', 'speed', 'blur'].some(function(key) {
            return readValue(id, key) !== 1;
        });
    }

    function refreshMarkers() {
        document.querySelectorAll('.shake-btn[data-id]').forEach(function(btn) {
            btn.classList.toggle('tuned', isTuned(btn.getAttribute('data-id')));
        });
        Object.keys(tuning).forEach(function(id) {
            var original = document.getElementById(id);
            if (original) original.classList.toggle('tuned', isTuned(id));
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const panel = document.getElementById('tune-panel');
        const shakeNameEl = document.getElementById('tune-shake-name');
        const sliders = {
            strength: document.getElementById('tune-strength'),
            speed: document.getElementById('tune-speed'),
            blur: document.getElementById('tune-blur')
        };
        const valueEls = {
            strength: document.getElementById('tune-value-strength'),
            speed: document.getElementById('tune-value-speed'),
            blur: document.getElementById('tune-value-blur')
        };
        const closeBtn = document.getElementById('tune-close');
        const resetBtn = document.getElementById('tune-reset');

        let currentId = null;

        function renderValues() {
            Object.keys(sliders).forEach(function(key) {
                const value = readValue(currentId, key);
                if (sliders[key]) sliders[key].value = value;
                if (valueEls[key]) valueEls[key].innerText = value.toFixed(1);
            });
        }

        function closePanel() {
            if (!panel) return;
            panel.classList.remove('active');
            currentId = null;
        }

        function openPanel(id) {
            if (!panel) return;
            currentId = id;
            const btn = document.getElementById(id);
            const title = btn && btn.querySelector('.btn-title');
            if (shakeNameEl) shakeNameEl.innerText = title ? title.innerText : id;
            renderValues();
            panel.classList.add('active');
        }

        refreshMarkers();

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && panel && panel.classList.contains('active')) closePanel();
        });

        if (panel) {
            panel.addEventListener('click', function(e) {
                if (e.target === panel) closePanel();
            });
        }

        document.addEventListener('click', function(e) {
            const gear = e.target.closest('.tune-btn');
            if (!gear) return;
            e.preventDefault();
            e.stopPropagation();
            openPanel(gear.getAttribute('data-id'));
        });

        Object.keys(sliders).forEach(function(key) {
            const slider = sliders[key];
            if (!slider) return;
            slider.addEventListener('input', function(e) {
                if (!currentId) return;
                if (!tuning[currentId] || typeof tuning[currentId] !== 'object') tuning[currentId] = {};
                tuning[currentId][key] = clamp(e.target.value);
                if (valueEls[key]) valueEls[key].innerText = clamp(e.target.value).toFixed(1);
                saveTuning();
                refreshMarkers();
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (!currentId) return;
                tuning[currentId] = { strength: 1, speed: 1, blur: 1 };
                saveTuning();
                renderValues();
                refreshMarkers();
            });
        }

        if (closeBtn && panel) {
            closeBtn.addEventListener('click', closePanel);
        }
    });
})();
