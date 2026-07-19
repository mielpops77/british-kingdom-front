import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Contact } from 'src/app/models/contact';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {
  }


  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(environment.apiUrlContact, contact);
  }

  getAllContacts(profilId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${environment.apiUrlContact}?profilId=${profilId}`);
  }

  updateContact(id: number, contact: Contact): Observable<any> {
    return this.http.put<any>(`${environment.apiUrlContact}${id}`, contact);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrlContact}${id}`);
  }
}
