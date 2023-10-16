import { ImageUploadDialogComponent } from '../../image-upload-dialog/image-upload-dialog.component';
import { BannerSection } from '../../../models/bannerSection.banner';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatService } from '../../Services/catService';
import { MatDialog } from '@angular/material/dialog';
import { Card } from '../../../models/cards';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.css']
})
export class CardEditComponent implements OnInit, OnDestroy {

  bannerSubscription: Subscription | undefined;
  dataUpdate: BannerSection | undefined;
  // dataUpdate: { [key: string]: any } = {};

  data: BannerSection | undefined;

  cards: Card[] = [
    { index: 0, selectedImages: [], hasChanges: false, originalDescription: '', originalTitle: '', profilImgs: '', fileName: '', attribute: 'male', },
    { index: 1, selectedImages: [], hasChanges: false, originalDescription: '', originalTitle: '', profilImgs: '', fileName: '', attribute: 'kitten', },
    { index: 2, selectedImages: [], hasChanges: false, originalDescription: '', originalTitle: '', profilImgs: '', fileName: '', attribute: 'female', }
  ];

  constructor(
    private catService: CatService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {

    console.log('cards', this.cards[0])
    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner !== null) {
        this.data = banner[0];
        this.dataUpdate = { ...banner[0] };
        this.cards[0].profilImgs = `http://localhost:3000/assets/profil/${banner[0].maleImg}`;
        this.cards[1].profilImgs = `http://localhost:3000/assets/profil/${banner[0].kittenImg}`;
        this.cards[2].profilImgs = `http://localhost:3000/assets/profil/${banner[0].femaleImg}`;


        this.cards[0].originalDescription = this.dataUpdate.maleDescription;
        this.cards[0].originalTitle = this.dataUpdate.titleCard1;
        this.cards[1].originalDescription = this.dataUpdate.kittenDescription;
        this.cards[1].originalTitle = this.dataUpdate.titleCard2;
        this.cards[2].originalDescription = this.dataUpdate.femaleDescription;
        this.cards[2].originalTitle = this.dataUpdate.titleCard3;

      }
    });
  }



  onFileSelected1(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const newImageName = files[0].name;
        this.cards[0].hasChanges = true;
        this.cards[0].selectedImages = [files[0]]; // Mettre à jour selectedImages1 avec le nouveau fichier sélectionné
        this.openImageUploadDialog(e.target.result, files[0], 1); // Passer 1 pour la première carte
      };
      reader.readAsDataURL(files[0]);
    }
  }



  onFileSelected2(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const newImageName = files[0].name;
        this.cards[1].hasChanges = true;
        this.cards[1].selectedImages = [files[0]]; // Mettre à jour selectedImages2 avec le nouveau fichier sélectionné
        this.openImageUploadDialog(e.target.result, files[0], 2); // Passer 2 pour la deuxième carte
      };
      reader.readAsDataURL(files[0]);
    }
  }

  onFileSelected3(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const newImageName = files[0].name;
        this.cards[2].hasChanges = true;
        this.cards[2].selectedImages = [files[0]]; // Mettre à jour selectedImages3 avec le nouveau fichier sélectionné
        this.openImageUploadDialog(e.target.result, files[0], 3); // Passer 3 pour la troisième carte
      };
      reader.readAsDataURL(files[0]);
    }
  }



  openImageUploadDialog(url: string, file: File, cardIndex: number): void {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      width: '40%',
      height: '80%',
      disableClose: true,
      data: { imageUrl: url, name: file.name, type: file.type, aspectRatioWidth: 920, aspectRatioHeight: 920 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (cardIndex === 1) {
          this.cards[0].profilImgs = result.url;
          this.cards[0].selectedImages = [result.file]; // Mettre à jour selectedImages1 avec le fichier rogné
        } else if (cardIndex === 2) {
          this.cards[1].profilImgs = result.url;
          this.cards[1].selectedImages = [result.file]; // Mettre à jour selectedImages2 avec le fichier rogné
        } else if (cardIndex === 3) {
          this.cards[2].profilImgs = result.url;
          this.cards[2].selectedImages = [result.file]; // Mettre à jour selectedImages3 avec le fichier rogné
        }
      }
    });
  }


  /* uploadImages(cardIndex: number): void {
    console.log('his.cards[0].selectedImages',this.cards[0].selectedImages);

    let selectedImages: File[] = [];
    // let fileNameVariable: string = "";

    if (cardIndex === 1) {
      selectedImages = this.cards[0].selectedImages;
      // fileNameVariable = "fileName1";
    } else if (cardIndex === 2) {
      selectedImages = this.cards[1].selectedImages;
      // fileNameVariable = "fileName2";
    } else if (cardIndex === 3) {
      selectedImages = this.cards[2].selectedImages;
      // fileNameVariable = "fileName3";
    }

    if (selectedImages.length > 0) {
      this.accueilEditService.uploadImages('Profil', selectedImages).subscribe(
        response => {
          selectedImages = [];
          const stringArray: string[] = [];

          if (cardIndex === 1 && this.data?.maleImg) {
            stringArray.push(this.data.maleImg);
          } else if (cardIndex === 2 && this.data?.kittenImg) {
            stringArray.push(this.data.kittenImg);
          } else if (cardIndex === 3 && this.data?.femaleImg) {
            stringArray.push(this.data.femaleImg);
          }

          this.deleteMissingImages(stringArray);
          this.updateImagesAfterUpload(response, cardIndex);
        },
        error => {
          console.error('Error uploading images', error);
        }
      );
    } else {
      if (cardIndex === 1) {
        if (this.dataUpdate) {
          if (this.dataUpdate.maleDescription !== this.cards[0].originalDescription || this.dataUpdate.titleCard1 !== this.cards[0].originalTitle) {
            this.editBanner(1);
          } else {
            // Logique si aucune modification n'a été apportée
          }
        }
      } else if (cardIndex === 2) {
        if (this.dataUpdate) {
          if (this.dataUpdate.kittenDescription !== this.cards[1].originalDescription || this.dataUpdate.titleCard2 !== this.cards[1].originalTitle) {
            this.editBanner(2);
          } else {
            // Logique si aucune modification n'a été apportée
          }
        }
      } else if (cardIndex === 3) {
        if (this.dataUpdate) {
          if (this.dataUpdate.femaleDescription !== this.cards[2].originalDescription || this.dataUpdate.titleCard3 !== this.cards[2].originalTitle) {
            this.editBanner(3);
          } else {
            // Logique si aucune modification n'a été apportée
          }
        }
      }
    }
  } */


  uploadMaleImages(): void {
    console.log('greeeeeeeeeeeee', this.cards[0].selectedImages);
    if (this.cards[0].selectedImages.length > 0) {
      this.catService.uploadImages('Profil', this.cards[0].selectedImages).subscribe(
        response => {
          this.cards[0].selectedImages = [];
          const stringArray: string[] = [];

          if (this.data?.maleImg) {
            stringArray.push(this.data.maleImg);
          }

          this.deleteMissingImages(stringArray,);
          this.updateImagesAfterUpload(response, 1);
        },
        error => {
          console.error('Error uploading images', error);
        }
      );
    } else {
      if (this.dataUpdate) {
        if (this.dataUpdate.maleDescription !== this.cards[0].originalDescription || this.dataUpdate.titleCard1 !== this.cards[0].originalTitle) {
          this.editBanner(1);
        } else {
          // Logique si aucune modification n'a été apportée
        }
      }
    }
  }




  uploadKittenImages(): void {
    if (this.cards[1].selectedImages.length > 0) {
      this.catService.uploadImages('Profil', this.cards[1].selectedImages).subscribe(
        response => {
          this.cards[1].selectedImages = [];
          const stringArray: string[] = [];

          if (this.data?.kittenImg) {
            stringArray.push(this.data.kittenImg);
          }

          this.deleteMissingImages(stringArray);
          this.updateImagesAfterUpload(response, 2);
        },
        error => {
          console.error('Error uploading images', error);
        }
      );
    } else {
      if (this.dataUpdate) {
        if (this.dataUpdate.kittenDescription !== this.cards[1].originalDescription || this.dataUpdate.titleCard2 !== this.cards[1].originalTitle) {
          this.editBanner(2);
        } else {
          // Logique si aucune modification n'a été apportée
        }
      }
    }
  }

  uploadFemaleImages(): void {
    if (this.cards[2].selectedImages.length > 0) {
      this.catService.uploadImages('Profil', this.cards[2].selectedImages).subscribe(
        response => {
          this.cards[2].selectedImages = [];
          const stringArray: string[] = [];

          if (this.data?.femaleImg) {
            stringArray.push(this.data.femaleImg);
          }

          this.deleteMissingImages(stringArray);
          this.updateImagesAfterUpload(response, 3);
        },
        error => {
          console.error('Error uploading images', error);
        }
      );
    } else {
      if (this.dataUpdate) {
        if (this.dataUpdate.femaleDescription !== this.cards[2].originalDescription || this.dataUpdate.titleCard3 !== this.cards[2].originalTitle) {
          this.editBanner(3);
        } else {
          // Logique si aucune modification n'a été apportée
        }
      }
    }
  }



  editBanner(cardIndex: number): void {
    if (this.data) {
      if (cardIndex === 1) {
        if (this.cards[0].fileName !== "") {
          this.data.maleImg = this.cards[0].fileName;
        }
        if (this.dataUpdate) {
          if (this.dataUpdate.maleDescription !== this.cards[0].originalDescription) {
            this.data.maleDescription = this.dataUpdate.maleDescription;
          }
          if (this.dataUpdate.titleCard1 !== this.cards[0].originalTitle) {
            this.data.titleCard1 = this.dataUpdate.titleCard1;
          }
        }
      } else if (cardIndex === 2) {
        if (this.cards[1].fileName !== "") {
          this.data.kittenImg = this.cards[1].fileName;
        }
        if (this.dataUpdate) {
          if (this.dataUpdate.kittenDescription !== this.cards[1].originalDescription) {
            this.data.kittenDescription = this.dataUpdate.kittenDescription;
          }
          if (this.dataUpdate.titleCard2 !== this.cards[1].originalTitle) {
            this.data.titleCard2 = this.dataUpdate.titleCard2;
          }
        }
      } else if (cardIndex === 3) {
        if (this.cards[2].fileName !== "") {
          this.data.femaleImg = this.cards[2].fileName;
        }
        if (this.dataUpdate) {
          if (this.dataUpdate.femaleDescription !== this.cards[2].originalDescription) {
            this.data.femaleDescription = this.dataUpdate.femaleDescription;
          }
          if (this.dataUpdate.titleCard3 !== this.cards[2].originalTitle) {
            this.data.titleCard3 = this.dataUpdate.titleCard3;
          }
        }
      }
      console.log('putputput', this.data);
      this.catService.putBannerData(this.data).subscribe(
        response => {
          console.log('Mise à jour réussie', response);
          if (cardIndex === 1) {
            if (this.data) {
              this.cards[0].originalDescription = this.data.maleDescription;
              this.cards[0].originalTitle = this.data.titleCard1;
            }

            this.cards[0].hasChanges = false;
          } else if (cardIndex === 2) {
            if (this.data) {
              this.cards[1].originalDescription = this.data.kittenDescription;
              this.cards[1].originalTitle = this.data.titleCard2;
            }
            this.cards[1].hasChanges = false;
          } else if (cardIndex === 3) {
            if (this.data) {
              this.cards[2].originalDescription = this.data.femaleDescription;
              this.cards[2].originalTitle = this.data.titleCard3;
            }
            this.cards[2].hasChanges = false;
          }
          this.showSnackBar('Modifications enregistrées avec succès');

        },
        error => {
          console.error('Erreur lors de la mise à jour', error);
        }
      );
    }
  }



  updateImagesAfterUpload(response: any, cardIndex: number): void {
    const uploadedFilePaths = response.uploadedFilePaths;
    const fileName = uploadedFilePaths[0].split('\\').pop()?.split('/').pop();

    if (cardIndex === 1) {
      this.cards[0].fileName = fileName;
      this.editBanner(1);
    } else if (cardIndex === 2) {
      this.cards[1].fileName = fileName;
      this.editBanner(2);
    } else if (cardIndex === 3) {
      this.cards[2].fileName = fileName;
      this.editBanner(3);
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000, // Durée d'affichage en millisecondes (ici 3 secondes)
      verticalPosition: 'top', // Position verticale (top, bottom)
      horizontalPosition: 'center', // Position horizontale (start, center, end, left, right)
    });
  }

  deleteMissingImages(elementsToDelete: string[]): void {

    console.log('elementsToDelete', elementsToDelete);
    this.catService.deleteMissingImages(elementsToDelete, 'Profil').subscribe(
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

  onFieldChange(cardIndex: number, field: 'male' | 'kitten' | 'female', type: 'description' | 'title') {
    const card = this.cards[cardIndex - 1];
    const dataUpdate = this.dataUpdate;
    const cardData = this.cards[cardIndex - 1];

    if (dataUpdate && card) {
      const originalValue = type === 'description' ? card.originalDescription : card.originalTitle;

      // Utiliser une assertion de type pour indiquer à TypeScript que l'index est correct
      const updatedField = `titleCard${cardIndex}` as keyof BannerSection;

      const newValue = type === 'description' ? dataUpdate[`${field}Description`] : dataUpdate[updatedField];

      card.hasChanges = newValue !== originalValue;

      if (!card.hasChanges) {
        if (card.selectedImages.length < 1) {
          if ((type === 'description' && newValue === cardData.originalDescription) || (type === 'title' && newValue === cardData.originalTitle)) {
            card.hasChanges = false;
          }
        }
      }
    }
  }


  ngOnDestroy(): void {
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }


}
