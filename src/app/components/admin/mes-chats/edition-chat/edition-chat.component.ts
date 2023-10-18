import { ImageUploadDialogComponent } from '../../../image-upload-dialog/image-upload-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../../../../../environments/environment';
import { CatService } from 'src/app/components/Services/catService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { startWith, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Cat } from '../../../../models/cats';

@Component({
  selector: 'app-edition-chat',
  templateUrl: './edition-chat.component.html',
  styleUrls: ['./edition-chat.component.css']
})
export class EditionChatComponent implements OnInit, OnDestroy {
  selectedCat: Cat | null = null;

  chatForm!: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  fatherPhoto: string | ArrayBuffer | null = null;
  motherPhoto: string | ArrayBuffer | null = null;
  // img: string | ArrayBuffer | null = null;

  cats: Cat[] = [];
  updateValid: Boolean = false;

  catsVerif = {
    name: false,
    robe: false,
    dateOfBirth: false,
    breed: false,
    urlProfil: false,
    urlProfilMother: false,
    urlProfilFather: false,
    sailliesExterieures: false,
    images: false,
    eyeColor: false,
    sex: false,
  }

  profilePhotoFile: any | null = null;
  fatherPhotoFile: any | null = null;
  motherPhotoFile: any | null = null;
  imgPhotoFile: any | null = null;
  imagesFiles: File[] = [];
  images: string[] = [];
  allCats: Cat[] = []

  catSubscription: Subscription | undefined;

  public filteredRaces: Observable<string[]> = new Observable<string[]>();
  otherPhotos: (string | ArrayBuffer | File)[] = [];  // Stocke les URLs des autres photos


  races: string[] = [];



