import { ImageService } from './../image.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../login/login-service';
import { ProfileBoxService } from './profile-box.service';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MenuService } from '../menu.service';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import { ImmagineComponent } from '../immagine/immagine.component';
import { ThemeService } from 'src/app/theme.service';
import { RichiesteService } from '../richieste/richieste.service';
@Component({
  selector: 'app-profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss'],
})
export class ProfileBoxComponent {
  immaginePredefinita: string | null = null;
  isRisorseUmane: boolean = false;
  anagrafica: any;
  username_accesso = null;
  codiceFiscaleUtenteLoggato: any;
  id: any;
  mobile: any = false;
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  base64Data: any;
  profilePic: any;
  immagine: any;
  immagineConvertita: any; // Proprietà per immagine convertita in base64
  immagineNonConvertita: any; // Proprietà per immagine non convertita in Blob
  salvaImmagine: boolean = false;
  immagineCancellata: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  bodyGet: FormGroup = new FormGroup({
    codiceFiscale: new FormControl(null),
  });
  bodyAdd: FormGroup = new FormGroup({
    codiceFiscale: new FormControl(null),
    base64: new FormControl(null),
  });
  userLoggedFiscalCode: any;
  elencoCommesse: any[] = [];
  idUtente: any;
  tokenExpirationTime: any;
  timer: any;
  ruolo: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public themeService: ThemeService,
    private imageService: ImageService,
    private menuService: MenuService,
    private anagraficaDtoService: AnagraficaDtoService,
    private cdRef: ChangeDetectorRef,
    private richiesteService:RichiesteService
  ) {
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
    this.bodyGet = this.formBuilder.group({
      codiceFiscale: new FormControl(null),
    });
  }
  close() {
    this.dialog.closeAll();
  }

  private handleLogoutError() {
    sessionStorage.clear();
    window.location.href = 'login';
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvvisorio');
  }

  ngOnInit(): void {
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

    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    }
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        this.id = response.anagraficaDto.anagrafica.id;
        this.username_accesso = response.anagraficaDto.anagrafica.mailAziendale;
        this.codiceFiscaleUtenteLoggato =response.anagraficaDto.anagrafica.codiceFiscale;
        this.bodyGet.setValue({
          codiceFiscale: this.codiceFiscaleUtenteLoggato,
        });
        this.getImage();
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
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

  vediImmagineProfilo() {
    this.dialog.open(ImmagineComponent);
  }

  addImage() {
    if (this.fileInput && this.fileInput.nativeElement.files.length > 0) {
      const selectedFile: File = this.fileInput.nativeElement.files[0];

      this.convertImageToBase64(selectedFile).then((base64String) => {
        let body = {
          codiceFiscale: this.codiceFiscaleUtenteLoggato,
          base64: base64String,
        };
        // console.log('BODY PER ADD: ' + JSON.stringify(body));
        this.imageService.addImage(this.token, body).subscribe(
          (response: any) => {
            if ((response as any).esito.code != 200) {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  image:'../../../../assets/images/danger.png',
                  title: 'Salvataggio non riuscito:',
                  message: (response as any).esito.target,
                },
              });
            } else {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  image:'../../../../assets/images/logo.jpeg',
                  title: 'Immagine salvata correttamente:',
                  message: (response as any).esito.target,
                },
              });
              this.immagine = response;
              this.getImage();
              location.reload();
            }
          },
          (error: any) => {
            console.error(
              'Errore durante l invio dell immagine: ' + JSON.stringify(error)
            );
          }
        );
      });
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          image:'../../../../assets/images/danger.png',
          title: 'Attenzione:',
          message: 'Nessuna immagine selezionata.',
        },
      });
    }
  }

  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleUtenteLoggato,
    };
    // console.log('BODY PER GET IMAGE: ' + JSON.stringify(body));
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        if (this.immagine) {
          this.convertBase64ToImage(this.immagine);
        } else {
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
        this.immaginePredefinita =
          '../../../../assets/images/profilePicPlaceholder.png';
      }
    );
  }

  cancelImage() {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        image:'../../../../assets/images/danger.png',
        title: '',
        message: 'Cambio immagine annullato.',
      },
    });
    location.reload();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      this.convertImageToBase64(selectedFile).then((base64String) => {
        this.immagineConvertita = base64String;
        this.salvaImmagine = true;
      });
    } else {
      this.salvaImmagine = false;
    }
  }

  goToRapportinoByCodiceFiscale() {
    this.router.navigate(['/utente/' + this.id]);
  }

  convertBase64ToImage(base64String: string): void {
    this.immagineConvertita = base64String;
  }

  convertImageToBase64(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }
  convertBase64ToBlob(base64String: string, format: string): Blob {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: `image/${format}` });
  }

  storicizzaCommessa(id: number, posizione: number) {
    const payload = {
      commessa: this.elencoCommesse[posizione],
    };
    // console.log(JSON.stringify(payload));
    this.anagraficaDtoService
      .storicizzaCommessa(payload, localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          // console.log(
          //   'Commessa storicizzata correttamente: ' + JSON.stringify(res)
          // );
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image:'../../../../assets/images/logo.jpeg',
              title: 'Immagine salvata correttamente.',
              message: (res as any).esito.target,
            },
          });
          this.ngOnInit();
        },
        (error: any) => {
          alert(
            'Si è verificato un errore durante la storicizzazione della commessa selezionata: ' +
              error
          );
        }
      );
  }

  modificaCommessa() {
    this.router.navigate(['/modifica-commessa/' + this.id]);
  }

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        console.log(JSON.stringify(response));
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.userLoggedFiscalCode =
          response.anagraficaDto.anagrafica.codiceFiscale;
        this.elencoCommesse = response.anagraficaDto.commesse;
        this.ruolo = response.anagraficaDto.ruolo.descrizione;
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
  }

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));
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
        console.error(
          'Si è verificato il seguente errore durante il recupero del ruolo: ' +
            error
        );
        this.shouldReloadPage = true;
      }
    );
  }

  generateMenuByUserRole() {
    this.menuService
      .generateMenuByUserRole(this.token, this.idUtente)
      .subscribe(
        (data: any) => {
          this.jsonData = data;
          this.idFunzione = data.list[0].id;
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
      (data: any) => {},
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
