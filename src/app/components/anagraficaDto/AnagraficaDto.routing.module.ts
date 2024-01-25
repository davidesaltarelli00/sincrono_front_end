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
import { CaricamentoDocumentiComponent } from '../caricamento-documenti/caricamento-documenti.component';

const routes: Routes = [
  {
    path: 'lista-anagrafica',
    component: ListaAnagraficaDtoComponent,
    data: {
      breadcrumb: [
        {
          label: 'Lista anagrafica',
          url: '/lista-anagrafica',
          active: true,
          class: 'breadcrumb-item active',
        },
      ],
    },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'dettaglio-anagrafica/:id',
    component: DettaglioAnagraficaDtoComponent,
    data: {
      breadcrumb: [
        {
          label: 'Dettaglio anagrafica',
          url: '/dettaglio-anagrafica/:id',
          active: true,
          class: 'breadcrumb-item active',
        },
      ],
    },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'nuova-anagrafica',
    component: NuovaAnagraficaDtoComponent,
    data: {
      breadcrumb: [
        {
          label: 'Nuova anagrafica',
          url: '/nuova-anagrafica',
          active: true,
          class: 'breadcrumb-item active',
        },
      ],
    },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'modifica-anagrafica/:id',
    component: ModificaAnagraficaDtoComponent,
    data: {
      breadcrumb: [
        {
          label: 'Modifica anagrafica',
          url: '/modifica-anagrafica/:id',
          active: true,
          class: 'breadcrumb-item active',
        },
      ],
    },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'nuova-anagrafica-dto-excel/:codiceFiscale',
    component: NuovaAnagraficaDtoExcelComponent,
    data: {
      breadcrumb: [
        {
          label: 'Nuova anagrafica da excel',
          url: '/nuova-anagrafica-dto-excel/:codiceFiscale',
          active: true,
          class: 'breadcrumb-item active',
        },
      ],
    },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'storico-contratti/:id',
    component: StoricoContrattiComponent,
    data: {
      breadcrumb: [
        {
          label: 'Storico contratti',
          url: '/storico-contratti/:id',
          active: true,
          class: 'breadcrumb-item active',
        },
      ],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'storico-commesse-anagrafica/:id',
    component: StoricoCommesseComponent,
    data: {
      breadcrumb: [
        {
          label: 'Storico commesse',
          url: '/storico-commesse-anagrafica/:id',
          active: true,
          class: 'breadcrumb-item active',
        },
      ],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'documenti',
    component: CaricamentoDocumentiComponent,
    data: {
      breadcrumb: [
        {
          label: 'Caricamento documenti',
          url: '/documenti',
          active: true,
          class: 'breadcrumb-item active',
        },
      ],
    },
    canActivate: [AuthGuard, RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnagraficaDtoRoutingModule {}
