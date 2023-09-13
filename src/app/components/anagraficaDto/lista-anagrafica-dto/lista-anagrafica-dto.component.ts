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
      attesaLavori: new FormControl(null),
      tipoAzienda: new FormGroup({
        descrizione: new FormControl(null),
      }),
    }),
    contratto: new FormGroup({
      ralAnnua: new FormControl(null),
      dataAssunzione: new FormControl(null),
      dataFineRapporto: new FormControl(null),
      tipoLivelloContratto: new FormGroup({
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
      tipoCanaleReclutamento: new FormGroup({
        descrizione: new FormControl(null),
      }),
      tipoCausaFineRapporto: new FormGroup({
        descrizione: new FormControl(null),
      }),
    }),
    commessa: new FormGroup({
      aziendaCliente: new FormControl(null),
    }),
  });

  userlogged: string = '';
  role: any;
  anagrafica: any;
  idUtente: any;
  contrattoInScadenza: any;

  // paginazione
  currentPage: number = 1;
  itemsPerPage: number = 20; // Numero di elementi per pagina
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
    this.filterAnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        nome: new FormControl(null),
        cognome: new FormControl(null),
        attivo: new FormControl(null),
        attesaLavori: new FormControl(null),
        tipoAzienda: new FormGroup({
          descrizione: new FormControl(null),
        }),
      }),
      contratto: new FormGroup({
        ralAnnua: new FormControl(null),
        dataAssunzione: new FormControl(null),
        dataFineRapporto: new FormControl(null),
        tipoLivelloContratto: new FormGroup({
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
        tipoCanaleReclutamento: new FormGroup({
          descrizione: new FormControl(null),
        }),
        tipoCausaFineRapporto: new FormGroup({
          descrizione: new FormControl(null),
        }),
      }),
      commessa: new FormGroup({
        aziendaCliente: new FormControl(null),
      }),
    });
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
        const utenteLoggato = response.anagraficaDto.anagrafica.id;
        // console.log('ID UTENTE valorizzato : ' + idUtente);
        this.idUtente = utenteLoggato;
        // console.log('ID UTENTE valorizzato globalmente: ' + this.idUtente);
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
    this.mostraFiltri = false;

    this.setFilterFromOrganico(
      this.tipoContrattoFilter,
      this.tipoAziendaFilter
    );

    this.anagraficaDtoService
      .listAnagraficaDto(localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.originalLista = resp.list;
          this.lista = this.originalLista;
          console.log('Elenco record: ' + JSON.stringify(this.lista));

          // Inizializza la pagina corrente e i dati della pagina
          this.currentPage = 1;
          this.pageData = this.getCurrentPageItems();

          this.verificaCampiVuoti();
        },
        (error: any) => {
          console.log(
            'Si é verificato un errore durante il caricamento dei dati: ' +
              error
          );
        }
      );

    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
  }

  // Metodo per verificare campi vuoti
  verificaCampiVuoti() {
    for (const record of this.originalLista) {
      // Verifica se ci sono campi vuoti in questo record
      for (const key in record) {
        if (record.hasOwnProperty(key)) {
          const value = record[key];
          if (value === null || value === undefined || value === '') {
            // Hai un campo vuoto in questo record
            console.log(
              `Campo vuoto trovato in record con ID ${record.anagrafica.id}` +
                `: ${value}`
            );
          }
        }
      }
    }
  }

  isCampoVuoto(record: any): boolean {
    for (const key in record) {
      if (record.hasOwnProperty(key)) {
        const value = record[key];
        if (value === null || value === undefined || value === '') {
          return true; // Ci sono campi vuoti in questo record
        }
      }
    }
    return false; // Nessun campo vuoto trovato
  }

  elimina(idAnagrafica: number) {
    const confirmation = confirm(
      'Sei sicuro di voler disattivare questo utente?'
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
                (response: any) => {
                  if ((response as any).esito.code != 200) {
                    alert(
                      'Disattivazione non riuscita:\n' +
                        (response as any).esito.target
                    );
                  } else {
                    alert('Utente disattivato correttamente. ');
                    this.ngOnInit();
                  }
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

  riattivaAnagrafica(id: any) {
    const confirmation = confirm(
      'Sei sicuro di voler riattivare questo utente?'
    );
    if (confirmation) {
      this.anagraficaDtoService
        .detailAnagraficaDto(id, localStorage.getItem('token'))
        .subscribe(
          (resp: any) => {
            console.log('UTENTE DA RIATTIVARE: ' + JSON.stringify(resp));
            //se é ok parte la riattivazione
            this.anagraficaDtoService
              .riattivaUtente(resp, localStorage.getItem('token'))
              .subscribe(
                (response: any) => {
                  if ((response as any).esito.code != 200) {
                    alert(
                      'Riattivazione non riuscita:\n' +
                        (response as any).esito.target
                    );
                  } else {
                    alert('Utente riattivato correttamente.');
                    this.ngOnInit();
                  }
                },
                (errorDeleted: any) => {
                  console.log(
                    'Errore durante la riattivazione: ' + errorDeleted
                  );
                }
              );
          },
          (error: any) => {
            console.log(error);
          }
        );
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

  //controllo campi nulli

  //campi vuoti
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

  filter() {}
}
