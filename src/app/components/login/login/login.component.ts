import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../login-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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

  username: string="";
  password: string="";
  userlogged="";

  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit(): void {}

  login() {
    if (this.authService.login(this.username, this.password)) {
      console.log(this.username, this.password);
      const userLogged = localStorage.getItem('userLogged');
      this.authService.userLogged = userLogged;
      this.router.navigate(['/home']);
    } else {
      console.log('Errore di autenticazione, riprovare.');
    }
  }



}
