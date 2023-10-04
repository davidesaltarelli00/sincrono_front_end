import {
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
export class AppComponent implements OnInit, AfterViewInit {
  token: string | null = null;
  userLoggedMail: any;
  userLoggedName: any;
  userLoggedSurname: any;
  isRecuperoPassword: boolean = false;
  tokenProvvisorio: string | null = localStorage.getItem('tokenProvvisorio');
  voceMenu: any;
  userRole: any;
  jsonData: any = {};
  idFunzione: any = {};
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
  ) {}

  ngOnInit() {
    const currentDate = new Date();
    this.currentDateTime = this.datePipe.transform(currentDate, 'yyyy-MM-dd'); // HH:mm:ss
    this.token = localStorage.getItem('tokenProvvisorio');
    this.token = localStorage.getItem('token');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.token = localStorage.getItem('token');
      }
    });
    this.token = localStorage.getItem('token');
    this.route.params.subscribe((params) => {
      this.tokenProvvisorio = params['tokenProvvisorio'];
    });
  }

  ngAfterViewInit(): void {
    if (this.token) {
      this.getUserLogged();
      this.getUserRole();
    }
  }

  getUserLogged() {
    const token = localStorage.getItem('token');
    this.profileBoxService.getData().subscribe(
      (response: any) => {
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
  }

  generateMenuByUserRole() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `http://localhost:8080/services/funzioni-ruolo-tree/${this.id}`;
    this.http.get<MenuData>(url, { headers: headers }).subscribe(
      (data) => {
        this.jsonData = data;
        this.idFunzione = data.list[0].id;
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
    const url = `http://localhost:8080/services/operazioni/${functionId}`;
    this.http.get(url, { headers: headers }).subscribe(
      (data: any) => {
        console.log('Permessi ottenuti:', data);
      },
      (error) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  logout() {
    this.dialog.open(AlertLogoutComponent);
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
