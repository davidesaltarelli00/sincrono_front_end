import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from './components/login/login-service';
import { MatSidenav } from '@angular/material/sidenav';
import { ProfileBoxService } from './components/profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertLogoutComponent } from './components/alert-logout/alert-logout.component';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  token: string | null = null;
  userLoggedMail: any;
  userLoggedName: any;
  toggleMode = false;
  userLoggedSurname: any;
  isRecuperoPassword: boolean = false;
  tokenProvvisorio: string | null = localStorage.getItem('tokenProvvisorio');
  voceMenu: any;
  userRole: any;
  jsonData: any = {};
  idFunzione: any = {};
  id: any;
  currentDateTime: any;
  shouldReloadPage: boolean = false;
  tokenExpirationTime: any;
  timer: any;
  alertShown: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private http: HttpClient,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef
  ) {}


  toggleDarkMode() {
    this.toggleMode = !this.toggleMode;
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(
      remainingSeconds
    )}`;
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  ngOnInit() {
    // Recupera il token dal localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Formatta il token
      const tokenParts = token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      // Calcola il tempo rimanente del token
      const currentTime = Date.now() / 1000;
      this.tokenExpirationTime = Math.floor(tokenPayload.exp - currentTime);

      // Avvia il timer per aggiornare il tempo rimanente ogni secondo
      this.timer = setInterval(() => {
        this.tokenExpirationTime -= 1;
        this.cdRef.detectChanges(); // Forza l'aggiornamento del template

        if (this.tokenExpirationTime === 600000) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Attenzione:',
              message: `Mancano 10 minuti alla scadenza del token.`,
            },
          });
        }

        if (this.tokenExpirationTime === 0) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Attenzione:',
              message: 'Sessione terminata; esegui il login.',
            },
          });

          this.authService.logout().subscribe(
            (response: any) => {
              if (response.status === 200) {
                // Logout effettuato con successo
                localStorage.removeItem('token');
                localStorage.removeItem('tokenProvvisorio');
                sessionStorage.clear();
                this.router.navigate(['/login']);
                this.dialog.closeAll();
              } else {
                // Gestione di altri stati di risposta (es. 404, 500, ecc.)
                console.log(
                  'Errore durante il logout:',
                  response.status,
                  response.body
                );
                this.handleLogoutError();
              }
            },
            (error: HttpErrorResponse) => {
              if (error.status === 403) {
                // Logout a causa di errore 403 (Forbidden)
                console.log('Errore 403: Accesso negato');
                this.handleLogoutError();
              } else {
                // Gestione di altri errori di rete o server
                console.log('Errore durante il logout:', error.message);
                this.handleLogoutError();
              }
            }
          );
        }
      }, 1000);
    }

    const currentDate = new Date();
    this.currentDateTime = this.datePipe.transform(currentDate, 'yyyy-MM-dd'); // HH:mm:ss
    this.token = localStorage.getItem('tokenProvvisorio');
    this.token = localStorage.getItem('token');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.token = localStorage.getItem('token');
      }
    });
    this.token = localStorage.getItem('token');
    this.route.params.subscribe((params) => {
      this.tokenProvvisorio = params['tokenProvvisorio'];
    });
    // if (this.token != null) {
    //   this.getUserLogged();
    //   this.getUserRole();
    //   this.generateMenuByUserRole();
    // }
  }

  private handleLogoutError() {
    sessionStorage.clear();
    window.location.href = 'login';
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvvisorio');
  }

  ngAfterViewInit(): void {}

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

  // getUserLogged() {
  //   const token = localStorage.getItem('token');
  //   this.profileBoxService.getData().subscribe(
  //     (response: any) => {
  //       this.userLoggedMail = response.anagraficaDto.anagrafica.mailAziendale;
  //       this.userLoggedName = response.anagraficaDto.anagrafica.nome;
  //       this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
  //       console.log('DATI GET USER LOGGED:' + JSON.stringify(response));
  //     },
  //     (error: any) => {
  //       console.error(
  //         'Si è verificato il seguente errore durante il recupero dei dati: ' +
  //           error
  //       );
  //     }
  //   );
  // }

  // getUserRole() {
  //   this.profileBoxService.getData().subscribe(
  //     (response: any) => {
  //       console.log('DATI GET USER ROLE:' + JSON.stringify(response));

  //       this.userRole = response.anagraficaDto.ruolo.nome;
  //       if ((this.userRole = response.anagraficaDto.ruolo.nome === 'ADMIN')) {
  //         this.id = 1;
  //         this.generateMenuByUserRole();
  //         if (this.shouldReloadPage) {
  //           window.location.reload();
  //         }
  //       }
  //       if (
  //         (this.userRole = response.anagraficaDto.ruolo.nome === 'DIPENDENTE')
  //       ) {
  //         this.id = 2;
  //         this.generateMenuByUserRole();
  //         if (this.shouldReloadPage) {
  //           window.location.reload();
  //           this.shouldReloadPage = false;
  //         }
  //       }
  //     },
  //     (error: any) => {
  //       console.error(
  //         'Si è verificato il seguente errore durante il recupero del ruolo: ' +
  //           error
  //       );
  //       this.shouldReloadPage = true;
  //     }
  //   );
  // }

  // generateMenuByUserRole() {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${this.token}`,
  //   });
  //   const url = `http://localhost:8080/services/funzioni-ruolo-tree/${this.id}`;
  //   this.http.get<MenuData>(url, { headers: headers }).subscribe(
  //     (data) => {
  //       this.jsonData = data;
  //       this.idFunzione = data.list[0].id;
  //       console.log(JSON.stringify('DATI NAVBAR: ' + this.jsonData));
  //       this.shouldReloadPage = false;
  //     },
  //     (error) => {
  //       console.error('Errore nella generazione del menu:', error);
  //       this.shouldReloadPage = true;
  //     }
  //   );
  // }

  // getPermissions(functionId: number) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${this.token}`,
  //   });
  //   const url = `http://localhost:8080/services/operazioni/${functionId}`;
  //   this.http.get(url, { headers: headers }).subscribe(
  //     (data: any) => {
  //       console.log('Permessi ottenuti:', data);
  //     },
  //     (error) => {
  //       console.error('Errore nella generazione dei permessi:', error);
  //     }
  //   );
  // }

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  avviaRecuperoPassword() {
    this.isRecuperoPassword = true;
  }

  tornaAlogin() {
    this.isRecuperoPassword = false;
  }
}

// interface MenuData {
//   esito: {
//     code: number;
//     target: any;
//     args: any;
//   };
//   list: {
//     id: number;
//     funzione: any;
//     menuItem: number;
//     nome: string;
//     percorso: string;
//     immagine: any;
//     ordinamento: number;
//     funzioni: any;
//     privilegio: any;
//   }[];
// }
