import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/login-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  isRisorseUmane: boolean = false;
  userlogged='';
  constructor(public authService:AuthService) {}

  ngOnInit(): void {
    this.userlogged = this.authService.userLogged;
    console.log("Utente loggato home:"+ this.userlogged);
  }

  seeSide(){

  }

  logout() {
    this.authService.logout();
  }

}
