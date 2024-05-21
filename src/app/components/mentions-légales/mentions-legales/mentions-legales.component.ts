import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mentions-legales',
  templateUrl: './mentions-legales.component.html',
  styleUrls: ['./mentions-legales.component.css'],
  standalone: true
})

export class MentionsLegalesComponent {


  constructor(private router: Router) {

  }
  retourSite() {
    this.router.navigate(['/']);

  }
}





