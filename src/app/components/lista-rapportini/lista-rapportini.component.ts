import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../login/login-service';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { RapportinoService } from '../utente/rapportino.service';
import { ListaRapportiniService } from './lista-rapportini.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { ModaleDettaglioRapportinoComponent } from '../modale-dettaglio-rapportino/modale-dettaglio-rapportino.component';
import { RapportinoDataService } from '../modale-dettaglio-rapportino/RapportinoData.service';

@Component({
  selector: 'app-lista-rapportini',
  templateUrl: './lista-rapportini.component.html',
  styleUrls: ['./lista-rapportini.component.scss'],
})
export class ListaRapportiniComponent implements OnInit {
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  ruolo: any;

  elencoRapportiniFreezati: any[] = [];
  elencoRapportiniNonFreezati: any[] = [];
  checkFreeze = false;

  selectedAnno: any;
  selectedMese: any;
  currentDate = new Date();
  currentMonth: any;
  currentYear: any;
  codiceFiscale = '';
  note: any;
  anni: number[] = [];
  mesi: number[] = [];
  rapportinoDto: any;
  giorniUtili: any;
  giorniLavorati: any;
  selectedMeseRapportinoNonFreezato: any;
  selectedAnnoRapportinoNonFreezato: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private rapportinoService: RapportinoService,
    private listaRapportiniService: ListaRapportiniService,
    private rapportinoDataService: RapportinoDataService
  ) {}

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.getAllRapportiniNonFreezati();
      this.getAllRapportiniFreezati();
    }
  }

  getAllRapportiniNonFreezati() {
    this.listaRapportiniService
      .getAllRapportiniNonFreezati(this.token)
      .subscribe(
        (result: any) => {
          this.elencoRapportiniNonFreezati = result['list'];
          this.selectedMeseRapportinoNonFreezato = result['list']['mese'];
          this.selectedAnnoRapportinoNonFreezato = result['list']['anno'];
          console.log(
            'ELENCO RAPPORTINI NON FREEZATI:' +
              JSON.stringify(this.elencoRapportiniNonFreezati)
          );
        },
        (error: any) => {
          console.error(
            'Errore durante il caricamento dei rapportini not freeze: ' +
              JSON.stringify(error)
          );
        }
      );
  }

  getAllRapportiniFreezati() {
    this.listaRapportiniService.getAllRapportiniFreezati(this.token).subscribe(
      (result: any) => {
        this.elencoRapportiniFreezati = result['list'];
        console.log(
          'Rapportini freezati caricati: ' +
            JSON.stringify(this.elencoRapportiniFreezati)
        );
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il caricamento dei rapportini freezati: ' +
            JSON.stringify(error)
        );
      }
    );
  }

  eliminaRapportinoNonFreezato(id: number) {
    console.log(id);
  }

  eliminaRapportinoFreezato(index: number) {
    console.log(index);
  }

  onChangecheckFreeze(event: any, index: number) {
    const isChecked = event.target.checked;
    //console.log(`Valore del checkbox al rapportino numero ${index} è ${isChecked}`);

    if (isChecked) {
      const confirmation = window.confirm(
        'Sei sicuro di voler congelare il metodo?'
      );
      if (confirmation) {
        this.checkFreeze = isChecked;
        let body = {
          rapportino: {
            id: index,
            checkFreeze: this.checkFreeze,
          },
        };
        console.log('PAYLOAD CHECKFREEZE TRUE:' + JSON.stringify(body));

        this.listaRapportiniService
          .UpdateCheckFreeze(this.token, body)
          .subscribe(
            (result: any) => {
              console.log('RAPPORTINO CONGELATO:' + JSON.stringify(result));
              this.getAllRapportiniFreezati();
              this.getAllRapportiniNonFreezati();
            },
            (error: any) => {
              console.error(
                'Errore durante il congelamento del rapportino: ' +
                  JSON.stringify(error)
              );
            }
          );
      } else {
        //console.log('niente');
        // In questo caso, il checkbox non viene selezionato perché l'utente ha annullato la conferma.
        event.target.checked = false;
      }
    } else {
      const confirmation = window.confirm(
        'Sei sicuro di voler congelare il rapportino?'
      );
      if (confirmation) {
        //console.log('parte metodo false');
        this.checkFreeze = isChecked;
        let body = {
          rapportino: {
            id: index,
            checkFreeze: this.checkFreeze,
          },
        };
        console.log('PAYLOAD CHECKFREEZE FALSE :' + JSON.stringify(body));

        this.listaRapportiniService
          .UpdateCheckFreeze(this.token, body)
          .subscribe(
            (result: any) => {
              console.log('RAPPORTINO SCONGELATO:' + JSON.stringify(result));
              this.getAllRapportiniFreezati();
              this.getAllRapportiniNonFreezati();
            },
            (error: any) => {
              console.error(
                'Errore durante lo scongelamento del rapportino: ' +
                  JSON.stringify(error)
              );
            }
          );
      } else {
        console.log('niente');
        // In questo caso, il checkbox non viene deselezionato perché l'utente ha annullato la conferma.
        event.target.checked = true;
      }
    }
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
        annoRequest: this.selectedAnno,
        meseRequest: this.selectedMese,
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

  getRapportino(id: any, codiceFiscale:any, mese: any, anno: any) {
    console.log("DATI IN LISTA RAPPORTINI PER ROTTA"+id, mese, anno);
    this.router.navigate(['/dettaglio-rapportino', id, codiceFiscale, mese, anno]);
  }

  //metodi navbar

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.ruolo = response.anagraficaDto.ruolo.nome;
        this.codiceFiscale = response.anagraficaDto.anagrafica.codiceFiscale;
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
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));

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
        // console.log(
        //   JSON.stringify('DATI NAVBAR: ' + JSON.stringify(this.jsonData))
        // );
        this.shouldReloadPage = false;
      },
      (error: any) => {
        console.error('Errore nella generazione del menu:', error);
        this.shouldReloadPage = true;
        this.jsonData = { list: [] };
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
        // console.log('Permessi ottenuti:', data);
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
