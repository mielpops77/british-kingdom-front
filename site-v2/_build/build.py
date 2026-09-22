#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur du site Chatterie British Kingdom.

Il assemble un gabarit commun (en-tête, navigation, pied de page) avec le
contenu de chaque page et écrit des fichiers HTML complets et autonomes dans
le dossier parent, ainsi que le plan du site (sitemap.xml).
Aucune dépendance : python3 _build/pages.py

Le site produit fonctionne sans ce script : il n'est là que pour éviter de
recopier l'en-tête et le pied de page dans chaque fichier.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)

# --------------------------------------------------------------------------
# Informations de la chatterie (source unique)
# --------------------------------------------------------------------------
SITE = {
    "nom": "Chatterie British Kingdom",
    "domaine": "https://chatterie-british-kingdom.fr",
    "tel": "06 61 65 49 98",
    "tel_lien": "+33661654998",
    "email": "chatterie.british.kingdom@gmail.com",
    "adresse": "12 bis rue des Suisses",
    "cp": "77280",
    "ville": "Othis",
    "region": "Seine-et-Marne",
    # Vérifié le 22/09/2026 dans l'annuaire des entreprises : AMIEL ZEITOUN,
    # Othis, activité 01.49Z, en activité. (84432325300014, présent en
    # commentaire dans l'ancien pied de page Angular, est celui d'une autre
    # entreprise.) Le SIREN doit figurer près de toute offre de chaton.
    "siret": "84406443600026",
    "siren": "844 064 436",
    "acompte": "200 €",
    "ga": "G-J3VHVLP0EY",
    "slogan": "élevés à la maison, avec tendresse",
    "facebook": "https://www.facebook.com/people/Chatterie-British-kingdom/61558762891533/",
    "instagram": "https://www.instagram.com/chatterie_britishkingdom/",
    "tiktok": "https://www.tiktok.com/@elevage_british_kingdom",
    "youtube": "https://www.youtube.com/@chatterie_british_kingdom",
}

NAV = [
    ("index.html", "Accueil"),
    ("le-british.html", "Le British"),
    ("males.html", "Mâles"),
    ("femelles.html", "Femelles"),
    ("chatons.html", "Chatons"),
    ("retraites.html", "Retraités"),
    ("conseils.html", "Conseils"),
    ("liste-attente.html", "Liste d'attente"),
    ("contact.html", "Contact"),
]

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Caveat:wght@600;700"
         "&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1"
         "&family=Quicksand:wght@400;500;600;700&display=swap")

LOGO_ALT = "Logo de la Chatterie British Kingdom : un chat chocolat couronné, en manteau royal"


def read_svg(name, cls=""):
    with open(os.path.join(OUT, "img", name), encoding="utf-8") as fh:
        svg = fh.read().strip()
    return svg.replace("<svg ", '<svg class="%s" ' % cls, 1) if cls else svg


def crest_svg():
    return read_svg("crest.svg", "crest-inline")


def crown_svg():
    return read_svg("crown.svg")


ICON = {
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "close": '<path d="M18 6 6 18M6 6l12 12"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    "moon": '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    "pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "shield": '<path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    "heart": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
    "home": '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 21v-8h6v8"/>',
    "stetho": '<path d="M6 3v6a6 6 0 0 0 12 0V3"/><path d="M6 3H4m14 0h2"/><circle cx="18" cy="16" r="3"/><path d="M12 15v-2"/>',
    "book": '<path d="M4 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4Z"/><path d="M20 4h-3a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20Z"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "star": '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
    "doc": '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    "chip": '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
    "syringe": '<path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a2 2 0 0 1-2.8 0l-1.2-1.2a2 2 0 0 1 0-2.8L15 5"/><path d="m9 11 4 4M5 19l-3 3M14 4l6 6"/>',
    "gift": '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    "target": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    "back": '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    "sparkle": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/>',
    "facebook": '<path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2a1 1 0 0 1 1-1Z"/>',
    "instagram": '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    "youtube": '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor"/>',
    "tiktok": '<path d="M15 4c.6 2.5 2.2 3.8 4.5 4v3c-1.7 0-3.3-.5-4.5-1.5V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3.1a2.5 2.5 0 1 0 1.5 2.3V4Z"/>',
    # Page Le British
    "bubble": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    "smile": '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01"/>',
    "paw": '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
    "scale": '<circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 0 0-1.9 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.93-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z"/>',
    "comb": '<rect x="3" y="6" width="18" height="4.5" rx="1.5"/><path d="M5.5 10.5V17M9 10.5V17M12.5 10.5V17M16 10.5V17M19.5 10.5V17"/>',
    "yarn": '<circle cx="11" cy="11" r="8"/><path d="M4.5 8.5c4-1.5 9-1 13 2M3.6 13c4.6-1.2 9.6.2 12.9 3.8M8.5 3.4c-1.8 4.5-1 10.2 2.3 15.5M17.3 16.3c1.8.8 3.1 2.3 3.7 4.7"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    "sprout": '<path d="M7 20h10M12 20v-7"/><path d="M12 13c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6ZM12 11c0-3.3 2.2-5.8 6.2-5.8 0 3.3-2.2 5.8-6.2 5.8Z"/>',
    "eye": '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
}


