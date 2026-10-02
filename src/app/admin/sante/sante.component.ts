import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CatService } from '../../components/Services/catService';
import { Cat } from '../../models/cats';
import { Portee } from '../../models/portee';
import { LigneSante } from '../../models/sante';
import { SanteService, rappelQuiCompte, urgenceRappel, UrgenceRappel } from '../services/sante.service';
import { CompteursService } from '../services/compteurs.service';
import { aujourdhuiISO, dansDesAnnees, joursEntre, jourLisible } from '../services/dates';

/** Un chaton de l'élevage avec ses pesées, de la plus ancienne à la plus récente. */
interface ChatonSuivi {
  id: number;
  nom: string;
  sexe: string;
  robe: string;
  statut: string;
  portee: string;
  naissance: string;
  ageJours: number;
  pesees: LigneSante[];
  derniere: LigneSante | null;
  avantDerniere: LigneSante | null;
  couleur: string;
}

/** Un reproducteur avec ses vaccins, du plus récent au plus ancien. */
interface ChatSuivi {
  id: number;
  nom: string;
  sexe: string;
  naissance: string;
  retraite: boolean;
  vaccins: LigneSante[];
  dernier: LigneSante | null;
  rappel: string | null;
  joursAvantRappel: number | null;
  urgence: UrgenceRappel;
}

/** Une courbe de croissance prête à dessiner. */
interface Courbe {
  nom: string;
  couleur: string;
  trace: string;
  points: { x: number; y: number }[];
}

/** De quoi distinguer les courbes sans sortir des couleurs de la maison. */
const COULEURS = ['#b0244f', '#c29a4e', '#9277c9', '#5d8f7b', '#6f92c4', '#d2763f', '#3f8f94', '#8d4a7c'];

/** Les noms de vaccins proposés à la saisie : des noms, rien de prescrit. */
export const VACCINS_COURANTS = ['Typhus · coryza (RCP)', 'Leucose (FeLV)', 'Rage', 'Primo-vaccination', 'Rappel annuel'];

/** Le dessin : une boîte fixe, mise à l'échelle par le navigateur. */
const L = 720, H = 250, MG = 46, MD = 14, MH = 16, MB = 28;

