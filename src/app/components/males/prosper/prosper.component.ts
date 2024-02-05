import { Component, OnInit, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';
import { environment } from 'src/environments/environment';
import { CatService } from '../../Services/catService';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Cat } from '../../../models/cats';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-prosper',
  templateUrl: './prosper.component.html',
  styleUrls: ['./prosper.component.css']
})
export class ProsperComponent implements OnInit, OnDestroy {

  selectedCat: Cat | null = null;
  imageUrlParentsCat: string = "";
  imageUrlCatProfil: string = "";
  imageUrlCatImg: string = "";
  screenWidth: number = window.innerWidth;
  env = environment;
  imageLoadErrorOccurred: boolean = false; // Variable pour suivre si une erreur de chargement d'image s'est produite


  private bannerSubscription: Subscription | undefined;
  banner: any = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }


  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private catService: CatService,

  ) {
    this.imageUrlParentsCat = environment.apiUrlImgParentsCat;
    this.imageUrlCatProfil = environment.apiUrlImgProfilCat;
    this.imageUrlCatImg = environment.apiUrlImgCat;

  }

  ngOnInit(): void {

    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.banner = banner[0];
      }
    });

    if (localStorage.getItem('selectedCat') !== null) {
      const selectedCatString = localStorage.getItem('selectedCat');
      if (selectedCatString) {
        this.selectedCat = JSON.parse(selectedCatString);
      }
    }

    else {

      const catId = this.route.snapshot.paramMap.get('id');
      if (catId) {
        this.catService.getCatById(catId).subscribe((data: any) => {
          this.selectedCat = data;
        });
      }

    }


  }


  openPedigree() {
    if (this.selectedCat?.pedigree !== "") {
      window.open(this.env.apiUrlImgPedigree + this.selectedCat?.pedigree, '_blank');
    }
  }


  handleImageError(): void {
    if (localStorage.getItem('selectedCat') !== null && !this.imageLoadErrorOccurred) {
      const catId = this.route.snapshot.paramMap.get('id');
      if (catId) {
        this.catService.getCatById(catId).subscribe((data: any) => {
          this.selectedCat = data;
          this.imageLoadErrorOccurred = true; // Mettre à jour la variable indiquant qu'une erreur de chargement d'image s'est produite
        });
      }
    }
  }



  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container'
    });
  }

  scrollToBottom() {
    this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop = this.elementRef.nativeElement.ownerDocument.documentElement.scrollHeight;
  }


  getRows(arr: string[] | undefined, chunkSize: number): string[][] {
    if (!arr) return [];
    let i, j, temparray;
    const newArray = [];
    for (i = 0, j = arr.length; i < j; i += chunkSize) {
      temparray = arr.slice(i, i + chunkSize);
      newArray.push(temparray);
    }
    return newArray;
  }


  getDynamicStyles(value: string): any {
    const styles: any = {};
    switch (value) {
      case 'borderColor':
        styles['border'] = "2px solid" + this.banner.bordureColorPageFemelles;
        break;
      case 'title':
        styles['font-family'] = this.banner.titleFontStylePagechatProfil;
        styles['color'] = this.banner.titleColorPagechatProfil;
        break;
      case 'text-title':
        styles['font-family'] = this.banner.textFontStylePagechatProfil;
        styles['color'] = this.banner.textColorPagechatProfil;
        styles['font-weight'] = "bold";

        break;
      case 'buttons':
        styles['background-color'] = this.banner.buttonColorPagechatProfil;
        styles['font-family'] = this.banner.buttonTextFontStylePagechatProfil;
        styles['color'] = this.banner.buttonTextColorPagechatProfil;
        break;
      case 'border':
        styles['background-color'] = this.banner.bordureColorPagechatProfil;
        break;
      case 'fond-photos':
        styles['background-color'] = this.banner.bagroundColorPagechatProfil;
        break;
      default:
        break;
    }

    return styles;
  }

  onImageLoad(name: string) {
    // Ajoutez une classe pour déclencher l'animation
    const photoProfilElement = document.querySelector(name);
    if (photoProfilElement) {
      photoProfilElement.classList.add('loaded');
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('selectedCat');

    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }

}
