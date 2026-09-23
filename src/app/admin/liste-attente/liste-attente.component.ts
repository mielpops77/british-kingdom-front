import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ContactService } from '../../components/Services/contact.service';
import { CatService } from '../../components/Services/catService';
import { Contact } from '../../models/contact';
import { Portee } from '../../models/portee';

/** L'état d'une demande, rangé à la fin du sujet : « Liste d'attente · contacté ». */
export type EtatAttente = 'nouvelle' | 'contactee' | 'reservee' | 'terminee';

const SUJET = "Liste d'attente";
const SUFFIXES: Record<EtatAttente, string> = {
  nouvelle: '',
  contactee: ' · contacté',
  reservee: ' · réservé',
  terminee: ' · terminé',
};

/** Une demande de la liste d'attente, telle qu'elle s'affiche à l'écran. */
interface Demande {
  contact: Contact;
  etat: EtatAttente;
  sexe: string;          // « Un mâle », « Une femelle », « Peu importe »
  robe: string;          // ce que la famille a écrit
  mot: string;           // son message, sans les deux lignes de souhaits
  chatons: Correspondance[];
}

interface Correspondance {
  id: number;
  nom: string;
  sexe: string;
  robe: string;
  portee: string;
}

@Component({
  selector: 'app-admin-liste-attente',
  templateUrl: './liste-attente.component.html',
  styleUrls: ['./liste-attente.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink, FormsModule],
})
export class AdminListeAttenteComponent implements OnInit {
  demandes: Demande[] = [];
  loading = true;
  expandedId: number | null = null;
  enregistrementId: number | null = null;
  deletingId: number | null = null;
  activeTab: 'encours' | 'reservees' | 'terminees' | 'toutes' = 'encours';
  private portees: Portee[] = [];

  readonly etats: { cle: EtatAttente; libelle: string }[] = [
    { cle: 'nouvelle', libelle: 'À contacter' },
    { cle: 'contactee', libelle: 'Contactée' },
    { cle: 'reservee', libelle: 'Réservée' },
    { cle: 'terminee', libelle: 'Terminée' },
  ];

  /** Le formulaire d'ajout à la main (une famille qui a appelé, écrit sur Instagram…). */
  ajoutOuvert = false;
  ajoutEnCours = false;
  ajoutErreur = '';
  nouvelle = { name: '', num: '', email: '', sexe: 'Peu importe', robe: '', mot: '' };

  constructor(private contactService: ContactService, private catService: CatService) { }

  ouvrirAjout(): void {
    this.ajoutOuvert = !this.ajoutOuvert;
    this.ajoutErreur = '';
  }

  /** Enregistre la famille comme si elle s'était inscrite depuis le site : même sujet, mêmes souhaits. */
  ajouter(form: NgForm): void {
    const n = this.nouvelle;
    if (!n.name.trim()) { this.ajoutErreur = 'Il manque le nom de la famille.'; return; }
    if (!n.num.trim() && !n.email.trim()) { this.ajoutErreur = 'Indiquez au moins un téléphone ou un e-mail.'; return; }

    const souhaits = [n.sexe ? 'Chaton recherché : ' + n.sexe : '', n.robe.trim() ? 'Robe souhaitée : ' + n.robe.trim() : '']
      .filter(Boolean).join('\n');
    const maintenant = new Date();
    const deuxChiffres = (x: number) => String(x).padStart(2, '0');
    const contact: any = {
      profilId: environment.id,
      name: n.name.trim(),
      email: n.email.trim(),
      num: n.num.trim(),
      subject: SUJET,
      message: (souhaits ? souhaits + '\n\n' : '') + (n.mot.trim() || 'Inscription ajoutée à la main depuis l’espace de gestion.'),
      vue: true,
      dateofCrea: maintenant.getFullYear() + '-' + deuxChiffres(maintenant.getMonth() + 1) + '-' + deuxChiffres(maintenant.getDate()),
      hour: deuxChiffres(maintenant.getHours()) + ':' + deuxChiffres(maintenant.getMinutes()),
    };

    this.ajoutEnCours = true;
    this.ajoutErreur = '';
    this.contactService.createContact(contact).subscribe({
      next: (cree: any) => {
        this.demandes = [this.lire({ ...contact, id: (cree && cree.id) || Date.now() })].concat(this.demandes);
        this.nouvelle = { name: '', num: '', email: '', sexe: 'Peu importe', robe: '', mot: '' };
        form.resetForm({ sexe: 'Peu importe' });
        this.ajoutOuvert = false;
        this.ajoutEnCours = false;
        this.activeTab = 'encours';
      },
      error: () => {
        this.ajoutErreur = "L'enregistrement a échoué. Réessayez dans un instant.";
        this.ajoutEnCours = false;
      },
    });
  }

  ngOnInit(): void {
    this.catService.portee$.subscribe(portees => {
      if (portees) {
        this.portees = portees.filter(p => !p.archivee);
        this.demandes.forEach(d => d.chatons = this.correspondances(d));
      }
    });

    this.contactService.getAllContacts(environment.id).subscribe({
      next: (contacts) => {
        this.demandes = contacts
          .filter(c => this.estAttente(c))
          .sort((a, b) => (b.dateofCrea || '').localeCompare(a.dateofCrea || ''))
          .map(c => this.lire(c));
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  /** Une demande venue du formulaire « liste d'attente » du site. */
  private estAttente(c: Contact): boolean {
    return (c.subject || '').trim().toLowerCase().startsWith(SUJET.toLowerCase());
  }

  /** Sépare les souhaits (sexe, robe) du message de la famille, et lit l'état dans le sujet. */
  private lire(contact: Contact): Demande {
    const lignes = (contact.message || '').split(/\r?\n/);
    let sexe = '', robe = '';
    const reste: string[] = [];
    lignes.forEach(ligne => {
      const m1 = ligne.match(/^\s*Chaton recherché\s*:\s*(.+)$/i);
      const m2 = ligne.match(/^\s*Robe souhaitée\s*:\s*(.+)$/i);
      if (m1) sexe = m1[1].trim();
      else if (m2) robe = m2[1].trim();
      else reste.push(ligne);
    });

    const sujet = (contact.subject || '').toLowerCase();
    const etat: EtatAttente = sujet.includes('réserv') || sujet.includes('reserv') ? 'reservee'
      : sujet.includes('termin') ? 'terminee'
      : sujet.includes('contact') ? 'contactee'
      : 'nouvelle';

    const demande: Demande = { contact, etat, sexe, robe, mot: reste.join('\n').trim(), chatons: [] };
    demande.chatons = this.correspondances(demande);
    return demande;
  }

  /** Les chatons disponibles qui collent au souhait de la famille. */
  private correspondances(demande: Demande): Correspondance[] {
    const veutMale = /m[âa]le/i.test(demande.sexe);
    const veutFemelle = /femelle/i.test(demande.sexe);
    const mots = demande.robe.toLowerCase().split(/[\s,;/]+/).filter(m => m.length > 2);
    const out: Correspondance[] = [];
    this.portees.forEach(portee => {
      (portee.chatons || []).forEach((chaton: any) => {
        if (!(chaton.status || '').toLowerCase().startsWith('dispo')) return;
        const sexeChaton = (chaton.sex || '').toLowerCase();
        if (veutMale && !sexeChaton.startsWith('m')) return;
        if (veutFemelle && !sexeChaton.startsWith('f')) return;
        const robeChaton = (chaton.robe || '').toLowerCase();
        if (mots.length && !mots.some(m => robeChaton.includes(m))) return;
        out.push({ id: chaton.id, nom: chaton.name || 'Chaton', sexe: chaton.sex || '', robe: chaton.robe || '', portee: portee.name || '' });
      });
    });
    return out;
  }

  get displayedDemandes(): Demande[] {
    if (this.activeTab === 'toutes') return this.demandes;
    if (this.activeTab === 'reservees') return this.demandes.filter(d => d.etat === 'reservee');
    if (this.activeTab === 'terminees') return this.demandes.filter(d => d.etat === 'terminee');
    return this.demandes.filter(d => d.etat === 'nouvelle' || d.etat === 'contactee');
  }

  get countEnCours(): number { return this.demandes.filter(d => d.etat === 'nouvelle' || d.etat === 'contactee').length; }
  get countReservees(): number { return this.demandes.filter(d => d.etat === 'reservee').length; }
  get countTerminees(): number { return this.demandes.filter(d => d.etat === 'terminee').length; }
  get countNouvelles(): number { return this.demandes.filter(d => d.etat === 'nouvelle').length; }

  libelle(etat: EtatAttente): string {
    return (this.etats.find(e => e.cle === etat) || { libelle: '' }).libelle;
  }

  toggleExpand(demande: Demande): void {
    this.expandedId = this.expandedId === demande.contact.id ? null : demande.contact.id;
    if (!demande.contact.vue) {
      demande.contact.vue = true;
      this.contactService.updateContact(demande.contact.id, demande.contact).subscribe();
    }
  }

  /** Change l'état d'une demande : il est rangé à la fin du sujet, donc conservé pour tout le monde. */
  changerEtat(demande: Demande, etat: EtatAttente, event: Event): void {
    event.stopPropagation();
    if (demande.etat === etat) return;
    const avant = demande.etat;
    demande.etat = etat;
    this.enregistrementId = demande.contact.id;
    demande.contact.subject = SUJET + SUFFIXES[etat];
    demande.contact.vue = true;
    this.contactService.updateContact(demande.contact.id, demande.contact).subscribe({
      next: () => this.enregistrementId = null,
      error: () => {
        demande.etat = avant;
        demande.contact.subject = SUJET + SUFFIXES[avant];
        this.enregistrementId = null;
        alert("L'enregistrement a échoué.");
      },
    });
  }

  sujetReponse(demande: Demande): string {
    return encodeURIComponent('Votre demande à la Chatterie British Kingdom');
  }

  confirmDelete(demande: Demande, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Retirer la demande de "${demande.contact.name}" de la liste d'attente ? Cette action est définitive.`)) return;
    this.deletingId = demande.contact.id;
    this.contactService.deleteContact(demande.contact.id).subscribe({
      next: () => {
        this.demandes = this.demandes.filter(d => d.contact.id !== demande.contact.id);
        this.deletingId = null;
      },
      error: () => {
        alert('La suppression a échoué.');
        this.deletingId = null;
      },
    });
  }
}
