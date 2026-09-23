/* ==========================================================================
   Le portrait de chaque reproducteur
   --------------------------------------------------------------------------
   L'API n'a pas (encore) de champ « description » : les textes des fiches
   sont donc ici, rangés par identifiant de chat. C'est le numéro de
   l'administration, visible dans l'adresse de la fiche : chat.html?id=116.

   Chaque texte est tiré de vos propres publications Facebook et Instagram ;
   ce qui est entre guillemets « … » est cité mot pour mot. Rien n'est
   inventé : les dates, les couples et les portées viennent de l'API ou de
   vos légendes.

   - Modifier un texte : changez-le ici, rien d'autre à faire.
   - Nouveau chat : ajoutez une entrée avec son identifiant.
   - « sante » (facultatif) : les dépistages publiés, affichés en liste, et
     « source » dit d'où ils viennent.
   - « accroche » (facultatif) : la petite phrase manuscrite de sa carte, sur
     les pages Nos mâles, Nos femelles et Nos retraités. Vos mots seulement.
   - « vitrine » (facultatif) : les photos de sa galerie mises en avant sur la
     page Nos mâles ou Nos femelles (noms de fichiers de l'administration ;
     la première va dans les polaroïds du haut de la page). Une photo retirée
     de sa galerie disparaît aussi d'ici ; sans « vitrine », ce sont ses deux
     premières photos.
   - Si un jour l'API renvoie un champ « description », c'est lui qui
     s'affichera à la place du texte d'ici.
   ========================================================================== */
