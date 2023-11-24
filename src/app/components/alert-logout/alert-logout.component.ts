import { Component } from '@angular/core';
import { AuthService } from '../login/login-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-alert-logout',
  templateUrl: './alert-logout.component.html',
  styleUrls: ['./alert-logout.component.scss'],
})
export class AlertLogoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  /*
   ngOnInit() {
        this.user.richiesta(this.constant.getPath(2), "post").subscribe(data => {
            sessionStorage.clear();
            window.location.href = 'Home';
            localStorage.removeItem('consensi');
        },
        error => {
          sessionStorage.clear();
          window.location.href = 'Home';
        });
    }
  */

    logout() {
      this.authService.logout().subscribe(
        (response: any) => {
          if (response.status === 200) {
            // Logout effettuato con successo
            localStorage.removeItem('token');
            localStorage.removeItem('isDarkMode');
            localStorage.removeItem('DatiSbagliati');
            localStorage.removeItem('tokenProvvisorio');
            sessionStorage.clear();
            this.router.navigate(['/login']);
            this.dialog.closeAll();
          } else {
            // Gestione di altri stati di risposta (es. 404, 500, ecc.)
            console.log('Errore durante il logout:', response.status, response.body);
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
    }

  close() {
    this.dialog.closeAll();
  }

  private handleLogoutError() {
    sessionStorage.clear();
    window.location.href = 'login';
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvvisorio');
    localStorage.removeItem('isDarkMode');
    localStorage.removeItem('DatiSbagliati');
  }
}

