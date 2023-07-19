import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recupero-password',
  templateUrl: './recupero-password.component.html',
  styleUrls: ['./recupero-password.component.scss'],
})
export class RecuperoPasswordComponent implements OnInit {
  email: string = ''; // Proprietà per memorizzare l'indirizzo email inserito nell'input

  constructor() { }

  ngOnInit(): void {}


  recuperaPassword() {
    // Implementa la logica per il recupero password qui
    // Utilizza this.email per ottenere l'indirizzo email inserito dall'utente
    // Esegui la chiamata al servizio di recupero password se necessario

    console.log('Email inserito:', this.email);
    // Esempio: this.authService.recuperoPassword(this.email).subscribe(result => { ... });
  }

}
