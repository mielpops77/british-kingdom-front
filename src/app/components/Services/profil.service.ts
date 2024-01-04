import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profil } from 'src/app/models/profil';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(private http: HttpClient) {
  }

  getProfil() {
    return this.http.get(`${environment.apiUrl}profil/`);
  }

  getProfilById(): Observable<Profil> {
    return this.http.get<Profil>(`${environment.apiUrl}profil/1`);
  }

  updateProfil(updatedProfil: Profil): Observable<any> {
    return this.http.put(`${environment.apiUrl}profil/${updatedProfil.id}`, updatedProfil);
  }
  
}
