import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../login-service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  token: string | null = null;
  passwordVisible = false;
  loginForm: FormGroup;
  recuperoPasswordInCorso: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.router.navigate(['/home']);
    } else{
      this.router.navigate(['/login']);

    }
  }

  avviaRecuperoPassword() {
    this.recuperoPasswordInCorso = true;
  }

  annullaRecuperoPassword() {
    this.recuperoPasswordInCorso = false;
  }

  reset() {
    var username = this.loginForm.value.username;
    var password = this.loginForm.value.password;
    username = null;
    password = null;
  }

  login() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.authService.authenticate(username, password).subscribe(
      (response) => {

        if ((response as any).esito.code !== 200) {
          // alert(
          //   'Inserimento non riuscito\n' +
          //     'Target: ' +
          //     (response as any).esito.target
          // );

          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Login non riuscito:',
              message: (response as any).esito.target,
            },
          });
        } else {
          // const dialogRef = this.dialog.open(AlertDialogComponent, {
          //   data: {
          //     title: 'Login effettuato correttamente:',
          //     message: (response as any).esito.target,
          //   },
          // });
          this.router.navigate(['/home']);

        // Formatta il token
        const tokenParts = response.token.split('.');
        const tokenHeader = JSON.parse(atob(tokenParts[0]));
        const tokenPayload = JSON.parse(atob(tokenParts[1]));

        // Puoi accedere alle parti del token come oggetti JSON
        console.log('Token header:', tokenHeader);
        console.log('Token payload:', tokenPayload);

        // Memorizza il token nel localStorage e assegna alla variabile token
        localStorage.setItem('token', response.token);
        this.token = response.token;
        console.log("Si é loggato l'utente "+ tokenPayload.sub);

        }


      },
      (error) => {
        // Login failed, handle the error
        console.error('Login failed', error);
      }
    );
  }
}
