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

const routes: Routes = [
  //HOME
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },

  //ANAGRAFICA
  { path: 'lista-anagrafica', component: ListaAnagraficaDtoComponent },
  { path: 'lista-anagrafica/:body', component: ListaAnagraficaDtoComponent },
  { path: 'dettaglio-anagrafica/:id', component: DettaglioAnagraficaDtoComponent },
  { path: 'nuova-anagrafica', component: NuovaAnagraficaDtoComponent },
  { path: 'modifica-anagrafica', component: ModificaAnagraficaDtoComponent },

  //CONTRATTO
  { path: 'dettaglio-contratto/:id', component: DettaglioContrattoComponent },
  { path: 'modifica-contratto/:id', component: ModificaContrattoComponent },
  { path: 'nuovo-contratto', component: NuovoContrattoComponent },
  { path: 'lista-contratti', component: ListaContrattiComponent },

  //DASHBOARD
  { path: 'dashboard', component: ListaDashboardComponent },

  //ORGANICO
  { path: 'organico', component: ListaOrganicoComponent },

  //LOGIN
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
