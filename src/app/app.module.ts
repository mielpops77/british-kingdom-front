import { ImageUploadDialogComponent } from './components/image-upload-dialog/image-upload-dialog.component';
import { FripouilleComponent } from './components/males/fripouille/fripouille.component';
import { ImageDialogComponent } from './components/image-dialog/image-dialog.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { ProsperComponent } from './components/males/prosper/prosper.component';
import { CarousselComponent } from './components/caroussel/caroussel.component';
import { LivreDorComponent } from './components/livre-dor/livre-dor.component';
import { PorteeComponent } from './components/chatons/portee/portee.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FemellesComponent } from './components/femelles/femelles.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { ChatonsComponent } from './components/chatons/chatons.component';
import { ContactComponent } from './components/contact/contact.component';
import { MalesComponent } from './components/males/males.component';
import { MaterialModule } from './material/material.module';
import { FooterComponent } from './footer/footer.component';
import { IpService } from '../ipService/ip-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

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
    ImageUploadDialogComponent,
    HeaderUserComponent,
    ConditionsComponent,
    LivreDorComponent,
    PorteeComponent,
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
  providers: [IpService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
