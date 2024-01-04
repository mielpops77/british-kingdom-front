import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatService } from '../Services/catService';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css']
})
export class ConditionsComponent implements OnInit, OnDestroy {
  private bannerSubscription: Subscription | undefined;
  banner: any = [];

  constructor(private catService: CatService) { }

  ngOnInit(): void {
    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.banner = banner[0];
        console.log(' this.banner', this.banner.textPageConditions);
        const formattedTextPageConditions = this.banner.textPageConditions.join("");
        
        const htmlArray = formattedTextPageConditions.split("</div>");
        console.log(' this.htmlArray', htmlArray);


      }
    });
  }

  ngOnDestroy(): void {
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }

  }
}