def ico(name, size=24, cls=""):
    return ('<svg viewBox="0 0 24 24" width="%d" height="%d" fill="none" stroke="currentColor" '
            'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"%s>%s</svg>'
            % (size, size, (' class="%s"' % cls) if cls else "", ICON[name]))


def medallion(size_cls="", bow=False, alt=LOGO_ALT, eager=False):
    """Le logo de la chatterie dans son médaillon doré, avec ou sans nœud."""
    return ('<span class="medallion%s%s"><img src="assets/logo.webp" alt="%s" width="512" height="512"%s></span>'
            % (" " + size_cls if size_cls else "", " medallion--bow" if bow else "", alt,
               "" if eager else ' loading="lazy"'))


def socials(cls="socials"):
    items = [("facebook", "Facebook"), ("instagram", "Instagram"), ("tiktok", "TikTok"), ("youtube", "YouTube")]
    return '<ul class="%s">%s</ul>' % (cls, "".join(
        '<li><a href="%s" target="_blank" rel="noopener" aria-label="%s (nouvel onglet)">%s</a></li>'
        % (SITE[k], label, ico(k, 18)) for k, label in items))


def head(page):
    """En-tête HTML complet d'une page."""
    title = page["title"]
    desc = page["desc"]
    slug = page["file"]
    canon = SITE["domaine"] + "/" + ("" if slug == "index.html" else slug)
    og_image = SITE["domaine"] + "/assets/og-image.jpg"
    jsonld = ""
    if slug == "index.html":
        jsonld = """
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "%(domaine)s/#chatterie",
    "name": "%(nom)s",
    "description": "Élevage familial de chats British Shorthair et British Longhair à %(ville)s, en %(region)s. Chatons inscrits au LOOF.",
    "url": "%(domaine)s/",
    "logo": "%(domaine)s/assets/logo.png",
    "image": "%(domaine)s/assets/og-image.jpg",
    "telephone": "%(tel_lien)s",
    "email": "%(email)s",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "%(adresse)s",
      "postalCode": "%(cp)s",
      "addressLocality": "%(ville)s",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "areaServed": ["FR", "BE", "CH"],
    "sameAs": ["%(facebook)s", "%(instagram)s", "%(tiktok)s", "%(youtube)s"]
  }
  </script>""" % SITE
    return """<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <script>
    /* Thème et palette mémorisés, posés avant l'affichage : pas de changement de couleur au chargement.
       La palette à l'essai vient de l'adresse (?palette=royal) ou du dernier choix. */
    try {
      var bkRoot = document.documentElement, bkTheme = localStorage.getItem('bk-theme');
      if (bkTheme === 'dark' || bkTheme === 'light') bkRoot.setAttribute('data-theme', bkTheme);
      var bkPalette = new URLSearchParams(location.search).get('palette');
      if (bkPalette !== null) localStorage.setItem('bk-palette', bkPalette); else bkPalette = localStorage.getItem('bk-palette');
      if (bkPalette && /^[a-z]{3,20}$/.test(bkPalette)) bkRoot.setAttribute('data-palette', bkPalette);
    } catch (e) { /* stockage indisponible : palette et thème par défaut */ }
  </script>
  <title>%(title)s</title>
  <meta name="description" content="%(desc)s">
  <link rel="canonical" href="%(canon)s">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#fff8f5" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#22161f" media="(prefers-color-scheme: dark)">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="%(nom)s">
  <meta property="og:title" content="%(title)s">
  <meta property="og:description" content="%(desc)s">
  <meta property="og:url" content="%(canon)s">
  <meta property="og:image" content="%(og)s">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="assets/logo-160.png" type="image/png">
  <link rel="apple-touch-icon" href="assets/logo-160.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="%(fonts)s">
  <link rel="stylesheet" href="css/site.css">
%(jsonld)s
  <!-- Google Analytics ne se charge qu'après « Accepter » dans le bandeau des cookies (js/site.js) -->
  <meta name="bk-ga" content="%(ga)s">
</head>
<body>
""" % {
        "title": title, "desc": desc, "canon": canon, "og": og_image,
        "nom": SITE["nom"], "fonts": FONTS, "ga": SITE["ga"], "jsonld": jsonld,
    }


