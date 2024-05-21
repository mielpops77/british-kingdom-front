
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { CatService } from '../Services/catService';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { Cat } from '../../models/cats';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-femelles',
  templateUrl: './femelles.component.html',
  styleUrls: ['./femelles.component.css'],
  standalone: true,
  imports: [NgClass, NgStyle, NgFor]
})
export class FemellesComponent implements OnInit, OnDestroy {

  private bannerSubscription: Subscription | undefined;
  private catSubscription: Subscription | undefined;

  cats: Cat[] = [];  // Initialisez un tableau vide

  url = environment;
  banner: any = [];
  dynamicStyles: any = {};

  constructor(private router: Router, private http: HttpClient, private catService: CatService) { }

  ngOnInit(): void {

    this.catSubscription = this.catService.cat$.subscribe(cats => {
      if (cats)
        this.cats = cats.filter((cat: Cat) => cat.sex === "Femelle")
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
    this.router.navigateByUrl('/femelles/' + id);
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
          'font-family': this.banner.titleFontStylePageFemelles,
          'color': this.banner.titleColorPageFemelles,
        },
        borderColor: {
          'border': "2px solid" + this.banner.bordureColorPageFemelles,
        },
        text: {
          'font-family': this.banner.textFontStylePageFemelles,
          'color': this.banner.textColorPageFemelles,
        },
      };
    }
  }


  onImageLoad() {
    // Ajoutez une classe pour déclencher l'animation
    const imageElement = event?.target as HTMLElement;
    if (imageElement) {
      imageElement.classList.add('loaded');
    }
  }

  ngOnDestroy(): void {
    this.bannerSubscription?.unsubscribe();
    this.catSubscription?.unsubscribe();

  }
}



