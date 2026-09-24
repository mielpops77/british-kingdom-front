#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Contenu des pages du site Chatterie British Kingdom.
Lancer depuis site-v2 : python3 _build/pages.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import SITE, ico, page_head_block, build, crown_svg, medallion  # noqa: E402

T = SITE["tel"]
TL = SITE["tel_lien"]
MAIL = SITE["email"]
MISE_A_JOUR = "2026-09-22"

# ==========================================================================
# ACCUEIL
# ==========================================================================
ACCUEIL = """
<section class="hero">
  <div class="wrap hero__grid">
    <div class="hero__text">
      %(logo)s
      <p class="eyebrow">Élevage familial à %(ville)s, en %(region)s</p>
      <h1>Chatterie <span class="nowrap">British Kingdom</span></h1>
      <p class="hero__script">%(slogan)s</p>
      <p class="hero__lede">British Shorthair et British Longhair inscrits au LOOF. Nos chatons naissent et
        grandissent chez nous, au milieu de la vie de famille, et rejoignent la vôtre vers douze semaines.</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="chatons.html" id="hero-kittens-btn">Voir les chatons disponibles</a>
        <a class="btn btn--ghost" href="liste-attente.html">Rejoindre la liste d'attente</a>
      </div>
    </div>
    <div class="hero__media">
      <figure class="hero__photo">
        <img src="assets/photos/accueil-zara.webp" width="1050" height="1400" fetchpriority="high"
             alt="Zara, femelle British Shorthair chocolat aux yeux vairons, assise sur une peau de mouton">
      </figure>
      <span class="hero__round" aria-hidden="true"><img src="assets/photos/accueil-chaton-coucou.webp" alt="" width="480" height="480"></span>
      <p class="hero__label"><span class="hero__label-crown">%(crown)s</span><span><b>Chatterie familiale</b>%(ville)s, %(region)s</span></p>
    </div>
  </div>
</section>

<section class="assurance" aria-labelledby="assurance-titre">
  <div class="wrap">
    <h2 class="visually-hidden" id="assurance-titre">Nos engagements</h2>
    <ul class="assurance__list">
      <li class="reveal">
        <span class="assurance__icon">%(home)s</span>
        <h3>Élevés à la maison</h3>
        <p>Nos chatons naissent et grandissent en famille : ils connaissent déjà la vie d'une maison le jour du départ.</p>
      </li>
      <li class="reveal" data-delay="1">
        <span class="assurance__icon">%(doc)s</span>
        <h3>Inscrits au LOOF</h3>
        <p>Certificat LOOF, puce électronique, premières vaccinations et carnet de santé complet.</p>
      </li>
      <li class="reveal" data-delay="2">
        <span class="assurance__icon">%(heart)s</span>
        <h3>Suivis après l'adoption</h3>
        <p>Un suivi et des conseils bien après le départ : une question, un doute, nous restons disponibles.</p>
      </li>
      <li class="reveal" data-delay="3">
        <span class="assurance__icon">%(pin)s</span>
        <h3>Jusqu'à vous</h3>
        <p>Remise à Othis, à la gare de Roissy ou de Saint-Mard, livraison en France, en Suisse et en Belgique.</p>
      </li>
    </ul>
  </div>
</section>

<section class="panel panel--blush scallop-top">
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Nos chatons</p>
      <h2>Les portées du moment</h2>
      <p class="lede" id="home-kitten-count">Chargement des portées…</p>
    </div>
    <div id="home-litters"></div>
    <div id="home-kittens"></div>
    <div class="actions center">
      <a class="btn btn--primary" href="chatons.html">Voir toutes les portées</a>
      <a class="btn btn--ghost" href="liste-attente.html">Rejoindre la liste d'attente</a>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="split split--media-first">
      <div class="split__media reveal">
        <figure class="frame-photo">
          <img src="assets/photos/bienvenue-chocolats.webp" width="960" height="1200" loading="lazy"
               alt="Deux de nos British Shorthair chocolat, côte à côte sur une peau de mouton">
          <span class="frame-photo__badge" aria-hidden="true">%(crown)s</span>
        </figure>
      </div>
      <div class="reveal" data-delay="1">
        <p class="eyebrow">La chatterie</p>
        <p class="script">à %(ville)s, en %(region)s</p>
        <h2>Bienvenue chez nous</h2>
        <p>Nous sommes une chatterie familiale installée à %(ville)s, en %(region)s, à vingt minutes de
          l'aéroport Paris-Charles de Gaulle. Nos British Shorthair et Longhair, au caractère doux et affectueux,
          sont inscrits au LOOF et choyés en famille.</p>
        <p>Le British est un compagnon tout en rondeur, paisible et affectueux. Son pelage est somptueux, et sa
          personnalité en fait un partenaire idéal pour une vie de famille.</p>
        <p class="signature">Toute la famille British Kingdom</p>
        <ol class="mini-steps">
          <li><b>On échange</b> par téléphone ou par mail, sans engagement.</li>
          <li><b>Vous venez les voir</b>, sur rendez-vous, chez nous.</li>
          <li><b>Il vous rejoint</b> vers douze semaines, avec son certificat LOOF et son carnet de santé.</li>
        </ol>
        <p><a class="link-arrow" href="le-british.html">Tout savoir sur le British</a></p>
      </div>
    </div>
  </div>
</section>

<section class="tight">
  <div class="wrap">
    <div class="grid grid-3 tiles">
      <a class="tile reveal" href="males.html">
        <span class="tile__media"><img src="assets/photos/carte-males.webp" width="752" height="1000" loading="lazy" alt="Wilson, British Shorthair bleu aux yeux orange"></span>
        <span class="tile__text"><span class="tile__title">Nos mâles</span>
          <span class="tile__desc">Le British Shorthair est un compagnon tout en rondeur, paisible et affectueux.</span>
          <span class="tile__more">Découvrir nos mâles</span></span>
      </a>
      <a class="tile reveal" data-delay="1" href="chatons.html">
        <span class="tile__media"><img src="assets/photos/carte-chatons.webp" width="1200" height="900" loading="lazy" alt="Quatre chatons blottis dans un panier"></span>
        <span class="tile__text"><span class="tile__title">Nos chatons</span>
          <span class="tile__desc">Dès son plus jeune âge, le British incarne une douceur et une affection enveloppantes.</span>
          <span class="tile__more">Voir les chatons</span></span>
      </a>
      <a class="tile reveal" data-delay="2" href="femelles.html">
        <span class="tile__media"><img src="assets/photos/carte-femelles.webp" width="750" height="1000" loading="lazy" alt="Zara, British Shorthair chocolat aux yeux vairons"></span>
        <span class="tile__text"><span class="tile__title">Nos femelles</span>
          <span class="tile__desc">Avec son tempérament équilibré et paisible, le British Shorthair est le compagnon parfait.</span>
          <span class="tile__more">Découvrir nos femelles</span></span>
      </a>
    </div>
  </div>
</section>

<section class="panel panel--champagne">
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Ils sont nés chez nous</p>
      <h2>Des nouvelles de nos anciens bébés</h2>
      <p class="lede">Nos chatons grandissent, et leurs familles nous donnent de leurs nouvelles. Rien ne nous fait plus plaisir.</p>
    </div>
    <ul class="polaroids">
      <li class="polaroid reveal">
        <img src="assets/photos/ancien-aston.webp" width="720" height="900" loading="lazy" alt="Aston, British Shorthair blanc aux yeux bleus, adulte">
        <p><b>Aston</b>Né chez nous en septembre 2024 sous le nom de Vulcain. Sa famille nous envoie de ses nouvelles chaque année.</p>
      </li>
      <li class="polaroid reveal" data-delay="1">
        <img src="assets/photos/ancien-aragog.webp" width="675" height="900" loading="lazy" alt="Aragog, British Shorthair chocolat, devant son gâteau d'anniversaire">
        <p><b>Aragog</b>Son premier anniversaire, fêté dans sa famille avec un gâteau fait maison.</p>
      </li>
      <li class="polaroid reveal" data-delay="2">
        <img src="assets/photos/ancien-arlequin.webp" width="675" height="900" loading="lazy" alt="Arlequin, chaton British Shorthair aux yeux bleus">
        <p><b>Arlequin</b>Devenu Snow dans sa famille, il est passé sur TF1 en juin 2026.</p>
      </li>
      <li class="polaroid reveal" data-delay="3">
        <img src="assets/photos/ancien-akyo.webp" width="675" height="900" loading="lazy" alt="Akyo, chaton British Shorthair blanc qui tire la langue">
        <p><b>Akyo</b>Né ici, il est revenu passer quelques jours à la maison un an plus tard.</p>
      </li>
    </ul>
  </div>
</section>

<section id="temoignages-section" hidden>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Livre d'or</p>
      <h2>Ils nous ont fait confiance</h2>
    </div>
    <div id="testimonials"></div>
  </div>
</section>

<section id="galerie">
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">En images</p>
      <h2>La vie à la chatterie</h2>
      <p class="lede">Nos chats et nos chatons au quotidien. Touchez une photo pour l'agrandir, puis zoomez.</p>
    </div>
    <div class="mosaic" id="home-gallery">
      <div class="mosaic__video reveal">
        <video data-autoplay muted loop playsinline preload="none" poster="assets/hero-poster.webp"
               aria-label="Vidéo : des chatons de la chatterie jouent au salon, puis explorent le jardin">
          <source src="assets/hero.mp4" type="video/mp4">
        </video>
        <span class="mosaic__label">Une chasse au trésor pas comme les autres</span>
      </div>
    </div>
    <div class="actions center"><button class="btn btn--ghost" type="button" id="home-gallery-more" hidden>Voir plus de photos</button></div>
  </div>
</section>

<section class="panel panel--lilac">
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Bien s'informer</p>
      <h2>Conseils et actualités</h2>
      <p class="lede">Nos articles pour bien préparer l'arrivée de votre futur compagnon.</p>
    </div>
    <div id="home-posts"></div>
    <div class="actions center"><a class="btn btn--ghost" href="conseils.html">Tous nos conseils</a></div>
  </div>
</section>

<section class="cta-band">
  <div class="wrap wrap--narrow center">
    %(logo_cta)s
    <h2>Une question, un projet d'adoption ?</h2>
    <p class="lede">Écrivez-nous ou appelez-nous : nous serons ravis de faire connaissance et de vous parler de nos chatons.</p>
    <div class="actions center">
      <a class="btn btn--primary" href="contact.html">Nous écrire</a>
      <a class="btn btn--ghost" href="tel:%(tel_lien)s">%(phone)s %(tel)s</a>
    </div>
    <p class="small">Visites sur rendez-vous. Nous ne répondons pas aux appels masqués.</p>
  </div>
</section>
""" % {
    "logo": medallion("medallion--xl hero__logo", bow=True, eager=True),
    "logo_cta": medallion("medallion--md", alt=""),
    "crown": crown_svg(), "ville": SITE["ville"], "region": SITE["region"], "slogan": SITE["slogan"],
    "home": ico("home", 26), "doc": ico("doc", 26), "heart": ico("heart", 26), "pin": ico("pin", 26),
    "tel": T, "tel_lien": TL, "phone": ico("phone", 16),
}

