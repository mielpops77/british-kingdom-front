// contact.component.ts
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarService } from '../Services/snack-bar.service';
import { MatButtonModule } from '@angular/material/button';
import { ContactService } from '../Services/contact.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CatService } from '../Services/catService';
import { Contact } from 'src/app/models/contact';
import { DatePipe, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, MatButtonModule]
})
export class ContactComponent implements OnInit, OnDestroy {

  private bannerSubscription: Subscription | undefined;

  // Initialisez le modèle avec des valeurs par défaut si nécessaire
  contactModel: Contact = {
    id: 0,
    profilId: environment.id,
    name: '',
    email: '',
    num: '',
    subject: '',
    message: '',
    vue: false,
    dateofCrea: '',
    hour: ''
  };

  // Variable pour suivre l'état de validation de l'e-mail
  isEmailInvalid = false;
  isNumInvalid = false;
  banner: any = [];
  googleMapsUrl: SafeResourceUrl | undefined;
  address: string = '12 Bis Rue des Suisses, 77280 Othis';  // Adresse plus détaillée

  constructor(
    private contactService: ContactService,
    private datePipe: DatePipe,
    private catService: CatService,
    private sanitizer: DomSanitizer,
    private snackBarService: SnackBarService

  ) { }

  ngOnInit(): void {
    this.bannerSubscription = this.catService.banner$.subscribe(banner => {
      if (banner) {
        this.banner = banner[0];
      }
    });


    const dynamicUrl = `https://www.google.com/maps/embed?q=${encodeURIComponent(this.address)}`;
    this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dynamicUrl);

  }





  sendContactForm(form: NgForm): void {
    if (form.valid) {
      if (this.isNumValid(this.contactModel.num)) {
        this.isNumInvalid = false;
      }
      else {
        this.isNumInvalid = true;
      }
      // Vérifiez si l'e-mail est valide
      if (this.isEmailValid(this.contactModel.email)) {
        this.isEmailInvalid = false;
        // Vérifiez si le numéro de téléphone est valide
        if (this.isNumValid(this.contactModel.num)) {

          this.contactModel.dateofCrea = new Date().toISOString();
          const currentDate = new Date();
          const formattedHour = this.datePipe.transform(currentDate, 'HH:mm');
          formattedHour !== null ? this.contactModel.hour = formattedHour : this.contactModel.hour = '00:00';
          this.contactService.createContact(this.contactModel).subscribe(
            (response) => {
              console.log('Contact créé avec succès', response);
              this.snackBarService.showSnackBar("Votre message à bien été envoyé");

              form.resetForm();
              this.isEmailInvalid = false;
              this.isNumInvalid = false;
            },
            (error) => {
              console.error('Erreur lors de la création du contact', error);
            }
          );
        } else {
          this.isNumInvalid = true;
        }
      } else {
        this.isEmailInvalid = true;
      }
    }
  }

  isNumValid(num: string): boolean {
    const numRegex = /^\d{10}$/;
    return numRegex.test(num);
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  ngOnDestroy(): void {
    this.bannerSubscription?.unsubscribe();
  }

}
