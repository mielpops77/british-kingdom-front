import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StatistiqueService } from '../../components/Services/statistique.service';

interface Stats {
  nbrVisitesTotal: number;
  nbrVisitesJour: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe]
})
export class DashboardComponent implements OnInit {
  stats: Stats | undefined;
  loading = true;
  recentVisits: Date[] = [];
  loadingVisits = true;

  constructor(private http: HttpClient, private statistiqueService: StatistiqueService) { }

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

    this.statistiqueService.getRecentVisits(environment.id).subscribe({
      next: (visits) => {
        this.recentVisits = visits.map(v => new Date(v));
        this.loadingVisits = false;
      },
      error: () => {
        this.loadingVisits = false;
      }
    });
  }
}