# ==========================================================================
# LE BRITISH
# ==========================================================================
LE_BRITISH = """
<section class="bh-hero">
  <div class="wrap bh-hero__grid">
    <div class="bh-hero__text">
      <nav class="breadcrumb" aria-label="Fil d'Ariane"><span><a href="index.html">Accueil</a></span><span>Le British</span></nav>
      <p class="eyebrow">La race</p>
      <h1>Le British, tout en rondeur <span class="bh-hero__script">et en douceur</span></h1>
      <p class="lede">Une bouille ronde, une fourrure de peluche et un cœur en or : c'est le chat qui a
        conquis notre maison. Voici comment il est vraiment, pour savoir s'il est fait pour la vôtre.</p>
      <ul class="bh-stickers" aria-label="Le British en quatre mots">
        <li>%(heart)s Câlin à sa façon</li>
        <li>%(moon)s Calme et posé</li>
        <li>%(bubble)s Tout en discrétion</li>
        <li>%(home)s Casanier</li>
      </ul>
    </div>
    <div class="bh-hero__art">
      <figure class="bh-polaroid">
        <img src="assets/photos/british-wilson-langue.webp" width="900" height="1125" fetchpriority="high"
             alt="Wilson, notre British Shorthair bleu aux yeux orange, assis, le bout de la langue sorti">
        <figcaption>Wilson, pris sur le fait</figcaption>
      </figure>
      <figure class="bh-bubble">
        <img src="assets/photos/british-chaton-langue.webp" width="420" height="420" loading="lazy"
             alt="Un de nos chatons, tout blanc aux yeux bleus, qui tire la langue">
      </figure>
      <span class="bh-hero__tag">%(crown)s Shorthair &amp; Longhair</span>
    </div>
  </div>
</section>

<section class="tight bh-id-section">
  <div class="wrap">
    <div class="bh-idcard reveal">
      <p class="bh-idcard__title">Sa carte d'identité</p>
      <dl class="bh-idcard__list">
        <div><dt>%(pin)s Origine</dt><dd>Grande-Bretagne</dd></div>
        <div><dt>%(scale)s Poids adulte</dt><dd>4 à 8 kg environ</dd></div>
        <div><dt>%(comb)s Fourrure</dt><dd>courte ou mi-longue, très dense</dd></div>
        <div><dt>%(heart)s Caractère</dt><dd>calme, doux, fidèle</dd></div>
        <div><dt>%(sparkle)s Entretien</dt><dd>un brossage par semaine</dd></div>
      </dl>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Son caractère</p>
      <h2>Un vrai nounours, avec sa petite personnalité</h2>
      <p class="lede">Posé, doux et fidèle, le British aime la vie de famille… à son rythme.</p>
    </div>
    <div class="bh-traits">
      <article class="bh-trait reveal">
        <span class="bh-trait__icon">%(heart)s</span>
        <h3>Câlin, à sa façon</h3>
        <p>Il adore être près de vous, un peu moins dans vos bras. Il s'installe à côté de vous sur le
          canapé et vous suit de pièce en pièce. Beaucoup de British n'aiment pas trop être portés : on respecte.</p>
      </article>
      <article class="bh-trait reveal" data-delay="1">
        <span class="bh-trait__icon">%(moon)s</span>
        <h3>Calme et posé</h3>
        <p>Il joue avec entrain, par petites séances, puis s'offre une longue sieste. Pas de course folle
          dans les rideaux : c'est un chat zen.</p>
      </article>
      <article class="bh-trait reveal" data-delay="2">
        <span class="bh-trait__icon">%(bubble)s</span>
        <h3>Tout en discrétion</h3>
        <p>Il miaule peu, et rarement fort. Revers de la médaille : un British qui a mal ou qui s'ennuie
          ne le dira pas. C'est à vous d'ouvrir l'œil.</p>
      </article>
      <article class="bh-trait reveal">
        <span class="bh-trait__icon">%(smile)s</span>
        <h3>Patient avec les enfants</h3>
        <p>Il ne sort pratiquement jamais les griffes : quand il en a assez, il s'en va. La seule règle à
          apprendre aux enfants : le laisser partir, sans jamais le poursuivre.</p>
      </article>
      <article class="bh-trait reveal" data-delay="1">
        <span class="bh-trait__icon">%(paw)s</span>
        <h3>Bon camarade</h3>
        <p>Peu bagarreur, il s'entend avec les chiens comme avec les chats. Comptez une à trois semaines de
          présentations en douceur : c'est souvent l'animal déjà là qui a besoin de temps.</p>
      </article>
      <article class="bh-trait reveal" data-delay="2">
        <span class="bh-trait__icon">%(home)s</span>
        <h3>Casanier</h3>
        <p>Il est très heureux en appartement : il grimpe peu et ne cherche pas à sortir. Offrez-lui un
          poste d'observation en hauteur et un vrai moment de jeu chaque jour.</p>
      </article>
    </div>
  </div>
</section>

<section class="panel panel--blush scallop-top">
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Son physique</p>
      <h2>Tout en rondeur, des oreilles jusqu'aux pattes</h2>
      <p class="lede">Le British se reconnaît au premier coup d'œil. Petit tour du propriétaire, avec Vesunna.</p>
    </div>
    <div class="bh-anatomy">
      <ul class="bh-anatomy__col">
        <li class="reveal"><h3>Une tête bien ronde</h3><p>large, avec de bonnes joues, encore plus marquées chez les mâles</p></li>
        <li class="reveal" data-delay="1"><h3>De petites oreilles</h3><p>arrondies au bout et bien écartées</p></li>
        <li class="reveal" data-delay="2"><h3>De grands yeux ronds</h3><p>cuivre ou orange le plus souvent, verts chez les silver et les golden, bleus chez les colourpoint</p></li>
      </ul>
      <figure class="bh-anatomy__photo reveal">
        <div class="arch arch--wide"><img src="assets/photos/british-silhouette-vesunna.webp" width="800" height="1000" loading="lazy"
             alt="Vesunna, British Shorthair black golden shaded aux yeux verts, assise bien droite sur un coussin"></div>
        <figcaption>Vesunna, black golden shaded</figcaption>
      </figure>
      <ul class="bh-anatomy__col bh-anatomy__col--right">
        <li class="reveal"><h3>Un nez court</h3><p>large et droit</p></li>
        <li class="reveal" data-delay="1"><h3>Un corps compact</h3><p>trapu et musclé, posé sur des pattes courtes et fortes</p></li>
        <li class="reveal" data-delay="2"><h3>Une fourrure de peluche</h3><p>dense et ferme, elle se relève sous la main : c'est la signature de la race</p></li>
      </ul>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Deux fourrures</p>
      <h2>Shorthair ou Longhair ? <span class="bh-h2-script">le même cœur, deux manteaux</span></h2>
    </div>
    <div class="bh-coats">
      <article class="bh-coat reveal">
        <div class="arch arch--wide bh-coat__photo"><img src="assets/photos/british-shorthair-willy-wonka.webp" width="760" height="950" loading="lazy"
             alt="Willy Wonka, British Shorthair chocolat aux yeux orange, assis sur un coussin blanc"></div>
        <div class="bh-coat__body">
          <div class="bh-coat__head"><p class="bh-coat__kind">Poil court</p><h3>British Shorthair</h3></div>
          <ul class="pawed">
            <li>Une fourrure courte, dense et pleine, comme une peluche.</li>
            <li>Un bon brossage par semaine, deux ou trois pendant la mue.</li>
          </ul>
          <p class="bh-coat__who">Ici, Willy Wonka, chocolat aux yeux orange</p>
        </div>
      </article>
      <p class="bh-coats__equal" aria-hidden="true"><span>%(heart)s</span>même caractère</p>
      <article class="bh-coat reveal" data-delay="1">
        <div class="arch arch--wide bh-coat__photo"><img src="assets/photos/british-longhair-voltaire.webp" width="760" height="950" loading="lazy"
             alt="Voltaire, British Longhair black silver shaded aux yeux verts, à la collerette toute blanche"></div>
        <div class="bh-coat__body">
          <div class="bh-coat__head"><p class="bh-coat__kind">Poil mi-long</p><h3>British Longhair</h3></div>
          <ul class="pawed">
            <li>Une fourrure mi-longue et soyeuse, avec une jolie collerette et des culottes.</li>
            <li>Un brossage tous les deux jours, surtout derrière les oreilles et sur les culottes, pour éviter les nœuds.</li>
          </ul>
          <p class="bh-coat__who">Ici, Voltaire, black silver shaded aux yeux verts</p>
        </div>
      </article>
    </div>
    <p class="bh-coats__note reveal">Le Longhair, c'est un British qui porte le gène du poil long : même silhouette,
      même caractère, seule la fourrure change. Deux Shorthair porteurs de ce gène peuvent d'ailleurs donner
      naissance, dans la même portée, à des chatons à poil court et à poil long.</p>
  </div>
</section>

<section class="panel panel--lilac scallop-top">
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Nuancier</p>
      <h2>Les couleurs de la maison</h2>
      <p class="lede">Le British existe dans des dizaines de robes. Voici celles de nos chats, avec leur code EMS,
        l'écriture officielle des pedigrees.</p>
    </div>
    <ul class="bh-robes">
      <li class="bh-robe reveal">
        <span class="bh-robe__photo"><img src="assets/photos/robe-bleu-wilson.webp" width="440" height="440" loading="lazy" alt="Wilson, British Shorthair bleu"></span>
        <b class="bh-robe__name">Bleu</b><span class="bh-robe__ems">BRI a</span><span class="bh-robe__who">Wilson</span>
      </li>
      <li class="bh-robe reveal" data-delay="1">
        <span class="bh-robe__photo"><img src="assets/photos/robe-chocolat-willy-wonka.webp" width="440" height="440" loading="lazy" alt="Willy Wonka, British Shorthair chocolat"></span>
        <b class="bh-robe__name">Chocolat</b><span class="bh-robe__ems">BRI b</span><span class="bh-robe__who">Willy Wonka</span>
      </li>
      <li class="bh-robe reveal" data-delay="2">
        <span class="bh-robe__photo"><img src="assets/photos/robe-lilas-luna.webp" width="440" height="440" loading="lazy" alt="Luna, British Shorthair lilas"></span>
        <b class="bh-robe__name">Lilas</b><span class="bh-robe__ems">BRI c</span><span class="bh-robe__who">Luna</span>
      </li>
      <li class="bh-robe reveal">
        <span class="bh-robe__photo"><img src="assets/photos/robe-silver-tina.webp" width="440" height="440" loading="lazy" alt="Tina, British Shorthair black silver shaded"></span>
        <b class="bh-robe__name">Black silver shaded</b><span class="bh-robe__ems">BRI ns 11</span><span class="bh-robe__who">Tina</span>
      </li>
      <li class="bh-robe reveal" data-delay="1">
        <span class="bh-robe__photo"><img src="assets/photos/robe-golden-vesunna.webp" width="440" height="440" loading="lazy" alt="Vesunna, British Shorthair black golden shaded"></span>
        <b class="bh-robe__name">Black golden shaded</b><span class="bh-robe__ems">BRI ny 11</span><span class="bh-robe__who">Vesunna</span>
      </li>
      <li class="bh-robe reveal" data-delay="2">
        <span class="bh-robe__photo"><img src="assets/photos/robe-silver-longhair-voltaire.webp" width="440" height="440" loading="lazy" alt="Voltaire, British Longhair black silver shaded"></span>
        <b class="bh-robe__name">Black silver shaded</b><span class="bh-robe__ems">BLH ns 11</span><span class="bh-robe__who">Voltaire, poil long</span>
      </li>
    </ul>

    <div class="bh-ems reveal">
      <h3>Comment lire un code EMS ?</h3>
      <ol class="bh-ems__parts">
        <li><b>BRI</b><span>la race : British Shorthair, ou BLH pour le Longhair</span></li>
        <li><b>n</b><span>la couleur : noir (a bleu, b chocolat, c lilas…)</span></li>
        <li><b>s</b><span>silver, ou y pour golden</span></li>
        <li><b>11</b><span>le motif : shaded</span></li>
      </ol>
      <details class="faq bh-ems__more">
        <summary>Les autres robes courantes et leur code</summary>
        <div class="faq__body">
          <dl class="facts bh-ems__facts">
            <div><dt>Noir</dt><dd>BRI n</dd></div>
            <div><dt>Crème</dt><dd>BRI e</dd></div>
            <div><dt>Roux</dt><dd>BRI d</dd></div>
            <div><dt>Cinnamon</dt><dd>BRI o</dd></div>
            <div><dt>Fawn</dt><dd>BRI p</dd></div>
            <div><dt>Écaille de tortue</dt><dd>BRI f</dd></div>
            <div><dt>Colourpoint bleu</dt><dd>BRI a 33</dd></div>
            <div><dt>Bicolore bleu et blanc</dt><dd>BRI a 03</dd></div>
          </dl>
        </div>
      </details>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Le saviez-vous ?</p>
      <h2>Petits secrets de British</h2>
    </div>
    <div class="bh-notes reveal">
      <article class="bh-note">
        <span class="bh-note__pic"><img src="assets/photos/chaton-yeux-bleus.webp" width="420" height="420" loading="lazy" alt="Un de nos chatons chocolat, aux yeux encore tout bleus"></span>
        <h3>Des yeux bleus… pour commencer</h3>
        <p>Tous les chatons naissent les yeux bleus, comme ce petit chocolat. Leur vraie couleur apparaît vers
          trois ou quatre mois, puis s'intensifie encore pendant de longs mois.</p>
      </article>
      <article class="bh-note">
        <span class="bh-note__icon">%(star)s</span>
        <h3>Une star depuis 1871</h3>
        <p>C'est l'une des plus anciennes races anglaises : il faisait déjà partie des vedettes du tout premier
          grand concours félin, au Crystal Palace de Londres, en 1871.</p>
      </article>
      <article class="bh-note">
        <span class="bh-note__icon">%(smile)s</span>
        <h3>Un sourire célèbre</h3>
        <p>On dit souvent que le Chat du Cheshire, le chat au grand sourire d'<em>Alice au pays des
          merveilles</em>, a été inspiré par un British.</p>
      </article>
      <article class="bh-note">
        <span class="bh-note__icon">%(sprout)s</span>
        <h3>Il prend son temps pour grandir</h3>
        <p>Il lui faut environ trois ans pour atteindre sa carrure d'adulte. Les mâles en profitent pour se
          faire de belles bajoues.</p>
      </article>
    </div>
  </div>
</section>

<section class="panel panel--champagne scallop-top">
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Au quotidien</p>
      <h2>Ce qu'il lui faut pour être heureux</h2>
    </div>
    <div class="bh-traits bh-traits--4">
      <article class="bh-trait reveal">
        <span class="bh-trait__icon">%(scale)s</span>
        <h3>Surveiller sa ligne</h3>
        <p>C'est son petit point faible : gourmand et peu sportif, il grossit vite. À l'âge adulte, pas de
          gamelle à volonté, des jeux qui le font courir et une pesée de temps en temps.</p>
      </article>
      <article class="bh-trait reveal" data-delay="1">
        <span class="bh-trait__icon">%(comb)s</span>
        <h3>Un brossage régulier</h3>
        <p>Avec une brosse ou un peigne qui atteint le sous-poil (un gant ne suffit pas) : une fois par
          semaine pour un Shorthair, tous les deux jours pour un Longhair.</p>
      </article>
      <article class="bh-trait reveal" data-delay="2">
        <span class="bh-trait__icon">%(yarn)s</span>
        <h3>Du jeu et de la hauteur</h3>
        <p>Un vrai moment de jeu chaque jour, et un arbre à chat pour observer la maison d'en haut. Un balcon ?
          Un filet le rend sûr.</p>
      </article>
      <article class="bh-trait reveal" data-delay="3">
        <span class="bh-trait__icon">%(users)s</span>
        <h3>De la compagnie</h3>
        <p>Si la maison est vide toute la journée, pensez à en adopter deux : ils jouent ensemble, se calment
          ensemble, et pour vous le travail est à peine doublé.</p>
      </article>
    </div>
  </div>
</section>

<section class="tight">
  <div class="wrap wrap--narrow">
    <div class="callout bh-allergy reveal">
      <p><strong>Un mot sur les allergies.</strong> Aucun chat n'est hypoallergénique, le British pas plus qu'un
        autre. L'allergie vient d'une protéine présente dans la salive et les squames, pas de la longueur du
        poil : un Shorthair n'est donc pas moins allergisant qu'un Longhair. Si quelqu'un chez vous est
        allergique, parlez-en à un allergologue avant de vous engager, puis venez rencontrer nos chats.</p>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="wrap wrap--narrow center">
    %(logo_cta)s
    <h2>Vous aussi, vous avez craqué ?</h2>
    <p class="lede">Faites connaissance avec nos reproducteurs, ou découvrez les chatons du moment.</p>
    <div class="actions center">
      <a class="btn btn--primary" href="chatons.html">Voir les chatons</a>
      <a class="btn btn--ghost" href="males.html">Nos mâles</a>
      <a class="btn btn--ghost" href="femelles.html">Nos femelles</a>
    </div>
  </div>
</section>
""" % {
    "heart": ico("heart", 18), "moon": ico("moon", 18), "bubble": ico("bubble", 18), "home": ico("home", 18),
    "pin": ico("pin", 18), "scale": ico("scale", 18), "comb": ico("comb", 18), "sparkle": ico("sparkle", 18),
    "smile": ico("smile", 18), "paw": ico("paw", 18), "star": ico("star", 18), "sprout": ico("sprout", 18),
    "yarn": ico("yarn", 18), "users": ico("users", 18),
    "crown": crown_svg(), "logo_cta": medallion("medallion--md", alt=""),
}

