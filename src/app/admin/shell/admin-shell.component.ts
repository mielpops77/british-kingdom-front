import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CompteursService } from '../services/compteurs.service';

/** La marque « c'est la maison » : tant qu'elle est posée dans ce navigateur, le site public
 *  n'y compte plus les visites (site-v2/js/api.js la lit avant d'enregistrer quoi que ce soit). */
export const MARQUE_MAISON = 'bk_maison';

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgIf]
})
export class AdminShellComponent implements OnInit {

  /** Les chiffres affichés à côté de « Messages » et « Attente ». */
  nonLus = 0;
  attenteEnCours = 0;
  rappelsVaccins = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private compteurs: CompteursService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit(): void {
    this.compteurs.nonLus.subscribe(n => this.nonLus = n);
    this.compteurs.attenteEnCours.subscribe(n => this.attenteEnCours = n);
    this.compteurs.rappelsVaccins.subscribe(n => this.rappelsVaccins = n);
    this.compteurs.rafraichir();
    this.compteurs.rafraichirSante();

    // Passer par l'espace de gestion suffit : ce navigateur est le vôtre, ses visites ne comptent plus.
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      if (localStorage.getItem(MARQUE_MAISON) !== '0') localStorage.setItem(MARQUE_MAISON, '1');
    } catch (e) { /* stockage refusé : tant pis, la visite sera comptée */ }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
