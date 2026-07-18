import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LoginResponse {
  message: string;
  userId: string;
  token: string;
}

const TOKEN_KEY = 'admin_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}auth/login`, { email, password }).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem(TOKEN_KEY, response.token);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
