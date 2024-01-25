import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../login/AuthGuard';
import { RoleGuard } from '../login/RoleGuard ';
import { GestioneRuoliComponent } from './gestione-ruoli/gestione-ruoli.component';
import { CreateNodeDialogComponent } from './create-node-dialog/create-node-dialog.component';

const routes: Routes = [
  {
    path: 'gestione-ruoli',
    component: GestioneRuoliComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'insert-ruolo',
    component: CreateNodeDialogComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmministrazioneRoutingModule {}
