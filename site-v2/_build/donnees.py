# -*- coding: utf-8 -*-
"""
Les vraies données de la chatterie, lues dans l'API au moment de construire le site.

Pourquoi : les listes de chats, de portées et d'articles sont affichées par JavaScript. Google sait
l'exécuter, mais les robots des assistants d'IA (ChatGPT, Claude, Perplexity…) et beaucoup d'autres
ne le font pas : pour eux, ces pages étaient vides. On écrit donc, à chaque construction, un
instantané de ces listes directement dans le HTML ; le JavaScript le remplace ensuite par les
données en direct, avec exactement la même présentation.

Ce module fabrique aussi :
- les adresses des fiches (chats, chatons, portées) pour sitemap.xml ;
- llms.txt, le résumé de la chatterie destiné aux assistants d'IA.

Si l'API ne répond pas, rien n'est cassé : les pages sont construites sans instantané.
"""
import datetime
import html
import json
import os
import re
import unicodedata
import urllib.parse
import urllib.request

API = "https://british-kingdom-back.azurewebsites.net/api/"
BLOB = "https://stockagebackkingdom.blob.core.windows.net/conteneurkingdom/"
PROFIL = 1
HERE = os.path.dirname(os.path.abspath(__file__))
SITE_DIR = os.path.dirname(HERE)

MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
        "septembre", "octobre", "novembre", "décembre"]
STATUTS = {"disponible": "Disponible", "reserve": "Réservé", "rester": "Reste à la chatterie", "vendu": "Adopté"}


# --------------------------------------------------------------------------
# Lecture de l'API
# --------------------------------------------------------------------------
def _lire(chemin):
    req = urllib.request.Request(API + chemin, headers={"Accept": "application/json",
                                                          "User-Agent": "chatterie-british-kingdom-build"})
    with urllib.request.urlopen(req, timeout=25) as rep:
        return json.loads(rep.read().decode("utf-8"))


def charger():
    """Chats, portées et articles, ou None si l'API est injoignable."""
    try:
        return {
            "cats": _lire("cats?profilId=%d" % PROFIL) or [],
            "portees": _lire("portee?profilId=%d" % PROFIL) or [],
            "posts": _lire("blog?profilId=%d" % PROFIL) or [],
            "jour": datetime.date.today(),
        }
    except Exception as err:  # l'API peut être en maintenance : on construit sans instantané
        print("  API injoignable, pages construites sans instantané (%s)" % err)
        return None


def _table_hd():
    """La table des photos en haute définition (js/photos-hd.js), clé « Dossier/fichier »."""
    try:
        with open(os.path.join(SITE_DIR, "js", "photos-hd.js"), encoding="utf-8") as fh:
            texte = fh.read()
        m = re.search(r"window\.BK_HD\s*=\s*(\{.*?\});", texte, re.S)
        return json.loads(m.group(1)) if m else {}
    except (OSError, ValueError):
        return {}


_CHAINE = r'"((?:[^"\\]|\\.)*)"'


def _fiches():
    """Les entrées de js/descriptions.js, par identifiant de chat : {texte, accroche, vitrine, …}."""
    try:
        with open(os.path.join(SITE_DIR, "js", "descriptions.js"), encoding="utf-8") as fh:
            source = fh.read()
    except OSError:
        return {}
    lire = lambda s: s.replace('\\"', '"')
    out = {}
    for m in re.finditer(r"(\d+)\s*:\s*\{([^{}]*)\}", source):
        corps, fiche = m.group(2), {}
        for cle, valeur in re.findall(r"(\w+)\s*:\s*" + _CHAINE, corps):
            fiche[cle] = lire(valeur)
        for cle, valeurs in re.findall(r"(\w+)\s*:\s*\[([^\]]*)\]", corps):
            fiche[cle] = [lire(v) for v in re.findall(_CHAINE, valeurs)]
        out[int(m.group(1))] = fiche
    return out


def _descriptions():
    """Les textes de js/descriptions.js, par identifiant de chat."""
    return {cid: f["texte"] for cid, f in _fiches().items() if f.get("texte")}


# --------------------------------------------------------------------------
# Mise en forme : les mêmes règles que js/pages.js et js/api.js
# --------------------------------------------------------------------------
esc = html.escape


def nom(s):
    """« Willy wonka » devient « Willy Wonka »."""
    s = re.sub(r"\s+", " ", str(s or "")).strip()
    return re.sub(r"(^|[\s-])([a-zàâäçéèêëîïôöùûüÿñ])", lambda m: m.group(1) + m.group(2).upper(), s)


def propre(s):
    """Espaces en trop retirés, texte tout en capitales adouci, première lettre en majuscule."""
    t = re.sub(r"\s+", " ", str(s or "")).strip()
    if not t:
        return ""
    if t == t.upper() and re.search(r"[A-Z]", t):
        t = t.lower()
    return t[0].upper() + t[1:]


def robe(s):
    """« Bleu (BRI a) » → (« Bleu », « BRI a ») ; le nom s'écrit comme une phrase (« Black golden shaded »)."""
    t = propre(s)
    m = re.match(r"^(.*?)\s*\(([^)]+)\)\s*$", t)
    phrase = lambda x: x[:1] + x[1:].lower()
    return (phrase(m.group(1).strip()), m.group(2).strip()) if m else (phrase(t), "")


YEUX_PLURIEL = {"vert": "verts", "bleu": "bleus", "jaune": "jaunes", "doré": "dorés", "noir": "noirs"}
YEUX_COULEURS = [(r"orange|cuivr", "#e0892c"), (r"vert", "#7aa843"), (r"noisette", "#a8843a"),
                 (r"jaune|dor|ambre", "#e2b134"), (r"bleu", "#5b93d6"), (r"marron|brun", "#8a5a2b")]


