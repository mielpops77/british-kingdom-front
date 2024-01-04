
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CatService } from '../Services/catService';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Cat } from '../../models/cats';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-femelles',
  templateUrl: './femelles.component.html',
  styleUrls: ['./femelles.component.css']
})
export class FemellesComponent implements OnInit, OnDestroy {

  private bannerSubscription: Subscription | undefined;
  private catSubscription: Subscription | undefined;

  cats: Cat[] = [];  // Initialisez un tableau vide

  url = environment;
  banner: any = [];
  constructor(private router: Router, private http: HttpClient, private catService: CatService) { }

  ngOnInit(): void {

    this.catSubscription = this.catService.cat$.subscribe(cats => {
      if (cats)
        this.cats = cats.filter((cat: Cat) => cat.sex === "female")
    });

    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.banner = banner[0];
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



  getDynamicStyles(value: string): any {
    const styles: any = {};
    switch (value) {
      case 'borderColor':
        styles['border'] = "2px solid" + this.banner.bordureColorPageFemelles;
        break;
      case 'title':
        styles['font-family'] = this.banner.titleFontStylePageFemelles;
        styles['color'] = this.banner.titleColorPageFemelles;
        break;
      case 'text':
        styles['font-family'] = this.banner.textFontStylePageFemelles;
        styles['color'] = this.banner.textColorPageFemelles;
        break;
      default:
        break;
    }

    return styles;
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



