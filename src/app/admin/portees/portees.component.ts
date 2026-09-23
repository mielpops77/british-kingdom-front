import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatService } from '../../components/Services/catService';
import { Portee } from '../../models/portee';
import { Cat } from '../../models/cats';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-portees',
  templateUrl: './portees.component.html',
  styleUrls: ['./portees.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DatePipe]
})
export class AdminPorteesComponent implements OnInit {
  portees: Portee[] = [];
  url = environment;
  deletingId: number | null = null;
  archivingId: number | null = null;
  activeTab: 'actives' | 'anciennes' = 'actives';
  private catsById = new Map<number, Cat>();

  constructor(private catService: CatService) { }

  ngOnInit(): void {
    this.catService.portee$.subscribe(portees => {
      if (portees) this.portees = portees;
    });

    this.catService.cat$.subscribe(cats => {
      if (cats) this.catsById = new Map(cats.map(c => [c.id, c]));
    });
  }

  recherche = '';

  private get onglet(): Portee[] {
    return this.portees.filter(p => this.activeTab === 'anciennes' ? p.archivee : !p.archivee);
  }

  get countActives(): number { return this.portees.filter(p => !p.archivee).length; }
  get countAnciennes(): number { return this.portees.filter(p => p.archivee).length; }

  /** Combien de chatons sont encore disponibles dans cette portée. */
  disponibles(portee: Portee): number {
    return (portee.chatons || []).filter(c => (c.status || '').toLowerCase().startsWith('dispo')).length;
  }

  get displayedPortees(): Portee[] {
    const q = this.recherche.trim().toLowerCase();
    if (!q) return this.onglet;
    return this.onglet.filter(p => (p.name || '').toLowerCase().includes(q)
      || (p.chatons || []).some(c => (c.name || '').toLowerCase().includes(q)));
  }

  motherPhoto(portee: Portee): string | undefined {
    return this.catsById.get(portee.idMaman)?.urlProfil || portee.urlProfilMother;
  }

  hasPhoto(url: string | undefined): boolean {
    return !!url && url.trim() !== '';
  }

  toggleArchive(portee: Portee): void {
    const newValue = !portee.archivee;
    this.archivingId = portee.id;
    this.catService.setPorteeArchiveStatus(portee.id, newValue).subscribe({
      next: () => {
        portee.archivee = newValue;
        this.catService.refreshPorteData(this.portees);
        this.archivingId = null;
      },
      error: () => {
        alert("L'opération a échoué.");
        this.archivingId = null;
      }
    });
  }

  confirmDelete(portee: Portee): void {
    if (!confirm(`Supprimer la portée "${portee.name}" et tous ses chatons ?`)) return;

    this.deletingId = portee.id;
    this.catService.deletePortee(portee.id).subscribe({
      next: () => {
        this.portees = this.portees.filter(p => p.id !== portee.id);
        this.catService.refreshPorteData(this.portees);
        this.deletingId = null;
      },
      error: () => {
        alert('La suppression a échoué.');
        this.deletingId = null;
      }
    });
  }
}
