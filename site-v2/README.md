# Refonte du site public — Chatterie British Kingdom

Site public complet en HTML, CSS et JavaScript purs. Aucun framework, aucune
dépendance à installer.

Le site consomme **la même API que le site Angular actuel**
(`https://british-kingdom-back.azurewebsites.net/api/`) et les mêmes images
sur le stockage Azure. Rien à modifier côté back.

## Voir le site

```bash
cd site-v2
python3 -m http.server 8000
```

Puis ouvrir <http://127.0.0.1:8000>. Le site lit alors l'API réelle.

Ajouter `?demo=1` à l'adresse affiche les données d'aperçu sans appeler
l'API, par exemple <http://127.0.0.1:8000/index.html?demo=1>. Le site bascule
aussi automatiquement sur ces données si l'API ne répond pas, avec un bandeau
qui le signale : une page ne reste jamais vide.

> Ouvrir les fichiers par double-clic (`file://`) ne fonctionne pas :
> le navigateur bloque les appels réseau. Il faut passer par un serveur.

## Les pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : logo, portées du moment et leurs couples, chatons, anciens bébés, vidéo, conseils |
| `le-british.html` | Guide de la race : caractère, Shorthair et Longhair, robes et codes EMS |
| `males.html` | Les mâles en activité, avec le texte « À propos de nos mâles » saisi dans l'administration |
| `femelles.html` | Les femelles en activité, avec le texte « À propos de nos femelles » |
| `chat.html?id=` | Fiche d'un chat : robe, yeux, âge, parents, photos, portée du moment |
| `chatons.html` | Les portées en cours, présentées par couple, filtrables par statut |
| `portee.html?id=` | Détail d'une portée : les parents, les chatons, le journal semaine par semaine |
| `retraites.html` | Anciens reproducteurs, ceux que l'administration marque « archivé » |
| `galerie.html` | Toutes les photos du site, filtrables, avec visionneuse |
| `conseils.html`, `article.html?slug=` | Les articles du blog |
| `liste-attente.html` | Réservation (acompte de 200 €), inscription, étapes, santé, 14 questions |
| `contact.html` | Formulaire, coordonnées, carte |
| `mentions-legales.html`, `politique-confidentialite.html` | Pages légales |

Menu : Accueil, Le British, Mâles, Femelles, Chatons, Retraités, Galerie,
Conseils, Liste d'attente, Contact, plus le bouton « Voir les chatons ».
Sur la fiche d'un chat, la rubrique Mâles, Femelles ou Retraités s'allume
selon le chat affiché.

> **Page Retraités** : elle affiche les chats dont la case « archivé » est cochée
> dans l'administration. Aujourd'hui ce sont Luna, Prosper Mysterious et
> Fripouille. Confirmé le 22/09/2026 : cette case ne sert qu'aux retraités.

> **Cookies** : Google Analytics ne se charge qu'après « Accepter » dans le
> bandeau affiché à la première visite (`js/site.js`, identifiant lu dans la
> balise `<meta name="bk-ga">`). Le choix est gardé six mois ; le lien
> « Cookies » du pied de page rouvre le bandeau. Refuser efface les cookies
> `_ga` déjà posés.

> **Formulaire de liste d'attente** : il passe par le même envoi que le
> formulaire de contact (`POST contact`), avec le sujet « Liste d'attente ».
> Le sexe et la robe souhaités sont écrits en tête du message. Les demandes
> arrivent donc dans la page Messages de l'administration, comme les autres.

## Direction visuelle

Classe et tendre, tirée du logo de la maison (le chat chocolat couronné) :
framboise, or de la couronne et velours lavande sur un papier crème rosé. Plus
aucun vert. Titres en Fraunces, texte en Quicksand, petits mots manuscrits en
Caveat. Le logo apparaît en médaillon cerclé d'or dans l'en-tête, dans le
pied de page et en grand sur l'accueil, coiffé d'un petit nœud rose comme sur
le site actuel. Thèmes clair et sombre, tous deux vérifiés.

## Organisation des fichiers

