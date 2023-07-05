import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showSidebar: boolean = false;
  constructor(private router: Router) {
    const currentUrl = this.router.url;
    const isLoginPage = currentUrl === '/login'; // Aggiusta l'URL in base alla tua configurazione di routing

    if (isLoginPage) {
      document.body.classList.add('login-page');
    } else {
      document.body.classList.remove('login-page');
    }
  }
}