# ==========================================================================
# NOS MÂLES / NOS FEMELLES
# ==========================================================================
def sex_page(male):
    t = {
        "titre": "Nos mâles" if male else "Nos femelles",
        "script": "les rois du royaume" if male else "les reines du royaume",
        "lede": ("Les papas de nos chatons : une stature imposante, un flegme tout britannique… et un cœur de nounours. "
                 "Cliquez sur l'un d'eux pour découvrir sa fiche, ses photos et ses portées."
                 if male else
                 "Les mamans de nos chatons : toute la douceur et la gentillesse du British, et des regards à faire fondre. "
                 "Cliquez sur l'une d'elles pour découvrir sa fiche, ses photos et ses portées."),
        "liste": "Tous nos mâles" if male else "Toutes nos femelles",
        "portees_h2": "Papas en ce moment" if male else "Mamans en ce moment",
        "portees_script": "et fiers de l'être" if male else "et aux petits soins",
        "portees_lede": ("Leurs derniers chatons grandissent à la maison, auprès de leur maman. Touchez une portée pour les découvrir."
                         if male else
                         "Leurs derniers chatons grandissent à la maison, auprès d'elles. Touchez une portée pour les découvrir."),
        "photos_h2": "La bande des garçons" if male else "La bande des filles",
        "eyebrow": "Nos mâles" if male else "Nos femelles",
        "autre_href": "femelles.html" if male else "males.html",
        "autre": "nos femelles" if male else "nos mâles",
        "logo_cta": medallion("medallion--md", alt=""),
    }
    return """
<section class="page-head intro">
  <div class="wrap intro__grid">
    <div class="intro__text">
      <nav class="breadcrumb" aria-label="Fil d'Ariane"><span><a href="index.html">Accueil</a></span><span>%(titre)s</span></nav>
      <p class="eyebrow">La chatterie</p>
      <h1>%(titre)s</h1>
      <p class="intro__script">%(script)s</p>
      <p class="lede">%(lede)s</p>
      <div id="cats-stickers"></div>
    </div>
    <div class="intro__art" aria-hidden="true"><div id="cats-fan"></div></div>
  </div>
</section>

<section class="tight sex-cats">
  <div class="wrap">
    <h2 class="visually-hidden">%(liste)s</h2>
    <div id="cats-list"></div>
  </div>
</section>

<section class="panel panel--blush" id="sex-litters" hidden>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">En ce moment à la maison</p>
      <h2>%(portees_h2)s <span class="bh-h2-script">%(portees_script)s</span></h2>
      <p class="lede">%(portees_lede)s</p>
    </div>
    <div id="sex-litters-list"></div>
    <div class="actions center"><a class="btn btn--ghost" href="chatons.html">Tous nos chatons</a></div>
  </div>
</section>

<section id="sex-photos" hidden>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">En images</p>
      <h2>%(photos_h2)s</h2>
      <p class="lede">Jeux, frimousses et petites bêtises. Touchez une photo pour l'agrandir.</p>
    </div>
    <div class="mosaic mosaic--named" id="sex-photos-grid"></div>
  </div>
</section>

<section class="panel panel--champagne" id="sex-about" hidden>
  <div class="wrap wrap--narrow">
    <article class="about-card reveal">
      <p class="eyebrow">%(eyebrow)s</p>
      <h2 id="sex-about-title"></h2>
      <div class="prose" id="sex-about-text"></div>
    </article>
  </div>
</section>

<section class="cta-band">
  <div class="wrap wrap--narrow center">
    %(logo_cta)s
    <h2>Un coup de cœur ?</h2>
    <p class="lede">Nos chatons naissent et grandissent à la maison, auprès de leur maman. Découvrez ceux du moment, ou inscrivez-vous sur la liste d'attente pour être prévenu des prochaines naissances.</p>
    <div class="actions center">
      <a class="btn btn--primary" href="chatons.html">Voir les chatons</a>
      <a class="btn btn--ghost" href="liste-attente.html">La liste d'attente</a>
    </div>
    <p class="small">Voir aussi <a href="%(autre_href)s">%(autre)s</a> et <a href="retraites.html">nos retraités</a>.</p>
  </div>
</section>
""" % t


