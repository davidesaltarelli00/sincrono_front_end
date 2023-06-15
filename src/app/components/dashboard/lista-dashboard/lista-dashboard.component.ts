import { ContrattoService } from './../../contratto/contratto-service';
import { DashboardService } from './../dashboard-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';



declare var $: any;

@Component({
  selector: 'app-lista-dashboard',
  templateUrl: './lista-dashboard.component.html',
  styleUrls: ['./lista-dashboard.component.scss']
})

export class ListaDashboardComponent {

  lista: any;
  token: any;
  livelliContrattuali: any = [];
  check1: boolean = false;
  check2: boolean = false;
  check3: boolean = false;
  dateString: any
  constructor(private dashboardService: DashboardService, private router: Router, private contrattoService: ContrattoService) { }

  ngOnInit(): void {

    this.dashboardService.listaDashboard().subscribe((resp: any) => {
      this.lista = resp.list;
     

      $(function () {
        $('#table').DataTable({
          "autoWidth": false,
          "responsive": true,
        });
      });
    });


  }

  calcolaPeriodi(mesiDurata: any, descrizione: any): any {

    if (descrizione == "METALMECCANICO PMI CONFAPI") {
      return mesiDurata / 3
    }

    return mesiDurata / 2

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

  calcolaScadenzaImminentePeriodo(dataAssunzione: Date, mesiDurata: number, descrizione: string) {
    const currentDataAssunzione = new Date(dataAssunzione)
    const dataOdierna = new Date()


    if (descrizione == "METALMECCANICO PMI CONFAPI") {


      if (this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) == (mesiDurata - 1)) {
       
        return true


      } else {
        return false
      }



    } else {

      if (this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) == (mesiDurata - 1)) {
        

        return true

      } else {

        return false

      }
    }

  }

  calcolaScadenzaImminentePeriodo2(dataAssunzione: Date, mesiDurata: number, descrizione: string) {
    const currentDataAssunzione = new Date(dataAssunzione)
    const dataOdierna = new Date()


    if (descrizione == "METALMECCANICO PMI CONFAPI") {
      if (this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) == (mesiDurata * 2 - 1)) {
       

        return true

      }

      else {

        return false
      }



    } else {

      if (this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) == (mesiDurata * 2 - 1)) {
     
        return true

      } else {

        return false

      }
    }

  }

  calcolaScadenzaImminentePeriodo3(dataAssunzione: Date, mesiDurata: number) {
    const currentDataAssunzione = new Date(dataAssunzione)
    const dataOdierna = new Date()



    if (this.calcolaMesiPassati(currentDataAssunzione, dataOdierna) == (mesiDurata * 3 - 1)) {
  
      return true

    }
    else {
      return false
    }


  }

  scadenzaContratti40Giorni(dataAssunzione: any, mesiDurata: any) {
    var currentDataAssunzione = new Date(dataAssunzione);
    var fineContratto = new Date(dataAssunzione);
    var year = currentDataAssunzione.getFullYear();
    fineContratto.setFullYear(year + Math.floor(mesiDurata / 12), currentDataAssunzione.getMonth() + (mesiDurata % 12), currentDataAssunzione.getDate());
    var currentDate = new Date();

    // Calculate the difference in days between the end date and current date
    var daysRemaining = Math.ceil((fineContratto.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  

    // Determine if the remaining days are within the specified threshold
    var thresholdDays = 40; // Adjust this value as per your requirement
    return daysRemaining <= thresholdDays;

  }

  scadenzaCommesse40Giorni( dataFine: any) {
    var dataAttuale = new Date();
    var fineCommessa = new Date(dataFine);
    // Calculate the difference in days between the end date and current date
    var daysRemaining = Math.ceil((dataAttuale.getTime() - fineCommessa.getTime()) / (1000 * 60 * 60 * 24));

    // Determine if the remaining days are within the specified threshold
    var thresholdDays = 40; // Adjust this value as per your requirement
    return daysRemaining <= thresholdDays;

  }


  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric'
    });
  }



}