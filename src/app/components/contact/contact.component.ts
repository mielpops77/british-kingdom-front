// contact.component.ts
import { SnackBarService } from '../Services/snack-bar.service';
import { ContactService } from '../Services/contact.service';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Contact } from 'src/app/models/contact';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../Services/seo.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink]
})
export class ContactComponent {

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

  constructor(
    private contactService: ContactService,
    private datePipe: DatePipe,
    private snackBarService: SnackBarService,
    private title: Title,
    private meta: Meta,
    private seo: SeoService

  ) {
    this.title.setTitle('Contact | Chatterie British Kingdom');
    this.meta.updateTag({ name: 'description', content: "Contactez la chatterie British Kingdom à Othis, Seine-et-Marne, pour toute question sur nos chatons British Shorthair et Longhair." });
    this.seo.setCanonical('https://chatterie-british-kingdom.fr/contact');
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

}