MALES = sex_page(True)
FEMELLES = sex_page(False)

# ==========================================================================
# FICHE CHAT
# ==========================================================================
FICHE_CHAT = """
<section class="page-head page-head--compact">
  <div class="wrap page-head__row">
    <a class="back-pill" href="males.html" id="cat-back">%(back)s<span>Nos mâles</span></a>
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <span><a href="index.html">Accueil</a></span>
      <span><a href="males.html" id="cat-breadcrumb-parent">Nos mâles</a></span>
      <span id="cat-breadcrumb-name">Fiche</span>
    </nav>
  </div>
</section>
<section class="tight" style="padding-top:.4rem">
  <div class="wrap"><div id="cat-detail"></div></div>
</section>
<section class="panel panel--blush tight" id="cat-others-section" hidden>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Découvrez aussi</p>
      <h2 id="cat-others-title">Ses compagnons</h2>
    </div>
    <div class="friends" id="cat-others"></div>
  </div>
</section>
""" % {"back": ico("back", 18)}

# ==========================================================================
# FICHE CHATON
# ==========================================================================
FICHE_CHATON = """
<section class="page-head page-head--compact">
  <div class="wrap page-head__row">
    <a class="back-pill" href="chatons.html" id="kitten-back">%(back)s<span>Nos chatons</span></a>
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <span><a href="index.html">Accueil</a></span>
      <span><a href="chatons.html">Chatons</a></span>
      <span id="kitten-breadcrumb-litter" hidden><a href="chatons.html" id="kitten-breadcrumb-litter-link">Portée</a></span>
      <span id="kitten-breadcrumb-name">Chaton</span>
    </nav>
  </div>
</section>
<section class="tight" style="padding-top:.4rem">
  <div class="wrap"><div id="kitten-detail"></div>
    <p class="legal-note">Chatons proposés par un élevage déclaré : AMIEL Zeitoun, %(ville)s, SIREN %(siren)s.
      <a href="mentions-legales.html">Mentions légales</a></p>
  </div>
</section>
<section class="panel panel--blush tight" id="kitten-siblings-section" hidden>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">La même portée</p>
      <h2 id="kitten-siblings-title">Ses frères et sœurs</h2>
    </div>
    <div class="friends" id="kitten-siblings"></div>
  </div>
</section>
""" % {"back": ico("back", 18), "ville": SITE["ville"], "siren": SITE["siren"]}

# ==========================================================================
# CHATONS
# ==========================================================================
CHATONS = """
<section class="page-head intro">
  <div class="wrap intro__grid">
    <div class="intro__text">
      <nav class="breadcrumb" aria-label="Fil d'Ariane"><span><a href="index.html">Accueil</a></span><span>Chatons</span></nav>
      <p class="eyebrow">Chatons</p>
      <h1>Nos chatons</h1>
      <p class="intro__script">petits princes et princesses</p>
      <p class="lede">Nés et élevés à la maison, à Othis, au milieu de la famille. Chaque portée avec ses parents,
        l'âge des chatons et leur disponibilité. Un chaton réservé reste affiché : c'est la vie de la chatterie.</p>
      <div id="kittens-stickers"></div>
    </div>
    <div class="intro__art" aria-hidden="true"><div id="kittens-fan"></div></div>
  </div>
</section>

<section class="tight" style="padding-top:0">
  <div class="wrap">
    <div class="filters" id="kitten-filters">
      <button class="chip" type="button" data-filter="tous" aria-pressed="true">Tous</button>
      <button class="chip" type="button" data-filter="disponible" aria-pressed="false">Disponibles</button>
      <button class="chip" type="button" data-filter="reserve" aria-pressed="false">Réservés</button>
      <span class="count-note" id="kittens-summary"></span>
    </div>
    <div id="litters"></div>
    <p class="legal-note">Chatons proposés par un élevage déclaré : AMIEL Zeitoun, %(ville)s, SIREN %(siren)s.
      Chatons inscrits au LOOF, identifiés et vaccinés. <a href="mentions-legales.html">Mentions légales</a></p>
  </div>
</section>

<section id="kittens-photos" hidden>
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">En images</p>
      <h2>La vie des chatons</h2>
      <p class="lede">Leurs premières bêtises, leurs siestes et leurs frimousses. Touchez une photo pour l'agrandir.</p>
    </div>
    <div class="mosaic mosaic--named" id="kittens-photos-grid"></div>
  </div>
</section>

<section class="panel panel--champagne">
  <div class="wrap">
    <div class="section-head center">
      <p class="eyebrow center">Le grand jour</p>
      <h2>Le départ de votre chaton</h2>
      <p class="lede">Nos chatons sont prêts à partir vers douze semaines, avec tout ce qu'il faut pour un bon
        départ dans leur nouvelle maison.</p>
    </div>
    <ul class="kit">
      <li class="reveal"><span class="kit__icon">%(doc)s</span>Certificat LOOF, le Livre officiel des origines félines</li>
      <li class="reveal" data-delay="1"><span class="kit__icon">%(chip)s</span>Puce électronique d'identification</li>
      <li class="reveal" data-delay="2"><span class="kit__icon">%(syringe)s</span>Premières vaccinations à jour</li>
      <li class="reveal"><span class="kit__icon">%(heart)s</span>Carnet de santé complet</li>
      <li class="reveal" data-delay="1"><span class="kit__icon">%(gift)s</span>De la nourriture et un peu de litière pour les premiers jours</li>
      <li class="reveal" data-delay="2"><span class="kit__icon">%(check)s</span>Un suivi et nos conseils, bien après l'adoption</li>
    </ul>
    <p class="small center" style="margin-top:1.4rem">Et les documents prévus par la loi : attestation de cession,
      certificat vétérinaire et document d'information sur les besoins de l'espèce.</p>
    <div class="sheet sheet--statuses reveal">
      <h3>Les statuts affichés</h3>
      <dl class="facts">
        <div><dt>Disponible</dt><dd class="free">Aucune réservation en cours</dd></div>
        <div><dt>Réservé</dt><dd class="free">Une famille a versé un acompte</dd></div>
        <div><dt>Reste à la chatterie</dt><dd class="free">Gardé à la maison</dd></div>
        <div><dt>Adopté</dt><dd class="free">Parti dans sa famille</dd></div>
      </dl>
      <div class="actions"><a class="btn btn--sm btn--primary" href="liste-attente.html">Rejoindre la liste d'attente</a></div>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="wrap wrap--narrow center">
    %(logo_cta)s
    <h2>Un chaton vous a fait craquer ?</h2>
    <p class="lede">Écrivez-nous pour faire connaissance : nous répondons à toutes vos questions et vous parlons
      du caractère de chacun. Les visites se font sur rendez-vous, à la maison.</p>
    <div class="actions center">
      <a class="btn btn--primary" href="contact.html">Nous écrire</a>
      <a class="btn btn--ghost" href="liste-attente.html">Rejoindre la liste d'attente</a>
    </div>
    <p class="small">Voir aussi <a href="males.html">nos mâles</a> et <a href="femelles.html">nos femelles</a>.</p>
  </div>
</section>
""" % {"doc": ico("doc", 22), "chip": ico("chip", 22), "syringe": ico("syringe", 22), "heart": ico("heart", 22),
       "check": ico("check", 22), "gift": ico("gift", 22), "ville": SITE["ville"], "siren": SITE["siren"],
       "logo_cta": medallion("medallion--md", alt="")}

