/**
 * favorites.js
 */

(function() {
    let favorites = [];
    let favRenderTimer = null;
    try {
        const savedFavorites = JSON.parse(localStorage.getItem('shakeFavorites') || '[]');
        if (Array.isArray(savedFavorites)) favorites = normalizeFavorites(savedFavorites);
    } catch (e) {
        favorites = [];
    }

    function normalizeFavorites(list) {
        if (!Array.isArray(list)) return [];
        const seen = {};
        return list.filter(id => {
            if (typeof id !== 'string' || !id || seen[id]) return false;
            seen[id] = true;
            return true;
        });
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function ico(name, fallback) {
        return window.ShakeIcons ? window.ShakeIcons.get(name) : fallback;
    }

    function tuneTitle() {
        const lang = localStorage.getItem('shakePackLang') || 'en';
        const t = window.translations && window.translations[lang];
        return (t && t.tipTune) || 'Shake settings';
    }

    function isTuned(id) {
        if (!window.getShakeTuning) return false;
        const tune = window.getShakeTuning(id);
        return tune.strength !== 1 || tune.speed !== 1 || tune.blur !== 1;
    }

    let draggedItem = null;
    let favoritesBeforeDrag = null;

    document.addEventListener('DOMContentLoaded', () => {
        const allShakeBtns = document.querySelectorAll('.category .shake-btn');
        
        allShakeBtns.forEach(btn => {
            const id = btn.id;
            if (btn.querySelector('.preview-btn')) return; 

            const title = btn.querySelector('.btn-title')?.innerText || 'Shake';
            const desc = btn.querySelector('.btn-desc')?.innerText || '';
            
            btn.innerHTML = `
                <span style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; text-align: left;">
                    <span class="btn-title">${escapeHtml(title)}</span>
                    <span class="btn-desc">${escapeHtml(desc)}</span>
                </span>
                <span class="tune-btn" data-id="${escapeHtml(id)}" title="${escapeHtml(tuneTitle())}">${ico('settings', '⚙️')}</span>
                <span class="preview-btn" data-id="${escapeHtml(id)}" data-title="${escapeHtml(title)}">${ico('eye', '👁️')}</span>
                <span class="fav-star ${favorites.includes(id) ? 'active' : ''}" data-id="${escapeHtml(id)}">${ico('star', '⭐')}</span>
            `;
            btn.style.cursor = 'none';
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const favToggle = document.getElementById('favorites-toggle');
        const favPanel = document.getElementById('favorites-panel');
        const closeFav = document.getElementById('close-favorites');
        const favList = document.getElementById('favorites-list');

        if (favToggle && favPanel) {
            favToggle.addEventListener('click', () => favPanel.classList.add('active'));
            if (closeFav) closeFav.addEventListener('click', () => favPanel.classList.remove('active'));
        }

        function createShakeBtnHTML(id, title, desc) {
            return `
                <div class="shake-btn ${isTuned(id) ? 'tuned' : ''}" data-id="${escapeHtml(id)}" style="margin-bottom: 0; cursor: grab;" draggable="true">
                    <span style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; text-align: left;">
                        <span class="btn-title">${escapeHtml(title)}</span>
                        <span class="btn-desc">${escapeHtml(desc)}</span>
                    </span>
                    <span class="tune-btn" data-id="${escapeHtml(id)}" title="${escapeHtml(tuneTitle())}">${ico('settings', '⚙️')}</span>
                    <span class="preview-btn" data-id="${escapeHtml(id)}" data-title="${escapeHtml(title)}">${ico('eye', '👁️')}</span>
                    <span class="fav-star ${favorites.includes(id) ? 'active' : ''}" data-id="${escapeHtml(id)}">${ico('star', '⭐')}</span>
                </div>
            `;
        }

        function renderFavorites() {
            if (favRenderTimer) {
                clearTimeout(favRenderTimer);
                favRenderTimer = null;
            }
            if (!favList) return;
            const valid = normalizeFavorites(favorites).filter(id => !!document.getElementById(id));
            if (valid.length !== favorites.length) {
                favorites = valid;
                try { localStorage.setItem('shakeFavorites', JSON.stringify(favorites)); } catch (e) {}
            }
            favList.innerHTML = '';
            
            if (favorites.length === 0) {
                const savedLang = localStorage.getItem('shakePackLang') || 'en';
                const t = window.translations && window.translations[savedLang];
                const emptyText = (t && t.emptyFavorites) || 'No favorites yet. Click the star on any shake!';
                favList.innerHTML = `<div data-empty-favorites="true" style="text-align: center; color: #8e8e9c; font-size: 12px; margin-top: 20px;">${escapeHtml(emptyText)}</div>`;
                return;
            }
            
            favorites.forEach(id => {
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

        renderFavorites();

        document.addEventListener('click', (e) => {
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
                try { localStorage.setItem('shakeFavorites', JSON.stringify(favorites)); } catch (e) {}

                document.querySelectorAll(`.fav-star[data-id="${id}"]`).forEach(star => {
                    if (favorites.includes(id)) star.classList.add('active');
                    else star.classList.remove('active');
                });

                if (isCurrentlyFav) {
                    const isInsideFavPanel = e.target.closest('#favorites-list');
                    const favCard = isInsideFavPanel ? favList.querySelector(`.shake-btn[data-id="${id}"]`) : null;
                    
                    if (favCard) {
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
                        favRenderTimer = setTimeout(() => {
                            favRenderTimer = null;
                            renderFavorites();
                        }, 300);
                    } else {
                        renderFavorites();
                    }
                } else {
                    renderFavorites();
                }
            }

            const previewBtn = e.target.closest('.preview-btn');
            if (previewBtn) {
                e.stopPropagation();
                const id = previewBtn.getAttribute('data-id');
                const title = previewBtn.getAttribute('data-title');
                if (window.showPreview) window.showPreview(id, title);
            }
        });

        if (favList) {
            favList.addEventListener('click', (e) => {
                const btn = e.target.closest('.shake-btn');
                if (btn && !e.target.closest('.fav-star') && !e.target.closest('.preview-btn') && !e.target.closest('.tune-btn')) {
                    const btnId = btn.getAttribute('data-id');
                    if (typeof applyPreset === 'function') applyPreset(btnId);
                }
            });
        }

        if (favList) {
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
                favoritesBeforeDrag = favorites.slice();
                setTimeout(() => {
                    if (draggedItem === target) target.classList.add('dragging');
                }, 0);
            });

            favList.addEventListener('dragend', (e) => {
                const cancelled = e.dataTransfer && e.dataTransfer.dropEffect === 'none';
                if (draggedItem) {
                    draggedItem.classList.remove('dragging');
                    draggedItem = null;
                }
                if (cancelled) {
                    if (favoritesBeforeDrag) favorites = favoritesBeforeDrag.slice();
                    favoritesBeforeDrag = null;
                    renderFavorites();
                    return;
                }
                favoritesBeforeDrag = null;
                const newFavorites = [];
                favList.querySelectorAll('.shake-btn').forEach(btn => newFavorites.push(btn.getAttribute('data-id')));
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