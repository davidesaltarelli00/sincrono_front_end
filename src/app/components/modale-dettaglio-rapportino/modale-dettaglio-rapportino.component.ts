import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportinoService } from '../utente/rapportino.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';

@Component({
  selector: 'app-modale-dettaglio-rapportino',
  templateUrl: './modale-dettaglio-rapportino.component.html',
  styleUrls: ['./modale-dettaglio-rapportino.component.scss'],
})
export class ModaleDettaglioRapportinoComponent implements OnInit {
  id: any = this.activatedRoute.snapshot.params['id'];
  nome: any = this.activatedRoute.snapshot.params['nome'];
  cognome: any = this.activatedRoute.snapshot.params['cognome'];
  codiceFiscale: any = this.activatedRoute.snapshot.params['codiceFiscale'];
  mese: any = this.activatedRoute.snapshot.params['mese'];
  anno: any = this.activatedRoute.snapshot.params['anno'];
  token = localStorage.getItem('token');
  rapportinoDto: any;
  note: any;
  giorniUtili: any;
  giorniLavorati: any;
  @ViewChild('editableTable') editableTable!: ElementRef;

  user: any;
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  ruolo: any;
  idUtenteLoggato: any;
  dettaglioSbagliato: any;
  elencoCommesse: any[] = [];
  numeroCommessePresenti: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rapportinoService: RapportinoService,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private profileBoxService: ProfileBoxService,
    private anagraficaDtoService: AnagraficaDtoService
  ) {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    } else {
      console.error('ERRORE DI AUTENTICAZIONE');
    }
  }

  ngOnInit() {
    console.log(
      this.id,
      this.nome,
      this.cognome,
      this.codiceFiscale,
      this.mese,
      this.anno
    );
    let body = {
      rapportinoDto: {
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: this.anno,
        meseRequest: this.mese,
      },
    };
    console.log('BODY PER GET RAPPORTINO:' + JSON.stringify(body));
    this.rapportinoService.getRapportino(this.token, body).subscribe(
      (result: any) => {
        this.rapportinoDto = result['rapportinoDto']['mese']['giorni'];
        this.note = result['rapportinoDto']['note'];
        this.giorniUtili = result['rapportinoDto']['giorniUtili'];
        this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];

        console.log(
          'RAPPORTINODTO DETTAGLIO:' + JSON.stringify(this.rapportinoDto)
        );
      },
      (error: any) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  resetNote() {
    this.note = null;
  }

  aggiungiNote() {
    let body = {
      rapportinoDto: {
        note: this.note,
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: this.anno,
        meseRequest: this.mese,
      },
    };
    console.log('BODY AGGIUNGI NOTE:' + JSON.stringify(body));

    this.rapportinoService.aggiungiNote(this.token, body).subscribe(
      (result: any) => {
        if (
          (result as any).esito.code !== 200 &&
          (result as any).esito.target === 'HTTP error code: 400'
        ) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Salvataggio delle note non riuscito:',
              message: 'Errore di validazione.', //(result as any).esito.target,
            },
          });
          console.error(result);
        } else {
          console.log('RESULT AGGIUNGI NOTE:' + JSON.stringify(result));
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Salvataggio delle note effettuato',
            },
          });
          this.router.navigate(['/lista-rapportini']);
        }
      },
      (error: any) => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            Image: '../../../../assets/images/logo.jpeg',
            title: 'Salvataggio delle note non riuscito:',
            message: JSON.stringify(error),
          },
        });
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
        this.idUtenteLoggato = response.anagraficaDto.anagrafica.id;
        console.log('ID USER LOGGATO: ' + JSON.stringify(this.idUtenteLoggato));

        if (this.idUtenteLoggato != this.id) {
          this.dettaglioSbagliato = true;
        } else {
          this.dettaglioSbagliato = false;
        }
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
} //fine classe

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
