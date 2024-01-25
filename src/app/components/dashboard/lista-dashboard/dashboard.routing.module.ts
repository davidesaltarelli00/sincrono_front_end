import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../login/AuthGuard';
import { RoleGuard } from '../../login/RoleGuard ';
import { ListaDashboardComponent } from './lista-dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: ListaDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
