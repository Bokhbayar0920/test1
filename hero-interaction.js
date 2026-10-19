/* Hero scroll-trigger + cursor interaction — complements hero-shader.css */
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  /* --- Scroll-trigger: pause when out of viewport, resume when in --- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        hero.style.animationPlayState = '';
      } else {
        hero.style.animationPlayState = 'paused';
      }
    });
  }, { threshold: 0.05 });
  observer.observe(hero);

  /* --- Cursor interaction: move radial center slightly toward cursor --- */
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    const before = hero.querySelector('.before-glow') || document.createElement('div');
    // Subtle glow shift via CSS variables for pseudo-elements
    const x = ((cx / window.innerWidth - 0.5) * 20).toFixed(1);
    const y = ((cy / window.innerHeight - 0.5) * 20).toFixed(1);
    hero.style.setProperty('--blob-shift-x', x + 'vw');
    hero.style.setProperty('--blob-shift-y', y + 'vh');
  }, { passive: true });
})();
