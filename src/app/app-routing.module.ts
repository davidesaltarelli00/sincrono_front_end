import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DettaglioAnagraficaComponent } from './components/anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';

const routes: Routes = [

  {path:"anagrafica/:id",component: DettaglioAnagraficaComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
