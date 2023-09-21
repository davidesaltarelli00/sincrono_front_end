import { OrganicoService } from '../organico-service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/login-service';
import { Chart } from 'chart.js/auto';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lista-organico',
  templateUrl: './lista-organico.component.html',
  styleUrls: ['./lista-organico.component.scss'],
})
export class ListaOrganicoComponent implements OnInit {
  lista: any;
  token: any;
  labelsX: string[] = [];

  submitted = false;
  errore = false;
  messaggio: any;
  userlogged: any;
  role: any;

  constructor(
    private organicoService: OrganicoService,
    private router: Router,
    private authService: AuthService
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

  profile() {
    this.router.navigate(['/profile-box/', this.userlogged]);
  }

  ngOnInit(): void {
    this.organicoService.listaOrganico(localStorage.getItem('token')).subscribe((resp: any) => {
      const jsonResp = JSON.stringify(resp);
      console.log(jsonResp);
      this.lista = resp.list;
      this.createBarChart();

    },
      (error: string) => {
        console.log("errore durante il caricamento dei dati dell'organico:" + error)
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
    const dataDeterminati = this.lista.map((item: any) => item.determinati);
    const dataApprendistato = this.lista.map((item: any) => item.apprendistato);
    const dataConsulenza = this.lista.map((item: any) => item.consulenza);
    const dataStage = this.lista.map((item: any) => item.stage);
    const dataPartitaIva = this.lista.map((item: any) => item.partitaIva);
    const dataPotenzialeStage = this.lista.map((item: any) => item.potenzialeStage);
    const dataSlotStage = this.lista.map((item: any) => item.slotStage);
    const dataPotenzialeApprendistato = this.lista.map((item: any) => item.potenzialeApprendistato);
    const dataSlotApprendistato = this.lista.map((item: any) => item.slotApprendistato);

    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',

      data: {
        labels: labels,
        datasets: [
          {
            label: 'Numero Dipendenti',
            data: dataNumeroDipendenti,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Contratti Indeterminati',
            data: dataIndeterminati,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Contratti determinati',
            data: dataDeterminati,
            backgroundColor: 'rgb(243, 243, 143)',
            borderColor: 'rgb(243, 243, 143)',
            borderWidth: 1,
          },
          {
            label: 'Contratti apprendistato',
            data: dataApprendistato,
            backgroundColor: '#82FF00',
            borderColor: '#82FF00',
            borderWidth: 1,
          },
          {
            label: 'Contratti consulenza',
            data: dataConsulenza,
            backgroundColor: '#FF8C00',
            borderColor: '#FF8C00',
            borderWidth: 1,
          },
          {
            label: 'Contratti stage',
            data: dataStage,
            backgroundColor: '#00FFAA',
            borderColor: '#00FFAA',
            borderWidth: 1,
          },
          {
            label: 'Partita iva',
            data: dataPartitaIva,
            backgroundColor: '#00A0FF',
            borderColor: '#00A0FF',
            borderWidth: 1,
          },
          {
            label: 'Potenziale stage',
            data: dataPotenzialeStage,
            backgroundColor: '#E600FF',
            borderColor: '#E600FF',
            borderWidth: 1,
          },
          {
            label: 'Slot stage',
            data: dataSlotStage,
            backgroundColor: '#7F8C83',
            borderColor: '#7F8C83',
            borderWidth: 1,
          },
          {
            label: 'Potenziale apprendistato',
            data: dataPotenzialeApprendistato,
            backgroundColor: '#FF8FBA',
            borderColor: '#FF8FBA',
            borderWidth: 1,
          },
          {
            label: 'Slot apprendistato',
            data: dataSlotApprendistato,
            backgroundColor: '#B1983E',
            borderColor: '#B1983E',
            borderWidth: 1,

          },
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Aziende',
            },
          },
          y: {
            beginAtZero: true,
          },
        },


        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedIndex = elements[0].index;
            const clickedLabel = labels[clickedIndex];
            const tipoContratto = myChart.data.datasets[elements[0].datasetIndex].label;

            // Verifica se il tipo di contratto è uno di quelli desiderati
            if (tipoContratto === 'Numero Dipendenti' || tipoContratto === 'Contratti Indeterminati' || tipoContratto === 'Contratti determinati') {
              // Modifica il tipo di contratto in "Determinato" se necessario
              const tipoContrattoCorretto1 = tipoContratto === 'Contratti determinati' ? 'Determinato' : tipoContratto;
              const tipoContrattoCorretto2 = tipoContratto === 'Contratti Indeterminati' ? 'Indeterminato' : tipoContratto;
              if (tipoContrattoCorretto1) {
                this.filter(tipoContrattoCorretto1, clickedLabel);
              } if (tipoContrattoCorretto2) {
                this.filter(tipoContrattoCorretto2, clickedLabel);
              }
            }
          }
        },


      },
    });


  }


  exportOrganicoToExcel() {
    const workBook = XLSX.utils.book_new();

    const workSheetData = [
      // Intestazioni delle colonne
      ["Azienda", "Numero dipendenti", "Indeterminati", "Determinati", "Apprendistato", "Consulenza", "Stage", "Partita iva", "Potenziale stage", "Slot stage", "Potenziale apprendistato", "Slot apprendistato"]
    ];
    this.lista.forEach((item: any) => {
      workSheetData.push([
        item.azienda ? item.azienda.toString() : 'Non inserito',
        item.numeroDipendenti ? item.numeroDipendenti.toString() : '0',
        item.indeterminati ? item.indeterminati.toString() : '0',
        item.determinati ? item.determinati.toString() : '0',
        item.apprendistato ? item.apprendistato.toString() : '0',
        item.consulenza ? item.consulenza.toString() : '0',
        item.stage ? item.stage.toString() : '0',
        item.partitaIva ? item.partitaIva.toString() : 'Non inserito',
        item.potenzialeStage ? item.potenzialeStage.toString() : '0',
        item.slotStage ? item.slotStage.toString() : '0',
        item.potenzialeApprendistato ? item.potenzialeApprendistato.toString() : '0',
        item.slotApprendistato ? item.slotApprendistato.toString() : '0',
      ]);
    });

    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);

    console.log('Dati nel foglio di lavoro:', workSheet);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'ListaOrganico');
    // Esporta il libro Excel in un file
    XLSX.writeFile(workBook, 'lista_organico.xlsx');

    (error: any) => {
      console.error(
        'Si è verificato un errore durante il recupero della lista dell organico: ' +
        error
      );
    }
  }


}


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
   Line Chart (Grafico a Linee): Questo tipo di grafico è utile per mostrare tendenze o variazioni nel tempo. È spesso utilizzato per rappresentare dati continui come serie temporali.

