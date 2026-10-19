/* ============================================
   Боловсролын Платформ — 3D Motion + ScrollTrigger
   ============================================ */
'use strict';

// --- Lenis smooth scroll ---
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis;
if (!prefersReduced && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1 });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

gsap.registerPlugin(ScrollTrigger);

// --- Mobile menu ---
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('mainNavList');
if (menuBtn && navList) {
  menuBtn.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navList.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navList.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

// --- Header scroll ---
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', (window.scrollY || 0) > 40);
}, { passive: true });

// --- 3D Cube interactive hover + mouse tilt ---
const cube3d = document.getElementById('cube3d');
if (cube3d) {
  cube3d.addEventListener('mousemove', (e) => {
    const rect = cube3d.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const rx = (e.clientY - cy) / 8; // rotate X based on vertical mouse
    const ry = (cx - e.clientX) / 8; // rotate Y based on horizontal mouse (inverted for natural feel)
    cube3d.style.transform = `rotateY(${-20 + ry}deg) rotateX(${12 - rx}deg) scale(1.05)`;
  });
  cube3d.addEventListener('mouseleave', () => {
    cube3d.style.transform = 'rotateY(-20deg) rotateX(12deg) scale(1)';
  });
}

// --- ScrollTrigger animations ---
if (!prefersReduced) {
  // Hero title reveal (staggered word blocks feel via GSAP)
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    const tlHero = gsap.timeline({
      scrollTrigger: { trigger: '#hero', start: 'top 85%', toggleActions: 'play none none none' }
    });
    tlHero.from('.hero-title', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' })
          .from('.hero-sub', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.55')
          .from('.hero-cta a', { y: 15, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.4');
  }

  // Hero parallax (subtle vertical shift)
  if (document.querySelector('.hero-text') && document.querySelector('.hero-visual')) {
    gsap.to('.hero-text', { y: -50, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.hero-visual', { y: 40, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  }

  // Categories staggered entrance
  const catGrid = document.querySelector('#categoryGrid');
  if (catGrid) {
    gsap.from('.category-card', {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#categories', start: 'top 80%', toggleActions: 'play none none none' }
    });
  }

  // Materials staggered entrance
  const matGrid = document.querySelector('#materialsGrid');
  if (matGrid) {
    gsap.from('.material-card', {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: '#materials', start: 'top 80%', toggleActions: 'play none none none' }
    });
  }

  // Progress stats + chart draw
  const stats = document.querySelector('.stats-row');
  if (stats) {
    gsap.from('.stat', {
      y: 25, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: '#progress', start: 'top 75%', toggleActions: 'play none none none' }
    });
  }

  // Progress chart line draw animation
  const chartLine = document.getElementById('chartLine');
  if (chartLine) {
    gsap.to(chartLine, {
      strokeDashoffset: 0,
      duration: 1.8,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: '#progress', start: 'top 75%', toggleActions: 'play none none none' }
    });
  }
}

// --- Search / Filter ---
function filterLessons(query) {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('#materialsGrid .material-card').forEach(card => {
    const text = (card.innerText || '').toLowerCase();
    const tags = (card.getAttribute('data-tags') || '').toLowerCase();
    card.style.display = (!q || text.includes(q) || tags.includes(q)) ? '' : 'none';
  });
  document.querySelectorAll('#categoryGrid .category-card').forEach(card => {
    card.style.display = (!q || (card.innerText || '').toLowerCase().includes(q)) ? '' : 'none';
  });
}
function filterByCategory(catName) {
  document.querySelectorAll('#categoryGrid .category-card').forEach(card => {
    const cats = (card.getAttribute('data-cats') || '').split(',');
    card.style.display = cats.includes(catName) ? '' : 'none';
  });
  document.querySelectorAll('#materialsGrid .material-card').forEach(card => {
    const tags = (card.getAttribute('data-tags') || '').split(' ');
    card.style.display = tags.some(t => t.includes(catName)) ? '' : 'none';
  });
}

// --- Dialogs ---
function openLogin() { document.getElementById('loginDialog').showModal(); }
function closeLogin() { document.getElementById('loginDialog').close(); }
function openRegister() { document.getElementById('registerDialog').showModal(); }
function closeRegister() { document.getElementById('registerDialog').close(); }
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
document.querySelectorAll('dialog').forEach(d => {
  d.addEventListener('click', (e) => {
    const rect = d.getBoundingClientRect();
    const outside = (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom);
    if (outside) d.close();
  });
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('dialog').forEach(d => { if (d.open) d.close(); }); });

// --- Decorative motion dots (tiny 3D detail) ---
// Small floating dots near hero text for decorative 3D feel
(function addDecorDots(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;top:20%;left:10%;pointer-events:none;z-index:1;';
  for(let i=0;i<5;i++){
    const dot = document.createElement('div');
    dot.style.cssText = `width:${6+i*2}px;height:${6+i*2}px;border-radius:50%;background:rgba(196,180,154,${0.15+i*0.05});position:absolute;animation:dotFloat ${4+i}s ease-in-out infinite alternate;animation-delay:${i*0.8}s;`;
    dot.style.left = `${i*40}px`; dot.style.top = `${i*30}px`;
    container.appendChild(dot);
  }
  hero.appendChild(container);
  const style = document.createElement('style');
  style.textContent = '@keyframes dotFloat{from{transform:translateY(0)}to{transform:translateY(-20px)}}';
  document.head.appendChild(style);
})();

// --- Cursor orbit tracking ---
(function cursorOrbit(){
  if(window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  const orbit = document.createElement('div');
  orbit.className = 'cursor-orbit';
  document.body.appendChild(orbit);
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let cx = mx, cy = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, {passive:true});
  function tick(){
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    orbit.style.transform = 'translate('+(cx-11)+'px,'+(cy-11)+'px)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Small trailing dots with delay
  const trails = [0.5, 0.8];
  trails.forEach((delay, i) => {
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    t.style.transition = 'transform 0.4s ease-out';
    document.body.appendChild(t);
    let tx = mx, ty = my;
    function trailTick(){
      tx += (mx - tx) * 0.08;
      ty += (my - ty) * 0.08;
      t.style.transform = 'translate('+(tx-4)+'px,'+(ty-4)+'px)';
      requestAnimationFrame(trailTick);
    }
    requestAnimationFrame(trailTick);
  });
})();
