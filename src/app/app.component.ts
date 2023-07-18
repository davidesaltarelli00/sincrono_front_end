import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from './components/login/login-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;
  @ViewChild('drawer') drawer!: MatDrawer;
  isViewInitialized: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    console.log(this.isAuthenticated);
    console.log(this.isViewInitialized);

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        // Controlla se l'URL corrente non è '/login'
        this.isAuthenticated = url !== '/login';
      }
    });

    setTimeout(() => {
      this.isViewInitialized = true; // Imposta la vista come inizializzata dopo un ritardo
    }, 0);
  }
  toggleDrawer() {
    this.drawer.toggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
