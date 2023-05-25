import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DettaglioAnagraficaComponent } from './components/anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';
import { DettaglioContrattoComponent } from './components/contratto/dettaglio-contratto/dettaglio-contratto.component';
import { NuovoContrattoComponent } from './components/contratto/nuovo-contratto/nuovo-contratto.component';
import { ModificaContrattoComponent } from './components/contratto/modifica-contratto/modifica-contratto.component';

const routes: Routes = [

  { path:"anagrafica/:id", component: DettaglioAnagraficaComponent },
  { path:"contratto/:id", component: DettaglioContrattoComponent },
  { path:"modifica-contratto/:id", component: ModificaContrattoComponent},
  { path:"nuovo-contratto", component: NuovoContrattoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
