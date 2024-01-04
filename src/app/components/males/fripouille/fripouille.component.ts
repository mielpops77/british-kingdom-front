import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';
@Component({
  selector: 'app-fripouille',
  templateUrl: './fripouille.component.html',
  styleUrls: ['./fripouille.component.css']
})
export class FripouilleComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef) { }

  ngOnInit(): void {

  }

  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'image-dialog'
    });
  }

  scrollToBottom() {
    this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop = this.elementRef.nativeElement.ownerDocument.documentElement.scrollHeight;
  }


  prosper = "assets/prosper.jpg";
  prosper1 = "assets/prosper/prosper1.jpg";
  prosper2 = "assets/prosper/prosper2.jpg";
  prosper3 = "assets/prosper/prosper3.jpg";
  prosper4 = "assets/prosper/prosper4.jpg";
  prosper5 = "assets/prosper/prosper5.jpg";
  prosper6 = "assets/prosper/prosper6.jpg";



  maman = "assets/mereProsper.jpg";
  papa = "assets/pereProsper.jpg";


}
