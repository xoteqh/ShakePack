/**
 * custom-presets.js
 * Логика кастомных пресетов: создание, сохранение, отрисовка, экспорт/импорт и применение в AE.
 */

(function() {
    let customPresets = JSON.parse(localStorage.getItem('shakePackCustomPresets') || '[]');
    const AVAILABLE_TAGS = ['#Fast', '#Smooth', '#Strong', '#Impact', '#Camera'];
    let selectedTags = [];

    // Переменные для режима экспорта
    let isExportMode = false;
    let selectedForExport = [];
    const MAX_EXPORT = 10;

    // Функция для получения переводов (берет из ui-core.js)
    function getT() {
        const lang = localStorage.getItem('shakePackLang') || 'en';
        if (window.translations && window.translations[lang]) {
            return window.translations[lang];
        }
        return { noPresets: "No custom presets yet.", framesShort: "frames", presetSaved: "Preset saved!" };
    }

    // --- 1. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ---
    document.addEventListener('DOMContentLoaded', () => {
        initSliders();
        initTags();
        renderPresetsList();
        initSaveBtn();
        initExportImport();
        initPreview();
    });

    // --- 2. ПОЛЗУНКИ (ОБНОВЛЕНИЕ ЦИФР) ---
    function initSliders() {
        const sliders = [
            { id: 'cp-amp', textId: 'cp-amp-text', fixed: 1 },
            { id: 'cp-freq', textId: 'cp-freq-text', fixed: 1 },
            { id: 'cp-frames', textId: 'cp-frames-text', fixed: 0 }
        ];

        sliders.forEach(s => {
            const el = document.getElementById(s.id);
            const textEl = document.getElementById(s.textId);
            if (el && textEl) {
                el.addEventListener('input', (e) => {
                    textEl.innerText = Number(e.target.value).toFixed(s.fixed);
                    updatePreview();
                });
            }
        });
    }

    // --- 3. ТЕГИ ---
    function initTags() {
        const container = document.getElementById('cp-tags-container');
        if (!container) return;

        container.innerHTML = '';
        AVAILABLE_TAGS.forEach(tag => {
            const btn = document.createElement('div');
            btn.className = 'cp-tag';
            btn.innerText = tag;
            btn.addEventListener('click', () => {
                if (selectedTags.includes(tag)) {
                    selectedTags = selectedTags.filter(t => t !== tag);
                    btn.classList.remove('active');
                } else {
                    if (selectedTags.length >= 3) return;
                    selectedTags.push(tag);
                    btn.classList.add('active');
                }
            });
            container.appendChild(btn);
        });
    }

    // --- 4. ЖИВОЕ ПРЕВЬЮ В КОНСТРУКТОРЕ ---
    function updatePreview() {
        const layer = document.getElementById('cp-preview-layer');
        const amp = parseFloat(document.getElementById('cp-amp').value) || 2;
        const freq = parseFloat(document.getElementById('cp-freq').value) || 5;
        
        if (!layer) return;

        const animName = 'cp_preview_shake';
        const maxAmp = amp * 5;
        const steps = 20;
        let keyframes = '';

        for (let i = 0; i <= steps; i++) {
            const progress = (i / steps) * 0.5;
            const percent = progress * 100;
            const currentAmp = maxAmp * Math.exp(-3 * progress);
            
            const offsetX = (Math.random() - 0.5) * currentAmp;
            const offsetY = (Math.random() - 0.5) * currentAmp;

            keyframes += `${percent}% { transform: translate(${offsetX}px, ${offsetY}px); }`;
        }
        keyframes += `50% { transform: translate(0, 0); } 100% { transform: translate(0, 0); }`;

        let styleSheet = document.getElementById('cp-dynamic-style');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'cp-dynamic-style';
            document.head.appendChild(styleSheet);
        }
        styleSheet.innerText = `@keyframes ${animName} { ${keyframes} }`;

        layer.style.animation = 'none';
        void layer.offsetWidth;
        
        const duration = Math.max(0.5, 20 / freq);
        layer.style.animation = `${animName} ${duration}s linear infinite`;
    }

    function initPreview() {
        const toggle = document.getElementById('custom-presets-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                setTimeout(updatePreview, 100);
            });
        }
    }

    // --- 5. СОХРАНЕНИЕ ПРЕСЕТА ---
    function initSaveBtn() {
        const btn = document.getElementById('cp-save-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const nameInput = document.getElementById('cp-name');
            const name = nameInput.value.trim() || 'Custom Shake';
            
            const amp = parseFloat(document.getElementById('cp-amp').value);
            const freq = parseFloat(document.getElementById('cp-freq').value);
            const frames = parseInt(document.getElementById('cp-frames').value);

            const newPreset = {
                id: 'custom-' + Date.now(),
                name: name,
                amp: amp,
                freq: freq,
                frames: frames,
                tags: [...selectedTags]
            };

            customPresets.push(newPreset);
            localStorage.setItem('shakePackCustomPresets', JSON.stringify(customPresets));

            nameInput.value = '';
            selectedTags = [];
            document.querySelectorAll('.cp-tag').forEach(t => t.classList.remove('active'));
            
            if (window.showSuccess) window.showSuccess(getT().presetSaved);
            if (window.applyLanguage) {
                const lang = localStorage.getItem('shakePackLang') || 'en';
                window.applyLanguage(lang);
            }
            renderPresetsList();
        });
    }

    // --- 6. ОТРИСОВКА СПИСКА MY PRESETS ---
    function renderPresetsList() {
        const list = document.getElementById('cp-list');
        if (!list) return;

        list.innerHTML = '';

        if (customPresets.length === 0) {
            const t = getT();
            list.innerHTML = `<div style="text-align: center; color: #8e8e9c; font-size: 12px; margin-top: 20px;">${t.noPresets}</div>`;
            return;
        }

        // Отрисовываем с конца
        [...customPresets].reverse().forEach(preset => {
            const card = document.createElement('div');
            card.className = 'cp-card';
            if (isExportMode) card.classList.add('exp-mode');
            
            const tagsHTML = preset.tags ? preset.tags.map(t => `<span class="cp-tag active" style="font-size: 10px; margin: 0; padding: 3px 8px; pointer-events: none;">${t}</span>`).join('') : '';
            
            // Если режим экспорта включен, добавляем кружочек
            const checkboxHTML = isExportMode 
                ? `<div class="cp-checkbox ${selectedForExport.includes(preset.id) ? 'selected' : ''}" data-id="${preset.id}"></div>` 
                : '';

            card.innerHTML = `
                <div class="cp-card-header" style="align-items: flex-start;">
                    <div style="display: flex; align-items: center; width: 100%;">
                        ${checkboxHTML}
                        <span class="cp-card-title" style="flex: 1; text-align: left;">${preset.name}</span>
                        <div style="font-size: 10px; color: #8e8e9c; margin-left: 5px;">${preset.frames} ${getT().framesShort}</div>
                    </div>
                </div>
                <div class="cp-card-desc">Amp: ${preset.amp} | Freq: ${preset.freq}</div>
                <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 5px; margin-bottom: 5px;">${tagsHTML}</div>
                <div class="cp-card-actions" style="display: ${isExportMode ? 'none' : 'flex'};">
                    <button class="cp-card-btn apply" data-id="${preset.id}">Apply</button>
                    <button class="cp-card-btn delete" data-id="${preset.id}">Delete</button>
                </div>
            `;
            list.appendChild(card);
        });

        // Вешаем события на кнопки Apply и Delete
        if (!isExportMode) {
            list.querySelectorAll('.cp-card-btn.apply').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    applyCustomPreset(id);
                });
            });

            list.querySelectorAll('.cp-card-btn.delete').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    deletePreset(id);
                });
            });
        }

        // Обработчик клика по карточке ИЛИ чекбоксу
        if (isExportMode) {
            list.querySelectorAll('.cp-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const chk = card.querySelector('.cp-checkbox');
                    if (!chk) return;
                    
                    const id = chk.getAttribute('data-id');
                    
                    if (selectedForExport.includes(id)) {
                        selectedForExport = selectedForExport.filter(item => item !== id);
                        chk.classList.remove('selected');
                    } else {
                        if (selectedForExport.length >= MAX_EXPORT) {
                            if (window.showError) window.showError(`Maximum ${MAX_EXPORT} presets can be selected!`);
                            return;
                        }
                        selectedForExport.push(id);
                        chk.classList.add('selected');
                    }
                });
            });
        }
    }

    function deletePreset(id) {
        const btn = document.querySelector(`.cp-card-btn.delete[data-id="${id}"]`);
        const card = btn ? btn.closest('.cp-card') : null;

        if (card) {
            const rect = card.getBoundingClientRect();
            const borderPoints = 16;
            
            for (let p = 0; p < borderPoints; p++) {
                let x, y;
                const progress = p / borderPoints;
                if (progress < 0.25) { x = rect.left + (rect.width * (progress * 4)); y = rect.top; }
                else if (progress < 0.5) { x = rect.right; y = rect.top + (rect.height * ((progress - 0.25) * 4)); }
                else if (progress < 0.75) { x = rect.right - (rect.width * ((progress - 0.5) * 4)); y = rect.bottom; }
                else { x = rect.left; y = rect.bottom - (rect.height * ((progress - 0.75) * 4)); }

                for (let i = 0; i < 2; i++) {
                    const spark = document.createElement('div');
                    spark.className = 'click-particle';
                    spark.style.left = x + 'px';
                    spark.style.top = y + 'px';
                    spark.style.backgroundColor = 'var(--primary)';
                    spark.style.boxShadow = '0 0 10px var(--primary)';
                    
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 20 + Math.random() * 50;
                    spark.style.setProperty('--px', Math.cos(angle) * dist + 'px');
                    spark.style.setProperty('--py', Math.sin(angle) * dist + 'px');
                    
                    const dur = 0.4 + Math.random() * 0.4;
                    spark.style.animation = `particleFly ${dur}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
                    
                    document.body.appendChild(spark);
                    setTimeout(() => spark.remove(), dur * 1000);
                }
            }

            customPresets = customPresets.filter(p => p.id !== id);
            localStorage.setItem('shakePackCustomPresets', JSON.stringify(customPresets));

            card.classList.add('removing');

            setTimeout(() => {
                renderPresetsList();
            }, 300);

        } else {
            customPresets = customPresets.filter(p => p.id !== id);
            localStorage.setItem('shakePackCustomPresets', JSON.stringify(customPresets));
            renderPresetsList();
        }
    }

    // --- 7. ЭКСПОРТ / ИМПОРТ ---
    function initExportImport() {
        const exportBtn = document.getElementById('cp-export-btn');
        const importBtn = document.getElementById('cp-import-btn');
        const fileInput = document.getElementById('cp-import-file');
        const confirmExportBtn = document.getElementById('cp-confirm-export-btn');

        if (exportBtn && confirmExportBtn) {
            exportBtn.addEventListener('click', () => {
                if (customPresets.length === 0) {
                    if (window.showError) window.showError('No presets to export!');
                    return;
                }

                if (!isExportMode) {
                    // ВКЛЮЧАЕМ РЕЖИМ ЭКСПОРТА
                    isExportMode = true;
                    selectedForExport = [];
                    exportBtn.innerText = getT().cancelBtn || "Cancel";
                    exportBtn.style.borderColor = "#ff3366";
                    confirmExportBtn.style.display = 'block';
                    renderPresetsList();
                } else {
                    // ОТМЕНА РЕЖИМА ЭКСПОРТА
                    isExportMode = false;
                    selectedForExport = [];
                    exportBtn.innerText = getT().exportAll;
                    exportBtn.style.borderColor = "";
                    confirmExportBtn.style.display = 'none';
                    renderPresetsList();
                }
            });
        }

        // Кнопка сохранения выбранных пресетов
        if (confirmExportBtn) {
            confirmExportBtn.addEventListener('click', () => {
                if (selectedForExport.length === 0) {
                    if (window.showError) window.showError('Select at least one preset to export!');
                    return;
                }
                
                const presetsToExport = customPresets.filter(p => selectedForExport.includes(p.id));
                const jsonString = JSON.stringify(presetsToExport, null, 2);
                
                // Проверяем, есть ли CSInterface
                if (typeof CSInterface !== 'undefined') {
                    const csInterface = new CSInterface();
                    
                    // Сначала спрашиваем путь через ExtendScript
                    const askPathScript = `(function() {
                        var file = File.saveDialog("Save Shake Pack Presets", "JSON files:*.json");
                        if (file) return file.fsName;
                        return "CANCEL";
                    })();`;

                    csInterface.evalScript(askPathScript, (result) => {
                        if (result === "CANCEL") return;
                        
                        // Экранируем спецсимволы для передачи в скрипт
                        const escapedJson = jsonString.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
                        
                        const writeScript = `(function() {
                            var file = new File("${result.replace(/\\/g, '\\\\')}");
                            if (file) {
                                file.open("w");
                                file.write("${escapedJson}");
                                file.close();
                                return "SUCCESS";
                            }
                            return "ERROR";
                        })();`;

                        csInterface.evalScript(writeScript, (writeResult) => {
                            if (writeResult === "SUCCESS") {
                                if (window.showSuccess) window.showSuccess('Presets exported!');
                                
                                // Выходим из режима экспорта
                                isExportMode = false;
                                selectedForExport = [];
                                exportBtn.innerText = getT().exportAll;
                                exportBtn.style.borderColor = "";
                                confirmExportBtn.style.display = 'none';
                                renderPresetsList();
                            } else {
                                if (window.showError) window.showError('Failed to save file.');
                            }
                        });
                    });
                } else {
                    // Запасной вариант для браузера (если тестируешь вне AE)
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", "shake_pack_presets.json");
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    
                    if (window.showSuccess) window.showSuccess('Presets exported!');
                    isExportMode = false;
                    selectedForExport = [];
                    exportBtn.innerText = getT().exportAll;
                    exportBtn.style.borderColor = "";
                    confirmExportBtn.style.display = 'none';
                    renderPresetsList();
                }
            });
        }

        // Импорт
        if (importBtn && fileInput) {
            importBtn.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        
                        if (Array.isArray(imported) && imported.length > 0) {
                            
                            const validPresets = imported.filter(p => 
                                p && typeof p.name === 'string' && 
                                typeof p.amp === 'number' && 
                                typeof p.freq === 'number' && 
                                typeof p.frames === 'number'
                            );

                            if (validPresets.length === 0) {
                                if (window.showError) window.showError('No valid presets found in file.');
                                fileInput.value = '';
                                return;
                            }

                            // Ограничение до 10 штук и добавление новых ID
                            const toAdd = validPresets.slice(0, 10).map(p => ({
                                ...p,
                                id: 'custom-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
                            }));
                            
                            customPresets = customPresets.concat(toAdd);
                            localStorage.setItem('shakePackCustomPresets', JSON.stringify(customPresets));
                            renderPresetsList();
                            if (window.showSuccess) window.showSuccess(`Imported ${toAdd.length} presets!`);
                        } else {
                            if (window.showError) window.showError('Invalid file format.');
                        }
                    } catch (err) {
                        if (window.showError) window.showError('Failed to parse JSON.');
                    }
                    fileInput.value = '';
                };
                reader.readAsText(file);
            });
        }
    }

    // --- 8. ПРИМЕНЕНИЕ ПРЕСЕТА В AFTER EFFECTS ---
    function applyCustomPreset(id) {
        const preset = customPresets.find(p => p.id === id);
        if (!preset) return;

        if (typeof CSInterface === 'undefined') return;
        if (window.showLoadingBar) window.showLoadingBar();
        
        const csInterface = new CSInterface();
        
        const script = `(function() {
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) return "ERROR_NO_COMP";
            if (comp.selectedLayers.length === 0) return "ERROR_NO_LAYER";
            
            var targetLayer = comp.selectedLayers[0];
            
            app.beginUndoGroup("Apply Custom Shake");
            
            var layerName = "SHAKE - ${preset.name.replace(/"/g, '')}";
            var frames = ${preset.frames};
            var amp = ${preset.amp};
            var freq = ${preset.freq};
            
            var adjLayer = comp.layers.addSolid([1, 1, 1], layerName, comp.width, comp.height, comp.pixelAspect);
            adjLayer.adjustmentLayer = true;
            adjLayer.moveBefore(targetLayer);
            adjLayer.label = 10;  
            
            var duration = frames * comp.frameDuration; 
            var startTime = comp.time;
            
            adjLayer.inPoint = startTime;
            adjLayer.outPoint = startTime + duration;
            
            try {
                var fx = adjLayer.Effects.addProperty("S_DissolveShake");
                if (fx) {
                    fx.property("Amplitude").setValue(amp);
                    fx.property("Frequency").setValue(freq);
                    fx.property("Motion Blur").setValue(true);
                    fx.property("Wrap X").setValue(3);
                    fx.property("Wrap Y").setValue(3);
                    
                    var exp = "var t = time - inPoint;\\n" +
                              "var dur = " + duration + ";\\n" +
                              "if (t < 0) t = 0;\\n" +
                              "if (t > dur) t = dur;\\n" +
                              "var progress = t / dur;\\n" +
                              "15.00 * Math.exp(-3 * progress);";
                              
                    fx.property("Dissolve Percent").expressionEnabled = true;
                    fx.property("Dissolve Percent").expression = exp;
                }
            } catch(e) {}
            
            app.endUndoGroup();
            return 'SUCCESS';
        })();`;

        csInterface.evalScript(script, function(result) {
            if (window.hideLoadingBar) window.hideLoadingBar(result === "SUCCESS");
            
            if (result === "SUCCESS") {
                if (window.showSuccess) window.showSuccess(getT().presetApplied);
            } else if (result === "ERROR_NO_COMP") {
                if (window.showError) window.showError("Open a composition first!");
            } else if (result === "ERROR_NO_LAYER") {
                if (window.showError) window.showError("Please select a layer first!");
            } else {
                if (window.showError) window.showError("Error: " + result);
            }
        });
    }
})();