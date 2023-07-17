import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isRisorseUmane: boolean = false;
  userlogged = localStorage.getItem('userLogged');

  constructor(private authService: AuthService, private router:Router) {
    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
    }
  }
  ngOnInit(): void {}

  seeSide() {}

  logout() {
    this.authService.logout();
    localStorage.clear();
    location.reload();

  }


  profile(){
    this.router.navigate(['/profile-box/',this.userlogged]);
  }
}
