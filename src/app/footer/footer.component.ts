import { CatService } from '../components/Services/catService';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  private bannerSubscription: Subscription | undefined;
  colorFooter: string = "";

  constructor(private catService: CatService) { }

  ngOnInit(): void {
    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.colorFooter = banner[0].colorFooter;
      }
    });
  }


  getDynamicStyles(): any {
    const styles: any = {};
    styles['background-color'] = this.colorFooter;
    return styles;
  }

  ngOnDestroy(): void {
    // Assurez-vous de désabonner votre composant lorsqu'il est détruit
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }
}
