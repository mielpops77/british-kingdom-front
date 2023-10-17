
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Cat } from '../../models/cats';
import { Subscription } from 'rxjs';
import { CatService } from '../Services/catService';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-males',
  templateUrl: './males.component.html',
  styleUrls: ['./males.component.css']
})
export class MalesComponent implements OnInit {

  cats: Cat[] = [];  // Initialisez un tableau vide
  catSubscription: Subscription | undefined;
  url = environment;

  constructor(private router: Router, private http: HttpClient, private catService: CatService) { }

  ngOnInit(): void {
    this.catSubscription = this.catService.cat$.subscribe(cats => {
      if (cats)
        this.cats = cats.filter((cat: Cat) => cat.sex === "male")
    });
  }
  redirectToNewUrl(id: number, cat: Cat): void {
    console.log('name', name);
    localStorage.setItem('selectedCat', JSON.stringify(cat));
    this.router.navigateByUrl('/males/' + id);
  }
}
