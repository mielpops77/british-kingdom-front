/* ==========================================================================
   Chatterie British Kingdom — couche d'accès aux données (site statique v2)
   --------------------------------------------------------------------------
   - Parle à l'API existante (ASP.NET) : https://british-kingdom-back.azurewebsites.net/api/
   - Compose les URL d'images du stockage Azure (mêmes règles que le site Angular)
   - Mode démo : ?demo=1 dans l'URL, ou bascule automatique si l'API est injoignable,
     pour que le site ne soit jamais vide (les données viennent de js/demo-data.js)
   Aucune dépendance. ES2020. Exposé sous window.BK
   ========================================================================== */
(function () {
  'use strict';

  const API_BASE = 'https://british-kingdom-back.azurewebsites.net/api/';
  const BLOB = 'https://stockagebackkingdom.blob.core.windows.net/conteneurkingdom/';
  const PROFIL_ID = 1;

  const IMG = {
    catProfil: BLOB + 'CatsProfil/',
    catParents: BLOB + 'CatsParents/',
    catGallery: BLOB + 'CatsImages/',
    chaton: BLOB + 'Chatons/',
    divers: BLOB + 'ImgDivers/',
    pedigree: BLOB + 'Pedigree/',
    profil: BLOB + 'Profil/',
    banner: BLOB + 'Banner/',
    favicon: BLOB + 'favicon/'
  };

  const params = new URLSearchParams(location.search);
  let demoForced = params.get('demo') === '1';
  let demoActive = demoForced;

  /* ---------- utilitaires ---------- */
  // Un chemin déjà utilisable : URL absolue, donnée en ligne, ou fichier local du site.
  const isAbs = (s) => /^(https?:)?\/\//i.test(s || '') || /^data:/i.test(s || '') || /^\.?\/?(assets|img)\//i.test(s || '');
  const join = (base, file) => (!file ? '' : isAbs(file) ? file : base + encodeURIComponent(String(file).trim()).replace(/%2F/g, '/'));

  /** Lit la première clé existante d'un objet (l'API mélange camelCase et PascalCase sur les bannières). */
  function pick(obj, keys, fallback) {
    if (!obj) return fallback;
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
      const lower = k.charAt(0).toLowerCase() + k.slice(1);
      const upper = k.charAt(0).toUpperCase() + k.slice(1);
      if (obj[lower] !== undefined && obj[lower] !== null && obj[lower] !== '') return obj[lower];
      if (obj[upper] !== undefined && obj[upper] !== null && obj[upper] !== '') return obj[upper];
    }
    return fallback;
  }

  /** "a,b,c" | ["a","b"] | null -> ["a","b","c"] (entrées vides retirées) */
  function list(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : pick(x, ['url', 'name', 'fileName'], ''))).filter(Boolean);
    return String(v).split(',').map((s) => s.trim()).filter(Boolean);
  }

  async function http(path, options) {
    const url = API_BASE + path;
    const res = await fetch(url, Object.assign({ headers: { 'Accept': 'application/json' } }, options || {}));
    if (!res.ok) {
      const err = new Error('HTTP ' + res.status + ' sur ' + path);
      err.status = res.status;
      throw err;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  /**
   * Exécute un appel API ; en cas d'échec réseau (API injoignable, hors ligne, CORS),
   * bascule en mode démo et renvoie la donnée de démonstration correspondante.
   */
  async function withDemo(key, fn, demoValue) {
    if (demoActive && window.BK_DEMO) return clone(demoValue());
    try {
      return await fn();
    } catch (e) {
      if (!e.status && window.BK_DEMO) {
        // Erreur réseau (pas une réponse HTTP) : l'API n'est pas joignable.
        demoActive = true;
        document.documentElement.setAttribute('data-demo', 'auto');
        console.warn('[BK] API injoignable, données de démonstration affichées (' + key + ').', e.message);
        return clone(demoValue());
      }
      throw e;
    }
  }
  const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
  const D = () => window.BK_DEMO || {};

  /* ---------- normalisation des enregistrements ---------- */
  const SEX = { male: 'Mâle', female: 'Femelle' };
  function sexOf(v) {
    const s = String(v || '').toLowerCase();
    if (s.startsWith('m')) return 'male';
    if (s.startsWith('f')) return 'female';
    return '';
  }
  const STATUS = {
    disponible: { key: 'disponible', label: 'Disponible', tone: 'ok' },
    reserve: { key: 'reserve', label: 'Réservé', tone: 'warn' },
    rester: { key: 'rester', label: 'Reste à la chatterie', tone: 'muted' },
    vendu: { key: 'vendu', label: 'Adopté', tone: 'muted' }
  };
  function statusOf(v) {
    const s = String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (s.startsWith('dispo')) return STATUS.disponible;
    if (s.startsWith('reserv')) return STATUS.reserve;
    if (s.startsWith('rest')) return STATUS.rester;
    if (s.startsWith('vend') || s.startsWith('adopt')) return STATUS.vendu;
    return { key: s || 'inconnu', label: v || '—', tone: 'muted' };
  }

  function normCat(c) {
    if (!c) return null;
    const gallery = list(pick(c, ['images'], []));
    return {
      id: pick(c, ['id']),
      name: pick(c, ['name'], ''),
      robe: pick(c, ['robe'], ''),
      breed: pick(c, ['breed'], ''),
      eyeColor: pick(c, ['eyeColor'], ''),
      sex: sexOf(pick(c, ['sex'], '')),
      sexLabel: SEX[sexOf(pick(c, ['sex'], ''))] || '',
      dateOfBirth: pick(c, ['dateOfBirth'], ''),
      pedigree: pick(c, ['pedigree'], ''),
      pedigreeUrl: join(IMG.pedigree, pick(c, ['pedigree'], '')),
      archivee: !!pick(c, ['archivee'], false),
      photo: join(IMG.catProfil, pick(c, ['urlProfil'], '')),
      mother: join(IMG.catParents, pick(c, ['urlProfilMother'], '')),
      father: join(IMG.catParents, pick(c, ['urlProfilFather'], '')),
      gallery: gallery.map((g) => join(IMG.catGallery, g)),
      sailliesExterieures: pick(c, ['sailliesExterieures'], ''),
      raw: c
    };
  }

  function normChaton(k) {
    if (!k) return null;
    const st = statusOf(pick(k, ['status'], ''));
    const photos = list(pick(k, ['photos'], []));
    return {
      id: pick(k, ['id']),
      idPortee: pick(k, ['idPortee']),
      name: pick(k, ['name'], ''),
      porteeName: pick(k, ['porteeName'], ''),
      sex: sexOf(pick(k, ['sex'], '')),
      sexLabel: SEX[sexOf(pick(k, ['sex'], ''))] || '',
      robe: pick(k, ['robe'], ''),
      breed: pick(k, ['breed'], ''),
      loof: !!pick(k, ['loof'], false),
      status: st.key, statusLabel: st.label, statusTone: st.tone,
      dateOfBirth: pick(k, ['dateOfBirth'], ''),
      photo: join(IMG.chaton, pick(k, ['urlProfil'], '') || photos[0] || ''),
      photos: photos.map((p) => join(IMG.chaton, p)),
      raw: k
    };
  }

  function normPortee(p) {
    if (!p) return null;
    const chatons = (pick(p, ['chatons'], []) || []).map(normChaton);
    const extName = pick(p, ['externalFatherName'], '');
    return {
      id: pick(p, ['id']),
      name: pick(p, ['name'], ''),
      idPapa: pick(p, ['idPapa'], 0),
      idMaman: pick(p, ['idMaman'], 0),
      dateOfBirth: pick(p, ['dateOfBirth'], ''),
      dateOfSell: pick(p, ['dateOfSell'], ''),
      disponible: !!pick(p, ['disponible'], false),
      archivee: !!pick(p, ['archivee'], false),
      motherPhoto: join(IMG.catProfil, pick(p, ['urlProfilMother'], '')),
      fatherPhoto: extName ? join(IMG.catParents, pick(p, ['externalFatherPhoto'], '')) : join(IMG.catProfil, pick(p, ['urlProfilFather'], '')),
      externalFatherName: extName,
      chatons,
      available: chatons.filter((c) => c.status === 'disponible').length,
      raw: p
    };
  }

  function normBanner(b) {
    if (!b) return null;
    const one = Array.isArray(b) ? b[0] : b;
    return {
      title: pick(one, ['title'], ''),
      subtitle: pick(one, ['subtitle'], ''),
      bannerImages: list(pick(one, ['bannerImages'], [])).map((i) => join(IMG.banner, i)),
      maleImg: join(IMG.banner, pick(one, ['maleImg'], '')),
      femaleImg: join(IMG.banner, pick(one, ['femaleImg'], '')),
      kittenImg: join(IMG.banner, pick(one, ['kittenImg'], '')),
      maleDescription: pick(one, ['maleDescription'], ''),
      femaleDescription: pick(one, ['femaleDescription'], ''),
      kittenDescription: pick(one, ['kittenDescription'], ''),
      titleCard1: pick(one, ['titleCard1'], ''),
      titleCard2: pick(one, ['titleCard2'], ''),
      titleCard3: pick(one, ['titleCard3'], ''),
      textAccueil: pick(one, ['textPageAccueil'], ''),
      titleMales: pick(one, ['titlePageMales'], ''),
      textMales: pick(one, ['textPageMales'], ''),
      titleFemelles: pick(one, ['TitlePageFemelles', 'titlePageFemelles'], ''),
      textFemelles: pick(one, ['TextPageFemelles', 'textPageFemelles'], ''),
      textConditions: pick(one, ['textPageCondition'], ''),
      textContact: pick(one, ['textPageContact'], ''),
      favicon: join(IMG.favicon, pick(one, ['favicon'], '')),
      raw: one
    };
  }

  function normProfil(p) {
    if (!p) return null;
    const one = Array.isArray(p) ? p[0] : p;
    return {
      id: pick(one, ['id']),
      firstName: pick(one, ['firstName'], ''),
      lastName: pick(one, ['lastName'], ''),
      phone: pick(one, ['phoneNumber'], ''),
      email: pick(one, ['email'], ''),
      siren: pick(one, ['siren'], ''),
      facebook: pick(one, ['facebook'], ''),
      instagram: pick(one, ['instagram'], ''),
      tiktok: pick(one, ['tiktok'], ''),
      youtube: pick(one, ['youtube'], ''),
      twitter: pick(one, ['twitter'], ''),
      raw: one
    };
  }

  function normPost(a) {
    if (!a) return null;
    const cover = pick(a, ['coverImage'], '');
    return {
      id: pick(a, ['id']),
      slug: pick(a, ['slug'], ''),
      title: pick(a, ['title'], ''),
      excerpt: pick(a, ['excerpt'], ''),
      category: pick(a, ['category'], ''),
      cover: join(IMG.divers, cover),
      date: pick(a, ['date'], ''),
      readingTime: Number(pick(a, ['readingTime'], 0)) || 0,
      content: Array.isArray(pick(a, ['content'], [])) ? pick(a, ['content'], []) : [],
      raw: a
    };
  }

  /* ---------- formatage ---------- */
  const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  function parseDate(v) {
    if (!v) return null;
    if (v instanceof Date) return v;
    const s = String(v);
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    const f = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (f) return new Date(+f[3], +f[2] - 1, +f[1]);
    const d = new Date(s);
    return isNaN(d) ? null : d;
  }
  function fmtDate(v, opts) {
    const d = parseDate(v);
    if (!d) return '';
    const o = opts || {};
    if (o.short) return d.toLocaleDateString('fr-FR');
    return (o.noDay ? '' : d.getDate() + ' ') + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }
  function age(v, ref) {
    const d = parseDate(v);
    if (!d) return '';
    const now = ref || new Date();
    let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (now.getDate() < d.getDate()) months -= 1;
    if (months < 0) return 'à naître';
    if (months < 1) {
      const days = Math.max(0, Math.round((now - d) / 86400000));
      const weeks = Math.floor(days / 7);
      return weeks >= 1 ? weeks + ' semaine' + (weeks > 1 ? 's' : '') : days + ' jour' + (days > 1 ? 's' : '');
    }
    if (months < 24) return months + ' mois';
    const years = Math.floor(months / 12), rest = months % 12;
    return years + ' an' + (years > 1 ? 's' : '') + (rest ? ' et ' + rest + ' mois' : '');
  }
  function ageWeeks(v, ref) {
    const d = parseDate(v);
    if (!d) return null;
    return Math.floor(((ref || new Date()) - d) / (7 * 86400000));
  }

  /* ---------- API publique ---------- */
  const api = {
    profil: () => withDemo('profil', async () => normProfil(await http('profil?profilId=' + PROFIL_ID)), () => normProfil(D().profil)),
    banner: () => withDemo('banner', async () => normBanner(await http('banner?profilId=' + PROFIL_ID)), () => normBanner(D().banner)),
    /** Tous les chats, archivés compris. */
    allCats: () => withDemo('cats', async () => (await http('cats?profilId=' + PROFIL_ID) || []).map(normCat), () => (D().cats || []).map(normCat)),
    /** Les reproducteurs en activité. */
    cats: async () => (await api.allCats()).filter((c) => c && !c.archivee),
    /** Les retraités : les chats marqués « archivé » dans l'administration. */
    retired: async () => (await api.allCats()).filter((c) => c && c.archivee),
    /**
     * Toutes les photos du site, pour la galerie : portraits et galeries des
     * adultes, puis photos des chatons, portée par portée.
     */
    gallery: async () => {
      const [cats, portees] = await Promise.all([api.allCats(), api.portees()]);
      const out = [];
      const push = (src, legende, groupe) => { if (src && !out.some((p) => p.src === src)) out.push({ src, legende, groupe }); };
      cats.forEach((c) => {
        push(c.photo, c.name, c.archivee ? 'retraites' : 'adultes');
        c.gallery.forEach((g) => push(g, c.name, c.archivee ? 'retraites' : 'adultes'));
      });
      portees.forEach((p) => p.chatons.forEach((k) => {
        push(k.photo, k.name + (p.name ? ' · ' + p.name : ''), 'chatons');
        k.photos.forEach((ph) => push(ph, k.name + (p.name ? ' · ' + p.name : ''), 'chatons'));
      }));
      return out;
    },
    cat: (id) => withDemo('cat', async () => normCat(await http('cats/' + encodeURIComponent(id))), () => normCat((D().cats || []).find((c) => String(c.id) === String(id)))),
    portees: async () => {
      const all = await withDemo('portees', async () => (await http('portee?profilId=' + PROFIL_ID) || []).map(normPortee), () => (D().portees || []).map(normPortee));
      return all.filter((p) => p && !p.archivee).sort((a, b) => (parseDate(b.dateOfBirth) || 0) - (parseDate(a.dateOfBirth) || 0));
    },
    portee: (id) => withDemo('portee', async () => normPortee(await http('portee/' + encodeURIComponent(id))), () => normPortee((D().portees || []).find((p) => String(p.id) === String(id)))),
    chatons: () => withDemo('chatons', async () => (await http('chaton?profilId=' + PROFIL_ID) || []).map(normChaton), () => (D().portees || []).flatMap((p) => p.chatons || []).map(normChaton)),
    posts: () => withDemo('blog', async () => (await http('blog?profilId=' + PROFIL_ID) || []).map(normPost), () => (D().posts || []).map(normPost)),
    post: (slug) => withDemo('article', async () => normPost(await http('blog/' + encodeURIComponent(slug) + '?profilId=' + PROFIL_ID)), () => normPost((D().posts || []).find((p) => p.slug === slug))),
    livreOr: () => withDemo('livreOr', async () => (await http('livreOr?profilId=' + PROFIL_ID) || []).filter((t) => pick(t, ['validation'], true)), () => D().livreOr || []),
    /** Envoie le formulaire de contact. `data` = { name, email, num, subject, message } */
    contact: async (data) => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const body = {
        profilId: PROFIL_ID,
        name: data.name || '', email: data.email || '', num: data.num || '',
        subject: data.subject || '', message: data.message || '',
        vue: false,
        dateofCrea: now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()),
        hour: pad(now.getHours()) + ':' + pad(now.getMinutes())
      };
      if (demoActive) { await new Promise((r) => setTimeout(r, 600)); return { demo: true }; }
      return http('contact', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) });
    },
    /** Statistiques de visite (mêmes appels que le site actuel), silencieux en cas d'échec. */
    trackVisit: () => {
      if (demoActive) return;
      try {
        if (sessionStorage.getItem('bk_visit')) return;
        sessionStorage.setItem('bk_visit', '1');
      } catch (e) { /* stockage indisponible : on enregistre quand même */ }
      http('statistique', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profilId: PROFIL_ID }) }).catch(() => {});
    },
    heartbeat: () => {
      if (demoActive) return;
      const send = () => http('statistique/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profilId: PROFIL_ID }) }).catch(() => {});
      send();
      setInterval(send, 30000);
    }
  };

  window.BK = {
    API_BASE, BLOB, PROFIL_ID, IMG,
    api,
    img: { join, catProfil: (f) => join(IMG.catProfil, f), parent: (f) => join(IMG.catParents, f), gallery: (f) => join(IMG.catGallery, f), chaton: (f) => join(IMG.chaton, f), banner: (f) => join(IMG.banner, f), divers: (f) => join(IMG.divers, f) },
    fmt: { date: fmtDate, age, ageWeeks, parseDate, status: statusOf, sex: sexOf, SEX, STATUS },
    util: { pick, list, clone },
    get demo() { return demoActive; },
    get demoForced() { return demoForced; },
    setDemo(on) { demoActive = !!on; if (on) document.documentElement.setAttribute('data-demo', 'forced'); }
  };
  if (demoForced) document.documentElement.setAttribute('data-demo', 'forced');
})();
