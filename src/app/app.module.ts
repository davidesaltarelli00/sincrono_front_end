import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NuovaAnagraficaComponent } from './components/anagrafica/nuova-anagrafica/nuova-anagrafica.component';
import { DettaglioAnagraficaComponent } from './components/anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ModificaAnagraficaComponent } from './components/anagrafica/modifica-anagrafica/modifica-anagrafica.component';

@NgModule({
  declarations: [
    AppComponent,
    NuovaAnagraficaComponent,
    DettaglioAnagraficaComponent,
    ModificaAnagraficaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
