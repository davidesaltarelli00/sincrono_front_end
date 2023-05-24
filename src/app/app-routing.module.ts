import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DettaglioAnagraficaComponent } from './components/anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';
import { DettaglioContrattoComponent } from './components/contratto/dettaglio-contratto/dettaglio-contratto.component';

const routes: Routes = [

  { path:"anagrafica/:id", component: DettaglioAnagraficaComponent },
  { path:"contratto/:id", component: DettaglioContrattoComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
