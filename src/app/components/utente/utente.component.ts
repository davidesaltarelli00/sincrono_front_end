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
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
  tabellaEditabile: string = 'true';
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
  aziendeClienti: any[] = [];
  aziendaSelezionata: string = '';
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
  tabellaCompletata: boolean = false;
  etichetteFasce = ['18:00 - 20:00', '20:00 - 22:00', '22:00 - 09:00'];
  nome: any;
  cognome: any;
  codiceFiscale = '';
  numeroCommessePresenti: any;
  duplicazioniEffettuate: number[] = [];
  disabilitaDuplica = false;
  nomiMesi = [
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
  numeroRigheDuplicate: number = 0;
  conteggioDuplicati: { [giorno: number]: number } = {};
  straordinari: any[] = [];

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

  duplicaRiga(index: number) {
    // Ottieni il "giorno" dalla riga selezionata
    const giornoDaDuplicare = this.rapportinoDto[index].giorno;

    // Verifica il conteggio delle duplicazioni per il "giorno" selezionato
    const conteggio = this.conteggioDuplicati[giornoDaDuplicare] || 0;

    // Verifica se è possibile duplicare una riga in più per questo "giorno"
    if (conteggio < this.elencoCommesse.length - 1) {
      // Crea una nuova riga con il campo "giorno" impostato
      const nuovaRiga = {
        giorno: giornoDaDuplicare,
        cliente: [],
        oreOrdinarie: [],
      };

      // Aggiungi la nuova riga alla fine dell'array
      this.rapportinoDto.push(nuovaRiga);

      // Incrementa il conteggio delle duplicazioni per il "giorno"
      this.conteggioDuplicati[giornoDaDuplicare] = conteggio + 1;

      // Disabilita il pulsante se il numero di duplicazioni per questo "giorno" raggiunge il massimo
      if (conteggio + 1 === this.elencoCommesse.length - 1) {
        // Disabilita il pulsante "Duplica Riga"
        this.disabilitaDuplica = true;
      }
    }
  }

  getCommesseIndices(numeroCommesse: number): number[] {
    return new Array(numeroCommesse);
  }

  nomeMeseDaNumero(numeroMese: number): string {
    if (numeroMese >= 1 && numeroMese <= 12) {
      return this.nomiMesi[numeroMese - 1]; // Sottrai 1 perché gli array sono zero-based
    } else {
      return 'Mese non valido'; // Gestisci il caso in cui il numero del mese non sia valido
    }
  }

  getNomeGiorno(numeroGiorno: number | null): any {
    if (numeroGiorno === null) {
      return ''; // Imposta una stringa vuota se il valore è null
    }

    const oggi = new Date();
    const annoCorrente = oggi.getFullYear();
    const meseCorrente = oggi.getMonth() + 1;

    const data = new Date(annoCorrente, meseCorrente - 1, numeroGiorno); // Sottrai 1 al mese perché JavaScript inizia da 0 per gennaio
    const nomeGiorno = this.datePipe.transform(data, 'EEEE'); // 'EEEE' restituirà il nome completo del giorno della settimana

    return nomeGiorno;
  }

  isWeekend(index: number): boolean {
    const numeroGiorno = index;
    const nomeGiorno = this.getNomeGiorno(numeroGiorno);

    return nomeGiorno === 'Saturday' || nomeGiorno === 'Sunday';
  }

  selezionaAzienda() {
    console.log('Azienda selezionata:', this.aziendaSelezionata);
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
  }

  verificaTabellaCompletata() {
    const tableRows =
      this.editableTable.nativeElement.getElementsByTagName('tr');
    let tabellaCompleta = true;
    console.log('Controllo se la tabella é completa...');
    for (let i = 1; i < tableRows.length; i++) {
      const row = tableRows[i];
      const giorno = row.cells[0].innerText;
      const cliente = row.cells[1].innerText;
      const oreOrdinarie = row.cells[2].innerText;

      if (!giorno || !cliente || !oreOrdinarie) {
        tabellaCompleta = false;
        break;
      }
    }

    this.tabellaCompletata = tabellaCompleta;
    console.log('Esito tabella completa: ' + this.tabellaCompletata);
  }

  checkRapportinoInviato() {
    let body = {
      anno: this.selectedAnno,
      mese: this.selectedMese,
      codiceFiscale: this.codiceFiscale,
    };
    this.rapportinoService
      .checkRapportinoInviato(this.token, body)
      .subscribe((result: any) => {
        console.log(
          'RISULTATO checkRapportinoInviato:' + JSON.stringify(result)
        );
      });
  }

  isRigaVuota(index: number): boolean {
    const riga = this.rapportinoDto[index];
    return !riga || !riga.giorno;
  }

  eliminaRiga(index: number) {
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

  salvaAziendeClienti() {
    this.elencoCommesse.forEach((commessa: any) => {
      if (commessa.tipoAzienda.descrizione) {
        this.aziendeClienti.push(commessa.tipoAzienda.descrizione);
        console.log('Aziende clienti: ' + JSON.stringify(this.aziendeClienti));
      }
    });
  }

  getNomeGiornoSettimana(data: string): string {
    const giorniSettimana = [
      'Domenica',
      'Lunedì',
      'Martedì',
      'Mercoledì',
      'Giovedì',
      'Venerdì',
      'Sabato',
    ];
    const dataSelezionata = new Date(data);
    const nomeGiorno = giorniSettimana[dataSelezionata.getDay()];

    return nomeGiorno;
  }

  getAnagraficaRapportino() {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.user = (resp as any)['anagraficaDto'];
          this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
          this.salvaAziendeClienti();
          this.contratto = (resp as any)['anagraficaDto']['contratto'];
          this.codiceFiscale = (resp as any)['anagraficaDto']['anagrafica'][
            'codiceFiscale'
          ];
          this.dettaglioSbagliato = false;
          this.numeroCommessePresenti = this.elencoCommesse.length;
          console.log('Dati restituiti: ' + JSON.stringify(resp));
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
          console.log('Dati get all rapportino:' + JSON.stringify(result));
          this.straordinari = result['rapportinoDto']['mese']['giorni'].map((giorno: any) => giorno.straordinari);
          console.log('STRAORDINARI:' + JSON.stringify(this.straordinari));
          this.giorniUtili = result['rapportinoDto']['giorniUtili'];
          console.log('GIORNI UTILI:' + JSON.stringify(this.giorniUtili));
          this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];
          console.log('GIORNI LAVORATI:' + JSON.stringify(this.giorniLavorati));
          for (let i = 0; i < this.rapportinoDto.length; i++) {
            const giorno = this.rapportinoDto[i];
            if (!giorno.straordinari) {
              giorno.straordinari = [null, null, null];
            } else if (giorno.straordinari.length < 3) {
              while (giorno.straordinari.length < 3) {
                giorno.straordinari.push(null);
              }
            }
            if (!giorno.cliente) {
              giorno.cliente = [];
            }
          }

          //qui andrá l endpoint per verificare la completezza della tabella
          this.checkRapportinoInviato();
        }
      },
      (error: string) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  inviaRapportino() {
    // const giorniArray = [];
    // let isDataValid = true;
    // const tableRows =
    //   this.editableTable.nativeElement.getElementsByTagName('tr');
    // for (let i = 1; i < tableRows.length; i++) {
    //   const row = tableRows[i];
    //   const giorno = row.cells[0].innerText;
    //   const cliente = row.cells[1].innerText;
    //   const oreOrdinarie = row.cells[2].innerText;
    //   // Dividi il campo cliente in un array di stringhe
    //   const clientiArray = cliente ? cliente.split(',') : null;
    //   // Dividi il campo oreOrdinarie in un array di stringhe
    //   const oreOrdinarieArray = oreOrdinarie.split(',');

    //   giorniArray.push({
    //     giorno: parseInt(giorno), // Converte il giorno in un numero intero
    //     cliente: clientiArray,
    //     oreOrdinarie: oreOrdinarieArray.map(parseFloat), // Converte le ore in numeri decimali
    //   });
    // }
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
          this.rapportinoInviato = false;
          console.error(result);
          this.tabellaEditabile = 'true';
        }
        if ((result as any).esito.code === 500) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Invio non riuscito:',
              message: 'Errore del server:' + (result as any).esito.target, //(result as any).esito.target,
            },
          });
          this.rapportinoInviato = false;
          this.tabellaEditabile = 'true';
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
          this.rapportinoInviato = true;
          this.tabellaEditabile = 'false';
        }
      });
  }

  salvaRapportino(formValue: any) {
    const giorniArray = this.rapportinoDto.map((giorno, i) => {
      const clienteValue = formValue[`cliente${i}`];
      const oreOrdinarieValue = formValue[`oreOrdinarie${i}`];
      // const straordinariValue=formValue[``]; //array di oggetti che contiene 3 attributi: fascia1 fascia2 fascia3 (double)

      return {
        giorno: formValue[`giorno${i}`],
        cliente: Array.isArray(clienteValue)
          ? clienteValue
          : clienteValue
          ? [clienteValue]
          : null,
        oreOrdinarie: Array.isArray(oreOrdinarieValue)
          ? oreOrdinarieValue
          : oreOrdinarieValue
          ? [oreOrdinarieValue]
          : null,
      };
    });

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

    // console.log('BODY UPDATE RAPPORTINO:' + JSON.stringify(body));
    this.rapportinoService
      .updateRapportino(localStorage.getItem('token'), body)
      .subscribe(
        (result: any) => {
          if ((result as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                Image: '../../../../assets/images/logo.jpeg',
                title: 'Salvataggio non riuscito:',
                message: (result as any).esito.target,
              },
            });
            this.rapportinoSalvato = false;
            console.error(result);
          }
          if ((result as any).esito.code === 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Salvataggio riuscito.',
                message: (result as any).esito.target,
              },
            });
            console.log(JSON.stringify(result));
            if (this.tabellaCompletata) {
              this.rapportinoSalvato = true;
            } else {
              this.rapportinoSalvato = false;
            }
          }
        },
        (error: any) => {
          console.error(
            'Errore durante l invio del rapportino: ' + JSON.stringify(error)
          );
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
      (data: any) => {},
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  // validaValore(event: Event) {
  //   const target = event.target as HTMLTableCellElement;
  //   const value = target.innerText.trim(); // Ottieni il valore senza spazi bianchi

  //   // Verifica se il valore è un numero e rientra nell'intervallo consentito
  //   const valoreNumerico = parseInt(value, 10);

  //   if (
  //     !isNaN(valoreNumerico) &&
  //     valoreNumerico >= 1 &&
  //     valoreNumerico <= this.rapportinoDto.length
  //   ) {
  //     // Il valore è valido, puoi aggiornare il tuo modello qui se necessario
  //     // E.g., giornaliero.giorno = valoreNumerico;
  //   } else {
  //     // Il valore non è valido, puoi gestire l'errore in qualche modo
  //     // E.g., reimposta il valore precedente o visualizza un messaggio di errore
  //     target.innerText = ''; // Oppure, puoi reimpostare il valore precedente
  //     const dialogRef = this.dialog.open(AlertDialogComponent, {
  //       data: {
  //         Image: '../../../../assets/images/logo.jpeg',
  //         title: 'Attenzione:',
  //         message:
  //           'Il valore deve essere un numero compreso tra 1 e ' +
  //           this.rapportinoDto.length,
  //       },
  //     });
  //   }
  // }

  // validaValoreTestuale(event: Event) {
  //   const target = event.target as HTMLTableCellElement;
  //   const value = target.innerText.trim(); // Ottieni il valore senza spazi bianchi

  //   // Verifica se il valore contiene numeri
  //   if (/\d/.test(value)) {
  //     // Il valore contiene numeri, impedisci l'input
  //     target.innerText = ''; // Oppure, puoi reimpostare il valore precedente
  //     const dialogRef = this.dialog.open(AlertDialogComponent, {
  //       data: {
  //         Image: '../../../../assets/images/logo.jpeg',
  //         title: 'Attenzione:',
  //         message: 'Il campo cliente non deve contenere numeri.',
  //       },
  //     });
  //   } else {
  //     console.log('Inserito il cliente ' + target.innerText);
  //   }
  // }

  // validaOreOrdinarie(event: Event) {
  //   const target = event.target as HTMLTableCellElement;
  //   const value = target.innerText.trim(); // Ottieni il valore senza spazi bianchi

  //   // Verifica se il valore è un numero con incrementi di 0.5 tra 0 e 24
  //   const valoreNumerico = parseFloat(value);

  //   if (
  //     isNaN(valoreNumerico) ||
  //     valoreNumerico < 0 ||
  //     valoreNumerico > 24 ||
  //     valoreNumerico % 0.5 !== 0
  //   ) {
  //     target.innerText = '';
  //     const dialogRef = this.dialog.open(AlertDialogComponent, {
  //       data: {
  //         Image: '../../../../assets/images/logo.jpeg',
  //         title: 'Attenzione:',
  //         message:
  //           'Il campo deve essere un numero con incrementi di 0.5 compreso tra 0 e 24.',
  //       },
  //     });
  //   } else {
  //   }
  // }
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
