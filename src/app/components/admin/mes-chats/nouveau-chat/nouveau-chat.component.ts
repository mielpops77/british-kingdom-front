import { ImageUploadDialogComponent } from '../../../image-upload-dialog/image-upload-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Cat } from '../../../../models/cats';
import { Router } from '@angular/router';
import { CatService } from 'src/app/components/Services/catService';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-nouveau-chat',
  templateUrl: './nouveau-chat.component.html',
  styleUrls: ['./nouveau-chat.component.css']
})
export class NouveauChatComponent implements OnInit {

  chatForm: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  fatherPhoto: string | ArrayBuffer | null = null;
  motherPhoto: string | ArrayBuffer | null = null;
  // img: string | ArrayBuffer | null = null;

  cats: Cat[] = [];


  profilePhotoFile: any | null = null;
  fatherPhotoFile: any | null = null;
  motherPhotoFile: any | null = null;
  imgPhotoFile: any | null = null;


  imagesFiles: File[] = [];





  catSubscription: Subscription | undefined;

  filteredRaces: Observable<string[]>;
  otherPhotos: (string | ArrayBuffer | File)[] = [];  // Stocke les URLs des autres photos

  races: string[] = [];
    


  constructor(private fb: FormBuilder, private http: HttpClient, private catService: CatService, private router: Router, private dialog: MatDialog) {
    // Initialisation du formulaire
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

      // pattern: ['', Validators.required],


      // ... (Ajoutez d'autres champs ici, en fonction de vos besoins)
    });
    this.filteredRaces = this.chatForm.get('breed')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }


  ngOnInit(): void {
    this.races = this.catService.races;
    this.catSubscription = this.catService.cat$.subscribe(cats => {
      if (cats)
        this.cats = cats
    });

    console.log('motherPhotoFile', this.motherPhotoFile);
  }
  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.otherPhotos, event.previousIndex, event.currentIndex);
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
          console.log('input.files', file);


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
      return response.uploadedFilePaths[0].split(/[\\/]/).pop();
    };

    const fileName1Promise = uploadImage(this.profilePhotoFile, 'CatsProfil');
    const fileName2Promise = uploadImage(this.fatherPhotoFile, 'CatsParents');
    const fileName3Promise = uploadImage(this.motherPhotoFile, 'CatsParents');

    uploadPromises.push(fileName1Promise, fileName2Promise, fileName3Promise);

    if (this.imagesFiles) {
      const imageUploadPromises = this.imagesFiles.map((file) => uploadImage(file, 'CatsImages'));
      uploadPromises.push(...imageUploadPromises);
    }

    const [fileName1, fileName2, fileName3, ...fileName4] = await Promise.all(uploadPromises);

    if (this.chatForm.valid) {
      const chatData = this.chatForm.value;

      chatData.urlProfil = fileName1;
      chatData.urlProfilFather = fileName2;
      chatData.urlProfilMother = fileName3;
      chatData.images = fileName4.filter(Boolean);

      this.http.post<Cat>(environment.apiUrlCats, chatData).subscribe(
        (response) => {
          chatData.id = response.id;
          this.cats.push(chatData);
          this.catService.refreshCatData(this.cats);
          this.router.navigate(['/admin/meschats']);
        },
        (error) => {
          console.error('Erreur:', error);
        }
      );

      console.log('Données du formulaire:', chatData);
    } else {
      console.log('Formulaire non valide');
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
            this.imagesFiles.push(this.imgPhotoFile[0]);
            break;

          // Ajoutez d'autres cas si nécessaire
          default:
            break;
        }
      }
    });
  }

  goBack() {
    // Utilisez la méthode navigate() du Router pour rediriger vers la page souhaitée
    this.router.navigate(['/admin/meschats']); // Redirige vers la page '/admin/meschats'
  }
}  