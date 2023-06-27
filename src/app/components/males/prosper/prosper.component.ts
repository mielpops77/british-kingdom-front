import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';

@Component({
  selector: 'app-prosper',
  templateUrl: './prosper.component.html',
  styleUrls: ['./prosper.component.css']
})
export class ProsperComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef) { }

  ngOnInit(): void {

  }

  openImageDialog(imageUrl: string): void {
    console.log('ookokokoko');
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'image-dialog'
    });
  }

  scrollToBottom() {
    this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop = this.elementRef.nativeElement.ownerDocument.documentElement.scrollHeight;
  }





 

}
