import { Component, OnInit, AfterViewInit  } from '@angular/core';
// import 'slick-carousel/slick/slick';

declare var $: any;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit,AfterViewInit  {

  constructor() { }

  ngOnInit(): void {
    console.log('hello amiel');
  }
  currentSlide = 0;

  ngAfterViewInit() {
    $('.carousel').slick();
    
  }

  prevSlide() {
    if (this.currentSlide === 0) {
      this.currentSlide = 2;
    } else {
      this.currentSlide--;
    }
  }
  
  nextSlide() {
    if (this.currentSlide === 2) {
      this.currentSlide = 0;
    } else {
      this.currentSlide++;
    }
  }
  
  goToSlide(slideIndex: number) {
    this.currentSlide = slideIndex;
  }
}
