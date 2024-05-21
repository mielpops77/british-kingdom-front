import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CatService } from '../Services/catService';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css'],
  standalone: true,
  imports: [NgStyle, NgIf, NgFor, RouterModule, MatIconModule, BrowserAnimationsModule]

})
export class HeaderUserComponent implements OnInit, OnDestroy {
  private bannerSubscription: Subscription | undefined;
  isAdminRoute: boolean = false;
  menu: string[] = [];
  colorMenu: string = '';
  hoverColorMenu: string = '';
  fontStyleMenu: string = '';
  isMobile: boolean = false;

  constructor(private catService: CatService) {
  }


  ngOnInit(): void {
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


  toggleMobileMenu(): void {
    console.log('ookokok');
    this.isMobile = !this.isMobile;
  }


  getDynamicStyles(): any {
    const styles: any = {};
    styles['font-family'] = this.fontStyleMenu;
    return styles;
  }

  ngOnDestroy(): void {
    this.bannerSubscription?.unsubscribe();
  }

}
