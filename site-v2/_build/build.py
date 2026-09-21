#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur du site Chatterie British Kingdom.

Il assemble un gabarit commun (en-tête, navigation, pied de page) avec le
contenu de chaque page et écrit des fichiers HTML complets et autonomes dans
le dossier parent. Aucune dépendance : python3 _build/build.py

Le site produit fonctionne sans ce script : il n'est là que pour éviter de
recopier l'en-tête et le pied de page dans douze fichiers.
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
    "siret": "84406443600026",
    "acompte": "200 €",
    "ga": "G-J3VHVLP0EY",
}

NAV = [
    ("index.html", "Accueil"),
    ("le-british.html", "Le British"),
    ("nos-chats.html", "Nos chats"),
    ("chatons.html", "Chatons"),
    ("adopter.html", "Adopter"),
    ("blog.html", "Journal"),
    ("contact.html", "Contact"),
]

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Caveat:wght@600;700"
         "&family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..700,0..100,0..1"
         "&family=Quicksand:wght@400;500;600;700&display=swap")


def crest_svg():
    with open(os.path.join(OUT, "img", "crest.svg"), encoding="utf-8") as fh:
        return fh.read().replace('<svg ', '<svg class="crest-inline" ')


def crown_svg():
    with open(os.path.join(OUT, "img", "crown.svg"), encoding="utf-8") as fh:
        return fh.read()


ICON = {
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
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
}


def ico(name, size=24, cls=""):
    return ('<svg viewBox="0 0 24 24" width="%d" height="%d" fill="none" stroke="currentColor" '
            'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"%s>%s</svg>'
            % (size, size, (' class="%s"' % cls) if cls else "", ICON[name]))


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
    "areaServed": "France",
    "priceRange": "€€"
  }
  </script>""" % SITE
    return """<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>%(title)s</title>
  <meta name="description" content="%(desc)s">
  <link rel="canonical" href="%(canon)s">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#fff6f4">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="%(nom)s">
  <meta property="og:title" content="%(title)s">
  <meta property="og:description" content="%(desc)s">
  <meta property="og:url" content="%(canon)s">
  <meta property="og:image" content="%(og)s">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="assets/logo-160.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="%(fonts)s">
  <link rel="stylesheet" href="css/site.css">
%(jsonld)s
  <script async src="https://www.googletagmanager.com/gtag/js?id=%(ga)s"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '%(ga)s', { anonymize_ip: true });
  </script>
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
<p class="demo-banner">Aperçu hors ligne : les chats, chatons et articles affichés sont des exemples, pas les animaux réels de la chatterie.</p>
<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="index.html">
      <span class="brand__mark">%(crown)s</span>
      <span>
        <span class="brand__name">British Kingdom</span>
        <span class="brand__sub">Élevage familial · %(ville)s</span>
      </span>
    </a>
    <div class="nav-panel"><nav class="nav" id="menu" aria-label="Navigation principale">%(links)s</nav></div>
    <div class="header-actions">
      <a class="btn btn--sm btn--copper hide-sm" href="chatons.html">Voir les chatons</a>
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
        "links": links, "crown": crown_svg(), "ville": SITE["ville"],
        "sun": ico("sun", 18, "sun"), "moon": ico("moon", 18, "moon"), "menu": ico("menu", 20),
    }


def footer(scripts=""):
    nav_links = "".join('<li><a href="%s">%s</a></li>' % (h, l) for h, l in NAV[1:])
    return """</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="brand__name">%(nom)s</span>
        <p>Élevage familial de British Shorthair et British Longhair, à %(ville)s en %(region)s. Nos chatons grandissent dans la maison, au milieu de la vie de famille.</p>
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
          <li><a href="adopter.html#sante">Santé et dépistages</a></li>
          <li><a href="adopter.html#faq">Questions fréquentes</a></li>
          <li><a href="mentions-legales.html">Mentions légales</a></li>
          <li><a href="politique-confidentialite.html">Confidentialité</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 %(nom)s</span>
      <span>SIRET %(siret)s</span>
      <span>Chatons inscrits au LOOF</span>
      <span class="spacer"></span>
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
        "tel": SITE["tel"], "tel_lien": SITE["tel_lien"], "email": SITE["email"],
        "adresse": SITE["adresse"], "cp": SITE["cp"], "siret": SITE["siret"], "scripts": scripts,
    }


def page_head_block(eyebrow, title, lede, crumbs):
    """Bandeau de titre des pages intérieures."""
    trail = "".join('<span><a href="%s">%s</a></span>' % (h, l) if h else "<span>%s</span>" % l
                    for h, l in crumbs)
    return """<section class="page-head">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">%s</nav>
    <p class="eyebrow">%s</p>
    <h1>%s</h1>
    %s
  </div>
</section>
""" % (trail, eyebrow, title, ('<p class="lede">%s</p>' % lede) if lede else "")


def write(page):
    html = head(page) + header(page["file"]) + page["body"] + footer(page.get("scripts", ""))
    path = os.path.join(OUT, page["file"])
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(html)
    return path, len(html)


def build(pages):
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for page in pages:
        path, size = write(page)
        total += size
        print("  %-34s %6.1f Ko" % (os.path.basename(path), size / 1024))
    print("  %d pages, %.0f Ko au total" % (len(pages), total / 1024))
