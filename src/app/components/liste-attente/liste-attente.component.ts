import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../Services/seo.service';

@Component({
  selector: 'app-liste-attente',
  templateUrl: './liste-attente.component.html',
  styleUrls: ['./liste-attente.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class ListeAttenteComponent {
  constructor(private title: Title, private meta: Meta, private seo: SeoService) {
    this.title.setTitle("Liste d'attente | Chatterie British Kingdom");
    this.meta.updateTag({ name: 'description', content: "Inscrivez-vous sur notre liste d'attente pour réserver un chaton British Shorthair ou British Longhair." });
    this.seo.setCanonical('https://chatterie-british-kingdom.fr/liste-attente');
  }
}
