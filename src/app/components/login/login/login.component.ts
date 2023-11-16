import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../login-service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { ThemeService } from 'src/app/theme.service';

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
  tokenExpirationTime: any;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public themeService:ThemeService,
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
    } else {
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
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image:'../../../../assets/images/danger.png',
              title: 'Login non riuscito:',
              message: (response as any).esito.target,
            },
          });
        } else {
          this.router.navigate(['/home']);
          // Formatta il token
          const tokenParts = response.token.split('.');
          const tokenHeader = JSON.parse(atob(tokenParts[0]));
          const tokenPayload = JSON.parse(atob(tokenParts[1]));
          // Calcola il tempo rimanente del token
          const currentTime = Date.now() / 1000;
          this.tokenExpirationTime = tokenPayload.exp - currentTime;
          // Puoi accedere alle parti del token come oggetti JSON
          console.log('Token header:', tokenHeader);
          console.log('Token payload:', tokenPayload);
          console.log("DURATA TOKEN: "+ JSON.stringify(this.tokenExpirationTime));
          // Memorizza il token nel localStorage e assegna alla variabile token
          localStorage.setItem('token', response.token);
          this.token = response.token;
          console.log("Si é loggato l'utente " + tokenPayload.sub);
          console.log('Token generato: ' + localStorage.getItem('token'));
        }
      },
      (error) => {
        console.error('Login fallito:', JSON.stringify(error));
      }
    );
  }


  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

}
