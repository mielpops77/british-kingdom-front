import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactService } from '../../components/Services/contact.service';
import { CatService } from '../../components/Services/catService';
import { SanteService, rappelQuiCompte, urgenceRappel } from './sante.service';

/**
 * Les chiffres affichés dans le menu : messages non lus, demandes d'attente en cours.
 *
 * Tout vient du même endroit que les écrans Messages et Attente (les contacts),
 * pour que les nombres du menu et ceux des pages ne puissent pas se contredire.
 * Les écrans appellent `rafraichir()` dès qu'ils changent quelque chose.
 */

/** Le début du sujet que porte une inscription venue de la page « Liste d'attente » du site. */
export const SUJET_ATTENTE = "Liste d'attente";

export type EtatAttente = 'nouvelle' | 'contactee' | 'reservee' | 'terminee';

/** L'état d'une demande est rangé à la fin de son sujet : « Liste d'attente · contacté ». */
export function etatAttente(subject: string | null | undefined): EtatAttente {
  const s = String(subject || '').toLowerCase();
  return s.includes('réserv') || s.includes('reserv') ? 'reservee'
    : s.includes('termin') ? 'terminee'
    : s.includes('contact') ? 'contactee'
    : 'nouvelle';
}

/** Une inscription venue du formulaire « liste d'attente » du site. */
export function estAttente(subject: string | null | undefined): boolean {
  return String(subject || '').trim().toLowerCase().startsWith(SUJET_ATTENTE.toLowerCase());
}

@Injectable({ providedIn: 'root' })
export class CompteursService {
  /** Messages jamais ouverts. */
  readonly nonLus = new BehaviorSubject<number>(0);
  /** Demandes de la liste d'attente qui attendent encore quelque chose de vous. */
  readonly attenteEnCours = new BehaviorSubject<number>(0);
  /** Reproducteurs dont le rappel de vaccin est dépassé ou tombe dans le mois. */
  readonly rappelsVaccins = new BehaviorSubject<number>(0);

  constructor(private contactService: ContactService, private catService: CatService,
              private sante: SanteService) { }

  rafraichir(): void {
    this.contactService.getAllContacts(environment.id).subscribe({
      next: (contacts) => {
        // L'écran Messages écarte les inscriptions à la liste d'attente (elles ont leur
        // propre page) : son chiffre doit les écarter aussi, sinon il annonce des
        // messages qu'on ne trouve pas en cliquant.
        this.nonLus.next(contacts.filter(c => !c.vue && !estAttente(c.subject)).length);
        this.attenteEnCours.next(contacts.filter(c => {
          if (!estAttente(c.subject)) return false;
          const etat = etatAttente(c.subject);
          return etat === 'nouvelle' || etat === 'contactee';
        }).length);
      },
      // L'API est injoignable : on garde les derniers chiffres connus plutôt que d'afficher zéro.
      error: () => { },
    });
  }

  /**
   * Les rappels de vaccin à prévoir. À part du reste : deux requêtes de plus, qu'on
   * ne relance qu'à l'ouverture de l'espace et quand le carnet change.
   */
  rafraichirSante(): void {
    forkJoin({ chats: this.catService.getAllCats(), vaccins: this.sante.lister('vaccin') }).subscribe({
      next: ({ chats, vaccins }) => {
        const actifs = ((chats || []) as any[]).filter((c: any) => !c.archivee);
        const compte = actifs.filter((c: any) => {
          const urgence = urgenceRappel(rappelQuiCompte((vaccins || []).filter(v => v.animalId === c.id)));
          return urgence === 'retard' || urgence === 'bientot';
        }).length;
        this.rappelsVaccins.next(compte);
      },
      error: () => { },
    });
  }
}