window.BK_DESCRIPTIONS = {

  /* ---------- les mâles ---------- */
  116: { // Wilson
    accroche: "Un British tout en rondeur",
    vitrine: ["ac8f07d5-d230-44f6-b183-b4ed08265640.webp", "8b6c1357-b0c9-472b-87e3-54a78e578a90.webp", "91571304-e47c-4583-bf0b-11bc7f13a85b.webp"],
    texte: "« Bienvenue à Wilson, mâle bleu, qui rejoint notre petite chatterie ! » Arrivé chaton à la maison, Wilson est un British tout en rondeur : robe bleue, yeux orange et petit médaillon blanc sur le poitrail. Il a grandi aux côtés de Zara."
  },
  117: { // Willy Wonka
    accroche: "Posé, joueur et affectueux",
    vitrine: ["b4c17bf1-d666-409d-9d2e-61419e486d0e.webp", "d39c21a9-4dd5-40c7-ac13-1672870d296c.webp", "6b1da9b5-1ab8-40d2-af44-d4a1bdc9a9d4.webp"],
    texte: "« Je vous présente Willy Wonka, qui rejoint notre petite chatterie ! » Chocolat aux yeux orange, notre beau Willy Wonka est un mâle « posé, joueur et affectueux ». Il est le papa des deux portées d'août 2026, avec Zara et avec Akira : des chatons chocolat et cinnamon.",
    sante: ["PKD : négatif", "FeLV et FIV : négatifs", "Groupe sanguin B", "Porteur colourpoint et cinnamon"],
    source: "Annonce de saillie du 9 juin 2025"
  },
  121: { // Voltaire
    accroche: "Sous ses airs sérieux se cache un vrai nounours",
    vitrine: ["a6bf7ead-f71c-462b-a77d-725a017855a8.webp", "325d52b0-f124-4b7d-a575-e7a0c33e1abd.webp"],
    texte: "Le papa de la chatterie. « Sous ses airs sérieux se cache un vrai nounours. » British Longhair black silver shaded aux yeux verts, Voltaire est le père de nos portées de 2026 : avec Eden en février, avec Spooky en avril et avec Tina le 31 juillet."
  },
  124: { // Apericube
    accroche: "Toujours aussi joueur… et toujours aussi gourmand",
    vitrine: ["28fa7736-ee1b-4d5f-831e-71fe16e23990.webp", "2dc020a1-1ad0-4d37-a165-a45a0c867761.webp", "64ff9a81-3707-4b83-87c4-656408c7f828.webp"],
    texte: "Né à la maison le 2 mai 2025, Apericube est un « mâle British Shorthair chocolat, au regard plein de tendresse ». Avec sa sœur Akira, ce sont des « partenaires de crime… mais trop mignons pour être grondés ». « Toujours aussi joueur… et toujours aussi gourmand. »"
  },

  /* ---------- les femelles ---------- */
  104: { // Eden
    accroche: "La doyenne de nos reproductrices",
    vitrine: ["b96faf83-e90f-4d08-8606-655220eafe70.jpg", "35701645-7eb4-4c09-8c84-116b7b06f570.jpg"],
    texte: "La doyenne de nos reproductrices, black silver shaded aux yeux verts. Eden est la maman de Tina, et des trois mousquetaires nés en février 2026 de son mariage avec Voltaire : Baloo, Benco et Blizzard. « Tout le monde se porte à merveille sous le regard d'Eden. »"
  },
  105: { // Tina
    accroche: "Notre petite Tina, fille d'Eden",
    vitrine: ["0a966e63-dbae-4160-a6c7-9687fc0b6956.webp", "5500c77c-94e9-4070-b98b-cff7e3059523.jpg"],
    texte: "Notre petite Tina, fille d'Eden, black silver shaded aux yeux verts. « Entre les brins d'herbe et les rayons du soleil, elle savoure tranquillement l'été. » Le 31 juillet 2026, elle a donné naissance à Balthazar, Bulle et Byron, avec Voltaire."
  },
  112: { // Spooky
    accroche: "Toujours prête pour une nouvelle bêtise",
    vitrine: ["8e32a5cf-0e82-44eb-956b-aa743e7b2512.webp", "5d047be1-ff9a-46a7-8d4d-ad7839f4b0d9.webp", "6561cba4-517a-42aa-8b6c-9729da49e003.webp"],
    texte: "« Beauté féline aux yeux verts », et « toujours prête pour une nouvelle bêtise ». Née à la maison de Prosper et de Luna, Spooky est la maman de la petite bande d'avril 2026, dont Brume, notre black smoke, qui est restée à la maison."
  },
  118: { // Zara
    accroche: "On la reconnaît entre mille",
    vitrine: ["3cbcb702-8f37-4cd4-a9ff-fb3158a7f266.webp", "eb3109ef-9125-4f97-ae81-a5fa9e8a5e93.webp", "ab1426c5-ad4b-495d-b890-8944caa2971b.webp"],
    texte: "On la reconnaît entre mille : une robe chocolat, un médaillon blanc et des yeux vairons, un bleu et un marron. Avant d'avoir les siens, « Zara apprend le métier de maman avec les enfants de Spooky. Pas les plus dociles, mais elle gère ça comme une chef ! » Sa première portée, avec Willy Wonka, est née le 13 août 2026 : Braise, Bagheera et Bergamote."
  },
  120: { // Vesunna
    accroche: "Un vrai petit rayon de soleil",
    vitrine: ["22fc221e-3cd1-4d1d-8a50-39418087bdae.webp", "32a611c7-288c-4671-bb2c-e1d1a19185b4.webp"],
    texte: "« Elle arrive tout droit de Nice pour rejoindre notre famille. C'est un vrai petit rayon de soleil, elle est adorable ! » Black golden shaded aux yeux verts, Vesunna s'est révélée être la demi-sœur d'Akira, par leur papa : « Le monde est petit ! » Au printemps 2026, elle a eu une portée de cinq chatons avec Aries, un étalon de ShipPepites Cattery."
  },
  125: { // Akira
    accroche: "Notre jeune petite maman",
    vitrine: ["160d1a12-e2a2-4d38-9045-3f1b59794ea8.webp", "e0648d8f-29f1-4a98-bce2-6c704f0b2e32.webp"],
    texte: "« Notre jeune petite maman British Shorthair chocolat. » Née à la maison le 2 mai 2025, sœur d'Apericube, Akira a eu sa première portée le 15 août 2026, avec Willy Wonka : Bounty, Bretzel, Babka, Berlingot et Banoffee. « Une dose de réconfort avec Akira avant de commencer la semaine. »"
  },

  /* ---------- les retraités ---------- */
  90: { // Prosper Mysterious
    accroche: "Doux, calme et très câlin",
    texte: "« Originaire de Russie, il incarne la grâce et l'élégance de cette noble race. » Seal chinchilla point au regard bleu profond, IV Prosper Mysterious a été l'étalon de la maison, un chat « au caractère doux, calme et très câlin » qui « transmet à ses chatons autant sa beauté que son tempérament apaisé ». Il est le papa de Spooky, et le grand-père d'Ace, « la version miniature de son grand-père Prosper ».",
    sante: ["Pedigree LOOF", "Identification génétique faite", "PKD : négatif (test ADN)", "FeLV et FIV : négatifs", "Groupe sanguin A"],
    source: "Annonce de saillie du 10 juin 2025"
  },
  89: { // Luna
    accroche: "La première à avoir rejoint notre chatterie",
    texte: "« Voici Luna, la première à avoir rejoint notre chatterie ! » British Shorthair lilas aux yeux verts, Luna est la maman de Spooky, d'Akira et d'Apericube : trois de nos reproducteurs lui doivent le jour."
  },
  102: { // Fripouille
    texte: "British Longhair black silver shaded aux yeux verts, Fripouille est le papa de deux portées nées en 2024 : avec Luna au printemps, puis avec Spooky en juin."
  }
};
