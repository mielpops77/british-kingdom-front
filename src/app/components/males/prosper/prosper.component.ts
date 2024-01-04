import { Component, OnInit, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';
import { environment } from 'src/environments/environment';
import { CatService } from '../../Services/catService';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Cat } from '../../../models/cats';


@Component({
  selector: 'app-prosper',
  templateUrl: './prosper.component.html',
  styleUrls: ['./prosper.component.css']
})
export class ProsperComponent implements OnInit, OnDestroy {

  selectedCat: Cat | null = null;
  imageUrlParentsCat: string = "";
  imageUrlCatProfil: string = "";
  imageUrlCatImg: string = "";
  screenWidth: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }


  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private catService:CatService
  ) {
    this.imageUrlParentsCat = environment.apiUrlImgParentsCat;
    this.imageUrlCatProfil = environment.apiUrlImgProfilCat;
    this.imageUrlCatImg = environment.apiUrlImgCat;

  }

  ngOnInit(): void {


    if (localStorage.getItem('selectedCat') !== null) {
      const selectedCatString = localStorage.getItem('selectedCat');
      if (selectedCatString) {
        this.selectedCat = JSON.parse(selectedCatString);
      }
    }

    else {
      /*   this.route.params.subscribe(params => {
          const id = +params['id']; 
        }); */
      const catId = this.route.snapshot.paramMap.get('id');
      if (catId) {
        this.catService.getCatById(catId).subscribe((data: any) => {
          this.selectedCat = data;
        });
      }

    }
  }

  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container'
    });
  }

  scrollToBottom() {
    this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop = this.elementRef.nativeElement.ownerDocument.documentElement.scrollHeight;
  }


  getRows(arr: string[] | undefined, chunkSize: number): string[][] {
    if (!arr) return [];
    let i, j, temparray;
    const newArray = [];
    for (i = 0, j = arr.length; i < j; i += chunkSize) {
      temparray = arr.slice(i, i + chunkSize);
      newArray.push(temparray);
    }
    return newArray;
  }


  ngOnDestroy(): void {
    localStorage.removeItem('selectedCat');
  }

}
