import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { authInterceptor } from './admin/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch(), withInterceptors([authInterceptor])),DatePipe
  ]
};
