import { Component } from '@angular/core';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrencyPipe, Location } from '@angular/common';
import { AuthService } from '../../login/login-service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dettaglio-anagrafica-dto',
  templateUrl: './dettaglio-anagrafica-dto.component.html',
  styleUrls: ['./dettaglio-anagrafica-dto.component.scss'],
})
export class DettaglioAnagraficaDtoComponent {
  id: any = this.activatedRoute.snapshot.params['id'];
  data: any;
  date: any;
  errore = false;
  messaggio: any;
  role: any;
  elencoCommesse = [];
  commesseGroupedByIndex: any[] = [];
  mobile=false;


  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      nome: new FormControl(''),
      cognome: new FormControl(''),
      attivo: new FormControl(''),
      aziendaTipo: new FormControl(''),
    }),
    contratto: new FormGroup({
      ralAnnua: new FormControl(''),
      dataAssunzione: new FormControl(''),
      dataFineRapporto: new FormControl(''),
      livelloContratto: new FormGroup({
        ccnl: new FormControl(''),
      }),
      tipoCcnl: new FormGroup({
        descrizione: new FormControl(''),
      }),
      tipoContratto: new FormGroup({
        descrizione: new FormControl(''),
      }),
      tipoAzienda: new FormGroup({
        descrizione: new FormControl(''),
      }),
    }),
    commessa: new FormGroup({
      cliente: new FormControl(''),
      azienda: new FormControl(''),
      nominativo: new FormControl(''),
    }),
  });
  userlogged: any;
  // paginazione
  currentPage: number = 1;
  itemsPerPage: number = 3; // Numero di elementi per pagina

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
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
  }

  ngOnInit(): void {
    console.log(this.id);
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.data = (resp as any)['anagraficaDto'];
        console.log(this.data);
        this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
        console.log(this.elencoCommesse);

      });
    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
    }

    this.uppercaseCodiceFiscale();

  }



  copy(data: any) {
    this.clipboard.copy(data);
    this.snackBar.open('Dato ' + data + ' copiata negli appunti', '', {
      duration: 3000,
    });

  }

  storicizzaCommessa(id: number, posizione: number) {
    console.log('ID COMMESSA DA STORICIZZARE: ' + id);
    console.log("Posizione nell'array: " + posizione);

    // const payload = {
    //   anagraficaDto: {
    //     anagrafica: null,
    //     contratto: null,
    //     commesse: [this.elencoCommesse[posizione]],
    //     ruolo: null
    //   },
    // };
    const payload = {
      commessa: this.elencoCommesse[posizione],
    };

    console.log(JSON.stringify(payload));

    this.anagraficaDtoService
      .storicizzaCommessa(payload, localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          console.log(
            'Commessa storicizzata correttamente: ' + JSON.stringify(res)
          );
          alert("Commessa storicizzata correttamente.");
          this.ngOnInit();
        },
        (error: any) => {
          alert(
            'Si è verificato un errore durante la storicizzazione della commessa selezionata: ' +
              error
          );
        }
      );
  }



  modificaCommessa(){
    this.router.navigate(['/modifica-anagrafica/'+this.id]);
  }

  modificaAnagrafica() {
    this.router.navigate(['/modifica-anagrafica/' + this.id]);
  }

  modificaContratto() {
    this.router.navigate(['/modifica-anagrafica/' + this.id]);
  }

  logout() {
    // this.authService.logout();
  }
  profile() {
    this.router.navigate(['/profile-box/', this.userlogged]);
  }

  delete(idAnagrafica: number, idContratto: number, idCommessa: number) {
    this.filterAnagraficaDto.value.anagrafica.id = idAnagrafica;
    this.filterAnagraficaDto.value.contratto.id = idContratto;
    this.filterAnagraficaDto.value.commessa.id = idCommessa;
    const body = JSON.stringify({
      anagraficaDto: this.filterAnagraficaDto.value,
    });
    this.anagraficaDtoService.delete(body, localStorage.getItem('token')).subscribe((result: any) => {
      if ((result as any).esito.code != 0) {
        alert('cancellazione non riuscita\n' + 'target: ' + (result as any).esito.target);
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      } else {
        alert('cancellazione riuscita');
        this.router.navigate(['/lista-anagrafica']);
      }
    });
  }
  // transformDate(dateString: string): string {
  //   const dateObject = new Date(dateString);
  //   return dateObject.toLocaleDateString('en-US', {
  //     day: '2-digit',
  //     month: 'numeric',
  //     year: 'numeric',
  //   });
  // }

  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  getStoricoContratti(idAnagrafica: any) {
    this.router.navigate(['/storico-contratti', idAnagrafica]);
  }
  getStoricoCommessa(idAnagrafica: any) {
    this.router.navigate(['/storico-commesse-anagrafica', idAnagrafica]);
  }

  uppercaseCodiceFiscale(): string {
    if (this.data?.anagrafica?.codiceFiscale) {
      return this.data.anagrafica.codiceFiscale.toUpperCase();
    } else {
      return 'Dato non inserito';
    }
  }

  rimuoviCommessa(index: number): void {
    const conferma =
      'Sei sicuro di voler eliminare la commessa con indice ' + index + '?';
    if (confirm(conferma)) {
      const body = JSON.stringify({
        commessa: this.elencoCommesse[index],
      });
      console.log(body);
      this.anagraficaDtoService
        .deleteCommessa(body, localStorage.getItem('token'))
        .subscribe(
          (res: any) => {
            console.log(
              'Commessa con indice ' +
              index +
              ' eliminata correttamente. Risposta:',
              res
            );
            // Rimuovi l'elemento dall'array locale
            this.elencoCommesse.splice(index, 1);
            // this.caricaDati();
          },
          (error: any) => {
            console.log(
              "Errore durante l'eliminazione della commessa con indice " +
              index +
              ': ' +
              error
            );
          }
        );
    }
  }




  //paginazione
  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.elencoCommesse.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.elencoCommesse.length / this.itemsPerPage);
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

  exportListaAnagraficaToExcel() {


    const workSheetData = [
      // Intestazioni delle colonne
      ["Dati Anagrafici"],
      ["Nome", "Cognome", "Codice fiscale", "Data di nascita", "Comune nascita", "Coniugato", "Figli a carico"],

    ];
    const workSheetData1 = [
      ["Contatti"],
      ["Mail privata", "Mail aziendale", "Mail Pec", "Cellulare privato", "Cellulare aziendale"]
    ];
    const workSheetData2 = [
      ["Dati azienda"],
      ["Nome azienda", "Ruolo", "Sede assunzione", "Qualifica", "PC"]
    ];
    const workSheetData3 = [
      ["Altri Dati"],
      ["Canale reclutamento", "Categoria protetta", "Assicurazione obbligatoria",]
    ];
    const workSheetData4 = [
      ["Dati contrattuali"],
      ["Tipologiche Contrattuali"],
      ["Tipo azienda", "Tipo CCNL", "Tipo contratto"],
    ];
    const workSheetData5 = [
      ["Date contratto"],
      ["Data Assunzione", "Data inizio prova", "Data fine prova", "Data fine rapporto", "Mesi durata"],
    ];
    const workSheetData6 = [
      ["Dati economici"],
      ["Retribuzione mensile lorda", "Superminimo mensile", "Ral annuale", "Superminimo RAL", "Diaria annua", "Diaria mese", "Diaria giorno", "Ticket", "Valore ticket"]
    ];
    const workSheetData7 = [
      ["Retribuzione netta"],
      ["Retribuzione netta mensile", "Retribuzione netta giornaliera"]
    ];
    const workSheetData8 = [
      ["Dati medici"],
      ["Visita medica", "Data visita medica"]
    ];
    const workSheetData9 = [
      ["Commesse"],
      ["Cliente", "Cliente Finale", "Titolo Posizione", "Distacco", "Data Inizio", "Data Fine", "Tariffa Giornaliera", "Azienda di Fatturazione Interna", "Stato", "Attesa Lavori"]
    ];



    workSheetData.push([
      this.data.anagrafica.nome ? this.data.anagrafica.nome.toString() : '',
      this.data.anagrafica.cognome ? this.data.anagrafica.cognome.toString() : '',
      this.data.anagrafica.codiceFiscale ? this.data.anagrafica.codiceFiscale.toString() : '',
      this.datePipe.transform(
        this.data.anagrafica.dataDiNascita ? this.data.anagrafica.dataDiNascita.toString() : '',
      ),
      this.data.anagrafica.comuneDiNascita ? this.data.anagrafica.comuneDiNascita.toString() : '',
      this.data.anagrafica.coniugato ? 'si' : 'No',
      this.data.anagrafica.figliACarico ? 'si' : 'No',
    ]);
    workSheetData1.push([
      this.data.anagrafica.mailPrivata ? this.data.anagrafica.mailPrivata.toString() : '',
      this.data.anagrafica.mailAziendale ? this.data.anagrafica.mailAziendale.toString() : '',
      this.data.anagrafica.mailPec ? this.data.anagrafica.mailPec.toString() : '',
      this.data.anagrafica.cellulareAziendale ? this.data.anagrafica.cellulareAziendale.toString() : ''
    ]);
    workSheetData2.push([
      this.data.anagrafica.tipoAzienda.descrizione ? this.data.anagrafica.tipoAzienda.descrizione.toString() : '',
      this.data.ruolo.nome ? this.data.ruolo.nome.toString() : '',
      this.data.anagrafica.sedeAssunzione ? this.data.anagrafica.sedeAssunzione.toString() : '',
      this.data.anagrafica.qualifica ? this.data.anagrafica.qualifica.toString() : '',
      this.data.anagrafica.pc ? this.data.anagrafica.pc.toString() : ''
    ]);
    workSheetData3.push([
      this.data.contratto.tipoCanaleReclutamento.descrizione ? this.data.contratto.tipoCanaleReclutamento.descrizione.toString() : '',
      this.data.contratto.categoriaProtetta ? this.data.contratto.categoriaProtetta.toString() : '',
      this.data.contratto.assicurazioneObbligatoria ? this.data.contratto.assicurazioneObbligatoria.toString() : ''
    ]);
    workSheetData4.push([
      this.data.contratto.tipoAzienda.descrizione ? this.data.contratto.tipoAzienda.descrizione.toString() : '',
      this.data.contratto.tipoCcnl.descrizione ? this.data.contratto.tipoCcnl.descrizione.toString() : '',
      this.data.contratto.tipoContratto.descrizione ? this.data.contratto.tipoContratto.descrizione.toString() : ''
    ]);
    workSheetData5.push([
      this.datePipe.transform(
        this.data.contratto.dataAssunzione ? this.data.contratto.dataAssunzione.toString() : '',
      ),
      this.datePipe.transform(
        this.data.contratto.dataInizioProva ? this.data.contratto.dataInizioProva.toString() : '',
      ),
      this.datePipe.transform(
        this.data.contratto.dataFineProva ? this.data.contratto.dataFineProva.toString() : '',
      ),
      this.datePipe.transform(
        this.data.contratto.dataFineRapporto ? this.data.contratto.dataFineRapporto.toString() : '',
      ),
      this.data.contratto.mesiDurata ? this.data.contratto.mesiDurata.toString() : ''
    ]);
    workSheetData6.push([
      this.data.contratto.retribuzioneMensileLorda ? this.data.contratto.retribuzioneMensileLorda.toString() : '',
      this.data.contratto.superminimoMensile ? this.data.contratto.superminimoMensile.toString() : '',
      this.data.contratto.ralAnnua ? this.data.contratto.ralAnnua.toString() : '',
      this.data.contratto.superminimoRal ? this.data.contratto.superminimoRal.toString() : '',
      this.data.contratto.diariaAnnua ? this.data.contratto.dataAssunzione.toString() : '',
      this.data.contratto.diariaMese ? this.data.contratto.diariaMese.toString() : '',
      this.data.contratto.diariaGiorno ? this.data.contratto.diariaGiorno.toString() : '',
      this.data.contratto.ticket ? this.data.contratto.ticket.toString() : '',
      this.data.contratto.valoreTicket ? this.data.contratto.valoreTicket.toString() : ''
    ]);
    workSheetData7.push([
      this.data.contratto.retribuzioneNettaMensile ? this.data.contratto.retribuzioneNettaMensile.toString() : '',
      this.data.contratto.retribuzioneNettaGiornaliera ? this.data.contratto.retribuzioneNettaGiornaliera.toString() : ''
    ]);
    workSheetData8.push([
      this.data.contratto.visitaMedica ? this.data.contratto.visitaMedica.toString() : '',

      this.datePipe.transform(this.data.contratto.dataVisitaMedica ? this.data.contratto.dataVisitaMedica.toString() : '')
    ]);

    this.data.commesse.forEach((commessa: any) => {
      workSheetData9.push([
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
    })



    // Combina tutte le matrici workSheetData in una sola matrice
    const combinedData = workSheetData
      .concat(workSheetData1)
      .concat(workSheetData2)
      .concat(workSheetData3)
      .concat(workSheetData4)
      .concat(workSheetData5)
      .concat(workSheetData6)
      .concat(workSheetData7)
      .concat(workSheetData8)
      .concat(workSheetData9);

    // Crea un foglio di lavoro Excel utilizzando la matrice combinata
    const workSheet = XLSX.utils.aoa_to_sheet(combinedData);

    // Crea un nuovo libro Excel
    const workBook = XLSX.utils.book_new();

    // Aggiungi il foglio di lavoro al libro Excel
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Anagrafica');

    // Esporta il libro Excel in un file
    XLSX.writeFile(workBook, 'Anagrafica.xlsx');
  }
  //fine paginazione

}
