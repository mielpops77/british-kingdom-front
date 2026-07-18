
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { CatService } from '../Services/catService';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Cat } from '../../models/cats';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-males',
  templateUrl: './males.component.html',
  styleUrls: ['./males.component.css'],
  standalone: true,
  imports: [NgClass, NgStyle, NgFor, RouterLink]
})
export class MalesComponent implements OnInit, OnDestroy {

  private bannerSubscription: Subscription | undefined;
  private catSubscription: Subscription | undefined;

  cats: Cat[] = [];  // Initialisez un tableau vide

  url = environment;
  banner: any = [];
  dynamicStyles: any = {};


  constructor(private router: Router, private http: HttpClient, private catService: CatService, private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('Nos chats mâles British Shorthair & Longhair | Chatterie British Kingdom');
    this.meta.updateTag({ name: 'description', content: "Découvrez nos chats mâles British Shorthair et British Longhair, chatterie familiale à Othis, Seine-et-Marne." });

    this.catSubscription = this.catService.cat$.subscribe(cats => {
      if (cats)
        this.cats = cats.filter((cat: Cat) => cat.sex === "Mâle")
    });

    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.banner = banner[0];
        this.getDynamicStyles();

      }
    });
  }
  redirectToNewUrl(id: number, cat: Cat): void {
    localStorage.setItem('selectedCat', JSON.stringify(cat));
    this.router.navigateByUrl('/males/' + id);
  }

  getGridClass(numCats: number): string {
    if (numCats === 3) {
      return 'image-grid';
    } else if (numCats === 2) {
      return 'two-columns';
    }
    else if (numCats === 1) {
      return 'one-column';
    }
    else {
      return 'image-grid';
    }
  }




  getDynamicStyles(): void {
    if (this.banner) {
      this.dynamicStyles = {
        title: {
          'font-family': this.banner.titleFontStylePageMales,
          'color': this.banner.titleColorPageMales,
        },
        borderColor: {
          'border': "2px solid" + this.banner.bordureColorPageMales,
        },
        text: {
          'font-family': this.banner.textFontStylePageMales,
          'color': this.banner.textColorPageMales,
        },
      };
    }
  }



  getAge(dateOfBirth: string): string {
    if (!dateOfBirth) return '';
    const birth = new Date(dateOfBirth);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      years--;
    }
    if (years < 1) {
      let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      if (now.getDate() < birth.getDate()) months--;
      months = Math.max(months, 1);
      return months === 1 ? '1 mois' : `${months} mois`;
    }
    return years === 1 ? '1 an' : `${years} ans`;
  }

  isAvailable(cat: Cat): boolean {
    const v = (cat.sailliesExterieures || '').trim().toLowerCase();
    return v === 'oui' || v === 'yes' || v === 'true';
  }

  onImageLoad() {
    // Ajoutez une classe pour déclencher l'animation
    const imageElement = event?.target as HTMLElement;
    if (imageElement) {
      imageElement.classList.add('loaded');
    }
  }

  ngOnDestroy(): void {
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
    if (this.catSubscription) {
      this.catSubscription.unsubscribe();
    }
  }
}
