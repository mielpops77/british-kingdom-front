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
}
