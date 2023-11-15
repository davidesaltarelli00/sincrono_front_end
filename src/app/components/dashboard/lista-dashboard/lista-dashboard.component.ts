import { ImageService } from './../../image.service';
import { AnagraficaDtoService } from '../../anagraficaDto/anagraficaDto-service';
import { ContrattoService } from './../../contratto/contratto-service';
import { DashboardService } from './../dashboard-service.component';
import { ActivatedRoute, Router } from '@angular/router';

import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/login-service';
import { startWith } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { MenuService } from './../../menu.service';
declare var $: any;

@Component({
  selector: 'app-lista-dashboard',
  templateUrl: './lista-dashboard.component.html',
  styleUrls: ['./lista-dashboard.component.scss'],
})
export class ListaDashboardComponent {
  codiceFiscaleDettaglio: any;
  immagine: any;
  immagineConvertita: string | null = null;
  immaginePredefinita: string | null = null;
  aziendeClienti: any[] = [];
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  lista: any;
  data: any;
  livelliContrattuali: any = [];
  check1: boolean = false;
  check2: boolean = false;
  check3: boolean = false;
  dateString: any;
  userlogged: any;
  // paginazione
  currentPage: number = 1;
  itemsPerPage: number = 20; // Numero di elementi per pagina
  listaCommesseInScadenza: any[] = []; //array 2.0
  listaContrattiInScadenza: any[] = []; //array 2.0
  listaCommesseScadute: any[] = []; //array 2.0
  listaContrattiFromBatch: any[] = []; //array 2.0
  listaAnagraficheCommesseScadute: any[] = [];
  listaAnagraficaDtoFromResponse: any[] = [];
  mostraFiltri = false;
  originalLista: any;
  tipiAziende: any = [];
  idAnagraficaCommessaScaduta: any;
  idutenteCommessaInScadenza: any;
  idContrattoInScadenza = this.activatedRouter.snapshot.params['id'];
  idCommessaScaduta = this.activatedRouter.snapshot.params['id'];
  pageData: any[] = [];
  messaggio: any;
  commesse!: FormArray;
  annoDataInizio: any;
  annoDataFine: any;
  annoFineContratto: any;
  genericList: any[] = [];
  years: number[] = [];
  mobile: any = false;
  ruolo: any;
  idUtente: any;
  filterAnagraficaDto: FormGroup = new FormGroup({

    anagrafica: new FormGroup({
      nome: new FormControl(null),
      cognome: new FormControl(null),
      // attivo: new FormControl(null),
      tipoAzienda: new FormGroup({
        id: new FormControl(null),
        descrizione: new FormControl(''),
      }),
    }),

    commesse: new FormGroup({
      tipoAziendaCliente: new FormGroup({
        id: new FormControl(null),
        descrizione: new FormControl(null),
      }),
    }),

    annoDataFine: new FormControl(null),
    meseDataFine: new FormControl(null),
    annoDataInizio: new FormControl(null),
    meseDataInizio: new FormControl(null),

    annoFineContratto: new FormControl(null),
    meseFineContratto: new FormControl(null),
  });
  

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private contrattoService: ContrattoService,
    private authService: AuthService,
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private datePipe: DatePipe,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private menuService: MenuService,
    private imageService: ImageService
  ) {

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

    this.userlogged = localStorage.getItem('userLogged');

    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
    }
    this.filterAnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        nome: new FormControl(null),
        cognome: new FormControl(null),
        // attivo: new FormControl(null),
        tipoAzienda: new FormGroup({
          id: new FormControl(null),
          descrizione: new FormControl(null),
        }),
      }),

      commesse: this.formBuilder.array([]),
      annoDataFine: new FormControl(null),
      meseDataFine: new FormControl(null),
      annoDataInizio: new FormControl(null),
      meseDataInizio: new FormControl(null),
      annoFineContratto: new FormControl(null),
      meseFineContratto: new FormControl(null),
    });
    this.commesse = this.filterAnagraficaDto.get('commesse') as FormArray;


  }
  isTableVisible: boolean = false;
  isTable2Visible: boolean = false;
  isTableVisible1: boolean = false;

  ngOnInit(): void {
    this.caricaAziendeClienti();
    this.populateYears()
    this.commesse = this.filterAnagraficaDto.get('commesse') as FormArray;
    const commessaFormGroup = this.creaFormCommessa();
    this.commesse.push(commessaFormGroup);
    this.caricaTipoAzienda();


    this.dashboardService.listaScattiContratto(localStorage.getItem('token')).subscribe(
      (resp: any) => {
        this.listaContrattiFromBatch = (resp as any)['list'];
        console.log('Lista contratti in arrivo dal batch: ' + JSON.stringify(resp));
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il recupero dei contratti con scatto livello già effettuato: ' +
          error
        );
      }
    );

    this.dashboardService
      .getListaCommesseInScadenza(localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.listaCommesseInScadenza = (resp as any)['list'];
          (resp.list || []).forEach((item: any) => {
            if (item.anagrafica && item.anagrafica.id) {
              this.idutenteCommessaInScadenza = item.anagrafica.id;
              return;
            }
          });
          console.log(
            'UTENTE CON LA COMMESSA IN SCADENZA:' +
            this.idutenteCommessaInScadenza
          );
          console.log('Lista commesse in scadenza: ' + JSON.stringify(resp));
        },
        (error: any) => {
          console.error(
            'Si é verificato un errore durante il recupero della lista delle commesse in scadenza: ' +
            error
          );
        }
      );
    this.dashboardService
      .getListaContrattiInScadenza(localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.listaContrattiInScadenza = (resp as any)['list'];
          console.log('Lista contratti in scadenza: ' + JSON.stringify(resp));
        },
        (error: any) => {
          console.error(
            'Si é verificato un errore durante il recupero della lista dei contratti in scadenza: ' +
            error
          );
        }
      );

    this.dashboardService
      .getAllCommesseScadute(localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.listaCommesseScadute = this.createAnagraficaDtoList(resp.list);
          console.log(
            'Lista commesse scadute: ' +
            JSON.stringify(this.listaCommesseScadute)
          );

          this.currentPage = 1;
          this.pageData = this.getCurrentPageItems();
        },
        (error: any) => {
          console.error(
            'Si è verificato un errore durante il recupero della lista delle commesse: ' +
            error
          );
        }
      );

    this.mostraFiltri = false;

    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    }
  }


  filter(value: any) {
    console.log('Valore del form: ' + JSON.stringify(value));
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === '' || obj[key] === null) {
          delete obj[key];
        }
        if (obj.anagrafica && Object.keys(obj.anagrafica).length === 0) {
          delete obj.anagrafica;
        }
        if (obj.contratto && Object.keys(obj.contratto).length === 0) {
          delete obj.contratto;
        }
        if (obj.commesse && Object.keys(obj.commesse).length === 0) {
          delete obj.commesse;
        }
        if (obj.tipoAziendaCliente && Object.keys(obj.tipoAziendaCliente).length === 0) {
          delete obj.tipoAziendaCliente;
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
        if (obj.annoDataFine && Object.keys(obj.annoDataFine).length === 0) {
          delete obj.annoDataFine;
        }
        if (obj.meseDataFine && Object.keys(obj.meseDataFine).length === 0) {
          delete obj.meseDataFine;
        }
        if (
          obj.annoDataInizio &&
          Object.keys(obj.annoDataInizio).length === 0
        ) {
          delete obj.annoDataInizio;
        }
        if (
          obj.meseDataInizio &&
          Object.keys(obj.meseDataInizio).length === 0
        ) {
          delete obj.meseDataInizio;
        }
        if (
          obj.annoFineContratto &&
          Object.keys(obj.annoFineContratto).length === 0
        ) {
          delete obj.annoFineContratto;
        }
        if (
          obj.meseFineContratto &&
          Object.keys(obj.meseFineContratto).length === 0
        ) {
          delete obj.meseFineContratto;
        }
      });
    };
    removeEmpty(this.filterAnagraficaDto.value);


    const body = {
      anagraficaDto: this.filterAnagraficaDto.value,
      annoDataFine: this.filterAnagraficaDto.get('annoDataFine')?.value,
      meseDataFine: this.filterAnagraficaDto.get('meseDataFine')?.value,
      annoDataInizio: this.filterAnagraficaDto.get('annoDataInizio')?.value,
      meseDataInizio: this.filterAnagraficaDto.get('meseDataInizio')?.value,
      annoFineContratto:
        this.filterAnagraficaDto.get('annoFineContratto')?.value,
      meseFineContratto:
        this.filterAnagraficaDto.get('meseFineContratto')?.value,
    };

    console.log('PAYLOAD BACKEND FILTER: ' + JSON.stringify(body));
    this.dashboardService
      .commesseListFilter(localStorage.getItem('token'), body)
      .subscribe(
        (result) => {
          if ((result as any).esito.code !== 200) {
            alert(
              'Qualcosa è andato storto: \n' + (result as any).esito.target
            );
          } else {
            if (Array.isArray(result.list)) {
              this.pageData = [];
              this.listaCommesseScadute = this.createAnagraficaDtoList(result.list);
              this.currentPage = 1;
              this.pageData = this.getCurrentPageItems();
              console.log("result is " + JSON.stringify(result.list))
              console.log("daje" + this.listaCommesseScadute);
            } else {
              this.pageData = [];
              this.messaggio =
                'Nessun risultato trovato per i filtri inseriti, riprova.';
            }
            console.log(
              'Trovati i seguenti risultati: ' + JSON.stringify(result.list)
            );
          }
        },
        (error: any) => {
          console.log('Si è verificato un errore: ' + error);
        }
      );
  }

  annullaFiltri() {

    location.reload();

  }

  dettaglioAnagraficaContrattoInScadenza(idAnagrafica: number) {
    this.anagraficaDtoService
      .detailAnagraficaDto(idAnagrafica, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.router.navigate(['/dettaglio-anagrafica/' + idAnagrafica]);
      });
  }


  dettaglioAnagraficaCommessaScaduta(idAnagrafica: number) {
    idAnagrafica = this.idAnagraficaCommessaScaduta;
    this.anagraficaDtoService
      .detailAnagraficaDto(idAnagrafica, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.router.navigate(['/dettaglio-anagrafica/' + idAnagrafica]);
      });
  }

  profile() {
    this.router.navigate(['/profile-box/', this.userlogged]);
  }



  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
  }

  toggleTable() {
    this.isTableVisible = !this.isTableVisible;
  }
  toggleTable2() {
    this.isTable2Visible = !this.isTable2Visible;
  }
  toggleTable1() {
    this.isTableVisible1 = !this.isTableVisible1;
  }

  onChangeAttivo(event: any) {
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
  resetTabella() {
    this.dashboardService
      .deleteScattiContratto(localStorage.getItem('token'))
      .subscribe((resp: any) => {
        if ((resp as any).esito.code != 200) {
          alert(
            'cancellazione non riuscita\n' +
            'target: ' +
            (resp as any).esito.target
          );

        } else {
          this.data = [];
          alert('cancellazione riuscita');
          location.reload();
        }
      });
  }
  populateYears() {

    for (let year = 1999; year <= 2099; year++) {
      this.years.push(year);
    }

  }
  //paginazione
  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.listaCommesseScadute.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.listaCommesseScadute.length / this.itemsPerPage);
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

  creaFormCommessa(): FormGroup {
    return this.formBuilder.group({
      tipoAziendaCliente: new FormGroup({
        id: new FormControl(''),
        descrizione: new FormControl(''),
      }),
    });
  }

  caricaTipoAzienda() {
    this.contrattoService
      .getTipoAzienda(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiAziende = (result as any)['list'];
      });
  }

  exportContrattiInScadenzaToExcel() {
    // Verifica che ci siano dati validi prima di esportare
    console.log('Dati da esportare:', this.listaContrattiInScadenza);



    // Crea un nuovo libro Excel
    const workBook = XLSX.utils.book_new();

    const workSheetData = [
      // Intestazioni delle colonne
      ["Nome", "Cognome", "Tipo contratto", "CCNL", "Sede di assunzione", "Data Assunzione", "Mesi durata", "livello attuale", "livello finale", "RAL", "Ticket", "Categoria protetta", "Tutor", "PFI", "Sede di assunzione"]
    ];

    // Aggiungi dati
    this.listaContrattiInScadenza.forEach((item: any) => {
      workSheetData.push([
        item.anagrafica.nome ? item.anagrafica.nome.toString() : '',
        item.anagrafica.cognome ? item.anagrafica.cognome.toString() : '',
        item.contratto.tipoContratto.descrizione ? item.contratto.tipoContratto.descrizione.toString() : '',
        item.contratto.tipoLivelloContratto.ccnl ? item.contratto.tipoLivelloContratto.ccnl.toString() : '',
        item.contratto.sedeAssunzione ? item.contratto.sedeAssunzione.toString() : '',
        this.datePipe.transform(
          item.contratto.dataAssunzione ? item.contratto.dataAssunzione.toString() : '',
          'yyyy-MM-dd'
        ),
        item.contratto.mesiDurata ? item.contratto.mesiDurata.toString() : '',
        item.contratto.livelloAttuale ? item.contratto.livelloAttuale.toString() : '',
        item.contratto.livelloFinale ? item.contratto.livelloFinale.toString() : '',
        item.contratto.retribuzioneMensileLorda ? item.contratto.retribuzioneMensileLorda.toString() : '',
        item.contratto.ticket ? item.contratto.ticket.toString() : '',
        item.contratto.categoriaProtetta ? item.contratto.categoriaProtetta.toString() : '',
        item.contratto.tutor ? item.contratto.tutor.toString() : '',
        item.contratto.pfi ? item.contratto.pfi.toString() : '',
        item.contratto.sedeAssunzione ? item.contratto.sedeAssunzione.toString() : ''
      ]);
    });

    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);

    console.log('Dati nel foglio di lavoro:', workSheet);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'ContrattiInScadenza');
    // Esporta il libro Excel in un file
    XLSX.writeFile(workBook, 'contratti_in_scadenza.xlsx');

    (error: any) => {
      console.error(
        'Si è verificato un errore durante il recupero della lista dei contratti in scadenza: ' +
        error
      );
    }

  }

  exportCommesseInScadenzaToExcel() {
    // Verifica che ci siano dati validi prima di esportare
    console.log('Dati da esportare:', this.listaCommesseInScadenza);

    // Crea un nuovo libro Excel
    const workBook = XLSX.utils.book_new();

    const workSheetData = [
      // Intestazioni delle colonne
      ["Azienda Cliente", "Cliente finale", "Titolo posizione", "Distacco", "Distacco azienda", "Distacco data", "Tariffa giornaliera", "Azienda di fatturazione interna", "Data inizio", "Data fine", "Attivo"]
    ];

    // Aggiungi dati
    this.listaCommesseInScadenza.forEach((item: any) => {

      item.commesse.forEach((commessa: any) => {
        workSheetData.push([
          commessa.tipoAziendaCliente.descrizione ? commessa.tipoAziendaCliente.descrizione.toString() : '',
          commessa.clienteFinale ? commessa.clienteFinale.toString() : '',
          commessa.titoloPosizione ? commessa.titoloPosizione.toString() : '',
          commessa.distacco ? commessa.distacco.toString() : '',
          commessa.distaccoAzienda ? commessa.distaccoAzienda.toString() : '',
          this.datePipe.transform(
            commessa.distaccoData ? commessa.distaccoData.toString() : '', 'yyyy-MM-dd'
          ),
          commessa.tariffaGiornaliera ? commessa.tariffaGiornaliera.toString() : '',
          commessa.aziendaDiFatturazioneInterna ? commessa.aziendaDiFatturazioneInterna.toString() : '',
          this.datePipe.transform(
            commessa.dataInizio ? commessa.dataInizio.toString() : '', 'yyyy-MM-dd'
          ),
          this.datePipe.transform(
            commessa.dataFine ? commessa.dataFine.toString() : '', 'yyyy-MM-dd'
          ),
          commessa.attivo,
        ]);
      });
    });

    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);

    console.log('Dati nel foglio di lavoro:', workSheet);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'CommesseInScadenza');

    // Esporta il libro Excel in un file
    try {
      XLSX.writeFile(workBook, 'Commesse_in_scadenza.xlsx');
    } catch (error) {
      console.error('Errore durante l\'esportazione del file Excel:', error);
    }
  }

  exportCommesseScaduteToExcel() {
    // Verifica che ci siano dati validi prima di esportare
    console.log('Dati da esportare:', this.listaCommesseScadute);

    // Crea un nuovo libro Excel
    const workBook = XLSX.utils.book_new();

    const workSheetData = [
      // Intestazioni delle colonne
      ["Nominativo", "Codice fiscale", "Azienda Cliente", "Cliente finale", "Titolo posizione", "Distacco", "Distacco azienda", "Distacco data", "Tariffa giornaliera", "Azienda di fatturazione interna", "Data inizio", "Data fine", "Attivo", "Attesa lavori"]
    ];

    this.listaCommesseScadute.forEach((element: any) => {

      workSheetData.push([
        `${element[0]} ${element[1]}`,
        element[2] ? element[2].toString() : '',
        element[3] ? element[3].toString() : '',
        element[4] ? element[4].toString() : '',
        element[5] ? element[5].toString() : '',
        element[6] ? element[6].toString() : '',
        element[7] ? element[7].toString() : '',
        this.datePipe.transform(element[8] ? element[8].toString() : '', 'yyyy-MM-dd'),
        element[9] ? element[9].toString() : '',
        element[10] ? element[10].toString() : '',
        this.datePipe.transform(element[11] ? element[11].toString() : '', 'yyyy-MM-dd'),
        this.datePipe.transform(element[12] ? element[12].toString() : '', 'yyyy-MM-dd'),
        element[13] ? 'Sì' : 'No',
        element[14] ? 'Sì' : 'No',
      ]);

    });


    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);

    console.log('Dati nel foglio di lavoro:', workSheet);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'CommesseScadute');

    // Esporta il libro Excel in un file
    try {
      XLSX.writeFile(workBook, 'Commesse_scadute.xlsx');
    } catch (error) {
      console.error('Errore durante l\'esportazione del file Excel:', error);
    }

  }
  exportContrattiFromBatchToExcel() {
    // Verifica che ci siano dati validi prima di esportare
    console.log('Dati da esportare:', this.listaContrattiFromBatch);


    // Crea un nuovo libro Excel
    const workBook = XLSX.utils.book_new();

    const workSheetData = [
      // Intestazioni delle colonne
      ["Nome", "Cognome", "Tipo contratto", "CCNL", "Sede di assunzione", "Data Assunzione", "Mesi durata", "livello attuale", "livello finale", "RAL", "Ticket", "Categoria protetta", "Tutor", "PFI", "Sede di assunzione"]
    ];

    // Aggiungi dati
    this.listaContrattiFromBatch.forEach((item: any) => {
      workSheetData.push([
        item.anagrafica.nome ? item.anagrafica.nome.toString() : '',
        item.anagrafica.cognome ? item.anagrafica.cognome.toString() : '',
        item.contratto.tipoContratto.descrizione ? item.contratto.tipoContratto.descrizione.toString() : '',
        item.contratto.tipoLivelloContratto.ccnl ? item.contratto.tipoLivelloContratto.ccnl.toString() : '',
        item.contratto.sedeAssunzione ? item.contratto.sedeAssunzione.toString() : '',
        this.datePipe.transform(
          item.contratto.dataAssunzione ? item.contratto.dataAssunzione.toString() : '',
          'yyyy-MM-dd'
        ),
        item.contratto.mesiDurata ? item.contratto.mesiDurata.toString() : '',
        item.contratto.livelloAttuale ? item.contratto.livelloAttuale.toString() : '',
        item.contratto.livelloFinale ? item.contratto.livelloFinale.toString() : '',
        item.contratto.retribuzioneMensileLorda ? item.contratto.retribuzioneMensileLorda.toString() : '',
        item.contratto.ticket ? item.contratto.ticket.toString() : '',
        item.contratto.categoriaProtetta ? item.contratto.categoriaProtetta.toString() : '',
        item.contratto.tutor ? item.contratto.tutor.toString() : '',
        item.contratto.pfi ? item.contratto.pfi.toString() : '',
        item.contratto.sedeAssunzione ? item.contratto.sedeAssunzione.toString() : ''
      ]);
    });

    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);

    console.log('Dati nel foglio di lavoro:', workSheet);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'ContrattiScattoLivello');
    // Esporta il libro Excel in un file
    XLSX.writeFile(workBook, 'contratti_scatto_livello.xlsx');

    (error: any) => {
      console.error(
        'Si è verificato un errore durante il recupero della lista dei contratti con scatto livello effettuato: ' +
        error
      );
    }


  }

  setForm() {
    const meseDataFine = this.filterAnagraficaDto.get(
      'meseDataFine'
    ) as FormControl;
    const annoDataFine = this.filterAnagraficaDto.get(
      'annoDataFine'
    ) as FormControl;

    const meseDataInizio = this.filterAnagraficaDto.get(
      'meseDataInizio'
    ) as FormControl;
    const annoDataInizio = this.filterAnagraficaDto.get(
      'annoDataInizio'
    ) as FormControl;

    const meseFineContratto = this.filterAnagraficaDto.get(
      'meseFineContratto'
    ) as FormControl;
    const annoFineContratto = this.filterAnagraficaDto.get(
      'annoFineContratto'
    ) as FormControl;

    // Crea degli observable per i campi degli anni
    const annoDataFineChanges = annoDataFine.valueChanges.pipe(
      startWith(annoDataFine.value)
    );
    const annoDataInizioChanges = annoDataInizio.valueChanges.pipe(
      startWith(annoDataInizio.value)
    );
    const annoFineContrattoChanges = annoFineContratto.valueChanges.pipe(
      startWith(annoFineContratto.value)
    );

    // Iscriviti agli observable e abilita/disabilita i campi dei mesi in base ai valori degli anni
    annoDataFineChanges.subscribe((anno) => {
      if (anno) {
        meseDataFine.enable();
      } else {
        meseDataFine.disable();
        meseDataFine.setValue(null)
      }
    });

    annoDataInizioChanges.subscribe((anno) => {
      if (anno) {
        meseDataInizio.enable();
      } else {
        meseDataInizio.disable();
        meseDataInizio.setValue(null);
      }
    });

    annoFineContrattoChanges.subscribe((anno) => {
      if (anno) {
        meseFineContratto.enable();
      } else {
        meseFineContratto.disable();
        meseFineContratto.setValue(null);
      }
    });
  }

  showAnagraficaInfo(commessa: any) {
    if (commessa.anagrafica && commessa.anagrafica.id) {
      // Puoi fare qualcosa con commessa.anagrafica.id, come recuperare ulteriori informazioni
      // o navigare a una nuova pagina con questo ID.
      console.log('ID dell\'anagrafica:', commessa.anagrafica.id);
    } else {
      console.log('ID dell\'anagrafica non definito');
    }
  }

  createAnagraficaDtoList(resp: any) {
    this.genericList = [];
    resp.forEach((item: any) => {
      item.commesse.forEach((commessa: any) => {
        this.genericList.push([
          item.anagrafica.nome,
          item.anagrafica.cognome,
          item.anagrafica.codiceFiscale,
          commessa.tipoAziendaCliente.descrizione,
          commessa.clienteFinale,
          commessa.titoloPosizione,
          commessa.distacco,
          commessa.distaccoAzienda,
          commessa.distaccoData,
          commessa.tariffaGiornaliera,
          commessa.aziendaDiFatturazioneInterna,
          commessa.dataInizio,
          commessa.dataFine,
          commessa.attivo,
          commessa.attesaLavori,
          item.anagrafica.id
        ]);
      });
    });
    return this.genericList;
  }

  caricaAziendeClienti() {
    this.dashboardService.
      getAziendaCliente(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          console.log('NOMI AZIENDE CARICATI:' + JSON.stringify(result));
          this.aziendeClienti = (result as any)['list'];
        },
        (error: any) => {
          console.error(
            'errore durante il caricamento dei nomi azienda:' + error
          );
        }
      );
  }

  onChangeAziendaCliente(event: any) {
    const selectedValue = parseInt(event.target.value, 10);

    if (!isNaN(selectedValue)) {
      const selectedObject = this.aziendeClienti.find(
        (aziendaCliente: any) => aziendaCliente.id === selectedValue
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




  //metodi nav

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

  generateMenuByUserRole() {
    this.menuService.generateMenuByUserRole(this.token, this.idUtente).subscribe(
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
  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleDettaglio,
    };
    console.log(JSON.stringify(body));
    console.log('BODY PER GET IMAGE: ' + JSON.stringify(body));
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        //console.log('BASE64 ricevuto: ' + JSON.stringify(this.immagine));

        if (this.immagine) {
          this.convertBase64ToImage(this.immagine);
          //console.log('Valore di immagineConvertita:', this.immagineConvertita);
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
