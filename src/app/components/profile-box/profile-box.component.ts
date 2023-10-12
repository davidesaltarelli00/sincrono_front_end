import { Component } from '@angular/core';
import { AuthService } from '../login/login-service';
import { ProfileBoxService } from './profile-box.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';

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
  id: any;

  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;



  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
  ) {}
  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    }
    const token = localStorage.getItem('token');
    // console.log("profile box component token: "+ token)
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        this.id=response.anagraficaDto.anagrafica.id;
        console.log("ID:"+this.id);
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
    this.router.navigate(['/utente/' + this.id]);
  }






  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
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

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        console.log('DATI GET USER ROLE:' + JSON.stringify(response));

        this.userRoleNav = response.anagraficaDto.ruolo.nome;
        if (
          (this.userRoleNav = response.anagraficaDto.ruolo.nome === 'ADMIN')
        ) {
          this.idNav = 1;
          this.generateMenuByUserRole();
        }
        if (
          (this.userRoleNav =
            response.anagraficaDto.ruolo.nome === 'DIPENDENTE')
        ) {
          this.idNav = 2;
          this.generateMenuByUserRole();
        }
      },
      (error: any) => {
        console.error(
          'Si è verificato il seguente errore durante il recupero del ruolo: ' +
            error
        );
        this.shouldReloadPage = true;
      }
    );
  }

  generateMenuByUserRole() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `http://localhost:8080/services/funzioni-ruolo-tree/${this.idNav}`;
    this.http.get<MenuData>(url, { headers: headers }).subscribe(
      (data: any) => {
        this.jsonData = data;
        this.idFunzione = data.list[0].id;
        console.log(
          JSON.stringify('DATI NAVBAR: ' + JSON.stringify(this.jsonData))
        );
        this.shouldReloadPage = false;
      },
      (error: any) => {
        console.error('Errore nella generazione del menu:', error);
        this.shouldReloadPage = true;
      }
    );
  }

  getPermissions(functionId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `http://localhost:8080/services/operazioni/${functionId}`;
    this.http.get(url, { headers: headers }).subscribe(
      (data: any) => {
        console.log('Permessi ottenuti:', data);
      },
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }





}


interface MenuData {
  esito: {
    code: number;
    target: any;
    args: any;
  };
  list: {
    id: number;
    funzione: any;
    menuItem: number;
    nome: string;
    percorso: string;
    immagine: any;
    ordinamento: number;
    funzioni: any;
    privilegio: any;
  }[];
}
