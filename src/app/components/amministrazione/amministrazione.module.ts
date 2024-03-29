import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestioneRuoliComponent } from './gestione-ruoli/gestione-ruoli.component';
import { AmministrazioneRoutingModule } from './amministrazione.routing.module';
import { CreateNodeDialogComponent } from './create-node-dialog/create-node-dialog.component';

@NgModule({
  declarations: [GestioneRuoliComponent,CreateNodeDialogComponent],
  imports: [
    CommonModule,
    AmministrazioneRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class AmministrazioneModule {}
