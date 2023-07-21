import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../login-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  token: string | null = null;

  loginForm: FormGroup;
  recuperoPasswordInCorso: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  ngOnInit() {

  }

  avviaRecuperoPassword() {
    this.recuperoPasswordInCorso = true;
  }

  annullaRecuperoPassword() {
    this.recuperoPasswordInCorso = false;
  }

  reset(){
    var username = this.loginForm.value.username;
    var password = this.loginForm.value.password;
    username=null;
    password=null;
  }


  login() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.authService.authenticate(username, password).subscribe(
      (response) => {
        // Login successful, handle the response
        console.log('Login successful!');
        // console.log(response);

        // Formatta il token
        const tokenParts = response.token.split('.');
        const tokenHeader = JSON.parse(atob(tokenParts[0]));
        const tokenPayload = JSON.parse(atob(tokenParts[1]));

        // Puoi accedere alle parti del token come oggetti JSON
        // console.log('Token header:', tokenHeader);
        // console.log('Token payload:', tokenPayload);

        // Memorizza il token nel localStorage e assegna alla variabile token
        localStorage.setItem('token', response.token);
        this.token = response.token;

        // Redirect a una diversa pagina o esegui altre azioni
        this.router.navigate(['/home']);
      },
      (error) => {
        // Login failed, handle the error
        console.error('Login failed', error);
      }
    );
  }

}
