import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { PagesModule } from './pages/pages.module';
import { LocalStorageService } from './services/localStorage.service';
import { CallbackPipe } from './helpers/callback.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    PagesModule,
    JwBootstrapSwitchNg2Module,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [LocalStorageService],
  bootstrap: [AppComponent],
})
export class AppModule { }