  constructor(
    private fb: FormBuilder,
    // private http: HttpClient,
    private catService: CatService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {


    this.chatForm = this.fb.group({
      name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      robe: ['', Validators.required],
      eyeColor: ['', Validators.required],
      breed: ['', Validators.required],
      sex: ['', Validators.required],
      sailliesExterieures: ['', Validators.required],
      urlProfil: ['', Validators.required],
      images: ['', Validators.required],
      urlProfilFather: ['', Validators.required],
      urlProfilMother: ['', Validators.required],
    });
    this.initData();



  }

  private async initData() {
    this.races = this.catService.races;
    const selectedCatEditString = localStorage.getItem('selectedCatEdit');
    const allCatsString = localStorage.getItem('allCats');

    if (selectedCatEditString) {
      this.selectedCat = JSON.parse(selectedCatEditString);
    }

    if (allCatsString) {
      this.allCats = JSON.parse(allCatsString);
    }

    if (this.selectedCat) {
      this.loadCatData(this.selectedCat);
      this.initForm();
    } else {
      const catId = this.route.snapshot.paramMap.get('id');
      if (catId) {
        const data = await this.catService.getCatById(catId).toPromise();
        if (data) {
          this.selectedCat = data as Cat;
          this.initForm();
          this.loadCatData(this.selectedCat);
        }
        const allData = await this.catService.getAllCat().toPromise() as Cat[];
        if (allData) {
          this.allCats = allData;
        }
      }
    }

  }

  private initForm() {
    this.chatForm = this.fb.group({
      name: [this.selectedCat?.name || '', Validators.required],
      dateOfBirth: [this.selectedCat?.dateOfBirth || '', Validators.required],
      robe: [this.selectedCat?.robe || '', Validators.required],
      eyeColor: [this.selectedCat?.eyeColor || '', Validators.required],
      breed: [this.selectedCat?.breed || '', Validators.required],
      sex: [this.selectedCat?.sex || '', Validators.required],
      sailliesExterieures: [this.selectedCat?.sailliesExterieures || '', Validators.required],
      urlProfil: ['', Validators.required],
      images: ['', Validators.required],
      urlProfilFather: ['', Validators.required],
      urlProfilMother: ['', Validators.required],
      // Ajoutez d'autres champs ici, en fonction de vos besoins
    });
    this.formChange();

    this.filteredRaces = this.chatForm.get('breed')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value), this.formChange())

    );
  }

  private loadCatData(cat: Cat) {
    this.profilePhoto = environment.apiUrlImgProfilCat + cat.urlProfil;
    this.fatherPhoto = environment.apiUrlImgParentsCat + cat.urlProfilFather;
    this.motherPhoto = environment.apiUrlImgParentsCat + cat.urlProfilMother;
    this.images = cat.images ? [...cat.images] : [];
    // Assurez-vous que cat.images est un tableau d'images
    this.otherPhotos = cat.images ? cat.images.map(image => environment.apiUrlImgCat + image) : [];
  }



  ngOnInit(): void {
    // this.formChange()
  }

  formChange(): void {
    this.chatForm?.valueChanges.subscribe((newValue) => {
      const selectedCat = this.selectedCat;
      this.catsVerif.name = newValue.name !== selectedCat?.name;
      this.catsVerif.dateOfBirth = newValue.dateOfBirth !== selectedCat?.dateOfBirth;
      this.catsVerif.breed = newValue.breed !== selectedCat?.breed;
      this.catsVerif.sex = newValue.sex !== selectedCat?.sex;
      this.catsVerif.robe = newValue.robe !== selectedCat?.robe;
      this.catsVerif.sailliesExterieures = newValue.sailliesExterieures !== selectedCat?.sailliesExterieures;
      this.catsVerif.eyeColor = newValue.eyeColor !== selectedCat?.eyeColor;
      this.updateValid = this.isAnyTrue(this.catsVerif);

      // Réinitialiser la valeur si elle est vide
      if (newValue.name === "") {
        this.updateValid = false;
      }
    });
  }


  isAnyTrue(obj: any): boolean {
    for (const key in obj) {
      if (obj[key]) {
        return true;
      }
    }
    return false;
  }



  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.otherPhotos, event.previousIndex, event.currentIndex);
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);

    console.log('this.otherPhotos', this.otherPhotos);
    console.log('this.images', this.images);


    this.verifChange();



  }

  verifChange() {
    const hexNamesListe1 = this.extractHexNames(this.otherPhotos);
    const hexNamesListe2 = this.extractHexNames(this.selectedCat?.images);



    const sameOrder = JSON.stringify(hexNamesListe1) === JSON.stringify(hexNamesListe2);
    if (sameOrder) {
      this.catsVerif.images = false;
    } else {
      this.catsVerif.images = true;
    }
    this.updateValid = this.isAnyTrue(this.catsVerif);

  }
  extractHexNames(urls: any) {
    return urls.map((url: string) => url.split('/').pop());
  }


  onFileChange(event: Event, imageType: string) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file: File = files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target && e.target.result) {
          const imageResult = e.target.result as string;

          switch (imageType) {
            case 'profile':
              this.profilePhoto = imageResult;
              this.profilePhotoFile = file;
              this.openImageUploadDialog(imageResult, file, 500, 500, imageType);
              break;
            case 'father':
              this.fatherPhoto = imageResult;
              this.fatherPhotoFile = file;
              this.openImageUploadDialog(imageResult, file, 750, 550, imageType);
              break;
            case 'mother':
              this.motherPhoto = imageResult;
              this.motherPhotoFile = file;
              this.openImageUploadDialog(imageResult, file, 750, 550, imageType);
              break;
            // Ajoutez des cas supplémentaires pour d'autres types d'images, si nécessaire
          }
        }
      };

      reader.readAsDataURL(file);
    }
  }




  onMultipleFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files !== null && input.files.length > 0) {
      const file = input.files[0];
      // this.imagesFiles.push(file)
      if (this.otherPhotos.length >= 12) return; // Limite de 12 images

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        if (reader.result !== null) {
          // this.otherPhotos.push(reader.result as string);
          this.openImageUploadDialog(e.target.result, file, 800, 550, 'img');
        }
      };

      // Réinitialisez le champ de téléchargement pour permettre le téléchargement d'une autre image si nécessaire.
      input.value = '';
    }
  }


  // Fonction pour supprimer une image
  removeImage(index: number) {
    this.otherPhotos.splice(index, 1);
    this.images.splice(index, 1);
    this.verifChange();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.races.filter(race => race.toLowerCase().includes(filterValue));
  }



  async onSubmit() {
    const uploadPromises: Promise<any>[] = [];

    const uploadImage = async (file: File, folder: string) => {
      if (!file) return null;
      const response = await this.catService.uploadImages(folder, [file]).toPromise();
      console.log("response.uploadedFilePaths[0].split(/[\\/]/).pop()", response.uploadedFilePaths[0].split(/[\\/]/).pop());
      return response.uploadedFilePaths[0].split(/[\\/]/).pop();
    };

    const fileName1Promise = uploadImage(this.profilePhotoFile, 'CatsProfil');
    const fileName2Promise = uploadImage(this.fatherPhotoFile, 'CatsParents');
    const fileName3Promise = uploadImage(this.motherPhotoFile, 'CatsParents');

    uploadPromises.push(fileName1Promise, fileName2Promise, fileName3Promise);

    if (this.imagesFiles) {


      const imageUploadPromises = this.images
        .map((item: any) => {
          if (item instanceof File) {
            return uploadImage(item, 'CatsImages');
          }
          return item; // Pour les éléments non-fichiers, conservez-les tels quels
        });

      const results = await Promise.all(imageUploadPromises);
      this.images = results;

    }

    const [fileName1, fileName2, fileName3] = await Promise.all(uploadPromises);
    const chatData = this.chatForm!.value;
    if (fileName1) { chatData.urlProfil = fileName1; }
    else { chatData.urlProfil = this.selectedCat?.urlProfil }
    if (fileName2) { chatData.urlProfilFather = fileName2; }
    else { chatData.urlProfilFather = this.selectedCat?.urlProfilFather }

    if (fileName3) { chatData.urlProfilMother = fileName3; }
    else { chatData.urlProfilMother = this.selectedCat?.urlProfilMother }
    chatData.images = this.images;
    chatData.id = this.selectedCat?.id;


    const selectedCatId = this.selectedCat?.id;


    //vérification images à delete


    if (selectedCatId) {
      this.catService.editCat(selectedCatId, chatData).subscribe(
        (response) => {


          // Gérez la réponse réussie ici
          console.log('Chat mis à jour avec succès :', response);

          const updatedCats = this.allCats.map(cat => {
            if (cat.id === chatData.id) {
              // Si le chat a le même id que chatData, mettez à jour ses propriétés
              return { ...cat, ...chatData };
            } else {
              // Sinon, retournez le chat inchangé
              return cat;
            }
          });

          //Partie suppresion d'images 
          const deletions: { fileName: string, folder: string }[] = [];
          if (fileName1 && this.selectedCat) {
            deletions.push({ fileName: this.selectedCat.urlProfil, folder: 'CatsProfil' });
          }

          if (fileName2 && this.selectedCat) {
            deletions.push({ fileName: this.selectedCat.urlProfilFather, folder: 'CatsParents' });
          }
          if (fileName3 && this.selectedCat) {
            deletions.push({ fileName: this.selectedCat.urlProfilMother, folder: 'CatsParents' });
          }

          const missingElements = this.selectedCat?.images.filter(
            element => !this.images.includes(element)
          );

          if (missingElements && missingElements.length > 0) {
            deletions.push(...missingElements.map(fileName => ({ fileName, folder: 'CatsImages' })));
          }

          deletions.forEach(deletion => this.deleteMissingImages([deletion.fileName], deletion.folder));

          //Fin partie supression

          this.catService.refreshCatData(updatedCats);
          this.router.navigate(['/admin/meschats']);
        },
        (error) => {
          // Gérez les erreurs ici
          console.error('Erreur lors de la mise à jour du chat :', error);
        }
      );
    }

  }



  openImageUploadDialog(url: string, file: File, aspectRatioWidth: number, aspectRatioHeight: number, type: string): void {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      width: '40%',
      height: '80%',
      disableClose: true,
      data: { imageUrl: url, name: file.name, type: file.type, aspectRatioWidth, aspectRatioHeight }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateValid = true;

        switch (type) {
          case "profile":
            this.profilePhoto = result.url;
            this.profilePhotoFile = [result.file];
            this.profilePhotoFile = this.profilePhotoFile[0];
            break;

          case "father":
            this.fatherPhoto = result.url;
            this.fatherPhotoFile = [result.file];
            this.fatherPhotoFile = this.fatherPhotoFile[0];
            break;

          case "mother":
            this.motherPhoto = result.url;
            this.motherPhotoFile = [result.file];
            this.motherPhotoFile = this.motherPhotoFile[0];
            break;

          case "img":
            this.otherPhotos.push(result.url);
            this.imgPhotoFile = [result.file];
            console.log('yolo', this.imgPhotoFile[0]);
            this.imagesFiles.push(this.imgPhotoFile[0]);
            this.images.push(this.imgPhotoFile[0]);

            console.log('sossosososos', this.images);

            // this.images.push(this.imgPhotoFile[0]);
            break;

          // Ajoutez d'autres cas si nécessaire
          default:
            break;
        }
      }
    });
  }



  deleteMissingImages(elementsToDelete: string[], directory: string): void {
    this.catService.deleteMissingImages(elementsToDelete, directory).subscribe(
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


  ngOnDestroy(): void {
    localStorage.removeItem('selectedCatEdit');
  }


}
