import { BannerSection } from '../../models/bannerSection.banner';
import { LoadingComponent } from '../loading/loading.component';
import { LoadingService } from '../Services/loading.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CardsComponent } from '../cards/cards.component';
import { CatService } from '../Services/catService';
import { Profil } from 'src/app/models/profil';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../Services/seo.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
  imports: [LoadingComponent, CardsComponent, NgIf, RouterModule
  ],
  standalone: true,
})


export class AccueilComponent implements OnInit, OnDestroy {

  bannerSection: BannerSection | null = null;
  profil: Profil | null = null;
  videoStarted = false;

  @ViewChild('videoEl') videoEl: ElementRef<HTMLVideoElement> | undefined;

  url = environment;

  private bannerSubscription: Subscription;
  isLoading: boolean = false; // Ajout de la variable isLoading
  private profilSubscription: Subscription;



  constructor(private catService: CatService, private loadingService: LoadingService, private title: Title, private meta: Meta, private seo: SeoService) {

    this.title.setTitle('Chatterie British Kingdom - Élevage de chats British Shorthair & Longhair');
    this.meta.updateTag({ name: 'description', content: "Chatterie familiale British Kingdom, éleveur passionné de chats British Shorthair et British Longhair à Othis, Seine-et-Marne." });
    this.seo.setCanonical('https://chatterie-british-kingdom.fr/');

    this.loadingService.getBannerLoading().subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });

    this.bannerSubscription = this.catService.banner$.subscribe((banner) => {
      console.log('testing');
      this.bannerSection = banner?.[0] || null;
      if (this.bannerSection == null) {
        this.loadingService.setBannerLoading(true);
      }

      if (this.bannerSection !== null) {
        this.loadingService.setBannerLoading(false);
      }
    });


    this.profilSubscription = this.catService.profil$.subscribe((profil) => {
      this.profil = profil?.[0] || null;
    });
  }

  ngOnInit(): void {
  }



  playVideo(): void {
    this.videoStarted = true;
    const video = this.videoEl?.nativeElement;
    if (video) {
      video.play();
    }
  }

  redirect(platform: string) {
    let url: string = '';
    console.log(this.profil);
    switch (platform) {
      case 'facebook':
        if (this.profil?.facebook) {
          url = this.profil?.facebook;
        }
        break;
      case 'twitter':
        if (this.profil?.twitter) {
          url = this.profil?.twitter;
        }
        break;
      case 'instagram':
        if (this.profil?.instagram) {
          url = this.profil?.instagram;
        }
        break;

      case 'tiktok':
        if (this.profil?.tiktok) {
          url = this.profil?.tiktok;
        }
        break;

      case 'youtube':
        if (this.profil?.youtube) {
          url = this.profil?.youtube;
        }
        break;
      default:
        break;
    }
    window.open(url, '_blank');
  }

  ngOnDestroy(): void {
    this.bannerSubscription?.unsubscribe();
  }
}