def yeux(s):
    """« Vairon Bleu/Marron » → (« Yeux vairons », une couleur par œil), comme eyes() de js/pages.js."""
    t = propre(s).lower()
    if not t:
        return None
    couleur = lambda x: next((c for motif, c in YEUX_COULEURS if re.search(motif, x)), "")
    vairon = bool(re.match(r"^vairons?", t))
    parts = [p for p in re.split(r"\s*(?:/|,|&|\bet\b)\s*", re.sub(r"^vairons?\s*", "", t)) if p]
    c1 = couleur(parts[0] if parts else t)
    c2 = couleur(parts[1]) if vairon and len(parts) > 1 else c1
    return ("Yeux vairons" if vairon else "Yeux " + YEUX_PLURIEL.get(t, t)), c1, c2


def ligne_yeux(s):
    y = yeux(s)
    if not y:
        return ""
    libelle, c1, c2 = y
    pastilles = ('<span class="eyes" aria-hidden="true"><i style="--c:%s"></i><i style="--c:%s"></i></span>' % (c1, c2)
                 if c1 and c2 else "")
    return '<p class="card__eyes">%s%s</p>' % (pastilles, esc(libelle))


def race_courte(s):
    return re.sub(r"^British\s+", "", propre(s), flags=re.I)


def date_de(v):
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})", str(v or ""))
    return datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3))) if m else None


def date_longue(v):
    d = v if isinstance(v, datetime.date) else date_de(v)
    return "%d %s %d" % (d.day, MOIS[d.month - 1], d.year) if d else ""


def age(v, jour):
    d = date_de(v)
    if not d:
        return ""
    mois = (jour.year - d.year) * 12 + (jour.month - d.month) - (1 if jour.day < d.day else 0)
    if mois < 0:
        return "à naître"
    if mois < 1:
        jours = max(0, (jour - d).days)
        sem = jours // 7
        return ("%d semaine%s" % (sem, "s" if sem > 1 else "")) if sem >= 1 else ("%d jour%s" % (jours, "s" if jours > 1 else ""))
    if mois < 24:
        return "%d mois" % mois
    ans, reste = divmod(mois, 12)
    return "%d an%s" % (ans, "s" if ans > 1 else "") + (" et %d mois" % reste if reste else "")


def semaines(v, jour):
    d = date_de(v)
    return (jour - d).days // 7 if d else None


def pluriel(n, un, plusieurs):
    return "%d %s" % (n, plusieurs if n > 1 else un)


def age_chaton(v, jour):
    """En semaines tant qu'il est à la chatterie, en mois ensuite (ageChaton de js/pages.js)."""
    sem = semaines(v, jour)
    return pluriel(sem, "semaine", "semaines") if sem is not None and 1 <= sem < 16 else age(v, jour)


# Les mêmes textes que ETAPES de js/pages.js
ETAPES = [
    (0, "Naissance", "Les chatons naissent les yeux fermés, blottis contre leur mère. On les pèse chaque jour."),
    (2, "Les yeux s\u2019ouvrent", "D\u2019abord bleus chez tous les chatons. Les premiers pas, un peu hésitants, arrivent."),
    (4, "Les découvertes", "Premiers repas solides, apprentissage de la litière, premiers jeux avec la fratrie."),
    (8, "Identification et vaccins", "Puce électronique et premières vaccinations, avec le carnet de santé."),
    (10, "La vie de famille", "Visiteurs, bruits de la maison, câlins : le chaton s\u2019habitue à tout ce qu\u2019il retrouvera chez vous."),
    (12, "Le départ", "Vers douze semaines, avec son certificat LOOF, son carnet de santé et un peu de nourriture pour les premiers jours."),
]


def etape_ligne(sem, ico):
    """« Où en sont-ils ? » : l'étape du moment, en une ligne (etapeLigne de js/pages.js)."""
    if sem is None or sem < 0:
        return ""
    en = None
    for e in ETAPES:
        if sem >= e[0]:
            en = e
    return ('<p class="litter__stage">%s<span><b>%s</b> %s</span></p>' % (ico("paw", 16), esc(en[1]), esc(en[2]))) if en else ""


def statut(v):
    s = str(v or "").lower()
    s = s.replace("é", "e").replace("è", "e")
    for cle, debut in (("disponible", "dispo"), ("reserve", "reserv"), ("rester", "rest"), ("vendu", "vend"), ("vendu", "adopt")):
        if s.startswith(debut):
            return cle
    return s or "inconnu"


def sexe(v):
    s = str(v or "").lower()
    return "male" if s.startswith("m") else "female" if s.startswith("f") else ""


class Photos:
    """Adresse d'une photo de l'API, remplacée par sa version haute définition quand elle existe."""

    def __init__(self):
        self.hd = _table_hd()

    def __call__(self, dossier, fichier):
        f = str(fichier or "").strip()
        if not f:
            return ""
        if re.match(r"^(https?:)?//", f):
            return f
        return self.hd.get(dossier + "/" + f) or BLOB + dossier + "/" + urllib.parse.quote(f)


# --------------------------------------------------------------------------
# Les cartes, identiques à celles de js/pages.js
# --------------------------------------------------------------------------
def _arch(src, alt, cls=""):
    if not src:
        return '<div class="arch %s"><div class="img-fallback" aria-hidden="true"></div></div>' % cls
    return '<div class="arch %s"><img src="%s" alt="%s" loading="lazy" data-guard></div>' % (cls, esc(src), esc(alt))


def carte_chat(c, photo, jour, fiche=None, etiquette=""):
    """La carte d'un reproducteur (catCard de js/pages.js) ; etiquette : « Papa en ce moment »… déjà mis en forme."""
    n = nom(c.get("name"))
    r, _ = robe(c.get("robe"))
    breed = race_courte(c.get("breed"))
    accroche = (fiche or {}).get("accroche")
    return ('<a class="card card--cat reveal" href="chat.html?id=%s">' % c.get("id") +
            '<div class="card__media">' + _arch(photo("CatsProfil", c.get("urlProfil")), "Portrait de " + n) +
            ('<div class="card__badges"><span class="pill pill--breed">%s</span></div>' % esc(breed) if breed else "") +
            etiquette +
            '</div><div class="card__body"><h3 class="card__title">%s</h3>' % esc(n) +
            ('<p class="card__tagline">%s</p>' % esc(accroche) if accroche else "") +
            '<p class="card__meta">' +
            ('<span>%s</span>' % esc(r) if r else "") +
            ('<span><b>%s</b></span>' % esc(age(c.get("dateOfBirth"), jour)) if c.get("dateOfBirth") else "") +
            '</p>' + ligne_yeux(c.get("eyeColor")) + '</div></a>')


