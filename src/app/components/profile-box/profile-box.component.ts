import { Component } from '@angular/core';
import { AuthService } from '../login/login-service';
import { profileBoxService } from './profile-box.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss'],
})
export class ProfileBoxComponent {
  isRisorseUmane: boolean = false;

  anagrafica: any;
  username_accesso = null;
  codiceFiscaleUtenteLoggato: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: profileBoxService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    // console.log("profile box component token: "+ token)
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        this.username_accesso = response.anagraficaDto.anagrafica.mailAziendale;
        this.codiceFiscaleUtenteLoggato =
          response.anagraficaDto.anagrafica.codiceFiscale;
        console.log(
          'CODICE FISCALE UTENTE LOGGATO: ' + this.codiceFiscaleUtenteLoggato
        );
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
  }

  goToRapportinoByCodiceFiscale() {
    this.router.navigate(['/utente/' + this.codiceFiscaleUtenteLoggato]);
  }
}
