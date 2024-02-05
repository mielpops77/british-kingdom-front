import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BannerSection } from '../../models/bannerSection.banner';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-caroussel',
  templateUrl: './caroussel.component.html',
  styleUrls: ['./caroussel.component.css'],
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation des styles

})
export class CarousselComponent implements OnInit {
  @Input() bannerSection: BannerSection | null = null;;

  url = environment;
  constructor() { }

  ngOnInit(): void {
  }

}
