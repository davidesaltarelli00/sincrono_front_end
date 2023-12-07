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
import { RisultatiFilterOrganicoComponent } from './components/organico/risultati-filter-organico/risultati-filter-organico.component';
import { ListaRapportiniComponent } from './components/lista-rapportini/lista-rapportini.component';
import { ModaleDettaglioRapportinoComponent } from './components/modale-dettaglio-rapportino/modale-dettaglio-rapportino.component';
import { ImmagineComponent } from './components/immagine/immagine.component';
import { RichiesteComponent } from './components/richieste/richieste.component';
import { CaricamentoDocumentiComponent } from './components/caricamento-documenti/caricamento-documenti.component';
import { NuovaAnagraficaDtoExcelComponent } from './components/anagraficaDto/nuova-anagrafica-dto-excel/nuova-anagrafica-dto-excel.component';
import { ModificaCommessaComponent } from './components/modifica-commessa/modifica-commessa.component';
import { SelectedDaysComponent } from './components/richieste/selected-days/selected-days.component';
import { InsertPermessoComponent } from './components/richieste/insert-permesso/insert-permesso.component';
import { DettaglioRichiestaComponent } from './components/richieste/dettaglio-richiesta/dettaglio-richiesta.component';
import { TutorialCompilazioneRapportinoComponent } from './tutorial-compilazione-rapportino/tutorial-compilazione-rapportino.component';
import { AggiungiCommessaComponent } from './components/aggiungi-commessa/aggiungi-commessa.component';
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
  {
    path: 'nuova-anagrafica-dto-excel/:codiceFiscale',
    component: NuovaAnagraficaDtoExcelComponent,
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
  {
    path: 'lista-rapportini',
    component: ListaRapportiniComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dettaglio-rapportino/:id/:nome/:cognome/:codiceFiscale/:mese/:anno',
    component: ModaleDettaglioRapportinoComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'risultati-filter-organico',
    component: RisultatiFilterOrganicoComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },

  //STORICO COMMESSE
  {
    path: 'storico-commesse-anagrafica/:id',
    component: StoricoCommesseComponent,
    canActivate: [AuthGuard],
  },
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
    path: 'aggiungi-commessa/:id',
    component: AggiungiCommessaComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'utente/:id',
    component: UtenteComponent,
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
