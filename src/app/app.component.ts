import { CatService } from './components/Services/catService';
import { BannerSection } from './models/bannerSection.banner';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Location, NgStyle } from '@angular/common';
import { Subscription } from 'rxjs';
import { HeaderUserComponent } from './components/header-user/header-user.component';

import { FooterComponent } from './footer/footer.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [NgStyle, HeaderUserComponent, RouterModule, FooterComponent]
})

export class AppComponent implements OnDestroy {

  isAllowed: boolean;
  isAdminRoute: boolean = false;
  data: BannerSection | null = null;
  showHeader: boolean = true;
  screenWidth: number = window.innerWidth;

  private bannerSubscription: Subscription | undefined;


  constructor(
    private location: Location,
    private router: Router,
    private catService: CatService,
  ) {


    this.isAllowed = false; // Par défaut, l'accès est refusé


  }

  ngOnInit(): void {

    console.log('oyééé matelot');
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verifAdmin();
      }
    });



    this.bannerSubscription = this.catService.banner$.subscribe((banner) => {

      if (banner !== null) {
        this.data = banner[0];

        if (this.data.favicon !== 'favicon.ico') {
          this.updateFavicon(environment.apiUrlFavicon + this.data?.favicon);
        }
      }
    });


  }

  verifAdmin(): void {
    const currentUrl = this.location.path();
    this.isAdminRoute = currentUrl.includes('admin');
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
