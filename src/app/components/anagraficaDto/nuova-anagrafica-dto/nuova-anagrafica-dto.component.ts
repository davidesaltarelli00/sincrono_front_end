import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { Router } from '@angular/router';
import { ContrattoService } from '../../contratto/contratto-service';
import { ThemePalette } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { MenuService } from '../../menu.service';
import { MapsService } from './maps.service';
import * as XLSX from 'xlsx';
import { ThemeService } from 'src/app/theme.service';
import { AlertConfermaComponent } from 'src/app/alert-conferma/alert-conferma.component';
import { AuthService } from '../../login/login-service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/GG',
  },
  display: {
    dateInput: 'YYYY/MM/GG',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-nuova-anagrafica-dto',
  templateUrl: './nuova-anagrafica-dto.component.html',
  styleUrls: ['./nuova-anagrafica-dto.component.scss'],
})
export class NuovaAnagraficaDtoComponent implements OnInit {
  data: any = [];
  utenti: any = [];
  currentStep = 1;
  motivazioniFineRapporto: any[] = [];
  tipologicaCanaliReclutamento: any[] = [];
  errore = false;
  messaggio: any;
  showErrorPopup: any;
  showSuccessPopup: any;
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  contrattiNazionali: any = [];
  ruoli: any[] = [];
  userlogged: string = '';
  formsDuplicati: boolean[] = [];
  AnagraficaDto: FormGroup;
  commesse!: FormArray;
  showErrorAlert: boolean = false;
  missingFields: string[] = [];
  percentualePartTimeValue: number | null = null;
  ccnLSelezionato = false;
  elencoLivelliCCNL: any[] = [];
  risultatoMensileTOT: any;
  //org.hibernate.TransientPropertyValueException: object references an unsaved transient instance - save the transient instance before flushing : it.sincrono.entities.Commessa.tipoAziendaCliente -> it.sincrono.entities.TipoAziendaCliente"
  //dati per i controlli nei form
  inseritoContrattoIndeterminato = true;
  idLivelloContratto: any;
  retribuzioneMensileLorda: any;
  descrizioneContrattoNazionale: any;
  descrizioneCCNL: any;
  numeroMensilitaCCNL: any;
  descrizioneLivelloCCNL: any;
  minimiRet23: any;
  ralAnnua: any;
  tipoContratto: any;
  mobile: boolean;
  aziendeClienti: any[] = [];
  selectedFileName: string = '';
  previewData: string | undefined;
  //navbar
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  idUtente: any;
  nazioni: string[] = [];
  capitali: any[] = [];
  province: any[] = [];
  dati: any = [];
  statoDiNascita: any;
  provinciaDiNascita: string = '';
  ruolo: any;
  base64Documento: any;
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
  idAnagraficaLoggata: any;
  tokenExpirationTime: any;
  timer: any;
  elencoProvince: any[] = [];
  elencoComuni: any[] = [];
  residenzaDomicilioUguali=true;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private contrattoService: ContrattoService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private profileBoxService: ProfileBoxService,
    private http: HttpClient,
    public themeService: ThemeService,
    private menuService: MenuService,
    private mapsService: MapsService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
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

