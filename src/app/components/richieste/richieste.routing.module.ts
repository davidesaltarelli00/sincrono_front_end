import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../login/AuthGuard';
import { RoleGuard } from '../login/RoleGuard ';
import { RichiesteComponent } from './richieste.component';
import { DettaglioRichiestaComponent } from './dettaglio-richiesta/dettaglio-richiesta.component';
import { ModificaRichiestaComponent } from './modifica-richiesta/modifica-richiesta.component';

const routes: Routes = [
  {
    path: 'richieste',
    component: RichiesteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'richieste/:id',
    component: DettaglioRichiestaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-richiesta/:id',
    component: ModificaRichiestaComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RichiesteRoutingModule {}
