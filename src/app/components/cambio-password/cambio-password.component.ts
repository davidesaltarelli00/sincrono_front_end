import { ImageService } from './../image.service';
import { MenuService } from './../menu.service';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { CambioPasswordService } from './cambio-password.service';
import { Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../login/login-service';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.scss'],
})
export class CambioPasswordComponent {
  immagine: any;
  immagineConvertita: string | null = null;
  immaginePredefinita: string | null = null;
  passwordForm: FormGroup;
  anagrafica: any;
  idUtente: any;
  tokenProvvisorio: any;
  token = localStorage.getItem('token');
  result: any; //variabile che conterrá la response del cambio password andato a buon fine
  mobile: any = false;
  userLoggedName: any;
  userLoggedSurname: any;
  userlogged: any;
  jsonData: any;
  userRoleNav: any;
  ruolo:any;
  codiceFiscaleDettaglio: any;
  idNav: any;
  shouldReloadPage: any;
  idFunzione: any;

  constructor(
    private formBuilder: FormBuilder,
    private profileBoxService: ProfileBoxService,
    private cambioPasswordService: CambioPasswordService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private menuService: MenuService,
    private imageService: ImageService
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

    this.userlogged = localStorage.getItem('userLogged');

    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
    }

    this.passwordForm = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    const token = localStorage.getItem('token');
    // console.log('profile box component token: ' + token);
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        const idUtente = response.anagraficaDto.anagrafica.utente.id;
        // console.log('ID UTENTE valorizzato : ' + idUtente);
        this.idUtente = idUtente;
        // console.log('ID UTENTE valorizzato globalmente: ' + this.idUtente);
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
          error
        );
      }
    );

    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    }
  }

  // Restituisce il controllo del form
  get f(): { [key: string]: AbstractControl } {
    return this.passwordForm.controls;
  }

  // Restituisce true se il controllo ha un errore e se è stato toccato
  hasError(controlName: string, errorName: string): boolean {
    const control = this.f[controlName];
    return control?.touched && control?.hasError(errorName);
  }

  // Restituisce true se il controllo ha l'errore "mismatch"
  hasMismatchError(): boolean {
    const confirmPasswordControl = this.f['confirmPassword'];
    return (
      confirmPasswordControl?.touched &&
      confirmPasswordControl?.hasError('mismatch')
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPasswordControl = formGroup.get('newPassword');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!newPasswordControl || !confirmPasswordControl) {
      return;
    }

    const newPassword = newPasswordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (newPassword !== confirmPassword) {
      confirmPasswordControl.setErrors({ mismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.get('oldPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      if (oldPassword && newPassword) {
        this.cambioPasswordService.passwordVecchia = oldPassword;
        this.cambioPasswordService.passwordNuova = newPassword;

        const body = {
          id: this.idUtente,
          passwordVecchia: oldPassword,
          passwordNuova: newPassword,
        };

        console.log("BODY CAMBIO PSW: " + JSON.stringify(body));

        this.cambioPasswordService
          .cambioPassword(localStorage.getItem('token'), body)
          .subscribe(
            (response: any) => {
              this.result = response;
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  title: 'Attenzione:',
                  message: 'Password modificata; rieffettua il login.',
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
            },
            (error: any) => {
              console.log(
                'Errore durante il cambio password: ' + error.message
              );
            }
          );
      }
    }
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

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.ruolo = response.anagraficaDto.ruolo.nome;
        this.codiceFiscaleDettaglio =
          response.anagraficaDto.anagrafica.codiceFiscale;
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

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        console.log('DATI GET USER ROLE:' + JSON.stringify(response));
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        console.log('ID UTENTE PER NAV:' + this.idUtente);
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

  generateMenuByUserRole() {
    this.menuService.generateMenuByUserRole(this.token, this.idUtente).subscribe(
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


  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleDettaglio,
    };
    console.log(JSON.stringify(body));
    console.log('BODY PER GET IMAGE: ' + JSON.stringify(body));
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        //console.log('BASE64 ricevuto: ' + JSON.stringify(this.immagine));

        if (this.immagine) {
          this.convertBase64ToImage(this.immagine);
          //console.log('Valore di immagineConvertita:', this.immagineConvertita);
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

  convertBase64ToImage(base64String: string): void {
    this.immagineConvertita = base64String;
  }

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }
  
}
