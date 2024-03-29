import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../login/login-service';
import { Router } from '@angular/router';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageService } from '../image.service';
import { MenuService } from '../menu.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { ContrattoService } from '../contratto/contratto-service';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  ruolo: any;
  //proprietá per immagini
  immagine: any;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  immagineConvertita: string | null = null;
  immaginePredefinita: string | null = null;
  idAnagraficaLoggata: any;
  disabilitaImmagine: any;
  salvaImmagine: boolean = false;
  immagineCancellata: boolean = false;
  codiceFiscaleDettaglio: any;
  idUtente: any;
  mobile: any = false;
  isVoiceActionActivated = false;
  toggleMode: boolean = false;
  aziendeClienti: any[] = [];
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
  orarioAttuale: Date = new Date();
  tokenExpirationTime: any;
  timer: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private imageService: ImageService,
    private menuService: MenuService,
    private contrattoService: ContrattoService,
    public themeService: ThemeService,
    private cdRef: ChangeDetectorRef
  ) {
    this.windowWidth = window.innerWidth;
    if (window.innerWidth >= 900) {
      // 768px portrait
      this.mobile = false;
    } else {
      this.mobile = true;
    }
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) == true
    ) {
      this.mobile = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }

  getWindowWidth(): number {
    return this.windowWidth;
  }
  toggleHamburgerMenu(): void {
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
  }
  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    if (this.token) {
      const tokenParts = this.token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      this.tokenExpirationTime = Math.floor(tokenPayload.exp - currentTime);
      this.timer = setInterval(() => {
        this.tokenExpirationTime -= 1;
        this.cdRef.detectChanges();

        if (this.tokenExpirationTime === 0) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Attenzione:',
              message: 'Sessione terminata; esegui il login.',
            },
          });

          this.authService.logout().subscribe(
            (response: any) => {
              if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenProvvisorio');
                sessionStorage.clear();
                this.router.navigate(['/login']);
                this.dialog.closeAll();
              } else {
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
                console.log('Errore 403: Accesso negato');
                this.handleLogoutError();
              } else {
                console.log('Errore durante il logout:', error.message);
                this.handleLogoutError();
              }
            }
          );
        }
      }, 1000);
    }

    if (this.token != null) {
      this.getUserLogged();
      this.caricaAziendeClienti();
      setInterval(() => {
        this.orarioAttuale = new Date();
      }, 1000);
    }
    if (this.token == null) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Attenzione:',
          message: 'Errore di autenticazione; effettua il login.',
        },
      });
      this.authService.logout().subscribe(
        (response: any) => {
          if (response.status === 200) {
            localStorage.removeItem('token');
            localStorage.removeItem('isDarkMode');
            localStorage.removeItem('DatiSbagliati');
            localStorage.removeItem('tokenProvvisorio');
            sessionStorage.clear();
            this.router.navigate(['/login']);
            this.dialog.closeAll();
          } else {
            this.handleLogoutError();
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.handleLogoutError();
          } else {
            this.handleLogoutError();
          }
        }
      );
    }
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

  private handleLogoutError() {
    sessionStorage.clear();
    window.location.href = 'login';
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvvisorio');
  }

  caricaAziendeClienti() {
    this.contrattoService.getAllAziendaCliente(this.token).subscribe(
      (result: any) => {

        console.log('NOMI AZIENDE CARICATI:' + JSON.stringify(result));
        this.aziendeClienti = (result as any)['list'];
      },
      (error: any) => {
        console.error(
          'errore durante il caricamento dei nomi azienda:' + error
        );
      }
    );
  }

  //metodi immagine
  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleDettaglio,
    };
    console.log(JSON.stringify(body));
    console.log('BODY PER GET IMAGE: ' + JSON.stringify(body));
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        console.log('BASE64 ricevuto: ' + JSON.stringify(this.immagine));

        if (this.immagine) {
          this.convertBase64ToImage(this.immagine);
        } else {
          // Assegna un'immagine predefinita se l'immagine non è disponibile
          this.immaginePredefinita =
            '../../../../assets/images/profilePicPlaceholder.png';
        }
      },
      (error: any) => {
        console.error(
          "Errore durante il caricamento dell'immagine: " +
            JSON.stringify(error)
        );

        // Assegna un'immagine predefinita in caso di errore
        this.immaginePredefinita = '../../../../assets/images/danger.png';
      }
    );
  }

  startVoiceActionListaAnagrafica() {
    if (!this.isVoiceActionActivated) {
      const message = 'Apri lista anagrafiche';
      this.speakListaAnagrafica(message);
      this.isVoiceActionActivated = true;
    }
  }

  openDetailsPageListaAnagrafica() {
    this.router.navigate(['/lista-anagrafica']);
  }

  speakListaAnagrafica(message: string) {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(message);

      // Aggiungi un evento onend per reimpostare lo stato quando la sintesi vocale è completata
      speech.onend = () => {
        this.isVoiceActionActivated = false;
      };

      speechSynthesis.speak(speech);
    } else {
      console.error('La sintesi vocale non è supportata dal tuo browser.');
    }
  }
  startVoiceActionDashboard() {
    if (!this.isVoiceActionActivated) {
      const message = 'Apri dashboard';
      this.speakListaAnagrafica(message);
      this.isVoiceActionActivated = true;
    }
  }

  openDetailsPageDashboard() {
    this.router.navigate(['/dashboard']);
  }

  speakDashboard(message: string) {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(message);

      // Aggiungi un evento onend per reimpostare lo stato quando la sintesi vocale è completata
      speech.onend = () => {
        this.isVoiceActionActivated = false;
      };

      speechSynthesis.speak(speech);
    } else {
      console.error('La sintesi vocale non è supportata dal tuo browser.');
    }
  }

  convertBase64ToImage(base64String: string): void {
    this.immagineConvertita = base64String;
  }

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idAnagraficaLoggata]);
  }

  // metodi per navbar

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  //{"esito":{"code":-1,"target":"ERRORE_GENERICO","args":null}}
  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        if((response as any).esito.code === -1 &&  (response as any).esito.target === 'ERRORE_GENERICO' ){
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Attenzione:',
              message: 'Errore di autenticazione; effettua il login.',
            },
          });
          this.authService.logout().subscribe(
            (response: any) => {
              if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('isDarkMode');
                localStorage.removeItem('DatiSbagliati');
                localStorage.removeItem('tokenProvvisorio');
                sessionStorage.clear();
                this.router.navigate(['/login']);
                this.dialog.closeAll();
              } else {
                this.handleLogoutError();
              }
            },
            (error: HttpErrorResponse) => {
              if (error.status === 403) {
                this.handleLogoutError();
              } else {
                this.handleLogoutError();
              }
            }
          );
        }
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.codiceFiscaleDettaglio =
          response.anagraficaDto.anagrafica.codiceFiscale;
        this.ruolo = response.anagraficaDto.ruolo.descrizione;
        this.idAnagraficaLoggata = response.anagraficaDto.anagrafica.id;
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        this.userRoleNav = response.anagraficaDto.ruolo.nome;
        if (
          (this.userRoleNav = response.anagraficaDto.ruolo.nome === 'ADMIN')
        ) {
          this.idNav = 1;
          this.generateMenuByUserRole();
        }
        if (
          (this.userRoleNav =
            response.anagraficaDto.ruolo.nome === 'DIPENDENTE')
        ) {
          this.idNav = 2;
          this.generateMenuByUserRole();
        }
      },
      (error: any) => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            title: 'Attenzione:',
            message: 'Errore di autenticazione; effettua il login.',
          },
        });
        this.authService.logout().subscribe(
          (response: any) => {
            if (response.status === 200) {
              localStorage.removeItem('token');
              localStorage.removeItem('isDarkMode');
              localStorage.removeItem('DatiSbagliati');
              localStorage.removeItem('tokenProvvisorio');
              sessionStorage.clear();
              this.router.navigate(['/login']);
              this.dialog.closeAll();
            } else {
              this.handleLogoutError();
            }
          },
          (error: HttpErrorResponse) => {
            if (error.status === 403) {
              this.handleLogoutError();
            } else {
              this.handleLogoutError();
            }
          }
        );
      }
    );
  }
  // getUserRole() {
  //   this.profileBoxService.getData().subscribe(
  //     (response: any) => {
  //       console.log('DATI GET USER ROLE:' + JSON.stringify(response));

  //       this.userRoleNav = response.anagraficaDto.ruolo.nome;
  //       this.idUtente = response.anagraficaDto.anagrafica.utente.id;
  //       this.idAnagraficaLoggata = response.anagraficaDto.anagrafica.id;
  //       console.log('ID UTENTE PER NAV:' + this.idUtente);
  //       if (
  //         (this.userRoleNav = response.anagraficaDto.ruolo.nome === 'ADMIN')
  //       ) {
  //         this.idNav = 1;
  //         this.generateMenuByUserRole();
  //       }
  //       if (
  //         (this.userRoleNav =
  //           response.anagraficaDto.ruolo.nome === 'DIPENDENTE')
  //       ) {
  //         this.idNav = 2;
  //         this.generateMenuByUserRole();
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

  generateMenuByUserRole() {
    this.menuService
      .generateMenuByUserRole(this.token, this.idUtente)
      .subscribe(
        (data: any) => {
          this.jsonData = data;
          this.idFunzione = data.list[0].id;
          console.log(
            JSON.stringify('DATI NAVBAR: ' + JSON.stringify(this.jsonData))
          );
          this.shouldReloadPage = false;
        },
        (error: any) => {
          console.error('Errore nella generazione del menu:', error);
          this.shouldReloadPage = true;
          this.jsonData = { list: [] };
        }
      );
  }

  getPermissions(functionId: number) {
    this.menuService.getPermissions(this.token, functionId).subscribe(
      (data: any) => {
        console.log('Permessi ottenuti:', data);
      },
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
