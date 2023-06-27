import { Component } from '@angular/core';
import { IpService } from '../ipService/ip-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAllowed: boolean;
  constructor(private ipService: IpService) {
    this.isAllowed = false; // Par défaut, l'accès est refusé
    this.checkAccess();
  }

  checkAccess(): void {
    this.ipService.getIpAddress().then((ipAddress: string) => {
      const myIpAddress = '176.176.241.111'; // Remplacez par votre adresse IP personnelle
      this.isAllowed = (ipAddress === myIpAddress);
    });
  }
  title = 'British-Kingdom';
}
