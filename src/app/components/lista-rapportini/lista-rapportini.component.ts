import { Component } from '@angular/core';

@Component({
  selector: 'app-lista-rapportini',
  templateUrl: './lista-rapportini.component.html',
  styleUrls: ['./lista-rapportini.component.scss'],
})
export class ListaRapportiniComponent {
  token = localStorage.getItem('token');
}
