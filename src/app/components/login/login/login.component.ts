import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showSidebar: boolean = false;
  formLogin: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) {
    const currentUrl = this.router.url;
    const isLoginPage = currentUrl === '/login'; // Aggiusta l'URL in base alla tua configurazione di routing

    if (isLoginPage) {
      document.body.classList.add('login-page');
    } else {
      document.body.classList.remove('login-page');
    }

    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  login() {
    if (this.formLogin.valid) {
      // Effettua la logica per il login utilizzando i valori del form
      const email = this.formLogin.value.email;
      const password = this.formLogin.value.password;

      // Esegui il login con i valori forniti
      // Puoi inserire qui la logica specifica per il login, come una chiamata API, ecc.
      this.router.navigate(['/home']);
      this.showSidebar=true;
    } else{
      this.showSidebar=false;
    }
  }

}