def _galerie(c):
    images = c.get("images") or []
    if isinstance(images, str):
        images = [i.strip() for i in images.split(",")]
    return [i for i in images if i]


def vitrine(c, fiche, photo):
    """Les photos mises en avant (showcase() de js/pages.js) : celles de « vitrine » encore dans la galerie,
    sinon les deux premières de la galerie."""
    galerie = _galerie(c)
    choisies = [f for f in (fiche or {}).get("vitrine", []) if f in galerie]
    return [photo("CatsImages", f) for f in (choisies or galerie[:2])]


def autocollants(items, ico):
    """Les autocollants du haut d'une page : [(pictogramme, texte, lien)] (autocollants de js/pages.js)."""
    return '<ul class="bh-stickers intro__stickers">%s</ul>' % "".join(
        "<li>%s%s</li>" % (ico(i, 18), ('<a href="%s">%s</a>' % (lien, esc(t))) if lien else esc(t)) for i, t, lien in items)


def autocollants_sexe(sx, liste, parents):
    """Ce que dit le haut des pages Nos mâles / Nos femelles (sexStickers de js/pages.js)."""
    male = sx == "male"
    races = []
    for c in liste:
        r = propre(c.get("breed"))
        if r and r not in races:
            races.append(r)
    items = [("crown", pluriel(len(liste), "mâle" if male else "femelle", "mâles" if male else "femelles"), "")]
    if parents:
        items.append(("heart", pluriel(parents, "papa" if male else "maman", "papas" if male else "mamans") + " en ce moment", "#sex-litters"))
    if races:
        items.append(("paw", " et ".join(race_courte(r) for r in races) if len(races) > 1 else races[0], ""))
    return items


def eventail(choix):
    """Les polaroïds du haut d'une page : [(adresse, photo, prénom)] (eventail de js/pages.js)."""
    if not choix:
        return ""
    return '<div class="fan">%s</div>' % "".join(
        '<a class="fan__one" href="%s" tabindex="-1"><img src="%s" alt="" data-guard>'
        '<span class="fan__name">%s</span></a>' % (href, esc(src), esc(n)) for href, src, n in choix)


_VEDETTE = re.compile(r"""\{\s*nom\s*:\s*['\"]([^'\"]+)['\"]\s*(?:,\s*photo\s*:\s*(\d+)\s*)?\}|['\"]([^'\"]+)['\"]""")


def vedettes():
    """js/vedettes.js : les chatons mis en avant en haut de la page Chatons, [(prénom, n° de photo)]."""
    try:
        with open(os.path.join(SITE_DIR, "js", "vedettes.js"), encoding="utf-8") as fh:
            source = fh.read()
    except OSError:
        return []
    m = re.search(r"window\.BK_VEDETTES\s*=\s*\[([^\]]*)\]", source)
    if not m:
        return []
    return [(v[0] or v[2], int(v[1] or 1)) for v in _VEDETTE.findall(m.group(1))]


def _sans_accent(s):
    return re.sub(r"[\u0300-\u036f]", "", unicodedata.normalize("NFD", str(s or "").strip().lower()))


def _photos_chaton(k, photo):
    """Les photos d'un chaton, dans l'ordre de sa fiche (photosChaton de js/pages.js)."""
    photos = k.get("photos") or []
    if isinstance(photos, str):
        photos = [p.strip() for p in photos.split(",")]
    vues = []
    for src in [_photo_chaton(k, photo)] + [photo("Chatons", f) for f in photos if f]:
        if src and src not in vues:
            vues.append(src)
    return vues


def chatons_vedettes(portees, photo):
    """Les trois chatons des polaroïds, avec leur photo (chatonsVedettes de js/pages.js) : [(chaton, photo)]."""
    tous = chatons_melanges(portees, photo)
    choisis = []
    for prenom, numero in vedettes():
        for k in tous:
            if _sans_accent(k.get("name")) == _sans_accent(prenom) and not any(c[0] is k for c in choisis):
                photos = _photos_chaton(k, photo)
                choisis.append((k, photos[numero - 1] if 0 < numero <= len(photos) else _photo_chaton(k, photo)))
                break
    for k in tous:
        if len(choisis) < 3 and not any(c[0] is k for c in choisis):
            choisis.append((k, _photo_chaton(k, photo)))
    return choisis[:3]


def chatons_melanges(portees, photo=None):
    """Un chaton de chaque portée à tour de rôle, les disponibles d'abord (chatonsMelanges de js/pages.js)."""
    listes = []
    for p in portees:
        ks = [k for k in (p.get("chatons") or []) if photo is None or _photo_chaton(k, photo)]
        listes.append(sorted(ks, key=lambda k: 0 if statut(k.get("status")) == "disponible" else 1))
    out, i = [], 0
    while any(len(l) > i for l in listes):
        out += [l[i] for l in listes if len(l) > i]
        i += 1
    return out


def _photo_chaton(k, photo):
    photos = k.get("photos") or []
    if isinstance(photos, str):
        photos = [photos]
    return photo("Chatons", k.get("urlProfil") or (photos[0] if photos else ""))


def carte_chaton(k, photo, jour):
    n = nom(k.get("name")) or "Chaton"
    r, _ = robe(k.get("robe"))
    st = statut(k.get("status"))
    sx = sexe(k.get("sex"))
    marque = ('<span class="sex sex--m" aria-hidden="true">♂</span>' if sx == "male" else
              '<span class="sex sex--f" aria-hidden="true">♀</span>' if sx == "female" else "")
    libelle = {"male": "Mâle", "female": "Femelle"}.get(sx, "")
    breed = race_courte(k.get("breed"))
    return ('<a class="card card--kitten reveal" href="chaton.html?id=%s">' % k.get("id") +
            '<div class="card__media">' + _arch(_photo_chaton(k, photo), "Photo du chaton " + n) +
            '<div class="card__badges"><span class="pill pill--%s">%s</span></div></div>' % (esc(st), esc(STATUTS.get(st, propre(k.get("status"))))) +
            '<div class="card__body"><h3 class="card__title">%s</h3><p class="card__meta">' % esc(n) +
            ('<span>%s%s</span>' % (marque, libelle) if libelle else "") +
            ('<span>%s</span>' % esc(r) if r else "") + '</p>' +
            ('<p class="card__sub">%s%s</p>' % (esc(age_chaton(k.get("dateOfBirth"), jour)), (" · " + esc(breed)) if breed else "") if k.get("dateOfBirth") else "") +
            '</div></a>')


