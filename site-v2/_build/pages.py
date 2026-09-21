#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Contenu des pages du site Chatterie British Kingdom.
Lancer : python3 _build/pages.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import SITE, ico, page_head_block, build, crest_svg  # noqa: E402

T = SITE["tel"]
TL = SITE["tel_lien"]
MAIL = SITE["email"]

# ==========================================================================
# ACCUEIL
# ==========================================================================
ACCUEIL = """
<section class="hero scallop">
  <div class="wrap hero__grid">
    <div class="hero__text">
      <div class="hero__crest">%(crest)s</div>
      <p class="eyebrow">Élevage familial à %(ville)s, en %(region)s</p>
      <h1>Des British élevés dans la maison, au milieu des câlins</h1>
      <p class="hero__lede">British Shorthair et British Longhair inscrits au LOOF. Nos chatons grandissent
        dans le bruit de la vie de famille et partent à douze semaines, prêts à aimer la vôtre.</p>
      <div class="hero__cta">
        <a class="btn btn--copper" href="chatons.html">Voir les chatons</a>
        <a class="btn btn--ghost" href="le-british.html">Découvrir la race</a>
      </div>
      <p class="hero__marks">
        <span>%(check)s Pedigree LOOF</span>
        <span>%(check)s Parents dépistés</span>
        <span>%(check)s Départ à 12 semaines</span>
        <span>%(check)s Élevage déclaré</span>
      </p>
    </div>
    <div class="hero__media">
      <div class="hero__blob">
        <video id="hero-video" autoplay muted loop playsinline preload="metadata" poster="assets/hero-poster.webp"
               aria-hidden="true" tabindex="-1">
          <source src="assets/hero.mp4" type="video/mp4">
        </video>
      </div>
      <span class="hero__sticker hero__sticker--1" aria-hidden="true"></span>
      <span class="hero__sticker hero__sticker--2" aria-hidden="true"></span>
    </div>
  </div>
</section>

<section class="tight">
  <div class="wrap">
    <div class="split split--wide-text">
      <div class="reveal">
        <p class="eyebrow">Nos chatons</p>
        <h2>Ceux qui cherchent une famille</h2>
        <p class="lede" id="home-kitten-count">Chargement…</p>
        <p><a class="link-arrow" href="chatons.html">Toutes nos portées</a></p>
      </div>
      <div class="reveal" data-delay="1">
        <div class="sheet">
          <h3>Comment ça se passe</h3>
          <ol class="steps" style="gap:1.1rem">
            <li><h3>On échange</h3><p>Par téléphone ou par mail, sans engagement. On parle de votre foyer et de ce que vous cherchez.</p></li>
            <li><h3>Vous venez les voir</h3><p>Sur rendez-vous, chez nous. Vous rencontrez la mère et vous voyez où ils grandissent.</p></li>
            <li><h3>Il vous rejoint</h3><p>À douze semaines, identifié, vacciné, avec son pedigree et tout son dossier.</p></li>
          </ol>
        </div>
      </div>
    </div>
    <div id="home-kittens" style="margin-top:2.6rem"></div>
  </div>
</section>

<section class="panel panel--mint paws scallop scallop--to-paper">
  <div class="wrap">
    <div class="center" style="max-width:56ch;margin-inline:auto">
      <p class="eyebrow center">Pourquoi nous</p>
      <h2>Un élevage qui se regarde de près</h2>
      <p class="lede" style="margin-inline:auto">Nous faisons peu de portées, nous testons nos reproducteurs et
        nous vous montrons tout. Un élevage sérieux n'a rien à cacher, et surtout pas ses résultats.</p>
      <div class="divider" aria-hidden="true"></div>
    </div>
    <div class="grid grid-3" style="margin-top:2rem">
      <div class="feature reveal">
        <span class="feature__icon">%(stetho)s</span>
        <h3>Des parents dépistés</h3>
        <p>Échographie cardiaque pour la HCM, test ADN pour la PKD, dépistage FIV et FeLV, groupe sanguin.
          Les résultats et leurs dates figurent sur la fiche de chaque reproducteur.</p>
      </div>
      <div class="feature reveal" data-delay="1">
        <span class="feature__icon">%(home)s</span>
        <h3>Élevés à la maison</h3>
        <p>Pas de chatterie séparée. Aspirateur, enfants, visiteurs, télévision : nos chatons connaissent
          déjà tout cela le jour de leur départ.</p>
      </div>
      <div class="feature reveal" data-delay="2">
        <span class="feature__icon">%(book)s</span>
        <h3>Tout est écrit</h3>
        <p>Contrat lisible avant réservation, certificat d'engagement, certificat vétérinaire de moins de huit
          jours, pedigree LOOF. Aucune promesse qu'on ne pourrait pas tenir.</p>
      </div>
      <div class="feature reveal">
        <span class="feature__icon">%(clock)s</span>
        <h3>Douze semaines, jamais huit</h3>
        <p>La loi autorise huit semaines. Nous gardons nos chatons quatre semaines de plus, le temps du
          deuxième vaccin et de la vraie socialisation.</p>
      </div>
      <div class="feature reveal" data-delay="1">
        <span class="feature__icon">%(heart)s</span>
        <h3>Nous reprenons nos chats</h3>
        <p>À n'importe quel âge et quelle que soit la raison, plutôt que de les savoir en refuge ou sur
          une petite annonce. C'est écrit dans le contrat.</p>
      </div>
      <div class="feature reveal" data-delay="2">
        <span class="feature__icon">%(shield)s</span>
        <h3>Joignables après</h3>
        <p>Une question à trois mois, à trois ans ou à dix ans : vous avez notre numéro et nous répondons.
          C'est la partie du métier que nous préférons.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="split split--media-first">
      <div class="split__media reveal">
        <div class="frame"><div class="arch arch--wide">
          <img src="assets/photo-chaton-lierre.webp" alt="Chaton British Shorthair blanc dans le jardin" data-guard>
        </div></div>
      </div>
      <div class="reveal" data-delay="1">
        <p class="eyebrow">La race</p>
        <h2>Le chat qui vous suit de pièce en pièce, sans rien demander</h2>
        <p>Le British est un chat posé. Il ne saute pas sur les meubles, il ne réclame pas, il ne crie pas.
          Il s'installe dans la pièce où vous êtes et il attend. Cette discrétion, c'est sa force en
          appartement et son piège : un British qui s'ennuie ne se plaint pas, il dort et il grossit.</p>
        <p>Shorthair ou Longhair, c'est le même chat sous deux fourrures. Les deux naissent dans les mêmes
          portées, et le choix tient au brossage que vous êtes prêt à lui offrir.</p>
        <p><a class="link-arrow" href="le-british.html">Tout savoir sur le British</a></p>
      </div>
    </div>
  </div>
</section>

<section class="tight">
  <div class="wrap">
    <div class="grid grid-3">
      <a class="tile reveal" href="nos-chats.html">
        <img src="assets/photo-male.webp" alt="British Shorthair bleu aux yeux cuivre" data-guard>
        <span class="tile__text"><h3>Nos chats</h3><p>Les reproducteurs, leurs tests, leurs origines</p></span>
      </a>
      <a class="tile reveal" data-delay="1" href="chatons.html">
        <img src="assets/photo-chaton.webp" alt="Chaton British Shorthair blanc" data-guard>
        <span class="tile__text"><h3>Les chatons</h3><p>Portées en cours et chatons disponibles</p></span>
      </a>
      <a class="tile reveal" data-delay="2" href="adopter.html">
        <img src="assets/photo-femelle.webp" alt="British Shorthair sur un arbre à chat" data-guard>
        <span class="tile__text"><h3>Adopter</h3><p>Conditions, santé, garanties, liste d'attente</p></span>
      </a>
    </div>
  </div>
</section>

<section class="panel panel--butter" id="temoignages-section">
  <div class="wrap">
    <p class="eyebrow">Livre d'or</p>
    <h2>Des nouvelles de nos chatons</h2>
    <div id="testimonials" style="margin-top:1.8rem"></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="split">
      <div class="reveal">
        <p class="eyebrow">Nos chats</p>
        <h2>Les reproducteurs de la chatterie</h2>
        <p class="lede">Chaque fiche indique la robe et son code EMS, la couleur des yeux, la date de
          naissance et les dépistages. C'est ce qu'un éleveur doit pouvoir montrer.</p>
        <p><a class="link-arrow" href="nos-chats.html">Voir tous nos chats</a></p>
      </div>
      <div class="reveal" data-delay="1">
        <div id="home-cats"></div>
      </div>
    </div>
  </div>
</section>

<section class="panel panel--lilac">
  <div class="wrap center" style="max-width:54ch;margin-inline:auto">
    <h2>Une question, un projet d'adoption ?</h2>
    <p class="lede" style="margin-inline:auto">Nous répondons à tout le monde, même quand nous n'avons pas de
      chaton disponible. Et nous préférons vous dire franchement d'attendre plutôt que de vous faire patienter pour rien.</p>
    <div class="row" style="justify-content:center;margin-top:1.6rem">
      <a class="btn btn--copper" href="contact.html">Nous écrire</a>
      <a class="btn btn--ghost" href="tel:%(tel_lien)s">%(phone)s %(tel)s</a>
    </div>
  </div>
</section>
""" % {
    "crest": crest_svg(), "ville": SITE["ville"], "region": SITE["region"],
    "check": ico("check", 14), "stetho": ico("stetho", 30), "home": ico("home", 30),
    "book": ico("book", 30), "clock": ico("clock", 30), "heart": ico("heart", 30),
    "shield": ico("shield", 30), "tel": T, "tel_lien": TL, "phone": ico("phone", 16),
}