# ==========================================================================
# PORTÉE
# ==========================================================================
PORTEE = """
<section class="page-head page-head--compact">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <span><a href="index.html">Accueil</a></span>
      <span><a href="chatons.html">Chatons</a></span>
      <span id="litter-breadcrumb-name">Portée</span>
    </nav>
  </div>
</section>
<section class="tight" style="padding-top:0">
  <div class="wrap"><div id="litter-detail"></div>
    <p class="legal-note">Chatons proposés par un élevage déclaré : AMIEL Zeitoun, %(ville)s, SIREN %(siren)s.
      <a href="mentions-legales.html">Mentions légales</a></p>
  </div>
</section>
<section class="panel panel--blush tight">
  <div class="wrap wrap--narrow center">
    <h2>Un chaton vous plaît ?</h2>
    <p class="lede">Écrivez-nous en nous parlant un peu de vous. Nous vous rappelons et nous vous proposons
      une visite, sur rendez-vous.</p>
    <div class="actions center">
      <a class="btn btn--primary" href="contact.html">Nous écrire</a>
      <a class="btn btn--ghost" href="liste-attente.html">La liste d'attente</a>
    </div>
  </div>
</section>
""" % {"ville": SITE["ville"], "siren": SITE["siren"]}

# ==========================================================================
# LISTE D'ATTENTE (réservation, étapes, santé, FAQ)
# ==========================================================================
LISTE_ATTENTE = """<section class="page-head page-head--center">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane"><span><a href="index.html">Accueil</a></span><span>Liste d'attente</span></nav>
    <span class="page-head__crown" aria-hidden="true">%(crown)s</span>
    <h1>Liste d'attente</h1>
    <p class="lede">Rejoignez notre liste d'attente : vous êtes prioritaire dès qu'un chaton correspondant à
      vos critères est disponible.</p>
  </div>
</section>

<section class="tight" id="liste-attente" style="padding-top:0">
  <div class="wrap wrap--narrow">
    <div class="reserve-card reveal">
      <div class="avatars" id="waitlist-avatars" aria-hidden="true"></div>
      <h2>Réserver votre futur compagnon</h2>
      <p>En versant un acompte de %(acompte)s, vous rejoignez notre liste d'attente et êtes prioritaire dès qu'un
        chaton correspondant à vos critères (couleur, sexe) est disponible. Cette somme est ensuite déduite du prix
        d'achat le jour où vous choisissez votre chaton.</p>
    </div>

    <ul class="perks">
      <li class="perk reveal"><span class="perk__icon">%(star)s</span><h3>Prioritaire</h3>
        <p>Vous êtes prévenu avant tout le monde dès qu'un chaton correspondant à vos critères est disponible.</p></li>
      <li class="perk reveal" data-delay="1"><span class="perk__icon">%(heart)s</span><h3>Acompte de %(acompte)s</h3>
        <p>Il est déduit du prix de votre chaton le jour où vous le choisissez.</p></li>
      <li class="perk reveal" data-delay="2"><span class="perk__icon">%(target)s</span><h3>Le chaton qu'il vous faut</h3>
        <p>Nous vous proposons jusqu'à trois chatons correspondant à ce que vous cherchez.</p></li>
    </ul>

    <form id="waitlist-form" class="form-card reveal" data-form="waitlist" novalidate>
      <h2 class="h3">M'inscrire sur la liste d'attente</h2>
      <p class="small">Laissez-nous vos coordonnées et ce que vous cherchez : nous vous rappelons pour en parler,
        avant tout versement.</p>
      <div class="form-grid">
        <div class="field">
          <label for="w-name">Votre nom</label>
          <input id="w-name" name="name" type="text" autocomplete="name" placeholder="Prénom et nom" required>
          <span class="error"></span>
        </div>
        <div class="field">
          <label for="w-num">Téléphone</label>
          <input id="w-num" name="num" type="tel" autocomplete="tel" placeholder="06 …">
          <span class="error"></span>
        </div>
        <div class="field field--full">
          <label for="w-email">Votre e-mail</label>
          <input id="w-email" name="email" type="email" autocomplete="email" placeholder="vous@exemple.fr" required>
          <span class="error"></span>
        </div>
        <div class="field">
          <label for="w-sexe">Chaton recherché</label>
          <select id="w-sexe" name="sexe">
            <option value="Peu importe">Peu importe</option>
            <option value="Un mâle">Un mâle</option>
            <option value="Une femelle">Une femelle</option>
          </select>
        </div>
        <div class="field">
          <label for="w-robe">Robe souhaitée <span class="hint">facultatif</span></label>
          <input id="w-robe" name="robe" type="text" placeholder="Chocolat, cinnamon, silver shaded, bleu…">
        </div>
        <div class="field field--full">
          <label for="w-message">Votre message</label>
          <textarea id="w-message" name="message" required
            placeholder="Parlez-nous un peu de vous, de votre foyer, et du chaton dont vous rêvez…"></textarea>
          <span class="error"></span>
        </div>
      </div>
      <div class="honey" aria-hidden="true">
        <label for="w-website">Ne remplissez pas ce champ</label>
        <input id="w-website" name="website" type="text" tabindex="-1" autocomplete="off">
      </div>
      <button class="btn btn--primary" type="submit">M'inscrire sur la liste d'attente</button>
      <p class="form-note">Vos coordonnées servent uniquement à vous répondre. Voir notre
        <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>
      <p class="notice" data-result hidden></p>
    </form>

    <div class="conditions reveal">
      <h3>Les conditions, en toute transparence</h3>
      <ul class="pawed">
        <li>Nous vous proposons jusqu'à trois chatons correspondant à vos critères</li>
        <li>Après trois refus, votre place sur la liste est libérée</li>
        <li>L'acompte n'est pas remboursable une fois versé</li>
        <li>Plus vous êtes ouvert sur la couleur et le sexe, plus l'attente est courte</li>
      </ul>
      <p class="small">Ces conditions vous sont remises par écrit avant tout versement. Posez-nous toutes vos
        questions : nous préférons un échange franc à une réservation précipitée.</p>
    </div>
  </div>
</section>

<section class="panel panel--blush">
  <div class="wrap">
    <div class="split split--wide-text">
      <div class="reveal">
        <p class="eyebrow">Adopter</p>
        <h2>Les six étapes</h2>
        <ol class="steps">
          <li><h3>Vous nous écrivez</h3><p>Présentez-vous en quelques lignes : votre foyer, vos autres animaux,
            ce que vous cherchez. Plus vous êtes précis, mieux nous vous orientons.</p></li>
          <li><h3>Nous échangeons</h3><p>Par téléphone le plus souvent. Nous vous disons franchement ce que
            nous avons, ce que nous n'avons pas, et combien de temps il faudra attendre.</p></li>
          <li><h3>Vous venez nous voir</h3><p>Sur rendez-vous. Vous rencontrez les chatons, vous voyez où ils
            grandissent et vous posez toutes vos questions.</p></li>
          <li><h3>La réservation</h3><p>Versement de l'acompte de %(acompte)s, déduit du prix du chaton. Vous
            recevez les documents à signer, dont le certificat d'engagement et de connaissance.</p></li>
          <li><h3>Le délai de réflexion</h3><p>La loi impose sept jours entre la signature du certificat
            d'engagement et de connaissance et la remise du chaton. Ce délai est fait pour vous.</p></li>
          <li><h3>Le départ, vers douze semaines</h3><p>Vous repartez avec le chaton, son dossier complet et
            notre numéro. Nous restons disponibles après l'adoption.</p></li>
        </ol>
      </div>
      <div class="reveal" data-delay="1">
        <figure class="frame-photo frame-photo--tilt">
          <img src="assets/photos/trio-chatons.webp" width="880" height="1100" loading="lazy" alt="Trois chatons British Longhair blottis les uns contre les autres">
        </figure>
        <div class="sheet" style="margin-top:1.6rem">
          <h3>Nos conditions</h3>
          <dl class="facts">
            <div><dt>Départ</dt><dd>vers 12 semaines</dd></div>
            <div><dt>Acompte</dt><dd>%(acompte)s</dd></div>
            <div><dt>Visite</dt><dd>sur rendez-vous</dd></div>
            <div><dt>Vie</dt><dd>en intérieur, de préférence</dd></div>
            <div><dt>Pedigree</dt><dd>LOOF</dd></div>
            <div><dt>Suivi</dt><dd>après l'adoption</dd></div>
          </dl>
          <p class="small" style="margin-top:1rem">Contactez-nous pour connaître le prix d'un chaton.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="panel panel--lilac" id="sante">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Santé</p>
      <h2>Ce qu'on dépiste chez le British, et pourquoi</h2>
      <p class="lede">Quatre sujets à connaître avant d'adopter un British. Posez ces questions à tout éleveur,
        nous compris : les réponses en disent long.</p>
    </div>
    <div class="grid grid-2">
      <div class="sheet reveal">
        <h3>La cardiomyopathie hypertrophique</h3>
        <p>C'est la maladie cardiaque la plus fréquente chez le chat, et le British y est prédisposé.
          Elle se dépiste par <strong>échographie du cœur réalisée par un vétérinaire cardiologue</strong>,
          répétée dans le temps, car un chat sain à deux ans peut se déclarer plus tard.</p>
        <p class="small">Méfiez-vous d'un « test ADN HCM » annoncé chez le British : les tests génétiques
          existants concernent d'autres races. Chez le British, seule l'échographie fait foi.</p>
      </div>
      <div class="sheet reveal" data-delay="1">
        <h3>La polykystose rénale</h3>
        <p>La PKD se transmet de façon dominante et se dépiste par un <strong>test ADN</strong>, une seule
          fois dans la vie du chat. Un reproducteur testé négatif ne peut pas transmettre la mutation.</p>
        <p class="small">Un test ADN est définitif : demandez le résultat du laboratoire, pas une déclaration.</p>
      </div>
      <div class="sheet reveal">
        <h3>Les groupes sanguins A et B</h3>
        <p>C'est la particularité du British qu'on oublie le plus souvent. Un chaton de groupe A né d'une
          mère de groupe B peut mourir dans ses premiers jours, empoisonné par le colostrum maternel.
          On appelle cela l'isoérythrolyse néonatale.</p>
        <p class="small">Connaître le groupe de chaque reproducteur permet d'éviter ces mariages ou de
          protéger les chatons à la naissance.</p>
      </div>
      <div class="sheet reveal" data-delay="1">
        <h3>FIV et FeLV</h3>
        <p>Le virus de l'immunodéficience féline et celui de la leucose se dépistent par une simple prise de
          sang. Un chat qui vit à l'intérieur, ou avec une sortie sécurisée, est à l'abri de l'essentiel du risque.</p>
        <p class="small">Vaccins, vermifuges et suivi vétérinaire : c'est la routine invisible d'un élevage,
          celle qui ne se voit pas sur les photos.</p>
      </div>
    </div>

    <div class="callout reveal" style="margin-top:2rem">
      <p><strong>Ce qu'aucun éleveur honnête ne promet.</strong> Personne ne peut garantir un chat « sans
        maladie génétique » ni « en bonne santé à vie ». Votre chaton part identifié, vacciné, avec son carnet de
        santé et un certificat vétérinaire. Les garanties légales, vices rédhibitoires et garantie de conformité,
        s'appliquent de plein droit.</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Le jour J</p>
      <h2>Préparer son arrivée</h2>
    </div>
    <div class="grid grid-3">
      <div class="feature reveal"><h3>Une seule pièce</h3><p>Installez litière, gamelles, griffoir et
        couchage dans une pièce calme, et laissez-le en sortir de lui-même. Il quitte sa mère, sa fratrie
        et tous ses repères le même jour.</p></div>
      <div class="feature reveal" data-delay="1"><h3>La même nourriture</h3><p>Il part avec de quoi tenir
        les premiers jours. Pour changer, faites-le sur dix à quinze jours en mélangeant : un changement
        brutal, c'est une diarrhée assurée dans une semaine déjà stressante.</p></div>
      <div class="feature reveal" data-delay="2"><h3>Un logement sûr</h3><p>Fils électriques, produits
        ménagers, plantes toxiques, fenêtres oscillo-battantes et balcon : tout cela se règle avant son
        arrivée, pas après.</p></div>
      <div class="feature reveal"><h3>Les présentations</h3><p>Avec un autre animal, on échange d'abord les
        odeurs, puis on fait des rencontres courtes et surveillées. Comptez une à trois semaines.</p></div>
      <div class="feature reveal" data-delay="1"><h3>Le vétérinaire</h3><p>Prenez rendez-vous dans les jours
        qui suivent, avec son carnet de santé. C'est aussi l'occasion de choisir votre vétérinaire.</p></div>
      <div class="feature reveal" data-delay="2"><h3>Et nous</h3><p>Envoyez-nous des nouvelles et des photos,
        et appelez-nous à la moindre question : nous restons disponibles après l'adoption.</p></div>
    </div>
  </div>
</section>

<section id="faq" class="panel panel--champagne">
  <div class="wrap wrap--narrow">
    <div class="section-head">
      <p class="eyebrow">Questions fréquentes</p>
      <h2>Ce qu'on nous demande le plus souvent</h2>
    </div>
    <div class="faq-list">
%(faq)s
    </div>
    <p class="small" style="margin-top:2rem">Une question qui n'est pas là ? <a href="contact.html">Écrivez-nous</a>.</p>
  </div>
</section>
"""

