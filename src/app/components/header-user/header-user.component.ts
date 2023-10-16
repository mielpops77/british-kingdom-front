import { IpService } from '../../../ipService/ip-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {

  isAllowed: boolean;
  isAdminRoute: boolean = false;

  constructor(private ipService: IpService, private location: Location, private router: Router) {
    this.isAllowed = false; 
    this.checkAccess();
  }


  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verifAdmin();
      }
    });
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




}
