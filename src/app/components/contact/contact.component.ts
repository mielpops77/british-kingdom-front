// contact.component.ts
import { ContactService } from '../Services/contact.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
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

  constructor(private contactService: ContactService, private snackBar: MatSnackBar, private datePipe: DatePipe) { }

  ngOnInit(): void {
  }


  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000, // Durée d'affichage en millisecondes (ici 3 secondes)
      verticalPosition: 'top', // Position verticale (top, bottom)
      horizontalPosition: 'center', // Position horizontale (start, center, end, left, right)
    });
  }


  // Utilisez NgForm pour accéder aux valeurs du formulaire
  sendContactForm(form: NgForm): void {

    // Vérifiez si le formulaire est valide avant de soumettre
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
          formattedHour !== null ?  this.contactModel.hour = formattedHour :   this.contactModel.hour = '00:00';
          // Appelez la fonction du service pour créer un contact
          this.contactService.createContact(this.contactModel).subscribe(
            (response) => {
              console.log('Contact créé avec succès', response);
              // Réinitialisez le modèle du formulaire après l'envoi réussi
              // this.contactModel = {};
              // Réinitialisez le formulaire après l'envoi réussi
              this.showSnackBar("Votre message à bien été envoyé");

              form.resetForm();
              // Réinitialisez l'état de validation de l'e-mail et du numéro de téléphone
              this.isEmailInvalid = false;
              this.isNumInvalid = false;
              // Ajoutez ici une logique pour afficher un message de succès à l'utilisateur si nécessaire
            },
            (error) => {
              console.error('Erreur lors de la création du contact', error);
              // Ajoutez ici une logique pour afficher un message d'erreur à l'utilisateur si nécessaire
            }
          );
        } else {
          // Définissez l'état de validation du numéro de téléphone sur true pour afficher le message d'erreur
          this.isNumInvalid = true;
        }
      } else {
        // Définissez l'état de validation de l'e-mail sur true pour afficher le message d'erreur
        this.isEmailInvalid = true;
      }
    }
  }

  // Fonction pour vérifier le format du numéro de téléphone à l'aide d'une expression régulière
  isNumValid(num: string): boolean {
    // Utilisez une expression régulière appropriée pour valider le format du numéro de téléphone
    // Cette expression régulière ne valide qu'un exemple simple ; vous pouvez l'ajuster en fonction de vos besoins
    const numRegex = /^\d{10}$/;
    return numRegex.test(num);
  }

  // Fonction pour vérifier le format de l'e-mail à l'aide d'une expression régulière
  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
