import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import * as XLSX from 'xlsx';
import { MenuService } from '../menu.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';

@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss'],
})
export class UtenteComponent implements OnInit {

  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;


  codiceFiscale = '';
  data: any[] = [];
  user: any;
  messaggio = '';
  currentDate = new Date();
  currentMonth: any;
  currentYear: any;
  id = this.activatedRoute.snapshot.params['id'];
  elencoCommesse: any;
  contratto: any;
  italianMonths = [
    'gennaio',
    'febbraio',
    'marzo',
    'aprile',
    'maggio',
    'giugno',
    'luglio',
    'agosto',
    'settembre',
    'ottobre',
    'novembre',
    'dicembre',
  ];

  rapportinoDto: any[] = [];

  @ViewChild('editableTable') editableTable!: ElementRef;

  modifiedData: any[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private router: Router,
    private anagraficaDtoService: AnagraficaDtoService,
    private datePipe: DatePipe,
    private menuService: MenuService,
    private http: HttpClient,


  ) {
    this.currentMonth = this.italianMonths[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.getAnagraficaRapportino();
    } else {
      console.error('ERRORE DI AUTENTICAZIONE');
    }
  }

  getAnagraficaRapportino() {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.user = (resp as any)['anagraficaDto'];
          console.log(this.user);
          this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
          this.contratto = (resp as any)['anagraficaDto']['contratto'];
          this.codiceFiscale = (resp as any)['anagraficaDto']['anagrafica'][
            'codiceFiscale'
          ];
          console.log('CODICE FISCALE:' + this.codiceFiscale);
          console.log('PARTE ENDPOINT PER RAPPORTINO');
          this.getRapportino();
        },
        (error: any) => {
          console.error(
            'ERRORE DURANTE IL CARICAMENTO DELL ANAGRAFICA :' +
              JSON.stringify(error)
          );
        }
      );
  }

  getRapportino() {
    this.profileBoxService
      .getRapportino(localStorage.getItem('token'), this.codiceFiscale)
      .subscribe(
        (result: any) => {
          this.rapportinoDto = result['rapportinoDto']['mese']['giorni'];
          console.log('DATA: ' + JSON.stringify(this.rapportinoDto));
        },
        (error: any) => {
          console.error(
            'ERRORE DURANTE IL CARICAMENTO DEL RAPPORTINO:' +
              JSON.stringify(error)
          );
        }
      );
  }

  inviaRapportino() {
    // Raccogli i dati modificati dalla tabella e aggiungili a modifiedData
    const tableRows =
      this.editableTable.nativeElement.getElementsByTagName('tr');
    for (let i = 1; i < tableRows.length; i++) {
      const row = tableRows[i];
      const giorno = row.cells[0].innerText;
      const cliente = row.cells[1].innerText;
      const oreOrdinarie = row.cells[2].innerText;

      // Aggiungi i dati modificati all'array modifiedData
      this.modifiedData.push({ giorno, cliente, oreOrdinarie });
    }

    // Ora puoi inviare this.modifiedData al server
    console.log('Dati modificati:', this.modifiedData);

    // Invia i dati modificati al server
    let body = {
      rapportinoDto: {
        mese: {
          giorni: this.modifiedData,
        },
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
      },
    };

    this.menuService
      .sendRapportino(localStorage.getItem('token'), body)
      .subscribe(
        (result: any) => {
          if (
            (result as any).esito.code !== 200 &&
            (result as any).esito.target === 'HTTP error code: 400'
          ) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                Image: '../../../../assets/images/logo.jpeg',
                title: 'Invio non riuscito:',
                message: 'Errore validazione.', //(result as any).esito.target,
              },
            });
            console.error(result);
          }

          if ((result as any).esito.code == 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Invio riuscito',
                message: (result as any).esito.target,
              },
            });
            this.getRapportino();
          }
        },
        (error: any) => {
          console.error(
            'Errore durante l invio del rapportino: ' + JSON.stringify(error)
          );
        }
      );
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
