import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BannerSection } from '../../models/bannerSection.banner';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-caroussel',
  templateUrl: './caroussel.component.html',
  styleUrls: ['./caroussel.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgbCarouselModule, NgFor, NgIf]
})
export class CarousselComponent {
  @Input() bannerSection: BannerSection | null = null;
  url = environment;

}
