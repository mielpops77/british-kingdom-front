import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor(private http: HttpClient) { }

  getIpAddress(): Promise<string> {
    return this.http.get('https://api.ipify.org?format=json')
      .toPromise()
      .then((response: any) => {
        const ipAddress = response.ip;
        return ipAddress;
      })
      .catch(() => '');
  }
}
