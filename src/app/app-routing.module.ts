import { ConditionsComponent } from './components/conditions/conditions.component';
import { ProsperComponent } from './components/males/prosper/prosper.component';
import { PorteeComponent } from './components/chatons/portee/portee.component';
import { LivreDorComponent } from './components/livre-dor/livre-dor.component';
import { FemellesComponent } from './components/femelles/femelles.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { ChatonsComponent } from './components/chatons/chatons.component';
import { ContactComponent } from './components/contact/contact.component';
import { MalesComponent } from './components/males/males.component';


import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MentionsLegalesComponent } from './components/mentions-légales/mentions-legales/mentions-legales.component';
import { PolitiqueConfidentialiteComponent } from './components/mentions-légales/politique-confidentialite/politique-confidentialite.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'males', component: MalesComponent },
  { path: 'males/:id', component: ProsperComponent },
  { path: 'femelles/:id', component: ProsperComponent },
  { path: 'femelles', component: FemellesComponent },
  { path: 'chatons', component: ChatonsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'conditions', component: ConditionsComponent },
  { path: 'livre-dor', component: LivreDorComponent },
  { path: 'portee/:id', component: PorteeComponent },
  { path: 'mentions-legales', component: MentionsLegalesComponent },
  { path: 'politique-confidentialite', component: PolitiqueConfidentialiteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
