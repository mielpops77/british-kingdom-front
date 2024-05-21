import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private requests: Observable<any>[] = []; // Utilisez un tableau d'Observable<any>

  // Ajout des sujets pour suivre l'état de chargement de la bannière et de l'enregistrement de visite
  private bannerLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private visiteLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  public get(url: string): Observable<any> {
    const request = this.http.get(url);
    this.requests.push(request); // Pousser l'Observable dans le tableau
    this.trackRequest(request);
    return request;
  }

  private trackRequest(request: Observable<any>): void {
    // Mettre à jour l'état de chargement de la bannière lorsqu'une requête est effectuée
    this.setBannerLoading(true);

    request.subscribe(
      (response: HttpResponse<any>) => {
        this.removeRequest(request);
        // Mettre à jour l'état de chargement de la bannière lorsque la réponse est reçue
        this.setBannerLoading(false);
      },
      (error: any) => {
        this.removeRequest(request);
        // Mettre à jour l'état de chargement de la bannière en cas d'erreur
        this.setBannerLoading(false);
      }
    );
  }



  private removeRequest(request: Observable<any>): void {
    const index = this.requests.indexOf(request);
    if (index !== -1) {
      this.requests.splice(index, 1);
    }
  }

/*     public isLoading(): boolean {
      return this.requests.length > 0;
    }
 */


  // Méthodes pour accéder et modifier l'état de chargement de la bannière
  public getBannerLoading(): Observable<boolean> {
    return this.bannerLoadingSubject.asObservable();
  }

  public setBannerLoading(loading: boolean): void {
    this.bannerLoadingSubject.next(loading);
  }

  // Méthodes pour accéder et modifier l'état de chargement de l'enregistrement de visite
  public getVisiteLoading(): Observable<boolean> {
    return this.visiteLoadingSubject.asObservable();
  }

  public setVisiteLoading(loading: boolean): void {
    this.visiteLoadingSubject.next(loading);
  }
}
