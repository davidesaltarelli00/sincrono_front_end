import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecuperoPasswordService } from './recupero-password.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-recupero-password',
  templateUrl: './recupero-password.component.html',
  styleUrls: ['./recupero-password.component.scss'],
})
export class RecuperoPasswordComponent implements OnInit {
  email: string = '';
  mailInviata: any;
  recuperoPasswordForm: FormGroup;

  constructor(
    private router: Router,
    private recuperoPasswordService: RecuperoPasswordService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.recuperoPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  tornaAlogin() {
    this.router.navigateByUrl('/login');
    location.reload();
  }

  recuperaPassword() {
    if (this.recuperoPasswordForm.valid) {
      const email = this.recuperoPasswordForm.get('email')?.value;
      this.email = email;
      console.log('Email recuperata:', email);
      this.recuperoPasswordService.recuperaPassword(this.email).subscribe(
        (response: any) => {
          if ((response as any).esito.target != 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/danger.jpeg',
                title:
                  'Attenzione: qualcosa é andato storto.',
                message: 'Riprova, se il problema persiste contatta l assistenza.',
              },
            });
          } else{
            console.log(response);
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/logo.jpeg',
                title:
                  'Ti é stata inviata una mail per il recupero della password.',
                message: 'Controlla la tua casella di posta.',
              },
            });
            this.mailInviata = true;
          }

        },
        (error: any) => {
          console.log('Errore durante l invio dei dati: ' + error);
          this.mailInviata = false;
        }
      );
    } else {
      console.error('ERRORE_GENERICO');
    }
  }
}