```
site-v2/
├── *.html                 pages finales, autonomes
├── css/site.css           toute la feuille de style
├── js/api.js              accès à l'API et composition des URL d'images
├── js/demo-data.js        données d'aperçu (miroir de l'API, voir plus bas)
├── js/site.js             thème, menu, apparitions, visionneuse, formulaires
├── js/pages.js            rendu des contenus dynamiques, une fonction par page
├── img/*.svg              couronne, blason, patte, nœud, silhouette, filets
├── assets/logo*.{png,webp} le logo de la chatterie
├── assets/photos/         photos de mise en page, utilisées aussi en production
├── assets/chats/          ┐
├── assets/chatons/        ├ photos de l'aperçu seulement (données d'aperçu)
├── assets/parents/        ┘
└── _build/                générateur des pages (facultatif)
```

### Les photos

Toutes les photos viennent du dossier trié de la chatterie
(`Chatteries/Chatterie British Kingdom/`), choisies une à une, en WebP de
1 200 pixels au plus grand côté (qualité 76 à 78), soit environ 10 Mo pour
133 fichiers.

- `assets/photos/` : les photos choisies pour la mise en page (accueil,
  tuiles, bannière du British, anciens bébés, liste d'attente, couvertures
  des deux articles). Elles font partie du design et servent en production.
- `assets/chats/`, `assets/chatons/`, `assets/parents/` : les photos des
  données d'aperçu. **En production, les photos des chats et des chatons
  viennent de l'API et du stockage Azure** : ces dossiers peuvent être exclus
  de la mise en ligne.
- `assets/og-image.jpg` : la vignette de partage (1 200 × 630), les quatre
  reproducteurs côte à côte.

La règle de composition des URL ne change pas (`js/api.js`, fonction `join`) :
un nom de fichier seul est préfixé par le dossier Azure correspondant ; une
URL absolue ou un chemin qui commence par `assets/` ou `img/` est gardé tel
quel. C'est ce qui permet aux données d'aperçu de pointer vers les photos
locales sans aucun cas particulier.

### Les données d'aperçu

`js/demo-data.js` est un **miroir de l'API réelle relevé le 22 septembre
2026** : les 13 chats (10 en activité, 3 retraités), les 3 portées en ligne
(Zara & Willy Wonka, Akira & Willy Wonka, Tina & Voltaire) et leurs 11
chatons avec leurs vrais statuts, les textes des pages Mâles et Femelles, et
les deux articles du blog. Seules les adresses d'images changent. Le livre
d'or est vide, comme dans l'API (aucun témoignage validé).

Exception : le profil reprend les coordonnées publiques du site plutôt que
celles de l'API, qui sont anciennes (voir « Ce qu'il reste à compléter »).

### Modifier une page

1. **Directement dans le fichier `.html`** pour corriger un mot.
2. **Par le générateur** si l'en-tête, le menu ou le pied de page changent :
   éditer `_build/pages.py` ou `_build/build.py`, puis lancer
   `python3 _build/pages.py` depuis `site-v2/`. Cela réécrit les quinze pages
   et `sitemap.xml`. Attention, cette commande écrase les retouches faites à
   la main dans les `.html`.

Le nom, le téléphone, l'adresse, le SIRET et les réseaux sociaux sont
regroupés en haut de `_build/build.py`, dans le dictionnaire `SITE`.

## Mise en ligne

Le site est entièrement statique : il suffit de copier le contenu de
`site-v2/` (hors `_build/`, et si l'on veut hors `assets/chats`,
`assets/chatons` et `assets/parents`) à la racine du serveur.

Pour remplacer le site actuel sur l'App Service Azure `BritishKingdomFront`,
il faudra adapter le workflow `.github/workflows/main_britishkingdomfront.yml`,
qui publie aujourd'hui le résultat de la compilation Angular. Les adresses
changent (`/males` devient `males.html`, etc.) : prévoir des redirections pour
ne pas perdre le référencement.

## Ce qu'il reste à compléter

Ces points demandent une décision ou une information. Certains sont signalés
par des commentaires `À COMPLÉTER` dans le code.

- **SIRET et SIREN : réglé.** L'annuaire des entreprises confirme
  `84406443600026` (AMIEL ZEITOUN, Othis, activité 01.49Z, en activité). Le
  SIREN `844 064 436` est affiché dans le pied de page, les mentions légales et
  sous les annonces de chatons (pages Chatons et portée). L'autre numéro,
  `84432325300014`, appartient à une autre entreprise : il ne reste qu'en
  commentaire dans `src/app/footer/footer.component.html` (site Angular), à
  supprimer. Le champ SIREN de la base contient `204555555`, factice : à
  corriger dans l'administration.
