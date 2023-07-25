import { Component } from '@angular/core';
import { AuthService } from '../login/login-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

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

  logout() {
    this.authService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenProvvisorio');


        window.addEventListener('unload', function (event) {
          // Svuota il localStorage
          localStorage.clear();
        });
        this.router.navigate(['/login']);
        this.dialog.closeAll();
      },
      (error: any) => {
        console.log('Errore durante il logout:', error.message);
      }
    );
  }

  close() {
    this.dialog.closeAll();
  }
}
