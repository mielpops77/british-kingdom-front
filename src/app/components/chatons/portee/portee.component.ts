import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CatService } from '../../Services/catService';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portee',
  templateUrl: './portee.component.html',
  styleUrls: ['./portee.component.css']
})
export class PorteeComponent implements OnInit, OnDestroy {
  selectedPortee: any | null = null;
  env = environment;
  @ViewChild('carouselImages') carouselImages!: ElementRef;
  allImages: any[] = [];
  displayedImages: any[] = [];
  dateOfSell = '';
  private bannerSubscription: Subscription | undefined;
  banner: any = [];

  constructor(
    private route: ActivatedRoute,
    private catService: CatService,
    private dialog: MatDialog,
    private router: Router
  ) { }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.processImages();
  }
  ngOnInit(): void {

    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.banner = banner[0];
        console.log('?????', this.banner.statusNameFontStylePagechatonProfil);

      }
    });
    this.initializeSelectedPortee();
    // this.processChatons();
    // this.processDateOfSell();
    // this.processImages();
  }


  private initializeSelectedPortee(): void {
    const localStoragePortee = localStorage.getItem('selectedPortee');
    if (localStoragePortee) {
      this.selectedPortee = JSON.parse(localStoragePortee);
      this.selectedPortee.portee = this.selectedPortee.portee || this.selectedPortee;

      console.log('this.selectedPortee', this.selectedPortee);
      this.selectedPortee.portee.urlProfilMother = this.env.apiUrlImgProfilCat + this.selectedPortee.portee.urlProfilMother;
      this.selectedPortee.portee.urlProfilFather = this.env.apiUrlImgProfilCat + this.selectedPortee.portee.urlProfilFather;
      this.processChatons();
    } else {
      const porteId = this.route.snapshot.paramMap.get('id');
      if (porteId) {
        this.catService.getPorteeById(porteId).subscribe((data: any) => {
          this.selectedPortee = data;
          this.selectedPortee.portee = this.selectedPortee;
          this.selectedPortee.urlProfilMother = this.env.apiUrlImgProfilCat + this.selectedPortee.urlProfilMother;
          this.selectedPortee.urlProfilFather = this.env.apiUrlImgProfilCat + this.selectedPortee.urlProfilFather;

          console.log('bonbnonbon', this.selectedPortee);
          this.processChatons();
        });
      }
    }
  }
  private processChatons(): void {
    const chatons = this.selectedPortee?.portee?.chatons || this.selectedPortee?.chatons;
    console.log('processChatons', this.selectedPortee);

    if (chatons) {
      for (let i = 0; i < chatons.length; i++) {
        chatons[i].sex = chatons[i].sex.charAt(0).toUpperCase() + chatons[i].sex.slice(1);
        chatons[i].name = chatons[i].name.charAt(0).toUpperCase() + chatons[i].name.slice(1);

        const screenWidth = window.innerWidth;

        switch (chatons[i].status) {
          case 'disponible':
            chatons[i].status = 'Disponible';
            break;
          case 'rester':
            chatons[i].status = 'Reste à la chatterie';
            break;
          case 'reserve':
            chatons[i].status = 'Réservé';
            break;
        }


        if (chatons[i].status == 'Reste à la chatterie' && screenWidth <= 550) {
          chatons[i].status = 'Reste'
        }


        this.allImages[i] = [];

        for (let j = 0; j < chatons[i].photos.length; j++) {
          this.allImages[i].push(this.env.apiUrlImgChaton + chatons[i].photos[j]);
        }

        const remainingElements = 3 - (this.allImages[i].length % 3);
        for (let k = 0; k < remainingElements; k++) {
          this.allImages[i].push(this.env.apiUrlImgChaton + 'chaton.png');
        }
      }
    }
    this.processDateOfSell();
  }

  private processDateOfSell(): void {
    const dateOfSell = this.selectedPortee?.portee?.dateOfSell || this.selectedPortee?.dateOfSell;
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    if (dateOfSell) {
      const dateOfSellAsDate = new Date(dateOfSell);

      if (!isNaN(dateOfSellAsDate.getTime())) {
        this.dateOfSell = dateOfSellAsDate.toLocaleDateString('fr-FR', options);
      } else {
        console.error('La chaîne de date n\'est pas dans un format valide.');
      }
    } else {
      // console.error('La propriété dateOfSell ou portee est undefined ou null.');
    }
    this.processImages();

  }
  /* 
    private processImages(): void {
      console.log('  this.allImages', this.allImages);
  
      for (let i = 0; i < this.allImages.length; i++) {
        this.displayedImages[i] = this.allImages[i].slice(0, 2);
      }
      console.log('  this.displayedImages', this.displayedImages);
    } */

  private processImages(): void {
    const screenWidth = window.innerWidth;
    console.log(screenWidth);

    for (let i = 0; i < this.allImages.length; i++) {
      this.totalImages = this.allImages[i].length;

      if (screenWidth <= 1100 && screenWidth > 760) {
        this.displayedImages[i] = this.allImages[i].slice(0, 2); // Afficher 2 images pour une largeur <= 1100
      }
      if (screenWidth <= 760) {

        this.displayedImages[i] = this.allImages[i].slice(0, 1); // Afficher 2 images pour une largeur <= 1100
      }
      if (screenWidth > 1100) {

        this.displayedImages[i] = this.allImages[i].slice(0, 3); // Afficher 3 images pour une largeur > 1100
      }
    }
  }






  redirectToNewUrl(id: number, type: string): void {
    this.router.navigateByUrl('/' + type + '/' + id);
  }


  // Définir le nombre d'images à afficher en fonction de la largeur de l'écran
  private getMaxImagesToShow(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1100 && screenWidth > 760) {
      return 2;
    }
    if (screenWidth <= 760) {
      return 1;
    }
    return 3;
  }
  startIndex = 0;
  totalImages = 0
  reachedEnd = false;

  nextImages(index: number): void {
    // Récupère le nombre maximal d'images à afficher
    const maxImagesToShow = this.getMaxImagesToShow();

    // Calcule l'index suivant après le défilement
    const nextIndex = this.startIndex + maxImagesToShow;

    // Récupère toutes les images après le prochain défilement
    const imagesAfterNext = this.allImages[index].slice(nextIndex);
    console.log('imagesAfterNext', imagesAfterNext);

    console.log(' this.allImages[index]', this.allImages[index]);


    // Vérifie si toutes les images après le prochain défilement sont égales à "chaton.png"
    const allImagesAfterNextChaton = imagesAfterNext.every((image: any) => this.isChatonImage(image));

    // Affiche dans la console le résultat de la vérification des images après le prochain défilement
    console.log('allImagesAfterNextChaton', allImagesAfterNextChaton);

    // Vérifie si aucune image restante, toutes les images suivantes sont "chaton.png" ou le défilement vers l'avant n'est pas autorisé
    if (imagesAfterNext.length === 0 || allImagesAfterNextChaton) {
      // Revenir au début si l'une des conditions est vraie
      this.startIndex = 0;
      this.reachedEnd = true;
    } else {
      // Met à jour l'index de départ pour le prochain défilement
      this.startIndex = nextIndex;
      this.reachedEnd = false;
    }

    // Met à jour les images affichées en fonction du nouvel index de départ
    if (!this.reachedEnd) {
      this.displayedImages[index] = this.allImages[index].slice(this.startIndex, this.startIndex + maxImagesToShow);

      // Met à jour la transformation pour permettre le défilement continu
      this.updateTransform();
    }
  }


  prevImages(index: number): void {
    const maxImagesToShow = this.getMaxImagesToShow();
    const prevIndex = this.startIndex - maxImagesToShow;

    // Vérifier si toutes les images précédentes sont égales à "chaton.png"
    const allChatonImages = this.allImages[index].slice(prevIndex, this.startIndex).every((image: any) => this.isChatonImage(image));

    if (prevIndex >= 0 && !allChatonImages) {
      this.startIndex = prevIndex;
    }

    this.displayedImages[index] = this.allImages[index].slice(this.startIndex, this.startIndex + maxImagesToShow);

    this.updateTransform();
  }
  private updateTransform(): void {
    if (this.carouselImages) {
      // Ajuster la transformation pour permettre le défilement continu
      const translatePercentage = -((this.startIndex % this.totalImages) / this.totalImages) * 100;
      this.carouselImages.nativeElement.style.transform = `translateX(${translatePercentage}%)`;
    }
  }


  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container'
    });
  }
  isChatonImage(imageUrl: string): boolean {
    return imageUrl.includes(this.env.apiUrlImgChaton + "chaton.png");
  }


  getDynamicStyles(value: string): any {
    const styles: any = {};
    switch (value) {
      case 'borderColor':
        styles['border'] = "2px solid" + this.banner.bordureColorPageFemelles;
        break;
      case 'title':
        styles['font-family'] = this.banner.titleFontStylePagechatonProfil;
        styles['color'] = this.banner.titleColorPagechatonProfil;
        break;
      case 'text':
        styles['font-family'] = this.banner.textFontStylePagechatonProfil;
        styles['color'] = this.banner.textColorPagechatonProfil;
        break;
      case 'statusName':
        styles['font-family'] = this.banner.statusNameFontStylePagechatonProfil;
        styles['color'] = this.banner.statusNameColorPagechatonProfil;
        break;
      case 'background':
        styles['font-family'] = this.banner.breedFontStylePagechatonProfil;
        styles['color'] = this.banner.breedColorPagechatonProfil;
        styles['background-color'] = this.banner.bagroundColorBreedPagechatonProfil;
        break;
      case 'fond-photos':
        styles['background-color'] = this.banner.bagroundColorPagechatProfil;
        break;
      default:
        break;
    }

    return styles;
  }



  ngOnDestroy(): void {
    localStorage.removeItem('selectedPortee');
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }
}
