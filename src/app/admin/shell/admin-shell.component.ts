import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** La marque « c'est la maison » : tant qu'elle est posée dans ce navigateur, le site public
 *  n'y compte plus les visites (site-v2/js/api.js la lit avant d'enregistrer quoi que ce soit). */
export const MARQUE_MAISON = 'bk_maison';

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet]
})
export class AdminShellComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit(): void {
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