    this.AnagraficaDto = this.formBuilder.group({
      anagrafica: this.formBuilder.group({
        tipoAzienda: new FormGroup({
          id: new FormControl('', Validators.required),
        }),
        nome: new FormControl('', Validators.required),
        cognome: new FormControl('', Validators.required),
        codiceFiscale: new FormControl('', [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(16),
        ]),
        cellularePrivato: new FormControl('', [
          Validators.pattern(/^(\+\d{2}\s?)?(\d{3}[\s.-]?\d{3}[\s.-]?\d{4})$/),
        ]),
        cellulareAziendale: new FormControl('', [
          Validators.pattern(/^(\+\d{2}\s?)?(\d{3}[\s.-]?\d{3}[\s.-]?\d{4})$/),
        ]),
        mailPrivata: new FormControl(
          '',
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          )
        ),
        mailPec: new FormControl(
          '',
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          )
        ),
        mailAziendale: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ]),
        titoliDiStudio: new FormControl(''),
        altriTitoli: new FormControl(''),
        categoriaProtetta: new FormControl(''),
        statoDiNascita: new FormControl(''),
        cittadinanza: new FormControl(''),
        residenzaDomicilioUguali:new FormControl(''),
        provinciaDiNascita: new FormGroup({
          id: new FormControl(''),
          siglaProvincia: new FormControl(''),
          denominazione_provincia:new FormControl(''),
          tipologiaProvincia: new FormControl(''),
          numeroComuni:new FormControl('')
        }),
        comuneDiNascita: new FormGroup({
          id: new FormControl(''),
          siglaProvincia: new FormControl(''),
          codiceIstat: new FormControl(''),
          denominazioneItaAltra: new FormControl(''),
          denominazione_ita: new FormControl(''),
          denominazione_altra: new FormControl(''),
          flag_capoluogo:new FormControl('')
        }),
        provinciaResidenza: new FormGroup({
          id: new FormControl('',Validators.required),
          siglaProvincia: new FormControl(''),
          denominazione_provincia:new FormControl(''),
          tipologiaProvincia: new FormControl(''),
          numeroComuni:new FormControl('')
        }),
        comuneResidenza: new FormGroup({
          id: new FormControl('',Validators.required),
          siglaProvincia: new FormControl(''),
          codiceIstat: new FormControl(''),
          denominazioneItaAltra: new FormControl(''),
          denominazione_ita: new FormControl(''),
          denominazione_altra: new FormControl(''),
          flag_capoluogo:new FormControl('')
        }),
        provinciaDomicilio: new FormGroup({
          id: new FormControl(''),
          siglaProvincia: new FormControl(''),
          denominazione_provincia:new FormControl(''),
          tipologiaProvincia: new FormControl(''),
          numeroComuni:new FormControl('')
        }),
        comuneDomicilio: new FormGroup({
          id: new FormControl(''),
          siglaProvincia: new FormControl(''),
          codiceIstat: new FormControl(''),
          denominazioneItaAltra: new FormControl(''),
          denominazione_ita: new FormControl(''),
          denominazione_altra: new FormControl(''),
          flag_capoluogo:new FormControl('')
        }),
        indirizzoResidenza: new FormControl('',Validators.required),
        indirizzoDomicilio: new FormControl(''),
        capResidenza: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}$')]),
        capDomicilio: new FormControl(''),
        localitaResidenzaEstera: new FormControl(''),
        localitaDomicilioEstero: new FormControl(''),
        dataDiNascita: new FormControl(''),
        tipoCanaleReclutamento: new FormGroup({
          id: new FormControl('', Validators.required),
          descrizione: new FormControl(''),
        }),
        coniugato: new FormControl(false),
        figliACarico: new FormControl(false),
        attesaLavori: new FormControl(false),
      }),
      commesse: this.formBuilder.array([]),

      contratto: this.formBuilder.group({
        attivo: new FormControl(''),
        // aziendaDiFatturazioneInterna: new FormControl(''),
        tipoAzienda: new FormGroup({
          id: new FormControl('', Validators.required),
        }),
        tipoContratto: new FormGroup({
          id: new FormControl('', Validators.required),
        }),
        tipoLivelloContratto: new FormGroup({
          id: new FormControl('', Validators.required),
        }),
        tipoCcnl: new FormGroup({
          id: new FormControl('', Validators.required),
        }),
        qualifica: new FormControl(''),
        sedeAssunzione: new FormControl(''),
        dataAssunzione: new FormControl('', Validators.required), //, Validators.required
        dataInizioProva: new FormControl(''),
        dataFineProva: new FormControl(''),
        dataFineRapporto: new FormControl(''), //, Validators.required
        dataFineContratto: new FormControl(''), //, Validators.required
        mesiDurata: new FormControl(''), //, Validators.required
        livelloAttuale: new FormControl(''), // +
        livelloFinale: new FormControl(''), //+
        ralPartTime: new FormControl(''),
        diariaAnnua: new FormControl(''), //+
        partTime: new FormControl(''),
        percentualePartTime: new FormControl(''),
        retribuzioneMensileLorda: new FormControl(''),
        superminimoMensile: new FormControl(''),
        ralAnnua: new FormControl(''),
        superminimoRal: new FormControl(''),
        diariaMensile: new FormControl(''),
        diariaGiornaliera: new FormControl(''),
        ticket: new FormControl(''),
        valoreTicket: new FormControl('', Validators.maxLength(50)),
        tutor: new FormControl(''),
        pfi: new FormControl(''),
        corsoSicurezza: new FormControl(''),
        dataCorsoSicurezza: new FormControl(''),
        scattiAnzianita: new FormControl(''),
        assicurazioneObbligatoria: new FormControl(''),
        pc: new FormControl(''),
        tariffaPartitaIva: new FormControl(''),
        retribuzioneNettaGiornaliera: new FormControl(''),
        retribuzioneNettaMensile: new FormControl(''),
        costoAziendale: new FormControl(''),
        // tipoCausaFineRapporto: new FormGroup({
        //   id: new FormControl(''),
        //   descrizione: new FormControl(''),
        // }),
        visitaMedica: new FormControl(''),
        dataVisitaMedica: new FormControl(''),
      }),
      ruolo: this.formBuilder.group({
        id: new FormControl('', Validators.required),
      }),
    });

    this.commesse = this.AnagraficaDto.get('commesse') as FormArray;

    // this.caricaListaUtenti();

    // console.log(
    //   'TIPO AZIENDA VALIDITY: ' +
    //     this.AnagraficaDto.get('tipoAzienda.id')?.hasError('required')
    // );

    this.caricaTipoContratto();
    // this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaAziendeClienti();
    this.caricaContrattoNazionale();
    // this.caricaTipoCausaFineRapporto();
    this.caricaRuoli();
    this.caricaTipoCanaleReclutamento();
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
    // console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
  }

  clearCodiceFiscale() {
    this.AnagraficaDto.get('anagrafica.codiceFiscale')?.setValue('');
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
            const comuniControl=this.AnagraficaDto.get('anagrafica.comuneResidenza.id');
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
      const comuniControl = this.AnagraficaDto.get('anagrafica.comuneResidenza.id');
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
            const comuniDomicilioControl=this.AnagraficaDto.get('anagrafica.comuneDomicilio.id');
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
      const comuniControl = this.AnagraficaDto.get('anagrafica.comuneDomicilio.id');
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
            const comuniNascitaControl=this.AnagraficaDto.get('anagrafica.comuneDiNascita.id');
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
      const comuneNascitaControl = this.AnagraficaDto.get('anagrafica.comuneDiNascita.id');
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
      }, 1000);
    }

    if (this.token != null) {
      this.getUserLogged();
      // this.getUserRole();
      this.caricaMappa();
      this.getProvince();
    }

    //INIZIO porzione di codice necessaria alla disabilitazione dei campi "distaccoAzienda" e "DistaccoData" nelle commesseç
    const commesseFormArray = this.AnagraficaDto.get('commesse') as FormArray;

    commesseFormArray.controls.forEach(
      (commessaControl: AbstractControl<any, any>) => {
        if (commessaControl instanceof FormGroup) {
          const distaccoAziendaControl = commessaControl.get('distaccoAzienda');
          const distaccoDataControl = commessaControl.get('distaccoData');
          distaccoAziendaControl?.disable();
          distaccoDataControl?.disable();
        }
      }
    );
    //FINE porzione di codice necessaria alla disabilitazione dei campi "distaccoAzienda" e "DistaccoData" nelle commesse

    const livelloAttualeControl = this.AnagraficaDto.get(
      'contratto.livelloAttuale'
    );
    if (livelloAttualeControl) {
      livelloAttualeControl.disable();
    }
    const livelloFinaleControl = this.AnagraficaDto.get(
      'contratto.livelloFinale'
    );
    if (livelloFinaleControl) {
      livelloFinaleControl.disable();
    }

    const comuniControl = this.AnagraficaDto.get('anagrafica.comuneResidenza.id');
      if(comuniControl){
        comuniControl.disable();
      }
    const comuniDomicilioControl = this.AnagraficaDto.get('anagrafica.comuneDomicilio.id');
      if(comuniDomicilioControl){
        comuniDomicilioControl.disable();
      }
    const comuniNascitaControl = this.AnagraficaDto.get('anagrafica.comuneDiNascita.id');
      if(comuniNascitaControl){
        comuniNascitaControl.disable();
      }

    const livelloControl = this.AnagraficaDto.get(
      'contratto.tipoLivelloContratto.id'
    );
    if (livelloControl) {
      livelloControl.disable();
    }

    const nomeControl = this.AnagraficaDto.get('anagrafica.nome');
    const cognomeControl = this.AnagraficaDto.get('anagrafica.cognome');

    const distaccoAziendaControl = this.AnagraficaDto.get(
      'commesse.distaccoAzienda'
    );
    const distaccoDataControl = this.AnagraficaDto.get('commesse.distaccoData');

    if (distaccoAziendaControl && distaccoDataControl) {
      distaccoAziendaControl.disable();
      distaccoDataControl.disable();
    }

    const dataCorsoSicurezzaControl = this.AnagraficaDto.get(
      'contratto.dataCorsoSicurezza'
    );
    if (dataCorsoSicurezzaControl) {
      dataCorsoSicurezzaControl.disable();
    }

    const tutorControl = this.AnagraficaDto.get('contratto.tutor');
    if (tutorControl) {
      tutorControl.disable();
    }

    const tipoAziendaControlAnagrafica = this.AnagraficaDto.get(
      'anagrafica.tipoAzienda.id'
    );
    const tipoAziendaControlContratto = this.AnagraficaDto.get(
      'contratto.tipoAzienda.id'
    );

    const PFIcontrol = this.AnagraficaDto.get('contratto.pfi');
      if(PFIcontrol){
        PFIcontrol.disable();
      }

    const valoreTicketControl = this.AnagraficaDto.get(
      'contratto.valoreTicket'
    );
    if (valoreTicketControl) {
      valoreTicketControl.disable();
    }

    const dataVisitaMedicaControl = this.AnagraficaDto.get(
      'contratto.dataVisitaMedica'
    );
    if (dataVisitaMedicaControl) {
      dataVisitaMedicaControl.disable();
    }

    const retribuzioneNettaMensileControl = this.AnagraficaDto.get(
      'contratto.retribuzioneNettaMensile'
    );

    if (retribuzioneNettaMensileControl) {
      retribuzioneNettaMensileControl.disable();
      retribuzioneNettaMensileControl.setValue('');
    }

    //all inizio devono essere disabilitati, si abilitano solo se si seleziona il contratto PARTITA IVA

    const tariffaPartitaIvaControl = this.AnagraficaDto.get(
      'contratto.tariffaPartitaIva'
    );
    const retribuzioneNettaGiornalieraControl = this.AnagraficaDto.get(
      'contratto.retribuzioneNettaGiornaliera'
    );

    if (tariffaPartitaIvaControl && retribuzioneNettaGiornalieraControl) {
      tariffaPartitaIvaControl.disable();
      retribuzioneNettaGiornalieraControl.disable();
    }

    // // Aggiungi un listener valueChanges per il controllo tipoAzienda in anagrafica
    // tipoAziendaControlAnagrafica?.valueChanges.subscribe((value) => {
    //   tipoAziendaControlContratto?.setValue(value, { emitEvent: false });
    // });

    // // Aggiungi un listener valueChanges per il controllo tipoAzienda in contratto
    // tipoAziendaControlContratto?.valueChanges.subscribe((value) => {
    //   tipoAziendaControlAnagrafica?.setValue(value, { emitEvent: false });
    // });

    this.AnagraficaDto.get('contratto.dataAssunzione')?.valueChanges.subscribe(
      () => {
        this.calculateDataFineContratto();
      }
    );

    this.AnagraficaDto.get('contratto.mesiDurata')?.valueChanges.subscribe(
      () => {
        this.calculateDataFineContratto();
      }
    );

    this.AnagraficaDto.get(
      'contratto.retribuzioneMensileLorda'
    )?.valueChanges.subscribe(() => {
      this.calcoloRAL();
    });
    this.AnagraficaDto.get(
      'contratto.percentualePartTime'
    )?.valueChanges.subscribe(() => {
      this.calcoloRAL();
    });
    this.calcoloRAL();
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

  caricaMappa() {
    this.mapsService.getData().subscribe((data: any) => {
      this.dati = data;
      this.nazioni = this.dati.map((item: any) => item.nazione);
    });
  }

  equalsResidenzaDomicilio(event: any): void {
    this.residenzaDomicilioUguali = event.target.checked;
    console.log('Toggle Switch is now:', this.residenzaDomicilioUguali);
    const indirizzoDomicilioControl=this.AnagraficaDto.get('anagrafica.indirizzoDomicilio');
      const provinciaDomicilioControl=this.AnagraficaDto.get('anagrafica.provinciaDomicilio.id');
      const comuniDomicilioControl=this.AnagraficaDto.get('anagrafica.comuneDomicilio.id');
      const capDomicilioControl=this.AnagraficaDto.get('anagrafica.capDomicilio');
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

  onChangeNazione(event: any) {
    this.statoDiNascita = event.target.value; // Imposta la nazione selezionata

    // Inizializza le capitali con un array vuoto
    this.capitali = [];

    // Se "Italia" è selezionata, ottieni tutte le province italiane
    if (this.statoDiNascita === 'Italia') {
      this.province =
        this.dati
          .find((item: any) => item.nazione === 'Italia')
          ?.province.flatMap((regione: any) => regione.province) || [];

      // Inoltre, imposta le capitali italiane
      this.capitali =
        this.dati
          .find((item: any) => item.nazione === 'Italia')
          ?.province.map((regione: any) => regione.capitale) || [];
    } else {
      // Altrimenti, filtra le province in base alla nazione selezionata
      this.province =
        this.dati.find((item: any) => item.nazione === this.statoDiNascita)
          ?.province || [];

      // Recupera la capitale della nazione selezionata
      const capitaleNazione = this.dati.find(
        (item: any) => item.nazione === this.statoDiNascita
      )?.capitale;

      // Se la capitale è definita, aggiungila all'array delle capitali
      if (capitaleNazione) {
        this.capitali.push(capitaleNazione);
      }
    }

    // console.log('Nazione selezionata: ' + this.statoDiNascita);
    // console.log('Province selezionate: ' + JSON.stringify(this.province));
    // console.log('Capitali selezionate: ' + JSON.stringify(this.capitali));
  }

  calcoloRAL() {
    const retribuzioneMensileLorda = this.AnagraficaDto.get(
      'contratto.retribuzioneMensileLorda'
    )?.value;
    const percentualePartTime = this.AnagraficaDto.get(
      'contratto.percentualePartTime'
    )?.value;
    const numeroMensilita = this.numeroMensilitaCCNL;
    // Calcolo della RAL annua
    if (retribuzioneMensileLorda && percentualePartTime) {
      // Calcolo della RAL mensile
      const ralMensile = retribuzioneMensileLorda * percentualePartTime;

      // Calcolo della RAL annua
      this.ralAnnua = ralMensile * numeroMensilita;

      // Stampare il risultato sulla console
      console.log('RAL annua calcolata:', this.ralAnnua);
    }
  }

  calcoloRal() {
    if (
      typeof this.risultatoMensileTOT !== 'undefined' &&
      typeof this.numeroMensilitaCCNL !== 'undefined'
    ) {
      const ralAnnua = this.risultatoMensileTOT * this.numeroMensilitaCCNL;
      this.AnagraficaDto.get('contratto.ralAnnua')?.setValue(
        ralAnnua.toFixed(2)
      );
      this.ralAnnua = ralAnnua;
      console.log('LA RAL ANNUA É DI ' + ralAnnua);
    } else {
      console.warn('Dati mancanti per il calcolo della ral');
    }
  }

  onChangeConiugato(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  onChangeAssicurazioneObbligatoria(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        console.log('Assicurazione obbligatoria si');
      } else {
        console.log('Assicurazione obbligatoria no');
      }
    }
  }

  calcolaMensileTot() {
    let retribuzioneMensileLorda =
      parseFloat(
        (<HTMLInputElement>document.getElementById('retribuzioneMensileLorda'))
          .value
      ) || 0;
    let superminimoMensile =
      parseFloat(
        (<HTMLInputElement>document.getElementById('superminimoMensile')).value
      ) || 0;
    let scattiAnzianita =
      parseFloat(
        (<HTMLInputElement>document.getElementById('scattiAnzianita')).value
      ) || 0;

    // Verifica se un campo è null e imposta il suo valore a 0
    if (isNaN(retribuzioneMensileLorda)) retribuzioneMensileLorda = 0;
    if (isNaN(superminimoMensile)) superminimoMensile = 0;
    if (isNaN(scattiAnzianita)) scattiAnzianita = 0;

    const mensileTot =
      retribuzioneMensileLorda + superminimoMensile + scattiAnzianita;

    // Assegna il risultato al campo "mensileTOT"
    document
      .getElementById('mensileTOT')
      ?.setAttribute('value', mensileTot.toFixed(2));
    this.risultatoMensileTOT = mensileTot;
  }

  onDistaccoChange(event: Event, commessaIndex: number) {
    const commesseFormArray = this.AnagraficaDto.get('commesse') as FormArray;
    const commessaFormGroup = commesseFormArray.at(commessaIndex) as FormGroup;
    const distaccoAziendaControl = commessaFormGroup.get('distaccoAzienda');
    const distaccoDataControl = commessaFormGroup.get('distaccoData');
    const target = event.target as HTMLInputElement;
    distaccoAziendaControl?.disable();
    distaccoDataControl?.disable();
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        distaccoAziendaControl?.enable();
        distaccoDataControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        distaccoAziendaControl?.disable();
        distaccoDataControl?.disable();
      }
    }
  }

  aggiungiCommessa() {
    const commessaFormGroup = this.creaFormCommessa();
    this.commesse.push(commessaFormGroup);
    this.formsDuplicati.push(true);
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

          console.log('Contratto selezionato: ', this.tipoContratto);

          const dataFineContrattoControl = this.AnagraficaDto.get(
            'contratto.dataFineContratto'
          );
          const mesiDurataControl = this.AnagraficaDto.get(
            'contratto.mesiDurata'
          );
          const tutorControl = this.AnagraficaDto.get('contratto.tutor');
          const PFIcontrol = this.AnagraficaDto.get('contratto.pfi');
          const superminimoMensileControl = this.AnagraficaDto.get(
            'contratto.superminimoMensile'
          );
          const ralAnnuaControl = this.AnagraficaDto.get('contratto.ralAnnua');
          const superminimoRalControl = this.AnagraficaDto.get(
            'contratto.superminimoRal'
          );
          const diariaMensileControl = this.AnagraficaDto.get(
            'contratto.diariaMensile'
          );
          const diariaGiornalieraControl = this.AnagraficaDto.get(
            'contratto.diariaGiornaliera'
          );
          const scattiAnzianitaControl = this.AnagraficaDto.get(
            'contratto.scattiAnzianita'
          );
          const retribuzioneMensileLordaControl = this.AnagraficaDto.get(
            'contratto.retribuzioneMensileLorda'
          );
          const retribuzioneNettaMensileControl = this.AnagraficaDto.get(
            'contratto.retribuzioneNettaMensile'
          );
          const tariffaPartitaIvaControl = this.AnagraficaDto.get(
            'contratto.tariffaPartitaIva'
          );
          const livelloAttualeControl = this.AnagraficaDto.get(
            'contratto.livelloAttuale'
          );
          const livelloFinaleControl = this.AnagraficaDto.get(
            'contratto.livelloFinale'
          );
          const retribuzioneNettaGiornalieraControl = this.AnagraficaDto.get(
            'contratto.retribuzioneNettaGiornaliera'
          );
          const dataFineProvaControl = this.AnagraficaDto.get(
            'contratto.dataFineProva'
          );
          const ticketControl = this.AnagraficaDto.get('contratto.ticket');
          const valoreTicketControl = this.AnagraficaDto.get(
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
                retribuzioneNettaGiornalieraControl &&
                dataFineProvaControl
              ) {
                mesiDurataControl.disable();
                mesiDurataControl.setValue('');

                dataFineProvaControl.enable();
                dataFineProvaControl.setValue('');
                dataFineProvaControl.clearValidators();
                dataFineProvaControl.updateValueAndValidity();

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

                this.AnagraficaDto.updateValueAndValidity();
              }
              break;

            default:
              break;
          }
        } else {
          console.log('-----------');
        }
      } else {
        console.log('Valore non valido o livello contratto non selezionato');
      }
    }
  }

  calculateDataFineProva() {
    const dataAssunzioneControl = this.AnagraficaDto.get(
      'contratto.dataAssunzione'
    );
    const dataFineProvaControl = this.AnagraficaDto.get(
      'contratto.dataFineProva'
    );

    // Verifica se la data di assunzione è valida
    if (dataAssunzioneControl?.valid) {
      // Ottieni la data di assunzione come stringa
      const dataAssunzioneStr = dataAssunzioneControl.value;

      // Converte la stringa in un oggetto data JavaScript
      const dataAssunzione = new Date(dataAssunzioneStr);

      // Aggiungi 3 mesi alla data di assunzione
      dataAssunzione.setMonth(dataAssunzione.getMonth() + 3);

      // Formatta la data come stringa nel formato desiderato
      const dataFineProvaStr = this.datePipe.transform(
        dataAssunzione,
        'yyyy-MM-dd'
      );

      // Imposta il valore di dataFineProva nel campo corrispondente
      dataFineProvaControl?.setValue(dataFineProvaStr);
    }
  }

  calculateDataFineContratto() {
    const mesiDurataControl = this.AnagraficaDto.get('contratto.mesiDurata');
    const dataFineContrattoControl = this.AnagraficaDto.get(
      'contratto.dataFineContratto'
    );
    const dataAssunzioneControl = this.AnagraficaDto.get(
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

        // Imposta il valore formattato nel controllo 'dataFineContratto'
        dataFineContrattoControl?.setValue(dataFineContrattoFormatted);
      } else {
        // Alcuni dei valori necessari sono mancanti, gestisci di conseguenza
        console.error(
          'Impossibile calcolare la data di fine rapporto. Mancano dati.'
        );
      }
    } else {
      console.error(
        'I controlli necessari non esistono o alcuni valori sono nulli.'
      );
    }
  }

  calculateRalPartTime() {
    const percentualePartTimeControl = this.AnagraficaDto.get(
      'contratto.percentualePartTime'
    );
    const ralAnnuaControl = this.AnagraficaDto.get('contratto.ralAnnua');
    const ralPartTimeControl = this.AnagraficaDto.get('contratto.ralPartTime');

    if (percentualePartTimeControl && ralAnnuaControl && ralPartTimeControl) {
      const percentualePartTime = percentualePartTimeControl.value || 0;
      const ralAnnua = ralAnnuaControl.value || 0;

      const percentualeDecimal = percentualePartTime / 100;
      const ralPartTime = ralAnnua * percentualeDecimal;

      ralPartTimeControl.setValue(ralPartTime.toFixed(2)); // Formattato a due decimali
    }
  }

  onConiugatoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      // Adesso puoi usare isChecked in modo sicuro
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  onFigliACaricoChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }
  onAttesaLavoriChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      const attesaLavoriControl = this.AnagraficaDto.get(
        'anagrafica.attesaLavori'
      );
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        attesaLavoriControl?.setValue(true);
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        attesaLavoriControl?.setValue(false);
      }
    }
  }

  onValoreTicketChange(event: any) {
    const valoreTicketControl = this.AnagraficaDto.get(
      'contratto.valoreTicket'
    );
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        valoreTicketControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        valoreTicketControl?.disable();
      }
    }
  }
  onCategoriaProtettaChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }
  onPFIChange(event: any) {
    const target = event.target as HTMLInputElement;
    const tutorControl = this.AnagraficaDto.get('contratto.tutor');
    const PFIControl = this.AnagraficaDto.get('contratto.pfi');
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        PFIControl?.setValue(true);
        console.log('Checkbox selezionata, il valore è ' + PFIControl?.value);
      } else {
        PFIControl?.setValue(false);
        console.log('Checkbox deselezionata, il valore è ' + PFIControl?.value);
      }
    }
  }

  onCorsoSicurezzaChange(event: any) {
    const dataCorsoSicurezzaControl = this.AnagraficaDto.get(
      'contratto.dataCorsoSicurezza'
    );

    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        dataCorsoSicurezzaControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        dataCorsoSicurezzaControl?.disable();
      }
    }
  }
  onPChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  onVisitaMedicaChange(event: any) {
    const dataVisitaMedicaControl = this.AnagraficaDto.get(
      'contratto.dataVisitaMedica'
    );
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        dataVisitaMedicaControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        dataVisitaMedicaControl?.disable();
      }
    }
  }

  onPartTimeChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      const percentualePartTimeControl = this.AnagraficaDto.get(
        'contratto.percentualePartTime'
      );
      const ralAnnuaControl = this.AnagraficaDto.get('contratto.ralAnnua');
      const ralPartTimeControl = this.AnagraficaDto.get(
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
          // ralPartTimeControl.disable();
          ralPartTimeControl.setValue('');
        }
      }
    }
  }

  creaFormCommessa(): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(''),
      tipoAziendaCliente: new FormGroup({
        id: new FormControl(''),
        descrizione: new FormControl(''),
      }),
      clienteFinale: new FormControl('', Validators.required),
      titoloPosizione: new FormControl('', Validators.required),
      distacco: new FormControl(false),
      distaccoAzienda: new FormControl(''),
      distaccoData: new FormControl(''),
      dataInizio: new FormControl('', Validators.required),
      dataFine: new FormControl(''),
      tariffaGiornaliera: new FormControl(''),
      aziendaDiFatturazioneInterna: new FormControl('', Validators.required),
      // attivo: new FormControl(true),
    });
  }

  rimuoviCommessa(index: number) {
    this.commesse.removeAt(index);
    this.formsDuplicati.splice(index);
    // console.log(index);
    // const buttonDuplica = document.getElementById("button-duplica");
    // if (buttonDuplica) {
    //   if (index === 1) {
    //     buttonDuplica.setAttribute("disabled", "false");
    //   } else {
    //     buttonDuplica.setAttribute("disabled", "true");
    //   }
    // }
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


  caricaTipoCanaleReclutamento() {
    this.anagraficaDtoService
      .caricaTipoCanaleReclutamento(localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          this.tipologicaCanaliReclutamento = (res as any)['list'];
          console.log('ElencoCanali reclutamento:' + JSON.stringify(res));
        },
        (error: any) => {
          console.log(
            'Errore durante il caricamento della tipologica Motivazione fine rapporto: ' +
              JSON.stringify(error)
          );
        }
      );
  }

  setStep1() {
    this.currentStep = 1;
  }
  setStep2() {
    this.currentStep = 2;
  }
  setStep3() {
    this.currentStep = 3;
  }

  nextStep() {
    this.currentStep++;
    // console.log(this.currentStep);
  }

  prevStep() {
    this.currentStep--;
    // console.log(this.currentStep);
  }

  submitForm() {
    // Handle form submission
  }

  inserisci() {
    const dialogRef = this.dialog.open(AlertConfermaComponent, {
      data: {
        image: '../../../../assets/images/danger.png',
        title: 'Attenzione:',
        message:
          "Confermi di voler effettuare l'inserimento? Verifica i dati prima di salvare.",
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
          if (
            obj.tipoContratto &&
            Object.keys(obj.tipoContratto).length === 0
          ) {
            delete obj.tipoContratto;
          }
          if (obj.tipoAzienda && Object.keys(obj.tipoAzienda).length === 0) {
            delete obj.tipoAzienda;
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
        });
      };
      removeEmpty(this.AnagraficaDto.value);

      this.showErrorAlert = false;
      this.missingFields = [];
      if (this.AnagraficaDto.invalid) {
        console.log('Qualcosa é andato storto, controlla i campi e riprova.');
      } else {
        const body = JSON.stringify({
          anagraficaDto: this.AnagraficaDto.value,
        });
        console.log('Backend payload: ' + body);

        this.anagraficaDtoService
          .insert(body, localStorage.getItem('token'))
          .subscribe(
            (result) => {
              if (
                (result as any).esito.code !== 200 &&
                (result as any).esito.target != null
              ) {
                const dialogRef = this.dialog.open(AlertDialogComponent, {
                  data: {
                    image: '../../../../assets/images/danger.png',
                    title: 'Inserimento non riuscito:',
                    message: (result as any).esito.target,
                  },
                });
              }
              if (
                (result as any).esito.target ===
                'org.hibernate.TransientPropertyValueException: object references an unsaved transient instance - save the transient instance before flushing : it.sincrono.entities.Commessa.tipoAziendaCliente -> it.sincrono.entities.TipoAziendaCliente'
              ) {
                const dialogRef = this.dialog.open(AlertDialogComponent, {
                  data: {
                    image: '../../../../assets/images/danger.png',
                    title: 'Inserimento non riuscito:',
                    message:
                      "Non hai inserito l'azienda cliente in una o piú commesse.",
                  },
                });
              }
              if (
                (result as any).esito.code === 200 &&
                (result as any).esito.target === null
              ) {
                const dialogRef = this.dialog.open(AlertDialogComponent, {
                  data: {
                    image: '../../../../assets/images/logo.jpeg',
                    title: 'Inserimento effettuato.',
                    message:
                      " E' stata inviata una mail all'utente con la password per accedere al sistema. ",
                  },
                });
                // console.log(this.AnagraficaDto.value);
                this.router.navigate(['/lista-anagrafica']);
              }
            },
            (error: any) => {
              console.error(
                "Si é verificato un errore durante l'inserimento:" + error
              );
            }
          );
      }
    });
  }
  caricaTipoContratto() {
    this.contrattoService
      .getTipoContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        // console.log('TIPI DI CONTRATTI: ' + JSON.stringify(result));
        this.tipiContratti = (result as any)['list'];
      });
  }

  caricaTipoAzienda() {
    this.contrattoService
      .getTipoAzienda(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          // console.log('NOMI AZIENDE CARICATI:' + JSON.stringify(result));
          this.tipiAziende = (result as any)['list'];
        },
        (error: any) => {
          console.error(
            'errore durante il caricamento dei nomi azienda:' + error
          );
        }
      );
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
          console.error(
            'errore durante il caricamento dei nomi azienda:' + error
          );
        }
      );
  }

  caricaContrattoNazionale() {
    this.contrattoService
      .getContrattoNazionale(localStorage.getItem('token'))
      .subscribe((result: any) => {
        // console.log('caricaContrattoNazionale: ' + JSON.stringify(result));
        this.contrattiNazionali = (result as any)['list'];
      });
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
    const control = this.AnagraficaDto.get(controlName);
    const inputElement = document.getElementById(controlName);

    if (!(control?.dirty && control?.value != null && control?.value != '')) {
      inputElement?.classList.add('invalid-field');
      return true;
    } else {
      inputElement?.classList.remove('invalid-field');
      return false;
    }
  }

  reset(myArray: string[]) {
    for (let element of myArray) {
      const inputElement = document.getElementById(element);

      inputElement?.classList.remove('invalid-field');
    }
  }

  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  caricaRuoli() {
    this.anagraficaDtoService.getRuoli(localStorage.getItem('token')).subscribe(
      (result: any) => {
        this.ruoli = (result as any)['list'];
        console.log(this.ruoli);
      },
      (error: any) => {
        console.error('Errore durante il caricamento dei ruoli:' + error);
      }
    );
  }

  verificaCorrispondenza(): boolean {
    const corrispondenza = this.tipiAziende.some(
      (tipoAzienda: any) =>
        tipoAzienda.ccnl &&
        this.contrattiNazionali.some((contratto: any) => {
          const corrisponde = contratto.descrizione === tipoAzienda.ccnl;
          console.log(
            `Confronto: ${tipoAzienda.ccnl} con ${contratto.descrizione} - Risultato: ${corrisponde}`
          );
          return corrisponde;
        })
    );
    console.log(`Esito della verifica: ${corrispondenza}`);
    return corrispondenza;
  }

  onChangeLivelloContratto(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const selectedValue = parseInt(target.value, 10);
      if (!isNaN(selectedValue)) {
        const selectedLivello = this.elencoLivelliCCNL.find(
          (livello: any) => livello.id === selectedValue
        );

        if (selectedLivello) {
          console.log('Livello contratto selezionato: ', selectedLivello);
          this.minimiRet23 = selectedLivello.minimiRet23;
          console.log('Minimi retributivi 2023:' + this.minimiRet23);
          console.log('numero mensilitá:' + this.numeroMensilitaCCNL);
          const tipoContratto = this.AnagraficaDto.get(
            'contratto.tipoContratto.id'
          );
          if (this.tipoContratto != null) {
            if (this.tipoContratto.descrizione === 'Stage') {
              console.log('é uno stage, NO retr lorda');
              let retribuzioneMensileLorda = this.AnagraficaDto.get(
                'contratto.retribuzioneMensileLorda'
              );
              retribuzioneMensileLorda?.setValue('');
            } else {
              let retribuzioneMensileLorda = this.AnagraficaDto.get(
                'contratto.retribuzioneMensileLorda'
              );
              retribuzioneMensileLorda?.setValue(this.minimiRet23);
            }
          } else {
            const config = new MatSnackBarConfig();
            config.verticalPosition = 'top';
            config.horizontalPosition = 'center';
            config.duration = 5000;
            config.panelClass = ['custom-snackbar'];

            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Attenzione',
                message: 'Il tipo di contratto non é stato selezionato',
              },
            });
          }
        } else {
          console.log('Livello contratto non trovato nella lista');
        }
      } else {
        console.log('Valore non valido o livello contratto non selezionato');
      }
    }
  }

  onChamgeCanaleReclutamento(event: any) {
    const selectedValue = parseInt(event.target.value, 10); // Converte il valore selezionato in un numero

    const tipoCanaleReclutamento = this.AnagraficaDto.get(
      'anagrafica.tipoCanaleReclutamento.id'
    );

    if (!isNaN(selectedValue)) {
      // Cerca l'opzione selezionata nei contratti nazionali
      const selectedOption = this.tipologicaCanaliReclutamento.find(
        (canale: any) => canale.id === selectedValue
      );

      if (selectedOption) {
        console.log('Opzione selezionata: ', selectedOption);
        tipoCanaleReclutamento?.enable();
        this.ccnLSelezionato = true;
      } else {
        console.log('Opzione non trovata nei contratti nazionali');
      }
    } else {
      console.log('Valore non valido o CCNL non selezionato');
    }
  }

  onChangeCCNL(event: any) {
    const selectedValue = parseInt(event.target.value, 10); // Converte il valore selezionato in un numero

    const livelloControl = this.AnagraficaDto.get(
      'contratto.tipoLivelloContratto.id'
    );

    if (!isNaN(selectedValue)) {
      // Cerca l'opzione selezionata nei contratti nazionali
      const selectedOption = this.contrattiNazionali.find(
        (contratto: any) => contratto.id === selectedValue
      );

      if (selectedOption) {
        console.log('Opzione selezionata: ', selectedOption);
        this.numeroMensilitaCCNL = selectedOption.numeroMensilita;
        this.descrizioneLivelloCCNL = selectedOption.descrizione;
        console.log('numero mensilitá:' + this.numeroMensilitaCCNL);
        console.log('Livelli contratto: ' + this.descrizioneLivelloCCNL);
        livelloControl?.enable();
        this.ccnLSelezionato = true;
        // Qui andrà la chiamata per l'endpoint per la get del livello contratto
        this.anagraficaDtoService
          .changeCCNL(
            localStorage.getItem('token'),
            this.descrizioneLivelloCCNL
          )
          .subscribe(
            (response: any) => {
              console.log(
                'RESPONSE NUOVA LISTA LIVELLI CCNL:' + JSON.stringify(response)
              );
              this.elencoLivelliCCNL = response.list;
              console.log(
                '+-+-+-+-+-+-+-+-+-+-+-NUOVA LISTA LIVELLI CCNL+-+-+-+-+-+-+-+-+-+-+-' +
                  JSON.stringify(this.elencoLivelliCCNL)
              );
            },
            (error: any) => {
              console.error(
                'Errore durante il caricamento dei livelli di contratto: ' +
                  error
              );
            }
          );
      } else {
        console.log('Opzione non trovata nei contratti nazionali');
      }
    } else {
      console.log('Valore non valido o CCNL non selezionato');
      livelloControl?.disable();
      livelloControl?.setValue(null);
      this.ccnLSelezionato = false;
    }
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

  onChangeTipoAzienda(selectedId: any) {
    const selectedValue = parseInt(selectedId.target.value, 10);

    if (!isNaN(selectedValue)) {
      const selectedObject = this.tipiAziende.find(
        (azienda: any) => azienda.id === selectedValue
      );

      if (selectedObject) {
        console.log('Oggetto azienda selezionato: ', selectedObject);
      } else {
        console.log('Azienda non trovata nella lista');
      }
    } else {
      console.log('Valore non valido o azienda non selezionata');
    }
  }

  calcolaRetribuzioneMensileLorda() {
    const tipoContrattoControl = this.AnagraficaDto.get(
      'contratto.tipoContratto.id'
    )?.value;
    const tipoLivelloContrattoControl = this.AnagraficaDto.get(
      'contratto.tipoLivelloContratto.id'
    )?.value;
    const tipoCcnlControl = this.AnagraficaDto.get(
      'contratto.tipoCcnl.id'
    )?.value;
    const retribuzioneMensileLordaControl = this.AnagraficaDto.get(
      'retribuzioneMensileLorda'
    );

    console.log(
      'Il metodo ha questi valori:\n' +
        'Tipo contratto: ' +
        tipoContrattoControl +
        '\n' +
        'Livello contratto: ' +
        tipoLivelloContrattoControl +
        '\n' +
        'Tipo CCNL: ' +
        tipoCcnlControl
    );

    if (
      tipoContrattoControl === 4 &&
      tipoLivelloContrattoControl === 18 &&
      tipoCcnlControl === 1
    ) {
      retribuzioneMensileLordaControl?.setValue(1538.12);
    } else {
      retribuzioneMensileLordaControl?.setValue(null);
    }
  }

  //navbar

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idAnagraficaLoggata]);
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
        // this.codiceFiscaleDettaglio =response.anagraficaDto.anagrafica.codiceFiscale;
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
        // this.authService.logout();
      }
    );
  }

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        console.log('ID UTENTE PER NAV:' + this.idUtente);
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
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFileName = file.name;

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data: ArrayBuffer = e.target.result;
        const base64String: string = this.arrayBufferToBase64(data);
        this.previewExcel(base64String);
        this.base64Documento = base64String;
      };

      reader.readAsArrayBuffer(file);
    }
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  previewExcel(base64String: string): void {
    const workbook: XLSX.WorkBook = XLSX.read(base64String, { type: 'base64' });

    // Assuming the first sheet is the one you want to preview
    const firstSheetName = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

    // Convert the worksheet to HTML
    const htmlString: string = XLSX.write(workbook, {
      bookType: 'html',
      type: 'string',
    });

    // Display the preview
    this.previewData = htmlString;
  }

  salvaDocumento() {
    let body = {
      base64: this.base64Documento,
    };
    // console.log('BODY PER SALVATAGGIO DOCUMENTI: ' + JSON.stringify(body));
    this.anagraficaDtoService.salvaDocumento(body, this.token).subscribe(
      (result: any) => {
        // console.log(
        //   'RISULTATO SALVATAGGIO DOCUMENTI: ' + JSON.stringify(result)
        // );
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
