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
import { ProfileBoxComponent } from './components/profile-box/profile-box.component';
import { CambioPasswordComponent } from './components/cambio-password/cambio-password.component';
import { RecuperoPasswordComponent } from './components/recupero-password/recupero-password.component';
import { FormRecuperoPasswordComponent } from './components/form-recupero-password/form-recupero-password.component';
import { AlertLogoutComponent } from './components/alert-logout/alert-logout.component';
import { UtenteComponent } from './components/utente/utente.component';
import { GiornoComponent } from './components/giorno/giorno.component';
import { NotFoundComponent } from './not-found/not-found.component';
const routes: Routes = [
  //HOME
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'form-recupero-password/:tokenProvvisorio',
    component: FormRecuperoPasswordComponent,
    canActivate: [],
  },

  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'logout',
    component: AlertLogoutComponent,
    canActivate: [AuthGuard, RoleGuard],
  },

  //ANAGRAFICA
  {
    path: 'lista-anagrafica',
    component: ListaAnagraficaDtoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'anagraficaDto',
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
    // data: { 'expectedRoles': ['admin', 'risorseumane'] }
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
  {
    path: 'profile-box',
    component: ProfileBoxComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'cambia-password',
    component: CambioPasswordComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'recupera-password',
    component: RecuperoPasswordComponent,
  },

  //DASHBOARD
  {
    path: 'dashboard',
    component: ListaDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
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

  //CALENDARIO
  {
    path: 'utente/:codiceFiscale',
    component: UtenteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'giorno/:date',
    component: GiornoComponent,
    canActivate: [AuthGuard],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
