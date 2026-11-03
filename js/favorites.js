/**
 * favorites.js
 * Логика работы с избранным: добавление, удаление, Drag & Drop и отрисовка.
 * Также здесь происходит инициализация карточек в основном меню.
 */

(function() {
    // Загружаем сохраненные избранные
    let favorites = JSON.parse(localStorage.getItem('shakeFavorites') || '[]');

    // Глобальные переменные для Drag & Drop
    let draggedItem = null;

    // --- 1. ИНИЦИАЛИЗАЦИЯ КАРТОЧЕК В ОСНОВНОМ МЕНЮ ---
    // Находим все кнопки шейков и добавляем им иконки (глаз и звезду)
    document.addEventListener('DOMContentLoaded', () => {
        const allShakeBtns = document.querySelectorAll('.category .shake-btn');
        
        allShakeBtns.forEach(btn => {
            const id = btn.id;
            // Проверяем, не добавили ли мы уже иконки (защита от дублей)
            if (btn.querySelector('.preview-btn')) return; 

            const title = btn.querySelector('.btn-title')?.innerText || 'Shake';
            const desc = btn.querySelector('.btn-desc')?.innerText || '';
            
            btn.innerHTML = `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; text-align: left;">
                    <span class="btn-title">${title}</span>
                    <span class="btn-desc">${desc}</span>
                </div>
                <div class="preview-btn" data-id="${id}" data-title="${title}">👁️</div>
                <div class="fav-star ${favorites.includes(id) ? 'active' : ''}" data-id="${id}">⭐</div>
            `;
            btn.style.cursor = 'none'; // <--- ДОБАВЬ ВОТ ЭТУ СТРОКУ СЮДА
        });
    });

    // --- 2. ЛОГИКА ПАНЕЛИ ИЗБРАННОГО ---
    document.addEventListener('DOMContentLoaded', () => {
        const favToggle = document.getElementById('favorites-toggle');
        const favPanel = document.getElementById('favorites-panel');
        const closeFav = document.getElementById('close-favorites');
        const favList = document.getElementById('favorites-list');

        if (favToggle && favPanel) {
            favToggle.addEventListener('click', () => favPanel.classList.add('active'));
            if (closeFav) closeFav.addEventListener('click', () => favPanel.classList.remove('active'));
        }

        // Функция генерации HTML для карточки в избранном
        function createShakeBtnHTML(id, title, desc) {
            return `
                <div class="shake-btn" id="${id}" style="margin-bottom: 0; cursor: grab;" draggable="true">
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; text-align: left;">
                        <span class="btn-title">${title}</span>
                        <span class="btn-desc">${desc}</span>
                    </div>
                    <div class="preview-btn" data-id="${id}" data-title="${title}">👁️</div>
                    <div class="fav-star ${favorites.includes(id) ? 'active' : ''}" data-id="${id}">⭐</div>
                </div>
            `;
        }

        // Функция отрисовки списка
        function renderFavorites() {
            if (!favList) return;
            favList.innerHTML = '';
            
            if (favorites.length === 0) {
                favList.innerHTML = '<div style="text-align: center; color: #8e8e9c; font-size: 12px; margin-top: 20px;">No favorites yet. Click ⭐ on any shake!</div>';
                return;
            }
            
            favorites.forEach(id => {
                // Ищем карточку в основном меню, чтобы взять оттуда название и описание
                const originalBtn = document.getElementById(id);
                if (originalBtn) {
                    const title = originalBtn.querySelector('.btn-title')?.innerText || 'Shake';
                    const desc = originalBtn.querySelector('.btn-desc')?.innerText || '';
                    
                    const div = document.createElement('div');
                    div.innerHTML = createShakeBtnHTML(id, title, desc);
                    favList.appendChild(div.firstElementChild);
                }
            });
        }

        // Первичная отрисовка
        renderFavorites();

        // --- 3. ОБРАБОТЧИКИ КЛИКОВ (ГЛАЗ И ЗВЕЗДА) ---
        document.addEventListener('click', (e) => {
            // Клик по звезде
            if (e.target.classList.contains('fav-star')) {
                e.stopPropagation();
                const id = e.target.getAttribute('data-id');
                const isCurrentlyFav = favorites.includes(id);
                
                if (isCurrentlyFav) {
                    favorites = favorites.filter(favId => favId !== id);
                    e.target.classList.remove('active');
                } else {
                    favorites.push(id);
                    e.target.classList.add('active');
                }
                localStorage.setItem('shakeFavorites', JSON.stringify(favorites));

                // Синхронизируем звезды по всему интерфейсу
                document.querySelectorAll(`.fav-star[data-id="${id}"]`).forEach(star => {
                    if (favorites.includes(id)) star.classList.add('active');
                    else star.classList.remove('active');
                });

                // Анимация удаления (если удаляем из меню избранного)
                if (isCurrentlyFav) {
                    const isInsideFavPanel = e.target.closest('#favorites-list');
                    const favCard = isInsideFavPanel ? document.querySelector(`#favorites-list .shake-btn#${id}`) : null;
                    
                    if (favCard) {
                        // Создаем искры по периметру
                        const rect = favCard.getBoundingClientRect();
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
                        favCard.classList.add('removing');
                        setTimeout(() => renderFavorites(), 300);
                    } else {
                        renderFavorites();
                    }
                } else {
                    renderFavorites();
                }
            }

            // Клик по глазу (превью)
            const previewBtn = e.target.closest('.preview-btn');
            if (previewBtn) {
                e.stopPropagation();
                const id = previewBtn.getAttribute('data-id');
                const title = previewBtn.getAttribute('data-title');
                if (window.showPreview) window.showPreview(id, title);
            }
        });

        // Запуск шейка из меню избранного
        if (favList) {
            favList.addEventListener('click', (e) => {
                const btn = e.target.closest('.shake-btn');
                if (btn && !e.target.classList.contains('fav-star') && !e.target.classList.contains('preview-btn')) {
                    const btnId = btn.id;
                    if (typeof applyPreset === 'function') applyPreset(btnId);
                }
            });
        }

        // --- 4. DRAG & DROP В ИЗБРАННОМ ---
        if (favList) {
            // Наблюдатель, чтобы новые карточки сразу становились перетаскиваемыми
            const observer = new MutationObserver(() => {
                favList.querySelectorAll('.shake-btn').forEach(item => {
                    item.setAttribute('draggable', 'true');
                    item.style.cursor = 'grab';
                });
            });
            observer.observe(favList, { childList: true });

            favList.addEventListener('dragstart', (e) => {
                const target = e.target.closest('.shake-btn');
                if (!target) return;
                draggedItem = target;
                setTimeout(() => target.classList.add('dragging'), 0);
            });

            favList.addEventListener('dragend', () => {
                if (draggedItem) {
                    draggedItem.classList.remove('dragging');
                    draggedItem = null;
                }
                // Сохраняем новый порядок
                const newFavorites = [];
                favList.querySelectorAll('.shake-btn').forEach(btn => newFavorites.push(btn.id));
                favorites = newFavorites;
                localStorage.setItem('shakeFavorites', JSON.stringify(favorites));
            });

            favList.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(favList, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    if (afterElement == null) favList.appendChild(draggable);
                    else favList.insertBefore(draggable, afterElement);
                }
            });

            function getDragAfterElement(container, y) {
                const draggableElements = [...container.querySelectorAll('.shake-btn:not(.dragging)')];
                return draggableElements.reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) {
                        return { offset: offset, element: child };
                    } else {
                        return closest;
                    }
                }, { offset: Number.NEGATIVE_INFINITY }).element;
            }
        }
    });
})();