- **Coordonnées de l'administration à corriger** : le profil de l'API contient
  encore l'ancien téléphone `06 20 48 14 39`, le texte de la page Contact
  affiche `06 19 67 09 34`, et le lien Instagram pointe vers
  `chatterie_british_kingdom` au lieu de `chatterie_britishkingdom`. Le
  nouveau site affiche `06 61 65 49 98` et le bon compte Instagram.
- **Stérilisation** : les chatons ne sont **pas** stérilisés avant le départ
  (précisé le 22/09/2026). Le nouveau site ne le dit donc nulle part et la
  FAQ reprend la règle du texte des mâles (stérilisation par l'adoptant vers
  6 à 7 mois). À corriger dans l'administration : la page Conditions du site
  actuel affiche encore « Tous nos chatons sont stérilisés avant leur départ ».
- **Chatons de Tina et Voltaire** : ils sont saisis « British Shorthair »
  alors que les photos et les publications disent Longhair.
- **Numéro de déclaration DDPP**, **ACACED** ou certificat de capacité, et
  **médiateur de la consommation** à nommer dans les mentions.
- **Prix des chatons** : volontairement non affichés (choix du 22/09/2026),
  le site invite à appeler ; seule la réservation de 200 € est annoncée.
- **Conditions de la liste d'attente** : l'acompte non remboursable combiné à
  la libération de la place après trois refus doit être relu par un juriste.
  Les termes « acompte » et « arrhes » n'ont pas le même effet en droit.
- **Cookies : réglé pour Google Analytics** (bandeau Accepter / Refuser).
  Reste à vérifier l'enregistrement des visites par l'API (adresse IP,
  localisation), qui part toujours au chargement : pour être dispensé de
  consentement, il doit rester strictement limité à la mesure d'audience.
  Le site actuel, lui, charge encore Google Analytics sans consentement.
- **Dépistages réels** : les dates et laboratoires des tests (HCM, PKD, FIV,
  FeLV, groupes sanguins) ne sont pas encore affichés sur les fiches.

## À savoir sur les données

- Les valeurs de `sex` renvoyées par l'API sont `Mâle` et `Femelle`.
- Les statuts de chaton sont `disponible`, `reserve`, `rester` et `vendu`.
  Ils sont traduits à l'affichage en Disponible, Réservé, Reste à la
  chatterie et Adopté.
- Les dates arrivent au format `AAAA-MM-JJ` sans heure.
- Les chats et portées archivés sont masqués, sauf sur la page Retraités.
- La fiche d'un chat et le détail d'une portée appellent `cats/{id}` et
  `portee/{id}` **avec `?profilId=1`**, comme le site Angular : sans ce
  paramètre, l'API répond 404 pour un chat.
- Les photos de parents `mere.jpg` et `pere.jpg` sont les silhouettes noires
  mises par défaut par l'administration : le site les traite comme une photo
  absente et n'affiche pas le bloc « Ses parents » s'il n'y en a aucune autre.
- Les saisies libres sont adoucies à l'affichage : `BLACK SILVER SHADED`
  devient « Black silver shaded », `Willy wonka` devient « Willy Wonka ».
- Une photo manquante affiche une silhouette de chat plutôt qu'une image
  cassée.

## Vérifications faites (22 septembre 2026)

- **API réelle** : les 14 adresses (accueil, mâles, femelles, trois fiches,
  chatons, deux portées, retraités, galerie, conseils, un article, liste
  d'attente) se remplissent depuis l'API sans basculer sur l'aperçu, sans
  erreur et sans image cassée. Les envois de statistiques ont été bloqués
  pendant le test pour ne pas compter de fausses visites.
- **Contrôle automatique** : 17 adresses × 390 et 1 360 pixels × thèmes clair
  et sombre. Aucune erreur JavaScript, aucun défilement horizontal, aucune
  image cassée, et toutes les paires texte / fond au contraste WCAG AA
  (4,5:1 pour le texte courant, 3:1 pour les grands titres).
- Relecture en capture d'écran de chaque page, sur ordinateur et sur
  téléphone, en clair et en sombre.
- Formulaires testés en mode aperçu : champs obligatoires signalés, sujet
  prérempli, message de réussite ; aucun message réel envoyé.
- Bandeau des cookies : aucune requête Google avant « Accepter », refus
  mémorisé, lien « Cookies » qui rouvre le bandeau, accord gardé au
  rechargement.
