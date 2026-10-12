/* ==========================================================================
   ORBITECH — Cinematic opening sequence
   --------------------------------------------------------------------------
   A canvas-2D space flight that rolls into the hero. No dependencies.

   A 3.3-second brand reveal, followed by a 650ms dissolve: orbital traces form around the supplied logo,
   a soft nebula emerges, and the logo moves into its exact place in the hero.

   Guaranteed fallbacks — the animation NEVER runs when:
     · prefers-reduced-motion: reduce is set
     · the viewport is small / the pointer is coarse (mobile)  → static poster
     · the device reports low memory, few cores, or Save-Data
     · it has already played this browser session
     · JavaScript is unavailable (the overlay ships with `hidden`)

   The static hero backdrop (.hero__backdrop / .hero__stars / .space-nebula)
   is pure CSS and is ALWAYS present underneath — it is the poster state, so
   every fallback path lands on a complete, designed hero rather than a gap.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Session storage with a safe fallback.
     Some embedded/sandboxed contexts throw on storage access; when that
     happens we fall back to an in-memory flag, which still prevents a
     replay during soft navigation within the same page load.
     ---------------------------------------------------------------------- */
  var SESSION_KEY = "orbitech.intro.played";
  var memoryFlag = false;

  var store = {
    hasPlayed: function () {
      if (memoryFlag) return true;
      try {
        return window.sessionStorage.getItem(SESSION_KEY) === "1";
      } catch (e) {
        return false;
      }
    },
    markPlayed: function () {
      memoryFlag = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch (e) {
        /* storage blocked — memoryFlag still covers this page load */
      }
    }
  };

  /* ----------------------------------------------------------------------
     Capability + preference gate
     ---------------------------------------------------------------------- */
  function prefersReducedMotion() {
    return window.matchMedia &&
           window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isLightweightDevice() {
    // Small viewport or touch-primary input → serve the static poster.
    var narrow = window.matchMedia && window.matchMedia("(max-width: 820px)").matches;
    var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    // Respect an explicit data-saving preference.
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var saveData = !!(conn && conn.saveData);
    var slowNet = !!(conn && /^(slow-2g|2g|3g)$/.test(conn.effectiveType || ""));

    // Low-powered hardware signals (both are advisory and often undefined).
    var lowCores = typeof navigator.hardwareConcurrency === "number" &&
                   navigator.hardwareConcurrency <= 4;
    var lowMemory = typeof navigator.deviceMemory === "number" &&
                    navigator.deviceMemory <= 4;

    return narrow || coarse || saveData || slowNet || (lowCores && lowMemory);
  }

  function shouldPlayIntro() {
    if (prefersReducedMotion()) return false;
    if (isLightweightDevice()) return false;
    if (store.hasPlayed()) return false;
    // No canvas support (very old browsers) → poster.
    var probe = document.createElement("canvas");
    return !!(probe.getContext && probe.getContext("2d"));
  }

  // Exposed so the inline bootstrap in index.html can unhide the overlay
  // before first paint, avoiding a flash of the hero behind it.
  window.__orbitechShouldPlayIntro = shouldPlayIntro;


  /* ======================================================================
     The sequence
     ====================================================================== */
  function IntroSequence(root) {
    this.root = root;
    this.canvas = root.querySelector(".intro__canvas");
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.skipBtn = root.querySelector(".intro__skip");
    this.progressEl = root.querySelector(".intro__progress");
    this.captionEl = root.querySelector(".intro__caption");
    this.identityEl = root.querySelector(".intro__identity");

    this.DURATION = 3300;
    this.PHASES = [
      { at: 0,    caption: "Human expertise. Intelligent systems." },
      { at: this.DURATION * 1700 / 5200, caption: "Intelligent data. Innovative software." },
      { at: this.DURATION * 3200 / 5200, caption: "Limitless possibilities." },
      { at: this.DURATION * 4200 / 5200, caption: "" }
    ];

    this.elapsed = 0;
    this.lastTs = 0;
    this.rafId = null;
    this.dismissed = false;
    this.currentPhase = -1;

    this.stars = [];
    this.nebulae = [];
    this.travel = 0;       // integrated distance, drives the star field

    this.onResize = this.resize.bind(this);
    this.onVisibility = this.handleVisibility.bind(this);
    this.onKeydown = this.handleKeydown.bind(this);
    this.tick = this.tick.bind(this);
    this.onSkip = this.requestSkip.bind(this);
    this.onMotionChange = this.handleMotionChange.bind(this);
  }

  IntroSequence.prototype.start = function () {
    store.markPlayed();

    this.resize();
    this.seedStars();
    this.seedNebulae();
    this.cacheNebulae();

    document.body.classList.add("is-intro-locked");

    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    document.addEventListener("keydown", this.onKeydown);
    this.skipBtn.addEventListener("click", this.onSkip);
    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (this.motionQuery.addEventListener) this.motionQuery.addEventListener("change", this.onMotionChange);
    this.main = document.getElementById("main");
    if (this.main) this.main.inert = true;

    // Move focus to the skip control so keyboard users can escape at once.
    try { this.skipBtn.focus({ preventScroll: true }); } catch (e) { this.skipBtn.focus(); }

    this.rafId = requestAnimationFrame(this.tick);
  };

  /* --- Sizing ---------------------------------------------------------- */

  IntroSequence.prototype.resize = function () {
    // Cap DPR at 2: beyond that the pixel cost outweighs the visible gain.
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth || window.innerWidth;
    this.h = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cx = this.w / 2;
    this.cy = this.h / 2;
    // Focal length scaled to viewport so framing is consistent at any size.
    this.focal = Math.max(this.w, this.h) * 0.9;
    this.measureLogoTarget();
    if (this.nebulae.length) this.cacheNebulae();
  };

  IntroSequence.prototype.measureLogoTarget = function () {
    var heroLogo = document.querySelector(".hero__logo");
    this.logoTarget = null;
    if (heroLogo) {
      var rect = heroLogo.getBoundingClientRect();
      this.logoTarget = { left: rect.left, top: rect.top,
        width: rect.width, height: rect.height };
    }
  };

  /* --- Scene construction ----------------------------------------------- */

  IntroSequence.prototype.seedStars = function () {
    // Density scaled to area, clamped so huge monitors don't tank the frame rate.
    var count = Math.round(
      Math.min(680, Math.max(260, (this.w * this.h) / 2600))
    );
    this.stars = new Array(count);

    for (var i = 0; i < count; i++) {
      this.stars[i] = this.makeStar(Math.random() * 2.6 + 0.05);
    }
  };

  IntroSequence.prototype.makeStar = function (z) {
    // Distribute in a wide box in "world" units; projection does the rest.
    return {
      x: (Math.random() - 0.5) * 2.4,
      y: (Math.random() - 0.5) * 2.4,
      z: z,
      // A little colour variance keeps the field from looking like static.
      hue: Math.random() < 0.14 ? (Math.random() < 0.5 ? 190 : 258) : 0,
      mag: Math.random() * 0.7 + 0.35,
      px: null,
      py: null
    };
  };

  IntroSequence.prototype.seedNebulae = function () {
    // Soft coloured clouds. Positions are viewport-relative fractions.
    /* Positions and alphas mirror the gradients on `.hero__backdrop`, so the
       colour field the sequence ends on is the one the static hero already
       has. Keep these in step if you restyle the hero backdrop. */
    this.nebulae = [
      { fx: 0.12, fy: 0.08, r: 0.58, col: [139, 124, 255], a: 0.16, drift: -0.4 },
      { fx: 0.88, fy: 0.22, r: 0.52, col: [79, 216, 232],  a: 0.11, drift: 0.5 },
      { fx: 0.50, fy: 1.08, r: 0.84, col: [79, 216, 232],  a: 0.21, drift: 0.2 },
      { fx: 0.26, fy: 0.60, r: 0.44, col: [139, 124, 255], a: 0.09, drift: -0.3 }
    ];
  };

  IntroSequence.prototype.cacheNebulae = function () {
    var canvas = document.createElement("canvas");
    // A soft field needs no retina-resolution buffer.
    canvas.width = Math.max(1, Math.round(this.w * 0.5));
    canvas.height = Math.max(1, Math.round(this.h * 0.5));
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(0.5, 0.5);
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < this.nebulae.length; i++) {
      var neb = this.nebulae[i];
      var x = neb.fx * this.w, y = neb.fy * this.h;
      var radius = neb.r * Math.max(this.w, this.h);
      var c = neb.col.join(",");
      var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(" + c + "," + neb.a + ")");
      gradient.addColorStop(0.45, "rgba(" + c + "," + neb.a * 0.32 + ")");
      gradient.addColorStop(1, "rgba(" + c + ",0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.w, this.h);
    }
    this.nebulaCanvas = canvas;
  };

  IntroSequence.prototype.drawOrbits = function (ms) {
    var enter = easeOutCubic(clamp(ms / 1300, 0, 1));
    var leave = 1 - easeInOutCubic(clamp((ms - 3000) / 1300, 0, 1));
    if (leave <= 0) return;
    var ctx = this.ctx;
    var radius = Math.min(this.w * 0.28, this.h * 0.36, 340);
    ctx.save();
    ctx.translate(this.cx, this.h * 0.48);
    ctx.globalAlpha = enter * leave;
    var gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
    gradient.addColorStop(0, "#7561ff");
    gradient.addColorStop(0.5, "#348aff");
    gradient.addColorStop(1, "#17c7de");
    for (var ring = 0; ring < 3; ring++) {
      ctx.save();
      ctx.rotate(-0.45 + ring * 0.65 + ms * 0.000025);
      var r = radius * (1 + ring * 0.16);
      ctx.strokeStyle = "rgba(130,170,235,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.47, 0, 0, Math.PI * 2);
      ctx.stroke();
      var angle = ms * 0.00075 * (ring % 2 ? -1 : 1) + ring * 2.1;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.47, 0, angle - enter * 1.8, angle);
      ctx.stroke();
      var x = Math.cos(angle) * r, y = Math.sin(angle) * r * 0.47;
      var glow = ctx.createRadialGradient(x, y, 0, x, y, 18);
      glow.addColorStop(0, "rgba(79,216,232,0.55)");
      glow.addColorStop(1, "rgba(79,216,232,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(x - 18, y - 18, 36, 36);
      ctx.fillStyle = ring === 0 ? "#b5a5ff" : "#a3f1ff";
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  };

  IntroSequence.prototype.positionIdentity = function (ms) {
    if (!this.identityEl) return;
    ms = ms * 5200 / this.DURATION;
    // Font loading or a resized viewport can change the hero's geometry.
    // Measure the actual resting logo, rather than landing on a stale box.
    this.measureLogoTarget();
    var t = easeInOutCubic(clamp((ms - 3300) / 1500, 0, 1));
    var initialWidth = Math.min(560, Math.max(320, this.w * 0.38));
    var target = this.logoTarget;
    var x = this.cx, y = this.h * 0.48, width = initialWidth;
    if (target) {
      x += (target.left + target.width / 2 - x) * t;
      y += (target.top + target.height / 2 - y) * t;
      width += (target.width - width) * t;
    }
    // Layout stays fixed; transforms handle all movement and scaling.
    this.identityEl.style.left = this.cx + "px";
    this.identityEl.style.top = this.h * 0.48 + "px";
    this.identityEl.style.width = initialWidth + "px";
    this.identityEl.style.opacity = easeOutCubic(clamp((ms - 500) / 1100, 0, 1));
    this.identityEl.style.transform = "translate(-50%, -50%) translate(" +
      (x - this.cx).toFixed(2) + "px," + (y - this.h * 0.48).toFixed(2) +
      "px) scale(" + (width / initialWidth).toFixed(4) + ")";
  };

  /* --- Motion curves ----------------------------------------------------- */

  // Speed of travel through the field, as a function of elapsed ms.
  IntroSequence.prototype.speedAt = function (ms) {
    ms = ms * 5200 / this.DURATION;
    return 0.07 + 0.85 * bell(ms, 2450, 850);
  };

  /* --- Frame loop --------------------------------------------------------- */

  IntroSequence.prototype.tick = function (ts) {
    if (this.dismissed) return;

    if (!this.lastTs) this.lastTs = ts;
    // Clamp dt so a stalled tab or a slow frame can't teleport the camera.
    var dt = Math.min(ts - this.lastTs, 48);
    this.lastTs = ts;
    this.elapsed += dt;

    var ms = this.elapsed;
    this.travel += this.speedAt(ms) * (dt / 1000);

    this.draw(ms, dt);
    this.updateChrome(ms);

    if (ms >= this.DURATION) {
      this.dismiss(false);
      return;
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  IntroSequence.prototype.draw = function (ms, dt) {
    // Keep all scene beats proportional when the total duration changes.
    var sceneMs = ms * 5200 / this.DURATION;
    var ctx = this.ctx;
    var w = this.w, h = this.h;

    // --- Deep space base -------------------------------------------------
    ctx.fillStyle = "#03050b";
    ctx.fillRect(0, 0, w, h);

    // Cache the large gradients once, rather than rasterising them every frame.
    if (this.nebulaCanvas) ctx.drawImage(this.nebulaCanvas, 0, 0, w, h);

    // --- Star field --------------------------------------------------------
    var speed = this.speedAt(ms);
    // Streaks only appear once we're genuinely moving.
    var streaking = speed > 0.7;
    var dz = speed * (dt / 1000);

    ctx.lineCap = "round";

    for (var i = 0; i < this.stars.length; i++) {
      var s = this.stars[i];
      s.z -= dz;

      // Recycle stars that pass the camera back out to the far plane.
      if (s.z <= 0.035) {
        this.stars[i] = this.makeStar(2.6 + Math.random() * 0.4);
        continue;
      }

      var scale = this.focal / (s.z * this.focal);
      var sx = this.cx + s.x * this.focal / s.z;
      var sy = this.cy + s.y * this.focal / s.z;

      if (sx < -80 || sx > w + 80 || sy < -80 || sy > h + 80) {
        s.px = s.py = null;
        continue;
      }

      // Nearer stars are bigger and brighter.
      var depth = clamp(1 - s.z / 2.8, 0, 1);
      var alpha = clamp(depth * 1.15 * s.mag, 0, 1);
      var size = 0.45 + depth * 2.0;

      var colour = s.hue === 0
        ? "rgba(255,255,255," + alpha.toFixed(3) + ")"
        : (s.hue === 190
            ? "rgba(150,232,246," + alpha.toFixed(3) + ")"
            : "rgba(178,166,255," + alpha.toFixed(3) + ")");

      if (streaking && s.px !== null) {
        ctx.strokeStyle = colour;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        ctx.fillStyle = colour;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }

      s.px = sx;
      s.py = sy;
    }

    // The shared CSS haze resolves to precisely the hero's cloud layer.
    this.root.style.setProperty("--nebula-opacity",
      easeOutCubic(clamp((sceneMs - 2400) / 2300, 0, 1)).toFixed(4));
    this.drawOrbits(sceneMs);
    this.positionIdentity(ms);

    // --- Warp bloom -------------------------------------------------------
    // A brief centred flare at peak speed sells the acceleration.
    var bloom = bell(sceneMs, 2500, 650) * 0.12;
    if (bloom > 0.01) {
      var bg = ctx.createRadialGradient(
        this.cx, this.cy, 0, this.cx, this.cy, Math.max(w, h) * 0.55);
      bg.addColorStop(0, "rgba(150,235,250," + (bloom * 0.55).toFixed(3) + ")");
      bg.addColorStop(0.4, "rgba(120,170,255," + (bloom * 0.16).toFixed(3) + ")");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }

    /* Deliberately NO fade-to-black at the end. The overlay's own opacity
       transition does the dissolve, and the hero backdrop underneath is built
       to match this frame — darkening the canvas first would break that. */
  };

  /* --- Skip control, captions, progress ---------------------------------- */

  IntroSequence.prototype.updateChrome = function (ms) {
    var pct = clamp(ms / this.DURATION, 0, 1) * 100;
    this.progressEl.style.transform = "scaleX(" + (pct / 100).toFixed(4) + ")";

    // Advance the caption when we cross into a new phase.
    var phase = 0;
    for (var i = 0; i < this.PHASES.length; i++) {
      if (ms >= this.PHASES[i].at) phase = i;
    }
    if (phase !== this.currentPhase) {
      this.currentPhase = phase;
      var text = this.PHASES[phase].caption;
      if (text) {
        this.captionEl.textContent = text;
        this.captionEl.classList.add("is-visible");
      } else {
        this.captionEl.classList.remove("is-visible");
      }
    }
  };

  IntroSequence.prototype.handleKeydown = function (e) {
    if (e.key === "Escape") {
      e.preventDefault();
      this.requestSkip();
    }
  };

  // Skip never forces a visitor to watch a fast-forwarded animation.
  IntroSequence.prototype.requestSkip = function () {
    this.dismiss(true);
  };

  IntroSequence.prototype.handleMotionChange = function (event) {
    if (event.matches) this.dismiss(true);
  };

  IntroSequence.prototype.handleVisibility = function () {
    if (document.hidden) {
      // Pause: drop the RAF and reset the timestamp so no time accrues.
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.lastTs = 0;
    } else if (!this.dismissed && !this.rafId) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  /* --- Teardown ----------------------------------------------------------- */

  IntroSequence.prototype.dismiss = function (skipped) {
    if (this.dismissed) return;
    this.dismissed = true;

    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;

    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    document.removeEventListener("keydown", this.onKeydown);

    this.skipBtn.removeEventListener("click", this.onSkip);
    if (this.motionQuery && this.motionQuery.removeEventListener) {
      this.motionQuery.removeEventListener("change", this.onMotionChange);
    }
    if (this.main) this.main.inert = false;
    // The canvas logo now overlaps the hero logo: reveal it without a second
    // entrance animation so the identity never flashes out and back in.
    var heroLogo = document.querySelector(".hero__logo");
    if (heroLogo) heroLogo.classList.add("is-landed");
    document.body.classList.remove("is-intro-locked");
    // Align the two identities after scroll unlock, before either is exposed.
    // The hero now fades in at its resting position; no second movement.
    if (!skipped) this.positionIdentity(this.DURATION);
    revealHero();
    this.root.classList.add("is-dismissed");
    this.root.setAttribute("aria-hidden", "true");

    // Send focus somewhere sensible so keyboard users aren't stranded on a
    // control that no longer exists.
    var target = document.getElementById("hero-title");
    if (target && this.root.contains(document.activeElement)) {
      target.setAttribute("tabindex", "-1");
      try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
    }

    document.dispatchEvent(new CustomEvent("orbitech:introdone", {
      detail: { skipped: !!skipped }
    }));

    // Remove the overlay from the DOM once its fade-out has finished, so the
    // canvas can be garbage-collected.
    var self = this;
    window.setTimeout(function () {
      if (self.root.parentNode) self.root.parentNode.removeChild(self.root);
      self.stars = null;
      self.nebulae = null;
      self.nebulaCanvas = null;
    }, 1000);
  };


  /* ======================================================================
     Helpers
     ====================================================================== */

  /**
   * Releases the hero copy. Harmless to call on paths where the copy was
   * never hidden — `intro-pending` is the only thing that hides it, and the
   * entrance rules are inert without it.
   */
  function revealHero() {
    document.documentElement.classList.add("hero-in");
  }

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function easeInQuad(t) { return t * t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  /** Gaussian-ish bump: peaks at `centre`, `width` controls the spread. */
  function bell(x, centre, width) {
    var d = (x - centre) / width;
    return Math.exp(-d * d);
  }


  /* ======================================================================
     Boot
     ====================================================================== */
  function boot() {
    var root = document.getElementById("intro");
    if (!root) return;

    // The inline bootstrap in index.html already decided whether to show the
    // overlay. If it's still hidden, this visit takes the poster path.
    if (root.hasAttribute("hidden") || !shouldPlayIntro()) {
      document.body.classList.remove("is-intro-locked");
      revealHero();
      document.dispatchEvent(new CustomEvent("orbitech:introdone", {
        detail: { skipped: true, reason: "fallback" }
      }));
      if (root.parentNode) root.parentNode.removeChild(root);
      return;
    }

    var sequence;
    try {
      sequence = new IntroSequence(root);
      sequence.start();
    } catch (error) {
      if (sequence) sequence.dismiss(true);
      else {
        document.body.classList.remove("is-intro-locked");
        revealHero();
        root.remove();
      }
      console.error("[Orbitech] Intro unavailable; showing the page.", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
