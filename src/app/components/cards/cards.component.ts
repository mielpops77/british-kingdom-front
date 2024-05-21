
import { BannerSection } from '../../models/bannerSection.banner';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { environment } from 'src/environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgFor, NgStyle } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  standalone: true,
  imports: [MatCardModule, NgStyle, RouterModule, NgFor, MatButtonModule]

})
export class CardsComponent implements OnInit {
  @Input() bannerSection: BannerSection | null = null;
  dynamicStylesTitle: any = {};
  dynamicStylesText: any = {};
  dynamicStylesTextLocalisation: any = {}
  url = environment;

  constructor() { }

  ngOnInit(): void {
    this.setDynamicStyles();
  }

  setDynamicStyles(): void {
    if (this.bannerSection) {
      this.dynamicStylesTitle = {
        'font-family': this.bannerSection.titleFontStyleCard,
        'color': this.bannerSection.titleColorCard,
        'background-color': this.bannerSection.backgroundColorCard
      };

      this.dynamicStylesText =
      {
        'font-family': this.bannerSection.textFontStyleCard,
        'color': this.bannerSection.textColorCard,
      }

      this.dynamicStylesTextLocalisation =
      {
        'font-family': this.bannerSection.textFontStylePageAccueil,
        'color': this.bannerSection.textColorPageAccueil,
        'font-weight': "bold"
      }

    } else {
      this.dynamicStylesTitle = {};
      this.dynamicStylesText = {};
      this.dynamicStylesTextLocalisation = {};

    }


  }


}
