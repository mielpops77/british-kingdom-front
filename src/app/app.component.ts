import { Component, OnDestroy } from '@angular/core';
import { IpService } from '../ipService/ip-service.service';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { BannerSection } from './models/bannerSection.banner';
import { Subscription } from 'rxjs';
import { CatService } from './components/Services/catService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  isAllowed: boolean;
  isAdminRoute: boolean = false;
  data: BannerSection | null = null;
  showHeader: boolean = true;
  screenWidth: number = window.innerWidth;

  private bannerSubscription: Subscription | undefined;

  constructor(private ipService: IpService, private location: Location, private router: Router, private catService: CatService) {
    this.isAllowed = false; // Par défaut, l'accès est refusé
  }

  ngOnInit(): void {
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
        styles['font-style'] = this.data?.titleFontStyle;
        styles['color'] = this.data?.titleColor;

        // Ajuster la taille de la police du titre en fonction de la largeur de l'écran
        styles['font-size'] = this.screenWidth < 1000 ? '40px' : this.data?.titleFontSize + 'px';
        styles['font-size'] = this.screenWidth < 850 ? '30px' : this.data?.titleFontSize + 'px';
        styles['font-size'] = this.screenWidth < 500 ? '25px' : this.data?.titleFontSize + 'px';



        break;
      case 'subtitle':
        styles['font-family'] = this.data?.subtitleFontFamily;
        styles['font-style'] = this.data?.subtitleFontStyle;
        styles['color'] = this.data?.subtitleColor;

        // Ajuster la taille de la police du sous-titre en fonction de la largeur de l'écran
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
    this.showHeader = !this.showHeader

  }


  ngOnDestroy(): void {

    console.log('?????');

    if (this.bannerSubscription) {
      console.log('bannerSubscription');

      this.bannerSubscription.unsubscribe();
    }
  }

}
