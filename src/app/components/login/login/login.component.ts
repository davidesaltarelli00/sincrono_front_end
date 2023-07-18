import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../login-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, DoCheck {
  // showSidebar: boolean = false;
  // formLogin: FormGroup;
  // isLoginPage = true; // Imposta su true quando sei nella pagina di login

  // constructor(private router: Router, private formBuilder: FormBuilder) {
  //   const currentUrl = this.router.url;
  //   const isLoginPage = currentUrl === '/login';

  //   if (isLoginPage) {
  //     document.body.classList.add('login-page');
  //   } else {
  //     document.body.classList.remove('login-page');
  //   }

  //   this.formLogin = this.formBuilder.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //   });
  // }

  // ngOnInit() {}

  // login() {
  //   if (this.formLogin.valid) {
  //     const email = this.formLogin.value.email;
  //     const password = this.formLogin.value.password;

  //     this.router.navigate(['/home']);
  //     this.showSidebar=true;
  //   } else{
  //     this.showSidebar=false;
  //   }
  // }

  loginForm: FormGroup;

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

  ngDoCheck(): void {
    this. ngOnInit() ;
  }


  login() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.authService.authenticate(username, password).subscribe(
      (response) => {
        // Login successful, handle the response
        console.log('Login successful!');
        console.log(response);

        // Formatta il token
        const tokenParts = response.token.split('.');
        const tokenHeader = JSON.parse(atob(tokenParts[0]));
        const tokenPayload = JSON.parse(atob(tokenParts[1]));

        // Puoi accedere alle parti del token come oggetti JSON
        console.log('Token header:', tokenHeader);
        console.log('Token payload:', tokenPayload);

        // Memorizza il token nel localStorage
        localStorage.setItem('token', response.token);

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
