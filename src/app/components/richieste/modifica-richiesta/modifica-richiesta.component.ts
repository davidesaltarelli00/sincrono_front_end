import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../login/login-service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThemeService } from 'src/app/theme.service';
import { ImageService } from '../../image.service';
import { MenuService } from '../../menu.service';
import { RichiesteService } from '../richieste.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { AlertConfermaComponent } from 'src/app/alert-conferma/alert-conferma.component';

@Component({
  selector: 'app-modifica-richiesta',
  templateUrl: './modifica-richiesta.component.html',
  styleUrls: ['./modifica-richiesta.component.scss'],
})
export class ModificaRichiestaComponent implements OnInit, AfterViewInit {
  id = this.activatedRouter.snapshot.params['id'];
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
  //proprietá per immagini
  immagine: any;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  immagineConvertita: string | null = null;
  immaginePredefinita: string | null = null;
  idAnagraficaLoggata: any;
  disabilitaImmagine: any;
  salvaImmagine: boolean = false;
  immagineCancellata: boolean = false;
  codiceFiscaleDettaglio: any;
  idUtente: any;
  mobile: any = false;
  anni: number[] = [];
  mesi: number[] = [];
  selectedAnno: any;
  selectedMese: any;
  giorni: any[] = [];
  selectedGiorno: any;
  esitoCorretto = false;
  elencoRichieste: any[] = [];
  permessoRequestForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 20; // Numero di elementi per pagina
  currentMonth: any;
  currentYear: any;
  currentMonthDays: { number: number; dayOfWeek: number; selected: boolean }[] =
    [];
  dayNames: string[] = [
    'Domenica',
    'Lunedí',
    'Martedí',
    'Mercoledí',
    'Giovedí',
    'Venerdí',
    'Sabato',
  ];
  giorniSelezionati: any[] = [];
  showSelectedDays = false;
  tipoRichiesta: string = '';
  permessoGiorno: any;
  permessoMese: any;
  permessoAnno: any;
  daOra: any;
  aOra: any;
  selectedMeseForLista: any;
  selectedAnnoForLista: any;
  elencoRichiesteDipendente: any[] = [];
  anniDal2023: any[] = [];
  data: any;
  note: any;
  oraFineOptions: string[] = [];
  mostraAggiungiCampo: boolean = true;
  styleApplied = false;
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
  orarioAttuale: Date = new Date();
  tokenExpirationTime: any;
  timer: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    public themeService: ThemeService,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private menuService: MenuService,
    private activatedRouter: ActivatedRoute,
    private richiesteService: RichiesteService,
    private cdRef: ChangeDetectorRef

  ) {
    const oggi = new Date();
    const annoCorrente = oggi.getFullYear();
    const meseCorrente = oggi.getMonth() + 1;
    const giornoCorrente = oggi.getDate();

    for (let anno = 2010; anno <= annoCorrente; anno++) {
      this.anni.push(anno);
    }
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 5;

    for (let anno = startYear; anno <= endYear; anno++) {
      this.anniDal2023.push(anno);
    }

    this.mesi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    this.selectedAnno = annoCorrente;
    this.selectedMese = meseCorrente;

    // Calcola il numero di giorni nel mese e nell'anno correnti
    const numeroGiorni = new Date(annoCorrente, meseCorrente, 0).getDate();

    // Crea un array di giorni da 1 a 'numeroGiorni'
    this.giorni = Array.from({ length: numeroGiorni }, (_, i) => i + 1);

    // Imposta il giorno selezionato come giorno corrente
    this.selectedGiorno = giornoCorrente;
    this.windowWidth = window.innerWidth;

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
    this.permessoRequestForm = this.formBuilder.group({
      giorno: ['', Validators.required],
      daOra: ['', Validators.required],
      aOra: ['', Validators.required],
    });
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
      this.getUserRole();
      this.getRichiesta();
      this.getTitle();
      const currentDate = new Date();
      this.currentMonth = currentDate.getMonth() + 1;
      this.currentYear = currentDate.getFullYear();
      this.generateCalendar(this.currentMonth, this.currentYear);
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Attenzione:',
          message: 'Errore di autenticazione; effettua il login.',
        },
      });
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

  ngAfterViewInit() {
    this.styleApplied = true;
  }

  getStyle(fieldName: string) {
    if (this.styleApplied) {
      return {
        border: this.permessoRequestForm.get(fieldName)?.hasError('required')
          ? '1px solid red'
          : '1px solid green',
      };
    } else {
      return {};
    }
  }

  updateOraFineOptions(item: any) {
    const oraInizio = item.daOra;
    const oraInizioDate = new Date(`01/01/2000 ${oraInizio}`);
    const oraFineOptions = [];
    const orarioMassimo = new Date(`01/01/2000 18:00`);

    for (let i = 30; i <= 240; i += 30) {
      const nuovaOra = new Date(oraInizioDate.getTime() + i * 60000);
      // Verifica che l'ora sia minore o uguale all'orario massimo
      if (nuovaOra <= orarioMassimo) {
        const nuovaOraFormatted = this.formatOra(nuovaOra);
        oraFineOptions.push(nuovaOraFormatted);
      }
    }

    // Imposta il valore di "Ora Fine" solo se è maggiore o uguale a "Ora Inizio"
    const orarioSelezionato = this.oraFineOptions.find(
      (ora) => ora >= item.daOra
    );
    item.aOra =
      orarioSelezionato ||
      (this.oraFineOptions.length > 0 ? this.oraFineOptions[0] : '');

    this.oraFineOptions = oraFineOptions;
  }

  formatOra(ora: Date): string {
    const ore = ora.getHours().toString().padStart(2, '0');
    const minuti = ora.getMinutes().toString().padStart(2, '0');
    return `${ore}:${minuti}`;
  }

  mostraPulsanteAggiungi(): boolean {
    // Restituisci true solo se ci sono elementi nella lista e l'ultimo elemento è una richiesta di ferie
    return (
      this.data.list &&
      this.data.list.length > 0 &&
      this.data.list[this.data.list.length - 1].ferie
    );
  }

  generateCalendar(month: number, year: number) {
    this.currentMonthDays = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      this.currentMonthDays.push({
        number: day,
        dayOfWeek: date.getDay(),
        selected: false,
      });
    }
  }

  getRichiesta() {
    this.richiesteService.getRichiesta(this.token, this.id).subscribe(
      (result: any) => {
        this.data = result['richiestaDto'];
        // console.log(
        //   'Dati restituiti dal dettaglio: ' + JSON.stringify(this.data)
        // );
      },
      (error: any) => {
        console.error('Errore durante il get: ' + JSON.stringify(error));
      }
    );
  }

  aggiungiCampo() {
    this.data.list.push({
      ferie: true,
      nGiorno: null,
      permessi: null,
      aOra: null,
      daOra: null,
      note: null,
    });
  }

  rimuoviCampo(index: number) {
    this.data.list.splice(index, 1);
  }

  salva(data: any) {
    const dialogRef = this.dialog.open(AlertConfermaComponent, {
      data: {
        image: '../../../../assets/images/danger.png',
        title: 'Attenzione:',
        message: 'Confermi di voler modificare la richiesta ?',
      },
      disableClose: true,
    });

    dialogRef.componentInstance.conferma.subscribe(() => {
      let body = {
        richiestaDto: {
          id: data.id,
          anno: data.anno,
          mese: data.mese,
          codiceFiscale: data.codiceFiscale,
          list: data.list.map((item: any) => ({
            permessi: item.permessi,
            ferie: item.ferie,
            daOra: item.daOra,
            aOra: item.aOra,
            nGiorno: item.nGiorno,
          })),
        },
      };
      console.log('Payload x richiesta update : ' + JSON.stringify(body));

      this.richiesteService.updateRichiesta(this.token, body).subscribe(
        (response: any) => {
          if (
            (response as any).esito.code !== 200 &&
            (response as any).esito.target ===
              'Cannot invoke "java.lang.Integer.intValue()" because the return value of "it.sincrono.repositories.dto.DuplicazioniRichiestaDto.getnGiorno()" is null'
          ) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/danger.png',
                title: 'Modifica non riuscita:',
                message: 'Non hai inserito il giorno.',
              },
            });
          }
          if (
            (response as any).esito.code != 200 &&
            (response as any).esito.target === 'HTTP error code: 400'
          ) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/danger.png',
                title: 'Modifica non riuscita:',
                message:
                  'Qualcosa é andato storto, controlla i dati inseriti e riprova.',
              },
            });
          }
          if ((response as any).esito.code === 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/danger.png',
                title: 'Modifica effettuata con successo.',
                message: (response as any).esito.target,
              },
            });
            this.router.navigate(['/richieste']);
          }
        },
        (error: any) => {
          console.error(
            'Errore durtante la modifica della richiesta: ' +
              JSON.stringify(error)
          );
        }
      );
    });
  }

  onChangeMeseForLista(event: any) {
    const target = event.target.value;
    this.selectedMeseForLista = target;
  }

  getTitle(): string {
    if (this.data && this.data.list) {
      let hasFerie = this.data.list.some((item: any) => item.ferie);
      let hasPermessi = this.data.list.some((item: any) => item.permessi);

      if (hasFerie) {
        this.tipoRichiesta = 'ferie';
        this.mostraAggiungiCampo = true;
        return 'Ferie per i seguenti giorni:';
      } else if (hasPermessi) {
        this.tipoRichiesta = 'permessi';
        this.mostraAggiungiCampo = false;
        return 'Ore di permesso';
      } else {
        this.tipoRichiesta = '';
        this.mostraAggiungiCampo = true;
        return 'Nessuna tipologia specificata';
      }
    } else {
      // Gestisci il caso in cui this.data o this.data.list sia null o undefined
      return 'Errore: Dati non disponibili';
    }
  }

  getMonthName(month: number): string {
    const monthNames = [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre',
    ];
    return monthNames[month - 1];
  }

  getDayName(dayOfWeek: number): string {
    return this.dayNames[dayOfWeek];
  }

  onDaySelected(dayNumber: number) {
    const day = this.currentMonthDays.find((d) => d.number === dayNumber);

    if (day) {
      day.selected = !day.selected;

      if (day.selected) {
        // Inserisci il giorno in modo ordinato
        const index = this.giorniSelezionati.findIndex(
          (giorno) => giorno > dayNumber
        );
        if (index !== -1) {
          this.giorniSelezionati.splice(index, 0, dayNumber);
        } else {
          this.giorniSelezionati.push(dayNumber);
          this.openSelectedDays();
        }
      } else {
        const index = this.giorniSelezionati.indexOf(dayNumber);
        if (index !== -1) {
          this.giorniSelezionati.splice(index, 1);
        }
      }
    }
  }

  isWeekend(dayOfWeek: number): boolean {
    return dayOfWeek === 6 || dayOfWeek === 0; // Sabato = 6, Domenica = 0
  }

  isDaySelected(dayNumber: number): boolean {
    const day = this.currentMonthDays.find((d) => d.number === dayNumber);
    return day ? day.selected : false;
  }

  onNextMonth() {
    this.currentMonth = (this.currentMonth % 12) + 1;
    if (this.currentMonth === 1) {
      this.currentYear++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  onPrevMonth() {
    this.currentMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1;
    if (this.currentMonth === 12) {
      this.currentYear--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  selectAllDays() {
    const areAllSelected = this.currentMonthDays.every(
      (day) => day.selected || this.isWeekend(day.dayOfWeek)
    );

    this.currentMonthDays.forEach((day) => {
      if (!this.isWeekend(day.dayOfWeek)) {
        this.onDaySelected(day.number);
      }
    });
  }

  areAllDaysSelected(): boolean {
    return this.currentMonthDays.every(
      (day) => day.selected || this.isWeekend(day.dayOfWeek)
    );
  }

  openSelectedDays() {
    this.showSelectedDays = true;
  }

  // metodi per navbar

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
        this.codiceFiscaleDettaglio =
          response.anagraficaDto.anagrafica.codiceFiscale;
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
      (data: any) => {},
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
