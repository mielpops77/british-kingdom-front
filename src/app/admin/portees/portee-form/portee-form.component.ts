import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatService } from '../../../components/Services/catService';
import { Cat } from '../../../models/cats';
import { Portee } from '../../../models/portee';
import { Chaton } from '../../../models/chaton';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-portee-form',
  templateUrl: './portee-form.component.html',
  styleUrls: ['./portee-form.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink]
})
export class PorteeFormComponent implements OnInit {
  isEdit = false;
  porteeId: number | null = null;
  url = environment;

  males: Cat[] = [];
  females: Cat[] = [];

  model: Portee = {
    id: 0,
    name: '',
    idPapa: 0,
    idMaman: 0,
    dateOfBirth: '',
    dateOfSell: '',
    chatons: [],
    profilId: environment.id,
    urlProfilMother: '',
    urlProfilFather: '',
    disponible: false,
  };

  saving = false;
  error = '';
  uploadingChatonIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catService: CatService,
  ) { }

  ngOnInit(): void {
    this.catService.cat$.subscribe(cats => {
      if (cats) {
        this.males = cats.filter(c => c.sex === 'Mâle');
        this.females = cats.filter(c => c.sex === 'Femelle');
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.porteeId = Number(idParam);
      this.catService.getPorteeById(idParam).subscribe({
        next: (portee: any) => {
          this.model = {
            ...portee,
            dateOfBirth: portee.dateOfBirth ? portee.dateOfBirth.substring(0, 10) : '',
            dateOfSell: portee.dateOfSell ? portee.dateOfSell.substring(0, 10) : '',
            chatons: (portee.chatons || []).map((c: any) => ({
              ...c,
              dateOfBirth: c.dateOfBirth ? c.dateOfBirth.substring(0, 10) : '',
              photos: c.photos || [],
            })),
          };
        },
        error: () => this.error = 'Impossible de charger cette portée.'
      });
    }
  }

  addChaton(): void {
    const newChaton: Chaton = {
      id: 0,
      idPortee: this.model.id,
      profilId: environment.id,
      name: '',
      porteeName: this.model.name,
      sex: 'Mâle',
      photos: [],
      status: 'rester',
      dateOfBirth: this.model.dateOfBirth,
      urlProfil: '',
      robe: '',
      breed: 'British Shorthair',
      loof: false,
    };
    this.model.chatons = [...this.model.chatons, newChaton];
  }

  removeChaton(index: number): void {
    this.model.chatons = this.model.chatons.filter((_, i) => i !== index);
  }

  private extractFilename(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  onChatonPhotoSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingChatonIndex = index;
    this.catService.uploadImages('Chatons', [file]).subscribe({
      next: (res) => {
        const filename = this.extractFilename(res.uploadedFilePaths[0]);
        this.model.chatons[index].urlProfil = filename;
        this.model.chatons[index].photos = [...(this.model.chatons[index].photos || []), filename];
        this.uploadingChatonIndex = null;
      },
      error: () => {
        this.error = "L'upload de la photo a échoué.";
        this.uploadingChatonIndex = null;
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.model.idPapa || !this.model.idMaman) {
      this.error = (!this.model.idPapa || !this.model.idMaman) ? 'Choisis le père et la mère.' : '';
      return;
    }

    const father = this.males.find(m => m.id === Number(this.model.idPapa));
    const mother = this.females.find(f => f.id === Number(this.model.idMaman));
    this.model.urlProfilFather = father?.urlProfil || this.model.urlProfilFather;
    this.model.urlProfilMother = mother?.urlProfil || this.model.urlProfilMother;
    this.model.chatons.forEach(c => c.porteeName = this.model.name);

    this.saving = true;
    this.error = '';

    const action = this.isEdit
      ? this.catService.editPortee(this.porteeId!, this.model)
      : this.catService.createPorte(this.model);

    action.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigateByUrl('/admin/portees');
      },
      error: () => {
        this.saving = false;
        this.error = "L'enregistrement a échoué.";
      }
    });
  }
}
