/**
 * game.js
 */

(function() {
    let xoteClicks = 0;
    let gameActive = false;
    let currentScore = 0;
    let gameInterval;

    function ico(name, fallback) {
        return window.ShakeIcons ? window.ShakeIcons.get(name) : fallback;
    }

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
        
        if (!overlay || !area || !scoreDisplay || !starsContainer || !gameOverScreen || !finalScoreDisplay) return;
        
        clearInterval(gameInterval); 
        gameOverScreen.style.display = 'none'; 
        gameOverScreen.classList.remove('active'); 
        starsContainer.innerHTML = ''; 
        currentScore = 0;
        scoreDisplay.innerText = '0';
        gameActive = true;
        
        overlay.style.display = 'flex';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.opacity = '1', 10);
        
        function gameOver() {
            gameActive = false;
            clearInterval(gameInterval);
            finalScoreDisplay.innerText = currentScore;
            
            gameOverScreen.style.display = 'flex';
            void gameOverScreen.offsetWidth;
            gameOverScreen.classList.add('active');
            
            starsContainer.innerHTML = '';
        }
        
        function spawnStar() {
            if (!gameActive) return;
            
            const star = document.createElement('div');
            star.className = 'falling-star';
            star.innerHTML = ico('star', '⭐');
            star.style.left = Math.max(0, Math.random() * (area.clientWidth - 40)) + 'px';
            star.style.top = '-40px';
            const size = 20 + Math.random() * 20;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            const duration = 2 + Math.random() * 2;
            star.style.animation = `fall ${duration}s linear forwards`;
            
            star.onclick = function(e) {
                e.stopPropagation();
                if (!gameActive || star.dataset.hit === '1') return;
                star.dataset.hit = '1';
                star.style.pointerEvents = 'none';
                
                currentScore++;
                scoreDisplay.innerText = currentScore;

                const rect = star.getBoundingClientRect();
                star.style.transition = 'opacity 0.2s ease';
                star.style.opacity = '0';

                if (window.createSparks) {
                    window.createSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
                }
                
                setTimeout(() => star.remove(), 220);
            };
            
            starsContainer.appendChild(star);
            
            setTimeout(() => {
                if (star.parentNode) {
                    star.remove();
                    if (gameActive && star.style.opacity !== '0') {
                        gameOver();
                    }
                }
            }, duration * 1000);
        }
        
        gameInterval = setInterval(spawnStar, 600 + Math.random() * 200);
        
        const closeBtn = document.getElementById('game-close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                gameActive = false;
                clearInterval(gameInterval);
                gameOverScreen.style.display = 'none';
                gameOverScreen.classList.remove('active');
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    starsContainer.innerHTML = '';
                }, 300);
            };
        }

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