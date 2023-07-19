import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './components/login/login-service';
import { MatSidenav } from '@angular/material/sidenav';
import { profileBoxService } from './components/profile-box/profile-box.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  token: any = null;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  username_accesso: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileBoxService: profileBoxService
  ) {
    if (this.token != null) {
      localStorage.removeItem('token');
      this.authService.logout();
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.token = localStorage.getItem('token');
      }
    });

    this.token = localStorage.getItem('token');
    console.log('Token:', this.token);
    this.getUserLogged();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.username_accesso = response.anagraficaDto.anagrafica.mailAziendale;
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
  }
}