FAQ_ITEMS = [
    ("Combien coûte un chaton chez vous ?",
     "<p>Le prix dépend notamment de la couleur, du sexe et du type, Shorthair ou Longhair. Contactez-nous : "
     "nous vous donnons le prix exact du chaton qui vous intéresse.</p>"
     "<p>Une réservation de 200 € est demandée pour garantir l'adoption. Elle est déduite du prix du chaton.</p>"),
    ("Faut-il adopter un ou deux chatons ?",
     "<p>Si personne n'est à la maison la journée, deux, sans hésiter. Un British s'ennuie en silence : il "
     "ne miaule pas, il dort, il mange, il grossit. Deux chatons se dépensent, se lavent et se calment "
     "mutuellement, et le travail pour vous est à peine doublé.</p>"
     "<p>Si quelqu'un est présent la plupart du temps et qu'il y a déjà de la vie à la maison, un seul "
     "chaton s'épanouit très bien. Nous en parlons ensemble avant de décider.</p>"),
    ("Un British peut-il vivre en appartement ?",
     "<p>Oui, c'est même une des races les mieux adaptées : calme, peu grimpeur, il ne cherche pas à sortir. "
     "Deux conditions quand même. Des points d'observation en hauteur, arbre à chat ou étagère près d'une "
     "fenêtre. Et un vrai temps de jeu quotidien, parce que l'appartement plus le tempérament posé du "
     "British, c'est la recette de la prise de poids. Un balcon doit être sécurisé par un filet.</p>"),
    ("Est-ce qu'il s'entend avec les enfants ?",
     "<p>Très bien, et c'est une de ses grandes qualités. Il est patient et ne griffe pratiquement jamais : "
     "quand il en a assez, il s'en va. C'est justement ce qu'il faut apprendre aux enfants, le laisser "
     "partir, ne pas le poursuivre, ne pas le porter comme une poupée.</p>"),
    ("Et avec un chien, ou avec mes autres chats ?",
     "<p>Très bien, avec de la méthode. On installe le chaton dans une pièce à lui pendant quelques jours, "
     "on échange les odeurs avec une couverture ou un jouet, puis on fait des rencontres courtes et "
     "surveillées avant le face-à-face.</p>"
     "<p>Comptez une à trois semaines pour une cohabitation sereine. Le British est peu bagarreur : c'est "
     "en général le résident qui a besoin de temps, pas lui.</p>"),
    ("Le British est-il hypoallergénique ?",
     "<p>Non, et aucune race ne l'est vraiment. L'allergie vient d'une protéine de la salive et des "
     "squames, pas du poil : un Shorthair n'est donc pas moins allergisant qu'un Longhair.</p>"
     "<p>Si quelqu'un du foyer est allergique, parlez-en à un allergologue avant de vous engager, et venez "
     "passer un moment chez nous.</p>"),
    ("Est-ce qu'il perd beaucoup ses poils ?",
     "<p>Oui, comme tous les chats, et davantage au printemps et à l'automne. La fourrure du British est "
     "dense, avec un sous-poil épais : un bon brossage par semaine en temps normal, deux ou trois pendant "
     "la mue, avec un peigne ou une brosse qui atteint le sous-poil.</p>"
     "<p>Le British Longhair demande un brossage tous les deux jours, surtout derrière les oreilles et sur "
     "les culottes.</p>"),
    ("Que mange-t-il, et puis-je changer de nourriture ?",
     "<p>Nos chatons partent avec de quoi tenir les premiers jours. Si vous souhaitez changer, faites-le "
     "progressivement sur dix à quinze jours en mélangeant les deux aliments.</p>"
     "<p>Notre article <a href=\"article.html?slug=bien-nourrir-son-chat\">Guide complet sur l'alimentation "
     "du chat</a> répond à la plupart des questions.</p>"),
    ("J'habite loin, comment le chaton peut-il me rejoindre ?",
     "<p>Nous sommes à Othis, à vingt minutes de l'aéroport Paris-Charles de Gaulle. Nous pouvons vous "
     "apporter le chaton à la gare de Roissy ou de Saint-Mard, et il existe des taxis animaliers si vous "
     "habitez plus loin.</p>"
     "<p>Nous livrons en France, en Suisse et en Belgique. Parlons-en ensemble pour trouver la solution la "
     "plus douce pour lui.</p>"),
    ("Peut-on venir voir les chatons avant de décider ?",
     "<p>Oui, et nous vous y encourageons. Les visites se font uniquement sur rendez-vous : vous rencontrez "
     "les chatons, vous voyez où ils ont grandi et vous posez toutes vos questions.</p>"),
    ("Comment réserve-t-on, et à quoi sert l'acompte ?",
     "<p>Après notre échange et, idéalement, une visite, la réservation se fait par le versement de "
     "l'acompte de 200 €, qui est déduit du prix du chaton. Il bloque le chaton à votre nom.</p>"
     "<p>Nous signons ensuite le certificat d'engagement et de connaissance, et la loi impose un délai de "
     "réflexion de sept jours avant le départ.</p>"),
    ("Combien de temps faut-il attendre ?",
     "<p>Cela dépend de ce que vous cherchez. Si vous voulez une couleur précise, l'attente est plus "
     "longue ; si vous êtes ouvert sur la couleur et le sexe, elle est souvent bien plus courte. Nous vous "
     "le disons franchement dès le premier échange.</p>"),
    ("Faut-il faire stériliser son chaton ?",
     "<p>Pour nos chatons mâles, oui : nous demandons aux futurs propriétaires de s'engager à les faire "
     "stériliser dès l'âge de 6 à 7 mois, afin d'éviter les comportements de marquage.</p>"
     "<p>Parlez-en avec votre vétérinaire lors de la première visite : il vous indiquera le bon moment.</p>"),
    ("Un chaton Longhair peut-il naître de deux Shorthair ?",
     "<p>Oui. Le poil long est un caractère récessif : deux British Shorthair porteurs du gène peuvent "
     "donner des Longhair dans la même portée. C'est le même chat, la même race et le même standard, avec "
     "une fourrure plus longue et un brossage plus régulier.</p>"),
]

FAQ_HTML = "\n".join(
    '      <details class="faq"><summary>%s</summary><div class="faq__body">%s</div></details>'
    % (q, a) for q, a in FAQ_ITEMS
)

LISTE_ATTENTE = LISTE_ATTENTE % {
    "acompte": SITE["acompte"], "faq": FAQ_HTML, "crown": crown_svg(),
    "star": ico("star", 24), "heart": ico("heart", 24), "target": ico("target", 24),
}

