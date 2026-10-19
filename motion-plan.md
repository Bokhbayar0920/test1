MOTION SYSTEM — COHESIVE, REFERENCE-DRIVEN, PERFORMANT

TECHNOLOGY (minimal, selective):
- GSAP 3.12 CDN + ScrollTrigger (scroll-linked scenes)
- Lenis 1.1 CDN (smooth scroll, integrates with GSAP)
- CSS transforms/opacity for micro-interactions only
- NO Three.js / WebGL / continuous animation loops / decorative blobs

SCROLL-DRIVEN SCENES (not decorative):
1. HERO → Section reveal: title chars fade in with staggered word blocks; sub fades; CTAs translate Y -20→0
2. CATEGORIES → Card grid: staggered fade-up (0.08s intervals), no loop
3. MATERIALS → Image cards: hover scale 1.01, shadow, no blur
4. PROGRESS → Dark section entrance: stats count-in, chart draws
5. FOOTER → Fade in with hierarchy

TIMING (consistent):
- Entrance: 0.8s ease-out (power3.out)
- Stagger: 0.08s between cards
- Hover micro: 0.2s ease-out
- Scroll-trigger: scrub false (not continuous); trigger once

PERFORMANCE RULES:
- Only transform/opacity (no width/height/top/left)
- No blur() effects; use subtle opacity instead
- No continuous rotate/sphere loops
- Pause/stop animations when offscreen (ScrollTrigger handle)
- Lenis smooth scroll respects reduced-motion via CSS preference

CLEANUP:
- Remove rotateCube, floatOrb, blur filters, infinite loops from CSS
- Replace with GSAP-controlled timelines per section
- Keep pure white palette, editorial typography, subtle borders
