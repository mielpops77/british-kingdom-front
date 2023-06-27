import { FemellesComponent } from './components/femelles/femelles.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { MalesComponent } from './components/males/males.component';
import { ProsperComponent } from './components/males/prosper/prosper.component';
import { FripouilleComponent } from './components/males/fripouille/fripouille.component';
import { ChatonsComponent } from './components/chatons/chatons.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'males', component: MalesComponent },
  { path: 'males/prosper', component: ProsperComponent },
  { path: 'males/fripouille', component: FripouilleComponent },
  { path: 'femelles', component: FemellesComponent },
  { path: 'chatons', component: ChatonsComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
