
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// import { appConfig } from './app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from "@angular/common/http";
import { DatePipe } from '@angular/common';

/* if (environment.production) {
  enableProdMode();
} */

/* platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
 */

/* bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); */

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    DatePipe,
      // provideAnimations(),
      provideRouter(routes) // Si vous utilisez le routeur Angular
  ]
}).catch(err => console.error(err));