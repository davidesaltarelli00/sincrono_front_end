//import { ModificaAnagraficaComponent } from './components/anagrafica/modifica-anagrafica/modifica-anagrafica.component';
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

const routes: Routes = [
  //ANAGRAFICA
  { path: 'anagrafica/:id', component: DettaglioAnagraficaComponent },
  //{ path: 'modifica-anagrafica/:id', component: ModificaAnagraficaComponent },
  { path: 'nuova-anagrafica', component: NuovaAnagraficaComponent },
  { path: 'dashboard', component: ListaDashboardComponent },
  //CONTRATTO
  { path: 'contratto/:id', component: DettaglioContrattoComponent },
  { path: 'modifica-contratto/:id', component: ModificaContrattoComponent },
  { path: 'nuovo-contratto', component: NuovoContrattoComponent },
  //COMMESSA
  { path: 'commessa/:id', component: DettaglioCommessaComponent },
  { path: 'modifica-commessa/:id', component: ModificaCommessaComponent },
  { path: 'nuova-commessa', component: NuovaCommessaComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
