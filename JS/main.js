/* ==========================================================================
   ONNA — practice site
   1. Hero logo layout (row on wide screens, stacked on narrow)
   2. Hero lens (reveals the notebook layer; follows pointer, drifts when idle)
   3. About statement (lines darken as they arrive)
   4. Plate drift (very small parallax on the placeholder photos)
   ========================================================================== */

(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* 1. Hero logo layout ---------------------------------------------------
     Wide screens: ONNA in one row. Tall/narrow screens: ON over NA.
     The CSS class moves the letters; here we only swap the viewBox. */
  const mark = $('[data-hero-mark]');
  if (mark) {
    const stackQuery = window.matchMedia(
      '(max-width: 760px) and (orientation: portrait), (max-aspect-ratio: 4/5)'
    );
    const applyLayout = () => {
      const stacked = stackQuery.matches;
      mark.classList.toggle('is-stacked', stacked);
      mark.setAttribute('viewBox', stacked ? '-5 -1 252 299' : '-5 -1 476 149');
    };
    applyLayout();
    stackQuery.addEventListener('change', applyLayout);
  }


  /* 2. Hero lens ----------------------------------------------------------
     CSS reads --mx / --my on .hero to position the mask. After the logo has
     been drawn, the lens glides in and wanders on its own; a pointer or
     finger takes over, and it goes back to wandering after a few seconds. */
  const hero = $('.hero');
  if (hero && !reduceMotion) {
    const IDLE_AFTER = 3000;                    // ms without input before drifting
    const START_AT = performance.now() + 1500;  // wait for the logo to be written

    const lens = { x: -300, y: 0, tx: -300, ty: 0, lastInput: -Infinity };
    let visible = true;
    let running = false;

    const setTarget = (event) => {
      const box = hero.getBoundingClientRect();
      lens.tx = event.clientX - box.left;
      lens.ty = event.clientY - box.top;
      lens.lastInput = performance.now();
    };
    hero.addEventListener('pointermove', setTarget);
    hero.addEventListener('pointerdown', setTarget);
    hero.addEventListener('pointerleave', () => { lens.lastInput = performance.now(); });

    const tick = (now) => {
      if (!visible) { running = false; return; }

      const w = hero.clientWidth;
      const h = hero.clientHeight;

      if (now < START_AT) {
        lens.tx = -300;
        lens.ty = h * 0.4;
      } else if (now - lens.lastInput > IDLE_AFTER) {
        lens.tx = w * (0.5 + 0.34 * Math.sin(now / 2600));
        lens.ty = h * (0.42 + 0.18 * Math.sin(now / 3700 + 1.3));
      }

      lens.x += (lens.tx - lens.x) * 0.075;
      lens.y += (lens.ty - lens.y) * 0.075;

      hero.style.setProperty('--mx', lens.x.toFixed(1) + 'px');
      hero.style.setProperty('--my', lens.y.toFixed(1) + 'px');

      requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      requestAnimationFrame(tick);
    };

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    }).observe(hero);

    start();
  }


  /* 3. About statement ----------------------------------------------------
     Each line moves from muted to ink once, as it reaches the reading area. */
  const lines = $$('.reveal-line');
  if (lines.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      lines.forEach((line) => line.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '-10% 0px -25% 0px', threshold: 0.4 });
      lines.forEach((line) => io.observe(line));
    }
  }


  /* 4. Plate drift --------------------------------------------------------
     Reads data-drift (a small number, sign sets direction). The offset is
     measured from the plates' shared parent so it doesn't feed back on itself. */
  const drifters = $$('[data-drift]');
  if (drifters.length && !reduceMotion) {
    let queued = false;

    const update = () => {
      queued = false;
      const vh = window.innerHeight;
      drifters.forEach((el) => {
        const parent = el.parentElement.getBoundingClientRect();
        if (parent.bottom < -300 || parent.top > vh + 300) return;
        const fromCentre = parent.top + parent.height / 2 - vh / 2;
        el.style.setProperty('--dy', (fromCentre * parseFloat(el.dataset.drift)).toFixed(1) + 'px');
      });
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  }
})();
