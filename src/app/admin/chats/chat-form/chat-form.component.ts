import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatService } from '../../../components/Services/catService';
import { Cat } from '../../../models/cats';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink]
})
export class ChatFormComponent implements OnInit {
  isEdit = false;
  catId: number | null = null;
  url = environment;
  races: string[] = [];

  model: Cat = {
    id: 0,
    name: '',
    robe: '',
    dateOfBirth: '',
    breed: '',
    urlProfil: '',
    urlProfilMother: '',
    urlProfilFather: '',
    sailliesExterieures: 'Non',
    images: [],
    eyeColor: '',
    sex: 'Mâle',
    pedigree: '',
    profilId: environment.id,
  };

  uploadingProfil = false;
  uploadingMother = false;
  uploadingFather = false;
  uploadingGallery = false;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catService: CatService,
  ) {
    this.races = catService.races;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.catId = Number(idParam);
      this.catService.getCatById(idParam).subscribe({
        next: (cat: any) => {
          this.model = {
            ...cat,
            dateOfBirth: cat.dateOfBirth ? cat.dateOfBirth.substring(0, 10) : '',
            images: cat.images || [],
          };
        },
        error: () => this.error = "Impossible de charger ce chat."
      });
    }
  }

  private extractFilename(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  onProfilPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingProfil = true;
    this.catService.uploadImages('CatsProfil', [file]).subscribe({
      next: (res) => {
        this.model.urlProfil = this.extractFilename(res.uploadedFilePaths[0]);
        this.uploadingProfil = false;
      },
      error: () => { this.error = "L'upload de la photo a échoué."; this.uploadingProfil = false; }
    });
  }

  onMotherPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingMother = true;
    this.catService.uploadImages('CatsParents', [file]).subscribe({
      next: (res) => {
        this.model.urlProfilMother = this.extractFilename(res.uploadedFilePaths[0]);
        this.uploadingMother = false;
      },
      error: () => { this.error = "L'upload de la photo a échoué."; this.uploadingMother = false; }
    });
  }

  onFatherPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingFather = true;
    this.catService.uploadImages('CatsParents', [file]).subscribe({
      next: (res) => {
        this.model.urlProfilFather = this.extractFilename(res.uploadedFilePaths[0]);
        this.uploadingFather = false;
      },
      error: () => { this.error = "L'upload de la photo a échoué."; this.uploadingFather = false; }
    });
  }

  onGalleryPhotosSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files || !files.length) return;

    this.uploadingGallery = true;
    this.catService.uploadImages('CatsImages', Array.from(files)).subscribe({
      next: (res) => {
        const newFilenames = res.uploadedFilePaths.map((p: string) => this.extractFilename(p));
        this.model.images = [...(this.model.images || []), ...newFilenames];
        this.uploadingGallery = false;
      },
      error: () => { this.error = "L'upload des photos a échoué."; this.uploadingGallery = false; }
    });
  }

  removeGalleryPhoto(index: number): void {
    this.model.images = (this.model.images || []).filter((_, i) => i !== index);
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.model.urlProfil) {
      this.error = !this.model.urlProfil ? "Ajoute une photo de profil avant d'enregistrer." : '';
      return;
    }

    this.saving = true;
    this.error = '';

    const action = this.isEdit
      ? this.catService.editCat(this.catId!, this.model)
      : this.catService.createCat(this.model);

    action.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigateByUrl('/admin/chats');
      },
      error: () => {
        this.saving = false;
        this.error = "L'enregistrement a échoué.";
      }
    });
  }
}
