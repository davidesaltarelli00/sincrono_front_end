import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DettaglioContrattoComponent } from './components/contratto/dettaglio-contratto/dettaglio-contratto.component';
import { NuovoContrattoComponent } from './components/contratto/nuovo-contratto/nuovo-contratto.component';
import { ModificaContrattoComponent } from './components/contratto/modifica-contratto/modifica-contratto.component';
import { ListaDashboardComponent } from './components/dashboard/lista-dashboard/lista-dashboard.component';
import { ListaContrattiComponent } from './components/contratto/lista-contratti/lista-contratti.component';
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
import { GiornoComponent } from './components/giorno/giorno.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ImmagineComponent } from './components/immagine/immagine.component';
import { CaricamentoDocumentiComponent } from './components/caricamento-documenti/caricamento-documenti.component';
import { ModificaCommessaComponent } from './components/modifica-commessa/modifica-commessa.component';
import { SelectedDaysComponent } from './components/richieste/selected-days/selected-days.component';
import { InsertPermessoComponent } from './components/richieste/insert-permesso/insert-permesso.component';
import { TutorialCompilazioneRapportinoComponent } from './tutorial-compilazione-rapportino/tutorial-compilazione-rapportino.component';
import { AggiungiCommessaComponent } from './components/aggiungi-commessa/aggiungi-commessa.component';
import { ModalInfoCommesseComponent } from './components/modal-info-commesse/modal-info-commesse.component';
import { ModalInfoContrattoComponent } from './components/modal-info-contratto/modal-info-contratto.component';

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
  {
    path: '',
    loadChildren: () =>
      import('./components/anagraficaDto/anagraficaDto.module').then(
        (m) => m.AnagraficaDtoModule
      ),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/organico/organico.module').then(
        (m) => m.OrganicoModule
      ),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./components/utente/rapportino.module').then(
        (m) => m.RapportinoModule
      ),
    canActivate: [AuthGuard, RoleGuard],
  },

  {
    path: '',
    loadChildren: () =>
      import('./components/richieste/richieste.module').then(
        (m) => m.RichiesteModule
      ),
    canActivate: [AuthGuard, RoleGuard],
  },

  {
    path: 'selected-days',
    component: SelectedDaysComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'insert-permesso',
    component: InsertPermessoComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'modifica-commessa/:id',
    component: ModificaCommessaComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'documenti',
    component: CaricamentoDocumentiComponent,
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
    path: 'tutorial-compilazione-rapportino',
    component: TutorialCompilazioneRapportinoComponent,
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
  {
    path: 'immagine',
    component: ImmagineComponent,
    canActivate: [AuthGuard, RoleGuard],
  },

  { path: 'login', component: LoginComponent },



  {
    path: 'info-commesse/:id',
    component: ModalInfoCommesseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'info-contratto/:id',
    component: ModalInfoContrattoComponent,
    canActivate: [AuthGuard],
  },

  //STORICO COMMESSE


  {
    path: 'aggiungi-commessa/:id',
    component: AggiungiCommessaComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'giorno/:date',
    component: GiornoComponent,
    canActivate: [AuthGuard],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
