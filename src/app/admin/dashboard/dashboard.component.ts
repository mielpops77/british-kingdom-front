import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StatistiqueService } from '../../components/Services/statistique.service';

interface Stats {
  nbrVisitesTotal: number;
  nbrVisitesJour: number;
}

interface DailyBar {
  date: Date;
  count: number;
  heightPercent: number;
}

interface LocationStat {
  location: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: Stats | undefined;
  loading = true;
  recentVisits: { visitedAt: Date; location: string | null; device: string; isBot: boolean; visitorIp: string | null }[] = [];
  loadingVisits = true;
  dailyBars: DailyBar[] = [];
  loadingDaily = true;
  topLocations: LocationStat[] = [];
  loadingLocations = true;
  onlineCount = 0;
  loadingOnline = true;
  private onlineInterval: any;

  constructor(private http: HttpClient, private statistiqueService: StatistiqueService) { }

  ngOnInit(): void {
    this.refreshOnlineCount();
    this.onlineInterval = setInterval(() => this.refreshOnlineCount(), 20000);

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
        this.recentVisits = visits.map(v => ({ visitedAt: new Date(v.visitedAt), location: v.location, device: v.device, isBot: v.isBot, visitorIp: v.visitorIp }));
        this.loadingVisits = false;
      },
      error: () => {
        this.loadingVisits = false;
      }
    });

    this.statistiqueService.getDailyStats(environment.id, 14).subscribe({
      next: (days) => {
        const maxCount = Math.max(1, ...days.map(d => d.count));
        this.dailyBars = days.map(d => ({
          date: new Date(d.date),
          count: d.count,
          heightPercent: Math.round((d.count / maxCount) * 100)
        }));
        this.loadingDaily = false;
      },
      error: () => {
        this.loadingDaily = false;
      }
    });

    this.statistiqueService.getTopLocations(environment.id, 30, 5).subscribe({
      next: (locations) => {
        const maxCount = Math.max(1, ...locations.map(l => l.count));
        this.topLocations = locations.map(l => ({
          location: l.location,
          count: l.count,
          percent: Math.round((l.count / maxCount) * 100)
        }));
        this.loadingLocations = false;
      },
      error: () => {
        this.loadingLocations = false;
      }
    });
  }

  refreshOnlineCount(): void {
    this.statistiqueService.getOnlineCount(environment.id).subscribe({
      next: (res) => {
        this.onlineCount = res.online;
        this.loadingOnline = false;
      },
      error: () => {
        this.loadingOnline = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.onlineInterval) {
      clearInterval(this.onlineInterval);
    }
  }
}
