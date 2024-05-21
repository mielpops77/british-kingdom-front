import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-politique-confidentialite',
  templateUrl: './politique-confidentialite.component.html',
  styleUrls: ['./politique-confidentialite.component.css'],
  standalone: true
})
export class PolitiqueConfidentialiteComponent {
  constructor(private router: Router) {

  }
  retourSite() {
    this.router.navigate(['/']);

  }
}
