import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CatService } from '../Services/catService';
import { Portee } from 'src/app/models/portee';
import { DatePipe } from '@angular/common';
import { Cat } from 'src/app/models/cats';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-chatons',
  templateUrl: './chatons.component.html',
  styleUrls: ['./chatons.component.css']
})
export class ChatonsComponent implements OnInit, OnDestroy {

  porteeSubscription: Subscription | undefined;
  catSubscription: Subscription | undefined;

  allPortee: Portee[] = [];
  allCats: Cat[] = [];
  porteeDisponible: Boolean = false;
  env = environment;
  porteInfo: any = [];


  constructor(private router: Router,
    private catService: CatService,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {

    this.catSubscription = this.catService.cat$.subscribe(cats => {
      if (cats) {
        this.allCats = cats;

        this.porteeSubscription = this.catService.portee$.subscribe(portee => {
          if (portee) {
            this.allPortee = portee;

            for (let step = 0; step < this.allPortee.length; step++) {
              if (this.allPortee[step].disponible) {
                this.porteeDisponible = true;

                const info = {
                  nameFemale: '',
                  nameMale: '',
                  dateOfBirth: '',
                  nbrMale: 0,
                  nbrFemale: 0,
                  urlFemale: '',
                  urlMale: '',
                  idMaman: 0,
                  idPapa: 0,
                  portee: {}
                };

                info.dateOfBirth = this.formaterDate(this.allPortee[step].dateOfBirth);
                info.idMaman = this.allPortee[step].idMaman;
                info.idPapa = this.allPortee[step].idPapa;
                info.portee = this.allPortee[step];

                let nbrMale = 0;
                let nbrFemale = 0;

                this.allPortee[step].chatons.forEach(
                  (chaton: any) => {
                    if (chaton.sex == 'male') {
                      nbrMale++;
                    }
                    if (chaton.sex == 'femelle') {
                      nbrFemale++;
                    }
                  }
                )
                info.nbrMale = nbrMale;
                info.nbrFemale = nbrFemale;

                const mamanCat = this.allCats.find(cat => cat.id === info.idMaman);
                if (mamanCat) {
                  info.nameFemale = mamanCat.name;
                }

                const papaCat = this.allCats.find(cat => cat.id === info.idPapa);
                if (papaCat) {
                  info.nameMale = papaCat.name;
                }

                info.urlMale = environment.apiUrlImgProfilCat + this.allPortee[step].urlProfilFather;
                info.urlFemale = environment.apiUrlImgProfilCat + this.allPortee[step].urlProfilMother;

                this.porteInfo.push(info);
              }
            }
          }
        });

      }
    });





  }

  formaterDate(inputDate: string): string {
    const dateObj = new Date(inputDate);
    return this.datePipe.transform(dateObj, 'dd MMMM yyyy', 'fr-FR') || '';
  }
  redirectToNewUrl(id: number, type: string): void {
    this.router.navigateByUrl('/' + type + '/' + id);
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


  redirigerVersPortee(portee: any) {
    console.log('portee', portee);
    localStorage.setItem('selectedPortee', JSON.stringify(portee));
    this.router.navigate(['/portee/' + portee.portee.id]).then(() => {
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



  ngOnDestroy(): void {
    /*  */
    if (this.porteeSubscription) {
      this.porteeSubscription.unsubscribe();
    }
    if (this.catSubscription) {
      this.catSubscription.unsubscribe();
    }
  }

}
