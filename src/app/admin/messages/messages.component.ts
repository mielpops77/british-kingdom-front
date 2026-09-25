import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ContactService } from '../../components/Services/contact.service';
import { Contact } from '../../models/contact';
import { provenanceDe, sansProvenance } from '../services/provenance';

/** Ce que l'on regarde : ce qui attend une réponse, ce qui est fait, ou tout. */
type Onglet = 'arepondre' | 'repondus' | 'tous';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  standalone: true,
  imports: [NgFor, NgIf]
})
export class AdminMessagesComponent implements OnInit {
  contacts: Contact[] = [];
  loading = true;
  expandedId: number | null = null;
  deletingId: number | null = null;
  enregistrementId: number | null = null;
  adresseCopiee: number | null = null;

  activeTab: Onglet = 'arepondre';
  recherche = '';

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getAllContacts(environment.id).subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.loading = false;
        // Si tout est déjà traité, autant ouvrir sur la liste complète.
        if (!this.countARepondre) this.activeTab = 'tous';
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // ---------------------------------------------------------------- compteurs et filtres

  get unreadCount(): number {
    return this.contacts.filter(c => !c.vue).length;
  }

  get countARepondre(): number {
    return this.contacts.filter(c => !c.repondu).length;
  }

  get countRepondus(): number {
    return this.contacts.filter(c => !!c.repondu).length;
  }

  /** Les messages de l'onglet choisi, filtrés par la recherche. */
  get displayedContacts(): Contact[] {
    const parOnglet = this.activeTab === 'arepondre' ? this.contacts.filter(c => !c.repondu)
      : this.activeTab === 'repondus' ? this.contacts.filter(c => !!c.repondu)
      : this.contacts;

    const q = this.recherche.trim().toLowerCase();
    if (!q) return parOnglet;
    return parOnglet.filter(c =>
      [c.name, c.subject, c.message, c.email, c.num].some(v => String(v || '').toLowerCase().includes(q)));
  }

  // ---------------------------------------------------------------- affichage

  /** « aujourd'hui à 22:35 », « hier à 09:12 », sinon « mer. 24 sept. à 22:35 » (heure de Paris). */
  dateLisible(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;

    const jourDe = (x: Date) => new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(x);
    const heure = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }).format(d);

    const jour = jourDe(d);
    if (jour === jourDe(new Date())) return "aujourd'hui à " + heure;
    if (jour === jourDe(new Date(Date.now() - 86400000))) return 'hier à ' + heure;

    const date = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', day: 'numeric', month: 'short' }).format(d);
    return date + ' à ' + heure;
  }

  /** Le réseau par lequel la personne est arrivée sur le site, s'il est connu. */
  provenance(contact: Contact): string {
    return provenanceDe(contact.message);
  }

  /** Le message sans la ligne de provenance, qui s'affiche déjà à part. */
  corps(contact: Contact): string {
    return sansProvenance(contact.message);
  }

  /** Une inscription venue de la page « Liste d'attente » du site. */
  estAttente(contact: Contact): boolean {
    return (contact.subject || '').trim().toLowerCase().startsWith("liste d'attente");
  }

  // ---------------------------------------------------------------- actions

  toggleExpand(contact: Contact): void {
    this.expandedId = this.expandedId === contact.id ? null : contact.id;

    if (!contact.vue) {
      contact.vue = true;
      this.contactService.updateContact(contact.id, contact).subscribe();
    }
  }

  /** Le sujet de la réponse, repris du message reçu. */
  encodeSujet(contact: any): string {
    return encodeURIComponent('Re : ' + (contact.subject || 'votre message'));
  }

  /** Ouvre votre messagerie avec la réponse commencée, et note le message comme répondu. */
  repondre(contact: Contact, event: Event): void {
    event.stopPropagation();
    window.location.href = 'mailto:' + contact.email + '?subject=' + this.encodeSujet(contact);
    if (!contact.repondu) this.marquer(contact, true);
  }

  basculerRepondu(contact: Contact, event: Event): void {
    event.stopPropagation();
    this.marquer(contact, !contact.repondu);
  }

  /** Enregistre l'état « répondu » ; si ça échoue, l'affichage revient comme il était. */
  private marquer(contact: Contact, valeur: boolean): void {
    const avant = contact.repondu;
    contact.repondu = valeur;
    this.enregistrementId = contact.id;
    this.contactService.updateContact(contact.id, contact).subscribe({
      next: () => { this.enregistrementId = null; },
      error: () => {
        contact.repondu = avant;
        this.enregistrementId = null;
        alert("L'enregistrement a échoué. Réessayez dans un instant.");
      },
    });
  }

  copierAdresse(contact: Contact, event: Event): void {
    event.stopPropagation();
    const fini = () => {
      this.adresseCopiee = contact.id;
      setTimeout(() => { if (this.adresseCopiee === contact.id) this.adresseCopiee = null; }, 2500);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(contact.email).then(fini, () => { /* refusé */ });
      }
    } catch (e) { /* presse-papier indisponible */ }
  }

  confirmDelete(contact: Contact, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Supprimer le message de "${contact.name}" ?`)) return;

    this.deletingId = contact.id;
    this.contactService.deleteContact(contact.id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.deletingId = null;
      },
      error: () => {
        alert('La suppression a échoué.');
        this.deletingId = null;
      }
    });
  }
}
