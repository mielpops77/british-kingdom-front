import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LigneSante } from '../../models/sante';
import { aujourdhuiISO, joursEntre } from './dates';

/** Le carnet de santé : pesées des chatons, vaccins des reproducteurs. */
@Injectable({ providedIn: 'root' })
export class SanteService {
  constructor(private http: HttpClient) { }

  lister(categorie?: 'poids' | 'vaccin'): Observable<LigneSante[]> {
    const suite = categorie ? '&categorie=' + categorie : '';
    return this.http.get<LigneSante[]>(`${environment.apiUrlSante}?profilId=${environment.id}${suite}`);
  }

  ajouter(ligne: Partial<LigneSante>): Observable<LigneSante> {
    return this.http.post<LigneSante>(environment.apiUrlSante, { ...ligne, profilId: environment.id });
  }

  modifier(id: number, ligne: Partial<LigneSante>): Observable<LigneSante> {
    return this.http.put<LigneSante>(`${environment.apiUrlSante}/${id}`, { ...ligne, profilId: environment.id });
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrlSante}/${id}`);
  }
}

/* --------------------------------------------------------------------------
   La règle des rappels, écrite une seule fois : la page Santé et le chiffre
   du menu doivent dire la même chose.
   -------------------------------------------------------------------------- */

export type UrgenceRappel = 'retard' | 'bientot' | 'prevu' | 'aucun';

/** Le rappel qui compte : le prochain à venir ; sinon le dernier passé, donc en retard. */
export function rappelQuiCompte(vaccins: LigneSante[]): string | null {
  const rappels = vaccins.map(v => v.rappel).filter((r): r is string => !!r).sort();
  if (!rappels.length) return null;
  const aujourdhui = aujourdhuiISO();
  const avenir = rappels.filter(r => joursEntre(aujourdhui, r) >= 0);
  return avenir.length ? avenir[0] : rappels[rappels.length - 1];
}

/** Dépassé, dans le mois, plus loin, ou rien de noté. */
export function urgenceRappel(rappel: string | null): UrgenceRappel {
  if (!rappel) return 'aucun';
  const jours = joursEntre(aujourdhuiISO(), rappel);
  return jours < 0 ? 'retard' : jours <= 30 ? 'bientot' : 'prevu';
}
