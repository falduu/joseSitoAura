/* ==========================================================================
   AURA — main.js
   Comportamento: header, menu mobile, reveal, anno footer.
   Vanilla. Zero dipendenze. Pesa meno di una favicon pesante.
   ========================================================================== */
(() => {
  'use strict';

  /* 0 · no-JS → JS. Idempotente: lo fa anche l'inline in <head>;
     qui è cintura e bretelle. */
  document.documentElement.classList.replace('no-js', 'js');

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* 1 · HEADER — stato "scrolled". Scroll passivo + un solo rAF:
         il layout non viene mai interrogato dentro l'evento. */
  const header = $('.header');
  if (header) {
    let queued = false;
    const sync = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
      queued = false;
    };
    addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(sync); }
    }, { passive: true });
    sync();   // stato corretto anche al caricamento a metà pagina
  }

  /* 2 · MENU — overlay mobile.
         Apertura: focus sul primo link. Chiusura: toggle, Esc (con focus
         restituito), click su link (senza rubare il focus), salto di
         breakpoint (altrimenti body.menu-open blocca lo scroll desktop). */
  const nav    = $('#site-nav');
  const toggle = $('.nav-toggle');
  if (nav && toggle) {
    const mq = matchMedia('(min-width: 56em)');

    const setState = (open, returnFocus) => {
      nav.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
      if (open) {
        $('.site-nav__link', nav)?.focus({ preventScroll: true });
      } else if (returnFocus) {
        toggle.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener('click', () =>
      setState(!nav.classList.contains('is-open'), false));

    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setState(false, true);
      }
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setState(false, false);
    });

    const onBreakpoint = () => {
      if (mq.matches && nav.classList.contains('is-open')) setState(false, false);
    };
    ('addEventListener' in mq)
      ? mq.addEventListener('change', onBreakpoint)
      : mq.addListener(onBreakpoint);          // Safari vecchi: addListener

    /* Tab intrappolato nel pannello: dal toggle si entra, dall'ultimo
       elemento si torna al toggle. Niente focus dietro l'overlay. */
    nav.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !nav.classList.contains('is-open')) return;
      const items = [toggle, ...$$('.site-nav__link, .site-nav__cta', nav)];
      const first = items[0];
      const last  = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
    });
  }

  /* 3 · REVEAL — IntersectionObserver: entra nell'8% inferiore della
         vista, si accende, si disosserva. Senza supporto: tutto visibile. */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-inview'));
  }

  /* 4 · ANNO FOOTER — il markup parte con "2025" statico:
         anche senza JS resta corretto fino a dicembre. */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();