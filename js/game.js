/**
 * game.js
 * Логика мини-игры (пасхалки) с падающими звездами.
 */

(function() {
    let xoteClicks = 0;
    let gameActive = false;
    let currentScore = 0;
    let gameInterval;

    document.addEventListener('DOMContentLoaded', () => {
        const xoteBtn = document.getElementById('secret-xote');
        
        if (xoteBtn) {
            xoteBtn.addEventListener('click', () => {
                xoteClicks++;
                if (xoteClicks >= 10) {
                    xoteClicks = 0;
                    startGame();
                }
            });
        }
    });

    function startGame() {
        const overlay = document.getElementById('mini-game-overlay');
        const area = document.getElementById('mini-game-area');
        const scoreDisplay = document.getElementById('game-score');
        const starsContainer = document.getElementById('game-stars-container');
        const gameOverScreen = document.getElementById('game-over-screen');
        const finalScoreDisplay = document.getElementById('final-score');
        
        if (!overlay || !area) return;
        
        // --- СБРОС ВСЕГО ПЕРЕД НОВОЙ ИГРОЙ ---
        clearInterval(gameInterval); 
        gameOverScreen.style.display = 'none'; 
        gameOverScreen.classList.remove('active'); 
        starsContainer.innerHTML = ''; 
        currentScore = 0;
        scoreDisplay.innerText = '0';
        gameActive = true;
        
        // Плавное появление
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.opacity = '1', 10);
        
        // Функция проигрыша
        function gameOver() {
            gameActive = false;
            clearInterval(gameInterval);
            finalScoreDisplay.innerText = currentScore;
            
            gameOverScreen.style.display = 'flex';
            void gameOverScreen.offsetWidth;
            gameOverScreen.classList.add('active');
            
            starsContainer.innerHTML = '';
        }
        
        // Функция создания падающей звезды
        function spawnStar() {
            if (!gameActive) return;
            
            const star = document.createElement('div');
            star.className = 'falling-star';
            star.innerText = '⭐';
            star.style.left = Math.random() * (area.clientWidth - 40) + 'px';
            star.style.top = '-40px';
            star.style.fontSize = (20 + Math.random() * 20) + 'px';
            
            const duration = 2 + Math.random() * 2;
            star.style.animation = `fall ${duration}s linear forwards`;
            
            star.onclick = function(e) {
                e.stopPropagation();
                if (!gameActive) return;
                
                currentScore++;
                scoreDisplay.innerText = currentScore;
                star.style.transform = 'scale(1.5)';
                star.style.opacity = '0';
                
                const rect = star.getBoundingClientRect();
                if (window.createSparks) {
                    window.createSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
                }
                
                setTimeout(() => star.remove(), 150);
            };
            
            starsContainer.appendChild(star);
            
            // Удаляем звезду, если она упала за пределы экрана
            setTimeout(() => {
                if (star.parentNode) {
                    star.remove();
                    if (gameActive && star.style.opacity !== '0') {
                        gameOver();
                    }
                }
            }, duration * 1000);
        }
        
        // Запускаем спавн звезд
        gameInterval = setInterval(spawnStar, 600 + Math.random() * 200);
        
        // Кнопка закрытия (крестик)
        const closeBtn = document.getElementById('game-close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                gameActive = false;
                clearInterval(gameInterval);
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    starsContainer.innerHTML = '';
                }, 300);
            };
        }

        // Кнопка Try Again
        const btnRestart = document.getElementById('btn-restart');
        if (btnRestart) {
            btnRestart.onclick = function() {
                gameActive = false;
                clearInterval(gameInterval);
                gameOverScreen.classList.remove('active');
                setTimeout(() => {
                    gameOverScreen.style.display = 'none';
                    startGame(); 
                }, 400);
            };
        }

        // Кнопка Close (на экране проигрыша)
        const btnCloseGame = document.getElementById('btn-close-game');
        if (btnCloseGame) {
            btnCloseGame.onclick = function() {
                gameActive = false;
                clearInterval(gameInterval);
                gameOverScreen.classList.remove('active');
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    gameOverScreen.style.display = 'none';
                    starsContainer.innerHTML = '';
                }, 400);
            };
        }
    }
})();