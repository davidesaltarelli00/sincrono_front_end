import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { profileBoxService } from '../profile-box/profile-box.service';
import { CambioPasswordService } from './cambio-password.service';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.scss'],
})
export class CambioPasswordComponent {
  passwordForm: FormGroup;
  anagrafica: any;
  idUtente=null;

  result:any; //variabile che conterrá la response del cambio password andato a buon fine

  constructor(
    private formBuilder: FormBuilder,
    private profileBoxService: profileBoxService,
    private cambioPasswordService:CambioPasswordService
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
    console.log('profile box component token: ' + token);
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        const idUtente = response.anagraficaDto.anagrafica.utente.id;
        // console.log('ID UTENTE valorizzato : ' + idUtente);
        this.idUtente=idUtente;
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

        this.cambioPasswordService.cambioPassword().subscribe(
          (response: any) => {
            this.result = response;
            // Puoi fare qualcosa con la risposta dal backend qui, se necessario.
          },
          (error: any) => {
            console.log("Errore durante il cambio password: " + error.message);
          }
        );
      }
    }
  }



}