Radar Chart (Grafico Radar): Questo grafico viene utilizzato per mostrare dati multipli su diverse categorie in un formato radiale. È adatto per confrontare più categorie su diverse variabili.

Polar Area Chart (Grafico ad Area Polare): Simile al grafico a torta, questo tipo di grafico mostra dati percentuali su una scala circolare, ma può avere più categorie e rappresentare valori in una scala radiale.

Doughnut Chart (Grafico a Ciambella): Questo è un altro tipo di grafico circolare simile al grafico a torta, ma ha un foro al centro. Puoi utilizzarlo per rappresentare percentuali di contributi di varie categorie.

Scatter Plot (Grafico a Dispersione): Questo tipo di grafico viene utilizzato per visualizzare la relazione tra due variabili numeriche. Ogni punto rappresenta una coppia di valori.

Bubble Chart (Grafico a Bolle): È simile al grafico a dispersione, ma include una terza dimensione, rappresentata dalle dimensioni delle bolle. Le bolle più grandi rappresentano valori più grandi.

Mixed Charts (Grafici Misti): Puoi combinare diversi tipi di grafico in un'unica visualizzazione. Ad esempio, un grafico a barre e un grafico a linee possono essere combinati in un unico grafico.

Histogram (Istogramma): Questo grafico è utilizzato per visualizzare la distribuzione di dati in bin o intervalli. È particolarmente utile per dati numerici continui.

Gauge Chart (Grafico Gauge): Questo tipo di grafico è utilizzato per mostrare una singola misura rispetto a una scala fissa, ad esempio per rappresentare un livello di completamento.

Heatmap (Mappa di Calore): Una mappa di calore è utilizzata per rappresentare dati in una matrice attraverso colori. È spesso utilizzata per evidenziare modelli o tendenze in dati complessi.

Questi sono solo alcuni esempi dei tipi di grafico supportati da Chart.js. Puoi trovare ulteriori tipi di grafico e opzioni di personalizzazione nella documentazione ufficiale di Chart.js, e puoi selezionare il tipo di grafico più adatto ai tuoi dati e alle tue esigenze specifiche.

altri attrivuti di stile per le barre del grafico:
/*
          hoverBackgroundColor: '#FFD700', // Colore quando passi sopra con il mouse
         hoverBorderColor: '#FFD700', // Colore dei bordi quando passi sopra con il mouse
         borderRadius: 10, // Angoli arrotondati
         maxBarThickness: 30, // Larghezza massima delle barre

   */
