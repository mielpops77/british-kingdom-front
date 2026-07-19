import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  private baseUrl = environment.apiUrlStatistique; // Remplacez par l'URL de votre backend
  private visiteEnregistree = false; // Variable pour contrôler l'enregistrement de la visite

  constructor(private http: HttpClient) { }

  // Méthode pour enregistrer une visite une seule fois
  enregistrerVisite() {
    // Vérifier si la visite a déjà été enregistrée
    if (!this.visiteEnregistree) {
      const profilId = environment.id;
      this.visiteEnregistree = true; // Marquer la visite comme enregistrée
      return this.http.post<any>(`${this.baseUrl}`, { profilId });
    } else {
      console.log('La visite a déjà été enregistrée.');
      // Retourner un observable vide si la visite a déjà été enregistrée
      return of(null);
    }
  }

  getRecentVisits(profilId: number, limit = 20) {
    return this.http.get<{ visitedAt: string; location: string | null; device: string; isBot: boolean }[]>(`${this.baseUrl}/recent/${profilId}?limit=${limit}`);
  }

  getDailyStats(profilId: number, days = 14) {
    return this.http.get<{ date: string; count: number }[]>(`${this.baseUrl}/daily/${profilId}?days=${days}`);
  }

  getTopLocations(profilId: number, days = 30, limit = 5) {
    return this.http.get<{ location: string; count: number }[]>(`${this.baseUrl}/locations/${profilId}?days=${days}&limit=${limit}`);
  }
}
