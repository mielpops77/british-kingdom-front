import { FemellesComponent } from './components/femelles/femelles.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { MalesComponent } from './components/males/males.component';
import { ProsperComponent } from './components/males/prosper/prosper.component';
import { FripouilleComponent } from './components/males/fripouille/fripouille.component';
import { ChatonsComponent } from './components/chatons/chatons.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminComponent } from './components/admin/admin.component';
import { AccueilEditComponent } from './components/admin/accueilEdit/accueilEdit.component';
import { MesChatsComponent } from './components/admin/mes-chats/mes-chats.component';
import { NouveauChatComponent } from './components/admin/mes-chats/nouveau-chat/nouveau-chat.component';
import { EditionChatComponent } from './components/admin/mes-chats/edition-chat/edition-chat.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { LivreDorComponent } from './components/livre-dor/livre-dor.component';




import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'males', component: MalesComponent },
  { path: 'males/:id', component: ProsperComponent },
  { path: 'males/fripouille', component: FripouilleComponent },
  { path: 'femelles', component: FemellesComponent },
  { path: 'chatons', component: ChatonsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'conditions', component: ConditionsComponent },
  { path: 'livre-dor', component: LivreDorComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/accueil-edit', component: AccueilEditComponent },
  { path: 'admin/meschats', component: MesChatsComponent },
  { path: 'admin/meschats/nouveauChat', component: NouveauChatComponent },
  { path: 'admin/meschats/edition/:id', component: EditionChatComponent },
  



  





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
