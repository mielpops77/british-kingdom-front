import { BannerSection } from 'src/app/models/bannerSection.banner';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cat } from 'src/app/models/cats';

@Injectable({
  providedIn: 'root'
})
export class CatService {


  private bannerSubject: BehaviorSubject<BannerSection[] | null> = new BehaviorSubject<BannerSection[] | null>(null);
  private catSubject: BehaviorSubject<Cat[] | null> = new BehaviorSubject<Cat[] | null>(null);
  public banner$: Observable<BannerSection[] | null> = this.bannerSubject.asObservable();
  public cat$: Observable<Cat[] | null> = this.catSubject.asObservable();

  races: string[] = [
    'Abyssin',
    'American Bobtail',
    'American Curl',
    'American Shorthair',
    'American Wirehair',
    'Angora Turc',
    'Balinais',
    'Bengal',
    'Birman',
    'Bombay',
    'British Longhair',
    'British Shorthair',
    'Burmese',
    'Burmilla',
    'Californian Spangled',
    'Ceylan',
    'Chartreux',
    'Chausie',
    'Cornish Rex',
    'Cymric',
    'Devon Rex',
    'Donskoy',
    'Égyptien Mau',
    'Européen',
    'Exotic Shorthair',
    'German Rex',
    'Havana Brown',
    'Highland Fold',
    'Himalayen',
    'Korat',
    'LaPerm',
    'Maine Coon',
    'Manx',
    'Mau Arabe',
    'Minskin',
    'Munchkin',
    'Nebelung',
    'Norvégien',
    'Ocicat',
    'Ojos Azules',
    'Oriental',
    'Oriental à poil long',
    'Oriental Shorthair',
    'Persan',
    'Peterbald',
    'Pixie-bob',
    'Ragamuffin',
    'Ragdoll',
    'Russe Bleu',
    'Sacré de Birmanie',
    'Savannah',
    'Scottish Fold',
    'Selkirk Rex',
    'Siamois',
    'Sibérien',
    'Singapura',
    'Snowshoe',
    'Sokoké',
    'Somali',
    'Sphynx',
    'Tiffany',
    'Tonkinois',
    'Toyger',
    'Turc de Van'
  ];

  constructor(private http: HttpClient) {
    this.loadBannerSection();
    this.loadCats();
  }


  private loadBannerSection(): void {
    const url = `${environment.apiUrl}banner?id=1`;
    this.http.get<BannerSection[]>(url).subscribe(
      (banner) => {
        this.bannerSubject.next(banner);
      },
      (error) => {
        console.error('Error loading banner section', error);
      }
    );
  }


  putBannerData(data: any): Observable<any> {
    const url = `${environment.apiUrl}banner/1`;
    return this.http.put(url, data);
  }


  deleteMissingImages(imagePaths: string[], directory: string): Observable<any> {
    const deleteUrl = `${environment.apiUrl}banner/deleteMissingImages`; // Utilisez l'URL appropriée

    // Ajoutez le nom du dossier personnalisé à l'URL en tant que paramètre de requête
    const customDeleteUrl = `${deleteUrl}?directory=${directory}`;

    return this.http.delete(customDeleteUrl, { params: { imagePaths } });
  }


  private loadCats(): void {
    const url = `${environment.apiUrl}cats`;
    this.http.get<Cat[]>(url).subscribe(
      (cat) => {
        this.catSubject.next(cat);
      },
      (error) => {
        console.error('Error loading banner section', error);
      }
    );
  }

  refreshCatData(data: any): void {
    this.catSubject.next(data);
  }


  uploadImages(directory: string, file: File[]): Observable<any> {
    const formData = new FormData();
  
    for (const files of file) {
      formData.append('files', files);
    }
    return this.http.post<any>(`${environment.apiUrl}images/upload?directory=${directory}`, formData);
  }
  
  editCat(id: number, cat: Cat): Observable<Cat> {
    const url = `${environment.apiUrl}cats/${id}`;
    return this.http.put<Cat>(url, cat);
  }



  getCatById(id: string) {
    return this.http.get(`${environment.apiUrl}cats/${id}`);
  }

  getAllCat() {
    return this.http.get(`${environment.apiUrl}cats/`);
  }
}