# ==========================================================================
# NOS RETRAITÉS
# ==========================================================================
RETRAITES = page_head_block(
    "Une retraite méritée",
    "Nos retraités",
    "Nos anciens reproducteurs. Après leurs années d'élevage, ils profitent d'une vie tranquille et heureuse, bien méritée.",
    [("index.html", "Accueil"), (None, "Retraités")],
    '<p class="count-note" id="retired-count"></p>',
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap">
    <div class="callout reveal" style="margin-bottom:2rem">
      <p>Après plusieurs années de reproduction, nos reproducteurs sont stérilisés. Nous veillons ensuite à ce
        qu'ils profitent d'une vie tranquille et heureuse, chez nous ou dans une nouvelle famille choisie avec soin.</p>
    </div>
    <div id="retired-list"></div>
  </div>
</section>

<section class="panel panel--lilac tight">
  <div class="wrap wrap--narrow center">
    <h2>Adopter un chat adulte</h2>
    <p class="lede">Un adulte, c'est un caractère déjà formé et une sérénité qu'un chaton n'a pas encore.
      Pour beaucoup de foyers, c'est le meilleur choix. Demandez-nous si l'un des nôtres cherche une famille.</p>
    <div class="actions center"><a class="btn btn--primary" href="contact.html?sujet=Adoption%20d%27un%20retrait%C3%A9">Nous écrire</a></div>
  </div>
</section>
"""

# ==========================================================================
# CONSEILS et ARTICLE
# ==========================================================================
CONSEILS = page_head_block(
    "Conseils",
    "Nos conseils",
    "Ce que nous avons appris au fil des portées, pour bien accueillir et bien nourrir votre British.",
    [("index.html", "Accueil"), (None, "Conseils")],
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap"><div id="blog-list"></div></div>
</section>
"""

ARTICLE = """
<section class="page-head page-head--compact">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <span><a href="index.html">Accueil</a></span>
      <span><a href="conseils.html">Conseils</a></span>
      <span id="article-breadcrumb-name">Article</span>
    </nav>
  </div>
</section>
<section class="tight" style="padding-top:0">
  <div class="wrap wrap--narrow"><article id="article-body"></article>
    <p style="margin-top:2.6rem"><a class="link-arrow" href="conseils.html">Tous nos conseils</a></p>
  </div>
</section>
"""

# ==========================================================================
# CONTACT
# ==========================================================================
CONTACT = page_head_block(
    "Contact",
    "Parlons de votre projet",
    "Une question, une visite, un projet d'adoption ? Présentez-vous en quelques lignes : c'est ainsi que commencent nos plus belles adoptions.",
    [("index.html", "Accueil"), (None, "Contact")],
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap">
    <div class="split split--wide-text split--top">
      <div class="reveal">
        <form id="contact-form" class="form-card" data-form="contact" novalidate>
          <div class="form-grid">
            <div class="field">
              <label for="f-name">Votre nom</label>
              <input id="f-name" name="name" type="text" autocomplete="name" required>
              <span class="error"></span>
            </div>
            <div class="field">
              <label for="f-num">Votre téléphone <span class="hint">facultatif</span></label>
              <input id="f-num" name="num" type="tel" autocomplete="tel">
              <span class="error"></span>
            </div>
            <div class="field field--full">
              <label for="f-email">Votre e-mail</label>
              <input id="f-email" name="email" type="email" autocomplete="email" required>
              <span class="error"></span>
            </div>
            <div class="field field--full">
              <label for="f-subject">Sujet</label>
              <input id="f-subject" name="subject" type="text" placeholder="Demande d'information, visite, liste d'attente…">
              <span class="error"></span>
            </div>
            <div class="field field--full">
              <label for="f-message">Votre message</label>
              <textarea id="f-message" name="message" required
                placeholder="Dites-nous qui vous êtes, comment vit votre foyer, si vous avez déjà des animaux, et le chaton que vous recherchez."></textarea>
              <span class="error"></span>
            </div>
          </div>
          <div class="honey" aria-hidden="true">
            <label for="f-website">Ne remplissez pas ce champ</label>
            <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off">
          </div>
          <button class="btn btn--primary" type="submit">Envoyer le message</button>
          <p class="form-note">Vos coordonnées servent uniquement à vous répondre. Elles ne sont ni revendues ni
            utilisées pour de la publicité. Voir notre <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>
          <p class="notice" data-result hidden></p>
        </form>
      </div>

      <div class="reveal" data-delay="1">
        <div class="sheet">
          <h3>Nous joindre directement</h3>
          <dl class="facts">
            <div><dt>Téléphone</dt><dd><a href="tel:%(tel_lien)s">%(tel)s</a></dd></div>
            <div><dt>E-mail</dt><dd><a href="mailto:%(email)s">Nous écrire</a></dd></div>
            <div><dt>Adresse</dt><dd class="free">%(adresse)s<br>%(cp)s %(ville)s</dd></div>
            <div><dt>Visites</dt><dd>sur rendez-vous</dd></div>
            <div><dt>Remise</dt><dd class="free">à Othis, gare de Roissy ou de Saint-Mard</dd></div>
          </dl>
          <p class="small" style="margin-top:1rem">À vingt minutes de l'aéroport Paris-Charles de Gaulle.
            Nous ne répondons pas aux appels masqués.</p>
        </div>

        <div class="sheet" style="margin-top:1.4rem">
          <h3>Avant de nous écrire</h3>
          <ul class="link-list">
            <li><a class="link-arrow" href="le-british.html">Le caractère du British</a></li>
            <li><a class="link-arrow" href="liste-attente.html">La liste d'attente et nos conditions</a></li>
            <li><a class="link-arrow" href="liste-attente.html#faq">Les questions fréquentes</a></li>
          </ul>
        </div>

        <div class="map-frame">
          <iframe
            title="Emplacement de la chatterie à %(ville)s"
            src="https://www.google.com/maps?q=%(adresse_url)s&output=embed"
            width="100%%" height="300" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>
""" % {
    "tel": T, "tel_lien": TL, "email": MAIL, "adresse": SITE["adresse"],
    "cp": SITE["cp"], "ville": SITE["ville"],
    "adresse_url": "12+bis+rue+des+Suisses+77280+Othis",
}

# ==========================================================================
# MENTIONS LÉGALES
# ==========================================================================
MENTIONS = page_head_block(
    "Informations légales", "Mentions légales", "",
    [("index.html", "Accueil"), (None, "Mentions légales")],
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap wrap--narrow prose">
    <h2>Éditeur du site</h2>
    <p>Ce site est édité par AMIEL Zeitoun, entrepreneur individuel, dont le siège est situé
      %(adresse)s, %(cp)s %(ville)s, France.</p>
    <ul>
      <li>SIREN : %(siren)s · SIRET : %(siret)s</li>
      <li>Téléphone : <a href="tel:%(tel_lien)s">%(tel)s</a></li>
      <li>E-mail : <a href="mailto:%(email)s">%(email)s</a></li>
      <li>Directeur de la publication : AMIEL Zeitoun</li>
    </ul>
    <!-- À COMPLÉTER : numéro de déclaration DDPP, numéro ACACED ou de certificat de capacité,
         numéro de TVA intracommunautaire le cas échéant, adhésions professionnelles. -->

    <h2>Hébergement</h2>
    <p>Le site est hébergé par Microsoft Azure, Microsoft France SAS, 37 quai du Président Roosevelt,
      92130 Issy-les-Moulineaux, France.</p>

    <h2>Activité d'élevage</h2>
    <p>Les chatons proposés sur ce site sont inscrits au LOOF, Livre Officiel des Origines Félines.
      Conformément à la réglementation, l'âge minimum légal de cession d'un chaton est de huit semaines ;
      nos chatons partent vers douze semaines. Chaque cession donne lieu à la remise d'une
      attestation de cession, d'un certificat vétérinaire, du document d'information sur
      les besoins de l'espèce et du certificat d'engagement et de connaissance signé au moins sept jours
      avant la remise de l'animal.</p>

    <h2>Propriété intellectuelle</h2>
    <p>L'ensemble des contenus de ce site, textes, photographies, vidéos, logos et éléments graphiques,
      est protégé par le droit d'auteur. Toute reproduction ou réutilisation, totale ou partielle, sans
      autorisation écrite préalable est interdite.</p>

    <h2>Liens vers des sites tiers</h2>
    <p>Ce site peut contenir des liens vers des sites tiers. Ils sont proposés pour votre commodité et
      n'impliquent aucune approbation de leur contenu, dont nous ne sommes pas responsables.</p>

    <h2>Limitation de responsabilité</h2>
    <p>Les informations publiées sur ce site sont fournies à titre indicatif et mises à jour régulièrement.
      Elles ne sauraient engager notre responsabilité en cas d'erreur ou d'omission. Les conseils de santé
      qui y figurent ne remplacent jamais l'avis d'un vétérinaire.</p>

    <h2>Médiation de la consommation</h2>
    <p>Conformément au code de la consommation, en cas de litige non résolu avec nos services, vous pouvez
      recourir gratuitement à un médiateur de la consommation.</p>
    <!-- À COMPLÉTER : nom et coordonnées du médiateur de la consommation choisi. -->

    <h2>Nous contacter</h2>
    <p>Pour toute question relative à ces mentions, écrivez-nous à
      <a href="mailto:%(email)s">%(email)s</a>.</p>
  </div>
</section>
""" % {
    "adresse": SITE["adresse"], "cp": SITE["cp"], "ville": SITE["ville"],
    "siret": SITE["siret"], "siren": SITE["siren"], "tel": T, "tel_lien": TL, "email": MAIL,
}

# ==========================================================================
# POLITIQUE DE CONFIDENTIALITÉ
# ==========================================================================
CONFIDENTIALITE = page_head_block(
    "Vos données", "Politique de confidentialité",
    "Ce que nous collectons, pourquoi, combien de temps, et comment exercer vos droits.",
    [("index.html", "Accueil"), (None, "Politique de confidentialité")],
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap wrap--narrow prose">
    <h2>Qui est responsable de vos données</h2>
    <p>AMIEL Zeitoun, éditeur de ce site, %(adresse)s, %(cp)s %(ville)s. Pour toute question relative à
      vos données : <a href="mailto:%(email)s">%(email)s</a>.</p>

    <h2>Les formulaires de contact et de liste d'attente</h2>
    <p>Lorsque vous nous écrivez, nous conservons votre nom, votre e-mail, votre téléphone si vous le
      renseignez, et votre message. Ces informations servent uniquement à vous répondre et à suivre votre
      projet d'adoption. Elles ne sont ni revendues, ni louées, ni utilisées pour de la prospection.</p>
    <p>Base légale : votre demande. Durée de conservation : trois ans après notre dernier échange.</p>

    <h2>Les statistiques de visite</h2>
    <p>Nous enregistrons les visites du site afin de savoir quelles pages sont consultées. Sont enregistrés
      la date et l'heure, la page visitée, le type d'appareil, une localisation approximative déduite de
      l'adresse IP et l'adresse IP elle-même. Ces données sont conservées
      <!-- À COMPLÉTER : durée réelle de conservation des visites en base --> et ne sont pas utilisées pour
      identifier une personne.</p>
    <h2 id="cookies">Les cookies</h2>
    <p>Le site peut utiliser Google Analytics, qui dépose des cookies de mesure d'audience, <strong>seulement
      si vous l'acceptez</strong> dans le bandeau qui s'affiche à votre première visite. Si vous refusez, aucun
      cookie de mesure n'est déposé. Votre choix est conservé six mois dans votre navigateur ; vous pouvez le
      changer à tout moment grâce au lien « Cookies » en bas de chaque page.</p>
    <p>Le site garde aussi dans votre navigateur votre préférence de thème, clair ou sombre. Ce réglage ne
      sert qu'à l'affichage et ne nécessite pas votre accord.</p>
    <p>Enfin, si vous arrivez par un lien que nous avons publié sur Instagram, TikTok, Facebook ou YouTube,
      votre navigateur retient le nom de ce réseau. Il est ajouté au bas de votre message si vous nous
      écrivez, pour que nous sachions par où vous êtes arrivé. Ce nom reste dans votre navigateur, ne sert
      qu'à cela et ne permet pas de vous identifier : effacer les données du site l'efface aussi.</p>
    <!-- À VÉRIFIER : l'enregistrement des visites par l'API (adresse IP, localisation) se déclenche
         sans consentement ; il doit rester strictement limité à la mesure d'audience pour en être dispensé. -->

    <h2>Ce que nous ne faisons pas</h2>
    <p>Nous ne vendons ni n'échangeons vos données. Nous n'envoyons pas de lettre d'information. Nous ne
      pratiquons aucune vente en ligne : aucune donnée bancaire ne transite par ce site.</p>

    <h2>Les destinataires</h2>
    <p>Vos messages sont hébergés sur les serveurs Microsoft Azure, en Europe, et consultés uniquement par
      la chatterie. Les données de mesure d'audience sont traitées par Google.</p>

    <h2>Vos droits</h2>
    <p>Vous pouvez à tout moment demander l'accès à vos données, leur rectification, leur effacement, la
      limitation de leur traitement, ou vous opposer à leur traitement. Écrivez-nous à
      <a href="mailto:%(email)s">%(email)s</a> : nous répondons sous un mois. Vous pouvez également
      introduire une réclamation auprès de la CNIL, 3 place de Fontenoy, 75007 Paris, sur
      <a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>.</p>

    <h2>Mise à jour</h2>
    <p>Cette politique peut évoluer. Toute modification est publiée sur cette page.</p>
  </div>
</section>
""" % {"adresse": SITE["adresse"], "cp": SITE["cp"], "ville": SITE["ville"], "email": MAIL}

# ==========================================================================
# ASSEMBLAGE
# ==========================================================================
PAGES = [
    {"file": "index.html", "body": ACCUEIL, "freq": "weekly", "prio": "1.0",
     "title": "Chatterie British Kingdom — British Shorthair et Longhair LOOF à Othis (77)",
     "desc": "Élevage familial de British Shorthair et Longhair LOOF à Othis (77), près de Roissy. Chatons élevés à la maison, départ vers 12 semaines, livraison France, Belgique, Suisse.",
     "scripts": '<script>BKPages.accueil();BKPages.temoignages("#testimonials",3);</script>'},

    {"file": "le-british.html", "body": LE_BRITISH, "prio": "0.7",
     "title": "Le British Shorthair et Longhair — caractère, physique, couleurs, entretien",
     "desc": "Caractère, physique, Shorthair ou Longhair, robes et codes EMS, entretien : tout savoir sur le British avant de l'adopter, par un élevage familial LOOF de Seine-et-Marne."},

    {"file": "males.html", "body": MALES, "prio": "0.8",
     "title": "Mâles British Shorthair et Longhair LOOF — Chatterie British Kingdom",
     "desc": "Nos étalons British Shorthair et British Longhair : robe, couleur des yeux, âge, photos et portées. Élevage familial LOOF à Othis, en Seine-et-Marne (77).",
     "scripts": '<script src="js/descriptions.js"></script>\n<script>BKPages.sexPage("male");</script>'},

    {"file": "femelles.html", "body": FEMELLES, "prio": "0.8",
     "title": "Femelles British Shorthair et Longhair LOOF — Chatterie British Kingdom",
     "desc": "Nos reproductrices British Shorthair et British Longhair : robe, couleur des yeux, âge, photos et portées. Élevage familial LOOF à Othis, en Seine-et-Marne (77).",
     "scripts": '<script src="js/descriptions.js"></script>\n<script>BKPages.sexPage("female");</script>'},

    {"file": "chat.html", "body": FICHE_CHAT, "sitemap": False,
     "title": "Fiche d'un chat — Chatterie British Kingdom",
     "desc": "Fiche détaillée d'un de nos British Shorthair ou Longhair : robe, origines, photos et portées.",
     "scripts": '<script src="js/descriptions.js"></script>\n<script>BKPages.ficheChat();</script>'},

    {"file": "chatons.html", "body": CHATONS, "freq": "weekly", "prio": "0.9",
     "title": "Chatons British Shorthair et Longhair à adopter — Seine-et-Marne (77)",
     "desc": "Nos portées en cours : chatons British Shorthair et Longhair LOOF, leurs parents, leur âge et leur disponibilité. Départ vers 12 semaines depuis Othis, près de Roissy.",
     "scripts": '<script src="js/vedettes.js"></script>\n<script>BKPages.chatons();</script>'},

    {"file": "chaton.html", "body": FICHE_CHATON, "sitemap": False, "nav": "chatons.html",
     "title": "Fiche d'un chaton — Chatterie British Kingdom",
     "desc": "Un de nos chatons British Shorthair ou Longhair : ses photos, sa robe, sa date de naissance, ses parents et sa disponibilité.",
     "scripts": '<script>BKPages.ficheChaton();</script>'},

    {"file": "portee.html", "body": PORTEE, "sitemap": False, "nav": "chatons.html",
     "title": "Une portée — Chatterie British Kingdom",
     "desc": "Les chatons d'une portée, leurs parents, leur âge et leur disponibilité, semaine après semaine.",
     "scripts": '<script>BKPages.portee();</script>'},

    {"file": "retraites.html", "body": RETRAITES, "prio": "0.5",
     "title": "Nos retraités — Chatterie British Kingdom",
     "desc": "Nos anciens reproducteurs, stérilisés, qui profitent d'une retraite tranquille et heureuse.",
     "scripts": '<script src="js/descriptions.js"></script>\n<script>BKPages.retraites();</script>'},

    {"file": "conseils.html", "body": CONSEILS, "prio": "0.6",
     "title": "Conseils d'éleveur pour votre British — Chatterie British Kingdom",
     "desc": "Nos conseils d'éleveur pour bien accueillir et bien nourrir votre British Shorthair ou Longhair : préparer l'arrivée du chaton, alimentation, santé.",
     "scripts": '<script>BKPages.blog();</script>'},

    {"file": "article.html", "body": ARTICLE, "sitemap": False, "nav": "conseils.html",
     "title": "Conseil — Chatterie British Kingdom",
     "desc": "Un conseil d'élevage de la Chatterie British Kingdom.",
     "scripts": '<script>BKPages.article();</script>'},

    {"file": "liste-attente.html", "body": LISTE_ATTENTE, "prio": "0.8",
     "title": "Liste d'attente et réservation d'un chaton British — Chatterie British Kingdom",
     "desc": "Réservez votre futur chaton British Shorthair ou Longhair : acompte de 200 € déduit du prix, étapes de l'adoption, santé, préparation et 14 questions fréquentes.",
     "scripts": '<script>BKPages.listeAttente();</script>'},

    {"file": "contact.html", "body": CONTACT, "prio": "0.6", "freq": "yearly",
     "title": "Contact et visites — Chatterie British Kingdom à Othis (77)",
     "desc": "Téléphone, e-mail ou formulaire : une question, une visite sur rendez-vous ou un projet d'adoption. Remise du chaton à Othis, à la gare de Roissy ou de Saint-Mard.",
     "scripts": '<script>BKPages.prefillContact();</script>'},

    {"file": "mentions-legales.html", "body": MENTIONS, "prio": "0.2", "freq": "yearly",
     "title": "Mentions légales — Chatterie British Kingdom",
     "desc": "Éditeur, hébergeur, activité d'élevage et propriété intellectuelle du site de la Chatterie British Kingdom."},

    {"file": "politique-confidentialite.html", "body": CONFIDENTIALITE, "prio": "0.2", "freq": "yearly",
     "title": "Politique de confidentialité — Chatterie British Kingdom",
     "desc": "Les données que nous collectons, leur usage, leur durée de conservation et comment exercer vos droits."},
]

if __name__ == "__main__":
    import donnees
    print("Génération du site :")
    # Les chats, portées et articles du moment, écrits dans les pages pour les robots qui
    # n'exécutent pas JavaScript (assistants d'IA notamment), puis le plan du site et llms.txt
    DONNEES = donnees.charger()
    ECRITES = donnees.injecter(PAGES, DONNEES, ico)
    print("  instantané des données de l'API : %d listes écrites dans les pages" % ECRITES)
    build(PAGES, DONNEES["jour"].isoformat() if DONNEES else MISE_A_JOUR, donnees.adresses_fiches(DONNEES, SITE["domaine"]))
    with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "llms.txt"), "w",
              encoding="utf-8", newline="\n") as fh:
        fh.write(donnees.llms(DONNEES, SITE, PAGES))
    print("  llms.txt à jour")
