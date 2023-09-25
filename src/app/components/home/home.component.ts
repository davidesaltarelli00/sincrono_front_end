import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/login-service';
import { Router } from '@angular/router';
import { profileBoxService } from '../profile-box/profile-box.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isRisorseUmane: boolean = false;
  userloggedName: any;
  role: any;
  userLoggedSurname: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: profileBoxService,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.getUserLogged();
  }

  seeSide() {}

  logout() {
    // this.authService.logout();
  }
  // profile() {
  //   this.router.navigate(['/profile-box/', this.userlogged]);
  // }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userloggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
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
