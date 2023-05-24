//ANAGRAFICA
//import { ModificaAnagraficaComponent } from './components/anagrafica/modifica-anagrafica/modifica-anagrafica.component';
import { NuovaAnagraficaComponent } from './components/anagrafica/nuova-anagrafica/nuova-anagrafica.component';
import { DettaglioAnagraficaComponent } from './components/anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';

//CONTRATTO
import { NuovoContrattoComponent } from './components/contratto/nuovo-contratto/nuovo-contratto.component';
import { ModificaContrattoComponent } from './components/contratto/modifica-contratto/modifica-contratto.component';
import { DettaglioContrattoComponent } from './components/contratto/dettaglio-contratto/dettaglio-contratto.component';

//COMMESSA

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NuovaAnagraficaComponent,
    DettaglioAnagraficaComponent,
    //ModificaAnagraficaComponent,
    DettaglioContrattoComponent,
    ModificaContrattoComponent,
    NuovoContrattoComponent
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
