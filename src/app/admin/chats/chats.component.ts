import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatService } from '../../components/Services/catService';
import { Cat } from '../../models/cats';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink]
})
export class AdminChatsComponent implements OnInit {
  cats: Cat[] = [];
  url = environment;
  deletingId: number | null = null;

  constructor(private catService: CatService) { }

  ngOnInit(): void {
    this.catService.cat$.subscribe(cats => {
      if (cats) this.cats = cats;
    });
  }

  confirmDelete(cat: Cat): void {
    if (!confirm(`Supprimer ${cat.name} ? Cette action est définitive.`)) return;

    this.deletingId = cat.id;
    this.catService.deleteCat(cat.id).subscribe({
      next: () => {
        this.cats = this.cats.filter(c => c.id !== cat.id);
        this.catService.refreshCatData(this.cats);
        this.deletingId = null;
      },
      error: () => {
        alert('La suppression a échoué.');
        this.deletingId = null;
      }
    });
  }
}
