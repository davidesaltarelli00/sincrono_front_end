import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaAnagraficaDtoComponent } from './lista-anagrafica-dto/lista-anagrafica-dto.component';
import { DettaglioAnagraficaDtoComponent } from './dettaglio-anagrafica-dto/dettaglio-anagrafica-dto.component';
import { NuovaAnagraficaDtoComponent } from './nuova-anagrafica-dto/nuova-anagrafica-dto.component';
import { ModificaAnagraficaDtoComponent } from './modifica-anagrafica-dto/modifica-anagrafica-dto.component';
import { AnagraficaDtoRoutingModule } from './AnagraficaDto.routing.module';
import { MaterialModule } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuovaAnagraficaDtoExcelComponent } from './nuova-anagrafica-dto-excel/nuova-anagrafica-dto-excel.component';
import { StoricoContrattiComponent } from '../storici/storico-contratti/storico-contratti.component';
import { StoricoCommesseComponent } from '../storici/storico-commesse/storico-commesse.component';

@NgModule({
  declarations: [
    ListaAnagraficaDtoComponent,
    DettaglioAnagraficaDtoComponent,
    NuovaAnagraficaDtoComponent,
    ModificaAnagraficaDtoComponent,
    NuovaAnagraficaDtoExcelComponent,
    StoricoContrattiComponent,
    StoricoCommesseComponent
  ],
  imports: [
    CommonModule,
    AnagraficaDtoRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class AnagraficaDtoModule {}
