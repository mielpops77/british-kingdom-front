import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../Services/seo.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class ConditionsComponent {
  constructor(private title: Title, private meta: Meta, private seo: SeoService) {
    this.title.setTitle('Tarifs et conditions | Chatterie British Kingdom');
    this.meta.updateTag({ name: 'description', content: "Tarifs, conditions de réservation et modalités d'adoption pour nos chatons British Shorthair et British Longhair." });
    this.seo.setCanonical('https://chatterie-british-kingdom.fr/conditions');
  }
}
