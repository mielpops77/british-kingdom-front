import { CatService } from '../Services/catService';
import { BannerSection } from '../../models/bannerSection.banner';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
})
export class AccueilComponent implements OnInit, OnDestroy {
  bannerSection: BannerSection | null = null;
  private bannerSubscription: Subscription | undefined;

  constructor(private catService: CatService) { }

  ngOnInit(): void {

    this.bannerSubscription = this.catService.banner$.subscribe((banner) => {
      if (banner !== null) {
        this.bannerSection = banner[0];
        console.log('bannerSection', this.bannerSection);
      }
    });


  }

  ngOnDestroy(): void {
    if (this.bannerSubscription) {
      this.bannerSubscription?.unsubscribe();
    }
  }
}
