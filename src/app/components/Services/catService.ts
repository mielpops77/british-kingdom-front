import { BannerSection } from 'src/app/models/bannerSection.banner';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Portee } from 'src/app/models/portee';
import { Chaton } from 'src/app/models/chaton';
import { Injectable } from '@angular/core';
import { Cat } from 'src/app/models/cats';



@Injectable({
  providedIn: 'root'
})
export class CatService {


  private bannerSubject: BehaviorSubject<BannerSection[] | null> = new BehaviorSubject<BannerSection[] | null>(null);
  private catSubject: BehaviorSubject<Cat[] | null> = new BehaviorSubject<Cat[] | null>(null);
  private porteeSubject: BehaviorSubject<Portee[] | null> = new BehaviorSubject<Portee[] | null>(null);
  private chatonSubject: BehaviorSubject<Chaton[] | null> = new BehaviorSubject<Chaton[] | null>(null);


  public banner$: Observable<BannerSection[] | null> = this.bannerSubject.asObservable();
  public cat$: Observable<Cat[] | null> = this.catSubject.asObservable();
  public portee$: Observable<Portee[] | null> = this.porteeSubject.asObservable();
  public chaton$: Observable<Chaton[] | null> = this.chatonSubject.asObservable();



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
    this.loadPortee();
    this.loadChaton();

  }


  private loadBannerSection(): void {
    const url = `${environment.apiUrl}banner?id=${environment.id}`;
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
    const url = `${environment.apiUrl}banner?id=${environment.id}`;
    return this.http.put(url, data);
  }


  deleteMissingImages(imagePaths: string[], directory: string): Observable<any> {
    const deleteUrl = `${environment.apiUrl}banner/deleteMissingImages`; // Utilisez l'URL appropriée

    // Ajoutez le nom du dossier personnalisé à l'URL en tant que paramètre de requête
    const customDeleteUrl = `${deleteUrl}?directory=${directory}`;

    return this.http.delete(customDeleteUrl, { params: { imagePaths } });
  }


  private loadCats(): void {
    const profilId = environment.id; // Récupérez le profilId de l'environnement

    const url = `${environment.apiUrl}cats`;
    const params = { profilId: profilId.toString() }; // Ajoutez le profilId aux paramètres de la requête

    this.http.get<Cat[]>(url, { params }).subscribe(
      (cat) => {
        this.catSubject.next(cat);
      },
      (error) => {
        console.error('Error loading cat section', error);
      }
    );
  }


  refreshCatData(data: any): void {
    this.catSubject.next(data);
  }

  refreshPorteData(data: any): void {
    this.porteeSubject.next(data);
  }

  refreshChatonData(data: any): void {
    this.chatonSubject.next(data);
  }


  private loadPortee(): void {
    const profilId = environment.id; // Récupérez le profilId de l'environnement

    const url = `${environment.apiUrl}portee`;
    const params = { profilId: profilId.toString() }; // Ajoutez le profilId aux paramètres de la requête

    this.http.get<Portee[]>(url, { params }).subscribe(
      (portee) => {
        this.porteeSubject.next(portee);
      },
      (error) => {
        console.error('Error loading portee section', error);
      }
    );
  }


  private loadChaton(): void {
    const profilId = environment.id; // Récupérez le profilId de l'environnement

    const url = `${environment.apiUrl}chaton`;
    const params = { profilId: profilId.toString() }; // Ajoutez le profilId aux paramètres de la requête

    this.http.get<Chaton[]>(url, { params }).subscribe(
      (chaton) => {
        this.chatonSubject.next(chaton);
      },
      (error) => {
        console.error('Error loading portee section', error);
      }
    );
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

  editPortee(id: number, portee: Portee): Observable<Portee> {
    const url = `${environment.apiUrl}portee/${id}`;
    return this.http.put<Portee>(url, portee);
  }

  editChaton(id: number, chaton: Chaton): Observable<Chaton> {
    const url = `${environment.apiUrl}chaton/${id}`;
    return this.http.put<Chaton>(url, chaton);
  }


  createCat(catData: Cat): Observable<Cat> {
    return this.http.post<Cat>(environment.apiUrlCats, catData);
  }


  getCatById(catId: string) {
    const profilId = environment.id;
    return this.http.get(`${environment.apiUrl}cats/${catId}`, {
      params: { profilId: profilId.toString() }
    });
  }

  getPorteeById(porteId: string) {
    const profilId = environment.id;
    return this.http.get(`${environment.apiUrl}portee/${porteId}`, {
      params: { profilId: profilId.toString() }
    });
  }



  getAllCats() {
    const profilId = environment.id;
    const params = { profilId: profilId.toString() };
    return this.http.get(`${environment.apiUrl}cats`, { params });
  }


  getAllPortees(): Observable<Portee[]> {
    const profilId = environment.id;
    const params = new HttpParams().set('profilId', profilId.toString());
    return this.http.get<Portee[]>(`${environment.apiUrl}portee`, { params });
  }
  getAllChatons() {
    const profilId = environment.id;
    const params = { profilId: profilId.toString() };
    return this.http.get<Chaton[]>(`${environment.apiUrl}chaton`, { params });
  }



  createPorte(portee: Portee): Observable<any> {
    const profilId = environment.id;

    const params = new HttpParams().set('profilId', profilId.toString());

    return this.http.post<any>(environment.apiUrlPorte, portee, { params: params });
  }


  deletePortee(porteeId: number): Observable<any> {
    const url = `${environment.apiUrlPorte}${porteeId}`;
    return this.http.delete(url);
  }
  deleteChaton(chatonId: number): Observable<any> {
    const url = `${environment.apiUrlChaton}${chatonId}`;
    return this.http.delete(url);
  }
}
