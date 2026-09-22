/* ==========================================================================
   Données de démonstration
   --------------------------------------------------------------------------
   Utilisées uniquement quand l'API n'est pas joignable (aperçu hors ligne)
   ou avec ?demo=1 dans l'adresse.

   C'est un miroir de l'API réelle, relevé le 2026-09-22 : mêmes chats, mêmes
   couples, mêmes portées, mêmes statuts, mêmes textes et mêmes articles que
   le site officiel. Seules les adresses d'images changent : au lieu des
   fichiers du stockage Azure, elles pointent vers les photos optimisées de
   assets/chats, assets/chatons et assets/parents, qui ne servent qu'à
   l'aperçu. En production, tout vient de l'API.
   Les valeurs « mere.jpg » et « pere.jpg » sont les images par défaut du
   site actuel : elles sont gardées telles quelles, comme dans l'API, et
   js/api.js les traite comme une photo absente.
   Le livre d'or est vide : l'API ne contient aucun témoignage validé.
   Exception : le profil reprend les coordonnées publiques du site
   (téléphone confirmé, adresse de la chatterie, bon compte Instagram).
   Celles de l'API sont anciennes et sont à corriger dans l'administration.
   ========================================================================== */
window.BK_DEMO = {
  profil: {
    id: 4, profilId: 1, firstName: 'Amiel', lastName: 'Zeitoun',
    phoneNumber: '0661654998', email: 'chatterie.british.kingdom@gmail.com',
    userType: 'professionnel', siren: '844064436',
    facebook: 'https://www.facebook.com/people/Chatterie-British-kingdom/61558762891533/',
    instagram: 'https://www.instagram.com/chatterie_britishkingdom/',
    tiktok: 'https://www.tiktok.com/@elevage_british_kingdom',
    youtube: 'https://www.youtube.com/@chatterie_british_kingdom',
    twitter: ''
  },

  banner: {
    "profilId": 1,
    "title": "Chatterie British Kingdom",
    "subtitle": "Elevage familial de British Shorthair & British Longhair",
    "bannerImages": [],
    "maleImg": "assets/photos/carte-males.webp",
    "kittenImg": "assets/photos/carte-chatons.webp",
    "femaleImg": "assets/photos/carte-femelles.webp",
    "titleCard1": "Nos mâles",
    "titleCard2": "Nos chatons",
    "titleCard3": "Nos femelles",
    "maleDescription": "Le British Shorthair est un compagnon tout en rondeur, paisible et affectueux. Leur pelage est somptueux et leur personnalité formidable en fait des partenaires idéaux pour une vie de famille.",
    "kittenDescription": "Le British Shorthair, dès son plus jeune âge, incarne une douceur et une affection enveloppantes. Son équilibre et sa tranquillité en font un compagnon parfait pour tous les membres de la famille.",
    "femaleDescription": "Avec son tempérament équilibré et paisible, le British Shorthair est le compagnon parfait. Ce doux géant est sociable, équilibré, tout en étant curieux et intelligent.",
    "textPageAccueil": "Région Seine et Marne à Othis",
    "titlePageMales": "À propos de nos mâles reproducteurs",
    "textPageMales": "Nos mâles reproducteurs bénéficient chacun d'un espace dédié de 15 à 23 m2, avec une sortie extérieure sécurisée. Étant donné leur propension au marquage territorial, ils ne peuvent pas entrer dans la maison. Après plusieurs années de reproduction, les mâles sont stérilisés et nous veillons à les placer dans de nouvelles familles pour qu'ils puissent profiter d'une vie tranquille et heureuse, méritée après leur service. Dans cette optique, nous demandons aux futurs propriétaires de nos chatons mâles de s'engager à les faire stériliser dès l'âge de 6 à 7 mois afin d'éviter les comportements de marquage. Les mâles British, avec leur stature imposante et leur flegme naturel, inspirent le respect. Ils sont solides, imperturbables et s'entendent très bien avec leurs congénères, les chiens et les humains. Un mâle British adulte pèse généralement entre 5 et 7 kg.",
    "titlePageFemelles": "À propos de nos femelles reproductrices",
    "textPageFemelles": "Découvrez nos femelles, qu'elles soient importées ou nées chez nous, en cliquant sur leur image pour accéder à leurs détails : origines, caractéristiques et pedigree. Le British Shorthair est réputé pour sa gentillesse et sa douceur, s'adaptant aussi bien à la vie en appartement qu'en maison. Toutefois, il convient de sécuriser les sorties extérieures, car ce chat au tempérament bienveillant est peu apte à se protéger des dangers extérieurs, qu'ils soient humains ou animaux. Une femelle British adulte pèse généralement entre 3 et 5 kg et son entretien est généralement facile. Pour en savoir plus sur les soins à lui apporter, consultez notre rubrique dédiée à l'entretien."
  },

  cats: [
    {
      "id": 89,
      "profilId": 1,
      "name": "Luna",
      "robe": "Lilas",
      "eyeColor": "Vert",
      "dateOfBirth": "2017-10-12",
      "breed": "British Shorthair",
      "sex": "Femelle",
      "urlProfil": "assets/chats/luna-01.webp",
      "urlProfilMother": "mere.jpg",
      "urlProfilFather": "pere.jpg",
      "sailliesExterieures": "oui",
      "pedigree": "",
      "archivee": true,
      "images": [
        "assets/chats/luna-02.webp",
        "assets/chats/luna-03.webp",
        "assets/chats/luna-04.webp"
      ]
    },
    {
      "id": 90,
      "profilId": 1,
      "name": "Prosper Mysterious",
      "robe": "seal chinchilla point",
      "eyeColor": "Bleu",
      "dateOfBirth": "2019-11-17",
      "breed": "British Shorthair",
      "sex": "Mâle",
      "urlProfil": "assets/chats/prosper-01.webp",
      "urlProfilMother": "assets/parents/prosper-mere.webp",
      "urlProfilFather": "assets/parents/prosper-pere.webp",
      "sailliesExterieures": "non",
      "pedigree": "",
      "archivee": true,
      "images": [
        "assets/chats/prosper-02.webp",
        "assets/chats/prosper-03.webp",
        "assets/chats/prosper-04.webp"
      ]
    },
    {
      "id": 102,
      "profilId": 1,
      "name": "Fripouille",
      "robe": "Black silver shaded",
      "eyeColor": "Vert",
      "dateOfBirth": "2022-07-24",
      "breed": "British Longhair",
      "sex": "Mâle",
      "urlProfil": "assets/chats/fripouille-01.webp",
      "urlProfilMother": "assets/parents/fripouille-mere.webp",
      "urlProfilFather": "assets/parents/fripouille-pere.webp",
      "sailliesExterieures": "oui",
      "pedigree": "",
      "archivee": true,
      "images": [
        "assets/chats/fripouille-02.webp",
        "assets/chats/fripouille-03.webp",
        "assets/chats/fripouille-04.webp",
        "assets/chats/fripouille-05.webp"
      ]
    },
    {
      "id": 104,
      "profilId": 1,
      "name": "Eden",
      "robe": " black silver shaded",
      "eyeColor": "Vert",
      "dateOfBirth": "2020-05-02",
      "breed": "British Shorthair",
      "sex": "Femelle",
      "urlProfil": "assets/chats/eden-01.webp",
      "urlProfilMother": "mere.jpg",
      "urlProfilFather": "pere.jpg",
      "sailliesExterieures": "oui",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/eden-02.webp",
        "assets/chats/eden-03.webp",
        "assets/chats/eden-04.webp",
        "assets/chats/eden-05.webp"
      ]
    },
    {
      "id": 105,
      "profilId": 1,
      "name": "Tina",
      "robe": " black silver shaded",
      "eyeColor": "Vert",
      "dateOfBirth": "2022-07-24",
      "breed": "British Shorthair",
      "sex": "Femelle",
      "urlProfil": "assets/chats/tina-01.webp",
      "urlProfilMother": "assets/parents/tina-mere.webp",
      "urlProfilFather": "assets/parents/tina-pere.webp",
      "sailliesExterieures": "oui",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/tina-02.webp",
        "assets/chats/tina-03.webp",
        "assets/chats/tina-04.webp",
        "assets/chats/tina-05.webp"
      ]
    },
    {
      "id": 112,
      "profilId": 1,
      "name": "Spooky",
      "robe": " black silver shaded",
      "eyeColor": "Vert",
      "dateOfBirth": "2023-04-29",
      "breed": "British Shorthair",
      "sex": "Femelle",
      "urlProfil": "assets/chats/spooky-01.webp",
      "urlProfilMother": "assets/parents/spooky-mere.webp",
      "urlProfilFather": "assets/parents/spooky-pere.webp",
      "sailliesExterieures": "non",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/spooky-02.webp",
        "assets/chats/spooky-03.webp",
        "assets/chats/spooky-04.webp",
        "assets/chats/spooky-05.webp",
        "assets/chats/spooky-06.webp"
      ]
    },
    {
      "id": 116,
      "profilId": 1,
      "name": "Wilson",
      "robe": "Bleu",
      "eyeColor": "Orange",
      "dateOfBirth": "2024-07-03",
      "breed": "British Shorthair",
      "sex": "Mâle",
      "urlProfil": "assets/chats/wilson-01.webp",
      "urlProfilMother": "mere.jpg",
      "urlProfilFather": "pere.jpg",
      "sailliesExterieures": "Oui",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/wilson-02.webp",
        "assets/chats/wilson-03.webp",
        "assets/chats/wilson-04.webp",
        "assets/chats/wilson-05.webp",
        "assets/chats/wilson-06.webp"
      ]
    },
    {
      "id": 117,
      "profilId": 1,
      "name": "Willy wonka",
      "robe": "Chocolat",
      "eyeColor": "Orange",
      "dateOfBirth": "2024-04-11",
      "breed": "British Shorthair",
      "sex": "Mâle",
      "urlProfil": "assets/chats/willy-wonka-01.webp",
      "urlProfilMother": "mere.jpg",
      "urlProfilFather": "pere.jpg",
      "sailliesExterieures": "oui",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/willy-wonka-02.webp",
        "assets/chats/willy-wonka-03.webp",
        "assets/chats/willy-wonka-04.webp",
        "assets/chats/willy-wonka-05.webp",
        "assets/chats/willy-wonka-06.webp"
      ]
    },
    {
      "id": 118,
      "profilId": 1,
      "name": "Zara",
      "robe": "Chocolat",
      "eyeColor": "Vairon Bleu/Marron",
      "dateOfBirth": "2024-06-16",
      "breed": "British Shorthair",
      "sex": "Femelle",
      "urlProfil": "assets/chats/zara-01.webp",
      "urlProfilMother": "mere.jpg",
      "urlProfilFather": "pere.jpg",
      "sailliesExterieures": "non",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/zara-02.webp",
        "assets/chats/zara-03.webp",
        "assets/chats/zara-04.webp",
        "assets/chats/zara-05.webp",
        "assets/chats/zara-06.webp",
        "assets/chats/zara-07.webp"
      ]
    },
    {
      "id": 120,
      "profilId": 1,
      "name": "Vesunna",
      "robe": "Black Golden Shaded",
      "eyeColor": "Vert",
      "dateOfBirth": "2024-03-25",
      "breed": "British Shorthair",
      "sex": "Femelle",
      "urlProfil": "assets/chats/vesunna-01.webp",
      "urlProfilMother": "",
      "urlProfilFather": "assets/parents/vesunna-pere.webp",
      "sailliesExterieures": "Oui",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/vesunna-02.webp",
        "assets/chats/vesunna-03.webp",
        "assets/chats/vesunna-04.webp",
        "assets/chats/vesunna-05.webp"
      ]
    },
    {
      "id": 121,
      "profilId": 1,
      "name": "Voltaire",
      "robe": "BLACK SILVER SHADED",
      "eyeColor": "Vert",
      "dateOfBirth": "2024-03-05",
      "breed": "British Longhair",
      "sex": "Mâle",
      "urlProfil": "assets/chats/voltaire-01.webp",
      "urlProfilMother": "assets/parents/voltaire-mere.webp",
      "urlProfilFather": "assets/parents/voltaire-pere.webp",
      "sailliesExterieures": "Oui",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/voltaire-02.webp",
        "assets/chats/voltaire-03.webp",
        "assets/chats/voltaire-04.webp"
      ]
    },
    {
      "id": 124,
      "profilId": 1,
      "name": "Apericube",
      "robe": "Chocolat",
      "eyeColor": "Vert",
      "dateOfBirth": "2025-05-02",
      "breed": "British Shorthair",
      "sex": "Mâle",
      "urlProfil": "assets/chats/apericube-01.webp",
      "urlProfilMother": "assets/parents/apericube-mere.webp",
      "urlProfilFather": "assets/parents/apericube-pere.webp",
      "sailliesExterieures": "Oui",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/apericube-02.webp",
        "assets/chats/apericube-03.webp",
        "assets/chats/apericube-04.webp",
        "assets/chats/apericube-05.webp",
        "assets/chats/apericube-06.webp"
      ]
    },
    {
      "id": 125,
      "profilId": 1,
      "name": "Akira",
      "robe": "Chocolat",
      "eyeColor": "Jaune",
      "dateOfBirth": "2025-05-02",
      "breed": "British Shorthair",
      "sex": "Femelle",
      "urlProfil": "assets/chats/akira-01.webp",
      "urlProfilMother": "assets/parents/akira-mere.webp",
      "urlProfilFather": "assets/parents/akira-pere.webp",
      "sailliesExterieures": "Non",
      "pedigree": "",
      "archivee": false,
      "images": [
        "assets/chats/akira-02.webp",
        "assets/chats/akira-03.webp",
        "assets/chats/akira-04.webp",
        "assets/chats/akira-05.webp"
      ]
    }
  ],

  portees: [
    {
      "id": 231,
      "profilId": 1,
      "name": "Zara & Willy Wonka",
      "idPapa": 117,
      "idMaman": 118,
      "dateOfBirth": "2026-08-13",
      "dateOfSell": "2026-11-13",
      "urlProfilMother": "assets/chats/zara-01.webp",
      "urlProfilFather": "assets/chats/willy-wonka-01.webp",
      "externalFatherName": "",
      "externalFatherPhoto": "",
      "disponible": true,
      "archivee": false,
      "chatons": [
        {
          "id": 429,
          "idPortee": 231,
          "profilId": 1,
          "name": "Braise",
          "porteeName": "Zara & Willy Wonka",
          "sex": "Femelle",
          "status": "disponible",
          "robe": "Chocolat",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-08-13",
          "urlProfil": "assets/chatons/braise-01.webp",
          "photos": [
            "assets/chatons/braise-01.webp",
            "assets/chatons/braise-02.webp",
            "assets/chatons/braise-03.webp"
          ],
          "loof": true
        },
        {
          "id": 430,
          "idPortee": 231,
          "profilId": 1,
          "name": "Bagheera",
          "porteeName": "Zara & Willy Wonka",
          "sex": "Mâle",
          "status": "disponible",
          "robe": "Chocolat",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-08-13",
          "urlProfil": "assets/chatons/bagheera-01.webp",
          "photos": [
            "assets/chatons/bagheera-01.webp",
            "assets/chatons/bagheera-02.webp",
            "assets/chatons/bagheera-03.webp"
          ],
          "loof": true
        },
        {
          "id": 431,
          "idPortee": 231,
          "profilId": 1,
          "name": "Bergamote",
          "porteeName": "Zara & Willy Wonka",
          "sex": "Femelle",
          "status": "disponible",
          "robe": "Cinnamon",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-08-13",
          "urlProfil": "assets/chatons/bergamote-01.webp",
          "photos": [
            "assets/chatons/bergamote-01.webp",
            "assets/chatons/bergamote-02.webp",
            "assets/chatons/bergamote-03.webp"
          ],
          "loof": true
        }
      ]
    },
    {
      "id": 232,
      "profilId": 1,
      "name": "Akira & Willy Wonka",
      "idPapa": 117,
      "idMaman": 125,
      "dateOfBirth": "2026-08-15",
      "dateOfSell": "2026-11-15",
      "urlProfilMother": "assets/chats/akira-01.webp",
      "urlProfilFather": "assets/chats/willy-wonka-01.webp",
      "externalFatherName": "",
      "externalFatherPhoto": "",
      "disponible": true,
      "archivee": false,
      "chatons": [
        {
          "id": 432,
          "idPortee": 232,
          "profilId": 1,
          "name": "Bounty",
          "porteeName": "Akira & Willy Wonka",
          "sex": "Mâle",
          "status": "disponible",
          "robe": "Chocolat",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-08-15",
          "urlProfil": "assets/chatons/bounty-01.webp",
          "photos": [
            "assets/chatons/bounty-01.webp",
            "assets/chatons/bounty-02.webp",
            "assets/chatons/bounty-03.webp"
          ],
          "loof": true
        },
        {
          "id": 433,
          "idPortee": 232,
          "profilId": 1,
          "name": "Bretzel",
          "porteeName": "Akira & Willy Wonka",
          "sex": "Mâle",
          "status": "disponible",
          "robe": "Chocolat",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-08-15",
          "urlProfil": "assets/chatons/bretzel-01.webp",
          "photos": [
            "assets/chatons/bretzel-01.webp",
            "assets/chatons/bretzel-02.webp",
            "assets/chatons/bretzel-03.webp"
          ],
          "loof": true
        },
        {
          "id": 434,
          "idPortee": 232,
          "profilId": 1,
          "name": "Babka",
          "porteeName": "Akira & Willy Wonka",
          "sex": "Femelle",
          "status": "disponible",
          "robe": "Chocolat",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-08-15",
          "urlProfil": "assets/chatons/babka-01.webp",
          "photos": [
            "assets/chatons/babka-01.webp",
            "assets/chatons/babka-02.webp",
            "assets/chatons/babka-03.webp"
          ],
          "loof": true
        },
        {
          "id": 435,
          "idPortee": 232,
          "profilId": 1,
          "name": "Berlingot",
          "porteeName": "Akira & Willy Wonka",
          "sex": "Femelle",
          "status": "disponible",
          "robe": "Cinnamon",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-08-15",
          "urlProfil": "assets/chatons/berlingot-01.webp",
          "photos": [
            "assets/chatons/berlingot-01.webp",
            "assets/chatons/berlingot-02.webp",
            "assets/chatons/berlingot-03.webp"
          ],
          "loof": true
        },
        {
          "id": 436,
          "idPortee": 232,
          "profilId": 1,
          "name": "Banoffee",
          "porteeName": "Akira & Willy Wonka",
          "sex": "Femelle",
          "status": "disponible",
          "robe": "Cinnamon",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-08-15",
          "urlProfil": "assets/chatons/banoffee-01.webp",
          "photos": [
            "assets/chatons/banoffee-01.webp",
            "assets/chatons/banoffee-02.webp",
            "assets/chatons/banoffee-03.webp"
          ],
          "loof": true
        }
      ]
    },
    {
      "id": 233,
      "profilId": 1,
      "name": "Tina & Voltaire",
      "idPapa": 121,
      "idMaman": 105,
      "dateOfBirth": "2026-07-31",
      "dateOfSell": "2026-10-31",
      "urlProfilMother": "assets/chats/tina-01.webp",
      "urlProfilFather": "assets/chats/voltaire-01.webp",
      "externalFatherName": "",
      "externalFatherPhoto": "",
      "disponible": true,
      "archivee": false,
      "chatons": [
        {
          "id": 437,
          "idPortee": 233,
          "profilId": 1,
          "name": "Balthazar",
          "porteeName": "Tina & Voltaire",
          "sex": "Mâle",
          "status": "reserve",
          "robe": "Blue golden",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-07-31",
          "urlProfil": "assets/chatons/balthazar-01.webp",
          "photos": [
            "assets/chatons/balthazar-01.webp",
            "assets/chatons/balthazar-02.webp",
            "assets/chatons/balthazar-03.webp",
            "assets/chatons/balthazar-04.webp"
          ],
          "loof": true
        },
        {
          "id": 438,
          "idPortee": 233,
          "profilId": 1,
          "name": "Bulle",
          "porteeName": "Tina & Voltaire",
          "sex": "Femelle",
          "status": "disponible",
          "robe": "Black silver shaded",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-07-31",
          "urlProfil": "assets/chatons/bulle-01.webp",
          "photos": [
            "assets/chatons/bulle-01.webp",
            "assets/chatons/bulle-02.webp",
            "assets/chatons/bulle-03.webp",
            "assets/chatons/bulle-04.webp"
          ],
          "loof": true
        },
        {
          "id": 439,
          "idPortee": 233,
          "profilId": 1,
          "name": "Byron",
          "porteeName": "Tina & Voltaire",
          "sex": "Mâle",
          "status": "disponible",
          "robe": "Black silver shaded (à confirmer)",
          "breed": "British Shorthair",
          "dateOfBirth": "2026-07-31",
          "urlProfil": "assets/chatons/byron-01.webp",
          "photos": [
            "assets/chatons/byron-01.webp",
            "assets/chatons/byron-02.webp",
            "assets/chatons/byron-03.webp",
            "assets/chatons/byron-04.webp"
          ],
          "loof": true
        }
      ]
    }
  ],

  posts: [
    {
      "id": 3,
      "profilId": 1,
      "slug": "bien-nourrir-son-chat",
      "title": "Guide complet sur l’alimentation du chat",
      "excerpt": "Pâtée, croquettes, protéines, phosphore, BARF, légumes… Il est parfois difficile de savoir ce qui est réellement adapté au chat.  Dans ce nouvel article, nous faisons le point sur ses besoins de carnivore strict, les limites des croquettes, l’intérêt de l’alimentation humide et les précautions à prendre avec le cru.  Un guide complet pour mieux comprendre les étiquettes et faire des choix plus éclairés pour la santé de son chat.",
      "category": "Santé",
      "coverImage": "assets/photos/blog-alimentation.webp",
      "date": "2026-07-18",
      "readingTime": 15,
      "content": [
        {
          "type": "p",
          "text": "Contrairement au chien, domestiqué et sélectionné par l’être humain depuis des millénaires, le chat s’est rapproché plus spontanément des premières communautés humaines, attiré par les rongeurs présents autour des réserves de nourriture."
        },
        {
          "type": "quote",
          "text": "Cette domestication plus récente et moins poussée explique qu’il ait conservé de nombreuses particularités physiologiques liées à son statut de carnivore strict."
        },
        {
          "type": "p",
          "text": "Le chat dépend notamment de plusieurs nutriments qu’il ne peut pas fabriquer lui-même en quantité suffisante, comme la taurine, l’acide arachidonique ou la vitamine A sous sa forme active. Son alimentation doit donc être formulée avec davantage de précision que celle de nombreuses autres espèces."
        },
        {
          "type": "p",
          "text": "Le British Shorthair possède par ailleurs une morphologie naturellement robuste et peut facilement prendre du poids lorsque ses apports dépassent ses besoins. Une alimentation complète et adaptée, des portions contrôlées ainsi qu’une surveillance régulière de sa silhouette sont donc essentielles pour préserver sa santé sur le long terme."
        },
        {
          "type": "h2",
          "text": "Privilégier une alimentation humide de qualité"
        },
        {
          "type": "p",
          "text": "Il est recommandé d’accorder une place importante à une pâtée complète de bonne qualité, riche en protéines d’origine animale et adaptée à l’âge, au poids et au niveau d’activité du chat."
        },
        {
          "type": "p",
          "text": "Vérifiez toujours la présence de la mention « aliment complet ». Contrairement à un aliment complémentaire, une pâtée complète est formulée pour apporter l’ensemble des nutriments essentiels lorsqu’elle est donnée dans les quantités recommandées."
        },
        {
          "type": "p",
          "text": "La pâtée contient généralement entre 70 et 80 % d’eau, contre environ 8 à 10 % pour les croquettes. Elle contribue donc directement à l’hydratation du chat et permet généralement d’augmenter davantage son apport total en eau qu’une alimentation exclusivement sèche."
        },
        {
          "type": "p",
          "text": "Le chat est un animal dont les ancêtres vivaient dans des milieux arides. Il a évolué en obtenant une grande partie de son eau à travers ses proies et possède une sensation de soif peu développée."
        },
        {
          "type": "quote",
          "text": "Même si un chat nourri aux croquettes est régulièrement vu en train de boire, il ne compense pas entièrement la faible teneur en eau de son alimentation."
        },
        {
          "type": "p",
          "text": "La pâtée est également moins dense en calories que les croquettes à poids égal, puisqu’une grande partie de son volume est constituée d’eau. Elle peut ainsi aider à rassasier le chat tout en facilitant le contrôle de ses apports énergétiques."
        },
        {
          "type": "h2",
          "text": "Les limites des croquettes"
        },
        {
          "type": "p",
          "text": "Les croquettes peuvent constituer un aliment complet, mais leur fabrication impose certaines contraintes techniques. Pour pouvoir être extrudées, conserver leur forme et présenter une texture stable, elles nécessitent une certaine proportion d’amidon."
        },
        {
          "type": "p",
          "text": "La cuisson à haute température peut également modifier certains nutriments sensibles. Les fabricants compensent normalement ces pertes en ajustant la formulation ou en ajoutant certains nutriments après la cuisson. Cela ne signifie donc pas que toutes les croquettes sont mauvaises ou carencées, mais leur qualité varie considérablement selon les matières premières et la formulation employées."
        },
        {
          "type": "p",
          "text": "Les aliments secs sont aussi très concentrés en énergie."
        },
        {
          "type": "quote",
          "text": "Quelques grammes supplémentaires chaque jour peuvent favoriser progressivement une prise de poids."
        },
        {
          "type": "h2",
          "text": "Les types de protéines"
        },
        {
          "type": "p",
          "text": "Un taux élevé de « protéines brutes » ne garantit pas qu’un aliment contienne beaucoup de viande. Une partie peut provenir du pois, du soja, du maïs ou d’autres végétaux. Ces protéines peuvent augmenter le chiffre affiché sur l’étiquette, mais elles n’apportent pas naturellement le même profil d’acides aminés que les tissus animaux, notamment la taurine, essentielle au chat, carnivore strict. Elles peuvent participer à une recette correctement formulée et complémentée, mais le pourcentage total de protéines ne permet donc pas à lui seul d’en juger la qualité ou l’origine."
        },
        {
          "type": "h2",
          "text": "La proportion réelle de viande"
        },
        {
          "type": "p",
          "text": "Il faut également interpréter avec prudence les pourcentages de « viande fraîche » indiqués sur les croquettes. La viande fraîche contient beaucoup d’eau et son pourcentage est très souvent annoncé avant la cuisson, tandis que les autres ingrédients sont incorporés sous une forme déjà déshydratée. Après l’extrusion et le séchage, la viande perd une grande partie de son poids. Sa proportion réelle dans la croquette finie est donc nettement plus faible que le chiffre initial peut le laisser penser."
        },
        {
          "type": "p",
          "text": "À titre d’exemple, 40 % de poulet frais indiqués sur l’emballage d’un paquet de croquettes ne correspondent qu’à environ 12 % de matière sèche issue du poulet après déshydratation."
        },
        {
          "type": "quote",
          "text": "Une viande déshydratée placée plus bas dans la liste peut ainsi apporter davantage de matière animale réelle qu’un fort pourcentage de viande fraîche."
        },
        {
          "type": "h2",
          "text": "Le phosphore : un élément à surveiller"
        },
        {
          "type": "p",
          "text": "Le phosphore est un minéral indispensable au fonctionnement de l’organisme, mais une quantité excessive peut être problématique, particulièrement lorsque le rapport entre le calcium et le phosphore est déséquilibré."
        },
        {
          "type": "p",
          "text": "Les ingrédients d’origine animale apportent naturellement du phosphore. Les matières contenant une proportion importante d’os comme la VSM peuvent notamment en augmenter fortement la teneur. Certains aliments contiennent également des phosphates inorganiques ajoutés. Ces formes sont généralement très assimilables et peuvent augmenter rapidement l’apport réellement absorbé par le chat."
        },
        {
          "type": "p",
          "text": "À l’inverse, les recettes utilisant davantage de pois, de soja ou d’autres sources végétales peuvent contenir moins de phosphore d’origine animale. Mais cela ne suffit toutefois pas à déterminer leur qualité nutritionnelle."
        },
        {
          "type": "quote",
          "text": "Une faible teneur en phosphore ne compense pas nécessairement une proportion insuffisante de protéines animales."
        },
        {
          "type": "p",
          "text": "Il faut donc considérer à la fois la quantité totale de phosphore, son origine, sa biodisponibilité et le rapport calcium/phosphore."
        },
        {
          "type": "p",
          "text": "Malheureusement, la teneur exacte en phosphore n’est pas toujours indiquée sur les emballages."
        },
        {
          "type": "h2",
          "text": "Viande fraîche la VSM"
        },
        {
          "type": "p",
          "text": "Les termes utilisés sur les emballages peuvent donner l’impression que les croquettes contiennent des morceaux de viande comparables à ceux utilisés dans l’alimentation humaine. En réalité, les matières animales employées sont très différentes."
        },
        {
          "type": "p",
          "text": "La viande séparée mécaniquement (VSM) est obtenue en récupérant, à l’aide de procédés mécaniques, les tissus restant attachés aux os après le désossage ou sur les carcasses de volailles. Elle ne possède donc ni la même structure, ni exactement la même composition qu’un morceau de viande musculaire entier."
        },
        {
          "type": "p",
          "text": "Les aliments pour chats peuvent également contenir des abats, des protéines animales déshydratées ou d’autres matières animales transformées. Ces ingrédients ne sont pas dépourvus d’intérêt nutritionnel, mais leur qualité, leur digestibilité et leur teneur en minéraux peuvent varier considérablement."
        },
        {
          "type": "quote",
          "text": "Après le broyage, la cuisson, l’extrusion et le séchage, la viande ne se retrouve de toute façon plus dans la croquette sous la forme d’un véritable morceau de muscle."
        },
        {
          "type": "p",
          "text": "Les mentions générales telles que « viandes et sous-produits animaux » ne permettent pas toujours de connaître précisément la nature, la proportion et la qualité des tissus utilisés."
        },
        {
          "type": "quote",
          "text": "Une liste d’ingrédients détaillée, indiquant clairement les espèces animales et la nature des matières premières, offre davantage de transparence qu’une simple mention générale de « viande »."
        },
        {
          "type": "h2",
          "text": "Les oméga-3"
        },
        {
          "type": "p",
          "text": "Les matières grasses apportent des acides gras indispensables au fonctionnement de l’organisme. Les recommandations nutritionnelles de la FEDIAF prévoient notamment des apports minimaux en acide linoléique et en acide arachidonique, deux oméga-6 essentiels au chat."
        },
        {
          "type": "p",
          "text": "En revanche, aucun apport minimal en EPA et en DHA, deux oméga-3 principalement présents dans les poissons gras, n’est actuellement fixé pour l’entretien du chat adulte. Ces acides gras sont toutefois recommandés pendant la croissance et la reproduction."
        },
        {
          "type": "quote",
          "text": "Une alimentation industrielle complète pour chat peut donc respecter les recommandations sans contenir une quantité importante d’EPA et de DHA."
        },
        {
          "type": "p",
          "text": "L’huile de poisson constitue une source concentrée d’EPA et de DHA, mais elle apporte rapidement beaucoup de calories. Une quantité ajoutée au hasard peut augmenter les apports énergétiques, modifier l’équilibre entre les différents acides gras et déséquilibrer la ration."
        },
        {
          "type": "p",
          "text": "Il est également possible de proposer occasionnellement une petite quantité de poisson gras, comme de la sardine, du sprat ou du saumon, de préférence nature et sans sel ajouté. Le poisson reste cependant un aliment complémentaire, sa quantité doit être prise en compte dans les calories quotidiennes et rester limitée afin de ne pas déséquilibrer l’alimentation principale."
        },
        {
          "type": "h2",
          "text": "Carnivore strict ne signifie pas exclusivement carnivore"
        },
        {
          "type": "p",
          "text": "Le chat est un carnivore strict. Cela signifie que son organisme dépend de certains nutriments naturellement présents dans les tissus animaux, comme la taurine, l’acide arachidonique ou la vitamine A sous sa forme active."
        },
        {
          "type": "p",
          "text": "Cette particularité ne signifie toutefois pas qu’il soit incapable de digérer ou de consommer des ingrédients d’origine végétale. Lorsqu’ils sont correctement cuits et intégrés à une recette équilibrée, les chats peuvent notamment digérer une partie des glucides et utiliser certains nutriments provenant des végétaux."
        },
        {
          "type": "quote",
          "text": "Les pois, le soja, le maïs ou le riz ne sont donc pas dangereux par nature. Leur présence ne suffit pas à elle seule à déterminer si une alimentation est bonne ou mauvaise."
        },
        {
          "type": "p",
          "text": "Une recette contenant des protéines végétales peut être correctement équilibrée lorsqu’elle apporte suffisamment de protéines animales et qu’elle est complémentée avec tous les acides aminés, vitamines, minéraux et acides gras indispensables au chat. À l’inverse, une liste d’ingrédients donnant une place importante à la viande ne garantit pas automatiquement que les proportions de tous les nutriments soient adaptées, notamment le phosphore."
        },
        {
          "type": "p",
          "text": "Certaines croquettes peuvent ainsi contenir une proportion notable de pois, de céréales ou d’autres végétaux tout en constituant une alimentation complète. C’est notamment le cas de plusieurs aliments formulés par des marques comme Royal Canin."
        },
        {
          "type": "h2",
          "text": "Les fibres et les légumes"
        },
        {
          "type": "p",
          "text": "Dans la nature, un chat qui consomme une proie entière n’ingère pas uniquement de la viande musculaire. Il avale également des matières peu digestibles, comme les poils, les plumes, la peau, les tendons ou le cartilage. Ces éléments peuvent jouer un rôle comparable à celui des fibres en participant au volume et à la consistance des selles ainsi qu’au fonctionnement du transit intestinal."
        },
        {
          "type": "p",
          "text": "Dans les aliments industriels, différentes fibres végétales sont donc utilisées pour remplir certaines fonctions similaires. Elles ne reproduisent pas exactement la composition d’une proie entière, mais elles peuvent contribuer à la qualité des selles, à la satiété, à l’élimination des poils ingérés et au maintien du microbiote intestinal."
        },
        {
          "type": "p",
          "text": "Une quantité excessive peut, à l’inverse, provoquer des selles plus volumineuses, des gaz ou diminuer la digestibilité de certains nutriments."
        },
        {
          "type": "p",
          "text": "Il est également possible de proposer occasionnellement de petites quantités de légumes adaptés au chat, par exemple de la courgette cuite et réduite en purée. Leur forte teneur en eau peut contribuer à l’hydratation et leur faible densité calorique peut être intéressante pour certains chats ayant tendance à prendre du poids."
        },
        {
          "type": "p",
          "text": "Ces légumes restent néanmoins des aliments complémentaires. Ils doivent être donnés en petites quantités afin de ne pas déséquilibrer la ration principale."
        },
        {
          "type": "h2",
          "text": "Peser les croquettes"
        },
        {
          "type": "p",
          "text": "Il est préférable de peser précisément les croquettes plutôt que de remplir la gamelle à volonté. Un chat castré vivant en intérieur peut avoir des besoins énergétiques relativement faibles, tout en conservant un appétit important."
        },
        {
          "type": "p",
          "text": "Lorsqu’il manque d’activité ou de stimulation, il peut également retourner régulièrement à sa gamelle par ennui. Les conditions de vie d’un chat domestique sont très différentes de celles d’un chat qui doit chercher, poursuivre et capturer plusieurs petites proies au cours de la journée."
        },
        {
          "type": "p",
          "text": "Pour limiter le grignotage, il est possible de répartir la ration en 3 à 5 petits repas ou d’utiliser des gamelles ludiques et des jouets distributeurs."
        },
        {
          "type": "p",
          "text": "Peser les aliments permet aussi de connaître précisément la quantité réellement consommée. Une baisse inhabituelle de l’appétit peut alors être repérée plus rapidement et révéler un problème de santé."
        },
        {
          "type": "p",
          "text": "Les indications inscrites sur les emballages constituent seulement un point de départ. La ration doit ensuite être ajustée selon le poids, l’âge, la stérilisation, l’activité physique et l’évolution de la silhouette du chat."
        },
        {
          "type": "quote",
          "text": "À son poids idéal, les côtes du chat doivent pouvoir être senties facilement sous une fine couche de graisse, sans être fortement visibles."
        },
        {
          "type": "h2",
          "text": "L’eau reste indispensable"
        },
        {
          "type": "p",
          "text": "Même lorsqu’il reçoit beaucoup de pâtée, le chat doit toujours disposer d’eau propre et fraîche. Il est préférable de proposer plusieurs points d’eau dans des endroits calmes, suffisamment éloignés de la litière et de la nourriture. Certains chats apprécient les récipients larges qui évitent que leurs moustaches touchent les bords."
        },
        {
          "type": "quote",
          "text": "Une fontaine peut encourager les chats attirés par l’eau en mouvement, mais elle ne remplace pas l’apport hydrique fourni par une alimentation humide."
        },
        {
          "type": "h2",
          "text": "Le BARF et l’alimentation crue"
        },
        {
          "type": "p",
          "text": "Le BARF est une alimentation composée de produits animaux crus, tels que de la viande musculaire, des abats et des os charnus. Elle doit également contenir les compléments nécessaires pour couvrir tous les besoins nutritionnels du chat."
        },
        {
          "type": "p",
          "text": "Lorsqu’elle est parfaitement formulée, une ration crue peut être adaptée aux besoins individuels du chat et présenter une excellente digestibilité. Certaines personnes constatent également de petites selles, une belle qualité de pelage ou des dents moins chargées en dépôts."
        },
        {
          "type": "quote",
          "text": "Le simple fait qu’un aliment soit composé de viande ne suffit pas à le rendre complet."
        },
        {
          "type": "h2",
          "text": "Une recette obligatoirement équilibrée"
        },
        {
          "type": "quote",
          "text": "Une ration BARF ne doit pas être préparée à partir de proportions trouvées au hasard sur Internet."
        },
        {
          "type": "p",
          "text": "Elle doit être formulée spécifiquement pour le chat par un vétérinaire spécialisé en nutrition ou par un professionnel réellement qualifié en nutrition féline."
        },
        {
          "type": "p",
          "text": "Une ration uniquement composée de viande musculaire est gravement déséquilibrée. Elle est notamment riche en phosphore et très pauvre en calcium."
        },
        {
          "type": "p",
          "text": "À l’inverse, une quantité excessive d’os, de calcium, de foie ou de certains compléments peut entraîner des excès tout aussi dangereux que les carences. Le foie, par exemple, est extrêmement riche en vitamine A et ne doit pas être ajouté au hasard ou donné en grande quantité."
        },
        {
          "type": "p",
          "text": "Les besoins varient également selon l’âge, le poids, la stérilisation, l’activité, les maladies éventuelles et l’état corporel du chat. La recette d’un chat adulte en bonne santé ne doit donc pas être utilisée pour un chaton, une femelle gestante ou un chat souffrant d’une maladie rénale, digestive ou urinaire."
        },
        {
          "type": "h2",
          "text": "Une hygiène irréprochable"
        },
        {
          "type": "p",
          "text": "La viande crue peut contenir des bactéries, des parasites ou d’autres agents pathogènes. La congélation peut réduire certains risques parasitaires, mais elle ne détruit pas les bactéries ni les virus."
        },
        {
          "type": "p",
          "text": "Une prudence renforcée est nécessaire dans les foyers comportant de jeunes enfants, des personnes âgées, des femmes enceintes ou des personnes immunodéprimées."
        },
        {
          "type": "quote",
          "text": "Un chat peut parfois transporter certaines bactéries sans présenter lui-même de symptômes."
        },
        {
          "type": "h2",
          "text": "Peut-on simplement ajouter de la viande ?"
        },
        {
          "type": "p",
          "text": "Lorsqu’une alimentation BARF complète n’est pas possible, il est possible de proposer quelques morceaux de viande fraîche, comme du bœuf ou du poulet, en complément d’une alimentation complète."
        },
        {
          "type": "p",
          "text": "La viande seule n’est toutefois pas un repas équilibré."
        },
        {
          "type": "quote",
          "text": "Pour ne pas déséquilibrer la ration principale, l’ensemble des aliments complémentaires ne doit pas représenter plus de 10 % des calories quotidiennes."
        },
        {
          "type": "p",
          "text": "Les os cuits ne doivent jamais être proposés, car ils peuvent se fragmenter et provoquer des blessures ou une obstruction digestive."
        },
        {
          "type": "p",
          "text": "Les abats ne doivent pas être utilisés comme de simples friandises régulières. Le foie contient notamment beaucoup de vitamine A, tandis que d’autres organes peuvent modifier fortement les apports en cuivre, en phosphore ou en autres micronutriments."
        },
        {
          "type": "h2",
          "text": "Pour conclure"
        },
        {
          "type": "quote",
          "text": "Il n’existe pas une seule alimentation parfaite pour tous les chats."
        },
        {
          "type": "p",
          "text": "Une pâtée complète de qualité constitue une excellente base grâce à son importante teneur en eau et à sa densité calorique généralement modérée. Les croquettes peuvent compléter la ration, mais elles doivent être pesées et sélectionnées avec attention."
        },
        {
          "type": "p",
          "text": "Une ration BARF peut également être envisagée, mais seulement si elle est formulée avec précision, correctement complémentée et préparée dans des conditions d’hygiène irréprochables. Une alimentation crue improvisée peut entraîner de graves carences, des excès nutritionnels ou des contaminations."
        }
      ]
    },
    {
      "id": 1,
      "profilId": 1,
      "slug": "bien-preparer-arrivee-chaton",
      "title": "Préparer l’arrivée d’un chaton",
      "excerpt": "L’arrivée d’un chaton est un moment rempli de bonheur, mais aussi un grand bouleversement pour lui. Sécurisation de la maison, alimentation, première nuit, adaptation et rencontre avec les autres animaux : découvrez tous nos conseils pour préparer son arrivée et l’aider à se sentir rapidement chez lui.",
      "category": "Adoption",
      "coverImage": "assets/photos/blog-arrivee.webp",
      "date": "2026-03-19",
      "readingTime": 10,
      "content": [
        {
          "type": "p",
          "text": "Accueillir un chaton dans votre maison est un moment aussi réjouissant qu’important. Pour lui, cette arrivée représente un grand changement : il quitte sa mère, sa fratrie, les personnes qu’il connaît et l’environnement dans lequel il a grandi."
        },
        {
          "type": "p",
          "text": "Quelques préparatifs permettent de limiter son stress et de l’aider à prendre progressivement ses repères."
        },
        {
          "type": "h2",
          "text": "Préparer un espace calme et sécurisé"
        },
        {
          "type": "p",
          "text": "Avant son arrivée, choisissez une pièce calme dans laquelle votre chaton pourra passer ses premières heures ou ses premiers jours. Il n’est pas nécessaire de lui donner immédiatement accès à toute la maison. Un espace plus restreint lui permettra de repérer facilement sa litière, sa nourriture, son eau et ses endroits de repos."
        },
        {
          "type": "p",
          "text": "Placez dans cette pièce une litière facilement accessible ; des gamelles d’eau et de nourriture éloignées de la litière ; un couchage confortable ; des cachettes ; un griffoir ; quelques jouets adaptés."
        },
        {
          "type": "quote",
          "text": "Une caisse de transport laissée ouverte, un carton ou un petit panier couvert peuvent également lui servir de refuge."
        },
        {
          "type": "h2",
          "text": "Sécuriser la maison"
        },
        {
          "type": "p",
          "text": "Un chaton explore son environnement avec beaucoup de curiosité. Il peut grimper, mordiller, se faufiler dans des espaces étroits ou tenter d’avaler de petits objets."
        },
        {
          "type": "p",
          "text": "Avant son arrivée, pensez à sécuriser les fils et chargeurs électriques ; les médicaments et produits ménagers ; les ficelles, élastiques et petits objets ; les plaques de cuisson ; les fenêtres et accès vers l’extérieur ; les plantes toxiques pour les chats."
        },
        {
          "type": "quote",
          "text": "Une fenêtre entrouverte en oscillo-battant peut représenter un danger important. Elle ne doit jamais être laissée accessible."
        },
        {
          "type": "h2",
          "text": "Prévoir le matériel nécessaire"
        },
        {
          "type": "p",
          "text": "Il est préférable de préparer tout le matériel avant l’arrivée du chaton afin de ne pas avoir à modifier constamment son environnement."
        },
        {
          "type": "p",
          "text": "Prévoyez notamment une caisse de transport bien ventilée ; au moins une litière ; des gamelles larges et peu profondes ; un griffoir vertical ou horizontal ; un couchage et plusieurs cachettes ; des jouets ; une brosse adaptée à son pelage ; un arbre à chat si possible devant une fenêtre."
        },
        {
          "type": "p",
          "text": "Dans un logement comportant plusieurs étages, il peut être utile de prévoir une litière par niveau. Dans un foyer avec plusieurs chats, il est préférable de multiplier les litières afin de limiter les tensions : une litière par chat plus une litière supplémentaire."
        },
        {
          "type": "h2",
          "text": "Le trajet jusqu’à la maison"
        },
        {
          "type": "quote",
          "text": "Le chaton doit toujours voyager dans une caisse ou un sac de transport correctement fermé. Même s’il semble calme, il ne doit pas être laissé libre dans la voiture."
        },
        {
          "type": "p",
          "text": "Vous pouvez placer au fond de la caisse une alèse ou une serviette familière. Une couverture posée sur une partie de la caisse peut également l’aider à se sentir protégé."
        },
        {
          "type": "p",
          "text": "Pendant le trajet, évitez les sons trop forts et les ouvertures inutiles de la caisse."
        },
        {
          "type": "quote",
          "text": "⚠️ Par temps chaud, ne laissez jamais le chaton seul dans une voiture, même pendant quelques minutes."
        },
        {
          "type": "h2",
          "text": "La litière"
        },
        {
          "type": "p",
          "text": "Installez une litière propre et facilement accessible dès son arrivée. Elle doit se trouver dans un endroit calme, éloigné des gamelles et sans passage permanent."
        },
        {
          "type": "quote",
          "text": "Prévoyez une épaisseur suffisante de substrat, idéalement autour de 4 à 5 cm, afin que le chaton puisse gratter et recouvrir correctement ses besoins."
        },
        {
          "type": "p",
          "text": "Dans un premier temps, il est préférable d’utiliser le même type de litière que celui auquel il était habitué à la chatterie."
        },
        {
          "type": "p",
          "text": "Montrez-lui simplement l’emplacement du bac à son arrivée, sans l’y maintenir de force. La plupart des chatons comprennent très rapidement où il se trouve."
        },
        {
          "type": "p",
          "text": "La litière doit être nettoyée quotidiennement. Les produits très parfumés sont à éviter, car leur odeur peut être désagréable pour le chat et le détourner du bac."
        },
        {
          "type": "h2",
          "text": "L’alimentation et l’hydratation"
        },
        {
          "type": "p",
          "text": "Pendant les premiers jours, conservez la même alimentation que celle donnée à la chatterie pour éviter les troubles digestifs."
        },
        {
          "type": "quote",
          "text": "Si vous souhaitez modifier son alimentation, réalisez une transition progressive sur plusieurs jours en augmentant peu à peu la proportion du nouvel aliment."
        },
        {
          "type": "p",
          "text": "Une alimentation humide de bonne qualité peut être proposée quotidiennement afin de soutenir son hydratation. Les croquettes peuvent également être utilisées selon ses habitudes et ses besoins, mais l’eau fraîche doit toujours rester disponible."
        },
        {
          "type": "p",
          "text": "Placez si possible plusieurs points d’eau dans le logement, à distance de la nourriture et de la litière. Certains chats apprécient davantage les grandes gamelles remplies à ras bord ou les fontaines à eau."
        },
        {
          "type": "p",
          "text": "Une légère diminution de l’appétit peut survenir pendant les premières heures à cause du stress. En revanche, un chaton qui refuse totalement de manger, semble abattu ou présente d’autres symptômes doit être surveillé attentivement."
        },
        {
          "type": "h2",
          "text": "Le temps de l’adaptation"
        },
        {
          "type": "quote",
          "text": "Laissez votre chaton explorer une seule pièce au départ, puis ouvrez progressivement le reste du logement lorsqu’il paraît à l’aise."
        },
        {
          "type": "p",
          "text": "Certains chatons commencent à jouer et à réclamer de l’attention presque immédiatement. D’autres ont besoin de plusieurs heures ou de quelques jours pour prendre confiance."
        },
        {
          "type": "p",
          "text": "Il arrive qu’un chaton se cache sous un canapé, sous un meuble ou dans sa caisse de transport lors de son arrivée. Ce comportement est tout à fait normal. Ne le forcez pas à sortir et n’essayez pas de le poursuivre. Asseyez-vous calmement à proximité, parlez-lui doucement et laissez-le venir de lui-même."
        },
        {
          "type": "p",
          "text": "Vous pouvez lui proposer un peu de nourriture humide ou un jouet à distance, sans insister. Lorsqu’il comprendra qu’il n’est pas en danger, sa curiosité prendra généralement le dessus."
        },
        {
          "type": "h2",
          "text": "La première nuit"
        },
        {
          "type": "p",
          "text": "La première nuit peut être déstabilisante. Le chaton peut miauler, chercher ses frères et sœurs ou avoir du mal à rester seul."
        },
        {
          "type": "p",
          "text": "Installez-le dans un espace sécurisé avec sa litière, son eau, son couchage et une cachette. Une couverture portant une odeur familière peut le rassurer."
        },
        {
          "type": "p",
          "text": "Vous pouvez rester quelque temps auprès de lui avant de vous coucher, mais essayez de conserver une ambiance calme. Évitez de le stimuler avec des jeux très actifs en pleine nuit, au risque de lui apprendre que les miaulements nocturnes déclenchent immédiatement une séance de jeu."
        },
        {
          "type": "p",
          "text": "Un chaton peut dormir dans votre chambre si vous le souhaitez, à condition qu’il puisse accéder facilement à sa litière."
        },
        {
          "type": "h2",
          "text": "Les jeux et les griffades"
        },
        {
          "type": "quote",
          "text": "Le jeu est essentiel au développement du chaton. Il lui permet de se dépenser, d’apprendre à contrôler ses mouvements et de créer une relation avec sa nouvelle famille."
        },
        {
          "type": "p",
          "text": "Privilégiez les cannes à pêche, balles, tunnels et petits jouets spécialement conçus pour les chats. Rangez après utilisation les jouets comportant de longues ficelles ou des éléments pouvant être avalés."
        },
        {
          "type": "p",
          "text": "Évitez de jouer directement avec vos mains ou vos pieds. Un comportement amusant chez un petit chaton peut devenir douloureux une fois adulte. S’il mord ou griffe pendant le jeu, interrompez calmement l’interaction et redirigez son attention vers un jouet."
        },
        {
          "type": "p",
          "text": "Installez également plusieurs griffoirs dans les lieux où il passe du temps. Les griffades sont un comportement naturel, elles permettent au chat de s’étirer, d’entretenir ses griffes et de déposer ses marques."
        },
        {
          "type": "h2",
          "text": "La rencontre avec les autres animaux"
        },
        {
          "type": "p",
          "text": "La présentation avec un autre chat ou un chien doit être progressive. Évitez de placer immédiatement les animaux face à face dans une même pièce."
        },
        {
          "type": "p",
          "text": "Commencez par les séparer et laissez-les découvrir leurs odeurs à travers une porte fermée, des couvertures ou des objets échangés. Vous pourrez ensuite organiser de courtes rencontres surveillées lorsque chacun paraît calme."
        },
        {
          "type": "quote",
          "text": "Ne punissez pas les feulements ou les grognements. Ils permettent aux animaux d’exprimer leur inconfort et d’établir leurs limites. Une cohabitation réussie peut demander quelques jours, parfois plusieurs semaines."
        },
        {
          "type": "p",
          "text": "La cohabitation entre un chaton et un chien peut très bien se passer, à condition d’être introduite avec progressivité."
        },
        {
          "type": "p",
          "text": "Lors des premiers contacts, laissez au chaton la possibilité de s’éloigner librement."
        },
        {
          "type": "quote",
          "text": "Ne forcez jamais l’interaction."
        },
        {
          "type": "p",
          "text": "Le chaton doit pouvoir observer à distance et se réfugier en hauteur si nécessaire."
        },
        {
          "type": "p",
          "text": "Récompensez les comportements calmes du chien et évitez toute excitation excessive. Les rencontres doivent être courtes, positives et répétées progressivement."
        },
        {
          "type": "p",
          "text": "Avec du temps, de la patience et une bonne gestion des premières interactions, chien et chaton peuvent cohabiter sereinement, voire développer une relation harmonieuse."
        },
        {
          "type": "h2",
          "text": "Les enfants et le respect du chaton"
        },
        {
          "type": "p",
          "text": "Expliquez aux enfants qu’un chaton n’est pas un jouet. Ils doivent éviter de le poursuivre, de le réveiller, de le porter sans arrêt ou de le déranger lorsqu’il mange ou utilise sa litière."
        },
        {
          "type": "p",
          "text": "Les premières interactions doivent être calmes et surveillées. Il est préférable de s’asseoir au sol et de laisser le chaton approcher de lui-même."
        },
        {
          "type": "quote",
          "text": "Apprendre à reconnaître ses signaux d’inconfort permet de construire une relation plus sereine."
        },
        {
          "type": "h2",
          "text": "Les sorties à l’extérieur"
        },
        {
          "type": "p",
          "text": "Un chaton ne doit pas sortir librement dès son arrivée. Il doit d’abord avoir eu le temps de créer des repères solides dans sa nouvelle maison."
        },
        {
          "type": "p",
          "text": "Les sorties en harnais doivent également être introduites progressivement, d’abord à l’intérieur."
        },
        {
          "type": "h2",
          "text": "Le suivi vétérinaire"
        },
        {
          "type": "p",
          "text": "À son départ de la chatterie, votre chaton vous est remis avec ses documents et les informations concernant son identification, ses vaccins, ses traitements et son alimentation. Conservez soigneusement son carnet de santé."
        },
        {
          "type": "h2",
          "text": "Garder le contact avec la chatterie"
        },
        {
          "type": "p",
          "text": "Chaque chaton possède son propre tempérament. Nous restons disponibles après son départ pour répondre à vos questions concernant son adaptation, son alimentation ou ses habitudes."
        },
        {
          "type": "p",
          "text": "N’hésitez pas à nous donner de ses nouvelles et à nous contacter si un comportement vous inquiète. Dans la majorité des cas, les petites difficultés rencontrées pendant les premiers jours disparaissent avec du temps, de la régularité et beaucoup de douceur."
        },
        {
          "type": "p",
          "text": "En préparant soigneusement son arrivée et en respectant son rythme, vous lui offrez les meilleures conditions pour découvrir sereinement sa nouvelle famille et construire avec vous une relation durable."
        }
      ]
    }
  ],

  livreOr: []
};
