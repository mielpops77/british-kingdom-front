import { CatService } from './components/Services/catService';
import { StatistiqueService } from './components/Services/statistique.service';
import { BannerSection } from './models/bannerSection.banner';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location, NgIf, NgStyle } from '@angular/common';
import { Subscription } from 'rxjs';
import { HeaderUserComponent } from './components/header-user/header-user.component';

import { FooterComponent } from './footer/footer.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [NgStyle, NgIf, HeaderUserComponent, RouterModule, FooterComponent]
})

export class AppComponent implements OnDestroy {

  isAllowed: boolean;
  isAdminRoute: boolean = false;
  isHomeRoute: boolean = false;
  data: BannerSection | null = null;
  showHeader: boolean = true;
  screenWidth: number = 1920;
  private isBrowser: boolean;

  private bannerSubscription: Subscription | undefined;


  constructor(
    private location: Location,
    private router: Router,
    private catService: CatService,
    private statistiqueService: StatistiqueService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {

    this.isBrowser = isPlatformBrowser(platformId);
    this.isAllowed = false; // Par défaut, l'accès est refusé

    if (this.isBrowser) {
      this.screenWidth = window.innerWidth;
    }
  }

  ngOnInit(): void {

    console.log('oyééé matelot');
    if (this.isBrowser) {
      window.addEventListener('resize', () => {
        this.screenWidth = window.innerWidth;
      });
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verifAdmin();
      }
    });
    this.verifAdmin();

    if (this.isBrowser && !this.isAdminRoute) {
      this.statistiqueService.enregistrerVisite().subscribe();
    }

    this.bannerSubscription = this.catService.banner$.subscribe((banner) => {

      if (banner !== null) {
        this.data = banner[0];

        if (this.isBrowser && this.data.favicon !== 'favicon.ico') {
          this.updateFavicon(environment.apiUrlFavicon + this.data?.favicon);
        }
      }
    });


  }

  verifAdmin(): void {
    const currentUrl = this.location.path();
    this.isAdminRoute = currentUrl.includes('admin');
    this.isHomeRoute = currentUrl === '' || currentUrl === '/' || currentUrl === '/accueil';
  }

  getDynamicStyles(value: string): any {
    const styles: any = {};

    switch (value) {
      case 'colorHeader':
        styles['background-color'] = this.data?.colorHeader;
        break;
      case 'title':
        styles['font-family'] = this.data?.titleFontFamily;
        styles['color'] = this.data?.titleColor;
        styles['font-size'] = this.screenWidth < 1000 ? '40px' : this.data?.titleFontSize + 'px';
        styles['font-size'] = this.screenWidth < 850 ? '30px' : this.data?.titleFontSize + 'px';
        styles['font-size'] = this.screenWidth < 500 ? '25px' : this.data?.titleFontSize + 'px';
        break;
      case 'subtitle':
        styles['font-family'] = this.data?.subtitleFontFamily;
        styles['color'] = this.data?.subtitleColor;
        styles['font-size'] = this.screenWidth < 1000 ? '30px' : this.data?.subtitleFontSize + 'px';
        styles['font-size'] = this.screenWidth < 850 ? '20px' : this.data?.subtitleFontSize + 'px';
        styles['font-size'] = this.screenWidth < 500 ? '15px' : this.data?.subtitleFontSize + 'px';
        break;
      default:
        break;
    }

    return styles;
  }

  showHeaderAdmin(): void {
    this.showHeader = !this.showHeader;
  }

  private updateFavicon(faviconUrl: string): void {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  ngOnDestroy(): void {
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }
}
