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

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.scss'],
})
export class CambioPasswordComponent {
  passwordForm: FormGroup;
  anagrafica: any;
  idUtente = null;

  result: any; //variabile che conterrá la response del cambio password andato a buon fine

  constructor(
    private formBuilder: FormBuilder,
    private profileBoxService: ProfileBoxService,
    private cambioPasswordService: CambioPasswordService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
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

        console.log("BODY CAMBIO PSW: "+ JSON.stringify(body));

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
}
