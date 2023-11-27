import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../login/login-service';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
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
                // console.log(
                //   'Errore durante il logout:',
                //   response.status,
                //   response.body
                // );
                this.handleLogoutError();
              }
            },
            (error: HttpErrorResponse) => {
              if (error.status === 403) {
                // Logout a causa di errore 403 (Forbidden)
                // console.log('Errore 403: Accesso negato');
                this.handleLogoutError();
              } else {
                // Gestione di altri errori di rete o server
                // console.log('Errore durante il logout:', error.message);
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

}