@Component({
  selector: 'app-admin-sante',
  templateUrl: './sante.component.html',
  styleUrls: ['./sante.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
})
export class AdminSanteComponent implements OnInit {
  onglet: 'poids' | 'vaccins' = 'poids';
  loading = true;
  erreur = '';

  chatons: ChatonSuivi[] = [];
  chats: ChatSuivi[] = [];
  avecRetraites = false;

  ouvertChaton: number | null = null;
  ouvertChat: number | null = null;
  enregistrement = false;
  suppressionId: number | null = null;

  /** La pesée de la portée : une date, un poids par chaton, un seul bouton. */
  peseeDate = aujourdhuiISO();
  peseeValeurs: Record<number, number | null> = {};
  peseeMessage = '';

  /** Le vaccin qu'on est en train de noter, pour le chat ouvert. */
  vaccin = { date: aujourdhuiISO(), libelle: '', rappel: '', note: '' };
  /** Vrai dès qu'il a choisi lui-même une date de rappel : on cesse alors de la calculer. */
  rappelTouche = false;
  readonly vaccinsCourants = VACCINS_COURANTS;

  /* le dessin */
  readonly boite = `0 0 ${L} ${H}`;
  courbes: Courbe[] = [];
  reperesY: { y: number; texte: string }[] = [];
  reperesX: { x: number; texte: string }[] = [];
  readonly axeX = H - MB;
  readonly finX = L - MD;

  private lignes: LigneSante[] = [];
  private portees: Portee[] = [];
  private tousLesChats: Cat[] = [];

  constructor(private sante: SanteService, private catService: CatService,
              private compteurs: CompteursService) { }

  ngOnInit(): void {
    this.charger();
  }

  private charger(): void {
    this.loading = true;
    forkJoin({
      portees: this.catService.getAllPortees(),
      chats: this.catService.getAllCats(),
      lignes: this.sante.lister(),
    }).subscribe({
      next: ({ portees, chats, lignes }) => {
        this.portees = (portees || []).filter(p => !p.archivee);
        this.tousLesChats = (chats || []) as Cat[];
        this.lignes = lignes || [];
        this.recomposer();
        this.loading = false;
      },
      error: () => {
        this.erreur = "Le carnet n'a pas pu être chargé. Réessayez dans un instant.";
        this.loading = false;
      },
    });
  }

  /** On refait la vue à partir des données brutes : une seule façon de calculer. */
  private recomposer(): void {
    const aujourdhui = aujourdhuiISO();

    const pesees = this.lignes.filter(l => l.categorie === 'poids' && l.espece === 'chaton');
    let couleur = 0;
    this.chatons = [];
    this.portees.forEach(portee => {
      (portee.chatons || []).forEach((k: any) => {
        const siennes = pesees.filter(l => l.animalId === k.id)
          .sort((a, b) => a.dateFait.localeCompare(b.dateFait));
        this.chatons.push({
          id: k.id,
          nom: k.name,
          sexe: /f/i.test(k.sex || '') ? 'Femelle' : 'Mâle',
          robe: k.robe || '',
          statut: this.libelleStatut(k.status),
          portee: portee.name || k.porteeName || '',
          naissance: String(k.dateOfBirth || portee.dateOfBirth || '').slice(0, 10),
          ageJours: joursEntre(String(k.dateOfBirth || portee.dateOfBirth || '').slice(0, 10), aujourdhui),
          pesees: siennes,
          derniere: siennes.length ? siennes[siennes.length - 1] : null,
          avantDerniere: siennes.length > 1 ? siennes[siennes.length - 2] : null,
          couleur: COULEURS[couleur++ % COULEURS.length],
        });
      });
    });

    const vaccins = this.lignes.filter(l => l.categorie === 'vaccin' && l.espece === 'chat');
    this.chats = this.tousLesChats.map(c => {
      const siens = vaccins.filter(l => l.animalId === c.id)
        .sort((a, b) => b.dateFait.localeCompare(a.dateFait));
      const rappel = rappelQuiCompte(siens);
      const jours = rappel ? joursEntre(aujourdhui, rappel) : null;
      return {
        id: c.id,
        nom: c.name,
        sexe: /f/i.test(c.sex || '') ? 'Femelle' : 'Mâle',
        naissance: String(c.dateOfBirth || '').slice(0, 10),
        retraite: !!c.archivee,
        vaccins: siens,
        dernier: siens.length ? siens[0] : null,
        rappel,
        joursAvantRappel: jours,
        urgence: urgenceRappel(rappel),
      } as ChatSuivi;
    }).sort((a, b) => this.rang(a) - this.rang(b) || a.nom.localeCompare(b.nom));

    this.dessiner();
  }

  /** Ce qui presse remonte en haut de la liste. */
  private rang(c: ChatSuivi): number {
    return c.retraite ? 9 : { retard: 0, bientot: 1, aucun: 2, prevu: 3 }[c.urgence];
  }

  private libelleStatut(statut: string | null | undefined): string {
    const s = String(statut || '').toLowerCase();
    return s.startsWith('dispo') ? 'Disponible'
      : s.startsWith('reserv') || s.startsWith('réserv') ? 'Réservé'
      : s.startsWith('observ') ? 'En observation'
      : s.startsWith('vendu') ? 'Parti'
      : s.startsWith('garde') ? 'Gardé'
      : String(statut || '');
  }

  /* ------------------------------------------------------------------ le dessin */

  /** Les courbes de croissance, en âge plutôt qu'en date : les portées se comparent. */
  private dessiner(): void {
    const suivis = this.chatons.filter(c => c.pesees.length);
    this.courbes = [];
    this.reperesX = [];
    this.reperesY = [];
    if (!suivis.length) return;

    const points = suivis.flatMap(c => c.pesees.map(p => ({
      j: joursEntre(c.naissance, p.dateFait), g: p.poids || 0,
    })));
    const maxJ = Math.max(7, ...points.map(p => p.j));
    const maxG = Math.max(200, ...points.map(p => p.g));
    const hautG = Math.ceil(maxG / 200) * 200;

    const x = (j: number) => MG + (j / maxJ) * (L - MG - MD);
    const y = (g: number) => H - MB - (g / hautG) * (H - MB - MH);

    this.courbes = suivis.map(c => {
      const pts = c.pesees.map(p => ({ x: x(joursEntre(c.naissance, p.dateFait)), y: y(p.poids || 0) }));
      return {
        nom: c.nom, couleur: c.couleur, points: pts,
        trace: pts.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' '),
      };
    });

    for (let g = 0; g <= hautG; g += hautG / 4) {
      this.reperesY.push({ y: y(g), texte: g >= 1000 ? (g / 1000).toFixed(1).replace('.', ',') + ' kg' : g + ' g' });
    }
    const pas = maxJ <= 35 ? 7 : maxJ <= 84 ? 14 : 30;
    for (let j = 0; j <= maxJ; j += pas) {
      this.reperesX.push({ x: x(j), texte: j === 0 ? 'naiss.' : j + ' j' });
    }
  }

  /* ------------------------------------------------------------------ les pesées */

  /** Avec deux portées à l'écran, on rappelle qui vient d'où sur la ligne de pesée. */
  get plusieursPortees(): boolean {
    return new Set(this.chatons.map(c => c.portee)).size > 1;
  }

  get chatonsPeses(): number {
    return this.chatons.filter(c => c.pesees.length).length;
  }

  /** « 420 g », « 1,24 kg ». */
  poidsLisible(grammes: number | null | undefined): string {
    if (!grammes && grammes !== 0) return '';
    return grammes >= 1000 ? (grammes / 1000).toFixed(2).replace('.', ',') + ' kg' : grammes + ' g';
  }

  /** Ce que le chaton a pris depuis la pesée d'avant : « +120 g en 3 jours ». */
  progression(c: ChatonSuivi): string {
    if (!c.derniere || !c.avantDerniere) return '';
    const g = (c.derniere.poids || 0) - (c.avantDerniere.poids || 0);
    const j = joursEntre(c.avantDerniere.dateFait, c.derniere.dateFait);
    const signe = g > 0 ? '+' : '';
    return `${signe}${g} g${j ? ` en ${j} jour${j > 1 ? 's' : ''}` : ''}`;
  }

  /** Vert quand ça monte, gris quand ça stagne, ambre quand ça descend. */
  tendance(c: ChatonSuivi): 'hausse' | 'stable' | 'baisse' | '' {
    if (!c.derniere || !c.avantDerniere) return '';
    const g = (c.derniere.poids || 0) - (c.avantDerniere.poids || 0);
    return g > 0 ? 'hausse' : g < 0 ? 'baisse' : 'stable';
  }

  ageLisible(jours: number): string {
    if (isNaN(jours) || jours < 0) return '';
    if (jours < 14) return `${jours} jour${jours > 1 ? 's' : ''}`;
    if (jours < 70) return `${Math.floor(jours / 7)} semaines`;
    const mois = Math.floor(jours / 30.44);
    return mois < 24 ? `${mois} mois` : `${Math.floor(mois / 12)} ans`;
  }

  jour(iso: string | null | undefined): string {
    return jourLisible(iso);
  }

  /** L'âge du chaton le jour d'une pesée. */
  joursEntreDates(debut: string, fin: string): number {
    return joursEntre(debut, fin);
  }

  /** Ce qui sépare deux pesées qui se suivent : « +120 g ». */
  ecart(precedente: LigneSante, actuelle: LigneSante): string {
    const g = (actuelle.poids || 0) - (precedente.poids || 0);
    return (g > 0 ? '+' : g < 0 ? '-' : '') + Math.abs(g) + ' g';
  }

  basculerChaton(c: ChatonSuivi): void {
    this.ouvertChaton = this.ouvertChaton === c.id ? null : c.id;
  }

  /** Toute la portée pesée d'un coup : on n'envoie que les cases remplies. */
  enregistrerPesees(): void {
    const envois = this.chatons
      .map(c => ({ c, g: Number(this.peseeValeurs[c.id]) }))
      .filter(({ g }) => Number.isFinite(g) && g > 0)
      .map(({ c, g }) => this.sante.ajouter({
        espece: 'chaton', animalId: c.id, categorie: 'poids',
        dateFait: this.peseeDate, poids: Math.round(g),
      }));

    if (!envois.length) {
      this.peseeMessage = 'Aucun poids saisi.';
      return;
    }

    this.enregistrement = true;
    this.peseeMessage = '';
    forkJoin(envois).subscribe({
      next: (ajoutees) => {
        this.lignes = [...this.lignes, ...ajoutees];
        this.peseeValeurs = {};
        this.peseeMessage = `${ajoutees.length} pesée${ajoutees.length > 1 ? 's' : ''} enregistrée${ajoutees.length > 1 ? 's' : ''}.`;
        this.enregistrement = false;
        this.recomposer();
      },
      error: () => {
        this.peseeMessage = "L'enregistrement n'a pas abouti. Vérifiez votre connexion et réessayez.";
        this.enregistrement = false;
      },
    });
  }

  /* ------------------------------------------------------------------ les vaccins */

  get rappelsAFaire(): number {
    return this.chats.filter(c => !c.retraite && (c.urgence === 'retard' || c.urgence === 'bientot')).length;
  }

  get chatsAffiches(): ChatSuivi[] {
    return this.avecRetraites ? this.chats : this.chats.filter(c => !c.retraite);
  }

  get retraitesCaches(): number {
    return this.chats.filter(c => c.retraite).length;
  }

  /** « en retard de 5 jours », « dans 3 semaines », « aucun rappel noté ». */
  echeance(c: ChatSuivi): string {
    const j = c.joursAvantRappel;
    if (j === null) return 'Aucun rappel noté';
    if (j < 0) return `En retard de ${this.duree(-j)}`;
    if (j === 0) return "À faire aujourd'hui";
    return `Dans ${this.duree(j)}`;
  }

  private duree(jours: number): string {
    if (jours < 14) return `${jours} jour${jours > 1 ? 's' : ''}`;
    if (jours < 60) return `${Math.round(jours / 7)} semaines`;
    return `${Math.round(jours / 30.44)} mois`;
  }

  basculerChat(c: ChatSuivi): void {
    this.ouvertChat = this.ouvertChat === c.id ? null : c.id;
    this.nouveauVaccin();
  }

  private nouveauVaccin(): void {
    const date = aujourdhuiISO();
    this.vaccin = { date, libelle: '', rappel: dansDesAnnees(date, 1), note: '' };
    this.rappelTouche = false;
  }

  /** Un rappel à un an est la suite habituelle : proposé, jamais imposé. */
  dateChangee(): void {
    if (!this.rappelTouche) this.vaccin.rappel = dansDesAnnees(this.vaccin.date, 1);
  }

  rappelDansUnAn(): void {
    this.vaccin.rappel = dansDesAnnees(this.vaccin.date, 1);
    this.rappelTouche = false;
  }

  enregistrerVaccin(c: ChatSuivi): void {
    if (!this.vaccin.libelle.trim()) {
      this.erreur = 'Dites quel vaccin a été fait.';
      return;
    }
    this.enregistrement = true;
    this.erreur = '';
    this.sante.ajouter({
      espece: 'chat', animalId: c.id, categorie: 'vaccin',
      dateFait: this.vaccin.date, libelle: this.vaccin.libelle.trim(),
      rappel: this.vaccin.rappel || null, note: this.vaccin.note.trim() || null,
    }).subscribe({
      next: (ligne) => {
        this.lignes = [...this.lignes, ligne];
        this.nouveauVaccin();
        this.enregistrement = false;
        this.recomposer();
        this.compteurs.rafraichirSante();
      },
      error: () => {
        this.erreur = "Le vaccin n'a pas pu être enregistré.";
        this.enregistrement = false;
      },
    });
  }

  /* ------------------------------------------------------------------ commun */

  supprimer(ligne: LigneSante, event?: Event): void {
    event?.stopPropagation();
    if (!confirm('Supprimer cette ligne du carnet ?')) return;
    this.suppressionId = ligne.id;
    this.sante.supprimer(ligne.id).subscribe({
      next: () => {
        this.lignes = this.lignes.filter(l => l.id !== ligne.id);
        this.suppressionId = null;
        this.recomposer();
        if (ligne.categorie === 'vaccin') this.compteurs.rafraichirSante();
      },
      error: () => {
        this.erreur = "La ligne n'a pas pu être supprimée.";
        this.suppressionId = null;
      },
    });
  }

  arreter(event: Event): void {
    event.stopPropagation();
  }

}
