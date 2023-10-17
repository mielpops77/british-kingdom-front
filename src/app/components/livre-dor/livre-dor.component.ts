import { Component, OnInit } from '@angular/core';
import { Temoignage } from '../../models/temoignage';

@Component({
  selector: 'app-livre-dor',
  templateUrl: './livre-dor.component.html',
  styleUrls: ['./livre-dor.component.css']
})
export class LivreDorComponent implements OnInit {


  nouveauTemoignage: Temoignage = { nom: '', message: '', date: '' };
  temoignages: Temoignage[] = [];

  ajouterTemoignage() {
    console.log('???????????');
    // Ajouter la date actuelle au témoignage
    this.nouveauTemoignage.date = new Date().toLocaleDateString();
    // Ajouter le témoignage à la liste
    this.temoignages.push(this.nouveauTemoignage);
    // Réinitialiser le formulaire
    // this.nouveauTemoignage = new Temoignage('', '', '');
  }
  constructor() { }

  ngOnInit(): void {
  }


}
