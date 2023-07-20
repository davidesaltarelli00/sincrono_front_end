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
  token: any = localStorage.getItem("token");
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  userLoggedMail: any;
  userLoggedName: any;
  userLoggedSurname: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileBoxService: profileBoxService
  ) {
    if (this.token != null) {
      localStorage.getItem('token');
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

  // logout() {
  //   this.authService.logout().subscribe(
  //     (response: any) => {
  //       localStorage.removeItem('token');
  //       console.log('Logout effettuato correttamente. ', response);
  //       this.router.navigate(['/login']);
  //     },
  //     (error: any) => {
  //       console.log('Errore durante il logout:' + error.message);
  //     }
  //   );
  // }

  logout() {
    const confirmation = confirm("Sei sicuro di voler effettuare il logout?");
    if (confirmation) {
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('token');
          console.log('Logout effettuato correttamente.');
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.log('Errore durante il logout:', error.message);
        }
      );
    }
  }


  getUserLogged() {
    const token=localStorage.getItem('token');
    console.log("TOKEN PROFILE BOX APP COMPONENT: "+ token);
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.userLoggedMail = response.anagraficaDto.anagrafica.mailAziendale;
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
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