def couple(p, cats, photo, lie, coeur):
    par_id = {str(c.get("id")): c for c in cats}
    mere, pere = par_id.get(str(p.get("idMaman"))), par_id.get(str(p.get("idPapa")))
    ext = p.get("externalFatherName") or ""
    photo_pere = photo("CatsParents", p.get("externalFatherPhoto")) if ext else photo("CatsProfil", p.get("urlProfilFather"))
    photo_mere = photo("CatsProfil", p.get("urlProfilMother"))

    def un(chat, src, role, externe=""):
        n = nom(chat.get("name")) if chat else externe
        src = src or (photo("CatsProfil", chat.get("urlProfil")) if chat else "")
        dedans = ('<span class="couple__photo">' +
                  ('<img src="%s" alt="" loading="lazy" data-guard>' % esc(src) if src else '<span class="img-fallback" aria-hidden="true"></span>') +
                  '</span><span class="couple__role">%s</span>' % role +
                  ('<span class="couple__name">%s</span>' % esc(n) if n else "") +
                  ('<span class="couple__robe">%s</span>' % esc(robe(chat.get("robe"))[0]) if chat else
                   ('<span class="couple__robe">Saillie extérieure</span>' if externe else "")))
        if lie and chat:
            return '<a class="couple__one" href="chat.html?id=%s">%s</a>' % (chat.get("id"), dedans)
        return '<span class="couple__one">%s</span>' % dedans

    return ('<div class="couple">' + un(pere, photo_pere, "Papa", ext) +
            '<span class="couple__heart" aria-hidden="true">%s</span>' % coeur +
            un(mere, photo_mere, "Maman") + '</div>')


def _disponibles(p):
    return [k for k in (p.get("chatons") or []) if statut(k.get("status")) == "disponible"]


def _etat_portee(p):
    n = len(_disponibles(p))
    return ('<span class="pill pill--disponible">%s</span>' % pluriel(n, "disponible", "disponibles") if n
            else '<span class="pill pill--vendu">Complète</span>')


def carte_article(a, photo, i):
    titre = a.get("title") or ""
    return ('<a class="card card--post reveal" data-delay="%d" href="article.html?slug=%s">' % (i % 3, urllib.parse.quote(a.get("slug") or "")) +
            '<div class="card__media">' + _arch(photo("ImgDivers", a.get("coverImage")), titre, "arch--landscape") +
            ('<div class="card__badges"><span class="pill pill--breed">%s</span></div>' % esc(a["category"]) if a.get("category") else "") +
            '</div><div class="card__body"><h3 class="card__title">%s</h3>' % esc(titre) +
            '<p class="card__meta"><span>%s</span>%s</p>' % (esc(date_longue(a.get("date"))),
                                                           ("<span>%d min de lecture</span>" % int(a["readingTime"])) if a.get("readingTime") else "") +
            ('<p class="card__excerpt">%s</p>' % esc(a["excerpt"]) if a.get("excerpt") else "") +
            '</div></a>')


# --------------------------------------------------------------------------
# Les instantanés, page par page
# --------------------------------------------------------------------------
def _portees_en_ligne(d):
    ps = [p for p in d["portees"] if p and not p.get("archivee")]
    return sorted(ps, key=lambda p: str(p.get("dateOfBirth") or ""), reverse=True)


def _note(d):
    # Visible seulement sans JavaScript (robots, lecteurs sans script) : la page se met ensuite à jour en direct
    return '<p class="small snapshot-note">Disponibilités au %s.</p>' % date_longue(d["jour"])


