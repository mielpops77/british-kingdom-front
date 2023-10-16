import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import Cropper from 'cropperjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // Import MAT_DIALOG_DATA
import { MatDialogRef } from '@angular/material/dialog'; // Importez MatDialogRef

@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.css']
})
export class ImageUploadDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('image', { static: false }) imageElement!: ElementRef;
  croppedImage: string | null = null;

  private cropper!: Cropper;

  constructor(private dialogRef: MatDialogRef<ImageUploadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string, name: string, type: string, aspectRatioWidth: number, aspectRatioHeight: number }) { } // Inject MAT_DIALOG_DATA
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initCropper();
  }
  private initCropper(): void {

    const hiddenImage = new Image();

    hiddenImage.onload = () => {
      const image = this.imageElement.nativeElement;
      image.src = hiddenImage.src;

      this.cropper = new Cropper(image, {
        aspectRatio: this.data.aspectRatioWidth / this.data.aspectRatioHeight,
        crop: this.cropEvent.bind(this),
        zoomable: true,
        zoomOnWheel: false,
        autoCropArea: 1.0,
        viewMode: 1,
        dragMode: 'move'
      });
    };

    hiddenImage.src = this.data.imageUrl;
  }

  /* 
    cropEvent(event: Cropper.CropEvent): void {
      const croppedImageData = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
    } */

  cropEvent(event: Cropper.CropEvent): void {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    this.croppedImage = croppedCanvas.toDataURL('image/jpeg');
  }


  ngOnDestroy(): void {
    if (this.cropper) {
      this.cropper.destroy();
    }

  }
  closeDialog(): void {
    this.dialogRef.close(this.croppedImage || this.data.imageUrl);

  }

  applyChanges(): void {
    if (this.croppedImage) {
      this.createFile().then(result => {
        if (result) {
          const croppedImageInfo = {
            url: result.url,
            file: result.file
          };
          this.dialogRef.close(croppedImageInfo);
        }
      });
    }
  }
  


  createFile(): Promise<{ url: string, file: File } | undefined> {
    if (this.croppedImage !== null) {
      const canvas = document.createElement('canvas');
      canvas.width = this.data.aspectRatioWidth;
      canvas.height = this.data.aspectRatioHeight;
  
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        const img = new Image();
        img.src = this.croppedImage;
  
        return new Promise<{ url: string, file: File }>((resolve, reject) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0, this.data.aspectRatioWidth, this.data.aspectRatioHeight);
            canvas.toBlob(blob => {
              if (blob) {
                const file = new File([blob], this.data.name, {
                  lastModified: new Date().getTime(),
                  type: this.data.type,
                });
                resolve({ url: canvas.toDataURL('image/jpeg'), file });
              } else {
                reject("Blob is null.");
              }
            }, 'image/jpeg', 1);
          };
        });
      }
    }
    return Promise.resolve(undefined);
  }
  





}
