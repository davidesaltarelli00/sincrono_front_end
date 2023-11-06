import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { saveAs } from 'file-saver';
//ANAGRAFICA
import { ListaAnagraficaDtoComponent } from './components/anagraficaDto/lista-anagrafica-dto/lista-anagrafica-dto.component';
import { DettaglioAnagraficaDtoComponent } from './components/anagraficaDto/dettaglio-anagrafica-dto/dettaglio-anagrafica-dto.component';
import { NuovaAnagraficaDtoComponent } from './components/anagraficaDto/nuova-anagrafica-dto/nuova-anagrafica-dto.component';
import { ModificaAnagraficaDtoComponent } from './components/anagraficaDto/modifica-anagrafica-dto/modifica-anagrafica-dto.component';

//CONTRATTO
import { ListaContrattiComponent } from './components/contratto/lista-contratti/lista-contratti.component';
import { DettaglioContrattoComponent } from './components/contratto/dettaglio-contratto/dettaglio-contratto.component';
import { NuovoContrattoComponent } from './components/contratto/nuovo-contratto/nuovo-contratto.component';
import { ModificaContrattoComponent } from './components/contratto/modifica-contratto/modifica-contratto.component';

//DASHBOARD
import { ListaDashboardComponent } from './components/dashboard/lista-dashboard/lista-dashboard.component';

//DASHBOARD
import { ListaOrganicoComponent } from './components/organico/lista-organico/lista-organico.component';

//HOME
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login/login.component';
import { StoricoContrattiComponent } from './components/storici/storico-contratti/storico-contratti.component';
import { StoricoCommesseComponent } from './components/storici/storico-commesse/storico-commesse.component';

import { MaterialModule } from './material.module';
import { ProfileBoxComponent } from './components/profile-box/profile-box.component';
import { CambioPasswordComponent } from './components/cambio-password/cambio-password.component';
import { RecuperoPasswordComponent } from './components/recupero-password/recupero-password.component';
import { FormRecuperoPasswordComponent } from './components/form-recupero-password/form-recupero-password.component';
import { AlertLogoutComponent } from './components/alert-logout/alert-logout.component';
import { UtenteComponent } from './components/utente/utente.component';
import { GiornoComponent } from './components/giorno/giorno.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HighlightNullFieldDirective } from './directive/HighlightNullFieldDirective';
import { NotFoundComponent } from './not-found/not-found.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ModalInfoCommesseComponent } from './components/modal-info-commesse/modal-info-commesse.component';
import { ModalInfoContrattoComponent } from './components/modal-info-contratto/modal-info-contratto.component';
import { MatSelectModule } from '@angular/material/select';
import { RisultatiFilterOrganicoComponent } from './components/organico/risultati-filter-organico/risultati-filter-organico.component';
import { ListaRapportiniComponent } from './components/lista-rapportini/lista-rapportini.component';
import { ModaleDettaglioRapportinoComponent } from './components/modale-dettaglio-rapportino/modale-dettaglio-rapportino.component';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { ImmagineComponent } from './components/immagine/immagine.component';
import { BottoniComponent } from './bottoni/bottoni.component';
import { MailSollecitaComponent } from './components/mail-sollecita/mail-sollecita.component';
@NgModule({
  declarations: [
    AppComponent,
    DettaglioContrattoComponent,
    ModificaContrattoComponent,
    NuovoContrattoComponent,
    ListaContrattiComponent,
    ListaDashboardComponent,
    HighlightNullFieldDirective,
    ListaOrganicoComponent,
    HomeComponent,
    ModalInfoCommesseComponent,
    ListaAnagraficaDtoComponent,
    DettaglioAnagraficaDtoComponent,
    ModificaAnagraficaDtoComponent,
    NuovaAnagraficaDtoComponent,
    LoginComponent,
    StoricoContrattiComponent,
    StoricoCommesseComponent,
    ProfileBoxComponent,
    CambioPasswordComponent,
    RecuperoPasswordComponent,
    FormRecuperoPasswordComponent,
    AlertLogoutComponent,
    UtenteComponent,
    GiornoComponent,
    NotFoundComponent,
    AlertDialogComponent,
    ModalInfoContrattoComponent,
    RisultatiFilterOrganicoComponent,
    ListaRapportiniComponent,
    ModaleDettaglioRapportinoComponent,
    HeaderComponent,
    ImmagineComponent,
    BottoniComponent,
    MailSollecitaComponent
  ],
  imports: [
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    MatSelectModule,

  ],
  providers: [DatePipe, CurrencyPipe],
  //  { provide: LOCALE_ID, useValue: 'it-IT' }
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    window['saveAs'] = saveAs; // Dichiarazione globale di saveAs
  }
}
