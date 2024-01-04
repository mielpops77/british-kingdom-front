import { LivreOr } from 'src/app/models/livreOr';
import { LivreOrService } from '../Services/livre-or.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-livre-dor',
  templateUrl: './livre-dor.component.html',
  styleUrls: ['./livre-dor.component.css']
})
export class LivreDorComponent implements OnInit {


  constructor(private livreOrService: LivreOrService, private snackBar: MatSnackBar) {
  }
  newAvis: LivreOr = { name: '', profilId: environment.id, id: 0, dateofCrea: '', message: '', validation: false };
  avis: LivreOr[] = [];
  ngOnInit(): void {

    this.livreOrService.getAvis().subscribe(
      (response) => {
        this.avis = (response as LivreOr[]).filter((avis: LivreOr) => avis.validation == true);
        console.log('this.avis', this.avis);
      }
    )
  }

  ajouterTemoignage() {

    // this.newAvis.dateofCrea = new Date().toLocaleDateString();
    this.newAvis.dateofCrea = new Date().toISOString()
    if (this.validationVerif() == "sendValide") {
      this.livreOrService.createAvis(this.newAvis).subscribe(
        (response) => {
          this.showSnackBar("Votre avis à bien été envoyé");
          this.newAvis = { name: '', profilId: environment.id, id: 0, dateofCrea: '', message: '', validation: false }
        },
        (error) => {
          console.error('Erreur:', error);
        }
      );
    }

  }

  validationVerif() {

    if (this.newAvis.name !== '' && this.newAvis.message !== '') {
      return "sendValide"
    }
    else {
      return "sendNoValide"

    }
  }


  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000, // Durée d'affichage en millisecondes (ici 3 secondes)
      verticalPosition: 'top', // Position verticale (top, bottom)
      horizontalPosition: 'center', // Position horizontale (start, center, end, left, right)
    });
  }


}
