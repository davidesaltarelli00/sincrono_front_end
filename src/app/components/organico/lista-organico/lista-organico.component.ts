import { OrganicoService } from '../organico-service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/login-service';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-lista-organico',
  templateUrl: './lista-organico.component.html',
  styleUrls: ['./lista-organico.component.scss'],
})
export class ListaOrganicoComponent implements OnInit {
  lista: any;
  token: any;

  submitted = false;
  errore = false;
  messaggio: any;
  userlogged:any;
  role: any;

  constructor(
    private organicoService: OrganicoService,
    private router: Router,
    private authService:AuthService
  ) {
    this.userlogged = localStorage.getItem('userLogged');

    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
  }
  }

  logout() {
    // this.authService.logout();
  }

  profile(){
    this.router.navigate(['/profile-box/',this.userlogged]);
  }

  ngOnInit(): void {
    this.organicoService.listaOrganico(localStorage.getItem('token')).subscribe((resp: any) => {
      const jsonResp = JSON.stringify(resp);
      console.log(jsonResp);
      this.lista = resp.list;
      this.createBarChart();

    },
    (error:string)=>{
      console.log("errore durante il caricamento dei dati dell'organico:"+error)
    }
    );

  }

  filter(tipoContratto: any, tipoAzienda: any) {
    this.router.navigate(['/lista-anagrafica', { tipoContratto, tipoAzienda }]);
  }

  calculateSliceRotation(element: any): number {
    const total = element.numeroDipendenti + element.indeterminati + element.determinati +
                  element.apprendistato + element.consulenza + element.stage +
                  element.partitaIva + element.potenzialeStage + element.slotStage +
                  element.potenzialeApprendistato + element.slotApprendistato;

    const percentage = (element.numeroDipendenti / total) * 360;
    return percentage;
  }

  calculatePercentage(element: any): number {
    const total = element.numeroDipendenti + element.indeterminati + element.determinati +
                  element.apprendistato + element.consulenza + element.stage +
                  element.partitaIva + element.potenzialeStage + element.slotStage +
                  element.potenzialeApprendistato + element.slotApprendistato;

    const percentage = (element.numeroDipendenti / total) * 100;
    return Math.round(percentage);
  }



 
  createBarChart() {
  const labels = this.lista.map((item: any) => item.azienda);
  const dataNumeroDipendenti = this.lista.map((item: any) => item.numeroDipendenti);
  const dataIndeterminati = this.lista.map((item: any) => item.indeterminati);
  const dataDeterminati= this.lista.map((item:any)=>item.determinati);
  const dataApprendistato= this.lista.map((item:any)=>item.apprendistato);
  const dataConsulenza= this.lista.map((item:any)=>item.consulenza);
  const dataStage= this.lista.map((item:any)=>item.stage);
  const dataPartitaIva=this.lista.map((item:any)=>item.partitaIva);
  const dataPotenzialeStage=this.lista.map((item:any)=>item.potenzialeStage);
  const dataSlotStage=this.lista.map((item:any)=>item.slotStage);
  const dataPotenzialeApprendistato=this.lista.map((item:any)=>item.potenzialeApprendistato);
  const dataSlotApprendistato=this.lista.map((item:any)=>item.slotApprendistato);

  const ctx = document.getElementById('barChart') as HTMLCanvasElement;
  const myChart = new Chart(ctx, {
    type: 'bar', 
    /* 
    possibili tipi:
    -bar:a barre
    -pie:torta
    -line:linee
    -radar: triangoli (?)
    -polarArea:semicerchio
    -doughnut:cerchi separati
    -scatterPlot:Non funziona
    -bubble:puntini
    -mixed:Non funziona
    -histogram:Non funziona 
    -Gauge:Non funziona
    -Heatmap: Non funziona
    */
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Numero Dipendenti',
          data: dataNumeroDipendenti,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Colore delle barre
          borderColor: 'rgba(75, 192, 192, 1)', // Colore dei bordi delle barre
          borderWidth: 1, // Spessore dei bordi delle barre
        },
        {
          label: 'Contratti Indeterminati',
          data: dataIndeterminati,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Colore delle barre per i contratti indeterminati
          borderColor: 'rgba(255, 99, 132, 1)', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Contratti determinati',
          data: dataDeterminati,
          backgroundColor: 'rgb(243, 243, 143)', // Colore delle barre per i contratti indeterminati
          borderColor: 'rgb(243, 243, 143)', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Contratti apprendistato',
          data: dataApprendistato,
          backgroundColor: '#82FF00', // Colore delle barre per i contratti indeterminati
          borderColor: '#82FF00', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Contratti consulenza',
          data: dataConsulenza,
          backgroundColor: '#FF8C00', // Colore delle barre per i contratti indeterminati
          borderColor: '#FF8C00', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Contratti stage',
          data: dataStage,
          backgroundColor: '#00FFAA', // Colore delle barre per i contratti indeterminati
          borderColor: '#00FFAA', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Partita iva',
          data: dataPartitaIva,
          backgroundColor: '#00A0FF', // Colore delle barre per i contratti indeterminati
          borderColor: '#00A0FF', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Potenziale stage',
          data: dataPotenzialeStage,
          backgroundColor: '#E600FF', // Colore delle barre per i contratti indeterminati
          borderColor: '#E600FF', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Slot stage',
          data: dataSlotStage,
          backgroundColor: '#7F8C83', // Colore delle barre per i contratti indeterminati
          borderColor: '#7F8C83', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Potenziale apprendistato',
          data: dataPotenzialeApprendistato,
          backgroundColor: '#FF8FBA', // Colore delle barre per i contratti indeterminati
          borderColor: '#FF8FBA', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
        {
          label: 'Slot apprendistato',
          data: dataSlotApprendistato,
          backgroundColor: '#B1983E', // Colore delle barre per i contratti indeterminati
          borderColor: '#B1983E', // Colore dei bordi delle barre per i contratti indeterminati
          borderWidth: 1, // Spessore dei bordi delle barre per i contratti indeterminati
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

}
