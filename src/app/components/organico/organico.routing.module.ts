import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaOrganicoComponent } from './lista-organico/lista-organico.component';
import { RoleGuard } from '../login/RoleGuard ';
import { AuthGuard } from '../login/AuthGuard';
import { RisultatiFilterOrganicoComponent } from './risultati-filter-organico/risultati-filter-organico.component';
import { ModaleDettaglioRapportinoComponent } from '../modale-dettaglio-rapportino/modale-dettaglio-rapportino.component';

const routes: Routes = [
  {
    path: 'organico',
    component: ListaOrganicoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'risultati-filter-organico',
    component: RisultatiFilterOrganicoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dettaglio-rapportino/:id/:nome/:cognome/:codiceFiscale/:mese/:anno',
    component: ModaleDettaglioRapportinoComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganicoRoutingModule {}
