import { HomeComponent } from './components/home/home.component';
import { ModificaAnagraficaComponent } from './components/anagrafica/modifica-anagrafica/modifica-anagrafica.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DettaglioAnagraficaComponent } from './components/anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';
import { DettaglioContrattoComponent } from './components/contratto/dettaglio-contratto/dettaglio-contratto.component';
import { NuovoContrattoComponent } from './components/contratto/nuovo-contratto/nuovo-contratto.component';
import { ModificaContrattoComponent } from './components/contratto/modifica-contratto/modifica-contratto.component';
import { NuovaCommessaComponent } from './components/commessa/nuova-commessa/nuova-commessa.component';
import { ModificaCommessaComponent } from './components/commessa/modifica-commessa/modifica-commessa.component';
import { DettaglioCommessaComponent } from './components/commessa/dettaglio-commessa/dettaglio-commessa.component';
import { ListaDashboardComponent } from './components/dashboard/lista-dashboard/lista-dashboard.component';
import { NuovaAnagraficaComponent } from './components/anagrafica/nuova-anagrafica/nuova-anagrafica.component';
import { ListaCommesseComponent } from './components/commessa/lista-commesse/lista-commesse.component';
import { ListaAnagraficheComponent } from './components/anagrafica/lista-anagrafiche/lista-anagrafiche.component';
import { ListaContrattiComponent } from './components/contratto/lista-contratti/lista-contratti.component';
import { ListaOrganicoComponent } from './components/organico/lista-organico/lista-organico.component';

const routes: Routes = [
  //HOME
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },

  //ANAGRAFICA
  { path: 'dettaglio-anagrafica/:id', component: DettaglioAnagraficaComponent },
  { path: 'modifica-anagrafica/:id', component: ModificaAnagraficaComponent },
  { path: 'nuova-anagrafica', component: NuovaAnagraficaComponent },
  { path: 'lista-anagrafiche', component: ListaAnagraficheComponent },

  //CONTRATTO
  { path: 'dettaglio-contratto/:id', component: DettaglioContrattoComponent },
  { path: 'modifica-contratto/:id', component: ModificaContrattoComponent },
  { path: 'nuovo-contratto', component: NuovoContrattoComponent },
  { path: 'lista-contratti', component: ListaContrattiComponent },

  //COMMESSA
  { path: 'dettaglio-commessa/:id', component: DettaglioCommessaComponent },
  { path: 'modifica-commessa/:id', component: ModificaCommessaComponent },
  { path: 'nuova-commessa', component: NuovaCommessaComponent },
  { path: 'lista-commesse', component: ListaCommesseComponent },

  //DASHBOARD
  { path: 'dashboard', component: ListaDashboardComponent },
  //ORGANICO
  { path: 'organico', component: ListaOrganicoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
