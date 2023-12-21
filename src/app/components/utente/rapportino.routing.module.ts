import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../login/RoleGuard ';
import { AuthGuard } from '../login/AuthGuard';
import { UtenteComponent } from './utente.component';
import { ListaRapportiniComponent } from '../lista-rapportini/lista-rapportini.component';

const routes: Routes = [
  {
    path: 'utente/:id',
    component: UtenteComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'lista-rapportini',
    component: ListaRapportiniComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RapportinoRoutingModule {}