def instantanes(d, ico):
    """{fichier: {conteneur: html}} pour les pages qui affichent des données de l'API ; ico : les pictogrammes du site."""
    photo = Photos()
    fiches = _fiches()
    coeur = ico("heart", 18)
    jour = d["jour"]
    actifs = [c for c in d["cats"] if c and not c.get("archivee")]
    retraites = sorted([c for c in d["cats"] if c and c.get("archivee")], key=lambda c: str(c.get("dateOfBirth") or ""))
    portees = _portees_en_ligne(d)
    articles = sorted(d["posts"], key=lambda a: str(a.get("date") or ""), reverse=True)
    out = {}

    for fichier, sx in (("males.html", "male"), ("femelles.html", "female")):
        liste = [c for c in actifs if sexe(c.get("sex")) == sx]
        if not liste:
            continue
        # Les parents d'une portée en ligne portent l'étiquette « Papa (ou Maman) en ce moment »
        cle = "idPapa" if sx == "male" else "idMaman"
        parents = {str(p.get(cle)) for p in portees}
        est_parent = lambda c: str(c.get("id")) in parents
        etiquette = '<span class="card__sticker">%s%s</span>' % (ico("heart", 14), "Papa en ce moment" if sx == "male" else "Maman en ce moment")
        grille = "grid-4" if len(liste) == 4 or len(liste) > 6 else "grid-3"
        vedettes = [c for c in liste if est_parent(c)] + [c for c in liste if not est_parent(c)]
        choix = []
        for c in vedettes:
            src = (vitrine(c, fiches.get(c.get("id")), photo) or [""])[0] or photo("CatsProfil", c.get("urlProfil"))
            if src:
                choix.append(("chat.html?id=%s" % c.get("id"), src, nom(c.get("name"))))
        out[fichier] = {
            "cats-list": '<div data-snapshot><div class="grid %s cats">%s</div></div>' % (grille, "".join(
                carte_chat(c, photo, jour, fiches.get(c.get("id")), etiquette if est_parent(c) else "") for c in liste)),
            "cats-stickers": '<div data-snapshot>%s</div>' % autocollants(autocollants_sexe(sx, liste, sum(1 for c in liste if est_parent(c))), ico),
            "cats-fan": '<div data-snapshot>%s</div>' % eventail(choix[:3]),
        }

    if retraites:
        out["retraites.html"] = {"retired-list": '<div data-snapshot><div class="grid grid-3 cats">%s</div></div>' % "".join(
            carte_chat(c, photo, jour, fiches.get(c.get("id"))) for c in retraites)}

    if portees:
        blocs = []
        for i, p in enumerate(portees):
            sem = semaines(p.get("dateOfBirth"), jour)
            meta = ""
            if p.get("dateOfBirth"):
                meta += "<span>Nés le %s%s</span>" % (date_longue(p["dateOfBirth"]), (" · " + pluriel(sem, "semaine", "semaines")) if sem is not None and sem >= 0 else "")
            if p.get("dateOfSell"):
                meta += "<span>Départ à partir du %s</span>" % date_longue(p["dateOfSell"])
            chatons = p.get("chatons") or []
            blocs.append(
                '<article class="litter reveal" data-delay="%d"><header class="litter__head">' % (i % 3) + couple(p, d["cats"], photo, True, coeur) +
                '<div class="litter__info"><p class="eyebrow">Portée %d sur %d</p><h2>%s</h2>' % (i + 1, len(portees), esc(p.get("name") or "Portée")) +
                '<p class="litter__meta">%s</p>' % meta + etape_ligne(sem, ico) +
                '<p class="litter__actions">%s<a class="link-arrow" href="portee.html?id=%s">La portée en détail</a></p></div></header>' % (_etat_portee(p), p.get("id")) +
                ('<div class="grid grid-4 kittens">%s</div>' % "".join(carte_chaton(k, photo, jour) for k in chatons) if chatons
                 else '<p class="small">Les chatons seront présentés ici dès les premières photos.</p>') +
                '</article>')
        depart = sorted(p["dateOfSell"] for p in portees if p.get("dateOfSell"))
        dispo = sum(len(_disponibles(p)) for p in portees)
        items = [("crown", pluriel(len(portees), "portée à la maison", "portées à la maison"), "")]
        items.append(("heart", pluriel(dispo, "chaton disponible", "chatons disponibles"), "#litters") if dispo
                     else ("heart", "Tous réservés pour le moment", "liste-attente.html"))
        if depart:
            items.append(("clock", "Premiers départs le " + date_longue(depart[0]), ""))
        trois = chatons_vedettes(portees, photo)
        out["chatons.html"] = {
            "litters": '<div data-snapshot>%s%s</div>' % (_note(d), "".join(blocs)),
            "kittens-stickers": '<div data-snapshot>%s</div>' % autocollants(items, ico),
            "kittens-fan": '<div data-snapshot>%s</div>' % eventail(
                [("chaton.html?id=%s" % k.get("id"), src, nom(k.get("name")) or "Chaton") for k, src in trois]),
        }

        # Accueil : les portées, puis huit chatons, un de chaque portée à tour de rôle
        cartes = "".join(
            '<a class="litter-card reveal" href="portee.html?id=%s">' % p.get("id") + couple(p, d["cats"], photo, False, coeur) +
            '<span class="litter-card__name">%s</span>' % esc(p.get("name") or "Portée") +
            '<span class="litter-card__meta">%s%s</span>' % (("Nés le %s · " % date_longue(p["dateOfBirth"])) if p.get("dateOfBirth") else "",
                                                            pluriel(len(p.get("chatons") or []), "chaton", "chatons")) +
            _etat_portee(p) + '</a>' for p in portees)
        par_portee = [_disponibles(p) for p in portees]
        melange, i = [], 0
        while any(len(l) > i for l in par_portee):
            melange += [l[i] for l in par_portee if len(l) > i]
            i += 1
        autres = [k for p in portees for k in (p.get("chatons") or []) if statut(k.get("status")) != "disponible"]
        choisis = (melange + autres)[:8]
        out["index.html"] = {"home-litters": '<div data-snapshot><div class="couples">%s</div></div>' % cartes}
        if choisis:
            out["index.html"]["home-kittens"] = '<div data-snapshot>%s<div class="grid grid-4 kittens">%s</div></div>' % (
                _note(d), "".join(carte_chaton(k, photo, jour) for k in choisis))

    if articles:
        out.setdefault("index.html", {})["home-posts"] = '<div data-snapshot><div class="grid grid--center">%s</div></div>' % "".join(
            carte_article(a, photo, i) for i, a in enumerate(articles[:3]))
        out["conseils.html"] = {"blog-list": '<div data-snapshot><div class="grid grid--center">%s</div></div>' % "".join(
            carte_article(a, photo, i) for i, a in enumerate(articles))}
    return out


def injecter(pages, d, ico):
    """Écrit les instantanés dans les conteneurs vides des pages (<div id="…"></div>) ; ico : les pictogrammes du site."""
    if not d:
        return 0
    tout, n = instantanes(d, ico), 0
    for page in pages:
        for cid, contenu in tout.get(page["file"], {}).items():
            vide = '<div id="%s"></div>' % cid
            if vide in page["body"]:
                page["body"] = page["body"].replace(vide, '<div id="%s">%s</div>' % (cid, contenu), 1)
                n += 1
    return n


# --------------------------------------------------------------------------
# Plan du site : les fiches
# --------------------------------------------------------------------------
def adresses_fiches(d, domaine):
    """[(adresse, dernière modification, fréquence, priorité)] des fiches de chats, de chatons et de portées."""
    if not d:
        return []
    jour = d["jour"].isoformat()
    out = []
    for c in d["cats"]:
        if c and c.get("id") is not None:
            out.append(("%s/chat.html?id=%s" % (domaine, c["id"]), jour, "monthly", "0.6" if c.get("archivee") else "0.7"))
    for p in _portees_en_ligne(d):
        out.append(("%s/portee.html?id=%s" % (domaine, p["id"]), jour, "weekly", "0.7"))
        for k in p.get("chatons") or []:
            out.append(("%s/chaton.html?id=%s" % (domaine, k["id"]), jour, "weekly", "0.7"))
    for a in d["posts"]:
        if a.get("slug"):
            out.append(("%s/article.html?slug=%s" % (domaine, urllib.parse.quote(a["slug"])), jour, "yearly", "0.5"))
    return out


