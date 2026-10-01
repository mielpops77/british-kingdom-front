import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ContactService } from '../../components/Services/contact.service';
import { Contact } from '../../models/contact';
import { provenanceDe, sansProvenance } from '../services/provenance';
import { CompteursService, estAttente } from '../services/compteurs.service';
import { dateLisible } from '../services/dates';

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

  constructor(private contactService: ContactService, private compteurs: CompteursService) { }

  ngOnInit(): void {
    this.contactService.getAllContacts(environment.id).subscribe({
      next: (contacts) => {
        // Les inscriptions « Liste d'attente » ont leur propre page : on ne les
        // mélange pas aux vrais messages (ni aux compteurs « à répondre »).
        this.contacts = contacts.filter(c => !this.estAttente(c));
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

  /** « aujourd'hui à 22:35 », « hier à 09:12 »… (code commun avec la liste d'attente). */
  dateLisible(iso: string, heure?: string): string {
    return dateLisible(iso, heure);
  }

  /** Le réseau par lequel la personne est arrivée sur le site, s'il est connu. */
  provenance(contact: Contact): string {
    return provenanceDe(contact.message);
  }

  /** Le message sans la ligne de provenance, qui s'affiche déjà à part. */
  corps(contact: Contact): string {
    return sansProvenance(contact.message);
  }

  /** Une inscription venue de la page « Liste d'attente » du site (même règle que le menu). */
  estAttente(contact: Contact): boolean {
    return estAttente(contact.subject);
  }

  // ---------------------------------------------------------------- actions

  toggleExpand(contact: Contact): void {
    this.expandedId = this.expandedId === contact.id ? null : contact.id;

    if (!contact.vue) {
      contact.vue = true;
      this.contactService.updateContact(contact.id, contact).subscribe(() => this.compteurs.rafraichir());
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
        this.compteurs.rafraichir();
      },
      error: () => {
        alert('La suppression a échoué.');
        this.deletingId = null;
      }
    });
  }
}
