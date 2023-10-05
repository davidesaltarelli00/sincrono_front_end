import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import * as XLSX from 'xlsx';
import { MenuService } from '../menu.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

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
    'gennaio',
    'febbraio',
    'marzo',
    'aprile',
    'maggio',
    'giugno',
    'luglio',
    'agosto',
    'settembre',
    'ottobre',
    'novembre',
    'dicembre',
  ];

  rapportinoDto: any[] = [];

  @ViewChild('editableTable') editableTable!: ElementRef;

  modifiedData: any[] = [];

  token = localStorage.getItem('token');

  constructor(
    private activatedRoute: ActivatedRoute,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private router: Router,
    private anagraficaDtoService: AnagraficaDtoService,
    private datePipe: DatePipe,
    private menuService: MenuService
  ) {
    this.currentMonth = this.italianMonths[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getAnagraficaRapportino();
    } else {
      console.error('ERRORE DI AUTENTICAZIONE');
    }
  }

  getAnagraficaRapportino() {
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
          this.getRapportino();
        },
        (error: any) => {
          console.error(
            'ERRORE DURANTE IL CARICAMENTO DELL ANAGRAFICA :' +
              JSON.stringify(error)
          );
        }
      );
  }

  getRapportino() {
    this.profileBoxService
      .getRapportino(localStorage.getItem('token'), this.codiceFiscale)
      .subscribe(
        (result: any) => {
          this.rapportinoDto = result['rapportinoDto']['mese']['giorni'];
          console.log('DATA: ' + JSON.stringify(this.rapportinoDto));
        },
        (error: any) => {
          console.error(
            'ERRORE DURANTE IL CARICAMENTO DEL RAPPORTINO:' +
              JSON.stringify(error)
          );
        }
      );
  }

  inviaRapportino() {
    // Raccogli i dati modificati dalla tabella e aggiungili a modifiedData
    const tableRows =
      this.editableTable.nativeElement.getElementsByTagName('tr');
    for (let i = 1; i < tableRows.length; i++) {
      const row = tableRows[i];
      const giorno = row.cells[0].innerText;
      const cliente = row.cells[1].innerText;
      const oreOrdinarie = row.cells[2].innerText;

      // Aggiungi i dati modificati all'array modifiedData
      this.modifiedData.push({ giorno, cliente, oreOrdinarie });
    }

    // Ora puoi inviare this.modifiedData al server
    console.log('Dati modificati:', this.modifiedData);

    // Invia i dati modificati al server
    let body = {
      rapportinoDto: {
        mese: {
          giorni: this.modifiedData,
        },
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
      },
    };

    this.menuService
      .sendRapportino(localStorage.getItem('token'), body)
      .subscribe(
        (result: any) => {
          if ((result as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                Image: '../../../../assets/images/logo.jpeg',
                title: 'Invio non riuscito:',
                message: (result as any).esito.target,
              },
            });
            location.reload();
          } else {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Invio riuscito',
                message: (result as any).esito.target,
              },
            });
            this.getRapportino();
          }
        },
        (error: any) => {
          console.error(
            'Errore durante l invio del rapportino: ' + JSON.stringify(error)
          );
        }
      );
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
