import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatons',
  templateUrl: './chatons.component.html',
  styleUrls: ['./chatons.component.css']
})
export class ChatonsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirigerVersConditions() {
    this.router.navigate(['/conditions']).then(() => {
      // Après la redirection, faire défiler la page vers le bas
      const element = document.documentElement;  // Remplacez 'votre-element-cible' par l'ID de l'élément cible en bas de la page
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    });
  }


  faireDefilerVersBas() {
    // Rediriger d'abord vers la page "conditions"
    this.router.navigate(['/conditions']).then(() => {
      // Après la redirection, faire défiler la page vers le bas
      const element = document.getElementById('preparer-son-arrivee'); // Remplacez 'votre-element-cible' par l'ID de l'élément cible en bas de la page
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }
    });
  }

}
