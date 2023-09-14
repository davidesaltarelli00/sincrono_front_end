import { AnagraficaDtoService } from '../../anagraficaDto/anagraficaDto-service';
import { ContrattoService } from './../../contratto/contratto-service';
import { DashboardService } from './../dashboard-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/login-service';

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
  listaCommesseInScadenza: any[]=[]; //array 2.0
  listaContrattiInScadenza:any[]=[] ; //array 2.0
  listaCommesseScadute:any[]=[]; //array 2.0
  mostraFiltri = false;
  originalLista: any;
  tipiAziende: any = [];
  idutenteCommessaInScadenza :any
  idContrattoInScadenza = this.activatedRouter.snapshot.params['id'];
  idCommessaScaduta = this.activatedRouter.snapshot.params['id'];
  pageData:any[]=[];


  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      nome: new FormControl(null),
      cognome: new FormControl(null),
      attivo: new FormControl(null),
      tipoAzienda: new FormGroup({
        descrizione: new FormControl(null),
      }),
    }),
    contratto: new FormGroup({
      dataFineRapporto: new FormControl(null),
    }),
    commessa: new FormGroup({
      aziendaCliente: new FormControl(null),
      dataFine: new FormControl(null),
    }),
  });

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private contrattoService: ContrattoService,
    private authService: AuthService,
    private anagraficaDtoService :AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,

  ) {
    this.userlogged = localStorage.getItem('userLogged');

    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
    }
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

    this.dashboardService.getListaCommesseInScadenza(localStorage.getItem('token')).subscribe(
      (resp: any) => {
        this.listaCommesseInScadenza=(resp as any)['list'];
        (resp.list || []).forEach((item:any) => {
          if (item.anagrafica && item.anagrafica.id) {
            this. idutenteCommessaInScadenza = item.anagrafica.id;
            return;
          }
        });
        console.log("UTENTE CON LA COMMESSA IN SCADENZA:"+ this.idutenteCommessaInScadenza);
        console.log('Lista commesse in scadenza: ' + JSON.stringify(resp));
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il recupero della lista delle commesse in scadenza: ' +
            error
        );
      }
    );
    this.dashboardService.getListaContrattiInScadenza(localStorage.getItem('token')).subscribe(
      (resp: any) => {
        this.listaContrattiInScadenza=(resp as any)['list'];
        console.log('Lista contratti in scadenza: ' + JSON.stringify(resp));
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il recupero della lista dei contratti in scadenza: ' +
            error
        );
      }
    );
    this.dashboardService.getAllCommesseScadute(localStorage.getItem('token')).subscribe(
      (resp: any) => {
        this.listaCommesseScadute = [];
        for (const item of resp.list) {
          for (const commessa of item.commesse) {
            this.listaCommesseScadute.push(commessa);
          }
        }
        console.log('Lista commesse scadute: ' + JSON.stringify(this.listaCommesseScadute));
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

    this.filterAnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        nome: new FormControl(null),
        cognome: new FormControl(null),
        attivo: new FormControl(null),
        tipoAzienda: new FormGroup({
        descrizione: new FormControl(null),
        }),
      }),
      contratto: new FormGroup({
        dataFineRapporto: new FormControl(null),
      }),
      commessa: new FormGroup({
        aziendaCliente: new FormControl(null),
        dataFine: new FormControl(null),
      }),
    });

  }
  filter() {
    const filtroNome =
      this.filterAnagraficaDto.value.anagrafica.nome != null
        ? this.filterAnagraficaDto.value.anagrafica.nome
        : '';

    const filtroCognome =
      this.filterAnagraficaDto.value.anagrafica.cognome != null
        ? this.filterAnagraficaDto.value.anagrafica.cognome
        : '';
    const filtroTipoAzienda =
      this.filterAnagraficaDto.value.anagrafica.tipoAzienda.descrizione != null
        ? this.filterAnagraficaDto.value.anagrafica.tipoAzienda.descrizione
        : '';
    const filtroAttivo =
      this.filterAnagraficaDto.value.anagrafica.attivo != null
        ? this.filterAnagraficaDto.value.anagrafica.attivo
        : false;

    const filtroDataFineRapporto =
      this.filterAnagraficaDto.value.contratto.dataFineRapporto != null
        ? this.filterAnagraficaDto.value.contratto.dataFineRapporto
        : '';

    const filtroAziendaCliente =
      this.filterAnagraficaDto.value.commessa.aziendaCliente != null
        ? this.filterAnagraficaDto.value.commessa.aziendaCliente
        : '';

        const filtroDataFineCommessa =
      this.filterAnagraficaDto.value.commessa.dataFine != null
        ? this.filterAnagraficaDto.value.commessa.dataFine
        : '';




    this.lista = this.originalLista.filter((element: any) => {
      var nome;

      if (!element?.anagrafica.nome || element?.anagrafica.nome == '') {
        nome = 'undefined';
      } else {
        nome = element?.anagrafica.nome;
      }

      var cognome;

      if (!element?.anagrafica.cognome || element?.anagrafica.cognome == '') {
        cognome = 'undefined';
      } else {
        cognome = element?.anagrafica.cognome;
      }

      var aziendaTipo;

      if (
        !element?.anagrafica.aziendaTipo.descrizione ||
        element?.anagrafica.aziendaTipo.descrizione == ''
      ) {
        aziendaTipo = 'undefined';
      } else {
        aziendaTipo = element?.anagrafica.aziendaTipo.descrizione;
      }

      var attivo;

      if (!element?.anagrafica.attivo || element?.anagrafica.attivo == '') {
        attivo = 'undefined';
      } else {
        attivo = element?.anagrafica.attivo;
      }

      var aziendaCliente;

     if (!element?.commessa.aziendaCliente || element?.commessa.aziendaCliente == '') {
      aziendaCliente = 'undefined';
    } else {
      aziendaCliente = element?.commessa.aziendaCliente;
    }

    const dataFineCommessa =
    element?.commessa.dataFine ?? 'undefined';

    const dataFineRapporto =
    element?.contratto.dataFineRapporto ?? 'undefined';




      return (
        nome == filtroNome ||
        cognome == filtroCognome ||
        aziendaTipo == filtroTipoAzienda ||
        attivo == filtroAttivo ||
        new Date(dataFineRapporto).getTime() ==
        new Date(filtroDataFineRapporto).getTime() ||
        new Date(dataFineCommessa).getTime() ==
        new Date(filtroDataFineCommessa).getTime() ||
        aziendaCliente==filtroAziendaCliente
      );
    });
  }

  annullaFiltri() {
    this.anagraficaDtoService
      .listAnagraficaDto(localStorage.getItem('token'))
      .subscribe((resp: any) => {
        this.lista = resp.list;
        location.reload();
      });
  }

  dettaglioAnagraficaContrattoInScadenza(idAnagrafica:number){
    this.anagraficaDtoService
    .detailAnagraficaDto(idAnagrafica, localStorage.getItem('token'))
    .subscribe((resp: any) => {
      console.log(resp);
      this.router.navigate(['/dettaglio-anagrafica/'+ idAnagrafica])
    });
  }

  dettaglioAnagrafica(idAnagrafica:number){
    idAnagrafica=this.idutenteCommessaInScadenza;
    this.anagraficaDtoService
    .detailAnagraficaDto(idAnagrafica, localStorage.getItem('token'))
    .subscribe((resp: any) => {
      console.log(resp);
      this.router.navigate(['/dettaglio-anagrafica/'+ idAnagrafica])
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

  resetTabella() {
    this.dashboardService
      .deleteScattiContratto(localStorage.getItem('token'))
      .subscribe((resp: any) => {
        if ((resp as any).esito.code != 0) {
          alert(
            'cancellazione non riuscita\n' +
              'target: ' +
              (resp as any).esito.target
          );
          return;
        } else {
          this.data = [];
          alert('cancellazione riuscita');
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

  //fine paginazione
}