# --------------------------------------------------------------------------
# llms.txt : le résumé pour les assistants d'IA
# --------------------------------------------------------------------------
def _texte(h):
    """HTML → texte simple."""
    t = re.sub(r"<[^>]+>", " ", h)
    t = html.unescape(t).replace(" ", " ")
    return re.sub(r"\s+", " ", t).strip()


def faq(body):
    """[(question, réponse)] des blocs <details class="faq"> d'une page."""
    # Seulement les vraies questions (class="faq" tout court) : d'autres volets repliables en reprennent le style
    return [(_texte(q), _texte(r)) for q, r in re.findall(
        r'<details class="faq">\s*<summary>(.*?)</summary>\s*<div class="faq__body">(.*?)</div>\s*</details>', body, re.S)]


def llms(d, site, pages):
    dom = site["domaine"]
    j = d["jour"] if d else datetime.date.today()
    L = ["# %s" % site["nom"], "",
         "> Élevage familial de chats British Shorthair et British Longhair inscrits au LOOF, à %s (%s, 77), "
         "à 20 minutes de l'aéroport Paris-Charles de Gaulle. Les chatons naissent et grandissent à la maison, "
         "au milieu de la vie de famille, et partent vers 12 semaines. Livraison en France, en Belgique et en Suisse." % (site["ville"], site["region"]),
         "", "## L'essentiel",
         "- Races : British Shorthair (poil court) et British Longhair (poil mi-long), inscrits au LOOF.",
         "- Adresse : %s, %s %s (%s, Île-de-France). Visites uniquement sur rendez-vous." % (site["adresse"], site["cp"], site["ville"], site["region"]),
         "- Téléphone : %s (pas d'appels masqués). E-mail : %s." % (site["tel"], site["email"]),
         "- Remise du chaton à Othis, à la gare de Roissy ou de Saint-Mard ; taxi animalier pour plus loin. Livraison en France, en Belgique et en Suisse.",
         "- Au départ, vers 12 semaines : certificat LOOF, puce électronique d'identification, premières vaccinations, carnet de santé, un peu de nourriture et de litière. Les chatons ne sont pas stérilisés avant le départ.",
         "- Réservation par la liste d'attente, avec un acompte de %s déduit du prix. Les prix ne sont pas publiés : ils se demandent par téléphone ou par e-mail." % site["acompte"],
         "- Entreprise : SIREN %s, SIRET %s." % (site["siren"], site["siret"]),
         "- Réseaux : Facebook (%s), Instagram (%s), TikTok (%s), YouTube (%s)." % (site["facebook"], site["instagram"], site["tiktok"], site["youtube"]),
         "", "## Pages"]
    for p in pages:
        if p.get("sitemap") is False:
            continue
        adresse = dom + "/" + ("" if p["file"] == "index.html" else p["file"])
        L.append("- [%s](%s) : %s" % (p["title"].split(" — ")[0], adresse, p["desc"]))
    if d:
        textes = _descriptions()
        L += ["", "## Nos chats (au %s)" % date_longue(j)]
        for titre, liste in (
                ("Mâles", [c for c in d["cats"] if not c.get("archivee") and sexe(c.get("sex")) == "male"]),
                ("Femelles", [c for c in d["cats"] if not c.get("archivee") and sexe(c.get("sex")) == "female"]),
                ("Retraités", [c for c in d["cats"] if c.get("archivee")])):
            if not liste:
                continue
            L += ["", "### " + titre]
            for c in liste:
                r, ems = robe(c.get("robe"))
                yeux = propre(c.get("eyeColor")).lower()
                # Même accord que les fiches (js/pages.js) : « yeux verts », « yeux vairons bleu/marron »
                yeux = ("vairons" + yeux[len("vairon"):].lstrip("s")) if yeux.startswith("vairon") else \
                    {"vert": "verts", "bleu": "bleus", "jaune": "jaunes", "doré": "dorés", "noir": "noirs"}.get(yeux, yeux)
                fem = sexe(c.get("sex")) == "female"
                ligne = "- [%s](%s/chat.html?id=%s) : %s %s%s%s%s." % (
                    nom(c.get("name")), dom, c.get("id"), propre(c.get("breed")) or "British", (r or "").lower(),
                    (" (%s)" % ems) if ems else "", (", yeux %s" % yeux) if yeux else "",
                    (", née le " if fem else ", né le ") + date_longue(c["dateOfBirth"]) if c.get("dateOfBirth") else "")
                if textes.get(c.get("id")):
                    ligne += " " + textes[c["id"]]
                L.append(ligne)
        portees = _portees_en_ligne(d)
        if portees:
            L += ["", "## Portées en cours (disponibilités au %s)" % date_longue(j)]
            for p in portees:
                chatons = []
                for k in p.get("chatons") or []:
                    r, _ = robe(k.get("robe"))
                    chatons.append("[%s](%s/chaton.html?id=%s) (%s, %s, %s)" % (
                        nom(k.get("name")), dom, k.get("id"), {"male": "mâle", "female": "femelle"}.get(sexe(k.get("sex")), "chaton"),
                        (r or "").lower(), STATUTS.get(statut(k.get("status")), "").lower()))
                L.append("- [%s](%s/portee.html?id=%s) : %s%s. %s" % (
                    p.get("name") or "Portée", dom, p.get("id"),
                    ("nés le " + date_longue(p["dateOfBirth"])) if p.get("dateOfBirth") else "",
                    (", départ à partir du " + date_longue(p["dateOfSell"])) if p.get("dateOfSell") else "",
                    ("Chatons : " + ", ".join(chatons) + ".") if chatons else ""))
        if d["posts"]:
            L += ["", "## Conseils"]
            for a in sorted(d["posts"], key=lambda a: str(a.get("date") or ""), reverse=True):
                L.append("- [%s](%s/article.html?slug=%s) : %s" % (a.get("title"), dom, urllib.parse.quote(a.get("slug") or ""), a.get("excerpt") or ""))
    questions = [q for p in pages for q in faq(p["body"])]
    if questions:
        L += ["", "## Questions fréquentes"]
        for q, r in questions:
            L += ["", "### " + q, r]
    L += ["", "---", "Dernière mise à jour : %s. Source : %s" % (date_longue(j), dom + "/")]
    return "\n".join(L) + "\n"


