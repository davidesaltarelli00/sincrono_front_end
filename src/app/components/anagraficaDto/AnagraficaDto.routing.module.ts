import { RouterModule, Routes } from '@angular/router';
import { DettaglioAnagraficaDtoComponent } from './dettaglio-anagrafica-dto/dettaglio-anagrafica-dto.component';
import { ListaAnagraficaDtoComponent } from './lista-anagrafica-dto/lista-anagrafica-dto.component';
import { NuovaAnagraficaDtoComponent } from './nuova-anagrafica-dto/nuova-anagrafica-dto.component';
import { ModificaAnagraficaDtoComponent } from './modifica-anagrafica-dto/modifica-anagrafica-dto.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../login/AuthGuard';
import { RoleGuard } from '../login/RoleGuard ';
import { NuovaAnagraficaDtoExcelComponent } from './nuova-anagrafica-dto-excel/nuova-anagrafica-dto-excel.component';
import { StoricoContrattiComponent } from '../storici/storico-contratti/storico-contratti.component';
import { StoricoCommesseComponent } from '../storici/storico-commesse/storico-commesse.component';

const routes: Routes = [
  {
    path: 'lista-anagrafica',
    component: ListaAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'dettaglio-anagrafica/:id',
    component: DettaglioAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'nuova-anagrafica',
    component: NuovaAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'modifica-anagrafica/:id',
    component: ModificaAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },

  {
    path: 'nuova-anagrafica-dto-excel/:codiceFiscale',
    component: NuovaAnagraficaDtoExcelComponent,
    canActivate: [AuthGuard, RoleGuard],
  },

  {
    path: 'storico-contratti/:id',
    component: StoricoContrattiComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'storico-commesse-anagrafica/:id',
    component: StoricoCommesseComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnagraficaDtoRoutingModule {}
