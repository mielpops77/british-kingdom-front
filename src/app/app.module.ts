import { AccueilComponent } from './components/accueil/accueil.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material/material.module';
import { MalesComponent } from './components/males/males.component';
import { FooterComponent } from './footer/footer.component';
import { FemellesComponent } from './components/femelles/femelles.component';
import { IpService } from '../ipService/ip-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ProsperComponent } from './components/males/prosper/prosper.component';
import { FripouilleComponent } from './components/males/fripouille/fripouille.component';
import { ImageDialogComponent } from './components/image-dialog/image-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatonsComponent } from './components/chatons/chatons.component';
import { ContactComponent } from './components/contact/contact.component';
import { CarousselComponent } from './components/caroussel/caroussel.component';
import { AdminComponent } from './components/admin/admin.component';
import { AccueilEditComponent } from './components/admin/accueilEdit/accueilEdit.component';
import { ImageUploadDialogComponent } from './components/image-upload-dialog/image-upload-dialog.component';
import { HeaderEditComponent } from './components/admin/header-edit/header-edit.component';
import { FormsModule } from '@angular/forms';
import { CardEditComponent } from './components/admin/card-edit/card-edit.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { MesChatsComponent } from './components/admin/mes-chats/mes-chats.component';
import { NouveauChatComponent } from './components/admin/mes-chats/nouveau-chat/nouveau-chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditionChatComponent } from './components/admin/mes-chats/edition-chat/edition-chat.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { LivreDorComponent } from './components/livre-dor/livre-dor.component';
@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    MalesComponent,
    FooterComponent,
    FemellesComponent,
    ProsperComponent,
    FripouilleComponent,
    ImageDialogComponent,
    ChatonsComponent,
    ContactComponent,
    CarousselComponent,
    AdminComponent,
    AccueilEditComponent,
    ImageUploadDialogComponent,
    HeaderEditComponent,
    CardEditComponent,
    HeaderUserComponent,
    HeaderAdminComponent,
    MesChatsComponent,
    NouveauChatComponent,
    EditionChatComponent,
    ConditionsComponent,
    LivreDorComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  providers: [IpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
