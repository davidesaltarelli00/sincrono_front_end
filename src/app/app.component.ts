import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './components/login/login-service';
import { MatSidenav } from '@angular/material/sidenav';
import { profileBoxService } from './components/profile-box/profile-box.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  token: any = localStorage.getItem('token');
  userLoggedMail: any;
  userLoggedName: any;
  userLoggedSurname: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileBoxService: profileBoxService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.token = localStorage.getItem('token');
      }
    });

    this.token = localStorage.getItem('token');
    console.log('Token:', this.token);

    if (this.token) {
      // Se l'utente è autenticato, recupera i dati dell'utente
      this.getUserLogged();
    }
  }

  getUserLogged() {
    const token = localStorage.getItem('token');
    console.log('TOKEN PROFILE BOX APP COMPONENT: ' + token);
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.userLoggedMail = response.anagraficaDto.anagrafica.mailAziendale;
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
      },
      (error: any) => {
        console.error(
          'Si è verificato il seguente errore durante il recupero dei dati: ' +
            error
        );
      }
    );
  }

  logout() {
    const confirmation = confirm('Sei sicuro di voler effettuare il logout?');
    if (confirmation) {
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('token');
          console.log('Logout effettuato correttamente.');
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.log('Errore durante il logout:', error.message);
        }
      );
    }
  }
}
