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
  itemsPerPage: number = 5; // Numero di elementi per pagina
  listaCommesseInScadenza: any; //array 2.0
  listaContrattiInScadenza:any; //array 2.0
  listaCommesse:any; //array 2.0

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private contrattoService: ContrattoService,
    private authService: AuthService
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

    this.dashboardService.getListaCommesseInScadenza().subscribe( //localStorage.getItem('token')
      (resp: any) => {
        this.listaCommesseInScadenza=resp.list;
        console.log('Lista commesse in scadenza: ' + JSON.stringify(resp));
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il recupero della lista delle commesse in scadenza: ' +
            error
        );
      }
    );
    this.dashboardService.getListaContrattiInScadenza().subscribe(
      (resp: any) => {
        this.listaContrattiInScadenza=resp
        console.log('Lista contratti in scadenza: ' + JSON.stringify(resp));
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il recupero della lista dei contratti in scadenza: ' +
            error
        );
      }
    );
    this.dashboardService.getAllCommesseScadute().subscribe(
      (resp: any) => {
        this.listaCommesse=resp
        console.log('Lista ccommesse: ' + JSON.stringify(resp));
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il recupero della lista delle commesse: ' +
            error
        );
      }
    );
  }

  logout() {
    // this.authService.logout();
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
    return this.lista.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.lista.length / this.itemsPerPage);
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