# --------------------------------------------------------------------------
# Une page par fiche : ce que voit un moteur de recherche sans JavaScript
# --------------------------------------------------------------------------
# chat.html, chaton.html, portee.html et article.html sont des pages vides que
# JavaScript remplit une fois le chat (ou le chaton…) connu. Un moteur de
# recherche qui n'exécute pas JavaScript voyait donc la même page vide pour tous.
# On écrit ici une page par animal, avec son titre, sa description et son texte ;
# le serveur la sert à la place de la page vide (voir _deploy/web.config).

def _coupe(texte, n=155):
    """Un texte de description qui tient dans les résultats de recherche, coupé à un mot."""
    t = re.sub(r"\s+", " ", str(texte or "")).strip()
    if len(t) <= n:
        return t
    court = t[:n]
    point = max(court.rfind(". "), court.rfind(" ! "), court.rfind(" ? "))
    if point > n * 0.55:
        return court[:point + 1].strip()
    return court[:court.rfind(" ")].rstrip(" ,;:") + "…"


def _phrase_chat(c, jour):
    """« Une British Shorthair chocolat aux yeux vairons, née le 16 juin 2024. »"""
    fem = sexe(c.get("sex")) == "female"
    r, _ = robe(c.get("robe"))
    y = yeux(c.get("eyeColor"))
    bout = []
    bout.append(("Une " if fem else "Un ") + propre(c.get("breed") or "British Shorthair"))
    if r:
        bout.append(r.lower())
    phrase = " ".join(bout)
    if y:
        phrase += " aux " + y[0].lower()
    if c.get("dateOfBirth"):
        phrase += (", née le " if fem else ", né le ") + date_longue(c.get("dateOfBirth"))
    return phrase + "."


def _photos_fiche(sources, alt):
    """Les photos d'une fiche, en pleine largeur, avec leur texte de remplacement."""
    if not sources:
        return ""
    return '<div class="grid grid-3">%s</div>' % "".join(
        '<figure class="arch">%s</figure>' % _arch(src, alt).replace('<div class="arch ">', '<div class="arch">')
        for src in sources[:2])


def _snap(contenu):
    return '<div data-snapshot>%s</div>' % contenu


def _fiche_chat(c, fiches, photo, jour, domaine):
    n = nom(c.get("name"))
    r, _ = robe(c.get("robe"))
    race = race_courte(c.get("breed")) or "Shorthair"
    fiche = fiches.get(c.get("id")) or {}
    texte = fiche.get("texte") or ""
    phrase = _phrase_chat(c, jour)
    images = [photo("CatsProfil", c.get("urlProfil"))] + vitrine(c, fiche, photo)
    images = [i for i in dict.fromkeys(images) if i]

    titre = "%s, British %s %s" % (n, race, (r or "").lower())
    titre = re.sub(r"\s+", " ", titre).strip().rstrip(",")
    if len(titre) <= 36:
        titre += " — Chatterie British Kingdom"
    desc = _coupe(texte) or _coupe(
        "%s %s Photos, origines et portées, à la Chatterie British Kingdom, à Othis (77)." % (phrase, ""))

    corps = ("<h1>%s</h1><p class=\"lede\">%s</p>" % (esc(n), esc(phrase)) +
             ("<p>%s</p>" % esc(texte) if texte else "") +
             _photos_fiche(images, "Photo de " + n))
    return {"cible": "cat-detail", "nom": n, "titre": titre, "desc": desc, "corps": _snap(corps),
            "image": images[0] if images else "", "canon": "%s/chat.html?id=%s" % (domaine, c.get("id")),
            "fichier": "f-chat-%s.html" % c.get("id"), "base": "chat.html",
            "fil": ("cat-breadcrumb-name", n)}


def _fiche_chaton(k, p, cats, photo, jour, domaine):
    n = nom(k.get("name"))
    r, _ = robe(k.get("robe"))
    race = race_courte(k.get("breed")) or "Shorthair"
    fem = sexe(k.get("sex")) == "female"
    etat = statut(k.get("status"))
    dit = {"disponible": "disponible", "reserve": "réservée" if fem else "réservé",
           "vendu": "adoptée" if fem else "adopté", "rester": "restée à la maison" if fem else "resté à la maison"}.get(etat, "")
    pere = nom((cats.get(str(p.get("idPapa"))) or {}).get("name") or p.get("externalFatherName") or "")
    mere = nom((cats.get(str(p.get("idMaman"))) or {}).get("name") or "")
    naissance = date_longue(k.get("dateOfBirth")) if k.get("dateOfBirth") else ""

    phrase = ("Une petite " if fem else "Un petit ") + "British " + race
    if r:
        phrase += " " + r.lower()
    if naissance:
        phrase += (", née le " if fem else ", né le ") + naissance
    phrase += "."

    titre = "%s, chaton British %s %s" % (n, race, (r or "").lower())
    titre = re.sub(r"\s+", " ", titre).strip().rstrip(",")
    parents = (" Fils de %s et %s." if not fem else " Fille de %s et %s.") % (pere, mere) if pere and mere else ""
    desc = _coupe("%s%s %s Élevage familial LOOF à Othis (77)." % (
        phrase, parents, ("Chaton " + dit + ".") if dit else ""))

    images = [photo("Chatons", f) for f in (k.get("photos") or []) if f][:6]
    corps = ("<h1>%s</h1><p class=\"lede\">%s</p>" % (esc(n), esc(phrase)) +
             ("<p>%s</p>" % esc(parents.strip()) if parents else "") +
             ("<p>Chaton %s.</p>" % esc(dit) if dit else "") +
             ('<p>Portée : <a href="portee.html?id=%s">%s</a></p>' % (p.get("id"), esc(nom(p.get("name")))) if p.get("id") else "") +
             _photos_fiche(images, "Photo du chaton " + n))
    return {"cible": "kitten-detail", "nom": n, "titre": titre, "desc": desc, "corps": _snap(corps),
            "image": images[0] if images else "", "canon": "%s/chaton.html?id=%s" % (domaine, k.get("id")),
            "fichier": "f-chaton-%s.html" % k.get("id"), "base": "chaton.html",
            "fil": ("kitten-breadcrumb-name", n)}


