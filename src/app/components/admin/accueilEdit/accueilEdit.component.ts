
import { ImageUploadDialogComponent } from '../../image-upload-dialog/image-upload-dialog.component';
import { BannerSection } from '../../../models/bannerSection.banner';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatService } from '../../Services/catService';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-accueilEdit',
  templateUrl: './accueilEdit.component.html',
  styleUrls: ['./accueilEdit.component.css']
})
export class AccueilEditComponent implements OnInit {
  bannerSubscription: Subscription | null = null;
  bannerSection: BannerSection | null = null;
  bannerImagesOrigine: string[] = [];
  bannerImagesUpdate: string[] = [];
  bannerImages: string[] = [];
  selectedImages: File[] = [];
  hasChanges: boolean = false;

  constructor(
    private catService: CatService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner !== null) {
        this.bannerSection = banner[0];
        this.bannerImages = this.bannerSection?.bannerImages.map(
          image => environment.apiUrlBanner+image
        );
        this.bannerImagesUpdate = banner[0].bannerImages.slice();
        this.bannerImagesOrigine = banner[0].bannerImages.slice();

      }
    });
  }


  openImageUploadDialog(url: string, file: File): void {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      width: '40%',
      height: '80%',
      disableClose: true,
      data: { imageUrl: url, name: file.name, type: file.type, aspectRatioWidth: 1280,aspectRatioHeight : 570 } // Pass the URL of the first image
    });

    dialogRef.afterClosed().subscribe(result => {
      this.bannerImages.push(result.url);
      this.selectedImages.push(result.file);
      // Handle any action after the dialog is closed
    });
  }


  private swapImages(index1: number, index2: number): void {
    [this.bannerImages[index1], this.bannerImages[index2]] = [
      this.bannerImages[index2],
      this.bannerImages[index1]
    ];
    [this.bannerImagesUpdate[index1], this.bannerImagesUpdate[index2]] = [
      this.bannerImagesUpdate[index2],
      this.bannerImagesUpdate[index1]
    ];
  }

  moveUp(index: number): void {
    if (index > 0) {
      this.swapImages(index, index - 1);
      this.hasChanges = true;
    }
  }

  moveDown(index: number): void {
    if (index < this.bannerImages.length - 1) {
      this.swapImages(index, index + 1);
      this.hasChanges = true;
    }
  }

  removeImage(index: number): void {
    this.bannerImages.splice(index, 1);
    this.bannerImagesUpdate.splice(index, 1);
    this.hasChanges = true;
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    // console.log('inputElement.files', inputElement.files);
    const files = inputElement.files;
    console.log('ptun', files);
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const newImageName = files[0].name;
        // console.log('ayyayayayay',newImageName);
        if (!this.bannerImagesUpdate.includes(newImageName)) {
          this.hasChanges = true;
          this.bannerImagesUpdate.push(newImageName);
          // this.selectedImages.push(files[0]);
          // console.log('files[0files[0files[0files[0files[0',files[0]);
          /*  this.bannerImages.push(e.target.result); */
          //  console.log('avant la transformation',e.target.result);
          this.openImageUploadDialog(e.target.result, files[0]);

        }
      };
      reader.readAsDataURL(files[0]);
    }
  }

  editBanner(): void {
    const e = this.bannerSection?.bannerImages.slice()

    if (this.bannerSection !== null) {
      this.bannerSection.bannerImages = this.bannerImagesUpdate;
    }


    this.catService.putBannerData(this.bannerSection).subscribe(
      response => {
        console.log('Mise à jour réussie', response);
        this.hasChanges = false;
      },
      error => {
        console.error('Erreur lors de la mise à jour', error);
      }
    );
  }

  deleteMissingImages(elementsToDelete: string[]): void {
    this.catService.deleteMissingImages(elementsToDelete, 'Banner').subscribe(
      response => {
        if (response.status === 200) {
          console.log('Images deleted successfully', response);
        } else {
          console.error('Error deleting images - Invalid response status', response);
        }
      },
      error => {
        if (error.status !== 200) {
          console.error('Error deleting images', error.status);
        } else {
          console.log('Images deleted successfully');
        }
      }
    );
  }

  updateData(): void {

    this.bannerImagesOrigine = this.bannerImagesUpdate.slice();
    this.selectedImages = [];
    if (this.bannerSection !== null) {
      this.bannerImages = this.bannerSection?.bannerImages.map(
        image => environment.apiUrlBanner+image
      );
    }
  }

  private updateImagesAfterUpload(response: any): void {

    const uploadedFilePaths = response.uploadedFilePaths;
    for (let i = 0; i < this.bannerImagesUpdate.length; i++) {
      const imageName = this.bannerImagesUpdate[i];
      const matchedPath = uploadedFilePaths.find((path: string) => path.includes(imageName));
      if (matchedPath) {
        const partieApresBanner = matchedPath.split('Banner\\')[1];
        this.bannerImagesUpdate[i] = partieApresBanner;
      }
    }
  }

  uploadImages(): void {

    console.log('uploaddd', this.selectedImages);
    if (this.selectedImages.length > 0) {
      console.log('this.selectedImages', this.selectedImages);
      this.catService.uploadImages('Banner',this.selectedImages).subscribe(
        response => {
          this.updateImagesAfterUpload(response);
          this.editBanner();
          const missingElements = this.bannerImagesOrigine.filter(
            element => !this.bannerImagesUpdate.toString().includes(element)
          );
          if (missingElements.length > 0) {
            this.deleteMissingImages(missingElements);
          }
          this.updateData();
          this.showSnackBar('Modifications enregistrées avec succès');
        },
        error => {
          console.error('Error uploading images', error);
        }
      );
    } else {
      if (this.bannerImagesOrigine.toString() !== this.bannerImagesUpdate.toString()) {
        this.editBanner();
      }
      const missingElements = this.bannerImagesOrigine.filter(
        element => !this.bannerImagesUpdate.toString().includes(element)
      );
      if (missingElements.length > 0) {
        this.deleteMissingImages(missingElements);
      }
      this.updateData();
      this.showSnackBar('Modifications enregistrées avec succès');
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000, // Durée d'affichage en millisecondes (ici 3 secondes)
      verticalPosition: 'top', // Position verticale (top, bottom)
      horizontalPosition: 'center', // Position horizontale (start, center, end, left, right)
    });
  }
}
