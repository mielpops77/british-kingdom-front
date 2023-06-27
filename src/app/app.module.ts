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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule

  ],
  providers: [IpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
