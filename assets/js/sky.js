/* Transparent detail layer: the existing gradients and horizon stay untouched. */
(function () {
  "use strict";

  function boot() {
    var canvas = document.querySelector(".hero__sky");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var hero = canvas.closest(".hero");
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var stars = [], meteors = [], width = 0, height = 0;
    var frame = null, lastFrame = -Infinity, nextMeteor = 0;
    var visible = true;
    var introDone = !document.documentElement.classList.contains("intro-pending") ||
      document.documentElement.classList.contains("hero-in");

    function random(min, max) { return min + Math.random() * (max - min); }

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!stars.length) {
        var count = Math.round(Math.min(160, Math.max(45, width * height / 15000)));
        for (var i = 0; i < count; i++) {
          stars.push({x: Math.random(), y: Math.random(), radius: random(0.35, 1.1),
            alpha: random(0.12, 0.42), phase: random(0, Math.PI * 2),
            period: random(3500, 8000), bright: i % 23 === 0});
        }
      }
      // A changed viewport should never stretch an existing shooting star.
      meteors = [];
      draw(performance.now());
    }

    function draw(now) {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var twinkle = motion.matches ? 1 : 0.75 + 0.25 * Math.sin(now / s.period + s.phase);
        var alpha = s.alpha * twinkle;
        var x = s.x * width, y = s.y * height;
        ctx.fillStyle = "rgba(210,230,245," + alpha + ")";
        ctx.beginPath();
        ctx.arc(x, y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        if (s.bright) {
          ctx.strokeStyle = "rgba(210,230,245," + alpha * 0.35 + ")";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(x - 3, y); ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3); ctx.lineTo(x, y + 3);
          ctx.stroke();
        }
      }
      for (var j = meteors.length - 1; j >= 0; j--) {
        var m = meteors[j];
        var t = (now - m.born) / m.duration;
        if (t >= 1) { meteors.splice(j, 1); continue; }
        var mx = m.x + m.dx * t, my = m.y + m.dy * t;
        var tailX = mx - Math.cos(m.angle) * m.length;
        var tailY = my - Math.sin(m.angle) * m.length;
        var opacity = Math.pow(Math.sin(Math.PI * t), 0.8) * 0.7;
        var trail = ctx.createLinearGradient(tailX, tailY, mx, my);
        trail.addColorStop(0, "rgba(150,232,246,0)");
        trail.addColorStop(0.7, "rgba(150,232,246," + opacity * 0.3 + ")");
        trail.addColorStop(1, "rgba(235,249,255," + opacity + ")");
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(mx, my); ctx.stroke();
        ctx.fillStyle = "rgba(235,249,255," + opacity + ")";
        ctx.beginPath(); ctx.arc(mx, my, 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }

    function spawn(now) {
      var angle = random(0.3, 0.65);
      var distance = Math.min(width * 0.55, 700);
      meteors.push({born: now, duration: random(900, 1500),
        x: random(0.05, 0.82) * width, y: random(0.03, 0.42) * height,
        angle: angle, dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance,
        length: Math.min(random(90, 170), width * 0.28)});
      nextMeteor = now + random(4500, 10000);
    }

    function tick(now) {
      frame = null;
      if (!visible || document.hidden || motion.matches || !introDone) return;
      if (now - lastFrame >= 1000 / 30) {
        if (now >= nextMeteor) spawn(now);
        draw(now);
        lastFrame = now;
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      meteors = [];
      lastFrame = -Infinity;
      nextMeteor = performance.now() + random(1800, 4000);
      if (introDone) canvas.classList.add("is-ready");
      if (!visible || document.hidden || !introDone) return;
      draw(performance.now());
      if (!motion.matches) frame = requestAnimationFrame(tick);
    }

    resize();
    sync();
    document.addEventListener("orbitech:introdone", function () { introDone = true; sync(); });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", resize, {passive: true});
    if (motion.addEventListener) motion.addEventListener("change", sync);
    if (window.IntersectionObserver) {
      new window.IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }).observe(hero);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