# ==========================================================================
# LE BRITISH
# ==========================================================================
LE_BRITISH = page_head_block(
    "La race",
    "Le British, en toute honnêteté",
    "Ses qualités, ses défauts, ce qu'il demande vraiment. Lisez cette page avant de nous écrire : elle vous évitera peut-être une erreur.",
    [("index.html", "Accueil"), (None, "Le British")],
) + """
<section class="tight">
  <div class="wrap">
    <div class="split split--wide-text">
      <div class="prose reveal">
        <h2>Un tempérament, pas seulement une tête ronde</h2>
        <p>Le British Shorthair est un chat calme, égal, sans excès. Il joue, mais par courtes séquences.
          Il est affectueux, mais à sa façon : il s'installe à côté de vous plutôt que sur vous, et beaucoup
          de British n'aiment pas être portés. Si vous cherchez un chat qui vous attend sur l'épaule toute la
          soirée, ce n'est pas la bonne race.</p>
        <p>C'est un chat silencieux. Il miaule peu et rarement fort. Cette réserve explique sa réputation de
          chat facile, et elle impose une vigilance : un British malade, en surpoids ou qui s'ennuie ne le
          fera pas savoir. C'est à vous de le remarquer.</p>

        <h2>Shorthair ou Longhair : le même chat, deux fourrures</h2>
        <p>Le British Longhair n'est pas une autre race dans l'esprit de l'élevage : c'est un British porteur
          du gène poil long. Deux Shorthair porteurs peuvent donner des Longhair dans la même portée.
          Même morphologie, même caractère, même standard, sauf la longueur du poil.</p>
        <p>La vraie différence est pour vous : un Shorthair demande un bon brossage par semaine, deux ou
          trois pendant la mue. Un Longhair demande un brossage tous les deux jours, surtout derrière les
          oreilles et sur les culottes, sous peine de nœuds qu'il faudra couper.</p>

        <h2>La morphologie en quelques mots</h2>
        <p>Corps compact et musclé posé sur des pattes courtes et fortes. Tête ronde, joues pleines,
          petites oreilles arrondies bien écartées, nez court et droit. De grands yeux ronds, cuivre chez
          les robes classiques, verts chez les silver et golden, bleus chez les colourpoint. Une fourrure
          dense, qui se relève sous la main : c'est la signature de la race.</p>

        <h2>Les couleurs, et ce fameux code EMS</h2>
        <p>Le British existe dans des dizaines de robes. Sur chaque fiche de ce site, vous trouverez le nom
          courant et le code EMS entre parenthèses, la notation officielle utilisée par le LOOF.
          <em>BRI</em> désigne le British, la lettre qui suit la couleur de base, les chiffres le patron.</p>
      </div>
      <div class="reveal" data-delay="1">
        <div class="sheet">
          <h3>Les robes les plus courantes</h3>
          <dl class="facts">
            <div><dt>Bleu</dt><dd>BRI a</dd></div>
            <div><dt>Lilas</dt><dd>BRI c</dd></div>
            <div><dt>Chocolat</dt><dd>BRI b</dd></div>
            <div><dt>Noir</dt><dd>BRI n</dd></div>
            <div><dt>Crème</dt><dd>BRI e</dd></div>
            <div><dt>Roux</dt><dd>BRI d</dd></div>
            <div><dt>Cinnamon</dt><dd>BRI o</dd></div>
            <div><dt>Fawn</dt><dd>BRI p</dd></div>
            <div><dt>Écaille de tortue</dt><dd>BRI f</dd></div>
            <div><dt>Black silver shaded</dt><dd>BRI ns 11</dd></div>
            <div><dt>Golden shaded</dt><dd>BRI ny 11</dd></div>
            <div><dt>Colourpoint bleu</dt><dd>BRI a 33</dd></div>
            <div><dt>Bicolore bleu et blanc</dt><dd>BRI a 03</dd></div>
          </dl>
          <p class="small" style="margin-top:1rem">La couleur définitive des yeux n'est établie que vers
            trois à quatre mois. Avant cela, tous les chatons ont les yeux bleus.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="panel panel--mint">
  <div class="wrap">
    <p class="eyebrow">Au quotidien</p>
    <h2>Ce qu'il demande vraiment</h2>
    <div class="grid grid-3" style="margin-top:1.8rem">
      <div class="feature reveal">
        <h3>Le poids, sa vraie faiblesse</h3>
        <p>Race lourde et peu dépensière, le British prend du poids très facilement. Pas de nourriture à
          volonté à l'âge adulte, des jouets qui le font courir, et une pesée régulière.</p>
      </div>
      <div class="feature reveal" data-delay="1">
        <h3>Le brossage</h3>
        <p>Un peigne ou une brosse qui atteint le sous-poil : un gant ne suffit pas. Une fois par semaine,
          deux ou trois pendant la mue. Tous les deux jours pour un Longhair.</p>
      </div>
      <div class="feature reveal" data-delay="2">
        <h3>L'appartement</h3>
        <p>Il y est très bien : calme, peu grimpeur, il ne cherche pas à sortir. Il lui faut des points
          d'observation en hauteur et un vrai temps de jeu quotidien. Un balcon se sécurise par un filet.</p>
      </div>
      <div class="feature reveal">
        <h3>Les enfants</h3>
        <p>Patient, il ne griffe pratiquement jamais : quand il en a assez, il part. C'est ce qu'il faut
          apprendre aux enfants, le laisser partir et ne jamais le poursuivre.</p>
      </div>
      <div class="feature reveal" data-delay="1">
        <h3>Les autres animaux</h3>
        <p>Peu bagarreur, il s'entend avec chiens et chats. Comptez une à trois semaines d'introduction
          progressive : c'est en général le résident qui a besoin de temps, pas lui.</p>
      </div>
      <div class="feature reveal" data-delay="2">
        <h3>La solitude</h3>
        <p>Si personne n'est à la maison la journée, prenez-en deux. Deux chatons se dépensent et se
          calment mutuellement, et le travail pour vous est à peine doublé.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap wrap--narrow">
    <div class="callout reveal">
      <p><strong>Un mot sur les allergies.</strong> Aucune race n'est hypoallergénique, le British pas plus
        qu'une autre. L'allergie vient d'une protéine de la salive et des squames, pas de la longueur du
        poil : un Shorthair n'est donc pas moins allergisant qu'un Longhair. Si quelqu'un du foyer est
        allergique, consultez un allergologue avant de vous engager, puis venez passer un moment chez nous.
        Nous préférons mille fois une visite qui se conclut par un non qu'un chaton rendu trois mois plus tard.</p>
    </div>
    <div class="center" style="margin-top:2.4rem">
      <a class="btn btn--copper" href="nos-chats.html">Voir nos chats</a>
      <a class="btn btn--ghost" href="adopter.html">Conditions d'adoption</a>
    </div>
  </div>
</section>
"""

