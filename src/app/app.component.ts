import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './components/login/login-service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'sincrono';
  showFiller = false;
  isLoginPage: any;
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  // userlogged=this.authService.userLogged;
  constructor(private router: Router) {
    // this.isLoginPage=false;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = (event.url === '/login');
      }
    });
  }

  ngOnInit() {
  }
}
