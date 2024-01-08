import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { RichiesteService } from './richieste.service';

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
  currentPage: number = 1;
  itemsPerPage: number = 10; // Numero di elementi per pagina
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
  annoCorrente: any;
  meseCorrente: any;
  giorniCalendario: { numero: any | null; nome: any | null }[][];
  giorniDellaSettimana: string[] = [
    'Domenica',
    'Lunedí',
    'Martedí',
    'Mercoledí',
    'Giovedí',
    'Venerdí',
    'Sabato',
  ];
  giorniSelezionati: { [meseAnno: string]: GiornoSelezionato[] } = {};
  almenoUnGiornoSelezionato: boolean = false;
  navigazioneDisabilitata: any;
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
  idUtenteLoggato: any;

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
    private richiesteService: RichiesteService
  ) {
    this.windowWidth = window.innerWidth;

    this.giorniCalendario = [[]];
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
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      const currentDate = new Date();
      this.currentMonth = currentDate.getMonth() + 1;
      this.currentYear = currentDate.getFullYear();
      // this.generateCalendar(this.currentMonth, this.currentYear);
      const dataCorrente = new Date();
      this.annoCorrente = dataCorrente.getFullYear();
      this.meseCorrente = dataCorrente.getMonth();

      this.aggiornaDataCorrente();
      this.generaCalendario();
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Attenzione:',
          message: 'Errore di autenticazione; effettua il login.',
        },
      });
    }
  }

  //inizio metodi per invio richieste delle ferie

  /*
proprieta usate:
annoCorrente: any;
  meseCorrente: any;
  giorniCalendario: { numero: any | null, nome: any | null }[][];
  giorniDellaSettimana: string[] = ['Domenica', 'Lunedí', 'Martedí', 'Mercoledí', 'Giovedí', 'Venerdí', 'Sabato'];
  giorniSelezionati: { [meseAnno: string]: GiornoSelezionato[] } = {};

*/

  aggiornaDataCorrente() {
    const dataCorrente = new Date();
    this.annoCorrente = dataCorrente.getFullYear();
    this.meseCorrente = dataCorrente.getMonth();
  }

  generaCalendario() {
    const primoGiornoDelMese = new Date(
      this.annoCorrente,
      this.meseCorrente,
      1
    );
    const ultimoGiornoDelMese = new Date(
      this.annoCorrente,
      this.meseCorrente + 1,
      0
    );

    const primoGiornoSettimana = primoGiornoDelMese.getDay();
    const totaleGiorni = ultimoGiornoDelMese.getDate();

    let contatoreGiorni = 1;
    this.giorniCalendario = [[]];

    for (let settimana = 0; contatoreGiorni <= totaleGiorni; settimana++) {
      this.giorniCalendario[settimana] = [];

      for (let giornoSettimana = 0; giornoSettimana < 7; giornoSettimana++) {
        if (
          (settimana === 0 && giornoSettimana >= primoGiornoSettimana) ||
          (settimana > 0 && contatoreGiorni <= totaleGiorni)
        ) {
          const numeroGiorno = contatoreGiorni;
          const nomeGiorno = this.getDayName(giornoSettimana);

          this.giorniCalendario[settimana].push({
            numero: numeroGiorno,
            nome: nomeGiorno,
          });
          contatoreGiorni++;
        } else {
          // Aggiungi un giorno vuoto se necessario
          this.giorniCalendario[settimana].push({ numero: null, nome: null });
        }
      }

      // Aggiungi una nuova settimana all'array se ci sono ancora giorni
      if (contatoreGiorni <= totaleGiorni) {
        this.giorniCalendario.push([]);
      }
    }
  }

  ordinaChiavi(obj: any): { key: string; value: any }[] {
    return Object.keys(obj)
      .sort()
      .map((key) => ({ key, value: obj[key] }));
  }

  rimuoviGiorno(meseAnno: string, numeroGiorno: number) {
    if (this.giorniSelezionati[meseAnno]) {
      this.giorniSelezionati[meseAnno] = this.giorniSelezionati[
        meseAnno
      ].filter((giorno) => giorno.numero !== numeroGiorno);
    }
    this.aggiornaCard();
  }

  isWeekend(nomeGiorno: string | null): boolean {
    return nomeGiorno === 'Sabato' || nomeGiorno === 'Domenica';
  }

  onMesePrecedente() {
    this.meseCorrente--;
    if (this.meseCorrente < 0) {
      this.meseCorrente = 11;
      this.annoCorrente--;
    }
    this.generaCalendario();
    if (this.almenoUnGiornoSelezionato) {
      this.navigazioneDisabilitata = true;
    }
  }

  onMeseSuccessivo() {
    this.meseCorrente++;
    if (this.meseCorrente > 11) {
      this.meseCorrente = 0;
      this.annoCorrente++;
    }
    this.generaCalendario();
    if (this.almenoUnGiornoSelezionato) {
      this.navigazioneDisabilitata = true;
    }
  }

  getNomeMese(mese: number): string {
    const nomiMesi = [
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
    return nomiMesi[mese];
  }

  onGiornoSelezionato(giorno: { numero: number | null; nome: string | null }) {
    if (giorno && giorno.numero !== null) {
      const chiaveMeseAnno = `${this.meseCorrente + 1}-${this.annoCorrente}`;

      // Controlla se la cella è già stata cliccata
      if (!this.giorniSelezionati[chiaveMeseAnno]) {
        this.giorniSelezionati[chiaveMeseAnno] = [];
      }

      const giornoGiaSelezionato = this.giorniSelezionati[chiaveMeseAnno].find(
        (giornoSelezionato) => giornoSelezionato.numero === giorno.numero
      );

      if (!giornoGiaSelezionato) {
        this.giorniSelezionati[chiaveMeseAnno].push({
          numero: giorno.numero,
          nome: giorno.nome || '',
        });

        // Aggiorna qui la logica per gestire la selezione del giorno

        // Per aggiornare la card quando si selezionano i giorni
        this.aggiornaCard();

        // Imposta la variabile a true quando almeno un giorno è selezionato
        this.almenoUnGiornoSelezionato = true;
      }

      // Disabilita la navigazione solo se c'è almeno un giorno selezionato
      if (this.almenoUnGiornoSelezionato) {
        this.navigazioneDisabilitata = true;
      }
    }
  }

  aggiornaCard() {
    // Verifica se ci sono giorni selezionati
    const giorniSelezionatiPresenti = Object.keys(this.giorniSelezionati).some(
      (meseAnno) => this.giorniSelezionati[meseAnno].length > 0
    );
    // Aggiorna la variabile di visibilità della card
    this.almenoUnGiornoSelezionato = giorniSelezionatiPresenti;
  }

  private getDayName(dayOfWeek: number): string {
    return this.giorniDellaSettimana[dayOfWeek];
  }

  inviaRichiestaFerie() {
    const giorniFerie = Object.keys(this.giorniSelezionati)
      .map((meseAnno) => {
        return this.giorniSelezionati[meseAnno].map((giorno: any) => {
          return {
            ferie: true,
            permessi: null,
            nGiorno: giorno.numero,
          };
        });
      })
      .flat();

    const body = {
      richiestaDto: {
        anno: this.annoCorrente,
        mese: this.meseCorrente + 1,
        codiceFiscale: this.codiceFiscaleDettaglio,
        list: giorniFerie,
      },
    };

    console.log('PAYLOAD INVIO RICHIESTA DI FERIE: ' + JSON.stringify(body));

    this.richiesteService
      .inviaRichiesta(this.token, body)
      .subscribe((result: any) => {
        if ((result as any).esito.code !== 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/logo.jpeg',
              title: 'Invio non riuscito:',
              message: (result as any).esito.target,
            },
          });
          // location.reload();
        } else {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/logo.jpeg',
              title: 'Invio effettuato',
            },
          });
          location.reload();
        }
      });
  }

  //fine metodi per la gestione delle ferie

  onChangeMeseForLista(event: any) {
    const target = event.target.value;
    this.selectedMeseForLista = target;
  }

  onTipoRichiestaSelected(event: any) {
    this.tipoRichiesta = event.target.value;
  }

  isDaySelected(dayNumber: number): boolean {
    const day = this.currentMonthDays.find((d) => d.number === dayNumber);
    return day ? day.selected : false;
  }

  openSelectedDays() {
    this.showSelectedDays = true;
  }

  checkValidazione(id: number) {
    console.log(id);
    let body = {
      richiestaDto: {
        id: id,
        anno: this.permessoAnno,
        mese: this.permessoMese,
        codiceFiscale: this.codiceFiscaleDettaglio,
        list: [
          {
            permessi: true,
            ferie: null,
            daOra: this.daOra,
            aOra: this.aOra,
            nGiorno: this.permessoGiorno,
          },
        ],
      },
    };
  }

  updateRichiesta(id: number) {
    this.router.navigate(['/update-richiesta/', id]);
  }

  getAllRichiesteDipendente() {
    let body = {
      richiestaDto: {
        anno: this.selectedAnnoForLista,
        mese: this.selectedMeseForLista,
        codiceFiscale: this.codiceFiscaleDettaglio,
      },
    };
    // console.log('BODY PER LISTA RICHIESTE DIPENDENTE: ' + JSON.stringify(body));
    this.richiesteService
      .getAllRichiesteDipendente(this.token, body)
      .subscribe((result: any) => {
        if ((result as any).esito.code != 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Attenzione:',
              message:
                'Si é verificato un problema durante il caricamento della lista: ' +
                (result as any).esito.target,
            },
            disableClose: true,
          });
        } else {
          this.elencoRichiesteDipendente = result['list'];
          // console.log(
          //   'la ricerca ha prodotto i seguenti risultati: ' +
          //     JSON.stringify(this.elencoRichiesteDipendente)
          // );
        }
      });
  }

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idUtenteLoggato]);
  }


  //paginazione
  getCurrentPageItemsFerie(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.elencoRichiesteDipendente.slice(startIndex, endIndex);
  }
  getCurrentPageItemsPermessi(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.elencoRichiesteDipendente.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.elencoRichiesteDipendente.length / this.itemsPerPage);
  }

  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
    }
  }

  //------------------------------------------------------------------------------------------------------------------------------------

  getAllRichieste() {
    // console.log(
    //   'Hai selezionato il seguente periodo:' +
    //     JSON.stringify(this.selectedGiorno) +
    //     '-' +
    //     JSON.stringify(this.selectedMese) +
    //     '-' +
    //     JSON.stringify(this.selectedAnno)
    // );
    this.esitoCorretto = true;
    this.elencoRichieste = [];
  }

  inviaRichiesta() {
    // console.log(this.requestForm.value);
  }

  resetForm() {
    this.requestForm.reset();
  }

  //metodi form selezione periodo

  onGiornoSelectChange(event: any) {
    this.selectedGiorno = event.target.value;
    // console.log('Giorno selezionato:', this.selectedGiorno);
  }

  onMeseSelectChange(event: any) {
    // console.log('Mese selezionato:', event.target.value);
  }

  onAnnoSelectChange(event: any) {
    // console.log('Anno selezionato:', event.target.value);
  }

  //metodi immagine
  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleDettaglio,
    };
    // console.log(JSON.stringify(body));
    // console.log('BODY PER GET IMAGE: ' + JSON.stringify(body));
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        // console.log('BASE64 ricevuto: ' + JSON.stringify(this.immagine));

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
        this.idUtenteLoggato=response.anagraficaDto.anagrafica.id;
        this.ruolo = response.anagraficaDto.ruolo.nome;
        this.codiceFiscaleDettaglio =
          response.anagraficaDto.anagrafica.codiceFiscale;
        this.getImage();
        const oggi = new Date();
        this.selectedAnnoForLista = oggi.getFullYear();
        this.selectedMeseForLista = oggi.getMonth() + 1;
        if (this.ruolo === 'DIPENDENTE') {
          let body = {
            richiestaDto: {
              anno: this.selectedAnnoForLista,
              mese: this.selectedMeseForLista,
              codiceFiscale: this.codiceFiscaleDettaglio,
            },
          };

          this.richiesteService
            .getAllRichiesteDipendente(this.token, body)
            .subscribe((result: any) => {
              if ((result as any).esito.code != 200) {
                const dialogRef = this.dialog.open(AlertDialogComponent, {
                  data: {
                    image: '../../../../assets/images/danger.png',
                    title: 'Attenzione:',
                    message:
                      'Si é verificato un problema durante il caricamento della lista: ' +
                      (result as any).esito.target,
                  },
                  disableClose: true,
                });
              } else {
                this.elencoRichiesteDipendente = result['list'];
                // console.log(
                //   'la ricerca ha prodotto i seguenti risultati: ' +
                //     JSON.stringify(this.elencoRichiesteDipendente)
                // );
              }
            });
        } else {
          console.error('NON HAI I PERMESSI PER ACCEDERE ALLA SEZIONE.');
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

        this.userRoleNav = response.anagraficaDto.ruolo.nome;
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        // console.log('ID UTENTE PER NAV:' + this.idUtente);
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

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
interface GiornoSelezionato {
  numero: number;
  nome: string;
}