# ==========================================================================
# NOS CHATS
# ==========================================================================
NOS_CHATS = page_head_block(
    "La chatterie",
    "Nos chats",
    "Nos reproducteurs, avec leur robe, leur code EMS, leur âge et leurs dépistages. Cliquez sur un chat pour voir sa fiche complète et ses portées.",
    [("index.html", "Accueil"), (None, "Nos chats")],
) + """
<section class="tight">
  <div class="wrap">
    <div class="filters" id="cats-filters">
      <button class="chip" type="button" data-filter="tous" aria-pressed="true">Tous</button>
      <button class="chip" type="button" data-filter="male" aria-pressed="false">Mâles</button>
      <button class="chip" type="button" data-filter="female" aria-pressed="false">Femelles</button>
      <span class="count-note" id="cats-count"></span>
    </div>
    <div id="cats-list"></div>
  </div>
</section>

<section class="panel panel--mint tight">
  <div class="wrap wrap--narrow center">
    <h2>Pourquoi si peu de chats ?</h2>
    <p class="lede" style="margin-inline:auto">Parce qu'un élevage familial ne peut pas bien s'occuper de
      vingt reproducteurs. Nos femelles vivent dans la maison, font peu de portées et partent en retraite
      stérilisées, chez nous ou dans une famille choisie.</p>
    <p style="margin-top:1.4rem"><a class="link-arrow" href="adopter.html#sante">Nos dépistages en détail</a></p>
  </div>
</section>
"""