def header(active):
    links = "".join(
        '<a href="%s"%s>%s</a>' % (href, ' aria-current="page"' if href == active else "", label)
        for href, label in NAV
    )
    return """<a class="skip" href="#main">Aller au contenu</a>
<p class="demo-banner">Aperçu hors ligne : les chats et chatons affichés reprennent le site officiel du 22 septembre 2026 et ont pu changer depuis.</p>
<header class="site-header">
  <div class="wrap wrap--header site-header__inner">
    <a class="brand" href="index.html" aria-label="Chatterie British Kingdom, accueil">
      %(medallion)s
      <span class="brand__text">
        <span class="brand__name">British Kingdom</span>
        <span class="brand__sub">Shorthair &amp; Longhair</span>
      </span>
    </a>
    <div class="nav-panel"><nav class="nav" id="menu" aria-label="Navigation principale">%(links)s
      <div class="nav__extra">
        <a class="btn btn--primary" href="chatons.html">Voir les chatons</a>
        <a class="nav__tel" href="tel:%(tel_lien)s">%(phone)s %(tel)s</a>
      </div>
    </nav></div>
    <div class="header-actions">
      <a class="btn btn--sm btn--primary hide-sm" href="chatons.html">Voir les chatons</a>
      <button class="icon-btn theme-btn" type="button" aria-label="Changer de thème clair ou sombre">
        %(sun)s%(moon)s
      </button>
      <button class="icon-btn burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu">%(menu)s</button>
    </div>
  </div>
</header>
<div class="nav-scrim"></div>
<main id="main">
""" % {
        "links": links, "medallion": medallion("medallion--sm", eager=True, alt=""),
        "sun": ico("sun", 18, "sun"), "moon": ico("moon", 18, "moon"), "menu": ico("menu", 20, "i-menu") + ico("close", 20, "i-close"),
        "tel": SITE["tel"], "tel_lien": SITE["tel_lien"], "phone": ico("phone", 17),
    }


