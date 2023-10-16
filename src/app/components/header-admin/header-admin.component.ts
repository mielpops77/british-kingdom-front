import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent implements OnInit {

  openItem: string | null = null;
  isAdminRoute: boolean = false;
  showHeader: boolean = true;

  constructor(private location: Location, private router: Router) {
    // this.isAllowed = false; 
    // this.checkAccess();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verifAdmin();
      }
    });
  }

  verifAdmin(): void {
    const currentUrl = this.location.path();
    this.isAdminRoute = currentUrl.includes('admin');
  }

  showHeaderAdmin(): void {
    this.showHeader = !this.showHeader

    console.log( this.showHeader );

  }

  toggleItem(item: string) {
    this.openItem = this.openItem === item ? null : item;
  }
}