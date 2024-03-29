import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsService } from '../nuova-anagrafica-dto/maps.service';
import { AnagraficaDtoService } from './../anagraficaDto-service';
import { CommessaDuplicata } from './commessaDuplicata';
import { Commessa } from '../nuova-anagrafica-dto/commessa';
import { DatePipe } from '@angular/common';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { AuthService } from '../../login/login-service';
import { ContrattoService } from '../../contratto/contratto-service';
import { MenuService } from '../../menu.service';
import { ImageService } from '../../image.service';
import { StepperService } from 'src/app/stepper.service';
import { ThemeService } from 'src/app/theme.service';
import { AlertConfermaComponent } from 'src/app/alert-conferma/alert-conferma.component';

@Component({
  selector: 'app-modifica-anagrafica-dto',
  templateUrl: './modifica-anagrafica-dto.component.html',
  styleUrls: ['./modifica-anagrafica-dto.component.scss'],
})
export class ModificaAnagraficaDtoComponent implements OnInit {
  utenti: any = [];
  maxCommessaId: any;
  data: any;
  id = this.activatedRouter.snapshot.params['id'];
  nome=this.activatedRoute.snapshot.params['nome'];
  cognome=this.activatedRoute.snapshot.params['cognome'];
  submitted = false;
  errore = false;
  messaggio: any;
  selectedTipoCausaFineRapporto: any; // o il tipo appropriato per il valore selezionato
  showErrorPopup: any;
  showSuccessPopup: any;
  commessaDuplicata = new CommessaDuplicata();
  currentCommessa: any;
  //TIPOLOGICHE
  tipiContratti: any = [];
  tipiCausaFineContratto: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  ccnl: any = [];
  ruoli: any = [];
  currentStep = 1;
  anagraficaDto: FormGroup;
  commessePresenti = false;
  elencoCommesse: any[] = []; // Dichiarazione dell'array di FormGroup
  commesseVuote: any;
  contratto: any;
  contrattoVuoto: any;
  nuovoId: any;
  tipologicaCanaliReclutamento: any[] = [];
  motivazioniFineRapporto: any[] = [];
  variabileGenerica: any;
  inseritoContrattoIndeterminato: boolean = false;
  contrattoStageOApprendistato: any;
  percentualePartTimeValue: number | null = null;
  dataOdierna: any;
  dataFormattata: any;
  selectedTipoContrattoId: any;
  numeroMensilitaCCNL: any;
  numeroMensilitaDaDettaglio: any;
  minimiRet23: any;
  tipoDiContrattoControl: any;
  tipoContratto: any;
  descrizioneLivelloCCNL: any;
  elencoLivelliCCNL: any[] = [];
  mensileTOT: any;
  mobile: any = false;
  //dati per la navbar
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  aziendeClienti: any[] = [];
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
  @ViewChild('stepper') stepper: any;
  idUtente: any;
  nazioni: string[] = [];
  capitali: any[] = [];
  province: any[] = [];
  dati: any = [];
  statoDiNascita: any;
  provinciaDiNascita: string = '';
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
  ruolo: any;
  tokenExpirationTime: any;
  timer: any;
  elencoProvince: any[]=[];
  elencoComuni: any[]=[];
  elencoComuniNascita:any[]=[];
  elencoComuniResidenza:any[]=[];
  elencoComuniDomicilio:any[]=[];
  siglaProvinciaNascita: any;
  siglaProvinciaResidenza:any;
  siglaProvinciaDomicilio:any;
  residenzaDomicilioUguali: any;
  elencoNazioni: any[] = [];
  elencoCittadinanze1: any[] = [];
  elencoCittadinanze2: any[] = [];

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private imageService: ImageService,
    public dialog: MatDialog,
    public profileBoxService: ProfileBoxService,
    private http: HttpClient,
    public themeService: ThemeService,
    private contrattoService: ContrattoService,
    private authService: AuthService,
    private menuService: MenuService,
    private mapsService: MapsService,
    private stepperService: StepperService,
    private cdRef: ChangeDetectorRef

  ) {
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

    // console.log(
    //   '+++++++++++++++++++++++++++ID ANAGRAFICA CORRENTE: ' + this.id
    // );
    this.dataOdierna = new Date();
    if (this.dataOdierna) {
      this.dataFormattata = this.datePipe.transform(
        this.dataOdierna,
        'yyyy-MM-dd'
      );
      if (this.dataFormattata) {
        // console.log('DATA DI OGGI FORMATTATA: ' + this.dataFormattata);
      }
    }

    this.anagraficaDto = this.formBuilder.group({
      anagrafica: this.formBuilder.group({
        id: [this.id],
        tipoAzienda: this.formBuilder.group({ id: [''] }),
        nome: ['', Validators.required],
        cognome: ['', Validators.required],
        codiceFiscale: ['', Validators.required],
        dataDiNascita: [''],
        indirizzoResidenza: [''],
        indirizzoDomicilio: [''],
        cellularePrivato: ['',  Validators.pattern(/^(\+\d{1,3}\s?)?\d{10,}$/)],
        cellulareAziendale: ['',Validators.pattern(/^(\+\d{1,3}\s?)?\d{10,}$/)],
        mailPrivata: ['',Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),],
        mailAziendale: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),],],
        mailPec: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),],],
        titoliDiStudio: [''],
        altriTitoli: [''],
        coniugato: [''],
        figliACarico: [''],
        attesaLavori: [''],
        tipoCanaleReclutamento: this.formBuilder.group({
          id: [''],
        }),
      residenzaDomicilioUguali:[''],
        categoriaProtetta: [''],
        idStatoNascita:  this.formBuilder.group({
          id: [''],
          siglaNazione: [''],
          codiceBelfiore: [''],
          denominazioneNazione: [''],
          denominazioneCittadinanza: ['']
        }),
        idCittadinanza1: this.formBuilder.group({
          id:[''],
          siglaNazione:[''],
          codiceBelfiore: [''],
          denominazioneNazione:[''],
          denominazioneCittadinanza: ['']
        }),
        idCittadinanza2: this.formBuilder.group({
          id:[''],
          siglaNazione: [''],
          codiceBelfiore: [''],
          denominazioneNazione: [''],
          denominazioneCittadinanza: ['']
        }),
        capResidenza: [''],
        capDomicilio:  [''],
        localitaResidenzaEstera:  [''],
        localitaDomicilioEstero: [''],
        provinciaDiNascita: this.formBuilder.group({
          id: [''],
          siglaProvincia:  [''],
          denominazione_provincia: [''],
          tipologiaProvincia:  [''],
          numeroComuni: ['']
        }),
        comuneDiNascita:this.formBuilder.group({
          id: [''],
          siglaProvincia: [''],
          codiceIstat:  [''],
          denominazioneItaAltra:  [''],
          denominazione_ita:  [''],
          denominazione_altra:  [''],
          flag_capoluogo: ['']
        }),
        provinciaResidenza: this.formBuilder.group({
          id: [''],
          siglaProvincia: [''],
          denominazione_provincia:[''],
          tipologiaProvincia: [''],
          numeroComuni:[''],
        }),
        comuneResidenza: this.formBuilder.group({
          id: [''],
          siglaProvincia: [''],
          codiceIstat: [''],
          denominazioneItaAltra:[''],
          denominazione_ita: [''],
          denominazione_altra: [''],
          flag_capoluogo: [''],
        }),
        provinciaDomicilio: this.formBuilder.group({
          id: [''],
          siglaProvincia: [''],
          denominazione_provincia:[''],
          tipologiaProvincia: [''],
          numeroComuni:[''],
        }),
        comuneDomicilio:this.formBuilder.group({
          id: [''],
          siglaProvincia: [''],
          codiceIstat: [''],
          denominazioneItaAltra:[''],
          denominazione_ita: [''],
          denominazione_altra: [''],
          flag_capoluogo: [''],
        }),
        piva: [''],
        nomeAzienda:[''] //ragione sociale
      }),
      commesse: this.formBuilder.array([]),

      contratto: this.formBuilder.group({
        id: [''],
        tipoAzienda: this.formBuilder.group({
          id: [''],
        }),
        tipoContratto: this.formBuilder.group({
          id: [''],
        }),

        tipoCcnl: this.formBuilder.group({
          id: [''],
        }),
        tipoLivelloContratto: this.formBuilder.group({
          id: [''],
        }),
        qualifica: ['', Validators.required],
        sedeAssunzione: [''],
        dataAssunzione: [''],
        dataInizioProva: [''],
        dataFineProva: [''],
        dataFineRapporto: [''],
        dataFineContratto: [''],
        mesiDurata: [''],
        livelloAttuale: [''],
        livelloFinale: [''],
        partTime: [''],
        percentualePartTime: [''],
        retribuzioneMensileLorda: [
          '',
          [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')],
        ],
        superminimoMensile: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        ralAnnua: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        diariaAnnua: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        ralPartTime: [''], //da non mettere nel form, sara un campo calcolato
        superminimoRal: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        diariaMensile: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        diariaGiornaliera: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        ticket: [''],
        valoreTicket: ['', Validators.maxLength(50)],
        tutor: [''],
        pfi: [''],
        retribuzioneNettaGiornaliera: [''],
        retribuzioneNettaMensile: [''],
        corsoSicurezza: [''],
        dataCorsoSicurezza: [''],
        tipoCausaFineRapporto: this.formBuilder.group({
          id: [''],
          // descrizione: [''],
        }),
        tipoCausaFineContratto: this.formBuilder.group({
          id: [''],
          descrizione: [''],
        }),
        scattiAnzianita: [''],
        assicurazioneObbligatoria: [''],
        pc: [''],
        tariffaPartitaIva: [''],
        costoAziendale: [''],
        visitaMedica: [''],
        dataVisitaMedica: [''],
      }),

      ruolo: this.formBuilder.group({
        id: [''],
      }),
    });
  }
  getCommessas(): FormArray {
    return this.anagraficaDto.get('commesse') as FormArray;
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


  onChangeProvinciaResidenza(event:any){ //metodo per catturare la provincia di residenza selezionata e filtrare i comuni
    const selectedValue = parseInt(event.target.value, 10);
    if (!isNaN(selectedValue)) {
      const selectedObject = this.elencoProvince.find(
        (provincia: any) => provincia.id === selectedValue
      );
      if (selectedObject) {
        console.log('Provincia selezionata: ', JSON.stringify(selectedObject));
        //qui andrá l endpoint per i comuni
        this.anagraficaDtoService.getComuni(localStorage.getItem('token'), selectedObject.siglaProvincia).subscribe(
          (resp: any) => {
            this.elencoComuni = (resp as any)['list'];
            const comuniControl=this.anagraficaDto.get('anagrafica.comuneResidenza.id');
            if(this.elencoComuni.length>0 && comuniControl){
              comuniControl.enable();
            }
          },
          (error: any) => {
            console.error(
              'Errore durante il caricamento delle province:' +
                JSON.stringify(error)
            );
          }
        )
      } else {
        console.log('Azienda non trovata nella lista');
      }
    } else {
      console.log('Valore non valido o provincia non selezionata');
      const comuniControl = this.anagraficaDto.get('anagrafica.comuneResidenza.id');
      if(comuniControl){
        comuniControl.disable();
        comuniControl.setValue("");
      }
    }
  }
  onChangeProvinciaDomicilio(event:any){ //metodo per catturare la provincia di domicilio selezionata e filtrare i comuni
    const selectedValue = parseInt(event.target.value, 10);
    if (!isNaN(selectedValue)) {
      const selectedObject = this.elencoProvince.find(
        (provincia: any) => provincia.id === selectedValue
      );
      if (selectedObject) {
        console.log('Provincia domicilio selezionata: ', JSON.stringify(selectedObject));
        this.anagraficaDtoService.getComuni(localStorage.getItem('token'), selectedObject.siglaProvincia).subscribe(
          (resp: any) => {
            this.elencoComuni = (resp as any)['list'];
            const comuniDomicilioControl=this.anagraficaDto.get('anagrafica.comuneDomicilio.id');
            if(this.elencoComuni.length>0 && comuniDomicilioControl){
              comuniDomicilioControl.enable();
            }
          },
          (error: any) => {
            console.error(
              'Errore durante il caricamento delle province:' +
                JSON.stringify(error)
            );
          }
        )
      } else {
        console.log('Azienda non trovata nella lista');
      }
    } else {
      console.log('Valore non valido o provincia domicilio non selezionata');
      const comuniControl = this.anagraficaDto.get('anagrafica.comuneDomicilio.id');
      if(comuniControl){
        comuniControl.disable();
        comuniControl.setValue("");
      }
    }
  }

  onChangeProvinciaNascita(event:any){ //metodo per catturare la provincia di nascita selezionata e filtrare i comuni
    const selectedValue = parseInt(event.target.value, 10);
    if (!isNaN(selectedValue)) {
      const selectedObject = this.elencoProvince.find(
        (provincia: any) => provincia.id === selectedValue
      );
      if (selectedObject) {
        console.log('Provincia di nascita selezionata: ', JSON.stringify(selectedObject));
        this.anagraficaDtoService.getComuni(localStorage.getItem('token'), selectedObject.siglaProvincia).subscribe(
          (resp: any) => {
            this.elencoComuni = (resp as any)['list'];
            const comuniNascitaControl=this.anagraficaDto.get('anagrafica.comuneDiNascita.id');
            if(this.elencoComuni.length>0 && comuniNascitaControl){
              comuniNascitaControl.enable();
            }
          },
          (error: any) => {
            console.error(
              'Errore durante il caricamento delle province:' +
                JSON.stringify(error)
            );
          }
        )
      } else {
        console.log('Azienda non trovata nella lista');
      }
    } else {
      console.log('Valore non valido o provincia nascita non selezionata');
      const comuneNascitaControl = this.anagraficaDto.get('anagrafica.comuneDiNascita.id');
      if(comuneNascitaControl){
        comuneNascitaControl.disable();
        comuneNascitaControl.setValue("");
      }
    }
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
        else{

        }
      }, 1000);
    }


    if (this.token != null) {
      this.getUserLogged();
      this.inizializzaStatoCampiDistacco();
      this.caricaTipoContratto();
      this.caricaTipoAzienda();
      this.caricaContrattoNazionale();
      this.changeElencoLivelliCCNL();
      this.caricaDati();
      this.caricaAziendeClienti();
      this.calculateRalPartTime();
      this.caricaRuoli();
      this.creaFormCommessa();
      this.caricaTipoCanaleReclutamento();
      this.caricaTipoCausaFineRapporto();
      this.caricaLivelloContratto();
      this.caricaMappa();
      this.caricaTipoCausaFineContratto();
      this.getProvince();
      this. getAllNazioni();
      this.getAllCittadinanze1();
      this.getAllCittadinanze2();
      const tipoContratto = this.anagraficaDto.get(
        'contratto.tipoContratto.id'
      );

      const retribuzioneMensileLorda = this.anagraficaDto.get(
        'contratto.retribuzioneMensileLorda'
      );
      const superminimoMensileControl = this.anagraficaDto.get(
        'contratto.superminimoMensile'
      );
      const scattiAnzianitaControl = this.anagraficaDto.get(
        'contratto.scattiAnzianita'
      );
      if (
        retribuzioneMensileLorda?.value != null &&
        superminimoMensileControl?.value != null &&
        scattiAnzianitaControl?.value != null
      ) {
        // this.calcolaMensileTot();
        // console.log('Il mensile totale si puo calcolare.');
      } else {
        // console.warn(
        //   'Non é possibile calcolare il mensile totale perché mancano dei dati.'
        // );
      }

      //SE IL CONTRATTO É DIVERSO DA PARTITA IVA I CAMPI TARIFFA PARTITA IVA E RETRIBUZIONE NETTA GIORNALIERA SARANNO DISABILITATI
      const tariffaPartitaIvaControl = this.anagraficaDto.get(
        'contratto.tariffaPartitaIva'
      );

      const retribuzioneNettaGiornalieraControl = this.anagraficaDto.get(
        'contratto.retribuzioneNettaGiornaliera'
      );
      if (this.tipoDiContrattoControl != 'P.Iva') {
        if (tariffaPartitaIvaControl && retribuzioneNettaGiornalieraControl) {
          tariffaPartitaIvaControl.disable();
          retribuzioneNettaGiornalieraControl.disable();
        }
      }

      const ralPartTimeControl = this.anagraficaDto.get(
        'contratto.ralPartTime'
      );
      if (ralPartTimeControl) {
        ralPartTimeControl.disable();
      }

      this.anagraficaDto
        .get('contratto.dataAssunzione')
        ?.valueChanges.subscribe(() => {
          this.calculateDataFineContratto();
        });

      this.anagraficaDto
        .get('contratto.mesiDurata')
        ?.valueChanges.subscribe(() => {
          this.calculateDataFineContratto();
        });

      const tipoAziendaControlAnagrafica = this.anagraficaDto.get(
        'anagrafica.tipoAzienda.id'
      );
      const tipoAziendaControlContratto = this.anagraficaDto.get(
        'contratto.tipoAzienda.id'
      );
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          image: '../../../../assets/images/danger.png',
          title: 'Attenzione:',
          message: 'Errore di autenticazione, effettua il login.',
        },
      });
      this.authService.logout().subscribe(
        (response: any) => {
          if (response.status === 200) {
            // Logout effettuato con successo
            localStorage.removeItem('token');
            localStorage.removeItem('tokenProvvisorio');
            sessionStorage.clear();
            this.router.navigate(['/login']);
            this.dialog.closeAll();
          } else {
            // Gestione di altri stati di risposta (es. 404, 500, ecc.)
            // console.log(
            //   'Errore durante il logout:',
            //   response.status,
            //   response.body
            // );
            this.handleLogoutError();
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 403) {
            // Logout a causa di errore 403 (Forbidden)
            // console.log('Errore 403: Accesso negato');
            this.handleLogoutError();
          } else {
            // Gestione di altri errori di rete o server
            // console.log('Errore durante il logout:', error.message);
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

  caricaMappa() {
    this.mapsService.getData().subscribe((data: any) => {
      this.dati = data;
      this.nazioni = this.dati.map((item: any) => item.nazione);
    });
  }

  getProvince() {
    this.anagraficaDtoService.getProvince(this.token).subscribe(
      (resp: any) => {
        this.elencoProvince = (resp as any)['list'];
      },
      (error: any) => {
        console.error(
          'Errore durante il caricamento delle province:' +
            JSON.stringify(error)
        );
      }
    );
  }


  // onChangeNazione(event: any) {
  //   this.statoDiNascita = event.target.value; // Imposta la nazione selezionata

  //   // Inizializza le capitali con un array vuoto
  //   this.capitali = [];

  //   // Se "Italia" è selezionata, ottieni tutte le province italiane
  //   if (this.statoDiNascita === 'Italia') {
  //     this.province =
  //       this.dati
  //         .find((item: any) => item.nazione === 'Italia')
  //         ?.province.flatMap((regione: any) => regione.province) || [];

  //     // Inoltre, imposta le capitali italiane
  //     this.capitali =
  //       this.dati
  //         .find((item: any) => item.nazione === 'Italia')
  //         ?.province.map((regione: any) => regione.capitale) || [];
  //   } else {
  //     // Altrimenti, filtra le province in base alla nazione selezionata
  //     this.province =
  //       this.dati.find((item: any) => item.nazione === this.statoDiNascita)
  //         ?.province || [];

  //     // Recupera la capitale della nazione selezionata
  //     const capitaleNazione = this.dati.find(
  //       (item: any) => item.nazione === this.statoDiNascita
  //     )?.capitale;

  //     // Se la capitale è definita, aggiungila all'array delle capitali
  //     if (capitaleNazione) {
  //       this.capitali.push(capitaleNazione);
  //     }
  //   }

  //   // console.log('Nazione selezionata: ' + this.statoDiNascita);
  //   // console.log('Province selezionate: ' + JSON.stringify(this.province));
  //   // console.log('Capitali selezionate: ' + JSON.stringify(this.capitali));
  // }

  onChangeAziendaCliente(event: any) {
    const selectedValue = parseInt(event.target.value, 10);

    if (!isNaN(selectedValue)) {
      const selectedObject = this.tipiAziende.find(
        (azienda: any) => azienda.id === selectedValue
      );

      if (selectedObject) {
        // console.log('Azienda cliente selezionata: ', selectedObject);
      } else {
        // console.log('Azienda non trovata nella lista');
      }
    } else {
      // console.log('Valore non valido o azienda non selezionata');
    }
  }

  inizializzaStatoCampiDistacco(): void {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    commesseFormArray.controls.forEach((commessaControl, index) => {
      const distaccoControl = commessaControl.get('distacco');
      const distaccoAziendaControl = commessaControl.get('distaccoAzienda');
      const distaccoDataControl = commessaControl.get('distaccoData');

      if (distaccoControl && distaccoAziendaControl && distaccoDataControl) {
        const isChecked = distaccoControl.value;
        if (isChecked) {
          distaccoAziendaControl.enable();
          distaccoDataControl.enable();
        } else {
          distaccoAziendaControl.disable();
          distaccoDataControl.disable();
        }
      }
    });
  }

  onChangeTipoAzienda(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const selectedValue = parseInt(target.value, 10); // Converte il valore selezionato in un numero
      if (!isNaN(selectedValue)) {
        const selectedLivello = this.tipiAziende.find(
          (tipoAzienda: any) => tipoAzienda.id === selectedValue
        );

        if (selectedLivello) {
          // console.log('tipo contratto selezionato: ', selectedLivello);
        } else {
          // console.log('tipo contratto non trovato nella lista');
        }
      } else {
        // console.log('Valore non valido o tipo contratto non selezionato');
      }
    }
  }

  //conversione date
  convertiDateCommesse(commesse: any[]): void {
    for (let i = 0; i < commesse.length; i++) {
      const commessa = commesse[i];
      if (commessa.dataInizio) {
        commessa.dataInizio = this.datePipe.transform(
          commessa.dataInizio,
          'yyyy-MM-dd'
        );
      }
      if (commessa.dataFine) {
        commessa.dataFine = this.datePipe.transform(
          commessa.dataFine,
          'yyyy-MM-dd'
        );
      }
      if (commessa.distaccoData) {
        commessa.distaccoData = this.datePipe.transform(
          commessa.distaccoData,
          'yyyy-MM-dd'
        );
      }
    }
  }

  caricaDati(): void {
    this.anagraficaDtoService
      .detailAnagraficaDto(
        this.activatedRouter.snapshot.params['id'],
        localStorage.getItem('token')
      )
      .subscribe((resp: any) => {
        this.data = (resp as any)['anagraficaDto'];

        // Provincia di Nascita
        this.siglaProvinciaNascita = this.data?.anagrafica?.provinciaDiNascita?.siglaProvincia;
        if (this.data && this.siglaProvinciaNascita) {
          this.anagraficaDtoService.getComuni(localStorage.getItem('token'), this.siglaProvinciaNascita).subscribe(
            (resp: any) => {
              this.elencoComuniNascita = (resp as any)['list'];
            },
            (error: any) => {
              console.error("Errore durante il caricamento dei comuni di nascita: " + JSON.stringify(error));
            }
          );
        }

        // Provincia di Residenza
        this.siglaProvinciaResidenza = this.data?.anagrafica?.provinciaResidenza?.siglaProvincia;
        if (this.data && this.siglaProvinciaResidenza) {
          this.anagraficaDtoService.getComuni(localStorage.getItem('token'), this.siglaProvinciaResidenza).subscribe(
            (resp: any) => {
              this.elencoComuniResidenza = (resp as any)['list'];
            },
            (error: any) => {
              console.error("Errore durante il caricamento dei comuni di residenza: " + JSON.stringify(error));
            }
          );
        }

        // Provincia di Domicilio
        this.siglaProvinciaDomicilio = this.data?.anagrafica?.provinciaDomicilio?.siglaProvincia;
        if (this.data && this.siglaProvinciaDomicilio) {
          this.anagraficaDtoService.getComuni(localStorage.getItem('token'), this.siglaProvinciaDomicilio).subscribe(
            (resp: any) => {
              this.elencoComuniDomicilio = (resp as any)['list'];
            },
            (error: any) => {
              console.error("Errore durante il caricamento dei comuni di domicilio: " + JSON.stringify(error));
            }
          );
        }

        this.selectedTipoContrattoId = (resp as any)['anagraficaDto']['contratto']['tipoContratto']['id'];
        this.residenzaDomicilioUguali=(resp as any)['anagraficaDto']['anagrafica']['residenzaDomicilioUguali'];
        this.descrizioneLivelloCCNL = (resp as any)['anagraficaDto']['contratto']['tipoLivelloContratto']['ccnl'];
        this.setForm();
        this.anagraficaDtoService.changeCCNL(localStorage.getItem('token'),this.descrizioneLivelloCCNL).subscribe(
            (response: any) => {
              this.elencoLivelliCCNL = response.list;
            },
            (error: any) => {
            }
          );

        for (const key in resp) {
          if (resp.hasOwnProperty(key)) {
            if (resp[key] === null) {
              const element = document.querySelector(`[name="${key}"]`);
              if (element) {
                this.renderer.addClass(element, 'campo-nullo');
              }
            }
          }
        }

        //conversione date
        if (this.data.contratto && this.data.contratto.dataAssunzione) {
          this.data.contratto.dataAssunzione = this.datePipe.transform(
            this.data.contratto.dataAssunzione,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataInizioProva) {
          this.data.contratto.dataInizioProva = this.datePipe.transform(
            this.data.contratto.dataInizioProva,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataFineProva) {
          this.data.contratto.dataFineProva = this.datePipe.transform(
            this.data.contratto.dataFineProva,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataFineRapporto) {
          this.data.contratto.dataFineRapporto = this.datePipe.transform(
            this.data.contratto.dataFineRapporto,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataFineContratto) {
          this.data.contratto.dataFineContratto = this.datePipe.transform(
            this.data.contratto.dataFineContratto,
            'yyyy-MM-dd'
          );
        }
        if (this.data.anagrafica && this.data.anagrafica.dataDiNascita) {
          this.data.anagrafica.dataDiNascita = this.datePipe.transform(
            this.data.anagrafica.dataDiNascita,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataCorsoSicurezza) {
          this.data.contratto.dataCorsoSicurezza = this.datePipe.transform(
            this.data.contratto.dataCorsoSicurezza,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataVisitaMedica) {
          this.data.contratto.dataVisitaMedica = this.datePipe.transform(
            this.data.contratto.dataVisitaMedica,
            'yyyy-MM-dd'
          );
        }

        this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
        this.contratto = (resp as any)['anagraficaDto']['contratto'];
        if (this.contratto == null) {
          // console.log('Niente contratto.');
          this.contrattoVuoto = true;
        } else {
          this.contrattoVuoto = false;
          // console.log('Dati del contratto: ' + JSON.stringify(this.contratto));
          this.numeroMensilitaDaDettaglio = (resp as any)['anagraficaDto'][
            'contratto'
          ]['tipoCcnl']['numeroMensilita'];
          // console.log(
          //   'NUMBER MENSILITA DA DETTAGLIO:' + this.numeroMensilitaDaDettaglio
          // );

          this.tipoDiContrattoControl =
            this.contratto.tipoContratto.descrizione;
          // console.log('TIPO DI CONTRATTO: ' + this.tipoDiContrattoControl);
          if (this.tipoDiContrattoControl === 'Stage') {
            const retribuzioneNetta = this.anagraficaDto.get(
              'contratto.retribuzioneMensileNetta'
            );
          }
        }
        if (this.elencoCommesse === null) {
          // console.log('Niente commesse.');
          this.commesseVuote = true;
        } else {
          this.commesseVuote = false;
          // console.log(
          //   'Elenco commesse presenti: ' + JSON.stringify(this.elencoCommesse)
          // );
          this.convertiDateCommesse(this.elencoCommesse);
        }
        this.initializeCommesse();
        this.anagraficaDto.patchValue(this.data);
      });

    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    commesseFormArray.controls.forEach((commessaControl: AbstractControl) => {
      const distaccoControl = commessaControl.get('distacco');
      if (distaccoControl) {
        distaccoControl.valueChanges.subscribe((isChecked: any) => {
          if (isChecked) {
            this.enableDistaccoFieldsForCommessa(commessaControl);
          } else {
            this.disableDistaccoFieldsForCommessa(commessaControl);
          }
        });
      }
    });
  }



  disableDistaccoFieldsForAllCommesse(): void {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    commesseFormArray.controls.forEach((commessaControl: AbstractControl) => {
      const distaccoAziendaControl = commessaControl.get('distaccoAzienda');
      const distaccoDataControl = commessaControl.get('distaccoData');
      if (distaccoAziendaControl) {
        distaccoAziendaControl.disable();
      }
      if (distaccoDataControl) {
        distaccoDataControl.disable();
      }
    });
  }

  equalsResidenzaDomicilio(event: any): void {
    this.residenzaDomicilioUguali = event.target.checked;
    console.log('Toggle Switch is now:', this.residenzaDomicilioUguali);
    const indirizzoDomicilioControl=this.anagraficaDto.get('anagrafica.indirizzoDomicilio');
      const provinciaDomicilioControl=this.anagraficaDto.get('anagrafica.provinciaDomicilio.id');
      const comuniDomicilioControl=this.anagraficaDto.get('anagrafica.comuneDomicilio.id');
      const capDomicilioControl=this.anagraficaDto.get('anagrafica.capDomicilio');
    if(this.residenzaDomicilioUguali && indirizzoDomicilioControl && provinciaDomicilioControl && comuniDomicilioControl && capDomicilioControl){

      indirizzoDomicilioControl.disable();
      indirizzoDomicilioControl.setValue(null);
      indirizzoDomicilioControl.clearValidators();
      indirizzoDomicilioControl.updateValueAndValidity();

      capDomicilioControl.disable();
      capDomicilioControl.setValue(null);
      capDomicilioControl.clearValidators();
      capDomicilioControl.updateValueAndValidity();

      provinciaDomicilioControl.disable();
      provinciaDomicilioControl.setValue("");
      provinciaDomicilioControl.clearValidators();
      provinciaDomicilioControl.updateValueAndValidity();

      comuniDomicilioControl.disable();
      comuniDomicilioControl.setValue("");
      comuniDomicilioControl.clearValidators();
      comuniDomicilioControl.updateValueAndValidity();

    }
    if(!this.residenzaDomicilioUguali && indirizzoDomicilioControl && provinciaDomicilioControl && comuniDomicilioControl && capDomicilioControl){
      indirizzoDomicilioControl.enable();
      indirizzoDomicilioControl.setValidators([Validators.required]);
      indirizzoDomicilioControl.updateValueAndValidity();
      capDomicilioControl.enable();
      capDomicilioControl.setValidators([Validators.required]);
      capDomicilioControl.updateValueAndValidity();

      provinciaDomicilioControl.enable();
      provinciaDomicilioControl.setValidators([Validators.required]);
      provinciaDomicilioControl.updateValueAndValidity();
      // comuniDomicilioControl.enable(); //questo resta disattivato per permettere l uso del filtro dei comuni
      comuniDomicilioControl.setValidators([Validators.required]);
      comuniDomicilioControl.updateValueAndValidity();
    }
  }

  enableDistaccoFieldsForCommessa(commessaControl: AbstractControl): void {
    const distaccoAziendaControl = commessaControl.get('distaccoAzienda');
    const distaccoDataControl = commessaControl.get('distaccoData');
    if (distaccoAziendaControl) {
      distaccoAziendaControl.enable();
    }
    if (distaccoDataControl) {
      distaccoDataControl.enable();
    }
  }

  disableDistaccoFieldsForCommessa(commessaControl: AbstractControl): void {
    const distaccoAziendaControl = commessaControl.get('distaccoAzienda');
    const distaccoDataControl = commessaControl.get('distaccoData');
    if (distaccoAziendaControl) {
      distaccoAziendaControl.disable();
    }
    if (distaccoDataControl) {
      distaccoDataControl.disable();
    }
  }

  onPartTimeChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      const percentualePartTimeControl = this.anagraficaDto.get(
        'contratto.percentualePartTime'
      );
      const ralAnnuaControl = this.anagraficaDto.get('contratto.ralAnnua');
      const ralPartTimeControl = this.anagraficaDto.get(
        'contratto.ralPartTime'
      );

      if (percentualePartTimeControl && ralAnnuaControl && ralPartTimeControl) {
        if (isChecked) {
          percentualePartTimeControl.enable();
          ralAnnuaControl.enable();
          this.calculateRalPartTime();
        } else {
          percentualePartTimeControl.disable();
          percentualePartTimeControl.setValue('');
          ralAnnuaControl.disable();
          ralAnnuaControl.setValue('');
          ralPartTimeControl.disable();
          ralPartTimeControl.setValue('');
        }
      }
    }
  }

  onChangeAssicurazioneObbligatoria(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        // console.log('Checkbox selezionata, il valore è true');
      } else {
        // console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  calculateRalPartTime() {
    const percentualePartTimeControl = this.anagraficaDto.get(
      'contratto.percentualePartTime'
    );
    const ralAnnuaControl = this.anagraficaDto.get('contratto.ralAnnua');
    const ralPartTimeControl = this.anagraficaDto.get('contratto.ralPartTime');

    if (percentualePartTimeControl && ralAnnuaControl && ralPartTimeControl) {
      const percentualePartTime = percentualePartTimeControl.value || 0;
      const ralAnnua = ralAnnuaControl.value || 0;

      const percentualeDecimal = percentualePartTime / 100;
      const ralPartTime = ralAnnua * percentualeDecimal;

      ralPartTimeControl.setValue(ralPartTime.toFixed(2)); // Formattato a due decimali
    }
  }

  /* Questo metodo gestisce il valore della  checkbox del distacco */
  onChangeDistaccoCommessa(event: Event, commessaIndex: number) {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    const commessaFormGroup = commesseFormArray.at(commessaIndex) as FormGroup;
    const distaccoControl = commessaFormGroup.get('distacco');
    const distaccoAziendaControl = commessaFormGroup.get('distaccoAzienda');
    const distaccoDataControl = commessaFormGroup.get('distaccoData');

    if (distaccoControl && distaccoAziendaControl && distaccoDataControl) {
      const isChecked = distaccoControl.value;
      if (isChecked) {
        distaccoAziendaControl.enable();
        distaccoDataControl.enable();
      } else {
        distaccoAziendaControl.disable();
        distaccoDataControl.disable();
      }
    }
  }

  onTicketChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        // console.log('Checkbox selezionata, il valore è true');
      } else {
        // console.log('Checkbox deselezionata, il valore è false');
      }

      const ticketControl = this.anagraficaDto.get('contratto.ticket');
      const valoreTicketControl = this.anagraficaDto.get(
        'contratto.valoreTicket'
      );

      if (ticketControl && valoreTicketControl) {
        if (isChecked) {
          valoreTicketControl.enable();
        } else {
          valoreTicketControl.disable();
        }
      }
    }
  }

  onChangeLivelloContratto(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const selectedValue = parseInt(target.value, 10); // Converte il valore selezionato in un numero
      if (!isNaN(selectedValue)) {
        const selectedLivello = this.livelliContratti.find(
          (livello: any) => livello.id === selectedValue
        );

        if (selectedLivello) {
          // console.log('Livello contratto selezionato: ', selectedLivello);
          this.minimiRet23 = selectedLivello.minimiRet23;
          // console.log('Minimi retributivi 2023:' + this.minimiRet23);
          const tipoContratto = this.anagraficaDto.get(
            'contratto.tipoContratto.id'
          );

          const selectedOption = this.anagraficaDto.get(
            'contratto.retribuzioneMensileLorda'
          );

          if (this.tipoDiContrattoControl.descrizione === 'Stage') {
            // console.log('é uno stage, NO retr lorda ma si retribuzione netta.');
            let retribuzioneMensileLorda = this.anagraficaDto.get(
              'contratto.retribuzioneMensileLorda'
            );
            let retribuzioneMensileNetta = this.anagraficaDto.get(
              'contratto.retribuzioneNettaMensile'
            );
            //controlli da fare sulle retribuzioni in caso il contratto sia uno stage
            if (retribuzioneMensileLorda && retribuzioneMensileNetta) {
              retribuzioneMensileLorda.setValue('');
              retribuzioneMensileLorda.disable();
              retribuzioneMensileLorda.updateValueAndValidity();

              retribuzioneMensileNetta.enable();
              retribuzioneMensileNetta.setValue(600);
              retribuzioneMensileNetta.updateValueAndValidity();
            }
          } else {
            // console.log('IL CONTRATTO NON É UNO STAGE.');
            let retribuzioneMensileLorda = this.anagraficaDto.get(
              'contratto.retribuzioneMensileLorda'
            );
            if (retribuzioneMensileLorda) {
              retribuzioneMensileLorda.setValue(this.minimiRet23);
              retribuzioneMensileLorda.updateValueAndValidity();
            }
          }
        } else {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Attenzione:',
              message: 'Livello contratto non trovato nella lista.',
            },
          });
        }
      } else {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            image: '../../../../assets/images/danger.png',
            title: 'Attenzione:',
            message: 'Valore non valido o livello contratto non selezionato.',
          },
        });
      }
    }
  }

  changeElencoLivelliCCNL() {
    // console.log(
    //   'VALORE VALORIZZATO PER ENDPOINT ' + this.descrizioneLivelloCCNL
    // );
    this.anagraficaDtoService
      .changeCCNL(localStorage.getItem('token'), this.descrizioneLivelloCCNL)
      .subscribe(
        (response: any) => {
          this.elencoLivelliCCNL = response['list'];
          // console.log(
          //   '+-+-+-+-+-+-+-+-+-+-+-NUOVA LISTA LIVELLI CCNL+-+-+-+-+-+-+-+-+-+-+-' +
          //     JSON.stringify(this.elencoLivelliCCNL)
          // );
        },
        (error: any) => {
          // console.error(
          //   'Errore durante il caricamento dei livelli di contratto: ' + error
          // );
        }
      );
  }

  onChangeCCNL(event: any) {
    const selectedValue = parseInt(event.target.value, 10);

    const livelloControl = this.anagraficaDto.get(
      'contratto.tipoLivelloContratto.id'
    );

    if (!isNaN(selectedValue)) {
      const selectedOption = this.ccnl.find(
        (ccnl: any) => ccnl.id === selectedValue
      );

      if (selectedOption) {
        // console.log('Opzione selezionata: ', selectedOption);
        this.numeroMensilitaCCNL = selectedOption.numeroMensilita;
        this.descrizioneLivelloCCNL = selectedOption.descrizione;
        // console.log('numero mensilitá:' + this.numeroMensilitaCCNL);
        livelloControl?.enable();
        // Qui andrà la chiamata per l'endpoint per la get del livello contratto
        this.anagraficaDtoService
          .changeCCNL(
            localStorage.getItem('token'),
            this.descrizioneLivelloCCNL
          )
          .subscribe(
            (response: any) => {
              this.elencoLivelliCCNL = response.list;
            },
            (error: any) => {
              // console.error(
              //   'Errore durante il caricamento dei livelli di contratto: ' +
              //     error
              // );
            }
          );
      } else {
        // console.log('Opzione non trovata nei contratti nazionali');
      }
    } else {
      // console.log('Valore non valido o CCNL non selezionato');
      livelloControl?.disable();
      livelloControl?.setValue(null);
    }
  }

  onChangePFI(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        // console.log('Checkbox selezionata, il valore è true');
      } else {
        // console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  onTipoContrattoChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const selectedValue = parseInt(target.value, 10); // Converte il valore selezionato in un numero
      if (!isNaN(selectedValue)) {
        const selectedcontract = this.tipiContratti.find(
          (tipoContratto: any) => tipoContratto.id === selectedValue
        );

        if (selectedcontract) {
          this.tipoContratto = selectedcontract;

          // console.log('Contratto selezionato: ', this.tipoContratto);

          const dataFineContrattoControl = this.anagraficaDto.get(
            'contratto.dataFineContratto'
          );
          const mesiDurataControl = this.anagraficaDto.get(
            'contratto.mesiDurata'
          );
          const tutorControl = this.anagraficaDto.get('contratto.tutor');
          const PFIcontrol = this.anagraficaDto.get('contratto.pfi');
          const superminimoMensileControl = this.anagraficaDto.get(
            'contratto.superminimoMensile'
          );
          const ralAnnuaControl = this.anagraficaDto.get('contratto.ralAnnua');
          const superminimoRalControl = this.anagraficaDto.get(
            'contratto.superminimoRal'
          );
          const diariaMensileControl = this.anagraficaDto.get(
            'contratto.diariaMensile'
          );
          const diariaGiornalieraControl = this.anagraficaDto.get(
            'contratto.diariaGiornaliera'
          );
          const scattiAnzianitaControl = this.anagraficaDto.get(
            'contratto.scattiAnzianita'
          );
          const retribuzioneMensileLordaControl = this.anagraficaDto.get(
            'contratto.retribuzioneMensileLorda'
          );
          const retribuzioneNettaMensileControl = this.anagraficaDto.get(
            'contratto.retribuzioneNettaMensile'
          );
          const tariffaPartitaIvaControl = this.anagraficaDto.get(
            'contratto.tariffaPartitaIva'
          );
          const livelloAttualeControl = this.anagraficaDto.get(
            'contratto.livelloAttuale'
          );
          const livelloFinaleControl = this.anagraficaDto.get(
            'contratto.livelloFinale'
          );
          const retribuzioneNettaGiornalieraControl = this.anagraficaDto.get(
            'contratto.retribuzioneNettaGiornaliera'
          );
          const dataFineProvaControl = this.anagraficaDto.get(
            'contratto.dataFineProva'
          );
          const ticketControl = this.anagraficaDto.get('contratto.ticket');
          const valoreTicketControl = this.anagraficaDto.get(
            'contratto.valoreTicket'
          );
          switch (selectedValue) {
            case 1: // Contratto STAGE
              if (
                dataFineContrattoControl &&
                mesiDurataControl &&
                retribuzioneMensileLordaControl &&
                PFIcontrol &&
                tutorControl &&
                superminimoMensileControl &&
                ralAnnuaControl &&
                superminimoRalControl &&
                diariaMensileControl &&
                diariaGiornalieraControl &&
                scattiAnzianitaControl &&
                tariffaPartitaIvaControl &&
                livelloAttualeControl &&
                retribuzioneNettaMensileControl &&
                livelloFinaleControl &&
                retribuzioneNettaGiornalieraControl &&
                dataFineProvaControl &&
                ticketControl &&
                valoreTicketControl
              ) {
                mesiDurataControl.enable();
                mesiDurataControl.setValidators([Validators.required]);
                mesiDurataControl.setValue(6);
                mesiDurataControl.updateValueAndValidity();

                dataFineContrattoControl.enable();
                dataFineContrattoControl.setValidators([Validators.required]);
                dataFineContrattoControl.setValue(null);
                dataFineContrattoControl.updateValueAndValidity();

                tutorControl.enable();
                tutorControl.setValidators([Validators.required]);
                tutorControl.setValue('');
                tutorControl.updateValueAndValidity();

                PFIcontrol.enable();
                PFIcontrol.setValidators([Validators.required]);
                PFIcontrol.setValue('');
                PFIcontrol.updateValueAndValidity();

                retribuzioneNettaMensileControl.enable();
                retribuzioneNettaMensileControl.setValue(800);
                retribuzioneNettaMensileControl.setValidators(
                  Validators.required
                );
                retribuzioneNettaMensileControl.updateValueAndValidity();

                // Disabilita gli altri controlli

                ticketControl.disable();
                ticketControl.setValue(false);
                ticketControl.updateValueAndValidity();

                valoreTicketControl.disable();
                valoreTicketControl.setValue('');
                valoreTicketControl.updateValueAndValidity();

                superminimoMensileControl.disable();
                superminimoMensileControl.setValue('');
                superminimoMensileControl.updateValueAndValidity();

                dataFineProvaControl.disable();
                dataFineProvaControl.setValue('');
                dataFineProvaControl.updateValueAndValidity();

                ralAnnuaControl.disable();
                ralAnnuaControl.setValue('');
                ralAnnuaControl.updateValueAndValidity();

                superminimoRalControl.disable();
                superminimoRalControl.setValue('');
                superminimoRalControl.updateValueAndValidity();

                diariaMensileControl.disable();
                diariaMensileControl.setValue('');
                diariaMensileControl.updateValueAndValidity();

                diariaGiornalieraControl.disable();
                diariaGiornalieraControl.setValue('');
                diariaGiornalieraControl.updateValueAndValidity();

                scattiAnzianitaControl.disable();
                scattiAnzianitaControl.setValue('');
                scattiAnzianitaControl.updateValueAndValidity();

                tariffaPartitaIvaControl.disable();
                tariffaPartitaIvaControl.setValue('');
                tariffaPartitaIvaControl.updateValueAndValidity();

                livelloAttualeControl.disable();
                livelloAttualeControl.setValue('');
                livelloAttualeControl.updateValueAndValidity();

                livelloFinaleControl.disable();
                livelloFinaleControl.setValue('');
                livelloFinaleControl.updateValueAndValidity();

                retribuzioneMensileLordaControl.disable();
                retribuzioneMensileLordaControl.setValue('');
                retribuzioneMensileLordaControl.updateValueAndValidity();

                retribuzioneNettaGiornalieraControl.disable();
                retribuzioneNettaGiornalieraControl.setValue('');
                retribuzioneNettaGiornalieraControl.updateValueAndValidity();
              }
              break;

            case 2: // Contratto PARTITA IVA
              if (
                tariffaPartitaIvaControl &&
                PFIcontrol &&
                tutorControl &&
                superminimoMensileControl &&
                ralAnnuaControl &&
                retribuzioneMensileLordaControl &&
                retribuzioneNettaMensileControl &&
                retribuzioneNettaGiornalieraControl &&
                dataFineContrattoControl &&
                mesiDurataControl &&
                livelloAttualeControl &&
                livelloFinaleControl &&
                superminimoRalControl &&
                scattiAnzianitaControl &&
                retribuzioneNettaGiornalieraControl &&
                dataFineProvaControl
              ) {
                tariffaPartitaIvaControl.enable();
                tariffaPartitaIvaControl.setValidators([Validators.required]);
                tariffaPartitaIvaControl.setValue('');
                tariffaPartitaIvaControl.updateValueAndValidity();

                retribuzioneMensileLordaControl.enable();
                retribuzioneMensileLordaControl.setValue(null);

                retribuzioneNettaGiornalieraControl.enable();
                retribuzioneNettaGiornalieraControl.setValidators([
                  Validators.required,
                ]);
                retribuzioneNettaGiornalieraControl.setValue('');
                retribuzioneNettaGiornalieraControl.updateValueAndValidity();

                retribuzioneMensileLordaControl.setValue('');
                retribuzioneMensileLordaControl.enable();

                retribuzioneNettaMensileControl.setValue('');
                retribuzioneNettaMensileControl.disable();
                retribuzioneNettaMensileControl.clearValidators();
                retribuzioneNettaMensileControl.updateValueAndValidity();

                livelloAttualeControl.disable();
                livelloAttualeControl.setValue(null);

                livelloFinaleControl.disable();
                livelloFinaleControl.setValue(null);

                PFIcontrol.disable();
                PFIcontrol.setValue('');

                tutorControl.disable();
                tutorControl.setValue('');

                superminimoMensileControl.disable();
                superminimoMensileControl.setValue('');

                ralAnnuaControl.disable();
                ralAnnuaControl.setValue('');

                superminimoRalControl.disable();
                superminimoRalControl.setValue('');

                dataFineProvaControl.disable();
                dataFineProvaControl.setValue('');
                dataFineProvaControl.updateValueAndValidity();

                dataFineContrattoControl.disable();
                dataFineContrattoControl.setValue('');
                dataFineContrattoControl.clearValidators();
                dataFineContrattoControl.updateValueAndValidity();

                mesiDurataControl.disable();
                mesiDurataControl.setValue('');
                mesiDurataControl.clearValidators();
                mesiDurataControl.updateValueAndValidity();
              }
              break;

            case 3: // Contratto a tempo determinato
              if (
                mesiDurataControl &&
                superminimoMensileControl &&
                ralAnnuaControl &&
                superminimoRalControl &&
                PFIcontrol &&
                tutorControl &&
                diariaMensileControl &&
                diariaGiornalieraControl &&
                scattiAnzianitaControl &&
                tariffaPartitaIvaControl &&
                retribuzioneMensileLordaControl &&
                dataFineContrattoControl &&
                livelloAttualeControl &&
                livelloFinaleControl &&
                retribuzioneNettaGiornalieraControl &&
                retribuzioneNettaMensileControl &&
                dataFineProvaControl
              ) {
                dataFineProvaControl.enable();
                dataFineProvaControl.setValue('');
                dataFineProvaControl.setValidators([Validators.required]);
                dataFineProvaControl.updateValueAndValidity();

                mesiDurataControl.enable();
                mesiDurataControl.setValue('');
                mesiDurataControl.setValidators([Validators.required]);
                mesiDurataControl.updateValueAndValidity();

                dataFineContrattoControl.enable();
                dataFineContrattoControl.setValue('');
                dataFineContrattoControl.setValidators([Validators.required]);
                dataFineContrattoControl.updateValueAndValidity();

                retribuzioneMensileLordaControl.enable();
                retribuzioneMensileLordaControl.setValue('');

                retribuzioneNettaMensileControl.disable();
                retribuzioneNettaMensileControl.setValue('');
                retribuzioneNettaMensileControl.clearValidators();
                retribuzioneNettaMensileControl.updateValueAndValidity();

                superminimoMensileControl.enable();
                superminimoMensileControl.setValue('');

                ralAnnuaControl.enable();
                ralAnnuaControl.setValue('');

                superminimoRalControl.enable();
                superminimoRalControl.setValue('');

                diariaMensileControl.enable();
                diariaMensileControl.setValue('');

                diariaGiornalieraControl.enable();
                diariaGiornalieraControl.setValue('');

                scattiAnzianitaControl.enable();
                scattiAnzianitaControl.setValue('');

                PFIcontrol.disable();
                PFIcontrol.setValue('');
                PFIcontrol.clearValidators();
                PFIcontrol.updateValueAndValidity();

                tutorControl.disable();
                tutorControl.setValue('');
                tutorControl.clearValidators();
                tutorControl.updateValueAndValidity();

                livelloAttualeControl.disable();
                livelloAttualeControl.setValue('');

                livelloFinaleControl.disable();
                livelloFinaleControl.setValue('');

                tariffaPartitaIvaControl.disable();
                tariffaPartitaIvaControl.setValue('');

                retribuzioneNettaGiornalieraControl.disable();
                retribuzioneNettaGiornalieraControl.setValue('');

                // this.AnagraficaDto.updateValueAndValidity();
              }
              break;
            case 4: // Contratto a tempo indeterminato
              if (
                mesiDurataControl &&
                dataFineContrattoControl &&
                tariffaPartitaIvaControl &&
                tutorControl &&
                PFIcontrol &&
                superminimoMensileControl &&
                ralAnnuaControl &&
                superminimoRalControl &&
                diariaMensileControl &&
                diariaGiornalieraControl &&
                scattiAnzianitaControl &&
                retribuzioneMensileLordaControl &&
                retribuzioneNettaGiornalieraControl
              ) {
                mesiDurataControl.disable();
                mesiDurataControl.setValue('');

                retribuzioneNettaGiornalieraControl.disable();
                retribuzioneNettaGiornalieraControl.setValue('');

                dataFineContrattoControl.disable();
                dataFineContrattoControl.setValue(null);

                tariffaPartitaIvaControl.disable();
                tariffaPartitaIvaControl.setValue('');

                tutorControl.disable();
                tutorControl.setValue('');

                PFIcontrol.disable();
                PFIcontrol.setValue('');

                superminimoMensileControl.enable();
                superminimoMensileControl.setValue('');

                ralAnnuaControl.enable();
                ralAnnuaControl.setValue('');

                superminimoRalControl.enable();
                superminimoRalControl.setValue('');

                diariaMensileControl.enable();
                diariaMensileControl.setValue('');

                diariaGiornalieraControl.enable();
                diariaGiornalieraControl.setValue('');

                scattiAnzianitaControl.enable();
                scattiAnzianitaControl.setValue('');

                retribuzioneMensileLordaControl.enable();
                retribuzioneMensileLordaControl.setValue(null);

                livelloAttualeControl?.enable();
                livelloAttualeControl?.setValue(null);

                livelloFinaleControl?.enable();
                livelloFinaleControl?.setValue(null);
              }
              break;

            case 5: // Contratto di apprendistato
              if (
                mesiDurataControl &&
                dataFineContrattoControl &&
                tariffaPartitaIvaControl &&
                tutorControl &&
                PFIcontrol &&
                superminimoMensileControl &&
                ralAnnuaControl &&
                superminimoRalControl &&
                diariaMensileControl &&
                diariaGiornalieraControl &&
                scattiAnzianitaControl &&
                retribuzioneMensileLordaControl &&
                retribuzioneNettaMensileControl
              ) {
                mesiDurataControl.enable();
                mesiDurataControl.setValue(36);
                this.calculateDataFineContratto();

                dataFineContrattoControl.enable();
                dataFineContrattoControl.setValue(null);

                tariffaPartitaIvaControl.disable();
                tariffaPartitaIvaControl.setValue('');

                livelloAttualeControl?.enable();
                livelloAttualeControl?.setValue(null);

                retribuzioneNettaMensileControl.disable();
                retribuzioneNettaMensileControl.setValue('');
                retribuzioneNettaMensileControl.clearValidators();
                retribuzioneNettaMensileControl.updateValueAndValidity();

                livelloFinaleControl?.enable();
                livelloFinaleControl?.setValue(null);

                tutorControl.enable();
                tutorControl.setValue('');

                PFIcontrol.enable();
                PFIcontrol.setValue('');

                superminimoMensileControl.enable();
                superminimoMensileControl.setValue('');

                ralAnnuaControl.enable();
                ralAnnuaControl.setValue('');

                superminimoRalControl.enable();
                superminimoRalControl.setValue('');

                diariaMensileControl.enable();
                diariaMensileControl.setValue('');

                diariaGiornalieraControl.enable();
                diariaGiornalieraControl.setValue('');

                scattiAnzianitaControl.enable();
                scattiAnzianitaControl.setValue('');

                retribuzioneMensileLordaControl.enable();
                retribuzioneMensileLordaControl.setValue(null);

                this.anagraficaDto.updateValueAndValidity();
              }
              break;

            default:
              break;
          }
        } else {
          // console.log('Livello contratto non trovato nella lista');
        }
      } else {
        // console.log('Valore non valido o livello contratto non selezionato');
      }
    }
  }

  initializeCommesse(): void {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    this.elencoCommesse.forEach((commessa) => {
      commesseFormArray.push(this.createCommessaFormGroup(commessa));
    });
  }

  createCommessaFormGroup(commessa: any): FormGroup {
    return this.formBuilder.group({
      id: [commessa.id],
      tipoAziendaCliente: this.formBuilder.group({
        id: ['', Validators.required],
        descrizione: [''],
      }),
      clienteFinale: [commessa.clienteFinale, Validators.required],
      titoloPosizione: [commessa.titoloPosizione, Validators.required],
      distacco: [commessa.distacco],
      distaccoAzienda: [commessa.distaccoAzienda],
      distaccoData: [commessa.distaccoData],
      dataInizio: [commessa.dataInizio, Validators.required],
      dataFine: [commessa.dataFine],
      tariffaGiornaliera: [commessa.tariffaGiornaliera],
      aziendaDiFatturazioneInterna: [
        commessa.aziendaDiFatturazioneInterna,
        Validators.required,
      ],
    });
  }

  // Dichiarazione di una variabile per il valore precedente
  valorePrecedenteDataFineRapporto: any;

  onChangeTipoCausaFineContratto(event: any) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    // console.log(value);
  }

  onChangeCausaFineRapporto(event: any) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    // console.log(value);

    const dataFineRapportoControl = this.anagraficaDto.get(
      'contratto.dataFineRapporto'
    );

    if (value && dataFineRapportoControl) {
      this.valorePrecedenteDataFineRapporto = dataFineRapportoControl.value;
      dataFineRapportoControl.enable();
      dataFineRapportoControl.setValue(this.dataFormattata);
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          image: '../../../../assets/images/danger.png',
          title: 'Attenzione:',
          message:
            'La data di fine rapporto é stata impostata a ' +
            this.dataFormattata +
            '.' +
            '\n Per reimpostare la data precedente, se presente, rimuovi la causa di fine rapporto. ',
        },
      });
    } else {
      // Ripristina il valore precedente
      if (this.valorePrecedenteDataFineRapporto !== undefined) {
        dataFineRapportoControl?.setValue(
          this.valorePrecedenteDataFineRapporto
        );
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            image: '../../../../assets/images/danger.png',
            title: 'Attenzione:',
            message:
              'La data di fine rapporto é stata impostata a ' +
              this.valorePrecedenteDataFineRapporto +
              '. \n',
          },
        });
      } else {
        dataFineRapportoControl?.setValue(null);
      }
      dataFineRapportoControl?.enable();
    }
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
          // console.log(
          //   'Errore durante il caricamento della tipologica Motivazione fine rapporto:',
          //   JSON.stringify(error)
          // );
        }
      );
  }

  getCommesseControls(): AbstractControl[] {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    return commesseFormArray.controls;
  }

  get commesseControls(): AbstractControl[] {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    return commesseFormArray.controls;
  }

  aggiungiCommessa(): void {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    const nuovaCommessa = {
      id: '',
      aziendaCliente: '',
      clienteFinale: '',
      titoloPosizione: '',
      distacco: false,
      distaccoAzienda: '',
      distaccoData: '',
      dataInizio: '',
      dataFine: '',
      tariffaGiornaliera: '',
      aziendaDiFatturazioneInterna: '',
    };

    commesseFormArray.push(this.createCommessaFormGroup(nuovaCommessa));
  }

  caricaAziendeClienti() {
    this.contrattoService
      .getAllAziendaCliente(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          // console.log('NOMI AZIENDE CARICATI:' + JSON.stringify(result));
          this.aziendeClienti = (result as any)['list'];
        },
        (error: any) => {
          // console.error(
          //   'errore durante il caricamento dei nomi azienda:' + error
          // );
        }
      );
  }

  storicizza(index: number) {
    // console.log('ID COMMESSA: ' + JSON.stringify(this.elencoCommesse[index]));
  }

  rimuoviCommessa(index: number): void {
    const dialogRef = this.dialog.open(AlertConfermaComponent, {
      data: {
        image: '../../../../assets/images/danger.png',
        title: 'Attenzione:',
        message: 'Confermi di voler eliminare la commessa selezionata?',
      },
      disableClose: true,
    });

    dialogRef.componentInstance.conferma.subscribe(() => {
      const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;

      // Rimuovi la commessa dall'array del form
      commesseFormArray.removeAt(index);

      // Invia la richiesta di eliminazione al backend
      const body = JSON.stringify({
        commessa: this.elencoCommesse[index],
      });
      // console.log(body);
      this.anagraficaDtoService
        .deleteCommessa(body, localStorage.getItem('token'))
        .subscribe(
          (response: any) => {
            if ((response as any).esito.code !== 200) {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  image: '../../../../assets/images/danger.png',
                  title: 'Eliminazione non riuscita:',
                  message: (response as any).esito.target,
                },
              });
            } else {
              this.elencoCommesse.splice(index, 1);
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  image: '../../../../assets/images/logo.jpeg',
                  title: 'Commessa eliminata correttamente.',
                },
              });
              location.reload();
            }
          },
          (error: any) => {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image: '../../../../assets/images/danger.png',
                title: 'Qualcosa é andato storto:',
                message: JSON.stringify(error),
              },
            });
          }
        );
    });
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
          // console.log(
          //   'Errore durante il caricamento della tipologica Motivazione fine rapporto: ' +
          //     JSON.stringify(error)
          // );
        }
      );
  }

  aggiorna() {
    const dialogRef = this.dialog.open(AlertConfermaComponent, {
      data: {
        image: '../../../../assets/images/danger.png',
        title: 'Attenzione:',
        message: 'Confermi di voler salvare le modifiche?',
      },
      disableClose: true,
    });

    dialogRef.componentInstance.conferma.subscribe(() => {
      const removeEmpty = (obj: any) => {
        Object.keys(obj).forEach((key) => {
          if (obj[key] && typeof obj[key] === 'object') {
            removeEmpty(obj[key]);
          } else if (obj[key] === '' || obj[key] === null) {
            delete obj[key];
          }
          if (obj.contratto && Object.keys(obj.contratto).length === 0) {
            delete obj.contratto;
          }
          if (obj.commesse && Object.keys(obj.commesse).length === 0) {
            delete obj.commesse;
          }
          if (
            obj.tipoContratto &&
            Object.keys(obj.tipoContratto).length === 0
          ) {
            delete obj.tipoContratto;
          }
          if (obj.tipoAzienda && Object.keys(obj.tipoAzienda).length === 0) {
            delete obj.tipoAzienda;
          }
          if (obj.tipoCcnl && Object.keys(obj.tipoCcnl).length === 0) {
            delete obj.tipoCcnl;
          }
          if (obj.provinciaDiNascita && Object.keys(obj.provinciaDiNascita).length === 0) {
            delete obj.provinciaDiNascita;
          }
          if (obj.provinciaDiNascita && Object.keys(obj.provinciaDiNascita).length === 0) {
            delete obj.provinciaDiNascita;
          }
          if (obj.comuneDiNascita && Object.keys(obj.comuneDiNascita).length === 0) {
            delete obj.comuneDiNascita;
          }
          if (obj.provinciaDomicilio && Object.keys(obj.provinciaDomicilio).length === 0) {
            delete obj.provinciaDomicilio;
          }
          if (obj.comuneDomicilio && Object.keys(obj.comuneDomicilio).length === 0) {
            delete obj.comuneDomicilio;
          }
          if (
            obj.tipoLivelloContratto &&
            Object.keys(obj.tipoLivelloContratto).length === 0
          ) {
            delete obj.tipoLivelloContratto;
          }
          if (
            obj.dataFineRapporto &&
            Object.keys(obj.dataFineRapporto).length === 0
          ) {
            delete obj.dataFineRapporto;
          }
          if (
            obj.tipoCausaFineRapporto &&
            Object.keys(obj.tipoCausaFineRapporto).length === 0
          ) {
            delete obj.tipoCausaFineRapporto;
          }
          if (
            obj.tipoCausaFineContratto &&
            Object.keys(obj.tipoCausaFineContratto).length === 0
          ) {
            delete obj.tipoCausaFineContratto;
          }
          if (
            obj.tipoCanaleReclutamento &&
            Object.keys(obj.tipoCanaleReclutamento).length === 0
          ) {
            delete obj.tipoCanaleReclutamento;
          }
        });
      };
      removeEmpty(this.anagraficaDto.value);
      const payload = {
        anagraficaDto: this.anagraficaDto.value,
      };
      this.anagraficaDtoService
        .update(payload, localStorage.getItem('token'))
        .subscribe(
          (response) => {
            if ((response as any).esito.code !== 200) {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  image: '../../../../assets/images/danger.png',
                  title: 'Modifica non riuscita:',
                  message: (response as any).esito.target,
                },
              });
            } else {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  image: '../../../../assets/images/logo.jpeg',
                  title: 'Modifica effettuata correttamente.',
                },
              });
              this.router.navigate(['/lista-anagrafica']);
            }
          },
          (error) => {
            // console.error("Errore nell'invio del payload al server:", error);
          }
        );
    });
  }

  insertContratto() {
    this.contrattoVuoto = !this.contrattoVuoto;
  }

  getCommessaFormGroup(index: number): FormGroup {
    return (this.anagraficaDto.get('commesse') as FormArray).controls[
      index
    ] as FormGroup;
  }

  creaFormCommessa(): void {
    const nuovaCommessa: CommessaDuplicata = {
      id: this.elencoCommesse.length + 1,
      aziendaCliente: '',
      clienteFinale: '',
      titoloPosizione: '',
      distacco: '',
      distaccoAzienda: '',
      distaccoData: '',
      dataInizio: '',
      dataFine: '',
      tariffaGiornaliera: '',
      aziendaDiFatturazioneInterna: '',
    };

    const nuovoFormGroup = this.formBuilder.group(nuovaCommessa);

    // Se il primo form, copia i valori dal primo elemento dell'array elencoCommesse
    if (this.elencoCommesse.length === 0) {
      const primoForm = this.elencoCommesse[0];
      if (primoForm) {
        nuovoFormGroup.patchValue(primoForm.value);
      }
    }

    this.elencoCommesse.push(nuovoFormGroup);
  }

  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  chiudiPopup() {
    this.showErrorPopup = false;
    this.showSuccessPopup = false;
  }

  checkValid(myArray: string[]) {
    let check = false;

    for (let element of myArray) {
      if (this.isControlInvalid(element)) {
        check = true;
      }
    }

    return check;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.anagraficaDto.get(controlName);
    const inputElement = document.getElementById(controlName);

    if (!(control?.value != null && control?.value != '')) {
      inputElement?.classList.add('invalid-field');
      return true;
    } else {
      inputElement?.classList.remove('invalid-field');
      return false;
    }
  }

  // reset(myArray: string[]) {
  //   for (let element of myArray) {
  //     const inputElement = document.getElementById(element);

  //     inputElement?.classList.remove('invalid-field');
  //   }
  // }

  reset() {
    this.router.navigate(['/lista-anagrafica']);
  }

  caricaTipoCausaFineContratto() {
    this.anagraficaDtoService
      .changeTipoCausaFineContrattoMap(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.tipiCausaFineContratto = (result as any)['list'];
          // console.log("Cause di fine contratto caricate: "+ JSON.stringify(this.tipiCausaFineContratto));
        },
        (error: any) => {
          // console.error(
          //   'Errore durante il caricamento delle cause di fine contratto: ' +
          //     JSON.stringify(error)
          // );
        }
      );
  }

  caricaTipoContratto() {
    this.anagraficaDtoService
      .getTipoContratto(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.tipiContratti = (result as any)['list'];
          // console.log(
          //   '------------------------TIPI DI CONTRATTI CARICATI:------------------------ ' +
          //     JSON.stringify(result)
          // );
        },
        (error: any) => {
          // console.log(
          //   'Errore durante il caricamento dei tipi di contratto : ' + error
          // );
        }
      );
  }

  caricaLivelloContratto() {
    this.anagraficaDtoService
      .getLivelloContratto(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.livelliContratti = (result as any)['list'];
          // console.log(
          //   '------------------------LIVELLI CONTRATTO CARICATI:------------------------ ' +
          //     JSON.stringify(result)
          // );
        },
        (error: any) => {
          // console.log(
          //   'Errore durante il caricamento dei livelli contrattuali: ' + error
          // );
        }
      );
  }

  caricaTipoAzienda() {
    this.anagraficaDtoService
      .getTipoAzienda(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.tipiAziende = (result as any)['list'];
          // console.log(
          //   '------------------------AZIENDE CARICATE:------------------------ ' +
          //     JSON.stringify(result)
          // );
        },
        (error: any) => {
          // console.log('Errore durante il caricamento delle aziende: ' + error);
        }
      );
  }

  caricaContrattoNazionale() {
    //metodo che carica la lista della select del ccnl
    this.anagraficaDtoService
      .getContrattoNazionale(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.ccnl = (result as any)['list'];
          // console.log(
          //   '------------------------CCNL CARICATI:------------------------ ' +
          //     JSON.stringify(result)
          // );
          this.changeElencoLivelliCCNL();
        },
        (error: any) => {
          // console.log(
          //   'Errore durante il caricamento dei contratti nazionali: ' + error
          // );
        }
      );
  }

  caricaRuoli() {
    this.anagraficaDtoService.getRuoli(localStorage.getItem('token')).subscribe(
      (result: any) => {
        this.ruoli = (result as any)['list'];
        // console.log(
        //   '------------------------RUOLI CARICATI:------------------------ ' +
        //     JSON.stringify(result)
        // );
      },
      (error: any) => {
        // console.log('Errore durante il caricamento dei ruoli : ' + error);
      }
    );
  }

  calculateDataFineContratto() {
    const mesiDurataControl = this.anagraficaDto.get('contratto.mesiDurata');
    const dataFineContrattoControl = this.anagraficaDto.get(
      'contratto.dataFineContratto'
    );
    const dataAssunzioneControl = this.anagraficaDto.get(
      'contratto.dataAssunzione'
    );

    // Verifica se mesiDurataControl e dataAssunzioneControl esistono e non sono nulli
    if (
      mesiDurataControl &&
      dataAssunzioneControl &&
      mesiDurataControl.value !== null &&
      dataAssunzioneControl.value !== null
    ) {
      // Ottieni i valori dei controlli
      const mesiDurata = mesiDurataControl.value;
      const dataAssunzione = dataAssunzioneControl.value;

      // Verifica se i valori ottenuti sono validi
      if (mesiDurata && dataAssunzione) {
        // Calcola la data di fine rapporto aggiungendo i mesi di durata alla data di assunzione
        const dataFineContratto = new Date(dataAssunzione);
        dataFineContratto.setMonth(dataFineContratto.getMonth() + mesiDurata);

        // Formatta la data nel formato "yyyy-MM-dd"
        const dataFineContrattoFormatted = this.datePipe.transform(
          dataFineContratto,
          'yyyy-MM-dd'
        );

        // Imposta il valore formattato nel controllo 'dataFineRapporto'
        dataFineContrattoControl?.setValue(dataFineContrattoFormatted);
      } else {
        // Alcuni dei valori necessari sono mancanti, gestisci di conseguenza
        // console.error(
        //   'Impossibile calcolare la data di fine rapporto. Mancano dati.'
        // );
      }
    } else {
      // console.error(
      //   'I controlli necessari non esistono o alcuni valori sono nulli.'
      // );
    }
  }
  //impostazione del form a caricamento pagina
  setForm() {
    // console.log(
    //   'SELEZIONATO TIPO CONTRATTO CON ID: ' + this.selectedTipoContrattoId
    // );
    const dataFineContrattoControl = this.anagraficaDto.get(
      'contratto.dataFineContratto'
    );
    const mesiDurataControl = this.anagraficaDto.get('contratto.mesiDurata');
    const tutorControl = this.anagraficaDto.get('contratto.tutor');
    const PFIcontrol = this.anagraficaDto.get('contratto.pfi');
    const superminimoMensileControl = this.anagraficaDto.get(
      'contratto.superminimoMensile'
    );
    const ralAnnuaControl = this.anagraficaDto.get('contratto.ralAnnua');
    const superminimoRalControl = this.anagraficaDto.get(
      'contratto.superminimoRal'
    );
    const diariaMensileControl = this.anagraficaDto.get(
      'contratto.diariaMensile'
    );
    const diariaGiornalieraControl = this.anagraficaDto.get(
      'contratto.diariaGiornaliera'
    );
    const scattiAnzianitaControl = this.anagraficaDto.get(
      'contratto.scattiAnzianita'
    );
    const retribuzioneMensileLordaControl = this.anagraficaDto.get(
      'contratto.retribuzioneMensileLorda'
    );
    const tariffaPartitaIvaControl = this.anagraficaDto.get(
      'contratto.tariffaPartitaIva'
    );

    const livelloAttualeControl = this.anagraficaDto.get(
      'contratto.livelloAttuale'
    );
    const livelloFinaleControl = this.anagraficaDto.get(
      'contratto.livelloFinale'
    );

    switch (this.selectedTipoContrattoId) {
      case 1: // Contratto STAGE
        if (
          mesiDurataControl &&
          retribuzioneMensileLordaControl &&
          PFIcontrol &&
          tutorControl &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          superminimoRalControl &&
          diariaMensileControl &&
          diariaGiornalieraControl &&
          scattiAnzianitaControl &&
          tariffaPartitaIvaControl
        ) {
          livelloAttualeControl?.disable();
          livelloFinaleControl?.disable();

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(600);

          PFIcontrol.enable();
          tutorControl.enable();

          superminimoMensileControl.disable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.disable();
          ralAnnuaControl.setValue('');

          superminimoRalControl.disable();
          superminimoRalControl.setValue('');

          diariaMensileControl.disable();
          diariaMensileControl.setValue('');

          diariaGiornalieraControl.disable();
          diariaGiornalieraControl.setValue('');

          scattiAnzianitaControl.disable();
          scattiAnzianitaControl.setValue('');

          tariffaPartitaIvaControl.disable();
          tariffaPartitaIvaControl.setValue('');

          mesiDurataControl.setValue(6);
          mesiDurataControl.enable();

          dataFineContrattoControl?.enable();
          dataFineContrattoControl?.setValue(null);
        }
        break;

      case 2: // Contratto PARTITA IVA
        if (
          tariffaPartitaIvaControl &&
          PFIcontrol &&
          tutorControl &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          retribuzioneMensileLordaControl &&
          dataFineContrattoControl &&
          mesiDurataControl
        ) {
          tariffaPartitaIvaControl.enable();
          tariffaPartitaIvaControl.setValue('');

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(null);

          PFIcontrol.disable();
          PFIcontrol.setValue('');

          tutorControl.disable();
          tutorControl.setValue('');

          superminimoMensileControl.disable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.disable();
          ralAnnuaControl.setValue('');

          dataFineContrattoControl.disable();
          dataFineContrattoControl.setValue('');

          mesiDurataControl.disable();
          mesiDurataControl.setValue('');

          livelloAttualeControl?.disable();
          livelloFinaleControl?.disable();
        }
        break;

      case 3: // Contratto a tempo determinato
        if (
          mesiDurataControl &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          superminimoRalControl &&
          PFIcontrol &&
          tutorControl &&
          diariaMensileControl &&
          diariaGiornalieraControl &&
          scattiAnzianitaControl &&
          tariffaPartitaIvaControl &&
          retribuzioneMensileLordaControl &&
          dataFineContrattoControl
        ) {
          mesiDurataControl.enable();
          mesiDurataControl.setValue('');

          dataFineContrattoControl.enable();
          dataFineContrattoControl.setValue(null);

          PFIcontrol.disable();
          PFIcontrol.setValue('');

          tutorControl.disable();
          tutorControl.setValue('');

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(null);

          superminimoMensileControl.enable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.enable();
          ralAnnuaControl.setValue('');

          superminimoRalControl.enable();
          superminimoRalControl.setValue('');

          diariaMensileControl.enable();
          diariaMensileControl.setValue('');

          diariaGiornalieraControl.enable();
          diariaGiornalieraControl.setValue('');

          scattiAnzianitaControl.enable();
          scattiAnzianitaControl.setValue('');

          tariffaPartitaIvaControl.disable();
          tariffaPartitaIvaControl.setValue('');

          livelloAttualeControl?.disable();
          livelloFinaleControl?.disable();
        }
        break;
      case 4: // Contratto a tempo indeterminato
        if (
          mesiDurataControl &&
          dataFineContrattoControl &&
          tariffaPartitaIvaControl &&
          tutorControl &&
          PFIcontrol &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          superminimoRalControl &&
          diariaMensileControl &&
          diariaGiornalieraControl &&
          scattiAnzianitaControl &&
          retribuzioneMensileLordaControl
        ) {
          mesiDurataControl.disable();
          mesiDurataControl.setValue('');

          dataFineContrattoControl.disable();
          dataFineContrattoControl.setValue(null);

          tariffaPartitaIvaControl.disable();
          tariffaPartitaIvaControl.setValue('');

          tutorControl.disable();
          tutorControl.setValue('');

          PFIcontrol.disable();
          PFIcontrol.setValue('');

          superminimoMensileControl.enable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.enable();
          ralAnnuaControl.setValue('');

          superminimoRalControl.enable();
          superminimoRalControl.setValue('');

          diariaMensileControl.enable();
          diariaMensileControl.setValue('');

          diariaGiornalieraControl.enable();
          diariaGiornalieraControl.setValue('');

          scattiAnzianitaControl.enable();
          scattiAnzianitaControl.setValue('');

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(null);

          livelloAttualeControl?.disable();
          livelloFinaleControl?.disable();
        }
        break;

      case 5: // Contratto di apprendistato
        if (
          mesiDurataControl &&
          dataFineContrattoControl &&
          tariffaPartitaIvaControl &&
          tutorControl &&
          PFIcontrol &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          superminimoRalControl &&
          diariaMensileControl &&
          diariaGiornalieraControl &&
          scattiAnzianitaControl &&
          retribuzioneMensileLordaControl &&
          livelloAttualeControl &&
          livelloFinaleControl
        ) {
          mesiDurataControl.enable();
          mesiDurataControl.setValue(36);
          this.calculateDataFineContratto();

          dataFineContrattoControl.enable();
          dataFineContrattoControl.setValue(null);

          tariffaPartitaIvaControl.disable();
          tariffaPartitaIvaControl.setValue('');

          tutorControl.enable();
          tutorControl.setValue('');

          PFIcontrol.enable();
          PFIcontrol.setValue('');

          superminimoMensileControl.enable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.enable();
          ralAnnuaControl.setValue('');

          superminimoRalControl.enable();
          superminimoRalControl.setValue('');

          diariaMensileControl.enable();
          diariaMensileControl.setValue('');

          diariaGiornalieraControl.enable();
          diariaGiornalieraControl.setValue('');

          scattiAnzianitaControl.enable();
          scattiAnzianitaControl.setValue('');

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(null);

          livelloAttualeControl.enable();
          livelloFinaleControl.enable();

          this.anagraficaDto.updateValueAndValidity();
        }
        break;

      default:
        break;
    }
  }

  getAllNazioni() {
    this.anagraficaDtoService
      .getAllNazioni(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.elencoNazioni = result['list'];
        },
        (error: any) => {
          console.error(
            'Errore durante il caricamento delle nazioni: ' +
              JSON.stringify(error)
          );
        }
      );
  }
  getAllCittadinanze1() {
    this.anagraficaDtoService
      .getAllNazioni(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.elencoCittadinanze1 = result['list'];
        },
        (error: any) => {
          console.error(
            'Errore durante il caricamento delle nazioni: ' +
              JSON.stringify(error)
          );
        }
      );
  }
  getAllCittadinanze2() {
    this.anagraficaDtoService
      .getAllNazioni(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.elencoCittadinanze2 = result['list'];
        },
        (error: any) => {
          console.error(
            'Errore durante il caricamento delle nazioni: ' +
              JSON.stringify(error)
          );
        }
      );
  }


  calcolaMensileTot() {
    const retribuzioneMensileLorda =
      parseFloat(
        (<HTMLInputElement>document.getElementById('retribuzioneMensileLorda'))
          .value
      ) || 0;
    const superminimoMensile =
      parseFloat(
        (<HTMLInputElement>document.getElementById('superminimoMensile')).value
      ) || 0;
    const scattiAnzianita =
      parseFloat(
        (<HTMLInputElement>document.getElementById('scattiAnzianita')).value
      ) || 0;

    if (
      retribuzioneMensileLorda !== 0 &&
      superminimoMensile !== 0 &&
      scattiAnzianita !== 0
    ) {
      const mensileTot =
        retribuzioneMensileLorda + superminimoMensile + scattiAnzianita;
      document
        .getElementById('mensileTOT')
        ?.setAttribute('value', mensileTot.toFixed(2));
      this.mensileTOT = mensileTot;
      // console.log(
      //   'MENSILE TOTALE CALCOLATO:' +
      //     this.mensileTOT +
      //     '\n Numero mensilitá: ' +
      //     this.numeroMensilitaDaDettaglio
      // );
      this.calcoloRAL();
    } else {
      // Se uno dei campi è vuoto, nascondi il risultato o reimpostalo a zero, a seconda delle tue esigenze
      document.getElementById('mensileTOT')?.setAttribute('value', '');
    }
  }

  calcoloRAL() {
    const RALControl = this.anagraficaDto.get('contratto.ralAnnua');

    if (RALControl) {
      if (
        this.mensileTOT !== undefined &&
        this.numeroMensilitaDaDettaglio !== undefined
      ) {
        const RALCalcolata = this.mensileTOT * this.numeroMensilitaDaDettaglio;

        RALControl.setValue(RALCalcolata.toFixed(2));
        // console.log('RAL CALCOLATA:' + RALCalcolata.toFixed(2));
      }
    }
  }

  rimuoviSpaziCellularePrivato() {
    const cellularePrivatoControl = this.anagraficaDto.get('anagrafica.cellularePrivato');
    if (cellularePrivatoControl) {
      const cellularePrivatoSenzaSpazi = cellularePrivatoControl.value.replace(/\s/g, '');
      cellularePrivatoControl.setValue(cellularePrivatoSenzaSpazi);
    }
  }
  rimuoviSpaziCellulareAziendale() {
    const cellulareAziendaleControl = this.anagraficaDto.get('anagrafica.cellulareAziendale');
    if (cellulareAziendaleControl) {
      const cellulareAziendaleSenzaSpazi = cellulareAziendaleControl.value.replace(/\s/g, '');
      cellulareAziendaleControl.setValue(cellulareAziendaleSenzaSpazi);
    }
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
        this.codiceFiscaleDettaglio =response.anagraficaDto.anagrafica.codiceFiscale;
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
        // console.error(
        //   'Si è verificato il seguente errore durante il recupero del ruolo: ' +
        //     error
        // );
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
          // console.error('Errore nella generazione del menu:', error);
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
      },
      (error: any) => {
      }
    );
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
        // console.error(
        //   "Errore durante il caricamento dell'immagine: " +
        //     JSON.stringify(error)
        // );

        // Assegna un'immagine predefinita in caso di errore
        this.immaginePredefinita = '../../../../assets/images/danger.png';
      }
    );
  }

  convertBase64ToImage(base64String: string): void {
    this.immagineConvertita = base64String;
  }

  private handleLogoutError() {
    sessionStorage.clear();
    window.location.href = 'login';
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvvisorio');
  }

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
