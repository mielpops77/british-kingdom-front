import { Component,Input, OnInit } from '@angular/core';
import { BannerSection } from '../../models/bannerSection.banner';

@Component({
  selector: 'app-caroussel',
  templateUrl: './caroussel.component.html',
  styleUrls: ['./caroussel.component.css']
})
export class CarousselComponent implements OnInit {
  @Input() bannerSection: BannerSection  | null = null;;


  constructor() { }

  ngOnInit(): void {
    console.log('ijrjijijijijijij',this.bannerSection);
  }

}