# ==========================================================================
# FICHE CHAT
# ==========================================================================
FICHE_CHAT = """
<section class="page-head">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <span><a href="index.html">Accueil</a></span>
      <span><a href="nos-chats.html">Nos chats</a></span>
      <span id="cat-breadcrumb-name">Fiche</span>
    </nav>
  </div>
</section>
<section class="tight" style="padding-top:0">
  <div class="wrap"><div id="cat-detail"></div></div>
</section>
<section class="panel panel--lilac tight">
  <div class="wrap wrap--narrow center">
    <h2>Une question sur ce chat ?</h2>
    <p class="lede" style="margin-inline:auto">Ses tests, ses origines, ses portées à venir : demandez-nous, nous répondons précisément.</p>
    <p style="margin-top:1.4rem"><a class="btn btn--copper" href="contact.html">Nous écrire</a></p>
  </div>
</section>
"""

# ==========================================================================
# CHATONS
# ==========================================================================
CHATONS = page_head_block(
    "Chatons",
    "Nos portées",
    "Chaque portée avec ses parents, l'âge des chatons et leur disponibilité. Un chaton réservé reste affiché : c'est la vie de la chatterie, pas une vitrine.",
    [("index.html", "Accueil"), (None, "Chatons")],
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap">
    <div id="kittens-summary" style="margin-bottom:1.6rem"></div>
    <div id="litters"></div>
  </div>
</section>

<section class="panel panel--butter">
  <div class="wrap">
    <div class="split">
      <div class="reveal">
        <p class="eyebrow">Ce qui est compris</p>
        <h2>Ce que votre chaton emporte</h2>
        <ul class="stack" style="list-style:none;padding:0;gap:.7rem;margin:1.4rem 0 0">
          <li>Pedigree LOOF, ou certificat de naissance en attendant l'édition</li>
          <li>Puce électronique et enregistrement I-CAD à votre nom</li>
          <li>Deux injections de vaccin faites, typhus et coryza</li>
          <li>Vermifugé régulièrement depuis l'âge de trois semaines</li>
          <li>Certificat vétérinaire de bonne santé de moins de huit jours</li>
          <li>Carnet de santé, attestation de cession et contrat signé</li>
          <li>Document d'information sur les besoins de l'espèce</li>
          <li>De la nourriture et un peu de litière pour les premiers jours</li>
        </ul>
      </div>
      <div class="reveal" data-delay="1">
        <div class="sheet">
          <h3>Les statuts affichés</h3>
          <dl class="facts">
            <div><dt>Disponible</dt><dd class="free">Aucune réservation en cours</dd></div>
            <div><dt>Réservé</dt><dd class="free">Acompte versé par une famille</dd></div>
            <div><dt>Reste à la chatterie</dt><dd class="free">Gardé pour l'élevage</dd></div>
            <div><dt>Adopté</dt><dd class="free">Parti dans sa famille</dd></div>
          </dl>
          <p class="small" style="margin-top:1rem">Les chatons partent à partir de douze semaines,
            jamais avant. La loi autorise huit semaines ; nous gardons quatre semaines de plus.</p>
          <p style="margin-top:1rem"><a class="btn btn--sm btn--copper" href="adopter.html#liste-attente">Rejoindre la liste d'attente</a></p>
        </div>
      </div>
    </div>
  </div>
</section>
"""

# ==========================================================================
# PORTÉE
# ==========================================================================
PORTEE = """
<section class="page-head">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <span><a href="index.html">Accueil</a></span>
      <span><a href="chatons.html">Chatons</a></span>
      <span id="litter-breadcrumb-name">Portée</span>
    </nav>
  </div>
</section>
<section class="tight" style="padding-top:0">
  <div class="wrap"><div id="litter-detail"></div></div>
</section>
<section class="panel panel--butter tight">
  <div class="wrap wrap--narrow center">
    <h2>Un chaton vous plaît ?</h2>
    <p class="lede" style="margin-inline:auto">Écrivez-nous en nous parlant un peu de vous. Nous vous
      rappelons et nous vous proposons une visite avant toute réservation.</p>
    <p style="margin-top:1.4rem"><a class="btn btn--copper" href="contact.html">Nous écrire</a></p>
  </div>
</section>
"""

# ==========================================================================
# ADOPTER (conditions, santé, garanties, liste d'attente, FAQ)
# ==========================================================================
ADOPTER = page_head_block(
    "Adopter",
    "Adopter un chaton chez nous",
    "Les étapes, les conditions, ce que nous dépistons et ce que nous garantissons. Tout est écrit ici, avant que vous nous écriviez.",
    [("index.html", "Accueil"), (None, "Adopter")],
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap">
    <div class="split split--wide-text">
      <div class="reveal">
        <h2>Les six étapes</h2>
        <ol class="steps" style="margin-top:1.6rem">
          <li><h3>Vous nous écrivez</h3><p>Présentez-vous en quelques lignes : votre foyer, vos autres animaux,
            ce que vous cherchez. Plus vous êtes précis, mieux nous vous orientons.</p></li>
          <li><h3>Nous échangeons</h3><p>Par téléphone le plus souvent. Nous vous disons franchement ce que
            nous avons, ce que nous n'avons pas, et combien de temps il faudra attendre.</p></li>
          <li><h3>Vous venez nous voir</h3><p>Sur rendez-vous. Vous rencontrez la mère, vous voyez où les
            chatons grandissent, vous posez toutes vos questions. Nous y tenons beaucoup.</p></li>
          <li><h3>La réservation</h3><p>Versement de l'acompte de %(acompte)s, déduit du prix du chaton. Nous cessons
            alors de le proposer. Vous recevez le contrat et le certificat d'engagement à signer.</p></li>
          <li><h3>Le délai de réflexion</h3><p>La loi impose sept jours entre la signature du certificat
            d'engagement et de connaissance et la remise du chaton. Ce délai est fait pour vous.</p></li>
          <li><h3>Le départ, à douze semaines</h3><p>Vous repartez avec le chaton, son dossier complet et
            notre numéro. Nous restons joignables, y compris dans dix ans.</p></li>
        </ol>
      </div>
      <div class="reveal" data-delay="1">
        <div class="sheet">
          <h3>Nos conditions</h3>
          <dl class="facts">
            <div><dt>Départ</dt><dd>à partir de 12 semaines</dd></div>
            <div><dt>Acompte</dt><dd>%(acompte)s</dd></div>
            <div><dt>Visite</dt><dd>sur rendez-vous</dd></div>
            <div><dt>Vie</dt><dd>en intérieur</dd></div>
            <div><dt>Pedigree</dt><dd>LOOF pour tous</dd></div>
            <div><dt>Contrat</dt><dd>lisible avant réservation</dd></div>
          </dl>
          <p class="small" style="margin-top:1rem">Nous confions nos chatons à des foyers qui acceptent une
            vie en intérieur, avec balcon sécurisé le cas échéant. Nous reprenons nos chats à tout âge si
            vous ne pouvez plus les assumer.</p>
          <p style="margin-top:1.2rem"><a class="btn btn--copper" href="contact.html">Commencer par un message</a></p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="panel panel--sky" id="sante">
  <div class="wrap">
    <p class="eyebrow">Santé</p>
    <h2>Ce que nous dépistons, et pourquoi</h2>
    <p class="lede">Un élevage sérieux teste ses reproducteurs et montre ses résultats, avec leur date et le
      laboratoire. Les fiches de nos chats portent ces informations. Voici ce qu'elles veulent dire.</p>

    <div class="grid grid-2" style="margin-top:2rem">
      <div class="sheet reveal">
        <h3>La cardiomyopathie hypertrophique</h3>
        <p>C'est la maladie cardiaque la plus fréquente chez le chat, et le British y est prédisposé.
          Elle se dépiste par <strong>échographie du cœur réalisée par un vétérinaire cardiologue</strong>,
          répétée dans le temps, car un chat sain à deux ans peut se déclarer plus tard.</p>
        <p class="small">Méfiez-vous d'un élevage qui annonce un « test ADN HCM » chez le British : les tests
          génétiques existants concernent d'autres races. Chez le British, seule l'échographie fait foi.</p>
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
          protéger les chatons à la naissance. Nos groupes figurent sur les fiches.</p>
      </div>
      <div class="sheet reveal" data-delay="1">
        <h3>FIV, FeLV et le quotidien</h3>
        <p>Nos reproducteurs sont dépistés FIV et FeLV. Nos chats vivent en intérieur, ce qui écarte
          l'essentiel du risque de contamination.</p>
        <p class="small">Vaccination à jour, vermifuges réguliers, suivi vétérinaire et registre sanitaire :
          c'est la routine invisible d'un élevage, celle qui ne se voit pas sur les photos.</p>
      </div>
    </div>

    <div class="callout reveal" style="margin-top:2rem">
      <p><strong>Ce que nous ne promettrons jamais.</strong> Aucun éleveur honnête ne peut garantir un chat
        « sans maladie génétique » ni « en bonne santé à vie ». Ce que nous garantissons, c'est la
        transparence de nos dépistages, un chaton examiné par un vétérinaire dans les huit jours avant son
        départ, et le fait de rester joignables. Les garanties légales, vices rédhibitoires et garantie de
        conformité, s'appliquent de plein droit et figurent dans notre contrat.</p>
    </div>
  </div>
</section>

<section id="liste-attente">
  <div class="wrap">
    <div class="split split--media-first">
      <div class="split__media reveal">
        <div class="frame"><div class="arch arch--wide">
          <img src="assets/photo-chaton-feuilles.webp" alt="Chaton British dans les feuilles du jardin" data-guard>
        </div></div>
      </div>
      <div class="reveal" data-delay="1">
        <p class="eyebrow">Liste d'attente</p>
        <h2>Être prévenu avant tout le monde</h2>
        <p>Nous faisons peu de portées et nos chatons partent souvent avant leur naissance. La liste
          d'attente sert à donner la priorité aux familles réellement engagées, plutôt qu'à écrire à
          cinquante personnes à chaque naissance.</p>
        <p>En versant l'acompte de %(acompte)s, vous rejoignez la liste et devenez prioritaire dès qu'un chaton
          correspond à ce que vous cherchez. Cette somme est déduite du prix le jour où vous choisissez
          votre chaton.</p>
        <ul class="stack" style="list-style:none;padding:0;gap:.6rem;margin:1.2rem 0">
          <li>Nous vous proposons jusqu'à trois chatons correspondant à vos critères</li>
          <li>Après trois refus, votre place sur la liste est libérée</li>
          <li>L'acompte n'est pas remboursable une fois versé</li>
          <li>Plus vous êtes ouvert sur la couleur et le sexe, plus l'attente est courte</li>
        </ul>
        <p class="small">Ces conditions vous sont remises par écrit avant tout versement. Lisez-les, et
          posez-nous vos questions : nous préférons un échange franc à une réservation précipitée.</p>
        <p style="margin-top:1.2rem"><a class="btn btn--copper" href="contact.html?sujet=Liste%%20d%%27attente">Rejoindre la liste d'attente</a></p>
      </div>
    </div>
  </div>
</section>

<section class="panel panel--mint">
  <div class="wrap">
    <p class="eyebrow">Le jour J</p>
    <h2>Préparer son arrivée</h2>
    <div class="grid grid-3" style="margin-top:1.8rem">
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
      <div class="feature reveal" data-delay="2"><h3>Et nous</h3><p>Envoyez-nous des nouvelles et des photos.
        Et appelez-nous à la moindre inquiétude : c'est exactement pour ça que nous laissons notre numéro.</p></div>
    </div>
  </div>
</section>

<section id="faq">
  <div class="wrap wrap--narrow">
    <p class="eyebrow">Questions fréquentes</p>
    <h2>Ce qu'on nous demande le plus souvent</h2>
    <div style="margin-top:1.8rem">
%(faq)s
    </div>
    <p class="small" style="margin-top:2rem">Une question qui n'est pas là ? Écrivez-nous, nous répondons à
      tout le monde, même quand nous n'avons pas de chaton disponible.</p>
  </div>
</section>
"""

FAQ_ITEMS = [
    ("Combien coûte un chaton chez vous ?",
     "<p>Le prix dépend de la couleur, du sexe et du type, Shorthair ou Longhair. Les robes les plus "
     "recherchées, golden, silver shaded, colourpoint et bicolore, sont en haut de la fourchette. "
     "Appelez-nous, nous vous donnons le prix exact du chaton qui vous intéresse.</p>"
     "<p>Ce prix couvre les dépistages des parents, la saillie, le suivi vétérinaire de la portée, "
     "l'identification, les vaccins, la nourriture et l'inscription au LOOF. Nous ne faisons ni promotion "
     "ni remise : un chaton n'est pas une marchandise qu'on solde.</p>"),
    ("Faut-il adopter un ou deux chatons ?",
     "<p>Si personne n'est à la maison la journée, deux, sans hésiter. Un British s'ennuie en silence : il "
     "ne miaule pas, il dort, il mange, il grossit. Deux chatons de la même portée se dépensent, se lavent "
     "et se calment mutuellement, et le travail pour vous est à peine doublé.</p>"
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
     "partir, ne pas le poursuivre, ne pas le porter comme une poupée. Un British bien respecté revient "
     "toujours de lui-même.</p>"),
    ("Et avec un chien, ou avec mes autres chats ?",
     "<p>Très bien, avec de la méthode. On installe le chaton dans une pièce à lui pendant quelques jours, "
     "on échange les odeurs avec une couverture ou un jouet, puis on fait des rencontres courtes et "
     "surveillées à travers une porte entrouverte avant le face-à-face.</p>"
     "<p>Comptez une à trois semaines pour une cohabitation sereine. Le British est peu bagarreur : c'est "
     "en général le résident qui a besoin de temps, pas lui.</p>"),
    ("Le British est-il hypoallergénique ?",
     "<p>Non, et aucune race ne l'est vraiment. L'allergie vient d'une protéine de la salive et des "
     "squames, pas du poil : un Shorthair n'est donc pas moins allergisant qu'un Longhair.</p>"
     "<p>Si quelqu'un du foyer est allergique, parlez-en à un allergologue avant de vous engager, et venez "
     "passer un moment chez nous. Nous préférons mille fois une visite qui se conclut par un non qu'un "
     "chaton rendu trois mois plus tard.</p>"),
    ("Est-ce qu'il perd beaucoup ses poils ?",
     "<p>Oui, comme tous les chats, et davantage au printemps et à l'automne. La fourrure du British est "
     "dense, avec un sous-poil épais : un bon brossage par semaine en temps normal, deux ou trois pendant "
     "la mue, avec un peigne ou une brosse qui atteint le sous-poil. Un gant ne suffit pas.</p>"
     "<p>Le British Longhair demande un brossage tous les deux jours, surtout derrière les oreilles et sur "
     "les culottes. C'est dix minutes, et la plupart des chats finissent par aimer ça.</p>"),
    ("Que mange-t-il, et puis-je changer de nourriture ?",
     "<p>Nos chatons partent avec de quoi tenir les premiers jours. Si vous souhaitez changer, faites-le "
     "progressivement sur dix à quinze jours en mélangeant les deux aliments.</p>"
     "<p>Une règle compte plus que la marque : de l'eau fraîche toujours disponible, loin de la gamelle, et "
     "pas de grignotage à volonté à l'âge adulte. Le British prend du poids très facilement.</p>"),
    ("J'habite loin, comment le chaton peut-il me rejoindre ?",
     "<p>Vous venez le chercher, c'est ce que nous préférons de loin : vous voyez où il a grandi. Nous "
     "pouvons aussi l'accompagner jusqu'à une gare ou un aéroport proches, ou vous orienter vers un taxi "
     "animalier professionnel, à vos frais.</p>"
     "<p>Nous n'expédions jamais un chaton seul en soute. Pour un départ vers la Belgique ou la Suisse, "
     "comptez plus de douze semaines : la vaccination antirabique et son délai de validité l'imposent.</p>"),
    ("Peut-on venir voir les chatons avant de décider ?",
     "<p>Oui, et nous y tenons. Les visites se font sur rendez-vous, une fois que les chatons sont assez "
     "grands. Vous verrez où ils vivent, vous rencontrerez leur mère, vous poserez toutes vos questions.</p>"
     "<p>Deux règles d'hygiène simples : ne venez pas le jour où vous avez visité un autre élevage ou un "
     "refuge, et on se lave les mains en arrivant. Les chatons sont fragiles jusqu'à leur deuxième vaccin.</p>"),
    ("Comment réserve-t-on, et à quoi sert l'acompte ?",
     "<p>Après notre échange et, idéalement, une visite, la réservation se fait par le versement de "
     "l'acompte, qui est déduit du prix du chaton. Il bloque le chaton à votre nom : nous cessons de le "
     "proposer.</p>"
     "<p>Nous signons ensuite le certificat d'engagement et de connaissance, et la loi impose un délai de "
     "réflexion de sept jours avant le départ. Les conditions vous sont remises par écrit avant tout "
     "versement.</p>"),
    ("Combien de temps faut-il attendre ?",
     "<p>Cela dépend de ce que vous cherchez. Si vous voulez une couleur précise, l'attente est plus "
     "longue ; si vous êtes ouvert sur la couleur et le sexe, elle est souvent bien plus courte.</p>"
     "<p>Nous faisons peu de portées par an, délibérément : nos femelles ne sont pas des machines. Nous "
     "vous disons franchement dès le premier échange combien de temps il faudra patienter.</p>"),
    ("Quelles garanties avez-vous sur la santé du chaton ?",
     "<p>Le chaton part avec un certificat vétérinaire établi dans les huit jours avant son départ, "
     "identifié, vacciné et vermifugé. Ses parents sont dépistés et les résultats figurent sur leurs "
     "fiches.</p>"
     "<p>Les garanties légales, vices rédhibitoires et garantie de conformité, s'appliquent, et le détail "
     "figure dans notre contrat que vous pouvez lire avant de vous engager. Nous ne vous promettrons jamais "
     "un chat garanti en bonne santé à vie : aucun éleveur honnête ne le peut.</p>"),
    ("Et si je ne peux plus m'occuper de mon chat, un jour ?",
     "<p>Vous nous appelez. Nous reprenons nos chats, à n'importe quel âge et quelle que soit la raison, "
     "plutôt que de les savoir en refuge ou sur une petite annonce. C'est écrit dans notre contrat.</p>"),
    ("Un chaton Longhair peut-il naître de deux Shorthair ?",
     "<p>Oui. Le poil long est un caractère récessif : deux British Shorthair porteurs du gène peuvent "
     "donner des Longhair dans la même portée. C'est le même chat, la même race et le même standard, avec "
     "une fourrure plus longue et un brossage plus régulier.</p>"),
]

FAQ_HTML = "\n".join(
    '      <details class="faq"><summary>%s</summary><div class="faq__body">%s</div></details>'
    % (q, a) for q, a in FAQ_ITEMS
)

ADOPTER = ADOPTER % {"acompte": SITE["acompte"], "faq": FAQ_HTML}

# ==========================================================================
# JOURNAL (blog) et ARTICLE
# ==========================================================================
BLOG = page_head_block(
    "Journal",
    "Le journal de la chatterie",
    "Nos conseils d'élevage, la vie des portées et ce que nous apprenons au fil des années.",
    [("index.html", "Accueil"), (None, "Journal")],
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap"><div id="blog-list"></div></div>
</section>
"""

ARTICLE = """
<section class="page-head">
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
      <span><a href="index.html">Accueil</a></span>
      <span><a href="blog.html">Journal</a></span>
      <span id="article-breadcrumb-name">Article</span>
    </nav>
  </div>
</section>
<section class="tight" style="padding-top:0">
  <div class="wrap wrap--narrow"><article id="article-body"></article>
    <p style="margin-top:2.6rem"><a class="link-arrow" href="blog.html">Tous les articles</a></p>
  </div>
</section>
"""

# ==========================================================================
# CONTACT
# ==========================================================================
CONTACT = page_head_block(
    "Contact",
    "Parlons de votre projet",
    "Nous répondons à tout le monde, même quand nous n'avons pas de chaton disponible. Présentez-vous en quelques lignes : c'est ainsi que commencent nos plus belles adoptions.",
    [("index.html", "Accueil"), (None, "Contact")],
) + """
<section class="tight" style="padding-top:0">
  <div class="wrap">
    <div class="split split--wide-text">
      <div class="reveal">
        <form id="contact-form" novalidate>
          <div class="field">
            <label for="f-name">Votre nom</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required>
            <span class="error"></span>
          </div>
          <div class="field">
            <label for="f-email">Votre e-mail</label>
            <input id="f-email" name="email" type="email" autocomplete="email" required>
            <span class="error"></span>
          </div>
          <div class="field">
            <label for="f-num">Votre téléphone <span class="hint">facultatif, mais c'est plus simple pour échanger</span></label>
            <input id="f-num" name="num" type="tel" autocomplete="tel">
            <span class="error"></span>
          </div>
          <div class="field">
            <label for="f-subject">Sujet</label>
            <input id="f-subject" name="subject" type="text" placeholder="Demande d'information, visite, liste d'attente…">
            <span class="error"></span>
          </div>
          <div class="field">
            <label for="f-message">Votre message</label>
            <textarea id="f-message" name="message" required
              placeholder="Dites-nous qui vous êtes, comment vit votre foyer, si vous avez déjà des animaux, et le chaton que vous recherchez."></textarea>
            <span class="error"></span>
          </div>
          <div class="honey" aria-hidden="true">
            <label for="f-website">Ne remplissez pas ce champ</label>
            <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off">
          </div>
          <button class="btn btn--copper" type="submit">Envoyer le message</button>
          <p class="form-note" style="margin-top:1rem">Vos coordonnées servent uniquement à vous répondre.
            Elles ne sont ni revendues ni utilisées pour de la publicité.
            Voir notre <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>
          <p id="contact-result" class="notice" hidden></p>
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
            <div><dt>Réponse</dt><dd>sous 48 heures</dd></div>
          </dl>
        </div>

        <div class="sheet" style="margin-top:1.4rem">
          <h3>Avant de nous écrire</h3>
          <p class="small">Ces trois pages répondent à la plupart des questions, et vous feront gagner du temps.</p>
          <ul class="stack" style="list-style:none;padding:0;gap:.6rem;margin:1rem 0 0;font-size:var(--t-sm)">
            <li><a class="link-arrow" href="le-british.html">Le caractère du British</a></li>
            <li><a class="link-arrow" href="adopter.html#sante">Nos dépistages et garanties</a></li>
            <li><a class="link-arrow" href="adopter.html#faq">Les questions fréquentes</a></li>
          </ul>
        </div>

        <div style="margin-top:1.4rem;border-radius:var(--radius);overflow:hidden;border:1px solid var(--line)">
          <iframe
            title="Emplacement de la chatterie à %(ville)s"
            src="https://www.google.com/maps?q=%(adresse_url)s&output=embed"
            width="100%%" height="300" style="border:0;display:block" loading="lazy"
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
      <li>SIRET : %(siret)s</li>
      <li>Téléphone : <a href="tel:%(tel_lien)s">%(tel)s</a></li>
      <li>E-mail : <a href="mailto:%(email)s">%(email)s</a></li>
      <li>Directeur de la publication : AMIEL Zeitoun</li>
    </ul>
    <!-- À COMPLÉTER PAR L'ÉLEVEUSE : numéro SIREN affiché dans les annonces de cession,
         numéro de déclaration DDPP, numéro ACACED ou de certificat de capacité,
         numéro de TVA intracommunautaire le cas échéant, adhésions professionnelles. -->

    <h2>Hébergement</h2>
    <p>Le site est hébergé par Microsoft Azure, Microsoft France SAS, 37 quai du Président Roosevelt,
      92130 Issy-les-Moulineaux, France.</p>

    <h2>Activité d'élevage</h2>
    <p>Les chatons proposés sur ce site sont inscrits au LOOF, Livre Officiel des Origines Félines.
      Conformément à la réglementation, l'âge minimum légal de cession d'un chaton est de huit semaines ;
      nos chatons partent à partir de douze semaines. Chaque cession donne lieu à la remise d'une
      attestation de cession, d'un certificat vétérinaire de bonne santé, du document d'information sur
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
    <!-- À COMPLÉTER PAR L'ÉLEVEUSE : nom et coordonnées du médiateur de la consommation choisi. -->

    <h2>Nous contacter</h2>
    <p>Pour toute question relative à ces mentions, écrivez-nous à
      <a href="mailto:%(email)s">%(email)s</a>.</p>
  </div>
</section>
""" % {
    "adresse": SITE["adresse"], "cp": SITE["cp"], "ville": SITE["ville"],
    "siret": SITE["siret"], "tel": T, "tel_lien": TL, "email": MAIL,
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

    <h2>Le formulaire de contact</h2>
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
    <p>Le site utilise également Google Analytics, qui dépose des cookies de mesure d'audience.
      <!-- À METTRE EN CONFORMITÉ : Google Analytics et la journalisation d'IP se déclenchent aujourd'hui
           dès le chargement de la page, sans recueil du consentement. Un bandeau de consentement doit être
           ajouté, ou la mesure d'audience remplacée par une solution exemptée de consentement. -->
    </p>

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
    {"file": "index.html", "body": ACCUEIL,
     "title": "Chatterie British Kingdom — Élevage de British Shorthair et Longhair à Othis (77)",
     "desc": "Élevage familial de chats British Shorthair et British Longhair en Seine-et-Marne. Chatons inscrits au LOOF, parents dépistés, départ à 12 semaines.",
     "scripts": '<script>BKPages.accueil();BKPages.temoignages("#testimonials",3);</script>'},

    {"file": "le-british.html", "body": LE_BRITISH,
     "title": "Le British Shorthair et Longhair — caractère, entretien, couleurs",
     "desc": "Tempérament, différences entre Shorthair et Longhair, robes et codes EMS, brossage, vie en appartement : tout ce qu'il faut savoir avant d'adopter un British."},

    {"file": "nos-chats.html", "body": NOS_CHATS,
     "title": "Nos chats — reproducteurs de la Chatterie British Kingdom",
     "desc": "Les mâles et femelles de notre élevage : robe et code EMS, couleur des yeux, âge, dépistages et portées.",
     "scripts": '<script>BKPages.nosChats();</script>'},

    {"file": "chat.html", "body": FICHE_CHAT,
     "title": "Fiche d'un chat — Chatterie British Kingdom",
     "desc": "Fiche détaillée d'un de nos reproducteurs British Shorthair ou Longhair : robe, origines, photos et portées.",
     "scripts": '<script>BKPages.ficheChat();</script>'},

    {"file": "chatons.html", "body": CHATONS,
     "title": "Chatons British Shorthair et Longhair disponibles — Chatterie British Kingdom",
     "desc": "Nos portées en cours, les chatons disponibles ou réservés, leurs parents et leur date de départ. Chatons inscrits au LOOF, départ à 12 semaines.",
     "scripts": '<script>BKPages.chatons();</script>'},

    {"file": "portee.html", "body": PORTEE,
     "title": "Une portée — Chatterie British Kingdom",
     "desc": "Les chatons d'une portée, leurs parents, leur âge et leur disponibilité, semaine après semaine.",
     "scripts": '<script>BKPages.portee();</script>'},

    {"file": "adopter.html", "body": ADOPTER,
     "title": "Adopter un chaton British — conditions, santé et garanties",
     "desc": "Les étapes de l'adoption, nos conditions, les dépistages de nos reproducteurs (HCM, PKD, groupes sanguins), la liste d'attente et les questions fréquentes."},

    {"file": "blog.html", "body": BLOG,
     "title": "Journal de la chatterie — conseils et vie de l'élevage",
     "desc": "Conseils d'élevage, entretien du poil, arrivée du chaton à la maison et nouvelles de nos portées.",
     "scripts": '<script>BKPages.blog();</script>'},

    {"file": "article.html", "body": ARTICLE,
     "title": "Article — Journal de la Chatterie British Kingdom",
     "desc": "Un article du journal de la Chatterie British Kingdom.",
     "scripts": '<script>BKPages.article();</script>'},

    {"file": "contact.html", "body": CONTACT,
     "title": "Contact — Chatterie British Kingdom, Othis (77)",
     "desc": "Écrivez-nous pour une question, une visite ou un projet d'adoption. Réponse sous 48 heures. Visites sur rendez-vous à Othis, en Seine-et-Marne.",
     "scripts": '<script>BKPages.prefillContact();</script>'},

    {"file": "mentions-legales.html", "body": MENTIONS,
     "title": "Mentions légales — Chatterie British Kingdom",
     "desc": "Éditeur, hébergeur, activité d'élevage et propriété intellectuelle du site de la Chatterie British Kingdom."},

    {"file": "politique-confidentialite.html", "body": CONFIDENTIALITE,
     "title": "Politique de confidentialité — Chatterie British Kingdom",
     "desc": "Les données que nous collectons, leur usage, leur durée de conservation et comment exercer vos droits."},
]

if __name__ == "__main__":
    print("Génération du site :")
    build(PAGES)
