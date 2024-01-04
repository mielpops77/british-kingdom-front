import { IpService } from '../../../ipService/ip-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CatService } from '../Services/catService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit, OnDestroy {
  private bannerSubscription: Subscription | undefined;
  isAllowed: boolean;
  isAdminRoute: boolean = false;
  menu: string[] = [];
  colorMenu: string = '';
  hoverColorMenu: string = '';
  fontStyleMenu: string = '';
  fontStyle: string = 'Arial';  // Déclaration de la propriété fontStyle
  isMobile: boolean = false;

  constructor(private ipService: IpService, private location: Location, private router: Router, private catService: CatService) {
    this.isAllowed = false;
    this.checkAccess();
  }


  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verifAdmin();
      }


    });
    this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.isMobile = window.innerWidth <= 767;
        this.menu = banner[0].menu;
        this.colorMenu = banner[0].colorMenu;
        this.hoverColorMenu = banner[0].hoverColorMenu;
        this.fontStyleMenu = banner[0].fontStyleMenu;
        document.documentElement.style.setProperty('--hover-color-menu', this.hoverColorMenu);
      }
    })
  }

/*   toggleMobileMenu(): void {
    const navList = document.querySelector('.navUser ul');
    console.log('proute',navList);

    if (navList) {
      navList.classList.toggle('show-mobile-menu');
    }
  } */

  toggleMobileMenu(): void {
    console.log('ookokok');
    this.isMobile = !this.isMobile;
  }
  

  checkAccess(): void {
    this.ipService.getIpAddress().then((ipAddress: string) => {
      const myIpAddress = '176.176.241.111';
      this.isAllowed = (ipAddress === myIpAddress);
    });
  }

  verifAdmin(): void {
    const currentUrl = this.location.path();
    this.isAdminRoute = currentUrl.includes('admin');
  }


  getDynamicStyles(): any {
    const styles: any = {};
    styles['font-family'] = this.fontStyleMenu;
    return styles;
  }

  ngOnDestroy(): void {
    // Se désabonner de l'observable lors de la destruction du composant
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }

}
