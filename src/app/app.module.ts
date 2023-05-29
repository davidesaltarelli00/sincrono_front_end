
//ANAGRAFICA
//import { ModificaAnagraficaComponent } from './components/anagrafica/modifica-anagrafica/modifica-anagrafica.component';
import { NuovaAnagraficaComponent } from './components/anagrafica/nuova-anagrafica/nuova-anagrafica.component';
import { DettaglioAnagraficaComponent } from './components/anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';

//CONTRATTO
import { NuovoContrattoComponent } from './components/contratto/nuovo-contratto/nuovo-contratto.component';
import { ModificaContrattoComponent } from './components/contratto/modifica-contratto/modifica-contratto.component';
import { DettaglioContrattoComponent } from './components/contratto/dettaglio-contratto/dettaglio-contratto.component';

//COMMESSA
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ModificaCommessaComponent } from './components/commessa/modifica-commessa/modifica-commessa.component';
import { NuovaCommessaComponent } from './components/commessa/nuova-commessa/nuova-commessa.component';
import { DettaglioCommessaComponent } from './components/commessa/dettaglio-commessa/dettaglio-commessa.component';


@NgModule({
  declarations: [
    AppComponent,
    NuovaAnagraficaComponent,
    DettaglioAnagraficaComponent,
    //ModificaAnagraficaComponent,
    DettaglioContrattoComponent,
    ModificaContrattoComponent,
    NuovoContrattoComponent,
    ModificaCommessaComponent,
    NuovaCommessaComponent,
    DettaglioCommessaComponent
  ],
  imports: [
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
