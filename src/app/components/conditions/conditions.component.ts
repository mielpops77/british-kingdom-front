import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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

  constructor(
    private catService: CatService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.banner = banner[0];
        const container = this.el.nativeElement.querySelector('.conditions-container');
  
        // Créer un élément div pour accueillir le HTML
        const div = document.createElement('div');
        div.innerHTML = this.banner.textPageCondition;
  
        // Vider le contenu du conteneur
        this.renderer.setProperty(container, 'innerHTML', '');
  
        // Parcourir tous les éléments du div et appliquer les styles
        div.querySelectorAll('*').forEach((element: Element) => {
          const styles = this.extractStylesFromHtml(element.outerHTML);
          this.applyStyles(styles, element);
        });
  
        // Ajouter le contenu au conteneur
        this.renderer.appendChild(container, div);
      }
    });
  }
  
  private extractStylesFromHtml(htmlContent: string): { [key: string]: string } {
    // Créer un élément div pour accueillir le HTML
    const div = document.createElement('div');
    div.innerHTML = htmlContent;

    const styles: { [key: string]: string } = {};

    // Parcourir toutes les balises du div et extraire les styles
    div.querySelectorAll('*').forEach((element: Element) => {
      const computedStyles = getComputedStyle(element as HTMLElement);

      // Filtrer les styles pour ne conserver que ceux qui sont spécifiés explicitement dans le HTML
      Array.from(computedStyles).forEach((style) => {
        const property = style.trim();
        const value = computedStyles.getPropertyValue(property);
        styles[property] = value;
      });
    });

    return styles;
  }


  private applyStyles(styles: { [key: string]: string }, element: Element): void {
    // Appliquer les styles à l'élément spécifié
    Object.entries(styles).forEach(([property, value]) => {
      // Ignorer les styles de fond (background) pour rendre le fond transparent
      if (property.toLowerCase().includes('background')) {
        return;
      }
  
      this.renderer.setStyle(element, property, value);
    });
  
    // Ajouter un style de fond transparent
    this.renderer.setStyle(element, 'background', 'transparent');
  }
  
  
  ngOnDestroy(): void {
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }

  }
}
