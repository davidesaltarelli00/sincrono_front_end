import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListaOrganicoComponent } from './lista-organico/lista-organico.component';
import { OrganicoRoutingModule } from './organico.routing.module';
import { RisultatiFilterOrganicoComponent } from './risultati-filter-organico/risultati-filter-organico.component';

@NgModule({
  declarations: [ListaOrganicoComponent, RisultatiFilterOrganicoComponent],
  imports: [
    CommonModule,
    OrganicoRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class OrganicoModule {}
