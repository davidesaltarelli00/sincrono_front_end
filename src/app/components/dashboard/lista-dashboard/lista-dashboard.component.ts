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

declare var $: any;

@Component({
  selector: 'app-lista-dashboard',
  templateUrl: './lista-dashboard.component.html',
  styleUrls: ['./lista-dashboard.component.scss'],
})
export class ListaDashboardComponent {

  lista: any;
  data: any;
  token: any;
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
  mostraFiltri = false;
  originalLista: any;
  tipiAziende: any = [];
  idutenteCommessaInScadenza: any;
  idContrattoInScadenza = this.activatedRouter.snapshot.params['id'];
  idCommessaScaduta = this.activatedRouter.snapshot.params['id'];
  pageData: any[] = [];
  messaggio: any;
  commesse!: FormArray;

  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      nome: new FormControl(null),
      cognome: new FormControl(null),
      // attivo: new FormControl(null),
      tipoAzienda: new FormGroup({
        id: new FormControl(null),
      }),
    }),

    commesse: new FormGroup({
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
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private datePipe: DatePipe,

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

    const commessaFormGroup = this.creaFormCommessa();
    this.commesse.push(commessaFormGroup);
  }
  isTableVisible: boolean = false;
  isTable2Visible: boolean = false;
  isTableVisible1: boolean = false;

  ngOnInit(): void {
    // this.dashboardService
    //   .listaDashboard(localStorage.getItem('token'))
    //   .subscribe((resp: any) => {
    //     this.lista = resp.list;
    //     console.log(this.lista);
    //   });

    // this.dashboardService
    //   .listaScattiContratto(localStorage.getItem('token'))
    //   .subscribe((resp: any) => {
    //     this.data = resp.list;
    //   });

    this.filterAnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        nome: new FormControl(null),
        cognome: new FormControl(null),
        attivo: new FormControl(null),
        tipoAzienda: new FormGroup({
          id: new FormControl(null),
        }),
      }),
      contratto: new FormGroup({
        dataFineRapporto: new FormControl(null),
      }),
      commesse: this.formBuilder.array([]),
      annoDataFine: new FormControl(null),
      meseDataFine: new FormControl(null),
      annoDataInizio: new FormControl(null),
      meseDataInizio: new FormControl(null),
    });

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
          this.listaCommesseScadute = [];
          for (const item of resp.list) {
            for (const commesse of item.commesse) {
              this.listaCommesseScadute.push(commesse);
            }
          }
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
  }
  filter(value: any) {
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
              for (const item of result.list) {
                if (Array.isArray(item.commesse)) {
                  for (const commesse of item.commesse) {
                    this.pageData.push(commesse);
                  }
                } else if (typeof item.commesse === 'object') {
                  // Gestisci il caso in cui item.commesse è un oggetto
                }
              }
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
    this.anagraficaDtoService
      .listAnagraficaDto(localStorage.getItem('token'))
      .subscribe((resp: any) => {
        this.lista = resp.list;
        location.reload();
      });
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

  profile() {
    this.router.navigate(['/profile-box/', this.userlogged]);
  }

  calcolaPeriodi(mesiDurata: any, descrizione: any): any {
    if (descrizione == 'METALMECCANICO PMI CONFAPI') {
      return mesiDurata / 3;
    }

    return mesiDurata / 2;
  }

  calcolaMesiPassati(dataAssunzione: Date, dataOdierna: Date): number {
    if (!dataAssunzione || !dataOdierna) {
      return 0;
    }

    const startYear = dataAssunzione.getFullYear();
    const startMonth = dataAssunzione.getMonth() + 1;
    const endYear = dataOdierna.getFullYear();
    const endMonth = dataOdierna.getMonth() + 1;
    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }

  calcolaScadenzaImminentePeriodo(
    dataAssunzione: Date,
    mesiDurata: number,
    descrizione: string
  ) {
    const currentDataAssunzione = new Date(dataAssunzione);
    const dataOdierna = new Date();

    if (descrizione == 'METALMECCANICO PMI CONFAPI') {
      if (
        this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) ==
        mesiDurata - 1
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) ==
        mesiDurata - 1
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  calcolaScadenzaImminentePeriodo2(
    dataAssunzione: Date,
    mesiDurata: number,
    descrizione: string
  ) {
    const currentDataAssunzione = new Date(dataAssunzione);
    const dataOdierna = new Date();

    if (descrizione == 'METALMECCANICO PMI CONFAPI') {
      if (
        this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) ==
        mesiDurata * 2 - 1
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) ==
        mesiDurata * 2 - 1
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  calcolaScadenzaImminentePeriodo3(dataAssunzione: Date, mesiDurata: number) {
    const currentDataAssunzione = new Date(dataAssunzione);
    const dataOdierna = new Date();

    if (
      this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) ==
      mesiDurata * 3 - 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  scadenzaContratti40Giorni(dataAssunzione: any, mesiDurata: any) {
    var currentDataAssunzione = new Date(dataAssunzione);
    var fineContratto = new Date(dataAssunzione);
    var year = currentDataAssunzione.getFullYear();
    fineContratto.setFullYear(
      year + Math.floor(mesiDurata / 12),
      currentDataAssunzione.getMonth() + (mesiDurata % 12),
      currentDataAssunzione.getDate()
    );
    var currentDate = new Date();

    // Calculate the difference in days between the end date and current date
    var daysRemaining = Math.ceil(
      (fineContratto.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine if the remaining days are within the specified threshold
    var thresholdDays = 40; // Adjust this value as per your requirement
    return daysRemaining <= thresholdDays;
  }

  scadenzaCommesse40Giorni(dataFine: any) {
    var dataAttuale = new Date();
    var fineCommessa = new Date(dataFine);
    // Calculate the difference in days between the end date and current date
    var daysRemaining = Math.ceil(
      (dataAttuale.getTime() - fineCommessa.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine if the remaining days are within the specified threshold
    var thresholdDays = 40; // Adjust this value as per your requirement
    return daysRemaining <= thresholdDays;
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
      ["Azienda Cliente", "Cliente finale", "Titolo posizione", "Distacco", "Distacco azienda", "Distacco data", "Tariffa giornaliera", "Azienda di fatturazione interna", "Data inizio", "Data fine"]
    ];

    // Aggiungi dati
    this.listaCommesseScadute.forEach((item: any) => {


      workSheetData.push([
        item.aziendaCliente ? item.aziendaCliente.toString() : '',
        item.clienteFinale ? item.clienteFinale.toString() : '',
        item.titoloPosizione ? item.titoloPosizione.toString() : '',
        item.distacco ? item.distacco.toString() : '',
        item.distaccoAzienda ? item.distaccoAzienda.toString() : '',
        this.datePipe.transform(
          item.distaccoData ? item.distaccoData.toString() : '', 'yyyy-MM-dd'
        ),
        item.tariffaGiornaliera ? item.tariffaGiornaliera.toString() : '',
        item.aziendaDiFatturazioneInterna ? item.aziendaDiFatturazioneInterna.toString() : '',
        this.datePipe.transform(
          item.dataInizio ? item.dataInizio.toString() : '', 'yyyy-MM-dd'
        ),
        this.datePipe.transform(
          item.dataFine ? item.dataFine.toString() : '', 'yyyy-MM-dd'
        ),

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


}