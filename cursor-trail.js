/**
 * Mouse-following glowing orbit cursor + 3 decorative trailing dots.
 * Lerp-smoothed via requestAnimationFrame. Works with site structure.
 * Enhanced from existing main.js cursorOrbit; uses smoother easing
 * and 3 staggered trailing dots with glow.
 */
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const orbit = document.createElement('div');
  orbit.className = 'cursor-orbit';
  orbit.setAttribute('aria-hidden', 'true');
  document.body.appendChild(orbit);

  // 3 trailing decorative dots with staggered delay (0ms, 90ms, 180ms via separate tick rates)
  const trails = [
    { delay: 0.0,  ease: 0.10, size: 10, opacity: 0.55 },
    { delay: 0.08, ease: 0.08, size: 7,  opacity: 0.35 },
    { delay: 0.16, ease: 0.06, size: 4,  opacity: 0.20 }
  ];
  const trailEls = [];
  trails.forEach((cfg, i) => {
    const el = document.createElement('div');
    el.className = 'cursor-trail';
    el.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;border-radius:50%;will-change:transform;box-shadow:0 0 12px rgba(196,180,154,0.45);';
    el.style.width = cfg.size + 'px';
    el.style.height = cfg.size + 'px';
    el.style.background = 'rgba(196,180,154,' + cfg.opacity + ')';
    document.body.appendChild(el);
    trailEls.push({ el, ease: cfg.ease, tx: window.innerWidth/2, ty: window.innerHeight/2 });
  });

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  // Regenerate glow ring behind orbit on move (subtle pulse)
  let glowPulse = 0;
  function tick() {
    // Main orbit: smoother lerp
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    orbit.style.transform = 'translate(' + (cx - 11) + 'px,' + (cy - 11) + 'px)';

    // Trails with staggered easing and delay via separate targets
    trailEls.forEach((t, idx) => {
      // Delayed mouse target creates staggered trail effect
      // Delay scale: 0, ~8, ~16 frames via target offset
      const delayFactor = [0, 0.08, 0.16][idx] || 0;
      const targetX = mx - (mx - cx) * delayFactor; // approximate delayed target
      const targetY = my - (my - cy) * delayFactor;
      t.tx += (targetX - t.tx) * t.ease;
      t.ty += (targetY - t.ty) * t.ease;
      t.el.style.transform = 'translate(' + (t.tx - t.el.offsetWidth/2) + 'px,' + (t.ty - t.el.offsetHeight/2) + 'px)';
    });

    // Subtle glow pulse on orbit based on velocity
    const dx = mx - cx, dy = my - cy;
    const speed = Math.sqrt(dx*dx + dy*dy);
    const pulse = Math.min(1, speed / 30) * 0.4;
    orbit.style.boxShadow = '0 0 20px rgba(196,180,154,' + (0.6 + pulse) + '), 0 0 40px rgba(44,62,80,' + (0.2 + pulse*0.3) + ')';

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
