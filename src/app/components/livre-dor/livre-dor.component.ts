import { LivreOr } from 'src/app/models/livreOr';
import { LivreOrService } from '../Services/livre-or.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CatService } from '../Services/catService';



@Component({
  selector: 'app-livre-dor',
  templateUrl: './livre-dor.component.html',
  styleUrls: ['./livre-dor.component.css']
})
export class LivreDorComponent implements OnInit {


  constructor(private livreOrService: LivreOrService, private snackBar: MatSnackBar, private catService: CatService) {
  }
  banner: any = [];
  private bannerSubscription: Subscription | undefined;
  newAvis: LivreOr = { name: '', profilId: environment.id, id: 0, dateofCrea: '', message: '', validation: false };
  avis: LivreOr[] = [];
  ngOnInit(): void {

    this.livreOrService.getAvis().subscribe(
      (response) => {
        this.avis = (response as LivreOr[]).filter((avis: LivreOr) => avis.validation == true);
        console.log('this.avis', this.avis);
      }
    )

    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.banner = banner[0];
      }
    });
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


  getDynamicStyles(value: string): any {
    const styles: any = {};
    switch (value) {
      case 'textButton':
        styles['font-family'] = this.banner.buttonTextFontStylePagelivreDor;
        styles['color'] = this.banner.buttonTextColorPagelivreDor;
        styles['background-color'] = this.banner.buttonColorPagelivreDor;

        break;
      case 'title':
        styles['font-family'] = this.banner.titleFontStylePagelivreDor;
        styles['color'] = this.banner.titleColorPagelivreDor;
        break;
      case 'text':
        styles['font-family'] = this.banner.textFontStylePageFemelles;
        styles['color'] = this.banner.textColorPageFemelles;
        break;
      default:
        break;
    }

    return styles;
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000, // Durée d'affichage en millisecondes (ici 3 secondes)
      verticalPosition: 'top', // Position verticale (top, bottom)
      horizontalPosition: 'center', // Position horizontale (start, center, end, left, right)
    });
  }


}
