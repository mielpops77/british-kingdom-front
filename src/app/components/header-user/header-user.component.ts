import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CatService } from '../Services/catService';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css'],
  standalone: true,
  imports: [NgStyle, NgIf, NgFor, RouterModule, MatIconModule]

})
export class HeaderUserComponent implements OnInit, OnDestroy {
  private bannerSubscription: Subscription | undefined;
  isAdminRoute: boolean = false;
  menuItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Mâles', path: '/males' },
    { label: 'Femelles', path: '/femelles' },
    { label: 'Chatons', path: '/chatons' },
    { label: 'Blog', path: '/blog' },
    { label: 'Liste d\'attente', path: '/liste-attente' },
    { label: 'Tarifs & conditions', path: '/conditions' },
    { label: 'Contact', path: '/contact' },
  ];
  colorMenu: string = '';
  hoverColorMenu: string = '';
  fontStyleMenu: string = '';
  menuOpen: boolean = false;
  private isBrowser: boolean;

  constructor(
    private catService: CatService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.colorMenu = banner[0].colorMenu;
        this.hoverColorMenu = banner[0].hoverColorMenu;
        this.fontStyleMenu = banner[0].fontStyleMenu;

        if (this.isBrowser) {
          document.documentElement.style.setProperty('--hover-color-menu', this.hoverColorMenu);
        }
      }
    })
  }


  toggleMobileMenu(): void {
    this.menuOpen = !this.menuOpen;
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
