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
  role:any;

  constructor(private authService: AuthService, private router: Router) {

  }
  ngOnInit(): void {
    // this.role = this.authService.getTokenAndRole();
    // console.log("Ruolo: " + this.role);
  }

  seeSide() {}

  logout() {
    // this.authService.logout();
  }
  profile() {
    this.router.navigate(['/profile-box/', this.userlogged]);
  }
}
