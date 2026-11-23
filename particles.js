window._shakeParticlesState = window._shakeParticlesState || {};

window.particlesJS = function(divId, config) {
    var state = window._shakeParticlesState[divId];
    if (state) {
        if (state.frameId) cancelAnimationFrame(state.frameId);
        if (state.resizeHandler) window.removeEventListener('resize', state.resizeHandler);
    }
    window._shakeParticlesState[divId] = null;

    var container = document.getElementById(divId);
    if(!container) return;
    if (!config || !config.particles) return;

    state = window._shakeParticlesState[divId] = { frameId: null, resizeHandler: null };

    var oldCanvas = container.querySelector('canvas');
    if (oldCanvas) {
        container.removeChild(oldCanvas);
    }

    var canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var dots = [];
    var width = 0;
    var height = 0;

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 255, b: 204 };
    }

    var configuredColor = config.particles.color && config.particles.color.value;
    var primaryColor = configuredColor || getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00ffcc';
    var rgb = hexToRgb(primaryColor);

    function resize() {
        width = container.offsetWidth;
        height = container.offsetHeight;
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    state.resizeHandler = function() {
        resize();
        dots.forEach(function(d) {
            if(d.x > width) d.x = Math.random() * width;
            if(d.y > height) d.y = Math.random() * height;
        });
    };
    window.addEventListener('resize', state.resizeHandler);

    resize();

    var count = config.particles.number && config.particles.number.value;
    if (!isFinite(count) || count < 0) count = 0;
    var sizeValue = (config.particles.size && config.particles.size.value) || 3;
    var speedValue = (config.particles.move && config.particles.move.speed) || 1.5;

    for(var i=0; i<count; i++) {
        dots.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * sizeValue + 0.5,
            speed: Math.random() * speedValue + 0.2,
            alpha: Math.random() * 0.6 + 0.1
        });
    }

    function draw() {
        if (document.hidden) {
            state.frameId = requestAnimationFrame(draw);
            return;
        }
        ctx.clearRect(0, 0, width, height);

        dots.forEach(function(d) {
            d.y -= d.speed;

            if(d.y < -d.size * 2) {
                d.y = height + d.size * 2;
                d.x = Math.random() * width;
                d.alpha = Math.random() * 0.6 + 0.1;
            }

            d.x += Math.sin(d.y * 0.01) * 0.2;

            ctx.shadowBlur = 8;
            ctx.shadowColor = primaryColor;

            ctx.fillStyle = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + d.alpha + ")";
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.shadowBlur = 0;

        ctx.lineWidth = 0.5;
        for (var i = 0; i < dots.length; i++) {
            for (var j = i + 1; j < dots.length; j++) {
                var dx = dots[i].x - dots[j].x;
                var dy = dots[i].y - dots[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 90) {
                    var alpha = (1 - dist / 90) * 0.18;
                    ctx.strokeStyle = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha.toFixed(3) + ")";
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
        }

        state.frameId = requestAnimationFrame(draw);
    }
    draw();
};
