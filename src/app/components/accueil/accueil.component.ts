import { CatService } from '../Services/catService';
import { BannerSection } from '../../models/bannerSection.banner';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
})
export class AccueilComponent implements OnInit, OnDestroy {
  bannerSection: BannerSection | null = null;
  private bannerSubscription: Subscription | undefined;


  url = environment;
  constructor(private catService: CatService) { }

  ngOnInit(): void {

    this.bannerSubscription = this.catService.banner$.subscribe((banner) => {
      if (banner !== null) {
        this.bannerSection = banner[0];
      }
    });


  }

  getDynamicStyles(value: string): any {
    const styles: any = {};

    if(this.bannerSection){
    switch (value) {

      case 'title':
        styles['font-family'] = this.bannerSection.titleFontStyleCard;
        styles['color'] = this.bannerSection.titleColorCard;
        break;
      case 'text':
        styles['font-family'] = this.bannerSection.textFontStyleCard;
        styles['color'] = this.bannerSection.textColorCard;
        break;
      case 'background':
        styles['background-color'] = this.bannerSection.backgroundColorCard;
        break;
  
      default:
        break;
    }}

    return styles;
  }




  ngOnDestroy(): void {
    if (this.bannerSubscription) {
      this.bannerSubscription?.unsubscribe();
    }
  }
}
