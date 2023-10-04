import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { profileBoxService } from '../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss'],
})
export class UtenteComponent implements OnInit {
  codiceFiscale = '';
  data: any[] = [];
  user: any;
  messaggio = '';
  currentDate = new Date();
  currentMonth: any;
  currentYear: any;
  id = this.activatedRoute.snapshot.params['id'];
  elencoCommesse: any;
  contratto: any;
  italianMonths = [
    'gennaio', 'febbraio', 'marzo', 'aprile',
    'maggio', 'giugno', 'luglio', 'agosto',
    'settembre', 'ottobre', 'novembre', 'dicembre'
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileBoxService: profileBoxService,
    private dialog: MatDialog,
    private router: Router,
    private anagraficaDtoService: AnagraficaDtoService,
    private datePipe: DatePipe
  ) {
    this.currentMonth = this.italianMonths[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.user = (resp as any)['anagraficaDto'];
          console.log(this.user);
          this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
          this.contratto = (resp as any)['anagraficaDto']['contratto'];
          this.codiceFiscale = (resp as any)['anagraficaDto']['anagrafica'][
            'codiceFiscale'
          ];
          console.log('CODICE FISCALE:' + this.codiceFiscale);
          console.log('PARTE ENDPOINT PER RAPPORTINO');
          this.profileBoxService
            .getRapportino(localStorage.getItem('token'), this.codiceFiscale)
            .subscribe(
              (result: any) => {
                this.data = result;
                console.log('DATA: ' + JSON.stringify(this.data));
              },
              (error: any) => {
                console.error(
                  'ERRORE DURANTE IL CARICAMENTO DEL RAPPORTINO:' + error
                );
              }
            );
        },
        (error: any) => {
          console.error('ERRORE:' + JSON.stringify(error));
        }
      );
  }

  inviaRapportino() {
    const celleModificate = document.querySelectorAll(
      'td[contenteditable="true"]'
    );
    const datiExcel: string[][] = []; // Dichiarazione esplicita del tipo
    const intestazioni: string[] = ['Giorno', 'Cliente', 'Ore Ordinarie'];
    datiExcel.push(intestazioni); // Aggiungi l'intestazione all'array datiExcel

    let rowData: string[] = [];
    celleModificate.forEach((cella, index) => {
      const testoCella = cella.textContent || ''; // Se testoCella è null, lo converte in una stringa vuota
      rowData.push(testoCella);

      if ((index + 1) % 3 === 0) {
        datiExcel.push([...rowData]);
        rowData = [];
      }
    });

    const nomeFile = 'rapportino.xlsx';
    const foglioExcel = XLSX.utils.aoa_to_sheet(datiExcel);
    const libroExcel = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroExcel, foglioExcel, 'Rapportino');
    XLSX.writeFile(libroExcel, nomeFile);
  }

  /*

  exportListaAnagraficaToExcel() {
    const workBook = XLSX.utils.book_new();

    const workSheetData = [
      // Intestazioni delle colonne
      [
        'Nome',
        'Cognome',
        'Codice fiscale',
        'Nome azienda',
        'Mail aziendale',
        'Cell privato',
        'Contratto',
        'Attesa lavori',
      ],
    ];

    this.lista.forEach((item: any) => {
      workSheetData.push([
        item.anagrafica.nome ? item.anagrafica.nome.toString() : '',
        item.anagrafica.cognome ? item.anagrafica.cognome.toString() : '',
        item.anagrafica.codiceFiscale
          ? item.anagrafica.codiceFiscale.toString()
          : '',
        item.anagrafica.tipoAzienda.descrizione
          ? item.anagrafica.tipoAzienda.descrizione.toString()
          : '',
        item.anagrafica.mailAziendale
          ? item.anagrafica.mailAziendale.toString()
          : '',
        item.anagrafica.cellPrivato
          ? item.anagrafica.cellPrivato.toString()
          : '',
        item.contratto?.tipoContratto.descrizione
          ? item.contratto?.tipoContratto.descrizione.toString()
          : '',
        item.anagrafica.attesaLavori
          ? item.anagrafica.attesaLavori.toString()
          : 'No',
      ]);
    });
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);

    console.log('Dati nel foglio di lavoro:', workSheet);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'ListaAnagrafiche');
    // Esporta il libro Excel in un file
    XLSX.writeFile(workBook, 'lista_anagrafiche.xlsx');

    (error: any) => {
      console.error(
        'Si è verificato un errore durante il recupero della lista delle anagrafiche: ' +
          error
      );
    };
  }
  */
}

/*
{
    "esito": {
        "code": 200,
        "target": null,
        "args": null
    },
    "rapportinoDto": {
        "mese": {
            "mese": [
                {
                    "giorno": 2,
                    "cliente": "accenture",
                    "oreOrdinarie": 8.0
                },
                {
                    "giorno": 3,
                    "cliente": "accenture",
                    "oreOrdinarie": 8.0
                },
                {
                    "giorno": 4,
                    "cliente": "accenture",
                    "oreOrdinarie": 8.0
                }
            ]
        },
        "anagrafica": null
    }
}
*/
