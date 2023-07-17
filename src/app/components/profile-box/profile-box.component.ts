import { Component } from '@angular/core';
import { AuthService } from '../login/login-service';

@Component({
  selector: 'app-profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss']
})
export class ProfileBoxComponent {
  isRisorseUmane: boolean = false;
  userlogged = localStorage.getItem('userLogged');

  constructor(private authService: AuthService) {
    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
    }
  }
  ngOnInit(): void {}

}
