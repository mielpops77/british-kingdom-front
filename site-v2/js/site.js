/* ==========================================================================
   Chatterie British Kingdom — comportements communs à toutes les pages
   Thème, navigation, apparitions, visionneuse, images de secours, formulaire.
   ========================================================================== */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- thème clair / sombre ---------- */
  const THEME_KEY = 'bk-theme';
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') document.documentElement.setAttribute('data-theme', saved);
  } catch (e) { /* stockage indisponible : on garde le thème du système */ }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = current ? current === 'dark' : systemDark;
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* non bloquant */ }
  }

  /* ---------- navigation mobile ---------- */
  function setupNav() {
    const burger = $('.burger');
    const nav = $('.nav');
    const scrim = $('.nav-scrim');
    if (!burger || !nav) return;
    const close = () => {
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    if (scrim) scrim.addEventListener('click', close);
    nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const header = $('.site-header');
    if (header) {
      const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ---------- apparitions au défilement ---------- */
  function setupReveal(root) {
    const items = $$('.reveal:not(.in)', root || document);
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px 6% 0px', threshold: 0.02 });
    items.forEach((el) => io.observe(el));
    // Filet de sécurité : si pour une raison quelconque l'observateur n'a pas
    // déclenché, on affiche tout au bout de trois secondes. Une page ne doit
    // jamais rester blanche.
    setTimeout(() => items.forEach((el) => el.classList.add('in')), 3000);
  }

  /* ---------- images : secours si le fichier manque ---------- */
  const FALLBACK = 'img/cat-silhouette.svg';
  function guardImages(root) {
    $$('img[data-guard]', root || document).forEach((img) => {
      if (img.dataset.guarded) return;
      img.dataset.guarded = '1';
      const fail = () => {
        img.classList.add('img-missing');
        const box = img.closest('.arch, .tile, .card__media, .gallery button');
        // On ajoute la silhouette sans effacer le contenu du bloc : une tuile
        // garde ainsi son titre et une carte ses pastilles d'état.
        if (box && !box.querySelector('.img-fallback')) {
          const ph = document.createElement('div');
          ph.className = 'img-fallback';
          ph.setAttribute('aria-hidden', 'true');
          box.insertBefore(ph, box.firstChild);
        }
      };
      if (!img.getAttribute('src')) { fail(); return; }
      img.addEventListener('error', fail, { once: true });
    });
  }

  /* ---------- visionneuse d'images ---------- */
  let lb = null, lbItems = [], lbIndex = 0;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo en grand');
    lb.innerHTML =
      '<div class="lightbox__bar"><button class="icon-btn" data-lb="close" aria-label="Fermer">' + icon('close') + '</button></div>' +
      '<img alt="">' +
      '<div class="lightbox__nav">' +
        '<button class="icon-btn" data-lb="prev" aria-label="Photo précédente">' + icon('left') + '</button>' +
        '<button class="icon-btn" data-lb="next" aria-label="Photo suivante">' + icon('right') + '</button>' +
      '</div>' +
      '<p class="lightbox__caption"></p>';
    document.body.appendChild(lb);
    lb.addEventListener('click', (e) => {
      const act = e.target.closest('[data-lb]');
      if (act) {
        const a = act.dataset.lb;
        if (a === 'close') closeLb();
        if (a === 'prev') showLb(lbIndex - 1);
        if (a === 'next') showLb(lbIndex + 1);
        return;
      }
      if (e.target === lb) closeLb();
    });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    });
    return lb;
  }
  function showLb(i) {
    if (!lbItems.length) return;
    lbIndex = (i + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    $('img', lb).src = item.src;
    $('img', lb).alt = item.alt || '';
    $('.lightbox__caption', lb).textContent = lbItems.length > 1 ? (lbIndex + 1) + ' / ' + lbItems.length + (item.alt ? ' — ' + item.alt : '') : (item.alt || '');
    $('.lightbox__nav', lb).style.display = lbItems.length > 1 ? '' : 'none';
  }
  function openLb(items, index) {
    ensureLightbox();
    lbItems = items;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    showLb(index || 0);
    $('[data-lb="close"]', lb).focus();
  }
  function closeLb() {
    if (!lb) return;
    lb.hidden = true;
    document.body.style.overflow = '';
  }

  /** Rend une grille de photos cliquables. */
  function bindGallery(container) {
    if (!container) return;
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-index]');
      if (!btn) return;
      const items = $$('button[data-index]', container).map((b) => ({ src: b.dataset.full || $('img', b).src, alt: b.dataset.alt || '' }));
      openLb(items, Number(btn.dataset.index));
    });
  }

  /* ---------- pictogrammes en ligne ---------- */
  const ICONS = {
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    left: '<path d="M15 18 9 12l6-6"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    shield: '<path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
    home: '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 21v-8h6v8"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
    stetho: '<path d="M6 3v6a6 6 0 0 0 12 0V3"/><path d="M6 3H4m14 0h2"/><circle cx="18" cy="16" r="3"/><path d="M12 15v-2"/>',
    book: '<path d="M4 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4Z"/><path d="M20 4h-3a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    facebook: '<path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2a1 1 0 0 1 1-1Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor"/>',
    tiktok: '<path d="M15 4c.6 2.5 2.2 3.8 4.5 4v3c-1.7 0-3.3-.5-4.5-1.5V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3.1a2.5 2.5 0 1 0 1.5 2.3V4Z"/>'
  };
  function icon(name, size) {
    const s = size || 24;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  /* ---------- formulaire de contact ---------- */
  function setupContactForm() {
    const form = $('#contact-form');
    if (!form) return;
    const out = $('#contact-result');
    const submit = $('button[type="submit"]', form);

    const rules = {
      name: (v) => v.trim().length >= 2 || 'Merci d’indiquer votre nom.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) || 'Cette adresse e-mail ne semble pas valide.',
      num: (v) => v.trim() === '' || /^(\+?\d[\d\s.-]{7,})$/.test(v.trim()) || 'Ce numéro ne semble pas valide.',
      message: (v) => v.trim().length >= 10 || 'Dites-nous en un peu plus (10 caractères minimum).'
    };

    function validateField(input) {
      const rule = rules[input.name];
      if (!rule) return true;
      const res = rule(input.value);
      const field = input.closest('.field');
      const err = $('.error', field);
      if (res === true) { field.classList.remove('invalid'); return true; }
      if (err) err.textContent = res;
      field.classList.add('invalid');
      return false;
    }

    $$('input, textarea', form).forEach((input) => {
      input.addEventListener('blur', () => { if (input.value) validateField(input); });
      input.addEventListener('input', () => {
        const field = input.closest('.field');
        if (field && field.classList.contains('invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.website && form.website.value) return; // piège à robots
      const inputs = $$('input[name], textarea[name]', form).filter((i) => rules[i.name]);
      const ok = inputs.map(validateField).every(Boolean);
      if (!ok) {
        const first = $('.field.invalid input, .field.invalid textarea', form);
        if (first) first.focus();
        return;
      }
      submit.disabled = true;
      const previous = submit.textContent;
      submit.textContent = 'Envoi…';
      out.className = 'notice';
      out.hidden = true;
      try {
        await window.BK.api.contact({
          name: form.name.value, email: form.email.value, num: form.num.value,
          subject: form.subject.value, message: form.message.value
        });
        out.className = 'notice notice--ok';
        out.textContent = 'Message envoyé. Nous vous répondons sous 48 heures, souvent bien avant.';
        out.hidden = false;
        form.reset();
      } catch (err) {
        out.className = 'notice notice--err';
        out.innerHTML = 'L’envoi a échoué. Écrivez-nous directement à <a href="mailto:chatterie.british.kingdom@gmail.com">chatterie.british.kingdom@gmail.com</a> ou appelez le 06 61 65 49 98.';
        out.hidden = false;
      } finally {
        submit.disabled = false;
        submit.textContent = previous;
        out.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  /* ---------- vidéo d'accueil ---------- */
  function setupHeroVideo() {
    const video = $('#hero-video');
    if (!video) return;
    // La vidéo est muette et décorative : on la met en pause hors écran et si
    // le visiteur a demandé moins d'animations.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.removeAttribute('autoplay');
      video.pause();
      return;
    }
    const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => (en.isIntersecting ? play() : video.pause()));
      }, { threshold: 0.15 }).observe(video);
    } else { play(); }
  }

  /* ---------- assemblage ---------- */
  function boot() {
    setupNav();
    setupReveal();
    guardImages();
    setupContactForm();
    setupHeroVideo();
    const tb = $('.theme-btn');
    if (tb) tb.addEventListener('click', toggleTheme);
    $$('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon, el.dataset.iconSize || 24); });
    if (window.BK) { window.BK.api.trackVisit(); window.BK.api.heartbeat(); }
  }

  window.BKUI = { $, $$, icon, setupReveal, guardImages, bindGallery, openLb, toggleTheme };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
