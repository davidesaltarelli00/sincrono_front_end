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
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenProvvisorio');
        sessionStorage.clear();
        // window.location.href = 'login';
        // window.addEventListener('unload', function (event) {
        //   localStorage.clear();
        // });
        this.router.navigate(['/login']);
        this.dialog.closeAll();
      },
      (error: any) => {
        console.log('Errore durante il logout:', error.message);
        sessionStorage.clear();
        window.location.href = 'login';
        localStorage.removeItem('token');
        localStorage.removeItem('tokenProvvisorio');
      }
    );
  }

  close() {
    this.dialog.closeAll();
  }
}
