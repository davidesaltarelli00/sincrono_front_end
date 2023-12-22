import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RichiesteRoutingModule } from './richieste.routing.module';
import { RichiesteComponent } from './richieste.component';
import { DettaglioRichiestaComponent } from './dettaglio-richiesta/dettaglio-richiesta.component';
import { ModificaRichiestaComponent } from './modifica-richiesta/modifica-richiesta.component';
import { TruncatePipe } from 'src/app/pipe/TruncatePipe';
import { InsertPermessoComponent } from './insert-permesso/insert-permesso.component';

@NgModule({
  declarations: [
    RichiesteComponent,
    DettaglioRichiestaComponent,
    ModificaRichiestaComponent,
    InsertPermessoComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    RichiesteRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class RichiesteModule {}
