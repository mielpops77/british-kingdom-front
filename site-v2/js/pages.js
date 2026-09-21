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

  /** Extrait un code EMS entre parenthèses : "Bleu (BRI a)" -> { nom:"Bleu", ems:"BRI a" } */
  function splitRobe(robe) {
    const t = cleanText(robe);
    const m = t.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    return m ? { nom: m[1].trim(), ems: m[2].trim() } : { nom: t, ems: '' };
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

  function fail(container, e) {
    console.error(e);
    if (!container) return;
    container.innerHTML = empty(
      'Contenu momentanément indisponible',
      'Nous n’arrivons pas à joindre notre base de données. Réessayez dans un instant, ou appelez-nous au <a href="tel:+33661654998">06 61 65 49 98</a>.'
    );
  }

  /** Marque dans le menu la rubrique d'une page qui n'y figure pas (fiche d'un chat). */
  function markNav(href) {
    $$('.nav a').forEach((a) => { if (a.getAttribute('href') === href) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  }

  /* ---------- cartes ---------- */
  function catCard(cat) {
    const r = splitRobe(cat.robe);
    const breed = shortBreed(cat.breed);
    return '<a class="card reveal" href="chat.html?id=' + encodeURIComponent(cat.id) + '">' +
      '<div class="card__media">' + archImg(cat.photo, 'Portrait de ' + niceName(cat.name)) +
        (breed ? '<div class="card__badges"><span class="pill pill--breed">' + esc(breed) + '</span></div>' : '') +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(niceName(cat.name)) + '</h3>' +
        '<p class="card__meta">' +
          (r.nom ? '<span>' + esc(r.nom) + '</span>' : '') +
          (cat.dateOfBirth ? '<span><b>' + esc(fmt.age(cat.dateOfBirth)) + '</b></span>' : '') +
        '</p>' +
      '</div></a>';
  }

  const sexMark = (sex) => sex === 'male' ? '<span class="sex sex--m" aria-hidden="true">♂</span>' : sex === 'female' ? '<span class="sex sex--f" aria-hidden="true">♀</span>' : '';

  function kittenCard(k) {
    const r = splitRobe(k.robe);
    return '<a class="card card--kitten reveal" href="portee.html?id=' + encodeURIComponent(k.idPortee) + '#chaton-' + encodeURIComponent(k.id) + '">' +
      '<div class="card__media">' + archImg(k.photo, 'Photo du chaton ' + niceName(k.name)) +
        '<div class="card__badges"><span class="pill pill--' + k.status + '">' + esc(k.statusLabel) + '</span></div>' +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(niceName(k.name) || 'Chaton') + '</h3>' +
        '<p class="card__meta">' +
          (k.sexLabel ? '<span>' + sexMark(k.sex) + esc(k.sexLabel) + '</span>' : '') +
          (r.nom ? '<span>' + esc(r.nom) + '</span>' : '') +
        '</p>' +
        (k.dateOfBirth ? '<p class="card__sub">' + esc(fmt.age(k.dateOfBirth)) + (shortBreed(k.breed) ? ' · ' + esc(shortBreed(k.breed)) : '') + '</p>' : '') +
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
    if (kittensBox) kittensBox.innerHTML = '<div class="grid grid-4">' + skeletons(4) + '</div>';

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
    guardImages(); setupReveal();
  }

  /* ======================================================================
     NOS MÂLES / NOS FEMELLES
     ====================================================================== */
  async function sexPage(sex) {
    const box = $('#cats-list');
    const note = $('#cats-count');
    box.innerHTML = skeletons(3, true);
    try {
      const cats = await api.cats();
      // L'ordre est celui de l'administration, comme sur le site actuel
      const list = cats.filter((c) => c.sex === sex);
      if (note) note.textContent = list.length ? plural(list.length, sex === 'male' ? 'mâle' : 'femelle', sex === 'male' ? 'mâles' : 'femelles') : '';
      box.innerHTML = list.length
        ? '<div class="grid ' + (list.length === 4 || list.length > 6 ? 'grid-4' : 'grid-3') + ' cats">' + list.map(catCard).join('') + '</div>'
        : empty(sex === 'male' ? 'Nos mâles arrivent bientôt sur le site' : 'Nos femelles arrivent bientôt sur le site',
            'Les fiches sont en cours de mise à jour.');
      guardImages(box); setupReveal(box);
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
  async function ficheChat() {
    const box = $('#cat-detail');
    const id = new URLSearchParams(location.search).get('id');
    if (!id) { box.innerHTML = empty('Chat introuvable', 'Revenez à la page <a href="males.html">Nos mâles</a> ou <a href="femelles.html">Nos femelles</a>.'); return; }

    try {
      const [cat, portees, cats] = await Promise.all([api.cat(id), api.portees(), api.allCats()]);
      if (!cat || !cat.id) { box.innerHTML = empty('Chat introuvable', 'Ce chat n’est plus présenté sur le site. Voir <a href="males.html">nos mâles</a> et <a href="femelles.html">nos femelles</a>.'); return; }

      const name = niceName(cat.name);
      document.title = name + ' — Chatterie British Kingdom';
      const bc = $('#cat-breadcrumb-name'); if (bc) bc.textContent = name;
      const parentHref = cat.archivee ? 'retraites.html' : cat.sex === 'female' ? 'femelles.html' : 'males.html';
      const parentLink = $('#cat-breadcrumb-parent');
      if (parentLink) { parentLink.href = parentHref; parentLink.textContent = cat.archivee ? 'Nos retraités' : cat.sex === 'female' ? 'Nos femelles' : 'Nos mâles'; }
      markNav(parentHref);

      const r = splitRobe(cat.robe);
      const litters = portees.filter((p) => String(p.idPapa) === String(cat.id) || String(p.idMaman) === String(cat.id));
      const female = cat.sex === 'female';
      const eyebrow = cat.archivee ? (female ? 'Notre retraitée' : 'Notre retraité') : (female ? 'Notre reproductrice' : 'Notre étalon');

      const facts = [
        ['Race', cleanText(cat.breed)],
        ['Sexe', cat.sexLabel],
        ['Robe', r.nom],
        ['Code EMS', r.ems],
        ['Yeux', cleanText(cat.eyeColor)],
        ['Naissance', cat.dateOfBirth ? fmt.date(cat.dateOfBirth) : ''],
        ['Âge', cat.dateOfBirth ? fmt.age(cat.dateOfBirth) : ''],
        ['Saillies extérieures', !female && !cat.archivee ? yesNo(cat.sailliesExterieures) : '']
      ].filter(([, v]) => v);

      box.innerHTML =
        '<div class="split split--wide-text profile">' +
          '<div class="reveal">' +
            '<p class="eyebrow">' + eyebrow + '</p>' +
            '<h1>' + esc(name) + '</h1>' +
            '<p class="lede">' + esc([r.nom, cleanText(cat.breed)].filter(Boolean).join(' · ')) + (cat.dateOfBirth ? ' · ' + esc(fmt.age(cat.dateOfBirth)) : '') + '</p>' +
            '<div class="sheet"><dl class="facts">' +
              facts.map(([k, v]) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>').join('') +
            '</dl></div>' +
            (cat.pedigree ? '<p style="margin-top:1rem"><a class="link-arrow" href="' + esc(cat.pedigreeUrl) + '" target="_blank" rel="noopener">Voir le pedigree</a></p>' : '') +
          '</div>' +
          '<div class="split__media reveal" data-delay="1"><figure class="frame-photo frame-photo--arch">' +
            (cat.photo ? '<img src="' + esc(cat.photo) + '" alt="Portrait de ' + esc(name) + '" data-guard>' : '<div class="img-fallback" aria-hidden="true"></div>') +
          '</figure></div>' +
        '</div>' +

        ((cat.mother || cat.father) ?
          '<section class="tight reveal"><h2>Ses parents</h2><div class="family-tree">' +
            (cat.father ? '<figure><span class="label">Père</span>' + archImg(cat.father, 'Père de ' + name, 'arch--round') + '</figure>' : '') +
            (cat.mother ? '<figure><span class="label">Mère</span>' + archImg(cat.mother, 'Mère de ' + name, 'arch--round') + '</figure>' : '') +
          '</div></section>' : '') +

        (cat.gallery.length ?
          '<section class="tight reveal"><h2>En images</h2><div class="gallery" id="cat-gallery">' +
            cat.gallery.map((g, i) => '<button type="button" data-index="' + i + '" data-full="' + esc(g) + '" data-alt="' + esc(name) + '" aria-label="Agrandir la photo ' + (i + 1) + ' de ' + esc(name) + '"><img src="' + esc(g) + '" alt="' + esc(name + ', photo ' + (i + 1)) + '" loading="lazy" data-guard></button>').join('') +
          '</div></section>' : '') +

        (litters.length ?
          '<section class="tight reveal"><h2>' + (litters.length > 1 ? 'Ses portées' : 'Sa portée') + ' du moment</h2><div class="couples">' +
            litters.map((p) => litterCard(p, cats)).join('') +
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
    const filters = $('#kitten-filters');
    box.innerHTML = skeletons(3, true);
    let portees = [], cats = [], current = 'tous';

    function render() {
      const shown = portees.map((p) => ({ p, list: current === 'tous' ? p.chatons : p.chatons.filter((k) => k.status === current) }))
        .filter((x) => x.list.length || current === 'tous');
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
        return;
      }
      const totalAvailable = portees.reduce((n, p) => n + p.available, 0);
      if (summary) summary.textContent = totalAvailable ? plural(totalAvailable, 'chaton disponible', 'chatons disponibles') : 'Tous nos chatons sont réservés';
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

      $$('.gallery', box).forEach(bindGallery);
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
    return '<article class="kitten-detail reveal" id="chaton-' + esc(k.id) + '">' +
      '<div class="card__media">' + archImg(photos[0], 'Chaton ' + name) +
        '<div class="card__badges"><span class="pill pill--' + k.status + '">' + esc(k.statusLabel) + '</span></div>' +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + esc(name) + '</h3>' +
        '<p class="card__meta">' + [k.sexLabel ? sexMark(k.sex) + esc(k.sexLabel) : '', esc(r.nom), esc(shortBreed(k.breed)), k.loof ? 'LOOF' : '']
          .filter(Boolean).map((x) => '<span>' + x + '</span>').join('') + '</p>' +
        (photos.length > 1 ? '<div class="gallery gallery--mini">' +
          photos.map((src, i) => '<button type="button" data-index="' + i + '" data-full="' + esc(src) + '" data-alt="' + esc(name) + '" aria-label="Agrandir la photo ' + (i + 1) + ' de ' + esc(name) + '"><img src="' + esc(src) + '" alt="" loading="lazy" data-guard></button>').join('') +
        '</div>' : '') +
        (k.status === 'disponible'
          ? '<p class="kitten-detail__cta"><a class="btn btn--sm btn--primary" href="contact.html?sujet=' + encodeURIComponent('Chaton ' + name) + '">Se renseigner sur ' + esc(name) + '</a></p>'
          : '') +
      '</div></article>';
  }

  /** Journal de la portée : les grandes étapes, situées par rapport à l'âge réel des chatons. */
  function journal(weeks) {
    if (weeks == null || weeks < 0) return '';
    const steps = [
      [0, 'Naissance', 'Les chatons naissent les yeux fermés, blottis contre leur mère. On les pèse chaque jour.'],
      [2, 'Les yeux s’ouvrent', 'D’abord bleus chez tous les chatons. Les premiers pas, un peu hésitants, arrivent.'],
      [4, 'Les découvertes', 'Premiers repas solides, apprentissage de la litière, premiers jeux avec la fratrie.'],
      [8, 'Identification et vaccins', 'Puce électronique et premières vaccinations, avec le carnet de santé.'],
      [10, 'La vie de famille', 'Visiteurs, bruits de la maison, câlins : le chaton s’habitue à tout ce qu’il retrouvera chez vous.'],
      [12, 'Le départ', 'Vers douze semaines, avec son certificat LOOF, son carnet de santé et un peu de nourriture pour les premiers jours.']
    ];
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
    box.innerHTML = skeletons(3, true);
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
    box.innerHTML = skeletons(3, true);
    try {
      const list = await api.retired();
      if (note) note.textContent = list.length ? plural(list.length, 'chat', 'chats') : '';
      if (!list.length) {
        box.innerHTML = empty('Aucun retraité pour le moment',
          'Nos reproducteurs sont encore tous en activité. Cette page se remplira avec le temps.');
        return;
      }
      list.sort((a, b) => (fmt.parseDate(a.dateOfBirth) || 0) - (fmt.parseDate(b.dateOfBirth) || 0));
      box.innerHTML = '<div class="grid grid-3 cats">' + list.map(catCard).join('') + '</div>';
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
    box.innerHTML = '<div class="gallery gallery--big">' + skeletons(8, false).replace(/skeleton--arch/g, 'skeleton skeleton--tile') + '</div>';
    let all = [];
    let current = 'toutes';

    function render() {
      const list = current === 'toutes' ? all : all.filter((p) => p.groupe === current);
      if (note) note.textContent = plural(list.length, 'photo', 'photos');
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
      all = (await api.gallery()).map((p) => Object.assign(p, { legende: niceName(p.legende) }));
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

  window.BKPages = { accueil, sexPage, retraites, galerie, ficheChat, chatons, portee, blog, article, listeAttente, temoignages, prefillContact };
})();
