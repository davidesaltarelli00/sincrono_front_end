import { AnagraficaDtoService } from './../anagraficaDto-service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ContrattoService } from '../../contratto/contratto-service';
import { AuthService } from '../../login/login-service';
import { profileBoxService } from '../../profile-box/profile-box.service';

declare var $: any;

@Component({
  selector: 'app-lista-anagrafica-dto',
  templateUrl: './lista-anagrafica-dto.component.html',
  styleUrls: ['./lista-anagrafica-dto.component.scss'],
})
export class ListaAnagraficaDtoComponent implements OnInit {
  tipoContrattoFilter = this.activatedRoute.snapshot.params['tipoContratto'];
  tipoAziendaFilter = this.activatedRoute.snapshot.params['tipoAzienda'];
  id = this.activatedRoute.snapshot.params['id'];
  lista: any[] = [];
  token: any;
  errore = false;
  messaggio: any;
  originalLista: any[] = [];
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  tipiCcnl: any = [];
  mostraFiltri = false;
  showErrorPopup: any;
  showSuccessPopup: any;
  currentDate = new Date();
  dataFineRapporto: any;
  inserimentoParziale: any;
  contrattoScaduto: any;

  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      nome: new FormControl(null),
      cognome: new FormControl(null),
      attivo: new FormControl(null),
    }),
    contratto: new FormGroup({
      ralAnnua: new FormControl(null),
      dataAssunzione: new FormControl(null),
      dataFineRapporto: new FormControl(null),
      livelloContratto: new FormGroup({
        ccnl: new FormControl(null),
      }),
      tipoCcnl: new FormGroup({
        descrizione: new FormControl(null),
      }),
      tipoContratto: new FormGroup({
        descrizione: new FormControl(null),
      }),
      tipoAzienda: new FormGroup({
        descrizione: new FormControl(null),
      }),
    }),
    commessa: new FormGroup({
      cliente: new FormControl(null),
      azienda: new FormControl(null),
      nominativo: new FormControl(null),
    }),
  });

  userlogged: string = '';
  role: any;
  anagrafica: any;
  idUtente: any;
  contrattoInScadenza: any;

  // paginazione
  currentPage: number = 1;
  itemsPerPage: number = 5; // Numero di elementi per pagina
  pageData: any[] = [];

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private location: Location,
    private contrattoService: ContrattoService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private profileBoxService: profileBoxService
  ) {
    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      console.log('Utente loggato constructor: ' + this.userlogged);
      this.userlogged = userLogged;
    }
  }
  profile() {
    this.router.navigate(['/profile-box/', this.userlogged]);
  }

  logout() {
    // this.authService.logout();
  }

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  ngOnInit(): void {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        const idUtente = response.anagraficaDto.anagrafica.utente.id;
        // console.log('ID UTENTE valorizzato : ' + idUtente);
        this.idUtente = idUtente;
        // console.log('ID UTENTE valorizzato globalmente: ' + this.idUtente);
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );

    // this.role = this.authService.getTokenAndRole();
    // console.log("Ruolo: " + this.role);

    this.mostraFiltri = false;

    this.setFilterFromOrganico(
      this.tipoContrattoFilter,
      this.tipoAziendaFilter
    );


    this.anagraficaDtoService
      .listAnagraficaDto(localStorage.getItem('token'))
      .subscribe((resp: any) => {
        this.originalLista = resp.list;
        this.lista = this.originalLista;
        console.log("Elenco record: "+JSON.stringify(this.lista));

        // Inizializza la pagina corrente e i dati della pagina
        this.currentPage = 1;
        this.pageData = this.getCurrentPageItems();

        // Itera attraverso gli elementi nell'array 'list'
        // this.originalLista.forEach((element: any) => {
        //   const dataFineRapporto = new Date(element.contratto.dataFineRapporto);
        //   const currentDate = new Date();

        //   // Controllo per verificare se il contratto è scaduto
        //   element.contrattoScaduto = dataFineRapporto <= currentDate;

        //   // Calcola la differenza tra le due date in millisecondi
        //   const timeDifference =
        //     dataFineRapporto.getTime() - currentDate.getTime();

        //   // Calcola il valore in millisecondi per 40 giorni
        //   const millisecondiIn40Giorni = 40 * 24 * 60 * 60 * 1000;

        //   // Confronta la differenza con 40 giorni e aggiungi il risultato come una nuova proprietà a ciascun elemento
        //   element.inScadenza = timeDifference <= millisecondiIn40Giorni;
        // });

        //Inserimento parziale: filtro tutta la lista

        // this.originalLista.forEach((element: any) => {
        //   const anagrafica = element.anagrafica;
        //   const contratto = element.contratto;
        //   const commesse = element.commesse;

        //   // Verifica se uno qualsiasi dei campi nell'anagrafica è vuoto
        //   if (
        //     (!this.areFieldsNotEmpty(anagrafica) &&
        //       !this.areFieldsNotEmpty(contratto)) ||
        //     !this.areFieldsNotEmpty(commesse)
        //   ) {
        //     console.log("Dati mancanti nell'anagrafica:", anagrafica);
        //     console.log('Dati mancanti nel contratto:', contratto);
        //     console.log('Dati mancanti nelle commesse:', commesse);
        //     this.inserimentoParziale = true;
        //     return;
        //   }

        // });
      },
      (error:any)=>{
        console.log("Si é verificato un errore durante il caricamento dei dait: "+ error)
      }
      );

    this.filterAnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        nome: new FormControl(null),
        cognome: new FormControl(null),
        attivo: new FormControl(null),
        tipoAzienda: new FormControl(null),
      }),
      contratto: new FormGroup({
        ralAnnua: new FormControl(null),
        dataAssunzione: new FormControl(null),
        dataFineRapporto: new FormControl(null),
        livelloContratto: new FormGroup({
          ccnl: new FormControl(null),
        }),
        tipoCcnl: new FormGroup({
          descrizione: new FormControl(null),
        }),
        tipoContratto: new FormGroup({
          descrizione: new FormControl(null),
        }),
        tipoAzienda: new FormGroup({
          descrizione: new FormControl(null),
        }),
      }),
      commessa: new FormGroup({
        cliente: new FormControl(null),
        azienda: new FormControl(null),
        nominativo: new FormControl(null),
      }),
    });
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
  }

  campiMancanti(id: any) {
    console.log(id);

    // Trova l'elemento con l'ID desiderato nella lista originale
    const elementoDaFiltrare = this.originalLista.find(
      (element: any) => element.anagrafica.id === id
    );

    if (!elementoDaFiltrare) {
      console.log('Elemento non trovato nella lista.');
      return;
    }

    const anagrafica = elementoDaFiltrare.anagrafica;
    const contratto = elementoDaFiltrare.contratto;
    const commesse = elementoDaFiltrare.commesse;

    // Verifica se uno qualsiasi dei campi nell'anagrafica è vuoto
    if (
      (!this.areFieldsNotEmpty(anagrafica) &&
        !this.areFieldsNotEmpty(contratto)) ||
      !this.areFieldsNotEmpty(commesse)
    ) {
      console.log("Dati mancanti nell'anagrafica:", anagrafica);
      console.log('Dati mancanti nel contratto:', contratto);
      console.log('Dati mancanti nelle commesse:', commesse);
      this.inserimentoParziale = true;
    }
  }

  //paginazione
  getCurrentPageItems(): any[] {
    if (!this.lista) {
      return [];
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.lista.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
      this.pageData = this.getCurrentPageItems();
    }
  }

  getTotalPages(): number {
    return Math.ceil((this.lista?.length || 0) / this.itemsPerPage);
  }

  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  //fine paginazione

  areFieldsNotEmpty(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        // Verifica se il valore è null o una stringa vuota
        if (value === null || value === '') {
          return false; // Restituisce false se trovi un campo vuoto
        }
      }
    }
    return true; // Restituisce true se tutti i campi sono non vuoti
  }

  setFilterFromOrganico(tipoContrattoFilter: any, tipoAziendaFilter: any) {
    if (tipoContrattoFilter != null && tipoAziendaFilter != null) {
      this.filterAnagraficaDto.value.contratto.tipoContratto.descrizione =
        this.tipoContrattoFilter;
      this.filterAnagraficaDto.value.contratto.tipoAzienda.descrizione =
        this.tipoAziendaFilter;
      this.filterAnagraficaDto.value.anagrafica.attivo = 1;
    }
  }
  caricaTipoContratto() {
    this.contrattoService
      .getTipoContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiContratti = (result as any)['list'];
      });
  }
  caricaLivelloContratto() {
    this.contrattoService
      .getLivelloContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.livelliContratti = (result as any)['list'];
      });
  }
  caricaTipoAzienda() {
    this.contrattoService
      .getTipoAzienda(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiAziende = (result as any)['list'];
      });
  }

  caricaContrattoNazionale() {
    this.contrattoService
      .getContrattoNazionale(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiCcnl = (result as any)['list'];
      });
  }

  vaiAModifica(idAnagrafica: number, idContratto: number, idCommessa: number) {
    console.log(idAnagrafica);
    this.router.navigate(['/modifica-anagrafica/' + idAnagrafica]);
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
    const filtroAziendaTipo =
      this.filterAnagraficaDto.value.anagrafica.aziendaTipo != null
        ? this.filterAnagraficaDto.value.anagrafica.aziendaTipo
        : '';
    const filtroAttivo =
      this.filterAnagraficaDto.value.anagrafica.attivo != null
        ? this.filterAnagraficaDto.value.anagrafica.attivo
        : false;

    const filtroNominativo =
      this.filterAnagraficaDto.value.commessa.nominativo != null
        ? this.filterAnagraficaDto.value.commessa.nominativo
        : '';
    const filtroCliente =
      this.filterAnagraficaDto.value.commessa.cliente != null
        ? this.filterAnagraficaDto.value.commessa.cliente
        : '';
    const filtroAzienda =
      this.filterAnagraficaDto.value.commessa.azienda != null
        ? this.filterAnagraficaDto.value.commessa.azienda
        : '';

    const filtroRalAnnua =
      this.filterAnagraficaDto.value.contratto.ralAnnua != null
        ? this.filterAnagraficaDto.value.contratto.ralAnnua
        : '';
    const filtroDataAssunzione =
      this.filterAnagraficaDto.value.contratto.dataAssunzione != null
        ? this.filterAnagraficaDto.value.contratto.dataAssunzione
        : '';
    const filtroDataFineRapporto =
      this.filterAnagraficaDto.value.contratto.dataFineRapporto != null
        ? this.filterAnagraficaDto.value.contratto.dataFineRapporto
        : '';
    const filtroDescrizioneTipoContratto =
      this.filterAnagraficaDto.value.contratto.tipoContratto.descrizione != null
        ? this.filterAnagraficaDto.value.contratto.tipoContratto.descrizione
        : '';
    const filtroDescrizioneContrattoNazionale =
      this.filterAnagraficaDto.value.contratto.tipoCcnl.descrizione != null
        ? this.filterAnagraficaDto.value.contratto.tipoCcnl.descrizione
        : '';
    const filtroDescrizioneTipoAzienda =
      this.filterAnagraficaDto.value.contratto.tipoAzienda.descrizione != null
        ? this.filterAnagraficaDto.value.contratto.tipoAzienda.descrizione
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
        !element?.anagrafica.aziendaTipo ||
        element?.anagrafica.aziendaTipo == ''
      ) {
        aziendaTipo = 'undefined';
      } else {
        aziendaTipo = element?.anagrafica.aziendaTipo;
      }

      var attivo;

      if (!element?.anagrafica.attivo || element?.anagrafica.attivo == '') {
        attivo = 'undefined';
      } else {
        attivo = element?.anagrafica.attivo;
      }

      /*const nominativo = (
        element?.commessa.nominativo ?? 'undefined'
      ).toLowerCase();
      const cliente = (element?.commessa.cliente ?? 'undefined').toLowerCase();
      const azienda = (element?.commessa.azienda ?? 'undefined').toLowerCase();*/

      var commesse = [];

      if (!element?.commesse != null || element?.commesse.lenght > 0) {
        commesse = element?.commesse;
      }

      var ralAnnua;
      if (!element?.contratto.ralAnnua || element?.contratto.ralAnnua == '') {
        ralAnnua = 'undefined';
      } else {
        var ralAnnua = element?.contratto.ralAnnua;
      }

      const dataAssunzione = element?.contratto.dataAssunzione ?? 'undefined';
      const dataFineRapporto =
        element?.contratto.dataFineRapporto ?? 'undefined';

      var descrizioneTipoContratto = 'undefined';
      if (element?.contratto.tipoContratto != null) {
        descrizioneTipoContratto = (
          element?.contratto.tipoContratto.descrizione ?? 'undefined'
        ).toLowerCase();
      }
      var descrizioneContrattoNazionale = 'undefined';
      if (element?.contratto.tipoCcnl != null) {
        descrizioneContrattoNazionale = (
          element?.contratto.tipoCcnl.descrizione ?? 'undefined'
        ).toLowerCase();
      }
      var descrizioneTipoAzienda = 'undefined';
      if (element?.contratto.tipoAzienda != null) {
        descrizioneTipoAzienda = (
          element?.contratto.tipoAzienda.descrizione ?? 'undefined'
        ).toLowerCase();
      }

      console.log(
        filtroNome,
        filtroCognome,
        filtroDescrizioneTipoContratto,
        filtroDescrizioneContrattoNazionale,
        filtroDescrizioneTipoAzienda
      );

      return (
        nome == filtroNome ||
        cognome == filtroCognome ||
        aziendaTipo == filtroAziendaTipo ||
        attivo == filtroAttivo ||
        ralAnnua == filtroRalAnnua ||
        new Date(dataAssunzione).getTime() ==
          new Date(filtroDataAssunzione).getTime() ||
        new Date(dataFineRapporto).getTime() ==
          new Date(filtroDataFineRapporto).getTime() ||
        descrizioneTipoContratto == filtroDescrizioneTipoContratto ||
        descrizioneContrattoNazionale == filtroDescrizioneContrattoNazionale ||
        descrizioneTipoAzienda == filtroDescrizioneTipoAzienda ||
        this.checkCommesse(
          filtroCliente,
          filtroAzienda,
          filtroNominativo,
          commesse
        )
      );
    });
  }

  checkCommesse(
    filtroCliente: any,
    filtroAzienda: any,
    filtroNominativo: any,
    commesse: any
  ) {
    var check = false;

    if (commesse.length == 0) {
      return check;
    } else {
      for (const element of commesse) {
        if (
          element.cliente == filtroCliente ||
          element.azienda == filtroAzienda ||
          element.nominativo == filtroNominativo
        ) {
          check = true;
        }
      }
    }

    return check;
  }

  annullaFiltri() {
    this.anagraficaDtoService
      .listAnagraficaDto(localStorage.getItem('token'))
      .subscribe((resp: any) => {
        this.lista = resp.list;
        location.reload();
      });
  }

  reset() {
    this.filterAnagraficaDto.reset();
  }

  elimina(idAnagrafica: number) {
    const confirmation = confirm(
      'Sei sicuro di voler eliminare questo utente?'
    );
    if (confirmation) {
      console.log(idAnagrafica);
      //mi prendo il dettaglio dell anagrafica della riga selezionata
      this.anagraficaDtoService
        .detailAnagraficaDto(idAnagrafica, localStorage.getItem('token'))
        .subscribe(
          (resp: any) => {
            //parseing json
            // resp = (resp as any)['anagraficaDto'];
            console.log(resp);
            //se é ok parte l elimina
            this.anagraficaDtoService
              .delete(resp, localStorage.getItem('token'))
              .subscribe(
                (deleted: any) => {
                  console.log('eliminato con successo ' + deleted);
                  // location.reload();
                  this.ngOnInit();
                },
                (errorDeleted: any) => {
                  console.log("Errore durante l'eliminazione: " + errorDeleted);
                }
              );
          },
          (error: any) => {
            console.log(error);
          }
        );
    } else {
      return;
    }
  }

  delete(
    idUtente: number,
    idAnagrafica: number,
    idContratto: number,
    idCommessa: number
  ) {
    console.log('value:' + this.filterAnagraficaDto.value);
    console.log(
      'idAnagrafica: ' + this.filterAnagraficaDto.value.anagrafica.id
    );
    console.log(
      'idUtente: ' + this.filterAnagraficaDto.value.anagrafica.utente.id
    );
    console.log('idCommessa: ' + this.filterAnagraficaDto.value.commessa.id);
    console.log('idContratto: ' + this.filterAnagraficaDto.value.contratto.id);

    this.filterAnagraficaDto.value.anagrafica.id = idAnagrafica;
    this.filterAnagraficaDto.value.anagrafica.utente.id = idUtente;
    this.filterAnagraficaDto.value.contratto.id = idContratto;
    this.filterAnagraficaDto.value.commessa.id = idCommessa;
    const body = JSON.stringify({
      anagraficaDto: this.filterAnagraficaDto.value,
    });
    this.anagraficaDtoService
      .delete(body, localStorage.getItem('token'))
      .subscribe((result: any) => {
        if ((result as any).esito.code != 0) {
          alert('cancellazione non riuscita');
          this.errore = true;
          this.messaggio = (result as any).esito.target;
          return;
        } else {
          alert('cancellazione riuscita');
          this.reloadPage();
        }
      });
  }

  chiudiPopup() {
    this.showErrorPopup = false;
    this.showSuccessPopup = false;
    this.reloadPage();
  }

  showAlert(message: string): void {
    const alertElement = document.createElement('div');
    alertElement.className = 'alert';
    alertElement.textContent = message;
    document.body.appendChild(alertElement);
    setTimeout(() => {
      alertElement.remove();
    }, 3000); // Rimuovi l'alert dopo 3 secondi (puoi modificare il valore in base alle tue esigenze)
  }
}
