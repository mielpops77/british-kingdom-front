import { CatService } from '../../Services/catService';
import { BannerSection } from '../../../models/bannerSection.banner';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-edit',
  templateUrl: './header-edit.component.html',
  styleUrls: ['./header-edit.component.css']
})
export class HeaderEditComponent implements OnInit {


  bannerSubscription: Subscription | undefined;
  data: BannerSection | undefined;
  hasChanges: boolean = false;
  bannerColor: string = '#ffffff';
  // bannerTitle: string = '';
  // bannerSubtitle: string = '';
  fontSize: number = 16;
  fontStyle: string = 'normal';
  dataUpdate: BannerSection | undefined;

  constructor(private catService: CatService) { }

  ngOnInit(): void {
    this.bannerSubscription = this.catService.banner$.subscribe(banner => {

      if (banner !== null) {
        this.data = banner[0];
        this.dataUpdate = { ...banner[0] };
      }

    });


  }

  onFieldChange(fieldName: string, newValue: any) {
    console.log(`Champ ${fieldName} modifié ! Nouvelle valeur : ${newValue}`);

    if (this.dataUpdate && this.data) {
      // Check if any value is different from its counterpart in dataUpdate
      this.hasChanges =
        this.data.title !== this.dataUpdate.title ||
        this.data.titleFontSize !== this.dataUpdate.titleFontSize ||
        this.data.titleFontStyle !== this.dataUpdate.titleFontStyle ||
        this.data.titleFontFamily !== this.dataUpdate.titleFontFamily ||
        this.data.subtitle !== this.dataUpdate.subtitle ||
        this.data.subtitleFontSize !== this.dataUpdate.subtitleFontSize ||
        this.data.subtitleFontStyle !== this.dataUpdate.subtitleFontStyle ||
        this.data.subtitleFontFamily !== this.dataUpdate.subtitleFontFamily ||
        this.data.colorHeader !== this.dataUpdate.colorHeader ||
        this.data.titleColor !== this.dataUpdate.titleColor ||
        this.data.subtitleColor !== this.dataUpdate.subtitleColor;


      if (fieldName === 'colorHeader') {
        this.dataUpdate.colorHeader = newValue;
      } else if (fieldName === 'title') {
        this.dataUpdate.title = newValue;
      } else if (fieldName === 'titleFontSize') {
        this.dataUpdate.titleFontSize = newValue;
      } else if (fieldName === 'titleFontStyle') {
        this.dataUpdate.titleFontStyle = newValue;
      } else if (fieldName === 'titleFontFamily') {
        this.dataUpdate.titleFontFamily = newValue;
      } else if (fieldName === 'subtitle') {
        this.dataUpdate.subtitle = newValue;
      } else if (fieldName === 'subtitleFontSize') {
        this.dataUpdate.subtitleFontSize = newValue;
      } else if (fieldName === 'subtitleFontStyle') {
        this.dataUpdate.subtitleFontStyle = newValue;
      } else if (fieldName === 'subtitleFontFamily') {
        this.dataUpdate.subtitleFontFamily = newValue;
      } else if (fieldName === 'titleColor') {
        this.dataUpdate.titleColor = newValue;
      } else if (fieldName === 'subtitleColor') {
        this.dataUpdate.subtitleColor = newValue;
      }

    }
  }


  editBanner(): void {
    // this.bannerSection.bannerImages = this.bannerImagesUpdate;

    if (this.dataUpdate && this.data) {
      if (this.data.title !== this.dataUpdate.title) {
        this.data.title = this.dataUpdate.title;
      }
      if (this.data.titleFontSize !== this.dataUpdate.titleFontSize) {
        this.data.titleFontSize = this.dataUpdate.titleFontSize;
      }
      if (this.data.titleFontStyle !== this.dataUpdate.titleFontStyle) {
        this.data.titleFontStyle = this.dataUpdate.titleFontStyle;
      }
      if (this.data.titleFontFamily !== this.dataUpdate.titleFontFamily) {
        this.data.titleFontFamily = this.dataUpdate.titleFontFamily;
      }
      if (this.data.subtitle !== this.dataUpdate.subtitle) {
        this.data.subtitle = this.dataUpdate.subtitle;
      }
      if (this.data.subtitleFontSize !== this.dataUpdate.subtitleFontSize) {
        this.data.subtitleFontSize = this.dataUpdate.subtitleFontSize;
      }
      if (this.data.subtitleFontStyle !== this.dataUpdate.subtitleFontStyle) {
        this.data.subtitleFontStyle = this.dataUpdate.subtitleFontStyle;
      }
      if (this.data.subtitleFontFamily !== this.dataUpdate.subtitleFontFamily) {
        this.data.subtitleFontFamily = this.dataUpdate.subtitleFontFamily;
      }
      if (this.data.colorHeader !== this.dataUpdate.colorHeader) {
        this.data.colorHeader = this.dataUpdate.colorHeader;
      }
      if (this.data.titleColor !== this.dataUpdate.titleColor) {
        this.data.titleColor = this.dataUpdate.titleColor;
      }
      if (this.data.subtitleColor !== this.dataUpdate.subtitleColor) {
        this.data.subtitleColor = this.dataUpdate.subtitleColor;
      }

      this.catService.putBannerData(this.data).subscribe(
        response => {
          console.log('Mise à jour réussie', response);
          //  this.hasChanges = false;
        },
        error => {
          console.error('Erreur lors de la mise à jour', error);
        }
      );
    }
  }


  applyChanges(): void {


    this.editBanner();


  }


}
