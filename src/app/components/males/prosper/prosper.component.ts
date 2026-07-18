import { isPlatformBrowser, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';
import { environment } from 'src/environments/environment';
import { CatService } from '../../Services/catService';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Cat } from '../../../models/cats';



@Component({
  selector: 'app-prosper',
  templateUrl: './prosper.component.html',
  styleUrls: ['./prosper.component.css'],
  standalone: true,
  imports: [UpperCasePipe, NgFor, NgIf, RouterLink]
})
export class ProsperComponent implements OnInit, OnDestroy {

  selectedCat: Cat | null = null;
  imageUrlParentsCat: string = "";
  imageUrlCatProfil: string = "";
  imageUrlCatImg: string = "";
  env = environment;
  imageLoadErrorOccurred: boolean = false; // Variable pour suivre si une erreur de chargement d'image s'est produite

  private isBrowser: boolean;

  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private catService: CatService,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) platformId: Object,

  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.imageUrlParentsCat = environment.apiUrlImgParentsCat;
    this.imageUrlCatProfil = environment.apiUrlImgProfilCat;
    this.imageUrlCatImg = environment.apiUrlImgCat;
  }

  ngOnInit(): void {

    const selectedCatString = this.isBrowser ? localStorage.getItem('selectedCat') : null;
    if (selectedCatString !== null) {
      if (selectedCatString) {
        this.selectedCat = JSON.parse(selectedCatString);
        this.updateMetaForCat();
      }
    }

    else {

      const catId = this.route.snapshot.paramMap.get('id');
      if (catId) {
        this.catService.getCatById(catId).subscribe((data: any) => {
          this.selectedCat = data;
          this.updateMetaForCat();
        });
      }

    }


  }

  private updateMetaForCat(): void {
    if (!this.selectedCat) return;
    const sexLabel = this.selectedCat.sex === 'Mâle' ? 'mâle' : 'femelle';
    this.title.setTitle(`${this.selectedCat.name} - Chat ${sexLabel} ${this.selectedCat.breed} | Chatterie British Kingdom`);
    this.meta.updateTag({ name: 'description', content: `Découvrez ${this.selectedCat.name}, chat ${sexLabel} ${this.selectedCat.breed} de la chatterie British Kingdom à Othis, Seine-et-Marne.` });
  }


  openPedigree() {
    if (this.selectedCat?.pedigree !== "") {
      window.open(this.env.apiUrlImgPedigree + this.selectedCat?.pedigree, '_blank');
    }
  }


  handleImageError(): void {
    if (this.isBrowser && localStorage.getItem('selectedCat') !== null && !this.imageLoadErrorOccurred) {
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
    const gallery = this.elementRef.nativeElement.ownerDocument.getElementById('gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  formaterDate(dateOfBirth: string | undefined): string {
    if (!dateOfBirth) return '';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateOfBirth).toLocaleDateString('fr-FR', options);
  }

  hasRealParentPhoto(url: string | undefined): boolean {
    if (!url) return false;
    const filename = url.trim().toLowerCase();
    return filename !== '' && filename !== 'mere.jpg' && filename !== 'pere.jpg';
  }

  onImageLoad(name: string) {
    // Ajoutez une classe pour déclencher l'animation
    const photoProfilElement = document.querySelector(name);
    if (photoProfilElement) {
      photoProfilElement.classList.add('loaded');
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      localStorage.removeItem('selectedCat');
    }
  }

}
