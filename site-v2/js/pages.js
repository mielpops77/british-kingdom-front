/* ==========================================================================
   Chatterie British Kingdom — rendu des contenus venant de l'API
   Une fonction par page. Chaque page appelle BKPages.<nom>() en bas de son HTML.
   ========================================================================== */
(function () {
  'use strict';
  const { $, $$, icon, setupReveal, guardImages, bindGallery } = window.BKUI;
  const { api, fmt } = window.BK;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** Extrait un code EMS entre parenthèses : "Bleu (BRI a)" -> { nom:"Bleu", ems:"BRI a" } */
  function splitRobe(robe) {
    const m = String(robe || '').match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    return m ? { nom: m[1].trim(), ems: m[2].trim() } : { nom: String(robe || '').trim(), ems: '' };
  }

  function archImg(src, alt, cls) {
    return '<div class="arch ' + (cls || '') + '">' +
      (src ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" data-guard>' : '<div class="img-fallback" aria-hidden="true"></div>') +
      '</div>';
  }

  function skeletons(n, wrapper) {
    let out = '';
    for (let i = 0; i < n; i++) {
      out += '<div>' + '<div class="skeleton skeleton--arch"></div><div class="skeleton skeleton--line" style="width:60%"></div><div class="skeleton skeleton--line" style="width:40%"></div>' + '</div>';
    }
    return wrapper ? '<div class="grid grid-3">' + out + '</div>' : out;
  }

  function empty(title, text, cta) {
    return '<div class="empty">' +
      '<div class="empty__mark"><img src="img/cat-silhouette.svg" alt=""></div>' +
      '<h3>' + esc(title) + '</h3><p>' + text + '</p>' +
      (cta ? '<p style="margin-top:1.2rem">' + cta + '</p>' : '') +
      '</div>';
  }

  function fail(container, e) {
    console.error(e);
    container.innerHTML = empty(
      'Contenu momentanément indisponible',
      'Nous n’arrivons pas à joindre notre base de données. Réessayez dans un instant, ou appelez-nous au <a href="tel:+33661654998">06 61 65 49 98</a>.'
    );
  }

  /* ---------- cartes ---------- */
  function catCard(cat) {
    const r = splitRobe(cat.robe);
    return '<a class="card reveal" href="chat.html?id=' + encodeURIComponent(cat.id) + '">' +
      '<div class="card__media">' + archImg(cat.photo, 'Portrait de ' + cat.name) +
        '<div class="card__badges">' + (cat.breed ? '<span class="pill pill--plain">' + esc(cat.breed.replace('British ', '')) + '</span>' : '') + '</div>' +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(cat.name) + '</h3>' +
        '<p class="card__meta">' +
          (r.nom ? '<span>' + esc(r.nom) + '</span>' : '') +
          (cat.dateOfBirth ? '<span><b>' + esc(fmt.age(cat.dateOfBirth)) + '</b></span>' : '') +
        '</p>' +
      '</div></a>';
  }

  function kittenCard(k, porteeName) {
    return '<a class="card reveal" href="portee.html?id=' + encodeURIComponent(k.idPortee) + '#chaton-' + encodeURIComponent(k.id) + '">' +
      '<div class="card__media">' + archImg(k.photo, 'Photo du chaton ' + k.name) +
        '<div class="card__badges"><span class="pill pill--' + k.statusTone + '">' + esc(k.statusLabel) + '</span></div>' +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(k.name || 'Chaton') + '</h3>' +
        '<p class="card__meta">' +
          (k.sexLabel ? '<span>' + esc(k.sexLabel) + '</span>' : '') +
          (splitRobe(k.robe).nom ? '<span>' + esc(splitRobe(k.robe).nom) + '</span>' : '') +
          (k.dateOfBirth ? '<span><b>' + esc(fmt.age(k.dateOfBirth)) + '</b></span>' : '') +
        '</p>' +
        (porteeName ? '<p class="small" style="margin:.3rem 0 0">' + esc(porteeName) + '</p>' : '') +
      '</div></a>';
  }

  /* ======================================================================
     ACCUEIL
     ====================================================================== */
  async function accueil() {
    const kittensBox = $('#home-kittens');
    const catsBox = $('#home-cats');
    const countBox = $('#home-kitten-count');

    try {
      const [portees, cats] = await Promise.all([api.portees(), api.cats()]);

      // Chatons disponibles, les plus jeunes d'abord
      const available = [];
      portees.forEach((p) => p.chatons.filter((k) => k.status === 'disponible').forEach((k) => available.push({ k, p })));
      available.sort((a, b) => (fmt.parseDate(b.k.dateOfBirth) || 0) - (fmt.parseDate(a.k.dateOfBirth) || 0));

      if (countBox) {
        countBox.textContent = available.length === 0 ? 'Aucun chaton disponible actuellement'
          : available.length === 1 ? '1 chaton disponible' : available.length + ' chatons disponibles';
      }

      if (kittensBox) {
        if (available.length) {
          kittensBox.innerHTML = '<div class="grid grid-4">' + available.slice(0, 4).map(({ k, p }) => kittenCard(k, p.name)).join('') + '</div>';
        } else {
          const next = portees.find((p) => p.chatons.length === 0 || p.available === 0);
          kittensBox.innerHTML = empty(
            'Pas de chaton disponible pour le moment',
            'Nos portées sont rares et nos chatons partent souvent avant leur naissance. Inscrivez-vous sur la liste d’attente pour être prévenu en premier.',
            '<a class="btn btn--copper" href="liste-attente.html">Rejoindre la liste d’attente</a>'
          ) + (next ? '' : '');
        }
      }

      if (catsBox) {
        const pick = cats.slice(0, 4);
        catsBox.innerHTML = pick.length
          ? '<div class="grid grid-4">' + pick.map(catCard).join('') + '</div>'
          : empty('Nos chats arrivent bientôt sur le site', 'Les fiches de nos reproducteurs sont en cours de mise à jour.');
      }
    } catch (e) {
      if (kittensBox) fail(kittensBox, e);
      if (catsBox) catsBox.innerHTML = '';
    }
    guardImages(); setupReveal();
  }

  /* ======================================================================
     NOS CHATS (liste des reproducteurs)
     ====================================================================== */
  async function nosAdultes() {
    const box = $('#cats-list');
    const filters = $('#cats-filters');
    const note = $('#cats-count');
    box.innerHTML = skeletons(4, true);
    let all = [];
    let current = 'tous';

    function render() {
      const list = current === 'tous' ? all : all.filter((c) => c.sex === current);
      if (note) note.textContent = list.length + (list.length > 1 ? ' chats' : ' chat');
      box.innerHTML = list.length
        ? '<div class="grid grid-3">' + list.map(catCard).join('') + '</div>'
        : empty('Aucun chat dans cette catégorie', 'Essayez un autre filtre.');
      guardImages(box); setupReveal(box);
    }

    try {
      all = await api.cats();
      all.sort((a, b) => (a.sex === b.sex ? a.name.localeCompare(b.name, 'fr') : a.sex === 'male' ? -1 : 1));
      render();
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
     FICHE D'UN CHAT
     ====================================================================== */
  async function ficheChat() {
    const box = $('#cat-detail');
    const id = new URLSearchParams(location.search).get('id');
    if (!id) { box.innerHTML = empty('Chat introuvable', 'Revenez à la page <a href="nos-adultes.html">Nos chats</a>.'); return; }

    try {
      const [cat, portees] = await Promise.all([api.cat(id), api.portees()]);
      if (!cat || !cat.id) { box.innerHTML = empty('Chat introuvable', 'Ce chat n’est plus présenté sur le site. Voir <a href="nos-adultes.html">tous nos chats</a>.'); return; }

      document.title = cat.name + ' — Chatterie British Kingdom';
      const bc = $('#cat-breadcrumb-name'); if (bc) bc.textContent = cat.name;

      const r = splitRobe(cat.robe);
      const litters = portees.filter((p) => String(p.idPapa) === String(cat.id) || String(p.idMaman) === String(cat.id));

      const facts = [
        ['Race', cat.breed],
        ['Sexe', cat.sexLabel],
        ['Robe', r.nom],
        ['Code EMS', r.ems],
        ['Yeux', cat.eyeColor],
        ['Naissance', cat.dateOfBirth ? fmt.date(cat.dateOfBirth) : ''],
        ['Âge', cat.dateOfBirth ? fmt.age(cat.dateOfBirth) : '']
      ].filter(([, v]) => v);

      box.innerHTML =
        '<div class="split split--wide-text">' +
          '<div class="reveal">' +
            '<p class="eyebrow">' + esc(cat.sexLabel === 'Femelle' ? 'Notre reine' : 'Notre étalon') + '</p>' +
            '<h1>' + esc(cat.name) + '</h1>' +
            '<p class="lede">' + esc([r.nom, cat.breed].filter(Boolean).join(' · ')) + (cat.dateOfBirth ? ' · ' + esc(fmt.age(cat.dateOfBirth)) : '') + '</p>' +
            '<div class="sheet" style="margin-top:1.6rem"><dl class="facts">' +
              facts.map(([k, v]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>').join('') +
            '</dl></div>' +
            (cat.pedigree ? '<p style="margin-top:1rem"><a class="link-arrow" href="' + esc(cat.pedigreeUrl) + '" target="_blank" rel="noopener">Voir le pedigree</a></p>' : '') +
          '</div>' +
          '<div class="split__media reveal" data-delay="1">' + archImg(cat.photo, 'Portrait de ' + cat.name, 'arch--wide') + '</div>' +
        '</div>' +

        ((cat.mother || cat.father) ?
          '<section class="tight reveal"><h2>Ses parents</h2><div class="family-tree" style="max-width:520px">' +
            (cat.father ? '<figure><span class="label">Père</span>' + archImg(cat.father, 'Père de ' + cat.name) + '</figure>' : '') +
            (cat.mother ? '<figure><span class="label">Mère</span>' + archImg(cat.mother, 'Mère de ' + cat.name) + '</figure>' : '') +
          '</div></section>' : '') +

        (cat.gallery.length ?
          '<section class="tight reveal"><h2>En images</h2><div class="gallery" id="cat-gallery">' +
            cat.gallery.map((g, i) => '<button type="button" data-index="' + i + '" data-full="' + esc(g) + '" data-alt="' + esc(cat.name) + '" aria-label="Agrandir la photo ' + (i + 1) + '"><img src="' + esc(g) + '" alt="' + esc(cat.name + ', photo ' + (i + 1)) + '" loading="lazy" data-guard></button>').join('') +
          '</div></section>' : '') +

        (litters.length ?
          '<section class="tight reveal"><h2>Ses portées</h2><div class="grid grid-3">' +
            litters.map((p) => '<a class="card" href="portee.html?id=' + encodeURIComponent(p.id) + '">' +
              '<div class="card__media">' + archImg(p.motherPhoto || p.fatherPhoto, 'Portée ' + p.name) + '</div>' +
              '<div class="card__body"><h3 class="card__title">' + esc(p.name || 'Portée') + '</h3>' +
              '<p class="card__meta"><span>' + esc(fmt.date(p.dateOfBirth)) + '</span><span><b>' + p.chatons.length + ' chatons</b></span></p></div></a>').join('') +
          '</div></section>' : '');

      bindGallery($('#cat-gallery'));
      guardImages(box); setupReveal(box);
    } catch (e) { fail(box, e); }
  }

  /* ======================================================================
     CHATONS ET PORTÉES
     ====================================================================== */
  async function chatons() {
    const box = $('#litters');
    const summary = $('#kittens-summary');
    box.innerHTML = skeletons(3, true);

    try {
      const portees = await api.portees();
      if (!portees.length) {
        box.innerHTML = empty('Aucune portée en ligne actuellement',
          'Nos portées sont planifiées plusieurs mois à l’avance. Écrivez-nous pour connaître les naissances prévues.',
          '<a class="btn btn--copper" href="contact.html">Nous écrire</a>');
        return;
      }

      const totalAvailable = portees.reduce((n, p) => n + p.available, 0);
      if (summary) {
        summary.innerHTML = totalAvailable
          ? '<span class="pill pill--ok">' + totalAvailable + (totalAvailable > 1 ? ' chatons disponibles' : ' chaton disponible') + '</span>'
          : '<span class="pill pill--muted">Tous nos chatons sont réservés</span>';
      }

      box.innerHTML = portees.map((p, idx) => {
        const weeks = fmt.ageWeeks(p.dateOfBirth);
        const departure = p.dateOfSell ? fmt.date(p.dateOfSell) : '';
        return '<article class="litter reveal" data-delay="' + (idx % 3) + '" style="padding-block:clamp(1.6rem,3vw,2.4rem);border-top:1px solid var(--line)">' +
          '<div class="litter__head">' +
            '<h3>' + esc(p.name || 'Portée') + '</h3>' +
            (p.dateOfBirth ? '<span class="small">Née le ' + esc(fmt.date(p.dateOfBirth)) + (weeks != null && weeks >= 0 ? ' · ' + weeks + ' semaine' + (weeks > 1 ? 's' : '') : '') + '</span>' : '') +
            (p.available ? '<span class="pill pill--ok">' + p.available + ' disponible' + (p.available > 1 ? 's' : '') + '</span>' : '<span class="pill pill--muted">Complète</span>') +
            '<a class="link-arrow" style="margin-left:auto" href="portee.html?id=' + encodeURIComponent(p.id) + '">La portée en détail</a>' +
          '</div>' +
          '<div class="litter__parents">' +
            (p.motherPhoto ? '<span class="litter__parent"><img src="' + esc(p.motherPhoto) + '" alt="" loading="lazy" data-guard> Mère</span>' : '') +
            (p.fatherPhoto || p.externalFatherName ? '<span class="litter__parent">' + (p.fatherPhoto ? '<img src="' + esc(p.fatherPhoto) + '" alt="" loading="lazy" data-guard>' : '') + ' Père' + (p.externalFatherName ? ' : ' + esc(p.externalFatherName) + ' (saillie extérieure)' : '') + '</span>' : '') +
            (departure ? '<span class="litter__parent">Départ à partir du ' + esc(departure) + '</span>' : '') +
          '</div>' +
          (p.chatons.length
            ? '<div class="grid grid-4">' + p.chatons.map((k) => kittenCard(k)).join('') + '</div>'
            : '<p class="small">Les chatons seront présentés ici dès les premières photos.</p>') +
          '</article>';
      }).join('');

      guardImages(box); setupReveal(box);
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
      const [p, cats] = await Promise.all([api.portee(id), api.cats()]);
      if (!p || !p.id) { box.innerHTML = empty('Portée introuvable', 'Voir <a href="chatons.html">toutes nos portées</a>.'); return; }

      document.title = (p.name || 'Portée') + ' — Chatterie British Kingdom';
      const bc = $('#litter-breadcrumb-name'); if (bc) bc.textContent = p.name || 'Portée';

      const mother = cats.find((c) => String(c.id) === String(p.idMaman));
      const father = cats.find((c) => String(c.id) === String(p.idPapa));
      const weeks = fmt.ageWeeks(p.dateOfBirth);

      const facts = [
        ['Naissance', p.dateOfBirth ? fmt.date(p.dateOfBirth) : ''],
        ['Âge', weeks != null && weeks >= 0 ? weeks + ' semaine' + (weeks > 1 ? 's' : '') : ''],
        ['Chatons', p.chatons.length ? String(p.chatons.length) : ''],
        ['Disponibles', String(p.available)],
        ['Départ possible', p.dateOfSell ? 'à partir du ' + fmt.date(p.dateOfSell) : '']
      ].filter(([, v]) => v);

      const parentFig = (cat, photo, role, extName) => {
        const inner = '<span class="label">' + role + '</span>' + archImg(photo, role) +
          '<figcaption>' + (cat ? '<b>' + esc(cat.name) + '</b>' + esc(splitRobe(cat.robe).nom) : '<b>' + esc(extName || '—') + '</b>' + (extName ? '<span class="small">Saillie extérieure</span>' : '')) + '</figcaption>';
        return cat ? '<figure><a href="chat.html?id=' + encodeURIComponent(cat.id) + '" style="text-decoration:none;color:inherit">' + inner + '</a></figure>' : '<figure>' + inner + '</figure>';
      };

      box.innerHTML =
        '<div class="split split--wide-text">' +
          '<div class="reveal">' +
            '<p class="eyebrow">Portée</p><h1>' + esc(p.name || 'Portée') + '</h1>' +
            '<p class="lede">' + (weeks != null && weeks >= 0 ? 'Les chatons ont ' + weeks + ' semaine' + (weeks > 1 ? 's' : '') + '. ' : '') +
              (p.available ? p.available + (p.available > 1 ? ' chatons sont encore disponibles.' : ' chaton est encore disponible.') : 'Tous les chatons de cette portée sont réservés.') + '</p>' +
            '<div class="sheet" style="margin-top:1.4rem"><dl class="facts">' +
              facts.map(([k, v]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>').join('') +
            '</dl></div>' +
          '</div>' +
          '<div class="split__media reveal" data-delay="1"><div class="family-tree">' +
            parentFig(mother, p.motherPhoto, 'Mère') +
            parentFig(father, p.fatherPhoto, 'Père', p.externalFatherName) +
          '</div></div>' +
        '</div>' +

        '<section class="tight"><h2 class="reveal">Les chatons</h2>' +
          (p.chatons.length
            ? '<div class="grid grid-3">' + p.chatons.map((k) => kittenDetail(k)).join('') + '</div>'
            : '<p>Les photos arrivent dès les premiers jours.</p>') +
        '</section>' +
        journal(p, weeks);

      $$('.gallery', box).forEach(bindGallery);
      guardImages(box); setupReveal(box);

      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
      }
    } catch (e) { fail(box, e); }
  }

  function kittenDetail(k) {
    const r = splitRobe(k.robe);
    const photos = k.photos.length ? k.photos : (k.photo ? [k.photo] : []);
    return '<article class="reveal" id="chaton-' + esc(k.id) + '">' +
      '<div class="card__media" style="position:relative">' + archImg(photos[0], 'Chaton ' + k.name) +
        '<div class="card__badges"><span class="pill pill--' + k.statusTone + '">' + esc(k.statusLabel) + '</span></div>' +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(k.name || 'Chaton') + '</h3>' +
        '<p class="card__meta">' + [k.sexLabel, r.nom, k.loof ? 'Pedigree LOOF' : ''].filter(Boolean).map((x) => '<span>' + esc(x) + '</span>').join('') + '</p>' +
        (photos.length > 1 ? '<div class="gallery" style="margin-top:.8rem;grid-template-columns:repeat(auto-fill,minmax(64px,1fr))">' +
          photos.map((src, i) => '<button type="button" data-index="' + i + '" data-full="' + esc(src) + '" data-alt="' + esc(k.name) + '" aria-label="Agrandir la photo ' + (i + 1) + ' de ' + esc(k.name) + '"><img src="' + esc(src) + '" alt="" loading="lazy" data-guard></button>').join('') +
        '</div>' : '') +
        (k.status === 'disponible'
          ? '<p style="margin-top:.8rem"><a class="btn btn--sm btn--copper" href="contact.html?sujet=' + encodeURIComponent('Chaton ' + (k.name || '')) + '">Se renseigner</a></p>'
          : '') +
      '</div></article>';
  }

  /** Journal de la portée : les étapes clés, situées par rapport à l'âge réel. */
  function journal(p, weeks) {
    if (weeks == null || weeks < 0) return '';
    const steps = [
      [0, 'Naissance', 'Les chatons naissent aveugles et sourds, autour de 100 grammes. Pesée quotidienne.'],
      [2, 'Yeux ouverts', 'Les yeux s’ouvrent, d’abord bleus. Les premiers pas arrivent.'],
      [4, 'Sevrage et découverte', 'Début de l’alimentation solide et de l’apprentissage de la litière.'],
      [8, 'Vaccination et identification', 'Première injection du vaccin, puce électronique et enregistrement I-CAD.'],
      [11, 'Socialisation à la maison', 'Aspirateur, visiteurs, enfants, transport : le chaton s’habitue à la vie de famille.'],
      [12, 'Rappel de vaccin et bilan', 'Deuxième injection et examen vétérinaire avant le départ.'],
      [13, 'Départ vers sa famille', 'Remise du carnet de santé, du pedigree et du kit d’adaptation.']
    ];
    return '<section class="tight panel" style="border-radius:var(--radius);padding-inline:clamp(1rem,3vw,2rem)">' +
      '<h2 class="reveal">Le journal de la portée</h2>' +
      '<p class="lede reveal">Ce que vivent les chatons, semaine après semaine, jusqu’à leur départ.</p>' +
      '<ul class="timeline reveal">' + steps.map(([w, title, text], i) => {
        const next = steps[i + 1] ? steps[i + 1][0] : 99;
        const cls = weeks >= next ? 'is-past' : weeks >= w ? 'is-now' : '';
        return '<li class="' + cls + '"><span class="when">' + (w === 0 ? 'Naissance' : w + ' sem.') + '</span>' +
          '<div><h4>' + title + '</h4><p>' + text + '</p></div></li>';
      }).join('') + '</ul></section>';
  }

  /* ======================================================================
     BLOG
     ====================================================================== */
  async function blog() {
    const box = $('#blog-list');
    box.innerHTML = skeletons(3, true);
    try {
      const posts = await api.posts();
      if (!posts.length) { box.innerHTML = empty('Aucun article pour le moment', 'Nos conseils d’élevage arrivent très bientôt.'); return; }
      posts.sort((a, b) => (fmt.parseDate(b.date) || 0) - (fmt.parseDate(a.date) || 0));
      box.innerHTML = '<div class="grid grid-3">' + posts.map((p, i) => '<a class="card reveal" data-delay="' + (i % 3) + '" href="article.html?slug=' + encodeURIComponent(p.slug) + '">' +
        '<div class="card__media">' + archImg(p.cover, p.title, 'arch--wide') +
          (p.category ? '<div class="card__badges"><span class="pill pill--plain">' + esc(p.category) + '</span></div>' : '') + '</div>' +
        '<div class="card__body"><h3 class="card__title">' + esc(p.title) + '</h3>' +
        '<p class="card__meta"><span>' + esc(fmt.date(p.date)) + '</span>' + (p.readingTime ? '<span>' + p.readingTime + ' min de lecture</span>' : '') + '</p>' +
        (p.excerpt ? '<p class="small" style="margin-top:.5rem;color:var(--ink-2)">' + esc(p.excerpt) + '</p>' : '') +
        '</div></a>').join('') + '</div>';
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

      const blocks = (p.content || []).map((b) => {
        const t = (b.type || 'p').toLowerCase();
        if (t === 'h2') return '<h2>' + esc(b.text) + '</h2>';
        if (t === 'quote') return '<blockquote class="callout"><p>' + esc(b.text) + '</p></blockquote>';
        return '<p>' + esc(b.text) + '</p>';
      }).join('');

      box.innerHTML =
        '<header class="reveal" style="margin-bottom:2rem">' +
          (p.category ? '<p class="eyebrow">' + esc(p.category) + '</p>' : '') +
          '<h1>' + esc(p.title) + '</h1>' +
          '<p class="small">' + esc(fmt.date(p.date)) + (p.readingTime ? ' · ' + p.readingTime + ' min de lecture' : '') + '</p>' +
        '</header>' +
        (p.cover ? '<div class="reveal" style="margin-bottom:2rem;border-radius:var(--radius);overflow:hidden"><img src="' + esc(p.cover) + '" alt="' + esc(p.title) + '" data-guard></div>' : '') +
        '<div class="prose reveal">' + (blocks || '<p>' + esc(p.excerpt) + '</p>') + '</div>';
      guardImages(box); setupReveal(box);
    } catch (e) { fail(box, e); }
  }

  /* ======================================================================
     NOS RETRAITÉS
     ====================================================================== */
  async function retraites() {
    const box = $('#retired-list');
    const note = $('#retired-count');
    box.innerHTML = skeletons(3, true);
    try {
      const list = await api.retired();
      if (note) note.textContent = list.length ? list.length + (list.length > 1 ? ' chats' : ' chat') : '';
      if (!list.length) {
        box.innerHTML = empty('Aucun retraité pour le moment',
          'Nos reproducteurs sont encore tous en activité. Cette page se remplira avec le temps.');
        return;
      }
      list.sort((a, b) => (fmt.parseDate(a.dateOfBirth) || 0) - (fmt.parseDate(b.dateOfBirth) || 0));
      box.innerHTML = '<div class="grid grid-3">' + list.map(catCard).join('') + '</div>';
      guardImages(box); setupReveal(box);
    } catch (e) { fail(box, e); }
  }

  /* ======================================================================
     GALERIE
     ====================================================================== */
  async function galerie() {
    const box = $('#gallery-grid');
    const filters = $('#gallery-filters');
    const note = $('#gallery-count');
    box.innerHTML = '<div class="gallery">' + skeletons(12, false).replace(/skeleton--arch/g, 'skeleton') + '</div>';
    let all = [];
    let current = 'toutes';

    function render() {
      const list = current === 'toutes' ? all : all.filter((p) => p.groupe === current);
      if (note) note.textContent = list.length + (list.length > 1 ? ' photos' : ' photo');
      if (!list.length) {
        box.innerHTML = empty('Aucune photo dans cette catégorie', 'Essayez un autre filtre.');
        return;
      }
      box.innerHTML = '<div class="gallery gallery--big" id="gallery-inner">' + list.map((p, i) =>
        '<button type="button" data-index="' + i + '" data-full="' + esc(p.src) + '" data-alt="' + esc(p.legende) + '" aria-label="Agrandir la photo de ' + esc(p.legende) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.legende) + '" loading="lazy" data-guard>' +
        '<span class="gallery__caption">' + esc(p.legende) + '</span>' +
        '</button>').join('') + '</div>';
      bindGallery($('#gallery-inner'));
      guardImages(box); setupReveal(box);
    }

    try {
      all = await api.gallery();
      render();
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
     TÉMOIGNAGES (livre d'or) — bloc réutilisable
     ====================================================================== */
  async function temoignages(selector, limit) {
    const box = $(selector || '#testimonials');
    if (!box) return;
    try {
      const all = await api.livreOr();
      if (!all.length) { box.closest('section') && (box.closest('section').hidden = true); return; }
      const list = all.slice(0, limit || 3);
      box.innerHTML = '<div class="grid grid-3">' + list.map((t, i) => {
        const name = window.BK.util.pick(t, ['name'], 'Une famille');
        const msg = window.BK.util.pick(t, ['message'], '');
        const date = window.BK.util.pick(t, ['dateofCrea', 'dateOfCrea'], '');
        return '<figure class="quote reveal" data-delay="' + (i % 3) + '"><p>« ' + esc(msg) + ' »</p>' +
          '<footer>' + esc(name) + (date ? ' · ' + esc(fmt.date(date, { noDay: true })) : '') + '</footer></figure>';
      }).join('') + '</div>';
      setupReveal(box);
    } catch (e) {
      const s = box.closest('section'); if (s) s.hidden = true;
    }
  }

  /* ---------- pré-remplissage du sujet sur la page contact ---------- */
  function prefillContact() {
    const subject = new URLSearchParams(location.search).get('sujet');
    const field = $('#contact-form [name="subject"]');
    if (subject && field) field.value = subject;
  }

  window.BKPages = { accueil, nosAdultes, retraites, galerie, ficheChat, chatons, portee, blog, article, temoignages, prefillContact };
})();
