/* ==========================================================================
   Chatterie British Kingdom — rendu des contenus venant de l'API
   Une fonction par page. Chaque page appelle BKPages.<nom>() en bas de son HTML.
   ========================================================================== */
(function () {
  'use strict';
  const { $, $$, icon, setupReveal, guardImages, bindGallery } = window.BKUI;
  const { api, fmt } = window.BK;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- mise en forme des saisies de l'administration ---------- */
  /** Espaces en trop retirés, texte tout en capitales adouci, première lettre en majuscule. */
  function cleanText(s) {
    let t = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
    if (!t) return '';
    if (t === t.toUpperCase() && /[A-Z]/.test(t)) t = t.toLowerCase();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  /** « Willy wonka » devient « Willy Wonka ». */
  const niceName = (s) => String(s || '').replace(/\s+/g, ' ').trim().replace(/(^|[\s-])(\p{Ll})/gu, (m, a, b) => a + b.toUpperCase());

  /** Extrait un code EMS entre parenthèses : "Bleu (BRI a)" -> { nom:"Bleu", ems:"BRI a" }.
      Le nom de la robe s'écrit comme une phrase : « Black Golden Shaded » devient « Black golden shaded ». */
  function splitRobe(robe) {
    const t = cleanText(robe);
    const m = t.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    const phrase = (s) => s.charAt(0) + s.slice(1).toLowerCase();
    return m ? { nom: phrase(m[1].trim()), ems: m[2].trim() } : { nom: phrase(t), ems: '' };
  }
  const shortBreed = (b) => cleanText(b).replace(/^British\s+/i, '');
  const yesNo = (v) => { const s = String(v || '').trim().toLowerCase(); return s.startsWith('o') ? 'Oui' : s.startsWith('n') ? 'Non' : ''; };
  const plural = (n, one, many) => n + ' ' + (n > 1 ? many : one);
  const byDateDesc = (key) => (a, b) => (fmt.parseDate(b[key]) || 0) - (fmt.parseDate(a[key]) || 0);

  /** Texte brut venu de l'API, rendu en paragraphes (jamais interprété comme du HTML actif). */
  function paragraphs(text, perParagraph) {
    const plain = new DOMParser().parseFromString(String(text || ''), 'text/html').body.textContent || '';
    const blocks = plain.split(/\n\s*\n|\r?\n/).map((s) => s.trim()).filter(Boolean);
    const out = [];
    blocks.forEach((b) => {
      const sentences = b.match(/[^.!?…]+[.!?…]+[»"]?\s*|[^.!?…]+$/g) || [b];
      for (let i = 0; i < sentences.length; i += (perParagraph || 3)) out.push(sentences.slice(i, i + (perParagraph || 3)).join('').trim());
    });
    return out.map((p) => '<p>' + esc(p) + '</p>').join('');
  }

  function archImg(src, alt, cls) {
    return '<div class="arch ' + (cls || '') + '">' +
      (src ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" data-guard>' : '<div class="img-fallback" aria-hidden="true"></div>') +
      '</div>';
  }

  function skeletons(n, wrapper) {
    let out = '';
    for (let i = 0; i < n; i++) {
      out += '<div><div class="skeleton skeleton--arch"></div><div class="skeleton skeleton--line" style="width:60%"></div><div class="skeleton skeleton--line" style="width:40%"></div></div>';
    }
    return wrapper ? '<div class="grid grid-3">' + out + '</div>' : out;
  }

  function empty(title, text, cta) {
    return '<div class="empty">' +
      '<div class="empty__mark" aria-hidden="true"></div>' +
      '<h3>' + esc(title) + '</h3><p>' + text + '</p>' +
      (cta ? '<p class="empty__cta">' + cta + '</p>' : '') +
      '</div>';
  }

  // Les listes arrivent déjà écrites dans la page (instantané pour les robots et les assistants d'IA) :
  // on les garde à l'écran pendant le chargement, sans squelettes, jusqu'aux données en direct.
  const hasSnapshot = (box) => !!(box && box.querySelector('[data-snapshot]'));
  const loading = (box, html) => { if (box && !hasSnapshot(box)) box.innerHTML = html; };

  function fail(container, e) {
    console.error(e);
    if (!container || hasSnapshot(container)) return;
    container.innerHTML = empty(
      'Contenu momentanément indisponible',
      'Nous n’arrivons pas à joindre notre base de données. Réessayez dans un instant, ou appelez-nous au <a href="tel:+33661654998">06 61 65 49 98</a>.'
    );
  }

  /** Marque dans le menu la rubrique d'une page qui n'y figure pas (fiche d'un chat). */
  // « males.html », « /males » et « ./males » désignent la même page (certains hébergeurs réécrivent les liens)
  const pageOf = (h) => String(h || '').split(/[?#]/)[0].replace(/^\.?\//, '').replace(/\.html$/, '') || 'index';
  function markNav(href) {
    $$('.nav a').forEach((a) => { if (pageOf(a.getAttribute('href')) === pageOf(href)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  }

  /* ---------- référencement des fiches ----------
     Une fiche (chat.html?id=116…) ne déclare rien dans son HTML : une fois le chat, le chaton, la
     portée ou l'article connu, on pose son adresse de référence (canonical) et sa description. */
  const DOMAINE = 'https://chatterie-british-kingdom.fr/';
  function referencer(chemin, description) {
    const pose = (selector, tag, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement(tag); document.head.appendChild(el); }
      Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
    };
    pose('link[rel="canonical"]', 'link', { rel: 'canonical', href: DOMAINE + chemin });
    pose('meta[property="og:url"]', 'meta', { property: 'og:url', content: DOMAINE + chemin });
    pose('meta[property="og:title"]', 'meta', { property: 'og:title', content: document.title });
    if (description) {
      const texte = String(description).replace(/\s+/g, ' ').trim();
      const court = texte.length > 170 ? texte.slice(0, 167).replace(/\s+\S*$/, '') + '…' : texte;
      pose('meta[name="description"]', 'meta', { name: 'description', content: court });
      pose('meta[property="og:description"]', 'meta', { property: 'og:description', content: court });
    }
  }

  /* ---------- la couleur des yeux, en deux petites pastilles ---------- */
  const EYES_PLURAL = { vert: 'verts', bleu: 'bleus', jaune: 'jaunes', 'doré': 'dorés', noir: 'noirs' };
  const EYE_COLORS = [[/orange|cuivr/, '#e0892c'], [/vert/, '#7aa843'], [/noisette/, '#a8843a'], [/jaune|dor|ambre/, '#e2b134'], [/bleu/, '#5b93d6'], [/marron|brun/, '#8a5a2b']];
  /** « Vairon Bleu/Marron » → « Yeux vairons », une pastille bleue et une marron (un œil chacune). */
  function eyes(raw) {
    const t = cleanText(raw).toLowerCase();
    if (!t) return null;
    const color = (s) => { const hit = EYE_COLORS.find((c) => c[0].test(s)); return hit ? hit[1] : ''; };
    const odd = /^vairons?/.test(t);
    const parts = t.replace(/^vairons?\s*/, '').split(/\s*(?:\/|,|&|\bet\b)\s*/).filter(Boolean);
    const c1 = color(parts[0] || t);
    return { label: odd ? 'Yeux vairons' : 'Yeux ' + (EYES_PLURAL[t] || t), c1, c2: odd && parts[1] ? color(parts[1]) : c1 };
  }
  function eyesLine(raw) {
    const e = eyes(raw);
    if (!e) return '';
    return '<p class="card__eyes">' +
      (e.c1 && e.c2 ? '<span class="eyes" aria-hidden="true"><i style="--c:' + e.c1 + '"></i><i style="--c:' + e.c2 + '"></i></span>' : '') +
      esc(e.label) + '</p>';
  }

  /** Ce que js/descriptions.js dit d'un chat (texte, accroche, photos mises en avant). */
  const described = (id) => (window.BK_DESCRIPTIONS || {})[id] || {};

  /* ---------- cartes ---------- */
  /** Carte d'un reproducteur : son accroche manuscrite, sa robe, son âge, ses yeux ;
      opts.parent (« Papa en ce moment »…) pose une étiquette sur la photo. */
  function catCard(cat, opts) {
    const o = opts || {};
    const r = splitRobe(cat.robe);
    const breed = shortBreed(cat.breed);
    const accroche = described(cat.id).accroche;
    return '<a class="card card--cat reveal" href="chat.html?id=' + encodeURIComponent(cat.id) + '">' +
      '<div class="card__media">' + archImg(cat.photo, 'Portrait de ' + niceName(cat.name)) +
        (breed ? '<div class="card__badges"><span class="pill pill--breed">' + esc(breed) + '</span></div>' : '') +
        (o.parent ? '<span class="card__sticker">' + icon('heart', 14) + esc(o.parent) + '</span>' : '') +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(niceName(cat.name)) + '</h3>' +
        (accroche ? '<p class="card__tagline">' + esc(accroche) + '</p>' : '') +
        '<p class="card__meta">' +
          (r.nom ? '<span>' + esc(r.nom) + '</span>' : '') +
          (cat.dateOfBirth ? '<span><b>' + esc(fmt.age(cat.dateOfBirth)) + '</b></span>' : '') +
        '</p>' +
        eyesLine(cat.eyeColor) +
      '</div></a>';
  }

  const sexMark = (sex) => sex === 'male' ? '<span class="sex sex--m" aria-hidden="true">♂</span>' : sex === 'female' ? '<span class="sex sex--f" aria-hidden="true">♀</span>' : '';

  /** L'âge d'un chaton : en semaines tant qu'il est à la chatterie, en mois ensuite. */
  function ageChaton(date) {
    const w = fmt.ageWeeks(date);
    return (w != null && w >= 1 && w < 16) ? plural(w, 'semaine', 'semaines') : fmt.age(date);
  }

  /** Les grandes étapes d'une portée (journal de la portée, « où en sont-ils » sur la page Chatons). */
  const ETAPES = [
    [0, 'Naissance', 'Les chatons naissent les yeux fermés, blottis contre leur mère. On les pèse chaque jour.'],
    [2, 'Les yeux s’ouvrent', 'D’abord bleus chez tous les chatons. Les premiers pas, un peu hésitants, arrivent.'],
    [4, 'Les découvertes', 'Premiers repas solides, apprentissage de la litière, premiers jeux avec la fratrie.'],
    [8, 'Identification et vaccins', 'Puce électronique et premières vaccinations, avec le carnet de santé.'],
    [10, 'La vie de famille', 'Visiteurs, bruits de la maison, câlins : le chaton s’habitue à tout ce qu’il retrouvera chez vous.'],
    [12, 'Le départ', 'Vers douze semaines, avec son certificat LOOF, son carnet de santé et un peu de nourriture pour les premiers jours.']
  ];
  /** L'étape que vivent les chatons à cet âge (en semaines). */
  function etapeEnCours(weeks) {
    if (weeks == null || weeks < 0) return null;
    let en = null;
    ETAPES.forEach((s) => { if (weeks >= s[0]) en = s; });
    return en;
  }
  /** « Où en sont-ils ? » : l'étape du moment, en une ligne. */
  function etapeLigne(weeks) {
    const e = etapeEnCours(weeks);
    return e ? '<p class="litter__stage">' + icon('paw', 16) + '<span><b>' + esc(e[1]) + '</b> ' + esc(e[2]) + '</span></p>' : '';
  }

  function kittenCard(k) {
    const r = splitRobe(k.robe);
    return '<a class="card card--kitten reveal" href="chaton.html?id=' + encodeURIComponent(k.id) + '">' +
      '<div class="card__media">' + archImg(k.photo, 'Photo du chaton ' + niceName(k.name)) +
        '<div class="card__badges"><span class="pill pill--' + k.status + '">' + esc(k.statusLabel) + '</span></div>' +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(niceName(k.name) || 'Chaton') + '</h3>' +
        '<p class="card__meta">' +
          (k.sexLabel ? '<span>' + sexMark(k.sex) + esc(k.sexLabel) + '</span>' : '') +
          (r.nom ? '<span>' + esc(r.nom) + '</span>' : '') +
        '</p>' +
        (k.dateOfBirth ? '<p class="card__sub">' + esc(ageChaton(k.dateOfBirth)) + (shortBreed(k.breed) ? ' · ' + esc(shortBreed(k.breed)) : '') + '</p>' : '') +
      '</div></a>';
  }

  /** Les deux parents d'une portée, face à face, avec un cœur entre eux. */
  function couple(p, cats, linked) {
    const mother = cats.find((c) => String(c.id) === String(p.idMaman));
    const father = cats.find((c) => String(c.id) === String(p.idPapa));
    const one = (cat, photo, role, ext) => {
      const name = cat ? niceName(cat.name) : (ext || '');
      const src = photo || (cat && cat.photo) || '';
      const inner =
        '<span class="couple__photo">' + (src ? '<img src="' + esc(src) + '" alt="" loading="lazy" data-guard>' : '<span class="img-fallback" aria-hidden="true"></span>') + '</span>' +
        '<span class="couple__role">' + role + '</span>' +
        (name ? '<span class="couple__name">' + esc(name) + '</span>' : '') +
        (cat ? '<span class="couple__robe">' + esc(splitRobe(cat.robe).nom) + '</span>' : (ext ? '<span class="couple__robe">Saillie extérieure</span>' : ''));
      return linked && cat ? '<a class="couple__one" href="chat.html?id=' + encodeURIComponent(cat.id) + '">' + inner + '</a>' : '<span class="couple__one">' + inner + '</span>';
    };
    return '<div class="couple">' + one(father, p.fatherPhoto, 'Papa', p.externalFatherName) +
      '<span class="couple__heart" aria-hidden="true">' + icon('heart', 18) + '</span>' +
      one(mother, p.motherPhoto, 'Maman') + '</div>';
  }

  function litterStatus(p) {
    return p.available ? '<span class="pill pill--disponible">' + plural(p.available, 'disponible', 'disponibles') + '</span>'
      : '<span class="pill pill--vendu">Complète</span>';
  }

  /** Carte d'une portée (accueil, fiche d'un parent) : le couple, puis l'essentiel. */
  function litterCard(p, cats) {
    return '<a class="litter-card reveal" href="portee.html?id=' + encodeURIComponent(p.id) + '">' +
      couple(p, cats, false) +
      '<span class="litter-card__name">' + esc(p.name || 'Portée') + '</span>' +
      '<span class="litter-card__meta">' + (p.dateOfBirth ? 'Nés le ' + esc(fmt.date(p.dateOfBirth)) + ' · ' : '') + plural(p.chatons.length, 'chaton', 'chatons') + '</span>' +
      litterStatus(p) +
      '</a>';
  }

  function postCard(p, i) {
    return '<a class="card card--post reveal" data-delay="' + (i % 3) + '" href="article.html?slug=' + encodeURIComponent(p.slug) + '">' +
      '<div class="card__media">' + archImg(p.cover, p.title, 'arch--landscape') +
        (p.category ? '<div class="card__badges"><span class="pill pill--breed">' + esc(p.category) + '</span></div>' : '') + '</div>' +
      '<div class="card__body"><h3 class="card__title">' + esc(p.title) + '</h3>' +
      '<p class="card__meta"><span>' + esc(fmt.date(p.date)) + '</span>' + (p.readingTime ? '<span>' + p.readingTime + ' min de lecture</span>' : '') + '</p>' +
      (p.excerpt ? '<p class="card__excerpt">' + esc(p.excerpt) + '</p>' : '') +
      '</div></a>';
  }

  /* ======================================================================
     ACCUEIL
     ====================================================================== */
  async function accueil() {
    const littersBox = $('#home-litters');
    const kittensBox = $('#home-kittens');
    const countBox = $('#home-kitten-count');
    const heroBtn = $('#hero-kittens-btn');
    const postsBox = $('#home-posts');
    loading(kittensBox, '<div class="grid grid-4">' + skeletons(4) + '</div>');

    try {
      const [portees, cats] = await Promise.all([api.portees(), api.allCats()]);
      const kittens = [];
      portees.forEach((p) => p.chatons.forEach((k) => kittens.push(k)));
      const available = kittens.filter((k) => k.status === 'disponible');

      if (countBox) {
        countBox.textContent = !portees.length
          ? 'Pas de portée en ce moment : inscrivez-vous sur la liste d’attente pour être prévenu en premier.'
          : (portees.length === 1 ? 'Une portée' : portees.length + ' portées') + ' à la maison en ce moment, ' +
            (available.length ? plural(available.length, 'chaton disponible', 'chatons disponibles') + '.' : 'et tous nos chatons sont réservés.');
      }
      if (heroBtn && available.length) {
        heroBtn.textContent = available.length > 1 ? 'Voir les ' + available.length + ' chatons disponibles' : 'Voir le chaton disponible';
      }
      if (littersBox) {
        littersBox.innerHTML = portees.length ? '<div class="couples">' + portees.map((p) => litterCard(p, cats)).join('') + '</div>' : '';
      }
      if (kittensBox) {
        // Un chaton de chaque portée à tour de rôle : toutes les portées sont représentées.
        const byLitter = portees.map((p) => p.chatons.filter((k) => k.status === 'disponible'));
        const mixed = [];
        for (let i = 0; byLitter.some((l) => l[i]); i++) byLitter.forEach((l) => { if (l[i]) mixed.push(l[i]); });
        const list = mixed.concat(kittens.filter((k) => k.status !== 'disponible')).slice(0, 8);
        kittensBox.innerHTML = list.length
          ? '<div class="grid grid-4 kittens">' + list.map(kittenCard).join('') + '</div>'
          : empty('Pas de chaton disponible pour le moment',
              'Nos chatons partent souvent avant d’avoir l’âge de quitter leur mère. Inscrivez-vous sur la liste d’attente pour être prévenu en premier.',
              '<a class="btn btn--primary" href="liste-attente.html">Rejoindre la liste d’attente</a>');
      }
    } catch (e) {
      fail(kittensBox, e);
      if (countBox) countBox.textContent = '';
    }

    if (postsBox) {
      try {
        const posts = (await api.posts()).sort(byDateDesc('date')).slice(0, 3);
        if (posts.length) postsBox.innerHTML = '<div class="grid grid--center">' + posts.map(postCard).join('') + '</div>';
        else { const s = postsBox.closest('section'); if (s) s.hidden = true; }
      } catch (e) { const s = postsBox.closest('section'); if (s) s.hidden = true; }
    }
    await homeGallery();
    guardImages(); setupReveal();
  }

  /* ======================================================================
     NOS MÂLES / NOS FEMELLES
     Les polaroïds du haut de la page, les cartes, les portées du moment,
     les photos mises en avant (« vitrine » de js/descriptions.js) et le
     texte de l'administration. _build/donnees.py écrit les mêmes cartes,
     autocollants et polaroïds dans la page (instantané pour les robots).
     ====================================================================== */
  /** Les photos mises en avant d'un chat, encore présentes dans sa galerie ; à défaut, ses deux premières. */
  function showcase(cat) {
    const files = cat.galleryFiles || [];
    const chosen = (described(cat.id).vitrine || []).filter((f) => files.indexOf(f) !== -1);
    return chosen.length ? chosen.map((f) => window.BK.img.gallery(f)) : cat.gallery.slice(0, 2);
  }

  /** Les autocollants du haut d'une page : [pictogramme, texte, lien facultatif]. */
  const autocollants = (items) => '<ul class="bh-stickers intro__stickers">' + items.map((it) =>
    '<li>' + icon(it[0], 18) + (it[2] ? '<a href="' + it[2] + '">' + esc(it[1]) + '</a>' : esc(it[1])) + '</li>').join('') + '</ul>';

  /** Les polaroïds en éventail du haut d'une page : [adresse, photo, prénom]. */
  const eventail = (picks) => picks.length ? '<div class="fan">' + picks.map((x) =>
    '<a class="fan__one" href="' + x[0] + '" tabindex="-1"><img src="' + esc(x[1]) + '" alt="" data-guard>' +
    '<span class="fan__name">' + esc(x[2]) + '</span></a>').join('') + '</div>' : '';

  /** Une mosaïque de photos (rangées toujours pleines) ; la visionneuse parcourt tout, même les photos sans case. */
  function mosaique(section, grid, photos) {
    if (!section || !grid || photos.length < 2) return;
    const perRow = window.matchMedia('(max-width: 699px)').matches ? 2 : 4;
    const n = Math.min(8, photos.length - (photos.length % perRow));
    if (n < 2) return;
    grid.innerHTML = photos.slice(0, n).map((p, i) =>
      '<button type="button" class="mosaic__tile reveal" data-mosaic="' + i + '" aria-label="Agrandir la photo : ' + esc(p.alt) + '">' +
      '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy" data-guard>' +
      '<span class="mosaic__caption" aria-hidden="true">' + esc(p.alt) + '</span></button>').join('');
    grid.addEventListener('click', (e) => {
      const t = e.target.closest('[data-mosaic]');
      if (t) window.BKUI.openLb(photos, Number(t.dataset.mosaic));
    });
    section.hidden = false;
    guardImages(section); setupReveal(section);
  }

  /** Une photo de chacun, à tour de rôle : la mosaïque ne commence pas par tout le même. */
  function tourDeRole(listes) {
    const out = [];
    for (let i = 0; listes.some((l) => l[i]); i++) listes.forEach((l) => { if (l[i]) out.push(l[i]); });
    return out;
  }

  /** Les autocollants du haut de la page : combien ils sont, combien de papas (ou de mamans) en ce moment, la race. */
  function sexStickers(sex, list, parents) {
    const male = sex === 'male';
    const breeds = list.map((c) => cleanText(c.breed)).filter((b, i, a) => b && a.indexOf(b) === i);
    const items = [
      ['crown', plural(list.length, male ? 'mâle' : 'femelle', male ? 'mâles' : 'femelles')],
      parents ? ['heart', plural(parents, male ? 'papa' : 'maman', male ? 'papas' : 'mamans') + ' en ce moment', '#sex-litters'] : null,
      breeds.length ? ['paw', breeds.length > 1 ? breeds.map(shortBreed).join(' et ') : breeds[0]] : null
    ].filter(Boolean);
    return autocollants(items);
  }

  /** Trois polaroïds en éventail, les parents du moment d'abord, chacun avec sa première photo mise en avant. */
  const fanPicks = (stars) => stars.map((c) => ({ c, src: showcase(c)[0] || c.photo })).filter((x) => x.src).slice(0, 3);
  const sexFan = (picks) => eventail(picks.map((x) => ['chat.html?id=' + encodeURIComponent(x.c.id), x.src, niceName(x.c.name)]));

  /** Les photos mises en avant, un chat à tour de rôle, sans celles des polaroïds. */
  function sexPhotos(list, used) {
    mosaique($('#sex-photos'), $('#sex-photos-grid'), tourDeRole(
      list.map((c) => showcase(c).filter((src) => used.indexOf(src) === -1).map((src) => ({ src, alt: niceName(c.name) })))));
  }

  function renderSex(sex, list, all, portees, box) {
    const male = sex === 'male';
    // Les portées en ligne dont l'un de ces chats est le papa (ou la maman)
    const key = male ? 'idPapa' : 'idMaman';
    const mine = portees.filter((p) => list.some((c) => String(c.id) === String(p[key])));
    const isParent = (c) => mine.some((p) => String(p[key]) === String(c.id));
    const parentLabel = male ? 'Papa en ce moment' : 'Maman en ce moment';

    box.innerHTML = '<div class="grid ' + (list.length === 4 || list.length > 6 ? 'grid-4' : 'grid-3') + ' cats">' +
      list.map((c) => catCard(c, { parent: isParent(c) ? parentLabel : '' })).join('') + '</div>';
    guardImages(box); setupReveal(box);

    const stickers = $('#cats-stickers');
    if (stickers) stickers.innerHTML = sexStickers(sex, list, list.filter(isParent).length);
    const picks = fanPicks(list.filter(isParent).concat(list.filter((c) => !isParent(c))));
    const fan = $('#cats-fan');
    if (fan) { fan.innerHTML = sexFan(picks); guardImages(fan); }

    const litters = $('#sex-litters');
    if (litters && mine.length) {
      $('#sex-litters-list').innerHTML = '<div class="couples">' + mine.map((p) => litterCard(p, all)).join('') + '</div>';
      litters.hidden = false;
      guardImages(litters); setupReveal(litters);
    }
    sexPhotos(list, picks.map((x) => x.src));
  }

  async function sexPage(sex) {
    const male = sex === 'male';
    const box = $('#cats-list');
    loading(box, skeletons(3, true));
    try {
      const [all, portees] = await Promise.all([api.allCats(), api.portees().catch(() => [])]);
      // L'ordre est celui de l'administration, comme sur le site actuel
      const list = all.filter((c) => c && !c.archivee && c.sex === sex);
      if (list.length) renderSex(sex, list, all, portees, box);
      else {
        box.innerHTML = empty(male ? 'Nos mâles arrivent bientôt sur le site' : 'Nos femelles arrivent bientôt sur le site',
          'Les fiches sont en cours de mise à jour.');
        const art = $('#cats-fan');
        if (art) art.innerHTML = '';
      }
    } catch (e) { fail(box, e); }

    // Le texte de présentation saisi dans l'administration (le même que sur le site actuel)
    try {
      const b = await api.banner();
      const title = sex === 'male' ? b.titleMales : b.titleFemelles;
      const text = sex === 'male' ? b.textMales : b.textFemelles;
      const about = $('#sex-about');
      if (about && text) {
        $('#sex-about-title').textContent = cleanText(title) || (sex === 'male' ? 'À propos de nos mâles' : 'À propos de nos femelles');
        $('#sex-about-text').innerHTML = paragraphs(text, 3);
        about.hidden = false;
        setupReveal(about);
      }
    } catch (e) { /* texte facultatif */ }
  }

  /* ======================================================================
     FICHE D'UN CHAT
     ====================================================================== */
  /**
   * Galerie « grande photo + miniatures » : la miniature touchée passe en grand,
   * la grande photo s'ouvre dans la visionneuse (avec zoom). Le fond flouté
   * reprend la photo : elle est montrée entière, sans être rognée ni entourée
   * de bandes vides, qu'elle soit en hauteur ou en largeur.
   */
  function stage(photos, name, opts) {
    const o = opts || {};
    const list = photos.filter(Boolean).filter((p, i, a) => a.indexOf(p) === i);
    const multi = list.length > 1;
    return '<div class="stage' + (o.cls ? ' ' + o.cls : '') + '" data-stage data-name="' + esc(name) + '">' +
      '<div class="stage__main" data-stage-main role="button" tabindex="0" aria-label="Agrandir la photo de ' + esc(name) + '">' +
        (list[0]
          ? '<img src="' + esc(list[0]) + '" alt="' + esc(name + (multi ? ', photo 1 sur ' + list.length : '')) + '" data-guard' + (o.eager ? ' fetchpriority="high"' : ' loading="lazy"') + '>'
          : '<div class="img-fallback" aria-hidden="true"></div>') +
        (o.badge || '') +
        (multi ? '<span class="stage__count" data-stage-count>1 / ' + list.length + '</span>' : '') +
        (list[0] ? '<span class="stage__zoom" aria-hidden="true">' + icon('zoomin', 18) + '</span>' : '') +
        (multi ? '<button type="button" class="stage__nav stage__nav--prev" data-stage-nav="-1" aria-label="Photo précédente">' + icon('left', 18) + '</button>' +
                 '<button type="button" class="stage__nav stage__nav--next" data-stage-nav="1" aria-label="Photo suivante">' + icon('right', 18) + '</button>' : '') +
      '</div>' +
      (multi ? '<div class="stage__thumbs">' + list.map((src, i) =>
        '<button type="button" class="stage__thumb" data-stage-thumb data-full="' + esc(src) + '" aria-current="' + (i === 0) + '" aria-label="Voir la photo ' + (i + 1) + (name ? ' de ' + esc(name) : '') + '">' +
        '<img src="' + esc(src) + '" alt="" loading="lazy" data-guard></button>').join('') + '</div>' : '') +
      '</div>';
  }
  /** Branche chaque galerie « grande photo + miniatures » d'un bloc. */
  function bindStages(root) {
    $$('[data-stage]', root).forEach((el) => window.BKUI.bindStage(el, el.dataset.name || ''));
  }

  /** « Un British Shorthair bleu aux yeux orange, né le 3 juillet 2024. » : tiré des champs de l'API. */
  function portraitSentence(cat) {
    const female = cat.sex === 'female';
    const robe = splitRobe(cat.robe).nom.toLowerCase();
    const breed = cleanText(cat.breed) || 'British';
    let eyes = cleanText(cat.eyeColor).toLowerCase();
    if (/^vairons?/.test(eyes)) eyes = 'vairons' + eyes.replace(/^vairons?/, '');
    else eyes = EYES_PLURAL[eyes] || eyes;
    let s = (female ? 'Une ' : 'Un ') + breed + (robe ? ' ' + robe : '') + (eyes ? ' aux yeux ' + eyes : '');
    if (cat.dateOfBirth) s += (female ? ', née le ' : ', né le ') + fmt.date(cat.dateOfBirth);
    return s + '.';
  }

  function trait(ic, label, value, sub) {
    return '<li class="trait"><span class="trait__icon">' + icon(ic, 20) + '</span>' +
      '<span class="trait__text"><small>' + label + '</small><b>' + esc(value) + '</b>' + (sub ? '<em>' + esc(sub) + '</em>' : '') + '</span></li>';
  }

  async function ficheChat() {
    const box = $('#cat-detail');
    const id = new URLSearchParams(location.search).get('id');
    if (!id) { box.innerHTML = empty('Chat introuvable', 'Revenez à la page <a href="males.html">Nos mâles</a> ou <a href="femelles.html">Nos femelles</a>.'); return; }

    try {
      const [cat, portees, cats] = await Promise.all([api.cat(id), api.portees(), api.allCats()]);
      if (!cat || !cat.id) { box.innerHTML = empty('Chat introuvable', 'Ce chat n’est plus présenté sur le site. Voir <a href="males.html">nos mâles</a> et <a href="femelles.html">nos femelles</a>.'); return; }

      const name = niceName(cat.name);
      const female = cat.sex === 'female';
      document.title = name + ' — Chatterie British Kingdom';
      const bc = $('#cat-breadcrumb-name'); if (bc) bc.textContent = name;
      const parentHref = cat.archivee ? 'retraites.html' : female ? 'femelles.html' : 'males.html';
      const parentLabel = cat.archivee ? 'Nos retraités' : female ? 'Nos femelles' : 'Nos mâles';
      const parentLink = $('#cat-breadcrumb-parent');
      if (parentLink) { parentLink.href = parentHref; parentLink.textContent = parentLabel; }
      const back = $('#cat-back');
      if (back) { back.href = parentHref; $('span', back).textContent = parentLabel; }
      markNav(parentHref);

      const r = splitRobe(cat.robe);
      const litters = portees.filter((p) => String(p.idPapa) === String(cat.id) || String(p.idMaman) === String(cat.id));
      const eyebrow = cat.archivee ? (female ? 'Notre retraitée' : 'Notre retraité') : (female ? 'Notre reproductrice' : 'Notre étalon');
      const photos = [cat.photo].concat(cat.gallery);
      const saillies = !female && !cat.archivee ? yesNo(cat.sailliesExterieures) : '';

      const traits = [
        cat.sexLabel ? trait(female ? 'female' : 'male', 'Sexe', cat.sexLabel) : '',
        r.nom ? trait('palette', 'Robe', r.nom, r.ems) : '',
        cat.eyeColor ? trait('eye', 'Yeux', cleanText(cat.eyeColor)) : '',
        cat.dateOfBirth ? trait('cake', 'Naissance', fmt.date(cat.dateOfBirth), fmt.age(cat.dateOfBirth)) : ''
      ].join('');

      const pills = [
        shortBreed(cat.breed) ? '<span class="pill pill--breed">' + esc(cleanText(cat.breed)) + '</span>' : '',
        saillies ? '<span class="pill ' + (saillies === 'Oui' ? 'pill--disponible' : 'pill--vendu') + '">Saillies extérieures : ' + saillies.toLowerCase() + '</span>' : '',
        cat.archivee ? '<span class="pill pill--rester">À la retraite</span>' : ''
      ].join('');

      const parents = [[cat.father, 'Papa'], [cat.mother, 'Maman']].filter((x) => x[0]);

      // Le portrait : le champ de l'API s'il existe, sinon le texte de js/descriptions.js
      const extra = (window.BK_DESCRIPTIONS || {})[cat.id] || {};
      const about = cleanText(cat.description) || extra.texte || '';
      // Les citations entre guillemets passent en italique
      const aboutHtml = esc(about).replace(/«\s*([^»]+?)\s*»/g, '«&nbsp;<em>$1</em>&nbsp;»');
      const health = Array.isArray(extra.sante) ? extra.sante : [];
      referencer('chat.html?id=' + encodeURIComponent(cat.id), portraitSentence(cat) + (about ? ' ' + about.replace(/[«»]/g, '') : ' Élevage familial LOOF à Othis (77).'));

      box.innerHTML =
        '<div class="profile">' +
          '<div class="profile__gallery reveal">' + stage(photos, name, { eager: true }) + '</div>' +
          '<div class="profile__info reveal" data-delay="1">' +
            '<p class="eyebrow">' + eyebrow + '</p>' +
            '<h1 class="profile__name">' + esc(name) + '<span class="profile__paw" aria-hidden="true"></span></h1>' +
            '<p class="profile__lede">' + esc(portraitSentence(cat)) + '</p>' +
            (pills ? '<p class="profile__pills">' + pills + '</p>' : '') +
            (traits ? '<ul class="traits">' + traits + '</ul>' : '') +
            (cat.pedigree ? '<p class="profile__pedigree"><a class="link-arrow" href="' + esc(cat.pedigreeUrl) + '" target="_blank" rel="noopener">Voir le pedigree</a></p>' : '') +

            (about ?
              '<div class="profile__block"><h2 class="profile__h">Son portrait</h2>' +
              '<div class="about-note"><p>' + aboutHtml + '</p></div></div>' : '') +

            (health.length ?
              '<div class="profile__block"><h2 class="profile__h">Santé</h2>' +
              '<ul class="health">' + health.map((h) => '<li>' + icon('check', 16) + '<span>' + esc(h) + '</span></li>').join('') + '</ul>' +
              (extra.source ? '<p class="health__source">' + esc(extra.source) + '.</p>' : '') + '</div>' : '') +

            (parents.length ?
              '<div class="profile__block"><h2 class="profile__h">Ses parents</h2>' +
              '<div class="parents" data-parents>' + parents.map(([src, role], i) =>
                '<button type="button" class="parent" data-index="' + i + '" data-full="' + esc(src) + '" data-alt="' + role + ' de ' + esc(name) + '" aria-label="Agrandir la photo : ' + role.toLowerCase() + ' de ' + esc(name) + '">' +
                '<span class="parent__photo"><img src="' + esc(src) + '" alt="" loading="lazy" data-guard></span>' +
                '<span class="parent__role">' + role + '</span></button>' +
                (i === 0 && parents.length > 1 ? '<span class="couple__heart" aria-hidden="true">' + icon('heart', 16) + '</span>' : '')).join('') +
              '</div></div>' : '') +

            (litters.length ?
              '<div class="profile__block"><h2 class="profile__h">' + (litters.length > 1 ? 'Ses portées' : 'Sa portée') + ' du moment</h2>' +
              '<div class="profile__litters">' + litters.map((p) => litterCard(p, cats)).join('') + '</div></div>' : '') +

            '<div class="actions">' +
              '<a class="btn btn--primary" href="contact.html?sujet=' + encodeURIComponent('À propos de ' + name) + '">Nous écrire à propos de ' + esc(name) + '</a>' +
              '<a class="btn btn--ghost" href="' + parentHref + '">' + parentLabel + '</a>' +
            '</div>' +
          '</div>' +
        '</div>';

      bindStages(box);
      bindGallery($('[data-parents]', box));
      guardImages(box); setupReveal(box);

      // Les copains (ou les copines) de la chatterie, pour continuer la visite
      const others = cats.filter((c) => String(c.id) !== String(cat.id) && !!c.archivee === !!cat.archivee && (cat.archivee || c.sex === cat.sex));
      const section = $('#cat-others-section');
      if (section && others.length) {
        $('#cat-others-title').textContent = cat.archivee ? 'Nos autres retraités' : (female ? 'Les copines de ' : 'Les copains de ') + name;
        $('#cat-others').innerHTML = others.map((c) =>
          '<a class="friend reveal" href="chat.html?id=' + encodeURIComponent(c.id) + '">' +
            '<span class="friend__photo">' + (c.photo ? '<img src="' + esc(c.photo) + '" alt="" loading="lazy" data-guard>' : '<span class="img-fallback" aria-hidden="true"></span>') + '</span>' +
            '<span class="friend__name">' + esc(niceName(c.name)) + '</span>' +
            '<span class="friend__robe">' + esc(splitRobe(c.robe).nom) + '</span>' +
          '</a>').join('');
        section.hidden = false;
        guardImages(section); setupReveal(section);
      }
    } catch (e) { fail(box, e); }
  }

  /* ======================================================================
     CHATONS ET PORTÉES
     ====================================================================== */
  /** Un chaton de chaque portée à tour de rôle, les disponibles d'abord. */
  function chatonsMelanges(portees, garde) {
    return tourDeRole(portees.map((p) => p.chatons.filter(garde || (() => true))
      .slice().sort((a, b) => (a.status === 'disponible' ? 0 : 1) - (b.status === 'disponible' ? 0 : 1))));
  }

  /** Le haut de la page Chatons : les autocollants et trois polaroïds, un par portée. */
  function chatonsEnTete(portees) {
    const stickers = $('#kittens-stickers');
    const fan = $('#kittens-fan');
    const dispo = portees.reduce((n, p) => n + p.available, 0);
    const depart = portees.map((p) => p.dateOfSell).filter(Boolean).sort()[0];
    if (stickers) {
      stickers.innerHTML = autocollants([
        ['crown', plural(portees.length, 'portée à la maison', 'portées à la maison')],
        dispo ? ['heart', plural(dispo, 'chaton disponible', 'chatons disponibles'), '#litters']
              : ['heart', 'Tous réservés pour le moment', 'liste-attente.html'],
        depart ? ['clock', 'Premiers départs le ' + fmt.date(depart)] : null
      ].filter(Boolean));
    }
    if (fan) {
      fan.innerHTML = eventail(chatonsMelanges(portees, (k) => k.photo).slice(0, 3)
        .map((k) => ['chaton.html?id=' + encodeURIComponent(k.id), k.photo, niceName(k.name) || 'Chaton']));
      guardImages(fan);
    }
  }

  /** « Les chatons en images » : leurs autres photos, un chaton à tour de rôle. */
  function chatonsPhotos(portees) {
    const couvertures = {};
    portees.forEach((p) => p.chatons.forEach((k) => { if (k.photo) couvertures[k.photo] = true; }));
    mosaique($('#kittens-photos'), $('#kittens-photos-grid'), tourDeRole(
      chatonsMelanges(portees).map((k) => k.photos.filter((src) => !couvertures[src])
        .map((src) => ({ src, alt: niceName(k.name) || 'Chaton' })))));
  }

  async function chatons() {
    const box = $('#litters');
    const summary = $('#kittens-summary');
    const filters = $('#kitten-filters');
    loading(box, skeletons(3, true));
    let portees = [], cats = [], current = 'tous';

    function render() {
      const shown = portees.map((p) => ({ p, list: current === 'tous' ? p.chatons : p.chatons.filter((k) => k.status === current) }))
        .filter((x) => x.list.length || current === 'tous');
      // Le compte suit le filtre choisi (le haut de page annonce, lui, les chatons disponibles)
      const combien = shown.reduce((n, x) => n + x.list.length, 0);
      const total = portees.reduce((n, p) => n + p.chatons.length, 0);
      if (summary && total) {
        summary.textContent = current === 'tous' ? plural(total, 'chaton à la maison', 'chatons à la maison')
          : current === 'disponible' ? plural(combien, 'chaton disponible', 'chatons disponibles')
          : plural(combien, 'chaton réservé', 'chatons réservés');
      }
      if (!shown.length) {
        box.innerHTML = empty(current === 'disponible' ? 'Aucun chaton disponible pour le moment' : 'Aucun chaton réservé pour le moment',
          'Inscrivez-vous sur la liste d’attente : vous serez prévenu dès qu’un chaton correspondant à vos critères est disponible.',
          '<a class="btn btn--primary" href="liste-attente.html">Rejoindre la liste d’attente</a>');
        return;
      }
      box.innerHTML = shown.map(({ p, list }, idx) => {
        const weeks = fmt.ageWeeks(p.dateOfBirth);
        const departure = p.dateOfSell ? fmt.date(p.dateOfSell) : '';
        return '<article class="litter reveal" data-delay="' + (idx % 3) + '">' +
          '<header class="litter__head">' +
            couple(p, cats, true) +
            '<div class="litter__info">' +
              '<p class="eyebrow">Portée ' + (idx + 1) + ' sur ' + shown.length + '</p>' +
              '<h2>' + esc(p.name || 'Portée') + '</h2>' +
              '<p class="litter__meta">' +
                (p.dateOfBirth ? '<span>Nés le ' + esc(fmt.date(p.dateOfBirth)) + (weeks != null && weeks >= 0 ? ' · ' + plural(weeks, 'semaine', 'semaines') : '') + '</span>' : '') +
                (departure ? '<span>Départ à partir du ' + esc(departure) + '</span>' : '') +
              '</p>' +
              etapeLigne(weeks) +
              '<p class="litter__actions">' + litterStatus(p) + '<a class="link-arrow" href="portee.html?id=' + encodeURIComponent(p.id) + '">La portée en détail</a></p>' +
            '</div>' +
          '</header>' +
          (list.length
            ? '<div class="grid grid-4 kittens">' + list.map(kittenCard).join('') + '</div>'
            : '<p class="small">Les chatons seront présentés ici dès les premières photos.</p>') +
          '</article>';
      }).join('');
      guardImages(box); setupReveal(box);
    }

    try {
      [portees, cats] = await Promise.all([api.portees(), api.allCats()]);
      if (!portees.length) {
        box.innerHTML = empty('Aucune portée en ligne actuellement',
          'Nos portées sont planifiées à l’avance. Inscrivez-vous sur la liste d’attente pour être prévenu des prochaines naissances.',
          '<a class="btn btn--primary" href="liste-attente.html">Rejoindre la liste d’attente</a>');
        if (filters) filters.hidden = true;
        const stickers = $('#kittens-stickers'), fan = $('#kittens-fan');
        if (stickers) stickers.innerHTML = autocollants([['heart', 'Prochaines naissances à venir', 'liste-attente.html']]);
        if (fan) fan.innerHTML = '';
        return;
      }
      render();
      chatonsEnTete(portees);
      chatonsPhotos(portees);
      if (filters) {
        filters.addEventListener('click', (e) => {
          const chip = e.target.closest('.chip');
          if (!chip) return;
          current = chip.dataset.filter;
          $$('.chip', filters).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
          render();
        });
      }
    } catch (e) { fail(box, e); }
  }

  /* ======================================================================
     DÉTAIL D'UNE PORTÉE
     ====================================================================== */
  async function portee() {
    const box = $('#litter-detail');
    const id = new URLSearchParams(location.search).get('id');
    if (!id) { box.innerHTML = empty('Portée introuvable', 'Voir <a href="chatons.html">toutes nos portées</a>.'); return; }

    try {
      const [p, cats] = await Promise.all([api.portee(id), api.allCats()]);
      if (!p || !p.id) { box.innerHTML = empty('Portée introuvable', 'Voir <a href="chatons.html">toutes nos portées</a>.'); return; }

      document.title = (p.name || 'Portée') + ' — Chatterie British Kingdom';
      const bc = $('#litter-breadcrumb-name'); if (bc) bc.textContent = p.name || 'Portée';
      const weeks = fmt.ageWeeks(p.dateOfBirth);
      referencer('portee.html?id=' + encodeURIComponent(p.id), 'Portée ' + (p.name || '') + ' de la Chatterie British Kingdom' +
        (p.dateOfBirth ? ', nés le ' + fmt.date(p.dateOfBirth) : '') + '. ' + plural(p.chatons.length, 'chaton', 'chatons') +
        (p.available ? ', dont ' + plural(p.available, 'disponible', 'disponibles') : '') + (p.dateOfSell ? ', départ à partir du ' + fmt.date(p.dateOfSell) : '') + '.');

      const facts = [
        ['Naissance', p.dateOfBirth ? fmt.date(p.dateOfBirth) : ''],
        ['Âge', weeks != null && weeks >= 0 ? plural(weeks, 'semaine', 'semaines') : ''],
        ['Chatons', p.chatons.length ? String(p.chatons.length) : ''],
        ['Disponibles', String(p.available)],
        ['Départ possible', p.dateOfSell ? 'à partir du ' + fmt.date(p.dateOfSell) : '']
      ].filter(([, v]) => v);

      box.innerHTML =
        '<div class="split split--wide-text">' +
          '<div class="reveal">' +
            '<p class="eyebrow">Portée</p><h1>' + esc(p.name || 'Portée') + '</h1>' +
            '<p class="lede">' + (weeks != null && weeks >= 0 ? 'Les chatons ont ' + plural(weeks, 'semaine', 'semaines') + '. ' : '') +
              (p.available ? (p.available > 1 ? p.available + ' chatons sont encore disponibles.' : 'Un chaton est encore disponible.') : 'Tous les chatons de cette portée sont réservés.') + '</p>' +
            '<div class="sheet"><dl class="facts">' +
              facts.map(([k, v]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>').join('') +
            '</dl></div>' +
          '</div>' +
          '<div class="split__media reveal" data-delay="1">' + couple(p, cats, true).replace('class="couple"', 'class="couple couple--big"') + '</div>' +
        '</div>' +

        '<section class="tight"><h2 class="reveal">Les chatons</h2>' +
          (p.chatons.length
            ? '<div class="grid grid-3 kittens">' + p.chatons.map(kittenDetail).join('') + '</div>'
            : '<p>Les photos arrivent dès les premiers jours.</p>') +
        '</section>' +
        journal(weeks);

      bindStages(box);
      guardImages(box); setupReveal(box);

      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) setTimeout(() => { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); target.classList.add('is-target'); }, 150);
      }
    } catch (e) { fail(box, e); }
  }

  function kittenDetail(k) {
    const r = splitRobe(k.robe);
    const name = niceName(k.name) || 'Chaton';
    const photos = k.photos.length ? k.photos : (k.photo ? [k.photo] : []);
    const fiche = 'chaton.html?id=' + encodeURIComponent(k.id);
    return '<article class="kitten-detail reveal" id="chaton-' + esc(k.id) + '">' +
      stage(photos, name, { cls: 'stage--kitten', badge: '<span class="stage__badge pill pill--' + k.status + '">' + esc(k.statusLabel) + '</span>' }) +
      '<div class="card__body">' +
        '<h3 class="card__title"><a href="' + fiche + '">' + esc(name) + '</a></h3>' +
        '<p class="card__meta">' + [k.sexLabel ? sexMark(k.sex) + esc(k.sexLabel) : '', esc(r.nom), esc(shortBreed(k.breed)), k.loof ? 'LOOF' : '']
          .filter(Boolean).map((x) => '<span>' + x + '</span>').join('') + '</p>' +
        '<p class="kitten-detail__cta">' +
          (k.status === 'disponible'
            ? '<a class="btn btn--sm btn--primary" href="contact.html?sujet=' + encodeURIComponent('Chaton ' + name) + '">Se renseigner sur ' + esc(name) + '</a>'
            : '') +
          '<a class="btn btn--sm btn--ghost" href="' + fiche + '">Sa fiche</a>' +
        '</p>' +
      '</div></article>';
  }

  /* ======================================================================
     FICHE D'UN CHATON
     Tout vient de l'API : prénom, sexe, robe, race, LOOF, statut, naissance,
     photos, portée et parents. Rien n'est inventé ; un champ vide ne s'affiche pas.
     ====================================================================== */
  async function ficheChaton() {
    const box = $('#kitten-detail');
    const id = new URLSearchParams(location.search).get('id');
    const lost = () => empty('Chaton introuvable', 'Ce chaton n’est plus présenté sur le site. Voir <a href="chatons.html">nos chatons</a>.');
    if (!id) { box.innerHTML = lost(); return; }
    markNav('chatons.html');

    try {
      const [portees, cats] = await Promise.all([api.portees(), api.allCats()]);
      let p = null, k = null;
      portees.some((pp) => { const f = pp.chatons.find((c) => String(c.id) === String(id)); if (f) { p = pp; k = f; } return !!f; });
      if (!k) { box.innerHTML = lost(); return; }

      const name = niceName(k.name) || 'Chaton';
      const female = k.sex === 'female', male = k.sex === 'male';
      const Il = female ? 'Elle' : 'Il';
      document.title = name + ' — Chatterie British Kingdom';
      const litterHref = 'portee.html?id=' + encodeURIComponent(p.id);
      const bcName = $('#kitten-breadcrumb-name'); if (bcName) bcName.textContent = name;
      const bcLitter = $('#kitten-breadcrumb-litter'), bcLitterLink = $('#kitten-breadcrumb-litter-link');
      if (bcLitter && bcLitterLink && p.name) { bcLitterLink.href = litterHref; bcLitterLink.textContent = p.name; bcLitter.hidden = false; }
      const back = $('#kitten-back');
      if (back) { back.href = litterHref; $('span', back).textContent = 'Sa portée'; }

      const r = splitRobe(k.robe);
      const mother = cats.find((c) => String(c.id) === String(p.idMaman));
      const father = cats.find((c) => String(c.id) === String(p.idPapa));
      const motherName = mother ? niceName(mother.name) : '';
      const fatherName = father ? niceName(father.name) : niceName(p.externalFatherName || '');
      const dob = k.dateOfBirth || p.dateOfBirth;
      const weeks = fmt.ageWeeks(dob);
      const sell = fmt.parseDate(p.dateOfSell);
      const leavesLater = sell && sell > new Date();

      // « Une petite femelle British Shorthair black silver shaded, née le 31 juillet 2026, fille de Tina et de Voltaire. »
      let lede = (female ? 'Une petite femelle ' : male ? 'Un petit mâle ' : 'Un chaton ') + (cleanText(k.breed) || 'British') + (r.nom ? ' ' + r.nom.toLowerCase() : '');
      if (dob) lede += (female ? ', née le ' : ', né le ') + fmt.date(dob);
      if (motherName && fatherName) lede += (female ? ', fille de ' : male ? ', fils de ' : ', enfant de ') + motherName + ' et de ' + fatherName;
      lede += '.';
      referencer('chaton.html?id=' + encodeURIComponent(k.id), name + ' : ' + lede.charAt(0).toLowerCase() + lede.slice(1) + ' ' + k.statusLabel + ', à la Chatterie British Kingdom (Othis, 77).');

      const wish = {
        disponible: Il + ' attend encore sa famille',
        reserve: Il + ' a déjà trouvé sa famille',
        rester: Il + ' reste à la maison, avec nous',
        vendu: Il + ' est parti' + (female ? 'e' : '') + ' dans sa famille'
      }[k.status] || '';

      const pills = [
        '<span class="pill pill--' + k.status + '">' + esc(k.statusLabel) + '</span>',
        shortBreed(k.breed) ? '<span class="pill pill--breed">' + esc(cleanText(k.breed)) + '</span>' : '',
        k.loof ? '<span class="pill pill--breed">' + (female ? 'Inscrite' : 'Inscrit') + ' au LOOF</span>' : ''
      ].join('');

      const traits = [
        k.sexLabel ? trait(female ? 'female' : 'male', 'Sexe', k.sexLabel) : '',
        r.nom ? trait('palette', 'Robe', r.nom, r.ems) : '',
        dob ? trait('cake', 'Naissance', fmt.date(dob), weeks != null && weeks >= 0 ? plural(weeks, 'semaine', 'semaines') : '') : '',
        leavesLater ? trait('home', 'Départ possible', 'à partir du ' + fmt.date(p.dateOfSell)) : ''
      ].join('');

      // Sa petite valise : la même liste que la page Chatons (pas de stérilisation avant le départ)
      const kit = [
        k.loof ? 'Son certificat LOOF' : '',
        'Sa puce électronique d’identification',
        'Ses premières vaccinations à jour',
        'Son carnet de santé complet',
        'De la nourriture et un peu de litière pour les premiers jours',
        'Un suivi et nos conseils, bien après l’adoption'
      ].filter(Boolean);
      const showKit = k.status === 'disponible' || k.status === 'reserve';

      const photos = [k.photo].concat(k.photos);
      box.innerHTML =
        '<div class="profile">' +
          '<div class="profile__gallery reveal">' + stage(photos, name, { eager: true }) + '</div>' +
          '<div class="profile__info reveal" data-delay="1">' +
            '<p class="eyebrow">' + (female ? 'Notre chatonne' : 'Notre chaton') + '</p>' +
            '<h1 class="profile__name">' + esc(name) + '<span class="profile__paw" aria-hidden="true"></span></h1>' +
            (wish ? '<p class="profile__wish">' + esc(wish) + '</p>' : '') +
            '<p class="profile__lede">' + esc(lede) + '</p>' +
            '<p class="profile__pills">' + pills + '</p>' +
            (traits ? '<ul class="traits">' + traits + '</ul>' : '') +
            // Ce que vivent les chatons à son âge (les mêmes étapes que le journal de la portée)
            etapeLigne(weeks) +

            ((mother || father || p.externalFatherName) ?
              '<div class="profile__block"><h2 class="profile__h">Ses parents</h2>' + couple(p, cats, true) + '</div>' : '') +

            (showKit ?
              '<div class="profile__block"><h2 class="profile__h">Dans sa petite valise</h2>' +
              '<ul class="health">' + kit.map((x) => '<li>' + icon('check', 16) + '<span>' + esc(x) + '</span></li>').join('') + '</ul>' +
              '<p class="health__source">Et les documents prévus par la loi : attestation de cession, certificat vétérinaire et document d’information sur les besoins de l’espèce.</p></div>' : '') +

            '<div class="actions">' +
              (k.status === 'disponible'
                ? '<a class="btn btn--primary" href="contact.html?sujet=' + encodeURIComponent('Chaton ' + name) + '">Se renseigner sur ' + esc(name) + '</a>'
                : '<a class="btn btn--primary" href="chatons.html">Voir les chatons disponibles</a>') +
              '<a class="btn btn--ghost" href="liste-attente.html">La liste d’attente</a>' +
            '</div>' +
          '</div>' +
        '</div>';

      bindStages(box);
      guardImages(box); setupReveal(box);

      // Ses frères et sœurs, pour continuer la visite
      const siblings = p.chatons.filter((c) => String(c.id) !== String(k.id));
      const section = $('#kitten-siblings-section');
      if (section && siblings.length) {
        const allM = siblings.every((c) => c.sex === 'male'), allF = siblings.every((c) => c.sex === 'female');
        const plur = siblings.length > 1;
        $('#kitten-siblings-title').textContent = allM ? (plur ? 'Ses frères' : 'Son frère') : allF ? (plur ? 'Ses sœurs' : 'Sa sœur') : 'Ses frères et sœurs';
        $('#kitten-siblings').innerHTML = siblings.map((c) =>
          '<a class="friend reveal" href="chaton.html?id=' + encodeURIComponent(c.id) + '">' +
            '<span class="friend__photo">' + (c.photo ? '<img src="' + esc(c.photo) + '" alt="" loading="lazy" data-guard>' : '<span class="img-fallback" aria-hidden="true"></span>') + '</span>' +
            '<span class="friend__name">' + esc(niceName(c.name)) + '</span>' +
            '<span class="friend__robe">' + esc(c.statusLabel) + '</span>' +
          '</a>').join('');
        section.hidden = false;
        guardImages(section); setupReveal(section);
      }
    } catch (e) { fail(box, e); }
  }

  /** Journal de la portée : les grandes étapes, situées par rapport à l'âge réel des chatons. */
  function journal(weeks) {
    if (weeks == null || weeks < 0) return '';
    const steps = ETAPES;
    return '<section class="tight journal">' +
      '<div class="section-head"><p class="eyebrow">Semaine après semaine</p><h2 class="reveal">Le journal de la portée</h2>' +
      '<p class="lede reveal">Ce que vivent les chatons jusqu’à leur départ. L’étape en cours est mise en valeur.</p></div>' +
      '<ul class="timeline reveal">' + steps.map(([w, title, text], i) => {
        const next = steps[i + 1] ? steps[i + 1][0] : 99;
        const cls = weeks >= next ? 'is-past' : weeks >= w ? 'is-now' : '';
        return '<li class="' + cls + '"><span class="when">' + (w === 0 ? 'Naissance' : w + ' sem.') + '</span>' +
          '<div><h3>' + title + '</h3><p>' + text + '</p></div></li>';
      }).join('') + '</ul></section>';
  }

  /* ======================================================================
     CONSEILS
     ====================================================================== */
  async function blog() {
    const box = $('#blog-list');
    loading(box, skeletons(3, true));
    try {
      const posts = (await api.posts()).sort(byDateDesc('date'));
      if (!posts.length) { box.innerHTML = empty('Aucun article pour le moment', 'Nos conseils arrivent très bientôt.'); return; }
      box.innerHTML = '<div class="grid grid--center">' + posts.map(postCard).join('') + '</div>';
      guardImages(box); setupReveal(box);
    } catch (e) { fail(box, e); }
  }

  async function article() {
    const box = $('#article-body');
    const slug = new URLSearchParams(location.search).get('slug');
    if (!slug) { box.innerHTML = empty('Article introuvable', 'Voir <a href="conseils.html">tous les articles</a>.'); return; }
    try {
      const p = await api.post(slug);
      if (!p || !p.slug) { box.innerHTML = empty('Article introuvable', 'Voir <a href="conseils.html">tous les articles</a>.'); return; }
      document.title = p.title + ' — Chatterie British Kingdom';
      const bc = $('#article-breadcrumb-name'); if (bc) bc.textContent = p.title;
      referencer('article.html?slug=' + encodeURIComponent(p.slug), p.excerpt);
      const ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt || undefined,
        datePublished: p.date || undefined, image: p.cover ? [p.cover] : undefined, inLanguage: 'fr-FR',
        author: { '@type': 'Organization', name: 'Chatterie British Kingdom', url: DOMAINE },
        publisher: { '@id': DOMAINE + '#chatterie' },
        mainEntityOfPage: DOMAINE + 'article.html?slug=' + encodeURIComponent(p.slug)
      });
      document.head.appendChild(ld);

      const blocks = (p.content || []).map((b) => {
        const t = (b.type || 'p').toLowerCase();
        if (t === 'h2') return '<h2>' + esc(b.text) + '</h2>';
        if (t === 'quote') return '<blockquote class="pullquote"><p>' + esc(b.text) + '</p></blockquote>';
        return '<p>' + esc(b.text) + '</p>';
      }).join('');

      box.innerHTML =
        '<header class="article-head reveal">' +
          (p.category ? '<p class="eyebrow">' + esc(p.category) + '</p>' : '') +
          '<h1>' + esc(p.title) + '</h1>' +
          '<p class="small">' + esc(fmt.date(p.date)) + (p.readingTime ? ' · ' + p.readingTime + ' min de lecture' : '') + '</p>' +
        '</header>' +
        (p.cover ? '<figure class="article-cover reveal"><img src="' + esc(p.cover) + '" alt="" data-guard></figure>' : '') +
        '<div class="prose prose--article reveal">' + (blocks || '<p>' + esc(p.excerpt) + '</p>') + '</div>';
      guardImages(box); setupReveal(box);
    } catch (e) { fail(box, e); }
  }

  /* ======================================================================
     NOS RETRAITÉS
     ====================================================================== */
  async function retraites() {
    const box = $('#retired-list');
    const note = $('#retired-count');
    loading(box, skeletons(3, true));
    try {
      const list = await api.retired();
      if (note) note.textContent = list.length ? plural(list.length, 'chat', 'chats') : '';
      if (!list.length) {
        box.innerHTML = empty('Aucun retraité pour le moment',
          'Nos reproducteurs sont encore tous en activité. Cette page se remplira avec le temps.');
        return;
      }
      list.sort((a, b) => (fmt.parseDate(a.dateOfBirth) || 0) - (fmt.parseDate(b.dateOfBirth) || 0));
      box.innerHTML = '<div class="grid grid-3 cats">' + list.map((c) => catCard(c)).join('') + '</div>';
      guardImages(box); setupReveal(box);
    } catch (e) { fail(box, e); }
  }

  /* ======================================================================
     LA VIE À LA CHATTERIE (accueil) : la galerie, en mosaïque
     La page Galerie n'existe plus : toutes les photos du site (chatons,
     adultes, retraités) se retrouvent ici, par paquets. La visionneuse
     parcourt toutes les photos, même celles pas encore montrées.
     ====================================================================== */
  /**
   * Une photo par chat à tour de rôle, en alternant chatons et adultes : la
   * mosaïque ne commence pas par dix photos du même chaton.
   */
  function varier(photos) {
    const groups = new Map();
    photos.forEach((p) => {
      const key = p.groupe + '|' + p.legende;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    });
    const kittens = [...groups.values()].filter((g) => g[0].groupe === 'chatons');
    const adults = [...groups.values()].filter((g) => g[0].groupe !== 'chatons');
    const order = [];
    for (let i = 0; i < Math.max(kittens.length, adults.length); i++) {
      if (kittens[i]) order.push(kittens[i]);
      if (adults[i]) order.push(adults[i]);
    }
    const out = [];
    for (let round = 0; order.some((g) => g[round]); round++) order.forEach((g) => { if (g[round]) out.push(g[round]); });
    return out;
  }

  async function homeGallery() {
    const box = $('#home-gallery');
    const more = $('#home-gallery-more');
    if (!box) return;
    // Des rangées toujours pleines : 2 photos par rangée sur téléphone, 4 sur ordinateur
    // (la vidéo occupe trois cases sur deux rangées).
    const phone = window.matchMedia('(max-width: 699px)').matches;
    const first = phone ? 6 : 10, step = phone ? 8 : 12;
    let all = [], shown = 0;
    function add(n) {
      const html = all.slice(shown, shown + n).map((p, k) =>
        '<button type="button" class="mosaic__tile reveal" data-mosaic="' + (shown + k) + '" aria-label="Agrandir la photo : ' + esc(p.legende) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.legende) + '" loading="lazy" data-guard>' +
        '<span class="mosaic__caption" aria-hidden="true">' + esc(p.legende) + '</span></button>').join('');
      box.insertAdjacentHTML('beforeend', html);
      shown = Math.min(all.length, shown + n);
      if (more) more.hidden = shown >= all.length;
      guardImages(box); setupReveal(box);
    }
    try {
      // Les photos des chatons portent aussi le nom de leur portée : on garde le prénom seul
      all = varier(await api.gallery()).map((p) => ({ src: p.src, legende: niceName(String(p.legende).split(' · ')[0]) }));
      add(first);
      if (more) more.addEventListener('click', () => add(step));
      box.addEventListener('click', (e) => {
        const t = e.target.closest('[data-mosaic]');
        if (t) window.BKUI.openLb(all.map((p) => ({ src: p.src, alt: p.legende })), Number(t.dataset.mosaic));
      });
    } catch (e) { /* la vidéo reste seule, la section garde tout son sens */ }
  }

  /* ======================================================================
     LISTE D'ATTENTE : les frimousses des chatons du moment
     ====================================================================== */
  async function listeAttente() {
    const box = $('#waitlist-avatars');
    if (!box) return;
    try {
      const portees = await api.portees();
      const kittens = [];
      // Un chaton de chaque portée à tour de rôle, les disponibles d'abord
      const lists = portees.map((p) => p.chatons.filter((k) => k.photo).sort((a, b) => (a.status === 'disponible' ? 0 : 1) - (b.status === 'disponible' ? 0 : 1)));
      for (let i = 0; lists.some((l) => l[i]); i++) lists.forEach((l) => { if (l[i]) kittens.push(l[i]); });
      const pick = kittens.slice(0, 7);
      if (!pick.length) { box.hidden = true; return; }
      box.innerHTML = pick.map((k, i) =>
        '<span class="avatars__one" style="--i:' + i + '">' + (i === 0 ? '<span class="avatars__crown">' + icon('crown', 16) + '</span>' : '') +
        '<img src="' + esc(k.photo) + '" alt="" loading="lazy" data-guard></span>').join('');
      guardImages(box);
    } catch (e) { box.hidden = true; }
  }

  /* ======================================================================
     TÉMOIGNAGES (livre d'or) — la section ne s'affiche que s'il y en a
     ====================================================================== */
  async function temoignages(selector, limit) {
    const box = $(selector || '#testimonials');
    if (!box) return;
    const section = box.closest('section');
    try {
      const all = await api.livreOr();
      if (!all.length) { if (section) section.hidden = true; return; }
      const list = all.slice(0, limit || 3);
      box.innerHTML = '<div class="grid grid-3">' + list.map((t, i) => {
        const name = window.BK.util.pick(t, ['name'], 'Une famille');
        const msg = window.BK.util.pick(t, ['message'], '');
        const date = window.BK.util.pick(t, ['dateofCrea', 'dateOfCrea'], '');
        return '<figure class="quote reveal" data-delay="' + (i % 3) + '"><p>« ' + esc(msg) + ' »</p>' +
          '<footer>' + esc(name) + (date ? ' · ' + esc(fmt.date(date, { noDay: true })) : '') + '</footer></figure>';
      }).join('') + '</div>';
      if (section) section.hidden = false;
      setupReveal(box);
    } catch (e) {
      if (section) section.hidden = true;
    }
  }

  /* ---------- pré-remplissage du sujet sur la page contact ---------- */
  function prefillContact() {
    const subject = new URLSearchParams(location.search).get('sujet');
    const field = $('#contact-form [name="subject"]');
    if (subject && field) field.value = subject;
  }

  window.BKPages = { accueil, sexPage, retraites, ficheChat, ficheChaton, chatons, portee, blog, article, listeAttente, temoignages, prefillContact };
})();
