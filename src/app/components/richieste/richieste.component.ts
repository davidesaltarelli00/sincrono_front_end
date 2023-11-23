import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../login/login-service';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';
import { MenuService } from '../menu.service';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-richieste',
  templateUrl: './richieste.component.html',
  styleUrls: ['./richieste.component.scss'],
})
export class RichiesteComponent implements OnInit {
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
  selectedGiorno: number;
  esitoCorretto = false;
  elencoRichieste: any[] = [];
  requestForm: FormGroup;

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

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    public themeService: ThemeService,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private menuService: MenuService
  ) {
    const oggi = new Date();
    const annoCorrente = oggi.getFullYear();
    const meseCorrente = oggi.getMonth() + 1;
    const giornoCorrente = oggi.getDate();

    for (let anno = 2010; anno <= annoCorrente; anno++) {
      this.anni.push(anno);
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

        console.log(
          'Giorni selezionati singolarmente:' +
            JSON.stringify(this.giorniSelezionati)
        );
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
    console.log('Richiesta selezionata: ' + this.tipoRichiesta);
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
        console.log('Giorni selezionati: ' + JSON.stringify(day.number));
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




  //------------------------------------------------------------------------------------------------------------------------------------

  getAllRichieste() {
    console.log(
      'Hai selezionato il seguente periodo:' +
        JSON.stringify(this.selectedGiorno) +
        '-' +
        JSON.stringify(this.selectedMese) +
        '-' +
        JSON.stringify(this.selectedAnno)
    );
    this.esitoCorretto = true;
    this.elencoRichieste = [];
  }

  inviaRichiesta() {
    console.log(this.requestForm.value);
  }

  resetForm() {
    this.requestForm.reset();
  }

  //metodi form selezione periodo

  onGiornoSelectChange(event: any) {
    this.selectedGiorno = event.target.value;
    console.log('Giorno selezionato:', this.selectedGiorno);
  }

  onMeseSelectChange(event: any) {
    console.log('Mese selezionato:', event.target.value);
  }

  onAnnoSelectChange(event: any) {
    console.log('Anno selezionato:', event.target.value);
  }

  //metodi immagine
  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleDettaglio,
    };
    console.log(JSON.stringify(body));
    console.log('BODY PER GET IMAGE: ' + JSON.stringify(body));
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        console.log('BASE64 ricevuto: ' + JSON.stringify(this.immagine));

        if (this.immagine) {
          this.convertBase64ToImage(this.immagine);
        } else {
          // Assegna un'immagine predefinita se l'immagine non è disponibile
          this.immaginePredefinita =
            '../../../../assets/images/profilePicPlaceholder.png';
        }
      },
      (error: any) => {
        console.error(
          "Errore durante il caricamento dell'immagine: " +
            JSON.stringify(error)
        );

        // Assegna un'immagine predefinita in caso di errore
        this.immaginePredefinita = '../../../../assets/images/danger.png';
      }
    );
  }

  convertBase64ToImage(base64String: string): void {
    this.immagineConvertita = base64String;
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
        this.getImage();
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
    this.menuService
      .generateMenuByUserRole(this.token, this.idUtente)
      .subscribe(
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
          this.jsonData = { list: [] };
        }
      );
  }

  getPermissions(functionId: number) {
    this.menuService.getPermissions(this.token, functionId).subscribe(
      (data: any) => {
        console.log('Permessi ottenuti:', data);
      },
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
