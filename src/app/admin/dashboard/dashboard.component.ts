import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Stats {
  nbrVisitesTotal: number;
  nbrVisitesJour: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgIf]
})
export class DashboardComponent implements OnInit {
  stats: Stats | undefined;
  loading = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Stats>(`${environment.apiUrl}statistique/${environment.id}`).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
