import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportinoService } from '../utente/rapportino.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import { ThemeService } from 'src/app/theme.service';
import { MenuService } from '../menu.service';
import { RichiesteService } from '../richieste/richieste.service';
import { AuthService } from '../login/login-service';

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
  rapportinoDto: any[] = [];
  note: any;
  giorniUtili: any;
  giorniLavorati: any;
  @ViewChild('editableTable') editableTable!: ElementRef;
  mobile = false;
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
  idUtente: any;
  selectedAnno: number;
  selectedMese: number;
  anni: number[] = [];
  mesi: number[] = [];
  esitoCorretto: boolean = false;
  duplicazioniGiornoDto: any[] = [];
  //calcoli
  totaleOreLavorate: any;
  totaleFerie: any;
  totaleMalattia: any;
  totaleStraordinari: any;
  totaleOrePermessi: any;
  elencoRichiesteAccettate: any[] = [];
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
  tokenExpirationTime: any;
  timer: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rapportinoService: RapportinoService,
    private dialog: MatDialog,
    private router: Router,
    public themeService: ThemeService,
    private http: HttpClient,
    private profileBoxService: ProfileBoxService,
    private anagraficaDtoService: AnagraficaDtoService,
    private cdRef: ChangeDetectorRef,
    private menuService: MenuService,
    private richiesteService: RichiesteService,
    private authService: AuthService,

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

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idUtenteLoggato]);
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

  ngOnInit() {

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
      // console.log(
      //   this.id,
      //   this.nome,
      //   this.cognome,
      //   this.codiceFiscale,
      //   this.mese,
      //   this.anno
      // );

      let body = {
        rapportinoDto: {
          anagrafica: {
            codiceFiscale: this.codiceFiscale,
          },
          annoRequest: this.anno,
          meseRequest: this.mese,
        },
      };
      console.log("Rapportini update "+JSON.stringify(body));
      this.rapportinoService.getRapportino(this.token, body).subscribe(
        (result: any) => {
          console.log("Rapportini update "+JSON.stringify(result));
          if ((result as any).esito.code !== 200) {

            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/logo.jpeg',
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
            // console.log(
            //   'Dati get rapportino:' + JSON.stringify(this.rapportinoDto)
            // );
            // if (this.note != null) {
            //   const dialogRef = this.dialog.open(AlertDialogComponent, {
            //     data: {
            //       image: '../../../../assets/images/logo.jpeg',
            //       title: 'Attenzione:',
            //       message: this.note,
            //     },
            //   });
            // }
            this.getAllRichiesteAccettate();
            this.calcolaTotaleFerie();
            this.calcolaTotaleMalattia();
            this.calcolaTotaleOreLavorate();
            this.calcolaTotaleOrePermessi();
            this.calcolaTotaleStraordinari();
            this.cdRef.detectChanges();
          }
        },
        (error: string) => {
          console.error('ERRORE:' + JSON.stringify(error));
        }
      );
    } else {
      console.error('ERRORE DI AUTENTICAZIONE');
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


  trackByFn(index: number, item: any): number {
    return index;
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
          (result as any).esito.code !== 200 ||
          (result as any).esito.target === 'HTTP error code: 400'
        ) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Salvataggio delle note non riuscito:',
              message: (result as any).esito.target, //(result as any).esito.target,
            },
          });
          console.error(result);
        } else {
          console.log('RESULT AGGIUNGI NOTE:' + JSON.stringify(result));
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/logo.jpeg',
              title: 'Note salvate e rapportino rispedito all utente.',
            },
          });
          this.router.navigate(['/lista-rapportini']);
        }
      },
      (error: any) => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            image: '../../../../assets/images/danger.png',
            title: 'Salvataggio delle note non riuscito:',
            message: JSON.stringify(error),
          },
        });
      }
    );
  }

  getAllRichiesteAccettate() {
    let body = {
      richiestaDto: {
        anno: this.anno,
        mese: this.mese,
        codiceFiscale: this.codiceFiscale,
      },
    };
    console.log('Payload elenco Richieste accettate: ' + JSON.stringify(body));
    this.richiesteService.getAllRichiesteAccettate(this.token, body).subscribe(
      (result: any) => {
        this.elencoRichiesteAccettate = result.list;
        console.log(
          'Elenco Richieste accettate:' +
            JSON.stringify(this.elencoRichiesteAccettate)
        );
      },
      (error: any) => {
        console.error(
          'Errore durante il caricamento delle richieste: ' +
            JSON.stringify(error)
        );
      }
    );
  }

  //calcoli
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

  getCliente(duplicazioni: any[], duplicazione: any): string {
    const duplicazioneCorrispondente = duplicazioni.find(
      (d) => d.cliente === duplicazione
    );
    return duplicazioneCorrispondente ? duplicazioneCorrispondente.cliente : '';
  }

  getOreOrdinarie(duplicazioni: any[], duplicazione: any): number {
    const duplicazioneCorrispondente = duplicazioni.find(
      (d) => d.cliente === duplicazione
    );
    return duplicazioneCorrispondente
      ? duplicazioneCorrispondente.oreOrdinarie
      : 0;
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
        this.idUtenteLoggato = response.anagraficaDto.anagrafica.id;
        this.ruolo = response.anagraficaDto.ruolo.nome;
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
