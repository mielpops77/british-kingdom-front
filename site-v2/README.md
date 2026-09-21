# Refonte du site public — Chatterie British Kingdom

Maquette complète et fonctionnelle du nouveau site public, en HTML, CSS et
JavaScript purs. Aucun framework, aucune dépendance à installer.

Le site consomme **la même API que le site Angular actuel**
(`https://british-kingdom-back.azurewebsites.net/api/`) et les mêmes images
sur le stockage Azure. Rien à modifier côté back.

## Voir le site

```bash
cd site-v2
python3 -m http.server 8000
```

Puis ouvrir <http://127.0.0.1:8000>.

Ajouter `?demo=1` à l'adresse affiche des données d'exemple sans appeler
l'API, par exemple <http://127.0.0.1:8000/index.html?demo=1>. Le site bascule
aussi automatiquement en mode démonstration si l'API ne répond pas, avec un
bandeau qui le signale : une page ne reste jamais vide.

> Ouvrir les fichiers par double-clic (`file://`) ne fonctionne pas :
> le navigateur bloque les appels réseau. Il faut passer par un serveur.

## Les pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : vidéo, chatons disponibles, preuves de confiance, témoignages |
| `le-british.html` | Guide de la race : caractère, Shorthair et Longhair, robes et codes EMS |
| `nos-chats.html` | Reproducteurs, filtrables mâles et femelles |
| `chat.html?id=` | Fiche d'un chat : robe, EMS, parents, galerie, portées |
| `chatons.html` | Portées en cours, chatons et leur statut |
| `portee.html?id=` | Détail d'une portée, chatons, journal semaine par semaine |
| `adopter.html` | Étapes, conditions, santé et dépistages, liste d'attente, 15 questions |
| `blog.html`, `article.html?slug=` | Journal de la chatterie |
| `contact.html` | Formulaire, coordonnées, carte |
| `mentions-legales.html`, `politique-confidentialite.html` | Pages légales |

## Organisation des fichiers

```
site-v2/
├── *.html                 pages finales, autonomes
├── css/site.css           toute la feuille de style
├── js/api.js              accès à l'API et composition des URL d'images
├── js/demo-data.js        données d'exemple (mode démonstration)
├── js/site.js             thème, menu, apparitions, visionneuse, formulaire
├── js/pages.js            rendu des contenus dynamiques, une fonction par page
├── img/*.svg              emblèmes : couronne, blason, patte, silhouette, filets
├── assets/                photos et vidéo optimisées
└── _build/                générateur des pages (facultatif)
```

### Modifier une page

Deux façons, au choix :

1. **Directement dans le fichier `.html`.** Ils sont complets et lisibles.
   C'est le plus simple pour corriger un mot ou un paragraphe.
2. **Par le générateur**, si l'en-tête ou le pied de page doivent changer
   partout à la fois : éditer `_build/pages.py` puis lancer
   `python3 _build/pages.py`. Cela réécrit les douze pages.
   Attention, cette commande écrase les retouches faites à la main.

Le nom, le téléphone, l'adresse et le SIRET sont regroupés en haut de
`_build/build.py`, dans le dictionnaire `SITE`.

## Mise en ligne

Le site est entièrement statique : il suffit de copier le contenu de
`site-v2/` (hors `_build/`) à la racine du serveur. Le dossier `_build/`
n'est pas nécessaire en production.

Pour remplacer le site actuel sur l'App Service Azure `BritishKingdomFront`,
il faudra adapter le workflow `.github/workflows/main_britishkingdomfront.yml`,
qui publie aujourd'hui le résultat de la compilation Angular.

## Ce qu'il reste à compléter

Ces points demandent une décision ou une information de l'éleveuse. Ils sont
signalés par des commentaires `À COMPLÉTER` dans le code.

- **Deux SIRET différents** existent dans le dépôt actuel : `84406443600026`
  dans les mentions légales et `84432325300014` dans le pied de page. Le
  premier a été retenu, il faut confirmer le bon.
- **Numéro SIREN** à afficher près des annonces de chatons, comme la
  réglementation l'exige. Le champ existe déjà en base.
- **Numéro de déclaration DDPP** et **ACACED** ou certificat de capacité.
- **Médiateur de la consommation** à désigner et à nommer dans les mentions.
- **Prix des chatons** : la page Adopter renvoie vers un échange téléphonique.
  Afficher une fourchette serait plus rassurant.
- **Conditions de la liste d'attente** : l'acompte non remboursable combiné à
  la libération de la place après trois refus doit être relu par un juriste.
  Les termes « acompte » et « arrhes » n'ont pas le même effet en droit.
- **Bandeau de consentement aux cookies** : Google Analytics et
  l'enregistrement des adresses IP se déclenchent dès le chargement de la
  page, sans recueil du consentement. C'est le cas sur le site actuel aussi.
- **Dépistages réels** : la page Adopter décrit HCM, PKD, FIV, FeLV et groupes
  sanguins. Les dates et laboratoires doivent être ajoutés sur chaque fiche.

## À savoir sur les données

- Les valeurs de `sex` renvoyées par l'API sont `Mâle` et `Femelle`.
- Les statuts de chaton sont `disponible`, `reserve`, `rester` et `vendu`.
  Ils sont traduits à l'affichage en Disponible, Réservé, Reste à la
  chatterie et Adopté.
- Les dates arrivent au format `AAAA-MM-JJ` sans heure.
- Les chats et portées archivés sont masqués automatiquement.
- Une photo manquante affiche une silhouette de British plutôt qu'une image
  cassée.

## Vérifications déjà faites

- Aucune erreur JavaScript sur les douze pages.
- Aucun défilement horizontal entre 390 et 1360 pixels de large.
- Thèmes clair et sombre complets, réglables et mémorisés.
- Menu mobile, bascule de thème, visionneuse, validation et envoi du
  formulaire testés.
- Comportement correct quand toutes les images échouent.
- **Non vérifié** : les appels à l'API réelle, injoignable depuis
  l'environnement de développement utilisé. À tester en priorité.
