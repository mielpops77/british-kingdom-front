import { ImageUploadDialogComponent } from '../../../image-upload-dialog/image-upload-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CatService } from 'src/app/components/Services/catService';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { startWith, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Cat } from '../../../../models/cats';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edition-chat',
  templateUrl: './edition-chat.component.html',
  styleUrls: ['./edition-chat.component.css']
})
export class EditionChatComponent implements OnInit, OnDestroy {
  selectedCat: Cat | null = null;



  chatForm: FormGroup;
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

  filteredRaces: Observable<string[]>;
  otherPhotos: (string | ArrayBuffer | File)[] = [];  // Stocke les URLs des autres photos


  races: string[] = [];



  constructor(private fb: FormBuilder, private http: HttpClient, private catService: CatService, private router: Router, private dialog: MatDialog, private route: ActivatedRoute,) {



    this.initData()
    // Initialisation du formulaire
    this.chatForm = this.fb.group({
      name: [this.selectedCat?.name, Validators.required],
      dateOfBirth: [this.selectedCat?.dateOfBirth, Validators.required],
      robe: [this.selectedCat?.robe, Validators.required],
      eyeColor: [this.selectedCat?.eyeColor, Validators.required],
      breed: [this.selectedCat?.breed, Validators.required],
      sex: [this.selectedCat?.sex, Validators.required],
      sailliesExterieures: [this.selectedCat?.sailliesExterieures, Validators.required],
      urlProfil: ['', Validators.required],
      images: ['', Validators.required],
      urlProfilFather: ['', Validators.required],
      urlProfilMother: ['', Validators.required],

      // pattern: ['', Validators.required],


      // ... (Ajoutez d'autres champs ici, en fonction de vos besoins)
    });
    this.filteredRaces = this.chatForm.get('breed')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
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
    } else {
      const catId = this.route.snapshot.paramMap.get('id');
      if (catId) {
        const data = await this.catService.getCatById(catId).toPromise();
        if (data) {  // Vérifiez si data est défini
          this.selectedCat = data as Cat; // Effectuez une conversion de type explicite
          this.loadCatData(this.selectedCat);
          this.chatForm = this.fb.group({
            name: [this.selectedCat?.name, Validators.required],
            dateOfBirth: [this.selectedCat?.dateOfBirth, Validators.required],
            robe: [this.selectedCat?.robe, Validators.required],
            eyeColor: [this.selectedCat?.eyeColor, Validators.required],
            breed: [this.selectedCat?.breed, Validators.required],
            sex: [this.selectedCat?.sex, Validators.required],
            sailliesExterieures: [this.selectedCat?.sailliesExterieures, Validators.required],
            urlProfil: ['', Validators.required],
            images: ['', Validators.required],
            urlProfilFather: ['', Validators.required],
            urlProfilMother: ['', Validators.required],
      
            // pattern: ['', Validators.required],
      
      
            // ... (Ajoutez d'autres champs ici, en fonction de vos besoins)
          });
          
        }
      }
    }
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
    this.formChange()
  }

  formChange(): void {
    this.chatForm?.get('name')?.valueChanges.subscribe(newValue => {
      this.catsVerif.name = newValue !== this.selectedCat?.name;
      this.updateValid = this.isAnyTrue(this.catsVerif);
      if (newValue == "") { this.updateValid = false };
    });
    this.chatForm?.get('dateOfBirth')?.valueChanges.subscribe(newValue => {
      this.catsVerif.dateOfBirth = newValue !== this.selectedCat?.dateOfBirth;
      this.updateValid = this.isAnyTrue(this.catsVerif);
      if (newValue == "") { this.updateValid = false };
    });

    this.chatForm?.get('breed')?.valueChanges.subscribe(newValue => {
      this.catsVerif.breed = newValue !== this.selectedCat?.breed;
      this.updateValid = this.isAnyTrue(this.catsVerif);
      if (newValue == "") { this.updateValid = false };

    });

    this.chatForm?.get('sex')?.valueChanges.subscribe(newValue => {
      this.catsVerif.sex = newValue !== this.selectedCat?.sex;
      this.updateValid = this.isAnyTrue(this.catsVerif);
      if (newValue == "") { this.updateValid = false };

    });

    this.chatForm?.get('robe')?.valueChanges.subscribe(newValue => {
      this.catsVerif.robe = newValue !== this.selectedCat?.robe;
      this.updateValid = this.isAnyTrue(this.catsVerif);
      if (newValue == "") { this.updateValid = false };

    });

    this.chatForm?.get('sailliesExterieures')?.valueChanges.subscribe(newValue => {
      this.catsVerif.sailliesExterieures = newValue !== this.selectedCat?.sailliesExterieures;
      this.updateValid = this.isAnyTrue(this.catsVerif);
      if (newValue == "") { this.updateValid = false };
    });

    this.chatForm?.get('eyeColor')?.valueChanges.subscribe(newValue => {
      this.catsVerif.eyeColor = newValue !== this.selectedCat?.eyeColor;
      this.updateValid = this.isAnyTrue(this.catsVerif);
      if (newValue == "") { this.updateValid = false };
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


    // Vérifiez que input.files n'est pas null
    if (input.files !== null && input.files.length > 0) {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (input.files !== null && input.files.length > 0) {
          const file: File = input.files[0]; // Get the file object
          // const fileName: string = file.name; 


          if (e.target && e.target.result && files) {
            if (imageType === 'profile') {
              this.profilePhoto = e.target.result as string;
              this.profilePhotoFile = file;

              this.openImageUploadDialog(e.target.result, files[0], 500, 500, imageType); // Passer 1 pour la première carte
            }
            if (imageType === 'father') {
              this.fatherPhoto = e.target.result as string;
              this.fatherPhotoFile = file;
              this.openImageUploadDialog(e.target.result, files[0], 750, 550, imageType); // Passer 1 pour la première carte


            }

            if (imageType === 'mother') {
              this.motherPhoto = e.target.result as string;
              this.motherPhotoFile = file;
              this.openImageUploadDialog(e.target.result, files[0], 750, 550, imageType); // Passer 1 pour la première carte
            }

            // Ajoutez des cas supplémentaires pour d'autres types d'images, si nécessaire
          }
        };
      }

      reader.readAsDataURL(input.files[0]);
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
    const chatData = this.chatForm.value;
    if (fileName1) { chatData.urlProfil = fileName1; }
    else { chatData.urlProfil = this.selectedCat?.urlProfil }
    if (fileName2) { chatData.urlProfilFather = fileName2; }
    else { chatData.urlProfilFather = this.selectedCat?.urlProfilFather }

    if (fileName3) { chatData.urlProfilMother = fileName3; }
    else { chatData.urlProfilMother = this.selectedCat?.urlProfilMother }
    chatData.images = this.images;
    chatData.id = this.selectedCat?.id;


    const selectedCatId = this.selectedCat?.id;
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

          console.log('updatedCats', updatedCats);

          // console.log('updatedCats',updatedCats);
          // this.catService.refreshCatDataWithUpdatedCat(response);

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

  ngOnDestroy(): void {
    localStorage.removeItem('selectedCatEdit');
  }


}
