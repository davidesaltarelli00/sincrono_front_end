import { AnagraficaDtoService } from './../anagraficaDto-service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ContrattoService } from '../../contratto/contratto-service';
import { AuthService } from '../../login/login-service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoCommesseComponent } from '../../modal-info-commesse/modal-info-commesse.component';
import { ModalInfoContrattoComponent } from '../../modal-info-contratto/modal-info-contratto.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MenuService } from '../../menu.service';
import { ImageService } from '../../image.service';
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
  ruolo: any;
  toggleMode: boolean = false;

  aziendeClienti: any[] = [];

  //immagine
  immagineConvertita: string | null = null;
  immaginePredefinita: string | null = null;
  idAnagraficaLoggata: any;
  disabilitaImmagine: any;
  salvaImmagine: boolean = false;
  immagineCancellata: boolean = false;
  codiceFiscaleDettaglio: any;
  immagine: any;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  //navbar
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;

  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      nome: new FormControl(null),
      cognome: new FormControl(null),
      attivo: new FormControl(true),
      attesaLavori: new FormControl(null),
      tipoAzienda: new FormGroup({
        id: new FormControl(null),
        descrizione: new FormControl(null),
      }),
    }),

    contratto: new FormGroup({
      ralAnnua: new FormControl(null),
      meseAssunzione: new FormControl(null),
      annoAssunzione: new FormControl(null),
      meseFineRapporto: new FormControl(null),
      annoFineRapporto: new FormControl(null),

      tipoLivelloContratto: new FormGroup({
        id: new FormControl(null),
      }),
      tipoCcnl: new FormGroup({
        id: new FormControl(null),
      }),
      tipoContratto: new FormGroup({
        id: new FormControl(null),
      }),
      tipoAzienda: new FormGroup({
        id: new FormControl(null),
      }),
      tipoCanaleReclutamento: new FormGroup({
        id: new FormControl(null),
      }),
      tipoCausaFineRapporto: new FormGroup({
        id: new FormControl(null),
      }),
    }),
    commessa: new FormGroup({
      tipoAziendaCliente: new FormGroup({
        id: new FormControl(''),
        descrizione: new FormControl(''),
      }),
    }),
  });

  mobile: any = false;
  userlogged: string = '';
  role: any;
  anagraficaLoggata: any;
  idUtente: any;
  contrattoInScadenza: any;
  contrattiNazionali: any = [];
  tipologicaCanaliReclutamento: any[] = [];
  motivazioniFineRapporto: any[] = [];
  commesse!: FormArray;

  // paginazione
  currentPage: number = 1;
  itemsPerPage: number = 20; // Numero di elementi per pagina
  pageData: any[] = [];

  risultatiFilter: any[] = [];
  inseritoContrattoIndeterminato = true;
  elencoCommesse: any;
  descrizioneLivelloCCNL: any;
  elencoLivelliCCNL: any[] = [];
  ccnLSelezionato: any;
  numeroMensilitaCCNL: any;
  idCCNLselezionato: any;
  contratto: any;

  // Dichiarazione dell'array dei mesi
  mesi: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  anni: number[] = [];

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private location: Location,
    private contrattoService: ContrattoService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private menuService: MenuService,
    private http: HttpClient,
    private imageService: ImageService
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

    this.filterAnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        nome: new FormControl(null),
        cognome: new FormControl(null),
        attivo: new FormControl(true),
        attesaLavori: new FormControl(null),
        tipoAzienda: new FormGroup({
          id: new FormControl(null),
          descrizione: new FormControl(null),
        }),
      }),
      contratto: new FormGroup({
        ralAnnua: new FormControl(null),
        meseAssunzione: new FormControl(null),
        annoAssunzione: new FormControl(null),
        meseFineRapporto: new FormControl(null),
        annoFineRapporto: new FormControl(null),
        tipoLivelloContratto: new FormGroup({
          id: new FormControl(),
          livello: new FormControl(null),
        }),
        tipoCcnl: new FormGroup({
          id: new FormControl(),
          descrizione: new FormControl(null),
        }),
        tipoContratto: new FormGroup({
          id: new FormControl(),
          descrizione: new FormControl(null),
        }),
        tipoAzienda: new FormGroup({
          id: new FormControl(),
          descrizione: new FormControl(null),
        }),
        tipoCanaleReclutamento: new FormGroup({
          id: new FormControl(),
          descrizione: new FormControl(null),
        }),
        tipoCausaFineRapporto: new FormGroup({
          id: new FormControl(),
        }),
      }),
      commesse: this.formBuilder.array([]),
    });

    this.commesse = this.filterAnagraficaDto.get('commesse') as FormArray;


    this.popolaAnni();
  }

  getOpzioniMesi(): number[] {
    return this.mesi;
  }

  // Metodo per popolare l'array degli anni dal 2010 all'anno corrente
  popolaAnni(): void {
    const annoCorrente = new Date().getFullYear();

    for (let anno = 2010; anno <= annoCorrente; anno++) {
      this.anni.push(anno);
    }
  }

  goDown() {
    document.getElementById('finePagina')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  goTop() {
    document.getElementById('inizioPagina')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  profile() {
    this.router.navigate(['/profile-box/', this.userlogged]);
  }

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  onTipoContrattoChange(event: Event) {
    const selectedTipoContratto = (event.target as HTMLSelectElement).value;
    const dataFineRapportoControl = this.filterAnagraficaDto.get(
      'contratto.dataFineRapporto'
    );

    if (dataFineRapportoControl) {
      if (selectedTipoContratto === 'Indeterminato') {
        console.log('Selezionato contratto: ' + selectedTipoContratto);
        this.inseritoContrattoIndeterminato = false;
        dataFineRapportoControl.disable();
      } else {
        console.log('Selezionato contratto: ' + selectedTipoContratto);
        dataFineRapportoControl.enable();
        this.inseritoContrattoIndeterminato = true;
      }
    }
  }

  caricaAziendeClienti() {
    this.contrattoService.getAllAziendaCliente(this.token).subscribe(
      (result: any) => {
        console.log('NOMI AZIENDE CARICATI:' + JSON.stringify(result));
        this.aziendeClienti = (result as any)['list'];
      },
      (error: any) => {
        console.error(
          'errore durante il caricamento dei nomi azienda:' + error
        );
      }
    );
  }

  onChangeAttivo(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  isGreenBackground(anagraficaId: number): boolean {
    return this.anagraficaLoggata === anagraficaId;
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.caricaAziendeClienti();
    } else {
      console.error('errore di autenticazione.');
    }

    const commessaFormGroup = this.creaFormCommessa();
    this.commesse.push(commessaFormGroup);

    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagraficaLoggata = response.anagraficaDto.anagrafica.id;
        console.log(
          'ID UTENTE LOGGATO: ' + JSON.stringify(this.anagraficaLoggata)
        );
        this.ruolo = response.anagraficaDto.ruolo.descrizione;
        console.log('RUOLO UTENTE LOGGATO:' + this.ruolo);
        this.isGreenBackground(this.anagraficaLoggata);
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
    this.mostraFiltri = false;

    // this.setFilterFromOrganico(
    //   this.tipoContrattoFilter,
    //   this.tipoAziendaFilter
    // );

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
    this.caricaTipoCanaleReclutamento();
    this.caricaTipoCausaFineRapporto();
    const livelloContrattoControl = this.filterAnagraficaDto.get(
      'contratto.tipoLivelloContratto.id'
    );
    if (livelloContrattoControl) {
      livelloContrattoControl.disable();
    }
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

  creaFormCommessa(): FormGroup {
    return this.formBuilder.group({
      tipoAziendaCliente: new FormGroup({
        id: new FormControl(''),
        descrizione: new FormControl(''),
      }),
    });
  }

  caricaTipoCausaFineRapporto() {
    this.anagraficaDtoService
      .caricaTipoCausaFineRapporto(localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          this.motivazioniFineRapporto = (res as any)['list'];
          console.log('Elenco motivazioni fine rapporto:', JSON.stringify(res));
        },
        (error: any) => {
          console.log(
            'Errore durante il caricamento della tipologica Motivazione fine rapporto:',
            JSON.stringify(error)
          );
        }
      );
  }

  caricaTipoCanaleReclutamento() {
    this.anagraficaDtoService
      .caricaTipoCanaleReclutamento(localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          this.tipologicaCanaliReclutamento = (res as any)['list'];
          console.log('ElencoCanali reclutamento:' + JSON.stringify(res));
        },
        (error: any) => {
          console.log(
            'Errore durante il caricamento della tipologica Motivazione fine rapporto: ' +
              JSON.stringify(error)
          );
        }
      );
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

  onChangeAziendaCliente(event: any) {
    const selectedValue = parseInt(event.target.value, 10);

    if (!isNaN(selectedValue)) {
      const selectedObject = this.tipiAziende.find(
        (azienda: any) => azienda.id === selectedValue
      );

      if (selectedObject) {
        console.log('Azienda cliente selezionata: ', selectedObject);
      } else {
        console.log('Azienda non trovata nella lista');
      }
    } else {
      console.log('Valore non valido o azienda non selezionata');
    }
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
            console.log(
              'Dettaglio prima dell eliminazione: ' + JSON.stringify(resp)
            );
            let body = {
              anagraficaDto: resp.anagraficaDto,
            };
            console.log(
              "PAYLOAD BACKEND PER L'ELIMINAZIONE: " + JSON.stringify(body)
            );
            //se é ok parte l elimina
            this.anagraficaDtoService
              .delete(body, localStorage.getItem('token'))
              .subscribe(
                (response: any) => {
                  if ((response as any).esito.code != 200) {
                    const dialogRef = this.dialog.open(AlertDialogComponent, {
                      data: {
                        image:'../../../../assets/images/danger.png',
                        title: 'Disattivazione non riuscita:',
                        message: (response as any).esito.target,
                      },
                    });
                  } else {
                    const dialogRef = this.dialog.open(AlertDialogComponent, {
                      data: {
                        image:'../../../../assets/images/logo.jpeg',
                        title: 'Disattivazione riuscita correttamente:',
                        message: (response as any).esito.target,
                      },
                    });
                    this.ngOnInit();
                  }
                },
                (errorDeleted: any) => {
                  const dialogRef = this.dialog.open(AlertDialogComponent, {
                    data: {
                      image:'../../../../assets/images/danger.png',
                      title: 'Errore durante l eliminazione:',
                      message: JSON.stringify(errorDeleted),
                    },
                  });
                }
              );
          },
          (error: any) => {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                image:'../../../../assets/images/danger.png',
                title: 'Qualcosa é andato storto:',
                message: JSON.stringify(error),
              },
            });
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

    const payload = {
      anagraficaDto: {
        contratto: {
          tipoContratto: {
            descrizione: this.tipoContrattoFilter,
          },
          tipoAzienda: {
            descrizione: this.tipoAziendaFilter,
          },
        },
      },
    };

    console.log('PAYLOAD BACKEND FILTER ORGANICO: ' + JSON.stringify(payload));
    this.anagraficaDtoService
      .filterAnagrafica(localStorage.getItem('token'), payload)
      .subscribe(
        (result) => {
          if ((result as any).esito.code != 200) {
            alert(
              'Qualcosa é andato storto\n' + ': ' + (result as any).esito.target
            );
          } else {
            if (Array.isArray(result.list)) {
              this.pageData = result.list;
            } else {
              this.pageData = [];
              this.messaggio =
                'Nessun risultato trovato per i filtri inseriti, riprova.';
            }
            console.log(
              'Trovati i seguenti risultati: ' + JSON.stringify(result)
            );
          }
        },
        (error: any) => {
          console.log(
            'Si é verificato un errore durante il passaggio dei dati da organico: ' +
              error
          );
        }
      );
  }

  caricaTipoContratto() {
    this.contrattoService
      .getTipoContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiContratti = (result as any)['list'];
      });
  }
  caricaLivelloContratto() {
    // this.contrattoService
    //   .getLivelloContratto(localStorage.getItem('token'))
    //   .subscribe((result: any) => {
    //     this.livelliContratti = (result as any)['list'];
    //   });
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
    location.reload();
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

  filter(value: any) {
    console.log('Valore del form: ' + JSON.stringify(value));
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
          // Rimuovi l'array se è un array vuoto o un oggetto vuoto
          if (Array.isArray(obj[key]) && obj[key].length === 0) {
            delete obj[key];
          } else if (Object.keys(obj[key]).length === 0) {
            delete obj[key];
          }
        } else if (obj[key] === '' || obj[key] === null) {
          delete obj[key];
        }
        if (obj.anagrafica && Object.keys(obj.anagrafica).length === 0) {
          delete obj.anagrafica;
        }
        if (obj.contratto && Object.keys(obj.contratto).length === 0) {
          delete obj.contratto;
        }
        if (obj.tipoContratto && Object.keys(obj.tipoContratto).length === 0) {
          delete obj.tipoContratto;
        }
        if (obj.tipoAzienda && Object.keys(obj.tipoAzienda).length === 0) {
          delete obj.tipoAzienda;
        }
        if (obj.tipoCcnl && Object.keys(obj.tipoCcnl).length === 0) {
          delete obj.tipoCcnl;
        }
        if (
          obj.tipoLivelloContratto &&
          Object.keys(obj.tipoLivelloContratto).length === 0
        ) {
          delete obj.tipoLivelloContratto;
        }

        if (
          obj.tipoCanaleReclutamento &&
          Object.keys(obj.tipoCanaleReclutamento).length === 0
        ) {
          delete obj.tipoCanaleReclutamento;
        }
        if (
          obj.tipoCausaFineRapporto &&
          Object.keys(obj.tipoCausaFineRapporto).length === 0
        ) {
          delete obj.tipoCausaFineRapporto;
        }
      });
    };

    removeEmpty(this.filterAnagraficaDto.value);
    const body = {
      anagraficaDto: this.filterAnagraficaDto.value,
    };
    console.log('PAYLOAD BACKEND FILTER: ' + JSON.stringify(body));

    this.anagraficaDtoService
      .filterAnagrafica(localStorage.getItem('token'), body)
      .subscribe(
        (result) => {
          if ((result as any).esito.code != 200) {
            alert(
              'Qualcosa é andato storto\n' + ': ' + (result as any).esito.target
            );
          } else {
            if (Array.isArray(result.list)) {
              this.pageData = result.list;
            } else {
              this.pageData = [];
              this.messaggio =
                'Nessun risultato trovato per i filtri inseriti, riprova.';
            }
            console.log(
              'Trovati i seguenti risultati: ' + JSON.stringify(result)
            );
          }
        },
        (error: any) => {
          console.log('Si é verificato un errore: ' + error);
        }
      );
  }

  mostraInfo(id: any) {
    console.log(id);
    this.anagraficaDtoService
      .detailAnagraficaDto(id, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.data = (resp as any)['anagraficaDto'];
          console.log(this.data);
          this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
          console.log(this.elencoCommesse);

          // Apro il dialog e passo i dati al componente
          const dialogRef = this.dialog.open(ModalInfoCommesseComponent, {
            data: {
              // Passa qui i dati che desideri
              anagraficaDto: this.data,
              commesse: this.elencoCommesse,
            },
          });
        },
        (error: any) => {
          console.error(
            'ERRORE DURANTE IL CARICAMENTO DELLE COMMESSE:' +
              JSON.stringify(error)
          );
        }
      );
  }
  data(data: any) {
    throw new Error('Method not implemented.');
  }

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

  onChangeTipoContrattoValue(event: any) {
    const selectedValue = parseInt(event.target.value, 10);

    const livelliCCNL = this.filterAnagraficaDto.get(
      'contratto.tipoLivelloContratto.id'
    );

    if (!isNaN(selectedValue)) {
      // Cerca l'opzione selezionata nei contratti nazionali
      const selectedOption = this.tipiCcnl.find(
        (canale: any) => canale.id === selectedValue
      );

      if (selectedOption) {
        console.log('Opzione selezionata: ', selectedOption);
        this.idCCNLselezionato = selectedOption.descrizione;
        livelliCCNL?.enable();

        this.anagraficaDtoService
          .changeCCNL(localStorage.getItem('token'), this.idCCNLselezionato)
          .subscribe(
            (response: any) => {
              console.log(
                'RESPONSE NUOVA LISTA LIVELLI CCNL:' + JSON.stringify(response)
              );
              this.elencoLivelliCCNL = response.list;
              console.log(
                '+-+-+-+-+-+-+-+-+-+-+-NUOVA LISTA LIVELLI CCNL+-+-+-+-+-+-+-+-+-+-+-' +
                  JSON.stringify(this.elencoLivelliCCNL)
              );
            },
            (error: any) => {
              console.error(
                'Errore durante il caricamento dei livelli di contratto: ' +
                  error
              );
            }
          );
      } else {
        console.log('Opzione non trovata ');
      }
    } else {
      console.log('Valore non valido ');
    }
  }

  mostraInfoContratto(id: any) {
    console.log(id);
    this.anagraficaDtoService
      .detailAnagraficaDto(id, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.data = (resp as any)['anagraficaDto'];
          console.log(this.data);
          this.contratto = (resp as any)['anagraficaDto']['contratto'];
          console.log(this.contratto);

          // Apro il dialog e passo i dati al componente
          const dialogRef = this.dialog.open(ModalInfoContrattoComponent, {
            data: {
              // Passa qui i dati che desideri
              anagraficaDto: this.data,
              commesse: this.contratto,
            },
          });
        },
        (error: any) => {
          console.error(
            'ERRORE DURANTE IL CARICAMENTO DELLE INFO SUL CONTRATTO:' +
              JSON.stringify(error)
          );
        }
      );
  }

  handleClickContratto(element: any) {
    if (element?.contratto != null) {
      this.mostraInfoContratto(element.anagrafica?.id);
    } else {
      this.router.navigate(['/modifica-anagrafica', element.anagrafica.id]);
    }
  }

  handleClick(element: any) {
    if (element?.commesse?.length > 0) {
      this.mostraInfo(element.anagrafica?.id);
    } else {
      this.router.navigate(['/modifica-anagrafica', element.anagrafica.id]);
    }
  }

  //METODI NAVBAR

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.codiceFiscaleDettaglio =
          response.anagraficaDto.anagrafica.codiceFiscale;
        this.getImage();
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
        this.authService.logout();
      }
    );
  }

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        console.log('DATI GET USER ROLE:' + JSON.stringify(response));
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        console.log('ID UTENTE PER NAV:' + this.idUtente);
        this.userRoleNav = response.anagraficaDto.ruolo.nome;
        if (
          (this.userRoleNav = response.anagraficaDto.ruolo.nome === 'ADMIN')
        ) {
          this.idNav = 1;
          this.generateMenuByUserRole();
        }
        if (
          (this.userRoleNav =
            response.anagraficaDto.ruolo.nome === 'DIPENDENTE')
        ) {
          this.idNav = 2;
          this.generateMenuByUserRole();
        }
      },
      (error: any) => {
        console.error(
          'Si è verificato il seguente errore durante il recupero del ruolo: ' +
            error
        );
        this.shouldReloadPage = true;
      }
    );
  }

  generateMenuByUserRole() {
    this.menuService
      .generateMenuByUserRole(this.token, this.idUtente)
      .subscribe(
        (data: any) => {
          this.jsonData = data;
          this.idFunzione = data.list[0].id;
          console.log(
            JSON.stringify('DATI NAVBAR: ' + JSON.stringify(this.jsonData))
          );
          this.shouldReloadPage = false;
        },
        (error: any) => {
          console.error('Errore nella generazione del menu:', error);
          this.shouldReloadPage = true;
          this.jsonData = { list: [] };
        }
      );
  }

  getPermissions(functionId: number) {
    this.menuService.getPermissions(this.token, functionId).subscribe(
      (data: any) => {
        console.log('Permessi ottenuti:', data);
      },
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  //metodi immagine
  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleDettaglio,
    };
    console.log(JSON.stringify(body));
    console.log('BODY PER GET IMAGE: ' + JSON.stringify(body));
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        console.log('BASE64 ricevuto: ' + JSON.stringify(this.immagine));

        if (this.immagine) {
          this.convertBase64ToImage(this.immagine);
        } else {
          // Assegna un'immagine predefinita se l'immagine non è disponibile
          this.immaginePredefinita =
            '../../../../assets/images/profilePicPlaceholder.png';
        }
      },
      (error: any) => {
        console.error(
          "Errore durante il caricamento dell'immagine: " +
            JSON.stringify(error)
        );

        // Assegna un'immagine predefinita in caso di errore
        this.immaginePredefinita = '../../../../assets/images/danger.png';
      }
    );
  }

  convertBase64ToImage(base64String: string): void {
    this.immagineConvertita = base64String;
  }

  toggleDarkMode() {
    this.toggleMode = !this.toggleMode;
  }
}

interface MenuData {
  esito: {
    code: number;
    target: any;
    args: any;
  };
  list: {
    id: number;
    funzione: any;
    menuItem: number;
    nome: string;
    percorso: string;
    immagine: any;
    ordinamento: number;
    funzioni: any;
    privilegio: any;
  }[];
}
