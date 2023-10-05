import { Commessa } from './../../anagraficaDto/nuova-anagrafica-dto/commessa';
import { AnagraficaDtoService } from '../../anagraficaDto/anagraficaDto-service';
import { ContrattoService } from './../../contratto/contratto-service';
import { DashboardService } from './../dashboard-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
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

declare var $: any;

@Component({
  selector: 'app-lista-dashboard',
  templateUrl: './lista-dashboard.component.html',
  styleUrls: ['./lista-dashboard.component.scss'],
})
export class ListaDashboardComponent {

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
  genericList: any[] = [];
  filterAnagraficaDto: FormGroup = new FormGroup({

    anagrafica: new FormGroup({
      nome: new FormControl(null),
      cognome: new FormControl(null),
      // attivo: new FormControl(null),
      tipoAzienda: new FormGroup({
        id: new FormControl(null),
      }),
    }),

    commessa: new FormGroup({
      aziendaCliente: new FormControl(null),
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

  ) {
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
          resp.list.filter((elem: any) => elem.commesse.length > 0);
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

  dettaglioAnagrafica(idAnagrafica: number) {
    idAnagrafica = this.idutenteCommessaInScadenza;
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
  vaiAModificaAnagrafica(idAnagrafica: number) {
    this.anagraficaDtoService
      .update(idAnagrafica, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.router.navigate(['/modifica-anagrafica/' + idAnagrafica]);
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
      aziendaCliente: new FormControl(''),
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
          commessa.aziendaCliente ? commessa.aziendaCliente.toString() : '',
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

    this.listaAnagraficheCommesseScadute.forEach((element: any) => {
      this.pageData.forEach((commessa: any) => {
        workSheetData.push([
          `${element.nome} ${element.cognome}`,
          element.codiceFiscale ? element.codiceFiscale.toString() : '',
          commessa.aziendaCliente ? commessa.aziendaCliente.toString() : '',
          commessa.clienteFinale ? commessa.clienteFinale.toString() : '',
          commessa.titoloPosizione ? commessa.titoloPosizione.toString() : '',
          commessa.distacco ? commessa.distacco.toString() : '',
          commessa.distaccoAzienda ? commessa.distaccoAzienda.toString() : '',
          this.datePipe.transform(commessa.distaccoData ? commessa.distaccoData.toString() : '', 'yyyy-MM-dd'),
          commessa.tariffaGiornaliera ? commessa.tariffaGiornaliera.toString() : '',
          commessa.aziendaDiFatturazioneInterna ? commessa.aziendaDiFatturazioneInterna.toString() : '',
          this.datePipe.transform(commessa.dataInizio ? commessa.dataInizio.toString() : '', 'yyyy-MM-dd'),
          this.datePipe.transform(commessa.dataFine ? commessa.dataFine.toString() : '', 'yyyy-MM-dd'),
          commessa.attivo ? 'Sì' : 'No',
          commessa.attesaLavori ? 'Sì' : 'No',
        ]);
      });
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
          commessa.aziendaCliente,
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
          commessa.attesaLavori
        ]);
      });
    });
    return this.genericList;
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `http://localhost:8080/services/funzioni-ruolo-tree/${this.idNav}`;
    this.http.get<MenuData>(url, { headers: headers }).subscribe(
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
      }
    );
  }

  getPermissions(functionId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `http://localhost:8080/services/operazioni/${functionId}`;
    this.http.get(url, { headers: headers }).subscribe(
      (data: any) => {
        console.log('Permessi ottenuti:', data);
      },
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
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
