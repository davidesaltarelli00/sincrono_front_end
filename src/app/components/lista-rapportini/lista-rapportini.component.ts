import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
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
import { MenuService } from '../menu.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ContrattoService } from '../contratto/contratto-service';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import { MailSollecitaComponent } from '../mail-sollecita/mail-sollecita.component';
import { ThemeService } from 'src/app/theme.service';
import { AlertConfermaComponent } from 'src/app/alert-conferma/alert-conferma.component';
import { saveAs } from 'file-saver';
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
  elencoMail: string[] = [];
  elencoRapportiniFreezati: any[] = [];
  elencoRapportiniNonFreezati: any[] = [];
  checkFreeze = false;
  mobile: any = false;
  selectedAnno: any;
  selectedMeseRapportino: any;
  selectedAnnoRapportino: any;

  selectedMese: any;
  currentDate = new Date();
  currentMonth: any;
  currentYear: any;
  codiceFiscale = '';
  note: any;
  anni: number[] = [];
  mesi: any;
  mesitest: any;
  rapportinoDto: any;
  giorniUtili: any;
  giorniLavorati: any;
  selectedMeseRapportinoNonFreezato: any;
  selectedAnnoRapportinoNonFreezato: any;
  // paginazione 1 :tabella rapportini non freezati
  currentPage: number = 1;
  itemsPerPage: number = 25;
  pageData: any[] = [];
  // paginazione 2: tabella rapportini freezati
  currentPage2: number = 1;
  itemsPerPage2: number = 25;
  pageData2: any[] = [];
  idUtente: any;
  getAllRapportiniNotFreezeCorretto = false;
  //tutto il necessario per i filtri
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  tipiCcnl: any = [];
  contrattiNazionali: any = [];
  tipologicaCanaliReclutamento: any[] = [];
  motivazioniFineRapporto: any[] = [];
  ccnLSelezionato: any;
  numeroMensilitaCCNL: any;
  idCCNLselezionato: any;
  commesse!: FormArray;
  target: { [key: number]: boolean } = {};
  tutteLeRigheSelezionate: boolean = false;

  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      nome: new FormControl(null),
      cognome: new FormControl(null),
      // attivo: new FormControl(true),
      attesaLavori: new FormControl(null),
      tipoAzienda: new FormGroup({
        id: new FormControl(null),
        descrizione: new FormControl(null),
      }),
      tipoCanaleReclutamento: new FormGroup({
        id: new FormControl(null),
        descrizione: new FormControl(null),
      }),
    }),

    contratto: new FormGroup({
      ralAnnua: new FormControl(null),
      dataAssunzione: new FormControl(null),
      dataFineRapporto: new FormControl(null),

      tipoLivelloContratto: new FormGroup({
        id: new FormControl(null),
      }),
      tipoCcnl: new FormGroup({
        id: new FormControl(null),
      }),
      tipoContratto: new FormGroup({
        id: new FormControl(null),
      }),
      tipoAzienda: new FormGroup({
        id: new FormControl(null),
      }),

      tipoCausaFineRapporto: new FormGroup({
        id: new FormControl(null),
      }),
    }),
    commessa: new FormGroup({
      tipoAziendaCliente: new FormGroup({
        id: new FormControl(''),
        descrizione: new FormControl(''),
      }),
    }),
  });
  aziendeClienti: any[] = [];
  lista: any[] = [];
  elencoLivelliCCNL: any[] = [];
  inseritoContrattoIndeterminato: any;
  messaggio: any;
  mostraFiltriFreeze = false;
  mostraFiltriNotFreeze = false;
  windowWidth: any;
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  idAnagraficaLoggata: any;
  tokenExpirationTime: any;
  timer: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private rapportinoService: RapportinoService,
    private listaRapportiniService: ListaRapportiniService,
    private rapportinoDataService: RapportinoDataService,
    private menuService: MenuService,
    public themeService: ThemeService,
    private contrattoService: ContrattoService,
    private anagraficaDtoService: AnagraficaDtoService,
    private cdRef: ChangeDetectorRef
  ) {
    const oggi = new Date();
    const annoCorrente = oggi.getFullYear();
    const meseCorrente = oggi.getMonth() + 1;

    for (let anno = 2010; anno <= annoCorrente; anno++) {
      this.anni.push(anno);
    }

    this.mesi = [
      { mese: 'Gennaio', value: 1 },
      { mese: 'Febbraio', value: 1 },
      { mese: 'Marzo', value: 1 },
      { mese: 'Aprile', value: 1 },
      { mese: 'Maggio', value: 1 },
      { mese: 'Giugno', value: 1 },
      { mese: 'Luglio', value: 1 },
      { mese: 'Agosto', value: 1 },
      { mese: 'Settembre', value: 1 },
      { mese: 'Ottobre', value: 1 },
      { mese: 'Novembre', value: 1 },
      { mese: 'Dicembre', value: 1 },
    ];

    this.selectedAnno = annoCorrente;
    this.selectedMese = meseCorrente;
    this.selectedMeseRapportino = meseCorrente;
    this.selectedAnnoRapportino = annoCorrente;
    this.currentYear = annoCorrente;
    this.currentMonth = meseCorrente;
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

    this.filterAnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        nome: new FormControl(null),
        cognome: new FormControl(null),
        // attivo: new FormControl(true),
        attesaLavori: new FormControl(null),
        tipoAzienda: new FormGroup({
          id: new FormControl(null),
          descrizione: new FormControl(null),
        }),
        tipoCanaleReclutamento: new FormGroup({
          id: new FormControl(),
          descrizione: new FormControl(null),
        }),
      }),
      contratto: new FormGroup({
        ralAnnua: new FormControl(null),
        dataAssunzione: new FormControl(null),
        dataFineRapporto: new FormControl(null),
        tipoLivelloContratto: new FormGroup({
          id: new FormControl(),
          livello: new FormControl(null),
        }),
        tipoCcnl: new FormGroup({
          id: new FormControl(),
          descrizione: new FormControl(null),
        }),
        tipoContratto: new FormGroup({
          id: new FormControl(),
          descrizione: new FormControl(null),
        }),
        tipoAzienda: new FormGroup({
          id: new FormControl(),
          descrizione: new FormControl(null),
        }),
        tipoCausaFineRapporto: new FormGroup({
          id: new FormControl(),
        }),
      }),
      commesse: this.formBuilder.array([]),
    });

    this.commesse = this.filterAnagraficaDto.get('commesse') as FormArray;
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
      // this.getUserRole();
      this.caricaAziendeClienti();
      this.caricaTipoContratto();
      this.caricaTipoAzienda();
      this.caricaContrattoNazionale();
      this.caricaTipoCanaleReclutamento();
      this.caricaTipoCausaFineRapporto();

      const commessaFormGroup = this.creaFormCommessa();
      this.commesse.push(commessaFormGroup);

      let body = {
        anno: this.currentYear,
        mese: this.currentMonth,
      };
      // console.log('BODY RAPPORTINI DA CONTROLLARE: ' + JSON.stringify(body));
      this.listaRapportiniService
        .getAllRapportiniNonFreezati(this.token, body)
        .subscribe(
          (result: any) => {
            this.getAllRapportiniNotFreezeCorretto = true;
            this.elencoRapportiniNonFreezati = result['list'];
            this.selectedMeseRapportinoNonFreezato = result['list']['mese'];
            this.selectedAnnoRapportinoNonFreezato = result['list']['anno'];
            this.currentPage = 1;
            this.pageData = this.getCurrentPageItems();
            // console.log(
            //   'Questo é l elenco dei rapportini da controllare: ' +
            //     JSON.stringify(this.elencoRapportiniNonFreezati)
            // );
            let body = {
              anno: this.currentYear,
              mese: this.currentMonth,
            };
            // console.log('BODY RAPPORTINI CONTROLLATI: ' + JSON.stringify(body));

            this.listaRapportiniService
              .getAllRapportiniFreezati(this.token, body)
              .subscribe(
                (result: any) => {
                  this.elencoRapportiniFreezati = result['list'];
                  this.currentPage2 = 1;
                  this.pageData2 = this.getCurrentPageItems2();
                },
                (error: any) => {
                  console.error(
                    'Si é verificato un errore durante il caricamento dei rapportini freezati: ' +
                      JSON.stringify(error)
                  );
                }
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

  creaFormCommessa(): FormGroup {
    return this.formBuilder.group({
      tipoAziendaCliente: new FormGroup({
        id: new FormControl(''),
        descrizione: new FormControl(''),
      }),
    });
  }

  caricaTipoCausaFineRapporto() {
    this.anagraficaDtoService
      .caricaTipoCausaFineRapporto(localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          this.motivazioniFineRapporto = (res as any)['list'];
          // console.log('Elenco motivazioni fine rapporto:', JSON.stringify(res));
        },
        (error: any) => {
          console.error(
            'Errore durante il caricamento della tipologica Motivazione fine rapporto:',
            JSON.stringify(error)
          );
        }
      );
  }

  caricaTipoCanaleReclutamento() {
    this.anagraficaDtoService
      .caricaTipoCanaleReclutamento(localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          this.tipologicaCanaliReclutamento = (res as any)['list'];
          // console.log('ElencoCanali reclutamento:' + JSON.stringify(res));
        },
        (error: any) => {
          console.error(
            'Errore durante il caricamento della tipologica canale reclutamento: ' +
              JSON.stringify(error)
          );
        }
      );
  }

  onChangeAziendaCliente(event: any) {
    const selectedValue = parseInt(event.target.value, 10);

    if (!isNaN(selectedValue)) {
      const selectedObject = this.tipiAziende.find(
        (azienda: any) => azienda.id === selectedValue
      );

      if (selectedObject) {
        console.log('Azienda cliente selezionata: ', selectedObject);
      } else {
        console.log('Azienda non trovata nella lista');
      }
    } else {
      console.log('Valore non valido o azienda non selezionata');
    }
  }
  private transcodificaMesi(mese: any): any {
    console.log(mese);
    switch (mese) {
      case '1': {
        return 'Gennaio';
        break;
      }
      case '2': {
        return 'Febbraio';
        break;
      }
      case '3': {
        return 'Marzo';
        break;
      }

      case '4': {
        return 'Aprile';
        break;
      }
      case '5': {
        return 'Maggio';
        break;
      }
      case '6': {
        return 'Giugno';
        break;
      }
      case '7': {
        return 'Luglio';
        break;
      }
      case '8': {
        return 'Agosto';
        break;
      }
      case '9': {
        return 'Settembre';
        break;
      }
      case '10': {
        return 'Ottobre';
        break;
      }
      case '11': {
        return 'Novembre';
        break;
      }
      case '12': {
        return 'Dicembre';
        break;
      }
    }
  }
  ExportCSV() {
    let body = {
      anno: this.selectedAnnoRapportino,
      mese: this.selectedMeseRapportino,
    };
    this.listaRapportiniService.getExcelRapportino(this.token, body).subscribe(
      (result: any) => {
        console.log(result);
        if (result['rapportinoB64'] != null) {
          this.downloadExcelFile(result['rapportinoB64']);
        } else {
          alert(
            'Non ce nessun utente con il mese di ' +
              this.transcodificaMesi(this.selectedMeseRapportino) +
              ' ' +
              this.selectedAnnoRapportino
          );
        }
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il caricamento del rapportino: ' +
            JSON.stringify(error)
        );
      }
    );
  }

  downloadExcelFile(base64: string): void {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'nome_file.xlsx');
  }
  onTipoContrattoChange(event: Event) {
    const selectedTipoContratto = (event.target as HTMLSelectElement).value;
    const dataFineRapportoControl = this.filterAnagraficaDto.get(
      'contratto.dataFineRapporto'
    );

    if (dataFineRapportoControl) {
      if (selectedTipoContratto === 'Indeterminato') {
        console.log('Selezionato contratto: ' + selectedTipoContratto);
        this.inseritoContrattoIndeterminato = false;
        dataFineRapportoControl.disable();
      } else {
        console.log('Selezionato contratto: ' + selectedTipoContratto);
        dataFineRapportoControl.enable();
        this.inseritoContrattoIndeterminato = true;
      }
    }
  }

  caricaAziendeClienti() {
    this.contrattoService.getAllAziendaCliente(this.token).subscribe(
      (result: any) => {
        // console.log('NOMI AZIENDE CARICATI:' + JSON.stringify(result));
        this.aziendeClienti = (result as any)['list'];
      },
      (error: any) => {
        console.error(
          'errore durante il caricamento dei nomi azienda:' + error
        );
      }
    );
  }

  caricaTipoContratto() {
    this.contrattoService
      .getTipoContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiContratti = (result as any)['list'];
      });
  }

  caricaTipoAzienda() {
    this.contrattoService
      .getTipoAzienda(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiAziende = (result as any)['list'];
      });
  }

  caricaContrattoNazionale() {
    this.contrattoService
      .getContrattoNazionale(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiCcnl = (result as any)['list'];
      });
  }

  checkCommesse(
    filtroCliente: any,
    filtroAzienda: any,
    filtroNominativo: any,
    commesse: any
  ) {
    var check = false;

    if (commesse.length == 0) {
      return check;
    } else {
      for (const element of commesse) {
        if (
          element.cliente == filtroCliente ||
          element.azienda == filtroAzienda ||
          element.nominativo == filtroNominativo
        ) {
          check = true;
        }
      }
    }

    return check;
  }

  onChangeTipoContrattoValue(event: any) {
    const selectedValue = parseInt(event.target.value, 10);

    const livelliCCNL = this.filterAnagraficaDto.get(
      'contratto.tipoLivelloContratto.id'
    );

    if (!isNaN(selectedValue)) {
      // Cerca l'opzione selezionata nei contratti nazionali
      const selectedOption = this.tipiCcnl.find(
        (canale: any) => canale.id === selectedValue
      );

      if (selectedOption) {
        console.log('Opzione selezionata: ', selectedOption);
        this.idCCNLselezionato = selectedOption.descrizione;
        livelliCCNL?.enable();

        this.anagraficaDtoService
          .changeCCNL(localStorage.getItem('token'), this.idCCNLselezionato)
          .subscribe(
            (response: any) => {
              // console.log(
              //   'RESPONSE NUOVA LISTA LIVELLI CCNL:' + JSON.stringify(response)
              // );
              this.elencoLivelliCCNL = response.list;
              // console.log(
              //   '+-+-+-+-+-+-+-+-+-+-+-NUOVA LISTA LIVELLI CCNL+-+-+-+-+-+-+-+-+-+-+-' +
              //     JSON.stringify(this.elencoLivelliCCNL)
              // );
            },
            (error: any) => {
              console.error(
                'Errore durante il caricamento dei livelli di contratto: ' +
                  error
              );
            }
          );
      } else {
        console.log('Opzione non trovata ');
      }
    } else {
      console.log('Valore non valido ');
    }
  }

  filterListNotFreeze(value: any) {
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
          // Rimuovi l'array se è un array vuoto o un oggetto vuoto
          if (Array.isArray(obj[key]) && obj[key].length === 0) {
            delete obj[key];
          } else if (Object.keys(obj[key]).length === 0) {
            delete obj[key];
          }
        } else if (obj[key] === '' || obj[key] === null) {
          delete obj[key];
        }
        if (obj.anagrafica && Object.keys(obj.anagrafica).length === 0) {
          delete obj.anagrafica;
        }
        if (obj.contratto && Object.keys(obj.contratto).length === 0) {
          delete obj.contratto;
        }
        if (obj.tipoContratto && Object.keys(obj.tipoContratto).length === 0) {
          delete obj.tipoContratto;
        }
        if (obj.tipoAzienda && Object.keys(obj.tipoAzienda).length === 0) {
          delete obj.tipoAzienda;
        }
        if (obj.tipoCcnl && Object.keys(obj.tipoCcnl).length === 0) {
          delete obj.tipoCcnl;
        }
        if (
          obj.tipoLivelloContratto &&
          Object.keys(obj.tipoLivelloContratto).length === 0
        ) {
          delete obj.tipoLivelloContratto;
        }

        if (
          obj.tipoCanaleReclutamento &&
          Object.keys(obj.tipoCanaleReclutamento).length === 0
        ) {
          delete obj.tipoCanaleReclutamento;
        }
        if (
          obj.tipoCausaFineRapporto &&
          Object.keys(obj.tipoCausaFineRapporto).length === 0
        ) {
          delete obj.tipoCausaFineRapporto;
        }
      });
    };

    removeEmpty(this.filterAnagraficaDto.value);
    const body = {
      anagraficaDto: this.filterAnagraficaDto.value,
      anno: this.selectedAnno,
      mese: this.selectedMese,
    };
    // console.log('PAYLOAD BACKEND FILTER: ' + JSON.stringify(body));

    this.listaRapportiniService
      .filterNotFreeze(localStorage.getItem('token'), body)
      .subscribe(
        (result) => {
          if ((result as any).esito.code != 200) {
            alert(
              'Qualcosa é andato storto\n' + ': ' + (result as any).esito.target
            );
          } else {
            if (Array.isArray(result.list)) {
              this.pageData = result.list;
            } else {
              this.pageData = [];
              this.messaggio =
                'Nessun risultato trovato per i filtri inseriti, riprova.';
            }
            // console.log(
            //   'Trovati i seguenti risultati: ' + JSON.stringify(result)
            // );
          }
        },
        (error: any) => {
          console.error('Si é verificato un errore: ' + JSON.stringify(error));
        }
      );
  }

  filterListFreeze(value: any) {
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
          // Rimuovi l'array se è un array vuoto o un oggetto vuoto
          if (Array.isArray(obj[key]) && obj[key].length === 0) {
            delete obj[key];
          } else if (Object.keys(obj[key]).length === 0) {
            delete obj[key];
          }
        } else if (obj[key] === '' || obj[key] === null) {
          delete obj[key];
        }
        if (obj.anagrafica && Object.keys(obj.anagrafica).length === 0) {
          delete obj.anagrafica;
        }
        if (obj.contratto && Object.keys(obj.contratto).length === 0) {
          delete obj.contratto;
        }
        if (obj.tipoContratto && Object.keys(obj.tipoContratto).length === 0) {
          delete obj.tipoContratto;
        }
        if (obj.tipoAzienda && Object.keys(obj.tipoAzienda).length === 0) {
          delete obj.tipoAzienda;
        }
        if (obj.tipoCcnl && Object.keys(obj.tipoCcnl).length === 0) {
          delete obj.tipoCcnl;
        }
        if (
          obj.tipoLivelloContratto &&
          Object.keys(obj.tipoLivelloContratto).length === 0
        ) {
          delete obj.tipoLivelloContratto;
        }

        if (
          obj.tipoCanaleReclutamento &&
          Object.keys(obj.tipoCanaleReclutamento).length === 0
        ) {
          delete obj.tipoCanaleReclutamento;
        }
        if (
          obj.tipoCausaFineRapporto &&
          Object.keys(obj.tipoCausaFineRapporto).length === 0
        ) {
          delete obj.tipoCausaFineRapporto;
        }
      });
    };

    removeEmpty(this.filterAnagraficaDto.value);
    const body = {
      anagraficaDto: this.filterAnagraficaDto.value,
      anno: this.selectedAnno,
      mese: this.selectedMese,
    };
    // console.log('PAYLOAD BACKEND FILTER: ' + JSON.stringify(body));

    this.listaRapportiniService
      .filterFreeze(localStorage.getItem('token'), body)
      .subscribe(
        (result) => {
          if ((result as any).esito.code != 200) {
            alert(
              'Qualcosa é andato storto\n' + ': ' + (result as any).esito.target
            );
          } else {
            if (Array.isArray(result.list)) {
              this.pageData2 = result.list;
            } else {
              this.pageData2 = [];
              this.messaggio =
                'Nessun risultato trovato per i filtri inseriti, riprova.';
            }
            // console.log(
            //   'Trovati i seguenti risultati: ' + JSON.stringify(result)
            // );
          }
        },
        (error: any) => {
          console.error('Si é verificato un errore: ' + error);
        }
      );
  }

  annullaFiltri() {
    this.anagraficaDtoService
      .listAnagraficaDto(localStorage.getItem('token'))
      .subscribe((resp: any) => {
        this.lista = resp.list;
        location.reload();
      });
  }

  reset() {
    this.filterAnagraficaDto.reset();
    location.reload();
  }

  //fine roba filtri

  getAllRapportiniNonFreezati() {
    let body = {
      anno: this.selectedAnno,
      mese: this.selectedMese,
    };
    // console.log('BODY RAPPORTINI DA CONTROLLARE: ' + JSON.stringify(body));
    this.listaRapportiniService
      .getAllRapportiniNonFreezati(this.token, body)
      .subscribe(
        (result: any) => {
          console.log('Rapportini non freezati ' + JSON.stringify(result));
          this.getAllRapportiniNotFreezeCorretto = true;
          this.elencoRapportiniNonFreezati = result['list'];
          this.selectedMeseRapportinoNonFreezato = result['list']['mese'];
          this.selectedAnnoRapportinoNonFreezato = result['list']['anno'];
          this.currentPage = 1;
          this.pageData = this.getCurrentPageItems();
          // console.log(
          //   'ELENCO RAPPORTINI NON FREEZATI:' +
          //     JSON.stringify(this.elencoRapportiniNonFreezati)
          // );
          this.getAllRapportiniFreezati();
        },
        (error: any) => {
          console.error(
            'Errore durante il caricamento dei rapportini not freeze: ' +
              JSON.stringify(error)
          );
        }
      );
  }

  deleteRapportino(codiceFiscale: any, anno: any, mese: any) {
    let body = {
      rapportinoDto: {
        anagrafica: {
          codiceFiscale: codiceFiscale,
        },
        annoRequest: anno,
        meseRequest: mese,
      },
    };
    console.log('Rapportino test ' + JSON.stringify(body));
    this.listaRapportiniService.deleteRapportino(this.token, body).subscribe(
      (result: any) => {
        console.log('Rapportini update ' + JSON.stringify(result));

        // console.log(
        //   'Rapportini freezati caricati: ' +
        //     JSON.stringify(this.elencoRapportiniFreezati)
        // );
        //  this.insertRapportino();
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il caricamento dei rapportini freezati: ' +
            JSON.stringify(error)
        );
      }
    );
  }

  getAllRapportiniFreezati() {
    let body = {
      anno: this.selectedAnno,
      mese: this.selectedMese,
    };
    // console.log('BODY RAPPORTINI CONTROLLATI: ' + JSON.stringify(body));

    this.listaRapportiniService
      .getAllRapportiniFreezati(this.token, body)
      .subscribe(
        (result: any) => {
          console.log('Rapportini freezati ' + JSON.stringify(result));
          this.elencoRapportiniFreezati = result['list'];
          this.currentPage2 = 1;
          this.pageData2 = this.getCurrentPageItems2();
          // console.log(
          //   'Rapportini freezati caricati: ' +
          //     JSON.stringify(this.elencoRapportiniFreezati)
          // );
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
    this.rapportinoService.deleteRapportino(this.token, id).subscribe(
      (result: any) => {
        // console.log(
        //   'RAPPORTINO NUMERO ' +
        //     id +
        //     ' ELIMINATO CORRETTAMENTE: ' +
        //     JSON.stringify(result)
        // );
      },
      (error: any) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  eliminaRapportinoFreezato(index: number) {
    console.log(index);
  }

  onChangecheckFreeze(
    checkFreeze: boolean,
    codiceFiscale: string,
    index: number,
    anno: number,
    mese: number
  ) {
    const dialogRef = this.dialog.open(AlertConfermaComponent, {
      data: {
        image: '../../../../assets/images/danger.png',
        title: 'Attenzione:',
        message: 'Confermi di voler cambiare lo stato del rapportino?',
      },
      disableClose: true,
    });

    dialogRef.componentInstance.conferma.subscribe(() => {
      const body = {
        rapportino: {
          id: index,
          codiceFiscale: codiceFiscale,
          anno: anno,
          mese: mese,
          checkFreeze: checkFreeze,
        },
      };
      // console.log('PAYLOAD CHECKFREEZE TRUE:' + JSON.stringify(body));
      this.listaRapportiniService.UpdateCheckFreeze(this.token, body).subscribe(
        (result: any) => {
          console.log('RAPPORTINO CONGELATO:' + JSON.stringify(result));
          this.getAllRapportiniFreezati();
          this.getAllRapportiniNonFreezati();
          if (checkFreeze == false) {
            this.deleteRapportino(codiceFiscale, anno, mese);
          }
        },
        (error: any) => {
          console.error(
            'Errore durante il congelamento del rapportino: ' +
              JSON.stringify(error)
          );
        }
      );
    });
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
              image: '../../../../assets/images/danger.png',
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
            image: '../../../../assets/images/danger.png',
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

  scarica() {
    // console.log(value.value);
    // if (value.valid) {
    let body = {
      anno: this.selectedAnno,
      mese: this.selectedMese,
    };
    console.log('Body per file export' + JSON.stringify(body));
    this.listaRapportiniService
      .exportFileRapportino(this.token, body)
      .subscribe(
        (result: any) => {
          // console.log('Response export rapportino: ', JSON.stringify(result));
          const rapportinoBase64 = result.rapportinoB64;
          console.log('BASE64: ' + rapportinoBase64);
          // Decodifica il Base64 in un array di byte
          const byteCharacters = atob(rapportinoBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          // Crea un oggetto Blob dal byte array
          const blob = new Blob([byteArray], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          // Salva il file Excel utilizzando FileSaver
          FileSaver.saveAs(blob, 'rapportino.xlsx');
        },
        (error: any) => {
          console.error(
            'Errore durante l export del rapportino:' + JSON.stringify(error)
          );
        }
      );
    // }
  }

  sollecita(mailAziendale: string) {
    const dialogRef = this.dialog.open(MailSollecitaComponent, {
      data: { elencoMail: this.elencoMail },
    });
  }

  toggleSelezione() {
    this.elencoMail = [];
    this.tutteLeRigheSelezionate = !this.tutteLeRigheSelezionate;
    this.pageData.forEach((rapportino) => {
      if (!rapportino.anagrafica.checkInviato) {
        rapportino.rowSelected = this.tutteLeRigheSelezionate;
        if (this.tutteLeRigheSelezionate) {
          this.elencoMail.push(rapportino.anagrafica.mailAziendale);
        }
      }
    });

    console.log(
      "L'elenco al momento contiene le seguenti mail: " +
        JSON.stringify(this.elencoMail)
    );
  }

  selezionaRiga(rapportino: any) {
    console.log('RAPPORTINO:' + JSON.stringify(rapportino));
    const checkInviato = rapportino.anagrafica.checkInviato;
    console.log('Check inviato select all rows ' + checkInviato);
    if (rapportino.rowSelected) {
      this.elencoMail.push(rapportino.anagrafica.mailAziendale);
    } else {
      const index = this.elencoMail.indexOf(
        rapportino.anagrafica.mailAziendale
      );

      if (index !== -1 || checkInviato) {
        this.elencoMail.splice(index, 1);
      }
    }

    console.log(
      "L'elenco al momento contiene le seguenti mail: " +
        JSON.stringify(this.elencoMail)
    );
  }

  getRapportino(
    id: any,
    nome: any,
    cognome: any,
    codiceFiscale: any,
    mese: any,
    anno: any
  ) {
    console.log(
      'DATI IN LISTA RAPPORTINI PER ROTTA ' + id,
      nome,
      cognome,
      codiceFiscale,
      mese,
      anno
    );
    this.router.navigate([
      '/dettaglio-rapportino',
      id,
      nome,
      cognome,
      codiceFiscale,
      mese,
      anno,
    ]);
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
        this.codiceFiscale = response.anagraficaDto.anagrafica.codiceFiscale;
        this.ruolo = response.anagraficaDto.ruolo.descrizione;
        this.idAnagraficaLoggata = response.anagraficaDto.anagrafica.id;
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
      },
      (error: any) => {
        this.authService.logout();
      }
    );
  }

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));

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

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idAnagraficaLoggata]);
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

  //paginazione tabella rapportini non freezati

  onChaneItemsPerPage(event: any) {
    const target = parseInt(event.target.value, 10);
    if (!isNaN(target)) {
      this.itemsPerPage = target;
      this.currentPage = 1;
      this.pageData = this.getCurrentPageItems();
    }
  }

  getCurrentPageItems(): any[] {
    if (!this.elencoRapportiniNonFreezati) {
      return [];
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.elencoRapportiniNonFreezati.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
      this.pageData = this.getCurrentPageItems();
    }
  }

  getTotalPages(): number {
    return Math.ceil(
      (this.elencoRapportiniNonFreezati?.length || 0) / this.itemsPerPage
    );
  }

  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  //fine paginazione tabella rapportini non freezati

  //paginazione tabella rapportini  freezati

  onChangeItemsPerPageFreeze(event: any) {
    const target = parseInt(event.target.value, 10);
    if (!isNaN(target)) {
      this.itemsPerPage2 = target;
      this.currentPage2 = 1;
      this.pageData2 = this.getCurrentPageItems();
    }
  }

  getCurrentPageItems2(): any[] {
    if (!this.elencoRapportiniFreezati) {
      return [];
    }

    const startIndex = (this.currentPage2 - 1) * this.itemsPerPage2;
    const endIndex = startIndex + this.itemsPerPage2;
    return this.elencoRapportiniFreezati.slice(startIndex, endIndex);
  }

  goToPage2(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages2()) {
      this.currentPage2 = pageNumber;
      this.pageData2 = this.getCurrentPageItems2();
    }
  }

  getTotalPages2(): number {
    return Math.ceil(
      (this.elencoRapportiniFreezati?.length || 0) / this.itemsPerPage2
    );
  }

  getPaginationArray2(): number[] {
    const totalPages = this.getTotalPages2();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  //fine paginazione tabella rapportini  freezati

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
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