def footer(scripts=""):
    nav_links = "".join('<li><a href="%s">%s</a></li>' % (h, l) for h, l in NAV[1:])
    return """</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      %(medallion)s
      <div>
        <p class="footer-name">%(nom)s</p>
        <p class="footer-slogan">%(slogan)s</p>
      </div>
      %(socials)s
    </div>
    <div class="footer-grid">
      <div class="footer-brand">
        <h4>La chatterie</h4>
        <p>Élevage familial de British Shorthair et British Longhair à %(ville)s, en %(region)s, à vingt minutes
          de l'aéroport Paris-Charles de Gaulle. Chatons inscrits au LOOF, nés et élevés à la maison.</p>
      </div>
      <div>
        <h4>Le site</h4>
        <ul>%(nav)s</ul>
      </div>
      <div>
        <h4>Nous joindre</h4>
        <ul>
          <li><a href="tel:%(tel_lien)s">%(tel)s</a></li>
          <li><a href="mailto:%(email)s">%(email)s</a></li>
          <li>%(adresse)s<br>%(cp)s %(ville)s</li>
          <li>Visites sur rendez-vous</li>
        </ul>
      </div>
      <div>
        <h4>Informations</h4>
        <ul>
          <li><a href="liste-attente.html#sante">Santé et dépistages</a></li>
          <li><a href="liste-attente.html#faq">Questions fréquentes</a></li>
          <li><a href="mentions-legales.html">Mentions légales</a></li>
          <li><a href="politique-confidentialite.html">Confidentialité</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 %(nom)s</span>
      <span>SIREN %(siren)s · SIRET %(siret)s</span>
      <span>Chatons inscrits au LOOF</span>
      <span class="spacer"></span>
      <button type="button" class="link-btn" data-consent-open>Cookies</button>
      <span>Site créé par <a href="https://www.eleveur-connect.fr/" target="_blank" rel="noopener">Eleveur-Connect</a></span>
    </div>
  </div>
</footer>
<script src="js/demo-data.js"></script>
<script src="js/api.js"></script>
<script src="js/site.js"></script>
<script src="js/pages.js"></script>
%(scripts)s
</body>
</html>
""" % {
        "nom": SITE["nom"], "ville": SITE["ville"], "region": SITE["region"], "nav": nav_links,
        "tel": SITE["tel"], "tel_lien": SITE["tel_lien"], "email": SITE["email"], "slogan": SITE["slogan"],
        "adresse": SITE["adresse"], "cp": SITE["cp"], "siret": SITE["siret"], "siren": SITE["siren"], "scripts": scripts,
        "medallion": medallion("medallion--md", alt=""), "socials": socials("socials"),
    }


def page_head_block(eyebrow, title, lede, crumbs, extra=""):
    """Bandeau de titre des pages intérieures."""
    trail = "".join('<span><a href="%s">%s</a></span>' % (h, l) if h else "<span>%s</span>" % l
                    for h, l in crumbs)
    return """<section class="page-head">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">%s</nav>
    <p class="eyebrow">%s</p>
    <h1>%s</h1>
    %s%s
  </div>
</section>
""" % (trail, eyebrow, title, ('<p class="lede">%s</p>' % lede) if lede else "", extra)


_TAG = re.compile(r"(<[^>]+>)")


def typo_fr(html):
    """Typographie française : une espace insécable avant ? ! : ; » et après « (texte seulement,
    jamais dans les balises ni les scripts), pour qu'un signe ne parte pas seul à la ligne."""
    out, skip = [], False
    for part in _TAG.split(html):
        if part.startswith("<"):
            low = part[:9].lower()
            if low.startswith("<script") or low.startswith("<style"):
                skip = True
            elif low.startswith("</script") or low.startswith("</style"):
                skip = False
        elif not skip and part.strip():
            part = re.sub(r" ([?!:;»])", r"&nbsp;\1", part)
            part = part.replace("« ", "«&nbsp;")
        out.append(part)
    return "".join(out)


def write(page):
    html = typo_fr(head(page) + header(page.get("nav", page["file"])) + page["body"] + footer(page.get("scripts", "")))
    path = os.path.join(OUT, page["file"])
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(html)
    return path, len(html)


def sitemap(pages, lastmod):
    """Plan du site : toutes les pages publiques, sauf celles qui ont besoin d'un identifiant."""
    urls = []
    for p in pages:
        if p.get("sitemap") is False:
            continue
        loc = SITE["domaine"] + "/" + ("" if p["file"] == "index.html" else p["file"])
        urls.append("  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>%s</changefreq>\n"
                    "    <priority>%s</priority>\n  </url>" % (loc, lastmod, p.get("freq", "monthly"), p.get("prio", "0.6")))
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(urls) + "\n</urlset>\n")
    with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(xml)


def build(pages, lastmod):
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for page in pages:
        path, size = write(page)
        total += size
        print("  %-34s %6.1f Ko" % (os.path.basename(path), size / 1024))
    sitemap(pages, lastmod)
    print("  %d pages, %.0f Ko au total, sitemap.xml à jour" % (len(pages), total / 1024))
