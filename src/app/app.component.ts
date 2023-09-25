import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from './components/login/login-service';
import { MatSidenav } from '@angular/material/sidenav';
import { profileBoxService } from './components/profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertLogoutComponent } from './components/alert-logout/alert-logout.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  token: string | null = null;
  userLoggedMail: any;
  userLoggedName: any;
  userLoggedSurname: any;
  isRecuperoPassword: boolean = false;
  tokenProvvisorio: string | null = localStorage.getItem('tokenProvvisorio');
  voceMenu: any;
  userRole: any;
  jsonData: any = {};
  idFunzione: any={};
  id: any;
  currentDateTime: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileBoxService: profileBoxService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {

    const currentDate = new Date();
    this.currentDateTime = this.datePipe.transform(currentDate, 'yyyy-MM-dd'); // HH:mm:ss

    this.token = localStorage.getItem('tokenProvvisorio');
    this.token = localStorage.getItem('token');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.token = localStorage.getItem('token');
      }
      // console.log('Token:', this.token);

      if (this.token) {
        // Se l'utente è autenticato, recupera i dati dell'utente
        this.getUserLogged();
        this.getUserRole();
      }
    });

    this.token = localStorage.getItem('token');

    // Estrai il token provvisorio dai parametri della URL
    this.route.params.subscribe((params) => {
      this.tokenProvvisorio = params['tokenProvvisorio'];
    });
  }

  getUserLogged() {
    const token = localStorage.getItem('token');
    // console.log('TOKEN PROFILE BOX APP COMPONENT: ' + token);
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        // console.log("RESPONSE PROFILE BOX: " + JSON.stringify(response));
        this.userLoggedMail = response.anagraficaDto.anagrafica.mailAziendale;
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
      },
      (error: any) => {
        console.error(
          'Si è verificato il seguente errore durante il recupero dei dati: ' +
            error
        );
      }
    );
    // console.log('l utente che si é loggato é un ' + this.userRole);
  }

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.userRole = response.anagraficaDto.ruolo.nome;
        if ((this.userRole = response.anagraficaDto.ruolo.nome === 'ADMIN')) {
          this.id = 1;
          this.generateMenuByUserRole();
        }
        if (
          (this.userRole = response.anagraficaDto.ruolo.nome === 'DIPENDENTE')
        ) {
          this.id = 2;
          this.generateMenuByUserRole();
        }
      },
      (error: any) => {
        console.error(
          'Si è verificato il seguente errore durante il recupero del ruolo: ' +
            error
        );
      }
    );
    // console.log('l utente che si é loggato é un ' + this.userRole);
  }

  generateMenuByUserRole() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `192.168.58.196:8080/services/funzioni-ruolo-tree/${this.id}`;
    this.http.get<MenuData>(url, {headers: headers}).subscribe(
      (data) => {
        this.jsonData = data;
        // console.log(this.jsonData);
        this.idFunzione = data.list[0].id;
        // console.log(this.idFunzione);
      },
      (error) => {
        console.error('Errore nella generazione del menu:', error);
      }
    );
  }

  getPermissions(functionId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `192.168.58.196:8080/services/operazioni/${functionId}`;
    this.http.get(url,{headers: headers}).subscribe(
      (data: any) => {
        // Qui puoi fare qualcosa con i permessi ottenuti dalla chiamata API
        console.log('Permessi ottenuti:', data);

        // Ad esempio, puoi mostrarli in una finestra di dialogo o in un altro componente
        this.showPermissionsDialog(data);
      },
      (error) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  showPermissionsDialog(permissions: any) {
   console.log("Permessi: "+ permissions);
  }


  logout() {
    this.dialog.open(AlertLogoutComponent);
    // const confirmation = confirm('Sei sicuro di voler effettuare il logout?');
    // if (confirmation) {
    //   this.authService.logout().subscribe(
    //     () => {
    //       localStorage.removeItem('token');
    //       localStorage.removeItem('tokenProvvisorio');
    //       // console.log('Logout effettuato correttamente.');
    //       this.router.navigate(['/login']);
    //       location.reload();
    //     },
    //     (error: any) => {
    //       console.log('Errore durante il logout:', error.message);
    //     }
    //   );
    // }
  }

  avviaRecuperoPassword() {
    this.isRecuperoPassword = true;
  }

  tornaAlogin() {
    this.isRecuperoPassword = false;
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
