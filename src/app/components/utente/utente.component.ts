import { DatePipe, ViewportScroller } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import * as XLSX from 'xlsx';
import { MenuService } from '../menu.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { RapportinoService } from './rapportino.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Giorno } from './giorno';
import { AuthService } from '../login/login-service';

@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss'],
})
export class UtenteComponent implements OnInit {
  userLoggedName: any;
  userLoggedSurname: any;
  aziendaSelezionata: any;
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
  filteredAziendeClienti: string[] = [];
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
  giorni = [
    'Lunedí',
    'Martedí',
    'Mercoledí',
    'Giovedí',
    'Venerdí',
    'Sabato',
    'Domenica',
  ];

  day: any;
  numeroRigheDuplicate: number = 0;
  conteggioDuplicati: { [giorno: number]: number } = {};
  straordinari: any[] = [];
  giorno: any = {
    cliente: '',
  };
  showError: boolean = false;
  duplicazioniGiornoDto: any[] = [];
  idUtente: any;
  error: any;
  checkstraordinari = false;
  giorniSettimana: string[] = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
    'Domenica',
  ];
  risultatoCheckFreeze: any;
  //totali
  totaleOreLavorate: any;
  totaleStraordinari: any;
  totaleFerie: any;
  totaleMalattia: any;
  totaleOrePermessi: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private router: Router,
    private anagraficaDtoService: AnagraficaDtoService,
    private datePipe: DatePipe,
    private menuService: MenuService,
    private http: HttpClient,
    private rapportinoService: RapportinoService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private authSerice: AuthService,
    private scroller: ViewportScroller,
    private cdRef: ChangeDetectorRef
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

  filterOptions() {
    this.filteredAziendeClienti = this.aziendeClienti.filter((azienda) =>
      azienda.toLowerCase().includes(this.giorno.cliente.toLowerCase())
    );
    this.showError = false; // Resetta l'errore quando l'utente inizia a digitare
  }

  toggleCheckStraordinari(duplicazione: any) {
    duplicazione.checkstraordinari = !duplicazione.checkstraordinari;
  }

  selectAzienda(azienda: string) {
    if (this.aziendeClienti.includes(azienda)) {
      this.giorno.cliente = azienda;
      this.filteredAziendeClienti = []; // Nascondi i suggerimenti dopo la selezione
      this.showError = false; // Resetta l'errore
    } else {
      this.showError = true; // Mostra l'errore se il valore non è valido
    }
  }

  eliminaRiga(index: number, j: number) {
    if (this.rapportinoDto[index].duplicazioniGiornoDto.length != 1) {
      this.rapportinoDto[index].duplicazioniGiornoDto.splice(j, 1);
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          Image: '../../../../assets/images/logo.jpeg',
          title: 'Non puoi eliminare la riga principale.',
        },
      });
    }
  }

  duplicaRiga(index: number, j: number) {
    console.log(
      'lunghezza rapportino:' +
        this.rapportinoDto[index].duplicazioniGiornoDto.length
    );

    if (
      this.rapportinoDto[index].duplicazioniGiornoDto.length ===
      this.numeroCommessePresenti
    ) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          Image: '../../../../assets/images/logo.jpeg',
          title:
            'Non puoi duplicare la riga perché hai solo ' +
            this.aziendeClienti.length +
            ' aziende clienti',
        },
      });
    } else {
      const copiaGiorno = JSON.parse(
        JSON.stringify(this.rapportinoDto[index].duplicazioniGiornoDto[j])
      );
      this.rapportinoDto[index].duplicazioniGiornoDto.splice(
        index + 1,
        0,
        copiaGiorno
      );
    }

    //itero tutto il rapportino
    // for (
    //   let y = 0;
    //   y < this.rapportinoDto[i].duplicazioniGiornoDto.length;
    //   y++
    // ) {
    //   //itero tutti i giorni duplicati
    //   if (
    //     this.rapportinoDto[index].duplicazioniGiornoDto[0].giorno ==
    //     this.rapportinoDto[i].duplicazioniGiornoDto[y].giorno
    //   ) {
    //     count++;
    //   }
    // }
  }

  trackByFn(index: number, item: any): number {
    return index;
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
    let nomeGiorno = this.datePipe.transform(data, 'EEEE'); // 'EEEE' restituirà il nome completo del giorno della settimana
    if (nomeGiorno === 'Sunday') {
      nomeGiorno = 'Domenica';
      this.day = nomeGiorno;
    }
    if (nomeGiorno === 'Monday') {
      nomeGiorno = 'Lunedí';
      this.day = nomeGiorno;
    }
    if (nomeGiorno === 'Tuesday') {
      nomeGiorno = 'Martedí';
      this.day = nomeGiorno;
    }
    if (nomeGiorno === 'Wednesday') {
      nomeGiorno = 'Mercoledí';
      this.day = nomeGiorno;
    }
    if (nomeGiorno === 'Thursday') {
      nomeGiorno = 'Giovedí';
      this.day = nomeGiorno;
    }
    if (nomeGiorno === 'Friday') {
      nomeGiorno = 'Venerdí';
      this.day = nomeGiorno;
    }
    if (nomeGiorno === 'Saturday') {
      nomeGiorno = 'Sabato';
      this.day = nomeGiorno;
    }
    return nomeGiorno;
  }

  selezionaAzienda(event: any) {
    this.aziendaSelezionata = event.target.value;
    console.log('Selezionata azienda ' + this.aziendaSelezionata);
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.getAnagraficaRapportino();
    } else {
      if (this.error.status === 403) {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            Image: '../../../../assets/images/logo.jpeg',
            title: 'Errore di autenticazione:',
            message: 'Effettua il login.',
          },
        });
        this.authSerice.logout();
      }
    }
  }

  onChangeFerie(event: any, i: number) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      const oreElement = document.getElementById(
        `ore-ordinarie-${i}`
      ) as HTMLInputElement;
      const malattieElement = document.getElementById(
        `malattie-${i}`
      ) as HTMLInputElement;
      const fascia1Element = document.getElementById(
        `fascia1-${i}`
      ) as HTMLInputElement;
      const fascia2Element = document.getElementById(
        `fascia2-${i}`
      ) as HTMLInputElement;
      const fascia3Element = document.getElementById(
        `fascia3-${i}`
      ) as HTMLInputElement;
      const permessiElement = document.getElementById(
        `permessi-${i}`
      ) as HTMLInputElement;
      const giornoElement = document.getElementById(
        `giorno-${i}`
      ) as HTMLInputElement;
      const clienteElement = document.getElementById(
        `cliente-${i}`
      ) as HTMLSelectElement;
      const noteElement = document.getElementById(
        `note-${i}`
      ) as HTMLInputElement;

      if (isChecked) {
        // Quando ferie è true, disabilita i campi e imposta valore null se necessario
        oreElement.disabled = true;
        malattieElement.disabled = true;
        fascia1Element.disabled = true;
        fascia2Element.disabled = true;
        fascia3Element.disabled = true;
        permessiElement.disabled = true;
        oreElement.value = '';
        malattieElement.checked = false;
        fascia1Element.value = '';
        fascia2Element.value = '';
        fascia3Element.value = '';
        permessiElement.value = '';

        // Abilita i campi obbligatori
        giornoElement.required = true;
        clienteElement.required = true;
        noteElement.required = true;
        // Disabilita i campi obbligatori
        oreElement.required = false;
        noteElement.disabled = false;
        noteElement.required = false;
        noteElement.disabled = true;
      } else {
        // Quando ferie è false, reimposta i campi come necessario
        oreElement.disabled = false;
        malattieElement.disabled = false;
        fascia1Element.disabled = false;
        fascia2Element.disabled = false;
        fascia3Element.disabled = false;
        permessiElement.disabled = false;
        noteElement.disabled = false;
        noteElement.required = true;
        noteElement.disabled = false;
        // Rimuovi obbligatorietà
        giornoElement.required = false;
        clienteElement.required = false;
      }
    }
  }

  isWeekend(giorno: string): any {
    return giorno === 'Sabato' || giorno === 'Domenica';
  }

  onChangeMalattia(event: any, i: number) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      const oreElement = document.getElementById(
        `ore-ordinarie-${i}`
      ) as HTMLInputElement;
      const ferieElement = document.getElementById(
        `ferie-${i}`
      ) as HTMLInputElement;
      const malattieElement = document.getElementById(
        `malattie-${i}`
      ) as HTMLInputElement;
      const fascia1Element = document.getElementById(
        `fascia1-${i}`
      ) as HTMLInputElement;
      const fascia2Element = document.getElementById(
        `fascia2-${i}`
      ) as HTMLInputElement;
      const fascia3Element = document.getElementById(
        `fascia3-${i}`
      ) as HTMLInputElement;
      const permessiElement = document.getElementById(
        `permessi-${i}`
      ) as HTMLInputElement;
      const giornoElement = document.getElementById(
        `giorno-${i}`
      ) as HTMLInputElement;
      const clienteElement = document.getElementById(
        `cliente-${i}`
      ) as HTMLSelectElement;
      const noteElement = document.getElementById(
        `note-${i}`
      ) as HTMLInputElement;
      if (isChecked) {
        giornoElement.disabled = false;
        giornoElement.required = true;

        clienteElement.disabled = true;
        clienteElement.required = false;
        clienteElement.value = '';

        oreElement.disabled = true;
        oreElement.required = false;
        oreElement.value = '';

        fascia1Element.value = '';
        fascia1Element.disabled = true;

        fascia2Element.value = '';
        fascia2Element.disabled = true;

        fascia3Element.value = '';
        fascia3Element.disabled = true;

        ferieElement.checked = false;
        ferieElement.disabled = true;
        ferieElement.required = false;

        permessiElement.required = false;
        permessiElement.value = '';
        permessiElement.disabled = true;

        noteElement.disabled = false;
        noteElement.required = false;
        noteElement.disabled = true;
      } else {
        giornoElement.disabled = false;
        giornoElement.required = true;

        clienteElement.disabled = false;
        clienteElement.required = true;
        clienteElement.value = '';

        oreElement.disabled = false;
        oreElement.required = true;
        oreElement.value = '';

        fascia1Element.value = '';
        fascia1Element.disabled = false;

        fascia2Element.value = '';
        fascia2Element.disabled = false;

        fascia3Element.value = '';
        fascia3Element.disabled = false;

        ferieElement.checked = false;
        ferieElement.disabled = false;
        ferieElement.required = false;

        permessiElement.required = false;
        permessiElement.value = '';
        permessiElement.disabled = false;

        noteElement.disabled = false;
        noteElement.required = false;
        noteElement.disabled = false;
      }
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
        if ((result as any).esito.code == 200) {
          console.log('RESULT CHECKFREEZE: ' + JSON.stringify(result));
          this.risultatoCheckFreeze = result['checkInviato'];
          console.log(this.risultatoCheckFreeze);
          this.rapportinoInviato = true;
        } else {
          console.log('RESULT CHECKFREEZE: ' + JSON.stringify(result));
          this.risultatoCheckFreeze = result['checkInviato'];
          console.log(this.risultatoCheckFreeze);
          this.rapportinoInviato = false;
        }
      });
  }

  isRigaVuota(index: number): boolean {
    const riga = this.rapportinoDto[index];
    return !riga || !riga.giorno;
  }

  eliminaRapportino() {
    this.rapportinoDto = [];
    this.esitoCorretto = false;
  }

  salvaAziendeClienti() {
    this.elencoCommesse.forEach((commessa: any) => {
      if (commessa.tipoAziendaCliente.descrizione) {
        this.aziendeClienti.push(commessa.tipoAziendaCliente.descrizione);
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
          // console.log('Dati restituiti: ' + JSON.stringify(resp));
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
          this.duplicazioniGiornoDto =
            result['rapportinoDto']['mese']['giorni']['duplicazioniGiornoDto'];
          this.giorniUtili = result['rapportinoDto']['giorniUtili'];
          this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];
          this.note = result['rapportinoDto']['note'];
          // console.log(
          //   'Dati get rapportino:' + JSON.stringify(this.rapportinoDto)
          // );
          this.checkRapportinoInviato();
          this.calcolaTotaleOreLavorate();
          this.calcolaTotaleStraordinari();
          this.calcolaTotaleFerie();
          this.calcolaTotaleMalattia();
          this.calcolaTotaleOrePermessi();
          this.cdRef.detectChanges();

          if (this.note != null) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                Image: '../../../../assets/images/logo.jpeg',
                title: 'Attenzione:',
                message: this.note,
              },
            });
          }
        }
      },
      (error: string) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  goDown() {
    document.getElementById('finePagina')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  goTop() {
    document.getElementById('inizioPagina')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  // this.rapportinoDto = result;//['rapportinoDto']['mese']['giorni'];
  // this.straordinari = result['rapportinoDto']['mese']['giorni'].map((giorno: any) => giorno.straordinari);
  // console.log('STRAORDINARI:' + JSON.stringify(this.straordinari));
  // this.giorniUtili = result['rapportinoDto']['giorniUtili'];
  // console.log('GIORNI UTILI:' + JSON.stringify(this.giorniUtili));
  // this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];
  // console.log('GIORNI LAVORATI:' + JSON.stringify(this.giorniLavorati));
  // for (let i = 0; i < this.rapportinoDto.length; i++) {
  //   const giorno = this.rapportinoDto[i];
  //   if (!giorno.straordinari) {
  //     giorno.straordinari = [null, null, null];
  //   } else if (giorno.straordinari.length < 3) {
  //     while (giorno.straordinari.length < 3) {
  //       giorno.straordinari.push(null);
  //     }
  //   }
  //   if (!giorno.cliente) {
  //     giorno.cliente = [];
  //   }
  // }

  //qui andrá l endpoint per verificare la completezza della tabella

  handleInput(event: any) {
    event.target.value = parseFloat(event.target.value).toFixed(1);
  }

  inviaRapportino() {
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
    console.log(formValue.value);

    const giorni = this.rapportinoDto.map((giorno) => {
      return {
        duplicazioniGiornoDto: giorno.duplicazioniGiornoDto.map(
          (duplicazione: any) => {
            return {
              // giorno: duplicazione.giorno,
              cliente: duplicazione.cliente,
              oreOrdinarie: duplicazione.oreOrdinarie,
              fascia1: duplicazione.fascia1,
              fascia2: duplicazione.fascia2,
              fascia3: duplicazione.fascia3,
            };
          }
        ),
        ferie: giorno.ferie,
        malattie: giorno.malattie,
        permessi: giorno.permessi,
        note: giorno.note,
        numeroGiorno: giorno.numeroGiorno,
        nomeGiorno: giorno.nomeGiorno,
      };
    });

    const body = {
      rapportinoDto: {
        mese: {
          giorni: giorni,
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

    console.log('BODY PER UPDATE RAPPORTINO:' + JSON.stringify(body));

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
            this.getRapportino();
            if (this.tabellaCompletata) {
              this.rapportinoSalvato = true;
            } else {
              this.rapportinoSalvato = false;
            }
          }
        },
        (error: any) => {
          console.error(
            'Errore durante il salvataggio del rapportino: ' +
              JSON.stringify(error)
          );
        }
      );
  }

  salvaRigaRapportino(formValue: any) {
    console.log(formValue.value);

    const giorni = this.rapportinoDto.map((giorno) => {
      return {
        duplicazioniGiornoDto: giorno.duplicazioniGiornoDto.map(
          (duplicazione: any) => {
            return {
              // giorno: duplicazione.giorno,
              cliente: duplicazione.cliente,
              oreOrdinarie: duplicazione.oreOrdinarie,
              fascia1: duplicazione.fascia1,
              fascia2: duplicazione.fascia2,
              fascia3: duplicazione.fascia3,
            };
          }
        ),
        ferie: giorno.ferie,
        malattie: giorno.malattie,
        permessi: giorno.permessi,
        note: giorno.note,
        numeroGiorno: giorno.numeroGiorno,
        nomeGiorno: giorno.nomeGiorno,
      };
    });

    const body = {
      rapportinoDto: {
        mese: {
          giorni: giorni,
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
    console.log(JSON.stringify(body));
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
                title: 'Cella salvata correttamente.',
                message: (result as any).esito.target,
              },
            });
            this.getRapportino();
          }
          if ((result as any).esito.target === 'HTTP error code: 400') {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Hai inserito un valore non valido.',
                message: 'Controlla e riprova.',
              },
            });
            this.getRapportino();
          }
        },
        (error: any) => {
          console.error(
            'Errore durante il salvataggio della riga: ' + JSON.stringify(error)
          );
        }
      );
  }

  isValidOreOrdinarie(value: number) {
    return value >= 0.5 && value <= 8;
  }

  calcolaTotaleOreLavorate() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      for (const duplicazione of giorno.duplicazioniGiornoDto) {
        if (duplicazione.oreOrdinarie) {
          totale += duplicazione.oreOrdinarie;
        }
      }
    }

    this.totaleOreLavorate = totale;
  }

  svuotaCampi() {
    for (const giorno of this.rapportinoDto) {
      for (const duplicazione of giorno.duplicazioniGiornoDto) {
        duplicazione.cliente = '';
        duplicazione.oreOrdinarie = null;
        duplicazione.fascia1 = null;
        duplicazione.fascia2 = null;
        duplicazione.fascia3 = null;
      }
      giorno.permessi = null;
      giorno.note = '';
      giorno.ferie = false;
      giorno.malattie = false;
    }
  }

  calcolaTotaleFerie() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      if (giorno.ferie) {
        totale += 1;
      }
    }

    this.totaleFerie = totale;
  }

  calcolaTotaleMalattia() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      if (giorno.malattie) {
        totale += 1;
      }
    }

    this.totaleMalattia = totale;
  }

  calcolaTotaleStraordinari() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      for (const duplicazione of giorno.duplicazioniGiornoDto) {
        // Assicurati che i campi straordinari siano definiti (potrebbero essere null o undefined)
        if (duplicazione.fascia1) {
          totale += duplicazione.fascia1;
        }
        if (duplicazione.fascia2) {
          totale += duplicazione.fascia2;
        }
        if (duplicazione.fascia3) {
          totale += duplicazione.fascia3;
        }
      }
    }

    this.totaleStraordinari = totale;
  }

  calcolaTotaleOrePermessi() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      if (giorno.permessi) {
        totale += giorno.permessi; // Aggiungi le ore di permesso al totale
      }
    }

    this.totaleOrePermessi = totale;
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
        console.log('ID:' + this.id);
        console.log('IDUTENTELOGGATO:' + this.idUtenteLoggato);
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
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        console.log('ID UTENTE PER NAV:' + this.idUtente);
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
    const url = `http://localhost:8080/services/funzioni-ruolo-tree/${this.idUtente}`;
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
