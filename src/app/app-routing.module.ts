import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DettaglioContrattoComponent } from './components/contratto/dettaglio-contratto/dettaglio-contratto.component';
import { NuovoContrattoComponent } from './components/contratto/nuovo-contratto/nuovo-contratto.component';
import { ModificaContrattoComponent } from './components/contratto/modifica-contratto/modifica-contratto.component';
import { ListaDashboardComponent } from './components/dashboard/lista-dashboard/lista-dashboard.component';
import { ListaContrattiComponent } from './components/contratto/lista-contratti/lista-contratti.component';
import { ListaOrganicoComponent } from './components/organico/lista-organico/lista-organico.component';
import { ListaAnagraficaDtoComponent } from './components/anagraficaDto/lista-anagrafica-dto/lista-anagrafica-dto.component';
import { DettaglioAnagraficaDtoComponent } from './components/anagraficaDto/dettaglio-anagrafica-dto/dettaglio-anagrafica-dto.component';
import { NuovaAnagraficaDtoComponent } from './components/anagraficaDto/nuova-anagrafica-dto/nuova-anagrafica-dto.component';
import { ModificaAnagraficaDtoComponent } from './components/anagraficaDto/modifica-anagrafica-dto/modifica-anagrafica-dto.component';
import { LoginComponent } from './components/login/login/login.component';
import { StoricoContrattiComponent } from './components/storici/storico-contratti/storico-contratti.component';
import { StoricoCommesseComponent } from './components/storici/storico-commesse/storico-commesse.component';
import { AuthGuard } from './components/login/AuthGuard';
import { RoleGuard } from './components/login/RoleGuard ';
const routes: Routes = [
  //HOME
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard, RoleGuard],
  },

  //ANAGRAFICA
  {
    path: 'lista-anagrafica',
    component: ListaAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'lista-anagrafica/:body',
    component: ListaAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'dettaglio-anagrafica/:id',
    component: DettaglioAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'dettaglio-anagrafica',
    component: DettaglioAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'nuova-anagrafica',
    component: NuovaAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 'expectedRoles': ['admin', 'risorseumane'] }
  },
  {
    path: 'modifica-anagrafica/:id',
    component: ModificaAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },

  //CONTRATTO
  {
    path: 'dettaglio-contratto/:id',
    component: DettaglioContrattoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'modifica-contratto/:id',
    component: ModificaContrattoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'nuovo-contratto',
    component: NuovoContrattoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'lista-contratti',
    component: ListaContrattiComponent,
    canActivate: [AuthGuard, RoleGuard],
  },

  //DASHBOARD
  {
    path: 'dashboard',
    component: ListaDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 'expectedRoles': ['admin'] }
  },

  //ORGANICO
  {
    path: 'organico',
    component: ListaOrganicoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },

  //LOGIN
  { path: 'login', component: LoginComponent },

  //STORICO CONTRATTI

  {
    path: 'storico-contratti/:id',
    component: StoricoContrattiComponent,
    canActivate: [AuthGuard],
  },

  //STORICO COMMESSE
  {
    path: 'storico-commesse-anagrafica/:id',
    component: StoricoCommesseComponent,
    canActivate: [AuthGuard],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
