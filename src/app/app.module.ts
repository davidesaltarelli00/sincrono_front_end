import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

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

@NgModule({
  declarations: [
    AppComponent,
    DettaglioContrattoComponent,
    ModificaContrattoComponent,
    NuovoContrattoComponent,
    ListaContrattiComponent,
    ListaDashboardComponent,
    ListaOrganicoComponent,
    HomeComponent,
    ListaAnagraficaDtoComponent,
    DettaglioAnagraficaDtoComponent,
    ModificaAnagraficaDtoComponent,
    NuovaAnagraficaDtoComponent,
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
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
