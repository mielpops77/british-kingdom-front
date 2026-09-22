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
    const set = (open) => {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    const close = () => set(false);
    burger.addEventListener('click', () => {
      const open = !document.body.classList.contains('nav-open');
      set(open);
      if (open) { const first = $('a', nav); if (first) setTimeout(() => first.focus({ preventScroll: true }), 50); }
    });
    if (scrim) scrim.addEventListener('click', close);
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { close(); burger.focus(); }
    });
    // Passé en affichage large (rotation d'une tablette), le menu ouvert se referme
    window.matchMedia('(min-width: 1321px)').addEventListener('change', (m) => { if (m.matches) close(); });

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

  /* ---------- visionneuse d'images, avec zoom ----------
     Souris : un clic sur la photo zoome à l'endroit visé (un second clic
     revient), la molette zoome, on glisse pour se déplacer. Doigts : double
     touche pour zoomer, pincer pour agrandir, glisser pour se déplacer ou
     pour changer de photo quand on n'est pas zoomé. Clavier : flèches,
     + et - pour zoomer, 0 pour revenir, Échap pour fermer. */
  const ZOOM_MAX = 4, ZOOM_CLICK = 2.5;
  let lb = null, lbItems = [], lbIndex = 0, lbOpener = null;
  let z = { s: 1, x: 0, y: 0 };
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo en grand');
    lb.innerHTML =
      '<div class="lightbox__top">' +
        '<span class="lightbox__count" aria-live="polite"></span>' +
        '<div class="lightbox__tools">' +
          '<button class="icon-btn" type="button" data-lb="zoomout" aria-label="Dézoomer">' + icon('zoomout') + '</button>' +
          '<button class="icon-btn" type="button" data-lb="zoomin" aria-label="Zoomer">' + icon('zoomin') + '</button>' +
          '<button class="icon-btn" type="button" data-lb="close" aria-label="Fermer">' + icon('close') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="lightbox__stage"><img class="lightbox__img" alt="" draggable="false"></div>' +
      '<button class="icon-btn lightbox__arrow lightbox__arrow--prev" type="button" data-lb="prev" aria-label="Photo précédente">' + icon('left') + '</button>' +
      '<button class="icon-btn lightbox__arrow lightbox__arrow--next" type="button" data-lb="next" aria-label="Photo suivante">' + icon('right') + '</button>' +
      '<div class="lightbox__bottom">' +
        '<p class="lightbox__caption"></p>' +
        '<p class="lightbox__hint">' + (coarse ? 'Touchez deux fois ou pincez pour zoomer' : 'Cliquez sur la photo pour zoomer, molette pour ajuster') + '</p>' +
        '<div class="lightbox__thumbs"></div>' +
      '</div>';
    document.body.appendChild(lb);

    lb.addEventListener('click', (e) => {
      const act = e.target.closest('[data-lb]');
      if (act) {
        const a = act.dataset.lb;
        if (a === 'close') closeLb();
        if (a === 'prev') showLb(lbIndex - 1);
        if (a === 'next') showLb(lbIndex + 1);
        if (a === 'zoomin') zoomAt(Math.min(ZOOM_MAX, z.s * 1.6));
        if (a === 'zoomout') zoomAt(Math.max(1, z.s / 1.6));
        return;
      }
      const th = e.target.closest('[data-lb-thumb]');
      if (th) { showLb(Number(th.dataset.lbThumb)); return; }
      // Un clic à côté de la photo ferme la visionneuse. Un clic SUR la photo sert au zoom :
      // la capture du pointeur fait arriver ce clic sur le cadre, d'où la mémoire du point de départ.
      const stage = $('.lightbox__stage', lb);
      if ((e.target === lb || e.target === stage) && stage.dataset.downOn !== 'img' && z.s === 1) closeLb();
    });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
      else if (e.key === '+' || e.key === '=') zoomAt(Math.min(ZOOM_MAX, z.s * 1.6));
      else if (e.key === '-') zoomAt(Math.max(1, z.s / 1.6));
      else if (e.key === '0') zoomAt(1);
      else if (e.key === 'Tab') { // la tabulation reste dans la visionneuse
        const f = $$('button:not([hidden])', lb).filter((b) => b.offsetParent);
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.addEventListener('resize', () => { if (!lb.hidden) applyZoom(); });
    setupZoomGestures($('.lightbox__stage', lb), $('.lightbox__img', lb));
    return lb;
  }

  /** Applique l'échelle et le décalage, sans laisser la photo quitter le cadre. */
  function applyZoom(animate) {
    const img = $('.lightbox__img', lb), stage = $('.lightbox__stage', lb);
    const maxX = Math.max(0, (img.offsetWidth * z.s - stage.clientWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * z.s - stage.clientHeight) / 2);
    z.x = Math.min(maxX, Math.max(-maxX, z.x));
    z.y = Math.min(maxY, Math.max(-maxY, z.y));
    img.style.transition = animate === false ? 'none' : '';
    img.style.transform = 'translate(' + z.x + 'px, ' + z.y + 'px) scale(' + z.s + ')';
    lb.classList.toggle('is-zoomed', z.s > 1.01);
  }
  /** Zoome vers l'échelle s en gardant immobile le point (px, py), relatif au centre du cadre. */
  function zoomAt(s, px, py, animate) {
    const old = z.s;
    s = Math.min(ZOOM_MAX, Math.max(1, s));
    px = px || 0; py = py || 0;
    z.x = px - (s / old) * (px - z.x);
    z.y = py - (s / old) * (py - z.y);
    z.s = s;
    if (s === 1) { z.x = 0; z.y = 0; }
    applyZoom(animate);
  }

  function setupZoomGestures(stage, img) {
    const pts = new Map();
    let start = null, pinch = null, lastTap = 0, moved = false;
    const rel = (e) => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 }; };

    stage.addEventListener('pointerdown', (e) => {
      if (e.target !== img && e.target !== stage) return;
      stage.dataset.downOn = e.target === img ? 'img' : 'stage';
      stage.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = false;
      if (pts.size === 1) start = { x: e.clientX, y: e.clientY, zx: z.x, zy: z.y, t: Date.now(), type: e.pointerType, onImg: e.target === img };
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const r = stage.getBoundingClientRect();
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: z.s,
          cx: (a.x + b.x) / 2 - r.left - r.width / 2, cy: (a.y + b.y) / 2 - r.top - r.height / 2 };
      }
    });
    stage.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2 && pinch) {
        const [a, b] = [...pts.values()];
        zoomAt(pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d, pinch.cx, pinch.cy, false);
        moved = true;
        return;
      }
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      if (z.s > 1) { z.x = start.zx + dx; z.y = start.zy + dy; applyZoom(false); lb.classList.add('is-dragging'); }
    });
    const end = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      lb.classList.remove('is-dragging');
      if (pts.size < 2) pinch = null;
      if (pts.size > 0 || !start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y, dt = Date.now() - start.t;
      const p = rel(e);
      if (!moved && e.type === 'pointerup' && (start.onImg || z.s > 1)) {
        if (start.type === 'mouse') zoomAt(z.s > 1 ? 1 : ZOOM_CLICK, p.x, p.y);
        else if (Date.now() - lastTap < 320) { zoomAt(z.s > 1 ? 1 : ZOOM_CLICK, p.x, p.y); lastTap = 0; }
        else lastTap = Date.now();
      } else if (z.s === 1 && start.type !== 'mouse' && dt < 600 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        showLb(lbIndex + (dx < 0 ? 1 : -1)); // balayage : photo suivante ou précédente
      }
      start = null;
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const p = rel(e);
      zoomAt(z.s * Math.exp(-e.deltaY * 0.0018), p.x, p.y, false);
    }, { passive: false });
  }

  function showLb(i) {
    if (!lbItems.length) return;
    lbIndex = (i + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    const img = $('.lightbox__img', lb);
    z = { s: 1, x: 0, y: 0 };
    img.style.transform = '';
    lb.classList.remove('is-zoomed');
    img.classList.remove('is-in'); void img.offsetWidth; img.classList.add('is-in');
    img.src = item.src;
    img.alt = item.alt || '';
    const multi = lbItems.length > 1;
    $('.lightbox__count', lb).textContent = multi ? (lbIndex + 1) + ' / ' + lbItems.length : '';
    $('.lightbox__caption', lb).textContent = item.alt || '';
    $$('.lightbox__arrow', lb).forEach((b) => { b.hidden = !multi; });
    const strip = $('.lightbox__thumbs', lb);
    if (strip.dataset.for !== String(lbItems.length) + lbItems[0].src) {
      strip.dataset.for = String(lbItems.length) + lbItems[0].src;
      strip.innerHTML = multi ? lbItems.map((it, k) => '<button type="button" data-lb-thumb="' + k + '" aria-label="Photo ' + (k + 1) + '"><img src="' + it.src + '" alt="" loading="lazy"></button>').join('') : '';
    }
    $$('[data-lb-thumb]', strip).forEach((b, k) => b.setAttribute('aria-current', String(k === lbIndex)));
    const on = $$('[data-lb-thumb]', strip)[lbIndex];
    if (on) strip.scrollTo({ left: on.offsetLeft - strip.clientWidth / 2 + on.clientWidth / 2, behavior: 'smooth' });
    // On charge d'avance les photos voisines
    [lbIndex + 1, lbIndex - 1].forEach((k) => { const it = lbItems[(k + lbItems.length) % lbItems.length]; if (it) { const pre = new Image(); pre.src = it.src; } });
  }
  function openLb(items, index) {
    if (!items || !items.length) return;
    ensureLightbox();
    lbOpener = document.activeElement;
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
    if (lbOpener && lbOpener.focus) lbOpener.focus();
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

  /**
   * Une photo principale et ses miniatures : la miniature touchée passe en
   * grand ; la grande photo s'ouvre dans la visionneuse, où l'on peut zoomer.
   * Sur téléphone, on glisse sur la grande photo pour passer à la suivante.
   *   [data-stage] > [data-stage-main] img, [data-stage-thumb][data-full],
   *   [data-stage-nav="-1|1"], [data-stage-count]
   */
  function bindStage(root, name) {
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';
    const main = $('[data-stage-main]', root);
    const img = main && $('img', main);
    if (!main || !img) return;
    const thumbs = $$('[data-stage-thumb]', root);
    const row = thumbs.length ? thumbs[0].parentElement : null;
    const items = thumbs.length ? thumbs.map((t) => ({ src: t.dataset.full, alt: name || '' })) : [{ src: img.getAttribute('src'), alt: name || '' }];
    const count = $('[data-stage-count]', root);
    let cur = 0, swiped = false;
    function show(i) {
      cur = (i + items.length) % items.length;
      img.classList.remove('is-in'); void img.offsetWidth; img.classList.add('is-in');
      img.src = items[cur].src;
      img.alt = (name ? name + ', photo ' : 'Photo ') + (cur + 1) + ' sur ' + items.length;
      thumbs.forEach((t, k) => t.setAttribute('aria-current', String(k === cur)));
      if (count) count.textContent = (cur + 1) + ' / ' + items.length;
      const t = thumbs[cur];
      if (t && row) row.scrollTo({ left: t.offsetLeft - row.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' });
    }
    thumbs.forEach((t, k) => t.addEventListener('click', () => show(k)));
    $$('[data-stage-nav]', root).forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); show(cur + Number(b.dataset.stageNav)); }));
    main.addEventListener('click', (e) => {
      if (swiped || e.target.closest('[data-stage-nav]')) return;
      openLb(items, cur);
    });
    main.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(items, cur); }
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
    let sx = null, sy = 0;
    main.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
    main.addEventListener('touchend', (e) => {
      if (sx == null || items.length < 2) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        show(cur + (dx < 0 ? 1 : -1));
        swiped = true; setTimeout(() => { swiped = false; }, 450);
      }
    }, { passive: true });
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
    crown: '<path d="M3 18h18M4 15l-1-8 5 4 4-7 4 7 5-4-1 8Z" fill="currentColor" stroke-width="1.2"/>',
    zoomin: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/>',
    zoomout: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M8 11h6"/>',
    expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.4-1.9l-.3-.8a1.6 1.6 0 0 1 1.5-2.3H17a4 4 0 0 0 4-4c0-5-4-9-9-9Z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10" cy="7" r="1.1"/><circle cx="14.5" cy="7" r="1.1"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    cake: '<path d="M4 21h16M5 21v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 17c2 1.3 3.5 1.3 5 0s3-1.3 5 0 3 1.3 4 0M12 13V9"/><path d="M12 6.5c.9 0 1.5-.6 1.5-1.4S12 2.5 12 2.5s-1.5 1.8-1.5 2.6c0 .8.6 1.4 1.5 1.4Z"/>',
    male: '<circle cx="10" cy="14" r="5"/><path d="m14 10 6-6M15 4h5v5"/>',
    female: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
    facebook: '<path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2a1 1 0 0 1 1-1Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor"/>',
    tiktok: '<path d="M15 4c.6 2.5 2.2 3.8 4.5 4v3c-1.7 0-3.3-.5-4.5-1.5V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3.1a2.5 2.5 0 1 0 1.5 2.3V4Z"/>'
  };
  function icon(name, size) {
    const s = size || 24;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  /* ---------- formulaires : contact et liste d'attente ----------
     Les deux passent par le même envoi de l'API (formulaire de contact).
     Pour la liste d'attente, le sexe et la robe souhaités sont ajoutés en
     tête du message et le sujet est fixé à « Liste d'attente ». */
  function setupForms() {
    $$('form[data-form]').forEach(setupForm);
  }
  function setupForm(form) {
    const kind = form.dataset.form;
    const out = $('[data-result]', form);
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
      const val = (n) => (form.elements[n] ? String(form.elements[n].value || '').trim() : '');
      let subject = val('subject');
      let message = val('message');
      if (kind === 'waitlist') {
        subject = 'Liste d\'attente';
        const wish = [val('sexe') ? 'Chaton recherché : ' + val('sexe') : '', val('robe') ? 'Robe souhaitée : ' + val('robe') : ''].filter(Boolean).join('\n');
        message = (wish ? wish + '\n\n' : '') + message;
      }
      try {
        await window.BK.api.contact({ name: val('name'), email: val('email'), num: val('num'), subject, message });
        out.className = 'notice notice--ok';
        out.textContent = kind === 'waitlist'
          ? 'Merci ! Votre demande est bien arrivée. Nous vous recontactons pour en parler avant tout versement.'
          : 'Message envoyé, merci ! Nous revenons vers vous dès que possible.';
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

  /* ---------- vidéo de l'accueil ---------- */
  function setupHeroVideo() {
    const video = $('video[data-autoplay]');
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

  /* ---------- consentement aux cookies de mesure d'audience ----------
     Google Analytics ne se charge qu'après « Accepter ». Le choix est gardé
     six mois dans le navigateur ; le lien « Cookies » du pied de page rouvre
     le bandeau. Refuser est aussi simple qu'accepter, comme le demande la CNIL. */
  const CONSENT_KEY = 'bk-consent';
  const CONSENT_DAYS = 182;
  let consentMemo = null; // si le stockage est indisponible, le choix vaut pour la page

  function readConsent() {
    try {
      const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      if (c && (c.v === 'oui' || c.v === 'non') && Date.now() - c.t < CONSENT_DAYS * 86400000) return c.v;
    } catch (e) { /* stockage indisponible */ }
    return consentMemo;
  }
  function saveConsent(v) {
    consentMemo = v;
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v, t: Date.now() })); } catch (e) { /* non bloquant */ }
  }
  function gaId() { const m = $('meta[name="bk-ga"]'); return m ? m.content : ''; }
  let gaLoaded = false;
  function loadAnalytics() {
    const id = gaId();
    // Google Analytics ne mesure que le vrai site, jamais un aperçu
    if (!id || gaLoaded || !(window.BK && window.BK.officiel)) return;
    gaLoaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }
  function stopAnalytics() {
    const id = gaId();
    if (id) window['ga-disable-' + id] = true;
    // Efface les cookies _ga déjà déposés, sur le domaine et son domaine parent
    const host = location.hostname;
    const domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_ga/.test(n)).forEach((name) => {
      domains.forEach((d) => { document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : ''); });
    });
  }
  let consentBox = null;
  function showConsent() {
    if (!consentBox) {
      consentBox = document.createElement('div');
      consentBox.className = 'consent';
      consentBox.setAttribute('role', 'dialog');
      consentBox.setAttribute('aria-labelledby', 'consent-title');
      consentBox.innerHTML =
        '<p class="consent__title" id="consent-title">Un petit cookie ?</p>' +
        '<p class="consent__text">Avec votre accord, nous mesurons l’audience du site avec Google Analytics, pour savoir quelles pages vous intéressent. ' +
        'Rien d’autre. <a href="politique-confidentialite.html#cookies">En savoir plus</a></p>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--sm btn--ghost" data-consent="non">Refuser</button>' +
          '<button type="button" class="btn btn--sm btn--primary" data-consent="oui">Accepter</button>' +
        '</div>';
      document.body.appendChild(consentBox);
      consentBox.addEventListener('click', (e) => {
        const b = e.target.closest('[data-consent]');
        if (!b) return;
        const v = b.dataset.consent;
        saveConsent(v);
        if (v === 'oui') loadAnalytics(); else stopAnalytics();
        consentBox.hidden = true;
      });
    }
    consentBox.hidden = false;
  }
  function setupConsent() {
    const v = readConsent();
    if (v === 'oui') loadAnalytics();
    else if (v !== 'non') showConsent();
    $$('[data-consent-open]').forEach((b) => b.addEventListener('click', showConsent));
  }

  /* ---------- assemblage ---------- */
  function boot() {
    setupNav();
    setupReveal();
    guardImages();
    setupForms();
    setupHeroVideo();
    setupConsent();
    const tb = $('.theme-btn');
    if (tb) tb.addEventListener('click', toggleTheme);
    $$('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon, el.dataset.iconSize || 24); });
    if (window.BK) { window.BK.api.trackVisit(); window.BK.api.heartbeat(); }
  }

  window.BKUI = { $, $$, icon, setupReveal, guardImages, bindGallery, bindStage, openLb, toggleTheme };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
