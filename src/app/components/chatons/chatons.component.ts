import { DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { CatService } from '../Services/catService';
import { Portee } from 'src/app/models/portee';
import { Cat } from 'src/app/models/cats';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatons',
  templateUrl: './chatons.component.html',
  styleUrls: ['./chatons.component.css'],
  standalone: true,
  imports: [NgIf, NgStyle, NgFor, MatButtonModule, RouterLink]
})
export class ChatonsComponent implements OnInit, OnDestroy {

  private bannerSubscription: Subscription | undefined;
  porteeSubscription: Subscription | undefined;
  catSubscription: Subscription | undefined;

  porteeDisponible: Boolean = false;
  allPortee: Portee[] = [];
  dynamicStyles: any = {};
  allCats: Cat[] = [];
  porteInfo: any = [];
  galleryImages: string[] = [];
  env = environment;
  banner: any = [];

  constructor(
    private catService: CatService,
    private datePipe: DatePipe,
    private router: Router,
    private title: Title,
    private meta: Meta
  ) { }




  ngOnInit(): void {
    this.title.setTitle("Chatons British Shorthair & Longhair disponibles | Chatterie British Kingdom");
    this.meta.updateTag({ name: 'description', content: "Découvrez nos portées et chatons British Shorthair et British Longhair disponibles à l'adoption, chatterie familiale à Othis." });
    this.catSubscription = this.catService.cat$.subscribe(cats => {
      if (cats) {
        this.allCats = cats;
      }
    });

    this.porteeSubscription = this.catService.portee$.subscribe(portee => {
      if (portee) {
        this.allPortee = portee;
        this.porteeDisponible = this.allPortee.some(p => p.disponible);
        this.porteInfo = this.allPortee
          .filter(p => p.disponible)
          .map(portee => {
            const info = {
              nameFemale: '',
              nameMale: '',
              dateOfBirth: '',
              nbrMale: 0,
              nbrFemale: 0,
              urlFemale: environment.apiUrlImgProfilCat + portee.urlProfilMother,
              urlMale: environment.apiUrlImgProfilCat + portee.urlProfilFather,
              idMaman: portee.idMaman,
              idPapa: portee.idPapa,
              portee: portee
            };

            console.log('portee.dateOfBirth', portee.dateOfBirth);

            info.dateOfBirth = this.formaterDate(portee.dateOfBirth);

            info.nbrMale = portee.chatons.filter(chaton => chaton.sex === 'Mâle').length;
            info.nbrFemale = portee.chatons.filter(chaton => chaton.sex === 'Femelle').length;

            const mamanCat = this.allCats.find(cat => cat.id === portee.idMaman);
            const papaCat = this.allCats.find(cat => cat.id === portee.idPapa);
            info.nameFemale = mamanCat ? mamanCat.name : '';
            info.nameMale = papaCat ? papaCat.name : '';

            return info;
          });

        this.galleryImages = this.allPortee
          .slice()
          .reverse()
          .flatMap(portee => portee.chatons || [])
          .flatMap(chaton => (chaton.photos && chaton.photos.length ? [chaton.photos[0]] : chaton.urlProfil ? [chaton.urlProfil] : []))
          .filter(photo => photo && photo !== 'chaton.png')
          .map(photo => environment.apiUrlImgChaton + photo)
          .slice(0, 24);
      }
    });

    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      // this.setDynamicStyles();

      if (banner) {
        this.banner = banner[0];
        this.getDynamicStyles();
      }
    });
  }



  getDynamicStyles(): void {
    if (this.banner) {
      this.dynamicStyles = {
        title: {
          'font-family': this.banner.titleFontStylePageChatons,
          'color': this.banner.titleColorPageChatons,
        },
        info1: {
          'font-family': this.banner.info1FontStylePageChatons,
          'color': this.banner.info1ColorPageChatons,
        },
        info2: {
          'font-family': this.banner.info2FontStylePageChatons,
          'color': this.banner.info2ColorPageChatons,
        },
        info3: {
          'font-family': this.banner.info3FontStylePageChatons,
          'color': this.banner.info3ColorPageChatons,
        },
        bordure: {
          'color': this.banner.bordureColorPageChatons,
        },
        button: {
          'font-family': this.banner.buttonTextFontStylePageChatons,
          'color': this.banner.buttonTextColorPageChatons,
          'background-color': this.banner.buttonColorPageChatons,
        }
      };
    }
  }
  formaterDate(inputDate: string): string {
    const dateObj = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const locale = 'fr-FR';
    const formattedDate = dateObj.toLocaleDateString(locale, options);
    console.log('Formatted Date:', formattedDate); // Vérification de la date formatée
    return formattedDate;
  }

  redirectToNewUrl(id: number, type: string): void {
    this.router.navigate(['/', type, id]);
  }


  redirigerVersConditions() {
    this.router.navigate(['/conditions']).then(() => {
      const element = document.documentElement;
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
    this.router.navigate(['/conditions']).then(() => {
      const element = document.getElementById('preparer-son-arrivee');
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }
    });
  }



  onImageLoad() {
    // Ajoutez une classe pour déclencher l'animation
    const imageElement = event?.target as HTMLElement;
    if (imageElement) {
      imageElement.classList.add('loaded');
    }
  }


  ngOnDestroy(): void {
    this.porteeSubscription?.unsubscribe();
    this.catSubscription?.unsubscribe();
    this.bannerSubscription?.unsubscribe();
  }


}