def _fiche_portee(p, cats, photo, jour, domaine):
    n = nom(p.get("name"))
    pere = nom((cats.get(str(p.get("idPapa"))) or {}).get("name") or p.get("externalFatherName") or "")
    mere = nom((cats.get(str(p.get("idMaman"))) or {}).get("name") or "")
    chatons = [k for k in (p.get("chatons") or []) if k]
    prenoms = ", ".join(nom(k.get("name")) for k in chatons if k.get("name"))
    naissance = date_longue(p.get("dateOfBirth")) if p.get("dateOfBirth") else ""
    dispo = len([k for k in chatons if statut(k.get("status")) == "disponible"])

    titre = "Portée %s — %s chatons British" % (n, len(chatons)) if chatons else "Portée %s" % n
    phrase = "%s chaton%s British%s%s." % (len(chatons), "s" if len(chatons) > 1 else "",
                                           (" de " + pere + " et " + mere) if pere and mere else "",
                                           (", nés le " + naissance) if naissance else "")
    desc = _coupe("%s %s %s" % (phrase, (prenoms + ".") if prenoms else "",
                                ("%d encore disponible%s." % (dispo, "s" if dispo > 1 else "")) if dispo else
                                "Tous ont trouvé leur famille."))

    images = [photo("CatsProfil", (cats.get(str(p.get("idMaman"))) or {}).get("urlProfil"))]
    corps = ("<h1>%s</h1><p class=\"lede\">%s</p>" % (esc(n), esc(phrase)) +
             ("<p>%s</p>" % esc(prenoms) if prenoms else "") +
             "".join('<p><a href="chaton.html?id=%s">%s</a></p>' % (k.get("id"), esc(nom(k.get("name")))) for k in chatons))
    return {"cible": "litter-detail", "nom": n, "titre": titre, "desc": desc, "corps": _snap(corps),
            "image": images[0] if images and images[0] else "", "canon": "%s/portee.html?id=%s" % (domaine, p.get("id")),
            "fichier": "f-portee-%s.html" % p.get("id"), "base": "portee.html",
            "fil": ("litter-breadcrumb-name", n)}


_BALISES = {"h2": "h2", "h3": "h3", "p": "p", "quote": "blockquote", "li": "li", "lead": "p"}


def _corps_article(a):
    blocs = a.get("content")
    if not isinstance(blocs, list):
        return ""
    out, liste = [], False
    for b in blocs:
        if not isinstance(b, dict):
            continue
        t = _BALISES.get(str(b.get("type") or "").lower())
        texte = re.sub(r"\s+", " ", str(b.get("text") or "")).strip()
        if not t or not texte:
            continue
        if t == "li" and not liste:
            out.append("<ul>")
            liste = True
        elif t != "li" and liste:
            out.append("</ul>")
            liste = False
        out.append("<%s>%s</%s>" % (t, esc(texte), t))
    if liste:
        out.append("</ul>")
    return "".join(out)


def _fiche_article(a, photo, domaine):
    titre = propre(a.get("title"))
    desc = _coupe(a.get("excerpt") or "")
    corps = ("<h1>%s</h1>" % esc(titre) +
             ("<p class=\"lede\">%s</p>" % esc(a.get("excerpt")) if a.get("excerpt") else "") +
             _corps_article(a))
    return {"cible": "article-body", "nom": titre, "titre": _coupe(titre, 62), "desc": desc, "corps": _snap(corps),
            "image": a.get("coverImage") or "", "canon": "%s/article.html?slug=%s" % (domaine, a.get("slug")),
            "fichier": "f-article-%s.html" % re.sub(r"[^a-z0-9-]+", "-", str(a.get("slug") or "").lower()),
            "base": "article.html", "fil": ("article-breadcrumb-name", titre)}


def pages_fiches(d, gabarits, domaine):
    """Les pages pré-remplies, prêtes pour build() : une par chat, chaton, portée et article.
    gabarits : {fichier de base: descripteur de page} pour reprendre le corps et les scripts."""
    if not d:
        return []
    photo, jour = Photos(), d["jour"]
    fiches = _fiches()
    cats = {str(c.get("id")): c for c in d["cats"] if c}
    items = []

    for c in d["cats"]:
        if c and c.get("id") is not None:
            items.append(_fiche_chat(c, fiches, photo, jour, domaine))
    for p in _portees_en_ligne(d):
        items.append(_fiche_portee(p, cats, photo, jour, domaine))
        for k in p.get("chatons") or []:
            if k and k.get("id") is not None:
                items.append(_fiche_chaton(k, p, cats, photo, jour, domaine))
    for a in d["posts"]:
        if a and a.get("slug"):
            items.append(_fiche_article(a, photo, domaine))

    out = []
    for it in items:
        base = gabarits.get(it["base"])
        if not base:
            continue
        # Le conteneur vide peut être un <div> ou un <article> selon la page
        corps, rempli = base["body"], False
        for balise in ("div", "article"):
            vide = '<%s id="%s"></%s>' % (balise, it["cible"], balise)
            if vide in corps:
                corps = corps.replace(vide, '<%s id="%s">%s</%s>' % (balise, it["cible"], it["corps"], balise), 1)
                rempli = True
                break
        if not rempli:
            continue
        cle, valeur = it["fil"]
        corps = corps.replace('<span id="%s">' % cle, '<span id="%s">%s' % (cle, esc(valeur)), 1)
        out.append({"file": it["fichier"], "body": corps, "sitemap": False,
                    "nav": base.get("nav", it["base"]), "scripts": base.get("scripts", ""),
                    "title": it["titre"], "desc": it["desc"], "canon": it["canon"], "image": it["image"]})
    return out
