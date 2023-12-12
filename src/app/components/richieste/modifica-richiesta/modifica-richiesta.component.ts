import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../login/login-service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
export class ModificaRichiestaComponent implements OnInit {
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
  requestForm: FormGroup;
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
    private richiesteService: RichiesteService
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
    this.requestForm = this.formBuilder.group({
      giorno: ['', Validators.required],
      mese: ['', Validators.required],
      anno: ['', Validators.required],
      oggettoRichiesta: ['', Validators.required],
      testoRichiesta: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.getRichiesta();
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
        console.log(
          'Dati restituiti dalla richiesta: ' + JSON.stringify(this.data)
        );
      },
      (error: any) => {
        console.error('Errore durante il get: ' + JSON.stringify(error));
      }
    );
  }

  salva(data: any) {
    console.log('Payload x richiesta update : ' + JSON.stringify(data));
    const dialogRef = this.dialog.open(AlertConfermaComponent, {
      data: {
        image: '../../../../assets/images/danger.png',
        title: 'Attenzione:',
        message: 'Confermi di voler modificare la richiesta ?',
      },
      disableClose: true,
    });

    dialogRef.componentInstance.conferma.subscribe(() => {
      this.richiesteService.updateRichiesta(this.token, this.data).subscribe(
        (response: any) => {
          if ((response as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/danger.png',
                title: 'Modifica non riuscita:',
                message: (response as any).esito.target,
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
    if (this.data.list.some((item: any) => item.ferie)) {
      this.tipoRichiesta = 'ferie';
      return 'Ferie per i seguenti giorni:';
    } else if (this.data.list.some((item: any) => item.permessi)) {
      this.tipoRichiesta = 'permessi';
      return 'Ore di permesso ';
    } else {
      this.tipoRichiesta = '';
      return 'Nessuna tipologia specificata';
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

  onTipoRichiestaSelected(event: any) {
    this.tipoRichiesta = event.target.value;
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
