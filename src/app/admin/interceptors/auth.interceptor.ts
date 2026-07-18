import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApiCall = req.url.startsWith(environment.apiUrl) || req.url.startsWith('http://localhost:3000/api');
  const token = authService.getToken();

  const authReq = (isApiCall && token)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (isApiCall && err.status === 401) {
        authService.logout();
        router.navigateByUrl('/admin/login');
      }
      return throwError(() => err);
    })
  );
};
