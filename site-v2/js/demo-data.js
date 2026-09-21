/* ==========================================================================
   Données de démonstration
   --------------------------------------------------------------------------
   Utilisées uniquement quand l'API n'est pas joignable (aperçu hors ligne)
   ou avec ?demo=1 dans l'adresse. Elles respectent exactement la forme des
   réponses de l'API réelle, y compris les noms de champs et les valeurs
   possibles de "sex" (Mâle / Femelle) et de "status" (disponible, reserve,
   rester, vendu).
   ATTENTION : ce sont des exemples, pas les vrais chats de la chatterie.
   ========================================================================== */
window.BK_DEMO = {
  profil: {
    id: 1, firstName: 'British', lastName: 'Kingdom',
    phoneNumber: '0661654998', email: 'chatterie.british.kingdom@gmail.com',
    siren: '844323253', userType: 'eleveur',
    facebook: '', instagram: '', tiktok: '', youtube: '', twitter: ''
  },

  banner: {
    profilId: 1,
    title: 'Chatterie British Kingdom',
    subtitle: 'Élevage familial de British Shorthair et Longhair',
    bannerImages: [],
    maleImg: '', femaleImg: '', kittenImg: '',
    titleCard1: 'Nos mâles', titleCard2: 'Nos femelles', titleCard3: 'Nos chatons',
    maleDescription: 'Nos reproducteurs, testés et titrés.',
    femaleDescription: 'Nos reines, mères attentives.',
    kittenDescription: 'Les chatons disponibles et à venir.',
    textPageAccueil: ''
  },

  cats: [
    {
      id: 1, profilId: 1, name: 'Prosper', robe: 'Bleu (BRI a)', breed: 'British Shorthair',
      dateOfBirth: '2021-04-18', sex: 'Mâle', eyeColor: 'Cuivre',
      urlProfil: 'assets/photo-male.webp', urlProfilMother: 'assets/photo-femelle.webp', urlProfilFather: 'assets/photo-male.webp',
      images: ['assets/photo-male.webp', 'assets/photo-chaton-lierre.webp', 'assets/poster-globe.webp', 'assets/photo-chaton-feuilles.webp'],
      pedigree: '', sailliesExterieures: 'Non', archivee: false
    },
    {
      id: 2, profilId: 1, name: 'Ombeline', robe: 'Lilas (BRI c)', breed: 'British Shorthair',
      dateOfBirth: '2021-09-02', sex: 'Femelle', eyeColor: 'Cuivre',
      urlProfil: 'assets/photo-femelle.webp', urlProfilMother: '', urlProfilFather: '', images: [],
      pedigree: '', sailliesExterieures: 'Non', archivee: false
    },
    {
      id: 3, profilId: 1, name: 'Joséphine', robe: 'Black Silver Shaded (BRI ns 11)', breed: 'British Longhair',
      dateOfBirth: '2022-03-25', sex: 'Femelle', eyeColor: 'Vert',
      urlProfil: 'assets/photo-chaton-lierre.webp', urlProfilMother: '', urlProfilFather: '', images: [],
      pedigree: '', sailliesExterieures: 'Non', archivee: false
    },
    {
      id: 4, profilId: 1, name: 'Windsor', robe: 'Golden Shaded (BRI ny 11)', breed: 'British Shorthair',
      dateOfBirth: '2020-11-11', sex: 'Mâle', eyeColor: 'Vert',
      urlProfil: 'assets/poster-globe.webp', urlProfilMother: '', urlProfilFather: '', images: [],
      pedigree: '', sailliesExterieures: 'Oui', archivee: false
    },
    {
      id: 5, profilId: 1, name: 'Albertine', robe: 'Crème (BRI e)', breed: 'British Shorthair',
      dateOfBirth: '2022-08-14', sex: 'Femelle', eyeColor: 'Cuivre',
      urlProfil: 'assets/photo-chaton-feuilles.webp', urlProfilMother: '', urlProfilFather: '', images: [],
      pedigree: '', sailliesExterieures: 'Non', archivee: false
    }
  ],

  portees: [
    {
      id: 1, profilId: 1, name: 'Portée royale', idPapa: 1, idMaman: 2,
      dateOfBirth: '2026-07-04', dateOfSell: '2026-09-26',
      urlProfilMother: 'assets/photo-femelle.webp', urlProfilFather: 'assets/photo-male.webp',
      externalFatherName: '', externalFatherPhoto: '',
      disponible: true, archivee: false,
      chatons: [
        { id: 11, idPortee: 1, profilId: 1, name: 'Arthur', porteeName: 'Portée royale', sex: 'Mâle', status: 'disponible', robe: 'Bleu (BRI a)', breed: 'British Shorthair', dateOfBirth: '2026-07-04', urlProfil: 'assets/photo-chaton.webp', photos: ['assets/photo-chaton.webp', 'assets/photo-chaton.webp', 'assets/photo-chaton-feuilles.webp'], loof: true },
        { id: 12, idPortee: 1, profilId: 1, name: 'Aliénor', porteeName: 'Portée royale', sex: 'Femelle', status: 'reserve', robe: 'Lilas (BRI c)', breed: 'British Shorthair', dateOfBirth: '2026-07-04', urlProfil: 'assets/photo-chaton-feuilles.webp', photos: ['assets/photo-chaton-feuilles.webp', 'assets/photo-chaton.webp', 'assets/photo-chaton-feuilles.webp'], loof: true },
        { id: 13, idPortee: 1, profilId: 1, name: 'Albion', porteeName: 'Portée royale', sex: 'Mâle', status: 'disponible', robe: 'Bleu (BRI a)', breed: 'British Shorthair', dateOfBirth: '2026-07-04', urlProfil: 'assets/photo-chaton-lierre.webp', photos: ['assets/photo-chaton-lierre.webp', 'assets/photo-chaton.webp', 'assets/photo-chaton-feuilles.webp'], loof: true },
        { id: 14, idPortee: 1, profilId: 1, name: 'Anouchka', porteeName: 'Portée royale', sex: 'Femelle', status: 'rester', robe: 'Bleu (BRI a)', breed: 'British Shorthair', dateOfBirth: '2026-07-04', urlProfil: 'assets/poster-globe.webp', photos: ['assets/poster-globe.webp', 'assets/photo-chaton.webp', 'assets/photo-chaton-feuilles.webp'], loof: true }
      ]
    },
    {
      id: 2, profilId: 1, name: 'Portée des jardins', idPapa: 0, idMaman: 3,
      dateOfBirth: '2026-05-16', dateOfSell: '2026-08-08',
      urlProfilMother: 'assets/photo-chaton-lierre.webp', urlProfilFather: '',
      externalFatherName: 'Sir Cassian of Wexford', externalFatherPhoto: 'assets/poster-globe.webp',
      disponible: true, archivee: false,
      chatons: [
        { id: 21, idPortee: 2, profilId: 1, name: 'Bérénice', porteeName: 'Portée des jardins', sex: 'Femelle', status: 'disponible', robe: 'Black Silver Shaded (BRI ns 11)', breed: 'British Longhair', dateOfBirth: '2026-05-16', urlProfil: 'assets/photo-chaton-lierre.webp', photos: ['assets/photo-chaton-lierre.webp', 'assets/photo-chaton.webp', 'assets/photo-chaton-feuilles.webp'], loof: true },
        { id: 22, idPortee: 2, profilId: 1, name: 'Balthazar', porteeName: 'Portée des jardins', sex: 'Mâle', status: 'vendu', robe: 'Black Silver Shaded (BRI ns 11)', breed: 'British Longhair', dateOfBirth: '2026-05-16', urlProfil: 'assets/photo-chaton.webp', photos: ['assets/photo-chaton.webp', 'assets/photo-chaton.webp', 'assets/photo-chaton-feuilles.webp'], loof: true },
        { id: 23, idPortee: 2, profilId: 1, name: 'Blanche', porteeName: 'Portée des jardins', sex: 'Femelle', status: 'vendu', robe: 'Golden Shaded (BRI ny 11)', breed: 'British Longhair', dateOfBirth: '2026-05-16', urlProfil: 'assets/photo-chaton-feuilles.webp', photos: ['assets/photo-chaton-feuilles.webp', 'assets/photo-chaton.webp', 'assets/photo-chaton-feuilles.webp'], loof: true }
      ]
    }
  ],

  posts: [
    {
      id: 1, slug: 'choisir-son-chaton-british',
      title: 'Bien choisir son chaton British',
      excerpt: "Couleur, caractère, mâle ou femelle : les questions à se poser avant de réserver, et celles qui comptent vraiment.",
      category: 'Conseils', coverImage: 'assets/photo-chaton.webp', date: '2026-06-12', readingTime: 6,
      content: [
        { type: 'p', text: "On choisit souvent un chaton pour sa couleur. C'est bien naturel, mais après quinze ans de vie commune, c'est son caractère dont on se souvient." },
        { type: 'h2', text: 'Le caractère avant la robe' },
        { type: 'p', text: "Dans une même portée, les tempéraments diffèrent déjà à six semaines. Nous observons chaque chaton au quotidien et nous vous orientons vers celui qui correspond à votre foyer." }
      ]
    },
    {
      id: 2, slug: 'arrivee-du-chaton-a-la-maison',
      title: "Les premiers jours à la maison",
      excerpt: "Préparer la pièce d'accueil, gérer la rencontre avec les autres animaux, installer une routine rassurante.",
      category: 'Guide', coverImage: 'assets/photo-chaton-lierre.webp', date: '2026-04-03', readingTime: 8,
      content: [
        { type: 'p', text: "Un chaton qui arrive chez vous quitte sa mère, sa fratrie et tous ses repères le même jour." },
        { type: 'h2', text: 'Une seule pièce, les premiers jours' },
        { type: 'p', text: "Installez litière, gamelles, griffoir et couchage dans une pièce calme. Laissez-le en sortir de lui-même." }
      ]
    },
    {
      id: 3, slug: 'entretien-du-poil-british-longhair',
      title: "Entretenir le poil d'un British Longhair",
      excerpt: "Un brossage par semaine suffit la plupart du temps. Voici comment faire, et quand il faut être plus assidu.",
      category: 'Entretien', coverImage: 'assets/photo-femelle.webp', date: '2026-02-20', readingTime: 5,
      content: [
        { type: 'p', text: "Le British Longhair a un sous-poil dense qui feutre vite derrière les oreilles et aux aisselles." }
      ]
    }
  ],

  livreOr: [
    { id: 1, profilId: 1, name: 'Camille et Julien', message: "Arthur est arrivé chez nous il y a six mois. Un chat calme, joueur, propre dès le premier jour. On a senti tout le travail fait en amont.", validation: true, dateofCrea: '2026-03-08' },
    { id: 2, profilId: 1, name: 'Famille Lefèvre', message: "Un suivi irréprochable, des nouvelles toutes les semaines avec des photos, et un accueil chaleureux le jour de la visite.", validation: true, dateofCrea: '2026-01-22' },
    { id: 3, profilId: 1, name: 'Sophie M.', message: "Notre Bérénice s'entend parfaitement avec nos deux enfants. Merci pour vos conseils, toujours disponibles même après l'adoption.", validation: true, dateofCrea: '2025-11-14' }
  ]
};
