import { Component } from '@angular/core';

@Component({
  selector: 'app-bottoni',
  templateUrl: './bottoni.component.html',
  styleUrls: ['./bottoni.component.scss'],
})
export class BottoniComponent {

  mobile=false;
  constructor(){

  }

  goDown() {
    document.getElementById('finePagina')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  goTop() {
    document.getElementById('inizioPagina')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
