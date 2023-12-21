import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtenteComponent } from './utente.component';
import { ListaRapportiniComponent } from '../lista-rapportini/lista-rapportini.component';
import { RapportinoRoutingModule } from './rapportino.routing.module';
import { ModaleDettaglioRapportinoComponent } from '../modale-dettaglio-rapportino/modale-dettaglio-rapportino.component';

@NgModule({
  declarations: [
    UtenteComponent,
    ListaRapportiniComponent,
    ModaleDettaglioRapportinoComponent,
  ],
  imports: [
    CommonModule,
    RapportinoRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class OrganicoModule {}
