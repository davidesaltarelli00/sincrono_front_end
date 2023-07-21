import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from './components/login/login-service';
import { MatSidenav } from '@angular/material/sidenav';
import { profileBoxService } from './components/profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertLogoutComponent } from './components/alert-logout/alert-logout.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  token: string | null = null;
  userLoggedMail: any;
  userLoggedName: any;
  userLoggedSurname: any;
  isRecuperoPassword: boolean = false;
  tokenProvvisorio: string | null = localStorage.getItem('tokenProvvisorio');

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileBoxService: profileBoxService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('tokenProvvisorio');
    this.token = localStorage.getItem('token');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.token = localStorage.getItem('token');
      }
      // console.log('Token:', this.token);

      if (this.token) {
        // Se l'utente è autenticato, recupera i dati dell'utente
        this.getUserLogged();
      }
    });

    this.token = localStorage.getItem('token');

    // Estrai il token provvisorio dai parametri della URL
    this.route.params.subscribe((params) => {
      this.tokenProvvisorio = params['tokenProvvisorio'];
    });
  }

  getUserLogged() {
    const token = localStorage.getItem('token');
    // console.log('TOKEN PROFILE BOX APP COMPONENT: ' + token);
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
    this.dialog.open(AlertLogoutComponent);
    // const confirmation = confirm('Sei sicuro di voler effettuare il logout?');
    // if (confirmation) {
    //   this.authService.logout().subscribe(
    //     () => {
    //       localStorage.removeItem('token');
    //       localStorage.removeItem('tokenProvvisorio');
    //       // console.log('Logout effettuato correttamente.');
    //       this.router.navigate(['/login']);
    //       location.reload();
    //     },
    //     (error: any) => {
    //       console.log('Errore durante il logout:', error.message);
    //     }
    //   );
    // }
  }

  avviaRecuperoPassword() {
    this.isRecuperoPassword = true;
  }

  tornaAlogin() {
    this.isRecuperoPassword = false;
  }
}
