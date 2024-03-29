import { DatePipe, ViewportScroller } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
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
import { ThemeService } from 'src/app/theme.service';
import { AlertConfermaComponent } from 'src/app/alert-conferma/alert-conferma.component';
import { TutorialCompilazioneRapportinoComponent } from 'src/app/tutorial-compilazione-rapportino/tutorial-compilazione-rapportino.component';

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
  contrattoUser: any;
  showTooltip = false;
  messaggio = '';
  currentDate = new Date();
  currentMonth: any;
  currentYear: any;
  id = this.activatedRoute.snapshot.params['id'];
  idUtenteLoggato: any;
  elencoCommesse: any[] = [];
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
  checkpermessi = false;
  showStraordinari: boolean[][] = [];
  toggleMode = false;
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
  aziendaUser: any;
  noteDipendente: any;
  inviaNoteAlDipendente = false;
  opzionePermessoSelezionata: string | null = null;
  showPermessi: boolean[] = [];
  showPermessiRole: boolean[] = [];
  showPermessiExfestivita: boolean[] = [];
  ruolo: any;
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
  tokenExpirationTime: any;
  timer: any;
  lavoratoWeekend: string = 'no';
  inserisciNote :boolean[]=[]

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
    private authService: AuthService,
    public themeService: ThemeService,
    private scroller: ViewportScroller,
    private cdRef: ChangeDetectorRef
  ) {
    this.windowWidth = window.innerWidth;

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }

  getWindowWidth(): number {
    return this.windowWidth;
  }
  toggleHamburgerMenu(): void {
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
  }
  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
  }

  filterOptions() {
    this.filteredAziendeClienti = this.aziendeClienti.filter((azienda) =>
      azienda.toLowerCase().includes(this.giorno.cliente.toLowerCase())
    );
    this.showError = false; // Resetta l'errore quando l'utente inizia a digitare
  }

  toggleNote(index: number) {
    if (!this.inserisciNote[index]) {
      this.inserisciNote[index] = false;
    }
    this.inserisciNote[index] = !this.inserisciNote[index];
  }

  toggleOnSite(giorno: any): void {
    if (
      !this.risultatoCheckFreeze &&
      !giorno.malattie &&
      !giorno.ferie &&
      !giorno.checkSmartworking
    ) {
      giorno.checkOnSite = !giorno.checkOnSite;
    }
  }
  toggleSmartworking(giorno: any): void {
    if (
      !this.risultatoCheckFreeze &&
      !giorno.malattie &&
      !giorno.ferie &&
      !giorno.checkOnSite
    ) {
      giorno.checkSmartworking = !giorno.checkSmartworking;
    }
  }
  toggleFerie(giorno: any): void {
    if (
      !this.risultatoCheckFreeze &&
      !giorno.malattie &&
      !giorno.ferie &&
      !giorno.checkOnSite
    ) {
      giorno.ferie = !giorno.ferie;
    }
  }
  togglemalattia(giorno: any): void {
    if (
      !this.risultatoCheckFreeze &&
      !giorno.malattie &&
      !giorno.ferie &&
      !giorno.checkOnSite
    ) {
      giorno.malattie = !giorno.malattie;
    }
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
          image: '../../../../assets/images/logo.jpeg',
          title: 'Non puoi eliminare la riga principale.',
        },
      });
    }
  }

  setFestivita(checkFestivita: boolean, giorno: any) {
    giorno.checkFestivita = checkFestivita;
  }

  unsetFestivita(checkFestivita: boolean, giorno: any) {
    giorno.checkFestivita = checkFestivita;
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
          image: '../../../../assets/images/logo.jpeg',
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
    if (this.token) {
      const tokenParts = this.token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      this.tokenExpirationTime = Math.floor(tokenPayload.exp - currentTime);
      this.timer = setInterval(() => {
        this.tokenExpirationTime -= 1;
        this.cdRef.detectChanges();

        if (this.tokenExpirationTime === 0) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Attenzione:',
              message: 'Sessione terminata; esegui il login.',
            },
          });

          this.authService.logout().subscribe(
            (response: any) => {
              if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenProvvisorio');
                sessionStorage.clear();
                this.router.navigate(['/login']);
                this.dialog.closeAll();
              } else {
                console.log(
                  'Errore durante il logout:',
                  response.status,
                  response.body
                );
                this.handleLogoutError();
              }
            },
            (error: HttpErrorResponse) => {
              if (error.status === 403) {
                console.log('Errore 403: Accesso negato');
                this.handleLogoutError();
              } else {
                console.log('Errore durante il logout:', error.message);
                this.handleLogoutError();
              }
            }
          );
        }
      }, 1000);
    }

    if (this.token != null) {
      this.getUserLogged();
      // this.getUserRole();
      this.salvaAziendeClienti();
      // this.getAnagraficaRapportino();
    }
    if (this.token == null) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Attenzione:',
          message: 'Errore di autenticazione; effettua il login.',
        },
      });
      this.authService.logout().subscribe(
        (response: any) => {
          if (response.status === 200) {
            localStorage.removeItem('token');
            localStorage.removeItem('isDarkMode');
            localStorage.removeItem('DatiSbagliati');
            localStorage.removeItem('tokenProvvisorio');
            sessionStorage.clear();
            this.router.navigate(['/login']);
            this.dialog.closeAll();
          } else {
            this.handleLogoutError();
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.handleLogoutError();
          } else {
            this.handleLogoutError();
          }
        }
      );
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(
      remainingSeconds
    )}`;
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private handleLogoutError() {
    sessionStorage.clear();
    window.location.href = 'login';
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvvisorio');
  }

  private clearFieldValue(element: HTMLInputElement): void {
    if (element) {
      element.value = '';
    }
  }

  isWeekend(giorno: string): any {
    return giorno === 'Sabato' || giorno === 'Domenica';
  }

  onChangePresenza(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      console.log('On site ' + isChecked);
    }
    const giorni = this.rapportinoDto.map((giorno) => {
      return {
        duplicazioniGiornoDto: giorno.duplicazioniGiornoDto.map(
          (duplicazione: any) => {
            return {
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
        checkSmartWorking: giorno.checkSmartWorking,
        checkOnSite: giorno.checkOnSite,
        note: giorno.note,
        numeroGiorno: giorno.numeroGiorno,
        nomeGiorno: giorno.nomeGiorno,
        festivitaNazionale: giorno.festivitaNazionale,
        checkFestivita: giorno.checkFestivita,
      };
    });
    for (const giorno of giorni) {
      if (!giorno.checkSmartWorking) {
        giorno.checkSmartWorking = null;
      }
    }
  }

  onChangeSmartworking(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      console.log('Smartworking ' + isChecked);
    }
    const giorni = this.rapportinoDto.map((giorno) => {
      return {
        duplicazioniGiornoDto: giorno.duplicazioniGiornoDto.map(
          (duplicazione: any) => {
            return {
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
        checkSmartWorking: giorno.checkSmartWorking,
        checkOnSite: giorno.checkOnSite,
        note: giorno.note,
        numeroGiorno: giorno.numeroGiorno,
        nomeGiorno: giorno.nomeGiorno,
        festivitaNazionale: giorno.festivitaNazionale,
        checkFestivita: giorno.checkFestivita,
      };
    });
    for (const giorno of giorni) {
      if (!giorno.checkOnSite) {
        giorno.checkOnSite = null;
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
      const noteElement = document.getElementById(
        `note-${i}`
      ) as HTMLInputElement;
      const clienteElement = document.getElementById(
        `cliente-${i}`
      ) as HTMLInputElement;

      // Aggiungi altri campi necessari

      if (isChecked) {
        // Quando ferie è true, svuota i campi
        this.clearFieldValue(oreElement);
        this.clearFieldValue(malattieElement);
        this.clearFieldValue(fascia1Element);
        this.clearFieldValue(fascia2Element);
        this.clearFieldValue(fascia3Element);
        this.clearFieldValue(permessiElement);
        this.clearFieldValue(noteElement);
        this.clearFieldValue(clienteElement);
      }
    }
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
      // const noteElement = document.getElementById(`note-${i}`) as HTMLInputElement;

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

        // noteElement.disabled = false;
        // noteElement.required = false;
        // noteElement.disabled = true;
      } else {
        giornoElement.disabled = false;
        giornoElement.required = true;

        clienteElement.disabled = false;
        clienteElement.required = true;
        clienteElement.value = '';

        oreElement.disabled = false;
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

        // noteElement.disabled = false;
        // noteElement.required = false;
        // noteElement.disabled = false;
      }
    }
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

        // if (this.risultatoCheckFreeze) {
        //   const dialogRef = this.dialog.open(AlertDialogComponent, {
        //     data: {
        //       image: '../../../../assets/images/info.png',
        //       title: 'Il rapportino é stato inviato:',
        //       message:
        //         'Non potrai effettuare modifiche finché un admin non te lo rimandi indietro.',
        //     },
        //   });
        // } else {
        //   const dialogRef = this.dialog.open(AlertDialogComponent, {
        //     data: {
        //       image: '../../../../assets/images/info.png',
        //       title: 'Nota:',
        //       message:
        //         'Prima di compilare il rapportino, controlla lo stato delle richieste che hai inviato e assicurati di compilarlo correttamente.',
        //     },
        //   });
        // }
      });
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
    console.log(JSON.stringify(body));
    this.rapportinoService.getRapportino(this.token, body).subscribe(
      (result: any) => {
        if ((result as any).esito.code !== 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
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
          this.noteDipendente = result['rapportinoDto']['noteDipendente'];
          this.gestisciStraordinari(this.rapportinoDto);
          this.gestisciPermessi(this.rapportinoDto);
          setTimeout(() => {
            this.checkRapportinoInviato();
            console.log('ritardo 1');
          }, 1000);
          this.calcolaTotaleOreLavorate();
          this.calcolaTotaleStraordinari();
          this.calcolaTotaleFerie();
          this.calcolaTotaleMalattia();
          this.calcolaTotaleOrePermessi();
          // this.rimuoviWeekend();
          this.cdRef.detectChanges();
          // console.log(
          //   'Risultato getRapportino:' + JSON.stringify(this.rapportinoDto)
          // );
          if (this.note === null || this.note === '' || this.note === '') {
            console.log('non hai note.');
          } else {
            console.log('Hai note: ' + JSON.stringify(this.note));
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/logo.jpeg',
                title: 'Attenzione, hai delle note:',
                message: this.note,
              },
              disableClose: true,
            });
          }
        }
      },
      (error: string) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  toggleSetEight(giorno: any) {
    if (
      giorno.duplicazioniGiornoDto.some(
        (duplicazione: any) => duplicazione.oreOrdinarie === 8
      )
    ) {
      this.unsetEight(giorno);
    } else {
      this.setEight(giorno);
    }
  }

  setEight(giorno: any) {
    if (!giorno.ferie && !giorno.malattie) {
      giorno.duplicazioniGiornoDto.forEach((duplicazione: any) => {
        duplicazione.oreOrdinarie = 8;
      });
    }
  }

  unsetEight(giorno: any) {
    giorno.duplicazioniGiornoDto.forEach((duplicazione: any) => {
      if (!giorno.ferie && !giorno.malattie) {
        duplicazione.oreOrdinarie = null;
      }
    });
  }

  onChangePermHours(giorno: any) {
    // Verifica che il giorno non sia un giorno di ferie o malattia
    if (!giorno.ferie && !giorno.malattie) {
      // Definisci il numero totale di ore ordinarie disponibili (8 ore)
      const totalHours = 8;
      // Inizializza le ore di permesso a 0
      let totalPermHours = 0;
      // Somma le ore di permesso solo se sono definite e comprese tra 0 e 8
      if (
        giorno.permessiRole !== null &&
        giorno.permessiRole >= 0 &&
        giorno.permessiRole <= 8
      ) {
        totalPermHours += giorno.permessiRole;
      }
      if (
        giorno.permessiExfestivita !== null &&
        giorno.permessiExfestivita >= 0 &&
        giorno.permessiExfestivita <= 8
      ) {
        totalPermHours += giorno.permessiExfestivita;
      }
      // Calcola le ore ordinarie sottraendo le ore di permesso dal totale
      const remainingOrdinaryHours = Math.max(0, totalHours - totalPermHours);
      // Per ogni duplicazione nel giorno, imposta le ore ordinarie
      giorno.duplicazioniGiornoDto.forEach((duplicazione: any) => {
        duplicazione.oreOrdinarie = remainingOrdinaryHours;
      });
    }
  }

  rimuoviWeekend(): void {
    if (!this.rapportinoDto) {
      console.error('I dati di rapportino non sono disponibili.');
      return;
    }
    // Filtra i giorni che non sono sabato o domenica
    const giorniLavorativi = this.rapportinoDto.filter(
      (giorno) =>
        giorno.nomeGiorno !== 'sabato' && giorno.nomeGiorno !== 'domenica'
    );
    this.rapportinoDto = giorniLavorativi;
    console.log(
      'Dati con weekend rimossi:',
      JSON.stringify(this.rapportinoDto)
    );
  }

  onChange() {
    console.log('Valore selezionato:', this.lavoratoWeekend);
    if (this.lavoratoWeekend === 'si') {
      //faccio il get rapportino senza la rimozione dei weekend
      let body = {
        rapportinoDto: {
          anagrafica: {
            codiceFiscale: this.codiceFiscale,
          },
          annoRequest: this.selectedAnno,
          meseRequest: this.selectedMese,
        },
      };
      console.log(JSON.stringify(body));
      this.rapportinoService.getRapportino(this.token, body).subscribe(
        (result: any) => {
          if ((result as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/danger.png',
                title: 'Caricamento non riuscito:',
                message: (result as any).esito.target,
              },
            });
          } else {
            this.esitoCorretto = true;
            this.rapportinoDto = result['rapportinoDto']['mese']['giorni'];
            this.duplicazioniGiornoDto =
              result['rapportinoDto']['mese']['giorni'][
                'duplicazioniGiornoDto'
              ];
            this.giorniUtili = result['rapportinoDto']['giorniUtili'];
            this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];
            this.note = result['rapportinoDto']['note'];
            this.noteDipendente = result['rapportinoDto']['noteDipendente'];
            this.gestisciStraordinari(this.rapportinoDto);
            this.gestisciPermessi(this.rapportinoDto);
            setTimeout(() => {
              this.checkRapportinoInviato();
              console.log('ritardo 1');
            }, 1000);
            this.calcolaTotaleOreLavorate();
            this.calcolaTotaleStraordinari();
            this.calcolaTotaleFerie();
            this.calcolaTotaleMalattia();
            this.calcolaTotaleOrePermessi();
            this.cdRef.detectChanges();
            if (this.note === null || this.note === '' || this.note === '') {
              console.log('non hai note.');
            } else {
              console.log('Hai note: ' + JSON.stringify(this.note));
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  image: '../../../../assets/images/logo.jpeg',
                  title: 'Attenzione, hai delle note:',
                  message: this.note,
                },
                disableClose: true,
              });
            }
          }
        },
        (error: string) => {
          console.error('ERRORE:' + JSON.stringify(error));
        }
      );
    }
    if (this.lavoratoWeekend === 'no') {
      //faccio il get rapportino con la rimozione dei weekend
      this.getRapportino();
    }
  }

  manipolaDatiRapportino(): void {
    if (!this.rapportinoDto) {
      console.error('I dati di rapportino non sono disponibili.');
      return;
    }

    // Ordina i giorni della settimana
    this.rapportinoDto.sort((a, b) => a.numeroGiorno - b.numeroGiorno);

    // Manipola direttamente i dati e stampa il risultato in console
    const datiManipolati = this.rapportinoDto.map((giorno) => ({
      ...giorno,
      isNewLine: giorno.nomeGiorno === 'domenica',
    }));

    // Stampa il risultato manipolato in console
    console.log('Dati manipolati:', datiManipolati);
  }

  gestisciStraordinari(rapportinoDto: any[]) {
    const giorni = rapportinoDto.map((giorno) => {
      return {
        duplicazioniGiornoDto: giorno.duplicazioniGiornoDto.map(
          (duplicazione: any) => {
            return {
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
        permessiRole: giorno.permessiRole,
        permessiExfestivita: giorno.permessiExfestivita,
        note: giorno.note,
        numeroGiorno: giorno.numeroGiorno,
        nomeGiorno: giorno.nomeGiorno,
        festivitaNazionale: giorno.festivitaNazionale,
        checkFestivita: giorno.checkFestivita,
      };
    });

    for (let i = 0; i < giorni.length; i++) {
      const giorno = giorni[i];

      let almenoUnCampoStraordinariValorizzato = false;

      for (let j = 0; j < giorno.duplicazioniGiornoDto.length; j++) {
        const duplicazione = giorno.duplicazioniGiornoDto[j];

        if (
          duplicazione.fascia1 ||
          duplicazione.fascia2 ||
          duplicazione.fascia3
        ) {
          almenoUnCampoStraordinariValorizzato = true;
          break;
        }
      }

      // Verifica se tutti i campi straordinari sono null
      const tuttiCampiStraordinariNull = giorno.duplicazioniGiornoDto.every(
        (duplicazione: any) =>
          duplicazione.fascia1 === null &&
          duplicazione.fascia2 === null &&
          duplicazione.fascia3 === null
      );

      if (almenoUnCampoStraordinariValorizzato && !tuttiCampiStraordinariNull) {
        // Se troviamo almeno un campo straordinario valorizzato, impostiamo la visibilità a true solo per quella cella
        this.showStraordinari[i] = giorno.duplicazioniGiornoDto.map(() => true);
      } else {
        // Altrimenti, impostiamo la visibilità a false per tutte le celle
        this.showStraordinari[i] = giorno.duplicazioniGiornoDto.map(
          () => false
        );
      }
    }
  }

  mostraNascondiStraordinari(index: number, j: number) {
    // Inizializza l'array per la cella corrente se non esiste già
    if (!this.showStraordinari[index]) {
      this.showStraordinari[index] = [];
    }

    // Cambia lo stato di visualizzazione per la cella corrente
    this.showStraordinari[index][j] = !this.showStraordinari[index][j];
  }

  mostraNascondiPermessi(index: number) {
    if (!this.showPermessi[index]) {
      this.showPermessi[index] = false;
    }
    this.showPermessi[index] = !this.showPermessi[index];
  }

  gestisciPermessi(rapportinoDto: any[]) {
    const giorni = rapportinoDto.map((giorno) => {
      return {
        duplicazioniGiornoDto: giorno.duplicazioniGiornoDto.map(
          (duplicazione: any) => {
            return {
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
        permessiRole: giorno.permessiRole,
        permessiExfestivita: giorno.permessiExfestivita,
        note: giorno.note,
        numeroGiorno: giorno.numeroGiorno,
        nomeGiorno: giorno.nomeGiorno,
        festivitaNazionale: giorno.festivitaNazionale,
        checkFestivita: giorno.checkFestivita,
      };
    });

    for (let i = 0; i < giorni.length; i++) {
      const giorno = giorni[i];
      let almenoUnCampoPermessiValorizzato = false;

      if (
        giorno.permessi ||
        giorno.permessiRole ||
        giorno.permessiExfestivita ||
        giorno.ferie ||
        giorno.malattie
      ) {
        almenoUnCampoPermessiValorizzato = true;
      }
      // Verifica se tutti i campi permessi sono null
      const tuttiCampiPermessiNull = giorno.duplicazioniGiornoDto.every(
        (duplicazione: any) =>
          duplicazione.permessi === null &&
          duplicazione.permessiRole === null &&
          duplicazione.permessiExfestivita === null &&
          duplicazione.ferie === null &&
          duplicazione.malattie === null
      );
      // Imposta la visibilità in base alla condizione
      this.showPermessi[i] =
        almenoUnCampoPermessiValorizzato && !tuttiCampiPermessiNull;
    }

  }

  changeOptionAssenza(event: any, index: number) {
    // Ottieni l'opzione selezionata
    const selectedOption = event.target.value;
    console.log(selectedOption);

    // Imposta la visibilità dei campi in base all'opzione selezionata
    switch (selectedOption) {
      case 'Permessi':
        this.showPermessi[index] = true;
        this.showPermessiRole[index] = false;
        this.showPermessiExfestivita[index] = false;
        break;
      case 'Permessi role':
        this.showPermessi[index] = false;
        this.showPermessiRole[index] = true;
        this.showPermessiExfestivita[index] = false;
        break;
      case 'Permessi ex festivitá':
        this.showPermessi[index] = false;
        this.showPermessiRole[index] = false;
        this.showPermessiExfestivita[index] = true;
        break;
      default:
        this.checkpermessi = false;
        this.showPermessi[index] = false;
        this.showPermessiRole[index] = false;
        this.showPermessiExfestivita[index] = false;
    }
  }

  aggiungiNoteDipendente() {
    this.inviaNoteAlDipendente = !this.inviaNoteAlDipendente;
  }

  resetNote() {
    this.noteDipendente = null;
  }

  openTutorial() {
    // this.dialog.open(TutorialCompilazioneRapportinoComponent),{

    // },  disableClose: true,
    const dialogRef = this.dialog.open(
      TutorialCompilazioneRapportinoComponent,
      {
        disableClose: true,
      }
    );
  }

  salvaNoteDipendente() {
    const dialogRef = this.dialog.open(AlertConfermaComponent, {
      data: {
        image: '../../../../assets/images/danger.png',
        title: 'Attenzione:',
        message:
          "Se confermi l'invio, il rapportino verrá disabilitato finché l'admin non ti risponderá.",
      },
      disableClose: true,
    });

    dialogRef.componentInstance.conferma.subscribe(() => {
      let body = {
        rapportinoDto: {
          noteDipendente: this.noteDipendente,
          anagrafica: {
            nome: this.userLoggedName,
            cognome: this.userLoggedSurname,
            codiceFiscale: this.codiceFiscale,
          },
          annoRequest: this.selectedAnno,
          meseRequest: this.selectedMese,
        },
      };
      console.log(
        'invia al dipendente le seguenti note: ' + JSON.stringify(body)
      );
      this.rapportinoService.aggiungiNoteDipendente(this.token, body).subscribe(
        (result: any) => {
          if ((result as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/logo.jpeg',
                title: 'Invio non riuscito:',
                message: (result as any).esito.target, //(result as any).esito.target,
              },
            });
            console.error(
              'Errore durante l invio delle note all admin: ' +
                JSON.stringify(result)
            );
          }
          if ((result as any).esito.code === 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/logo.jpeg',
                title: 'Invio riuscito',
                message: 'Note inviate correttamente all admin',
              },
            });
            this.checkRapportinoInviato();
          }
        },
        (error: any) => {
          console.error(
            'Errore durante l invio delle note al dipendente:' +
              JSON.stringify(error)
          );
        }
      );
    });

    // else {
    //   const dialogRef = this.dialog.open(AlertDialogComponent, {
    //     data: {
    //       image: '../../../../assets/images/logo.jpeg',
    //       // title: 'Attenzione',
    //       message: "Invio delle note all'admin annullato.",
    //     },
    //   });
    // }
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
    const dialogRef = this.dialog.open(AlertConfermaComponent, {
      data: {
        image: '../../../../assets/images/danger.png',
        title: 'Attenzione:',
        message:
          'Confermi di voler inviare il rapportino? Una volta inviato, non potrai piú effettuare modifiche.',
      },
      disableClose: true,
    });

    dialogRef.componentInstance.conferma.subscribe(() => {
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
                image: '../../../../assets/images/danger.png',
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
                image: '../../../../assets/images/logo.jpeg',
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
                image: '../../../../assets/images/logo.jpeg',
                title: 'Invio riuscito.',
                message: (result as any).esito.target,
              },
            });
            console.log('RESPONSE INSERT RAPPORTINO:' + JSON.stringify(result));
            this.rapportinoInviato = true;
            this.tabellaEditabile = 'false';
            this.checkRapportinoInviato();
          }
        });
    });
  }

  salvaRapportino(formValue: any) {
    console.log(formValue.value);

    const giorni = this.rapportinoDto.map((giorno) => {
      return {
        duplicazioniGiornoDto: giorno.duplicazioniGiornoDto.map(
          (duplicazione: any) => {
            return {
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
        checkSmartWorking: giorno.checkSmartWorking,
        checkOnSite: giorno.checkOnSite,
        permessiRole: giorno.permessiRole,
        permessiExfestivita: giorno.permessiExfestivita,
        note: giorno.note,
        numeroGiorno: giorno.numeroGiorno,
        nomeGiorno: giorno.nomeGiorno,
        festivitaNazionale: giorno.festivitaNazionale,
        checkFestivita: giorno.checkFestivita,
      };
    });
    for (const giorno of giorni) {
      //imposto a null i booleani a false

      if (!giorno.ferie) {
        giorno.ferie = null;
      }

      if (!giorno.malattie) {
        giorno.malattie = null;
      }

      if (!giorno.checkSmartWorking) {
        giorno.checkSmartWorking = null;
      }
      if (!giorno.checkOnSite) {
        giorno.checkOnSite = null;
      }

      console.log(
        'Oggetto giorniArray iterato: ' + JSON.stringify(giorno, null, 2)
      );
    }

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
                image: '../../../../assets/images/logo.jpeg',
                title: 'Salvataggio non riuscito:',
                message: (result as any).esito.target,
              },
            });
            this.rapportinoSalvato = false;
            console.error(result);
          }
          if ((result as any).esito.target === 'ERRORE_GENERICO') {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/danger.png',
                title: 'Salvataggio non riuscito:',
                message: 'Qualcosa é andato storto; riprova.',
              },
            });
            this.rapportinoSalvato = false;
            console.error(result);
          }
          if (
            (result as any).esito.code === 200 &&
            (result as any).esito.target == null
          ) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/logo.jpeg',
                title: 'Salvataggio riuscito.',
                message: (result as any).esito.target,
              },
            });
            console.log(JSON.stringify(result));
            setTimeout(() => {
              console.log('Ritardo 2');
              this.getRapportino();
            }, 1000);
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

  annulla() {
    this.getRapportino();
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
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
    let body = {
      rapportinoDto: {
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: this.selectedAnno,
        meseRequest: event.target.value,
      },
    };
    console.log(JSON.stringify(body));
    this.rapportinoService.getRapportino(this.token, body).subscribe(
      (result: any) => {
        if ((result as any).esito.code !== 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
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
          this.noteDipendente = result['rapportinoDto']['noteDipendente'];
          this.gestisciStraordinari(this.rapportinoDto);
          this.gestisciPermessi(this.rapportinoDto);
          this.checkRapportinoInviato();
          this.calcolaTotaleOreLavorate();
          this.calcolaTotaleStraordinari();
          this.calcolaTotaleFerie();
          this.calcolaTotaleMalattia();
          this.calcolaTotaleOrePermessi();
          this.cdRef.detectChanges();

          if (this.note === null || this.note === '' || this.note === '') {
            console.log('non hai note.');
          } else {
            console.log('Hai note: ' + JSON.stringify(this.note));
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/logo.jpeg',
                title: 'Attenzione, hai delle note:',
                message: this.note,
              },
              disableClose: true,
            });
          }
        }
      },
      (error: string) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  onAnnoSelectChange(event: any) {
    console.log('Anno selezionato:', event.target.value);
    let body = {
      rapportinoDto: {
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: event.target.value,
        meseRequest: this.selectedMese,
      },
    };
    console.log(JSON.stringify(body));
    this.rapportinoService.getRapportino(this.token, body).subscribe(
      (result: any) => {
        if ((result as any).esito.code !== 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
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
          this.noteDipendente = result['rapportinoDto']['noteDipendente'];
          this.gestisciStraordinari(this.rapportinoDto);
          this.gestisciPermessi(this.rapportinoDto);
          this.checkRapportinoInviato();
          this.calcolaTotaleOreLavorate();
          this.calcolaTotaleStraordinari();
          this.calcolaTotaleFerie();
          this.calcolaTotaleMalattia();
          this.calcolaTotaleOrePermessi();
          this.cdRef.detectChanges();

          if (this.note === null || this.note === '' || this.note === '') {
            console.log('non hai note.');
          } else {
            console.log('Hai note: ' + JSON.stringify(this.note));
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/logo.jpeg',
                title: 'Attenzione, hai delle note:',
                message: this.note,
              },
              disableClose: true,
            });
          }
        }
      },
      (error: string) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idUtenteLoggato]);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.idUtenteLoggato = response.anagraficaDto.anagrafica.id;
        this.contrattoUser =
          response.anagraficaDto.contratto.tipoContratto.descrizione;
        this.aziendaUser =
          response.anagraficaDto.contratto.tipoAzienda.descrizione;
        this.elencoCommesse = response.anagraficaDto.commesse;
        this.numeroCommessePresenti = this.elencoCommesse.length;
        this.ruolo = response.anagraficaDto.ruolo.descrizione;
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
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
        this.elencoCommesse.forEach((commessa: any) => {
          if (commessa.tipoAziendaCliente.descrizione) {
            this.aziendeClienti.push(commessa.tipoAziendaCliente.descrizione);
            console.log(
              'Aziende clienti: ' + JSON.stringify(this.aziendeClienti)
            );
          }
        });
        this.codiceFiscale = response.anagraficaDto.anagrafica.codiceFiscale;
        if (this.contrattoUser == 'Stage' || this.contrattoUser === 'P.Iva') {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/logo.jpeg',
              title: 'Attenzione:',
              message: 'Il tuo contratto non prevede ferie e malattie.',
            },
          });
        }
        console.log('ID:' + this.id);
        console.log('IDUTENTELOGGATO:' + this.idUtenteLoggato);
        console.log('codice fiscale utente loggato:' + this.codiceFiscale);
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
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        // console.log('ID UTENTE PER NAV:' + this.idUtente);
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
    this.menuService
      .generateMenuByUserRole(this.token, this.idUtente)
      .subscribe(
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
    this.menuService.getPermissions(this.token, functionId).subscribe(
      (data: any) => {
        // console.log('Permessi ottenuti:', data);
      },
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
  //         image: '../../../../assets/images/logo.jpeg',
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
  //         image: '../../../../assets/images/logo.jpeg',
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
  //         image: '../../../../assets/images/logo.jpeg',
  //         title: 'Attenzione:',
  //         message:
  //           'Il campo deve essere un numero con incrementi di 0.5 compreso tra 0 e 24.',
  //       },
  //     });
  //   } else {
  //   }
  // }

  getBackgroundClasses(giorno: any): any {
    return {
      'sabato-dom':
        giorno.nomeGiorno === 'sabato' || giorno.nomeGiorno === 'domenica',
      'festivita-red': giorno.festivitàNazionale,
    };
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

// verificaStraordinariCompilati(rapportinoDto: any): boolean {
//   let hasStraordinariCompilati = false;

//   for (let i = 0; i < rapportinoDto.length; i++) {
//     for (let j = 0; j < rapportinoDto[i].duplicazioniGiornoDto.length; j++) {
//       const duplicazione = rapportinoDto[i].duplicazioniGiornoDto[j];

//       if (
//         duplicazione &&
//         (duplicazione.fascia1 || duplicazione.fascia2 || duplicazione.fascia3)
//       ) {
//         // Se almeno una cella ha straordinari compilati, impostare checkStraordinari a true
//         hasStraordinariCompilati = true;
//       }

//       // Aggiungi la logica per inizializzare showStraordinari
//       if (!this.showStraordinari[i]) {
//         this.showStraordinari[i] = [];
//       }

//       // Aggiorna showStraordinari solo se la cella corrente ha almeno un campo compilato
//       this.showStraordinari[i][j] =
//         duplicazione &&
//         (duplicazione.fascia1 ||
//           duplicazione.fascia2 ||
//           duplicazione.fascia3);
//     }
//   }

//   return hasStraordinariCompilati;
// }
// getAnagraficaRapportino() {
//   this.anagraficaDtoService
//     .detailAnagraficaDto(this.id, localStorage.getItem('token'))
//     .subscribe(
//       (resp: any) => {
//         this.user = (resp as any)['anagraficaDto'];
//         this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
//         this.salvaAziendeClienti();
//         this.contratto = (resp as any)['anagraficaDto']['contratto'];
//         // this.codiceFiscale = (resp as any)['anagraficaDto']['anagrafica'][
//         //   'codiceFiscale'
//         // ];
//         this.dettaglioSbagliato = false;
//         this.numeroCommessePresenti = this.elencoCommesse.length;
//         // console.log('Dati restituiti: ' + JSON.stringify(resp));
//       },
//       (error: any) => {
//         console.error(
//           'ERRORE DURANTE IL CARICAMENTO DELL ANAGRAFICA :' +
//             JSON.stringify(error)
//         );
//       }
//     );
// }
