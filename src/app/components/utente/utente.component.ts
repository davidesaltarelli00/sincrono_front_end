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
import { RapportinoService } from './rapportino.service';

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

  data: any[] = [];
  user: any;
  messaggio = '';
  currentDate = new Date();
  currentMonth: any;
  currentYear: any;
  id = this.activatedRoute.snapshot.params['id'];
  idUtenteLoggato: any;
  elencoCommesse: any;
  contratto: any;
  dettaglioSbagliato: any;
  rapportinoDto: any[] = [];
  @ViewChild('editableTable') editableTable!: ElementRef;

  modifiedData: any[] = [];
  anno: any;
  selectedAnno: number;
  selectedMese: number;
  anni: number[] = [];
  mesi: number[] = [];
  giorniUtili: any;
  giorniLavorati: any;
  note: any;
  anagrafica: any;
  esitoCorretto = false;
  rapportinoSalvato = false;
  rapportinoInviato = false;
  mobile: boolean = false;
  checkFreeze = false;

  nome: any;
  cognome: any;
  codiceFiscale = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private router: Router,
    private anagraficaDtoService: AnagraficaDtoService,
    private datePipe: DatePipe,
    private menuService: MenuService,
    private http: HttpClient,
    private rapportinoService: RapportinoService
  ) {
    const oggi = new Date();
    const annoCorrente = oggi.getFullYear();
    const meseCorrente = oggi.getMonth() + 1;

    for (let anno = 2010; anno <= annoCorrente; anno++) {
      this.anni.push(anno);
    }

    this.mesi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    this.selectedAnno = annoCorrente;
    this.selectedMese = meseCorrente;

    if (window.innerWidth >= 900) {
      // 768px portrait
      this.mobile = false;
    } else {
      this.mobile = true;
    }
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) == true
    ) {
      this.mobile = true;
    }
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.getAnagraficaRapportino();
      // this.getRapportinoByMeseAnnoCorrenti();
    } else {
      console.error('ERRORE DI AUTENTICAZIONE');
    }

    console.log('ANNI:' + JSON.stringify(this.anni));
    console.log('MESI:' + JSON.stringify(this.mesi));
  }

  duplicaRiga(index: number) {
    const rigaDaCopiare = this.rapportinoDto[index];
    const nuovaRiga = { ...rigaDaCopiare };
    // Inserisci la nuova riga subito sotto all'indice attuale
    this.rapportinoDto.splice(index + 1, 0, nuovaRiga);
  }

  eliminaRigaDuplicata(index: number) {
    // Rimuovi la riga dalla matrice rapportinoDto in base all'indice
    this.rapportinoDto.splice(index, 1);

    // Verifica se la riga successiva è duplicata (non la prima occorrenza)
    if (
      index < this.rapportinoDto.length - 1 &&
      this.rapportinoDto[index] === this.rapportinoDto[index + 1]
    ) {
      // Rimuovi la riga duplicata
      this.rapportinoDto.splice(index + 1, 1);
    }
  }

  eliminaRapportino() {
    this.rapportinoDto = [];
    this.esitoCorretto = false;
  }

  getRapportinoByMeseAnnoCorrenti() {
    //carica il rapportino del mese e anno corrente ma non funziona

    const oggi = new Date();
    const annoCorrente = oggi.getFullYear();
    const meseCorrente = oggi.getMonth() + 1;

    for (let anno = 2010; anno <= annoCorrente; anno++) {
      this.anni.push(anno);
    }

    this.mesi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    this.selectedAnno = annoCorrente;
    this.selectedMese = meseCorrente;
    let body = {
      rapportinoDto: {
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: annoCorrente,
        meseRequest: meseCorrente,
      },
    };
    console.log('BODY PER GET RAPPORTINO:' + JSON.stringify(body));
    this.rapportinoService.getRapportino(this.token, body).subscribe(
      (result: any) => {
        if ((result as any).esito.code !== 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Caricamento non riuscito:',
              message: (result as any).esito.target,
            },
          });
        } else {
          this.esitoCorretto = true;
          this.rapportinoDto = result['rapportinoDto']['mese']['giorni'];
          this.note = result['rapportinoDto']['note'];
          this.giorniUtili = result['rapportinoDto']['giorniUtili'];
          this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];
        }
      },
      (error: string) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  getAnagraficaRapportino() {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.user = (resp as any)['anagraficaDto'];
          this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
          this.contratto = (resp as any)['anagraficaDto']['contratto'];
          this.codiceFiscale = (resp as any)['anagraficaDto']['anagrafica'][
            'codiceFiscale'
          ];
          this.dettaglioSbagliato = false;
          console.log('DETTAGLIO USER ' + JSON.stringify(this.user));
          console.log('CODICE FISCALE:' + this.codiceFiscale);
          console.log(' \n ELENCO COMMESSE:' + JSON.stringify(this.elencoCommesse));
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
    let body = {
      rapportinoDto: {
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: this.selectedAnno,
        meseRequest: this.selectedMese,
      },
    };
    console.log('BODY PER GET RAPPORTINO:' + JSON.stringify(body));
    this.rapportinoService.getRapportino(this.token, body).subscribe(
      (result: any) => {
        if ((result as any).esito.code !== 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Caricamento non riuscito:',
              message: (result as any).esito.target,
            },
          });
        } else {
          this.esitoCorretto = true;
          this.rapportinoDto = result['rapportinoDto']['mese']['giorni'];
          this.note = result['rapportinoDto']['note'];
          this.giorniUtili = result['rapportinoDto']['giorniUtili'];
          this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];
        }
      },
      (error: string) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  inviaRapportino() {
    const giorniArray = [];

    const tableRows =
      this.editableTable.nativeElement.getElementsByTagName('tr');
    for (let i = 1; i < tableRows.length; i++) {
      const row = tableRows[i];
      const giorno = row.cells[0].innerText;
      const cliente = row.cells[1].innerText;
      const oreOrdinarie = row.cells[2].innerText;
      // Dividi il campo cliente in un array di stringhe
      const clientiArray = cliente ? cliente.split(',') : null;
      // Dividi il campo oreOrdinarie in un array di stringhe
      const oreOrdinarieArray = oreOrdinarie.split(',');

      giorniArray.push({
        giorno: parseInt(giorno), // Converte il giorno in un numero intero
        cliente: clientiArray,
        oreOrdinarie: oreOrdinarieArray.map(parseFloat), // Converte le ore in numeri decimali
      });
    }
    let body = {
      rapportino: {
        nome: this.userLoggedName,
        cognome: this.userLoggedSurname,
        codiceFiscale: this.codiceFiscale,
        anno: this.selectedAnno,
        mese: this.selectedMese,
        checkFreeze: this.checkFreeze,
      },
    };
    console.log('PAYLOAD PER INSERT RAPPORTINO:' + JSON.stringify(body));
    this.rapportinoService
      .insertRapportino(this.token, body)
      .subscribe((result: any) => {
        if (
          (result as any).esito.code !== 200 &&
          (result as any).esito.target === 'HTTP error code: 400'
        ) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Invio non riuscito:',
              message: 'Errore di validazione.', //(result as any).esito.target,
            },
          });
          this.rapportinoInviato=false;
          console.error(result);
        }
        if ((result as any).esito.code === 500) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Invio non riuscito:',
              message: 'Errore del server:' + (result as any).esito.target, //(result as any).esito.target,
            },
          });
          this.rapportinoInviato=false;

          console.error(result);
        }
        if ((result as any).esito.code === 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Invio riuscito.',
              message: (result as any).esito.target,
            },
          });
          console.log('RESPONSE INSERT RAPPORTINO:' + JSON.stringify(result));
          this.rapportinoInviato=true;
        }
      });
  }

  salvaRapportino() {
    const giorniArray = [];

    const tableRows =
      this.editableTable.nativeElement.getElementsByTagName('tr');
    for (let i = 1; i < tableRows.length; i++) {
      const row = tableRows[i];
      const giorno = row.cells[0].innerText;
      const cliente = row.cells[1].innerText;
      const oreOrdinarie = row.cells[2].innerText;
      // Dividi il campo cliente in un array di stringhe
      const clientiArray = cliente ? cliente.split(',') : null;
      // Dividi il campo oreOrdinarie in un array di stringhe
      const oreOrdinarieArray = oreOrdinarie.split(',');

      giorniArray.push({
        giorno: parseInt(giorno), // Converte il giorno in un numero intero
        cliente: clientiArray,
        oreOrdinarie: oreOrdinarieArray.map(parseFloat), // Converte le ore in numeri decimali
      });
    }

    // Crea il corpo del JSON
    const body = {
      rapportinoDto: {
        mese: {
          giorni: giorniArray,
        },
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        note: this.note,
        giorniUtili: this.giorniUtili,
        giorniLavorati: this.giorniLavorati,
        annoRequest: this.selectedAnno,
        meseRequest: this.selectedMese,
      },
    };

    console.log('BODY UPDATE RAPPORTINO:' + JSON.stringify(body));
    this.rapportinoService
      .updateRapportino(localStorage.getItem('token'), body)
      .subscribe(
        (result: any) => {
          if (
            (result as any).esito.code !== 200 &&
            (result as any).esito.target === 'HTTP error code: 400'
          ) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                Image: '../../../../assets/images/logo.jpeg',
                title: 'Salvataggio non riuscito:',
                message: 'Errore di validazione.', //(result as any).esito.target,
              },
            });
            this.rapportinoSalvato = false;
            console.error(result);
          }
          if ((result as any).esito.code === 500) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                Image: '../../../../assets/images/logo.jpeg',
                title: 'Salvataggio non riuscito:',
                message: 'Errore del server.', //(result as any).esito.target,
              },
            });
            console.error(result);
            this.rapportinoSalvato = false;
          }

          if ((result as any).esito.code === 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Salvataggio riuscito.',
                message: (result as any).esito.target,
              },
            });
            this.rapportinoSalvato = true;
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

  onMeseSelectChange(event: any) {
    console.log('Mese selezionato:', event.target.value);
  }

  onAnnoSelectChange(event: any) {
    console.log('Anno selezionato:', event.target.value);
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
