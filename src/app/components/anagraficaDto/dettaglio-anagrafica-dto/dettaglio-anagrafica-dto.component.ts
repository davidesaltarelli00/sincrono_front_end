import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrencyPipe, Location } from '@angular/common';
import { AuthService } from '../../login/login-service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageService } from '../../image.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MenuService } from '../../menu.service';
import { ThemeService } from 'src/app/theme.service';
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
  mobile = false;
  dataOdierna = new Date();

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

  //dati navbar
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  codiceFiscaleDettaglio: any;
  immagine: any;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  immagineConvertita: string | null = null;
  immaginePredefinita: string | null = null;
  idAnagraficaLoggata: any;
  disabilitaImmagine: any;
  salvaImmagine: boolean = false;
  immagineCancellata: boolean = false;
  idUtente: any;
  vediStoricoCommesse: boolean=false;
  ruolo: any;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private profileBoxService: ProfileBoxService,
    private http: HttpClient,
    private imageService: ImageService,
    private menuService:MenuService,
    public themeService: ThemeService

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

    console.log('DATA DI OGGI: ' + this.dataOdierna);
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    }
    console.log(this.id);
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.data = (resp as any)['anagraficaDto'];
        this.codiceFiscaleDettaglio = (resp as any)['anagraficaDto'][
          'anagrafica'
        ]['codiceFiscale'];
        console.log(this.codiceFiscaleDettaglio);
        this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
        console.log(this.elencoCommesse);
        this.getImage();
      });
    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
    }

    this.uppercaseCodiceFiscale();
  }

  addImage() {
    if (this.fileInput && this.fileInput.nativeElement.files.length > 0) {
      const selectedFile: File = this.fileInput.nativeElement.files[0];

      this.convertImageToBase64(selectedFile).then((base64String) => {
        let body = {
          codiceFiscale: this.codiceFiscaleDettaglio,
          base64: base64String,
        };
        console.log('BODY PER ADD: ' + JSON.stringify(body));
        this.imageService.addImage(this.token, body).subscribe(
          (response: any) => {
            if ((response as any).esito.code != 200) {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  title: 'Salvataggio non riuscito:',
                  message: (response as any).esito.target,
                },
              });
            } else {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  title: 'Immagine salvata correttamente:',
                  message: (response as any).esito.target,
                },
              });
              this.immagine = response;
              this.getImage();
            }
          },
          (error: any) => {
            console.error(
              'Errore durante l invio dell immagine: ' + JSON.stringify(error)
            );
          }
        );
      });
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Attenzione:',
          message: 'Nessuna immagine selezionata.',
        },
      });
    }
  }

  getImage() {
    let body = {
      codiceFiscale: this.codiceFiscaleDettaglio,
    };
    this.imageService.getImage(this.token, body).subscribe(
      (result: any) => {
        this.immagine = (result as any).base64;
        if (this.immagine) {
          this.convertBase64ToImage(this.immagine);
        } else {
          this.immaginePredefinita = '../../../../assets/images/profilePicPlaceholder.png';
        }
      },
      (error: any) => {
        console.error(
          "Errore durante il caricamento dell'immagine: " +
            JSON.stringify(error)
        );
        this.immaginePredefinita = '../../../../assets/images/danger.png';
      }
    );
  }

  convertBase64ToImage(base64String: string): void {
    this.immagineConvertita = base64String;
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      this.convertImageToBase64(selectedFile).then((base64String) => {
        this.immagineConvertita = base64String;
        this.salvaImmagine = true;
        console.log('CAMPO FILE: ' + selectedFile);
      });
    } else {
      this.salvaImmagine = false;
    }
  }

  convertImageToBase64(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }

  cancelImage() {
    this.immagineConvertita = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      this.immagineCancellata = true;
    } else {
      this.immagineCancellata = false;
    }
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
          alert('Commessa storicizzata correttamente.');
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

  modificaCommessa() {
    this.router.navigate(['/modifica-anagrafica/' + this.id]);
  }

  modificaAnagrafica() {
    this.router.navigate(['/modifica-anagrafica/' + this.id]);
  }

  modificaContratto() {
    this.router.navigate(['/modifica-anagrafica/' + this.id]);
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
    this.anagraficaDtoService
      .delete(body, localStorage.getItem('token'))
      .subscribe((result: any) => {
        if ((result as any).esito.code != 0) {
          alert(
            'cancellazione non riuscita\n' +
              'target: ' +
              (result as any).esito.target
          );
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
    this.vediStoricoCommesse=true;
  }

  goDown() {
    document.getElementById("finePagina")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }
  goTop() {
    document.getElementById("inizioPagina")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
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
      ['Dati Anagrafici'],
      [
        'Nome',
        'Cognome',
        'Codice fiscale',
        'Data di nascita',
        'Comune nascita',
        'Coniugato',
        'Figli a carico',
      ],
    ];
    const workSheetData1 = [
      ['Contatti'],
      [
        'Mail privata',
        'Mail aziendale',
        'Mail Pec',
        'Cellulare privato',
        'Cellulare aziendale',
      ],
    ];
    const workSheetData2 = [
      ['Dati azienda'],
      ['Nome azienda', 'Ruolo', 'Sede assunzione', 'Qualifica', 'PC'],
    ];
    const workSheetData3 = [
      ['Altri Dati'],
      [
        'Canale reclutamento',
        'Categoria protetta',
        'Assicurazione obbligatoria',
      ],
    ];
    const workSheetData4 = [
      ['Dati contrattuali'],
      ['Tipologiche Contrattuali'],
      ['Tipo azienda', 'Tipo CCNL', 'Tipo contratto'],
    ];
    const workSheetData5 = [
      ['Date contratto'],
      [
        'Data Assunzione',
        'Data inizio prova',
        'Data fine prova',
        'Data fine rapporto',
        'Mesi durata',
      ],
    ];
    const workSheetData6 = [
      ['Dati economici'],
      [
        'Retribuzione mensile lorda',
        'Superminimo mensile',
        'Ral annuale',
        'Superminimo RAL',
        'Diaria annua',
        'Diaria mese',
        'Diaria giorno',
        'Ticket',
        'Valore ticket',
      ],
    ];
    const workSheetData7 = [
      ['Retribuzione netta'],
      ['Retribuzione netta mensile', 'Retribuzione netta giornaliera'],
    ];
    const workSheetData8 = [
      ['Dati medici'],
      ['Visita medica', 'Data visita medica'],
    ];
    const workSheetData9 = [
      ['Commesse'],
      [
        'Cliente',
        'Cliente Finale',
        'Titolo Posizione',
        'Distacco',
        'Data Inizio',
        'Data Fine',
        'Tariffa Giornaliera',
        'Azienda di Fatturazione Interna',
        'Stato',
        'Attesa Lavori',
      ],
    ];

    workSheetData.push([
      this.data.anagrafica.nome ? this.data.anagrafica.nome.toString() : '',
      this.data.anagrafica.cognome
        ? this.data.anagrafica.cognome.toString()
        : '',
      this.data.anagrafica.codiceFiscale
        ? this.data.anagrafica.codiceFiscale.toString()
        : '',
      this.datePipe.transform(
        this.data.anagrafica.dataDiNascita
          ? this.data.anagrafica.dataDiNascita.toString()
          : ''
      ),
      this.data.anagrafica.comuneDiNascita
        ? this.data.anagrafica.comuneDiNascita.toString()
        : '',
      this.data.anagrafica.coniugato ? 'si' : 'No',
      this.data.anagrafica.figliACarico ? 'si' : 'No',
    ]);
    workSheetData1.push([
      this.data.anagrafica.mailPrivata
        ? this.data.anagrafica.mailPrivata.toString()
        : '',
      this.data.anagrafica.mailAziendale
        ? this.data.anagrafica.mailAziendale.toString()
        : '',
      this.data.anagrafica.mailPec
        ? this.data.anagrafica.mailPec.toString()
        : '',
      this.data.anagrafica.cellulareAziendale
        ? this.data.anagrafica.cellulareAziendale.toString()
        : '',
    ]);
    workSheetData2.push([
      this.data.anagrafica.tipoAzienda.descrizione
        ? this.data.anagrafica.tipoAzienda.descrizione.toString()
        : '',
      this.data.ruolo.nome ? this.data.ruolo.nome.toString() : '',
      this.data.anagrafica.sedeAssunzione
        ? this.data.anagrafica.sedeAssunzione.toString()
        : '',
      this.data.anagrafica.qualifica
        ? this.data.anagrafica.qualifica.toString()
        : '',
      this.data.anagrafica.pc ? this.data.anagrafica.pc.toString() : '',
    ]);
    workSheetData3.push([
      this.data.contratto.tipoCanaleReclutamento.descrizione
        ? this.data.contratto.tipoCanaleReclutamento.descrizione.toString()
        : '',
      this.data.contratto.categoriaProtetta
        ? this.data.contratto.categoriaProtetta.toString()
        : '',
      this.data.contratto.assicurazioneObbligatoria
        ? this.data.contratto.assicurazioneObbligatoria.toString()
        : '',
    ]);
    workSheetData4.push([
      this.data.contratto.tipoAzienda.descrizione
        ? this.data.contratto.tipoAzienda.descrizione.toString()
        : '',
      this.data.contratto.tipoCcnl.descrizione
        ? this.data.contratto.tipoCcnl.descrizione.toString()
        : '',
      this.data.contratto.tipoContratto.descrizione
        ? this.data.contratto.tipoContratto.descrizione.toString()
        : '',
    ]);
    workSheetData5.push([
      this.datePipe.transform(
        this.data.contratto.dataAssunzione
          ? this.data.contratto.dataAssunzione.toString()
          : ''
      ),
      this.datePipe.transform(
        this.data.contratto.dataInizioProva
          ? this.data.contratto.dataInizioProva.toString()
          : ''
      ),
      this.datePipe.transform(
        this.data.contratto.dataFineProva
          ? this.data.contratto.dataFineProva.toString()
          : ''
      ),
      this.datePipe.transform(
        this.data.contratto.dataFineRapporto
          ? this.data.contratto.dataFineRapporto.toString()
          : ''
      ),
      this.data.contratto.mesiDurata
        ? this.data.contratto.mesiDurata.toString()
        : '',
    ]);
    workSheetData6.push([
      this.data.contratto.retribuzioneMensileLorda
        ? this.data.contratto.retribuzioneMensileLorda.toString()
        : '',
      this.data.contratto.superminimoMensile
        ? this.data.contratto.superminimoMensile.toString()
        : '',
      this.data.contratto.ralAnnua
        ? this.data.contratto.ralAnnua.toString()
        : '',
      this.data.contratto.superminimoRal
        ? this.data.contratto.superminimoRal.toString()
        : '',
      this.data.contratto.diariaAnnua
        ? this.data.contratto.dataAssunzione.toString()
        : '',
      this.data.contratto.diariaMese
        ? this.data.contratto.diariaMese.toString()
        : '',
      this.data.contratto.diariaGiorno
        ? this.data.contratto.diariaGiorno.toString()
        : '',
      this.data.contratto.ticket ? this.data.contratto.ticket.toString() : '',
      this.data.contratto.valoreTicket
        ? this.data.contratto.valoreTicket.toString()
        : '',
    ]);
    workSheetData7.push([
      this.data.contratto.retribuzioneNettaMensile
        ? this.data.contratto.retribuzioneNettaMensile.toString()
        : '',
      this.data.contratto.retribuzioneNettaGiornaliera
        ? this.data.contratto.retribuzioneNettaGiornaliera.toString()
        : '',
    ]);
    workSheetData8.push([
      this.data.contratto.visitaMedica
        ? this.data.contratto.visitaMedica.toString()
        : '',

      this.datePipe.transform(
        this.data.contratto.dataVisitaMedica
          ? this.data.contratto.dataVisitaMedica.toString()
          : ''
      ),
    ]);

    this.data.commesse.forEach((commessa: any) => {
      workSheetData9.push([
        commessa.aziendaCliente ? commessa.aziendaCliente.toString() : '',
        commessa.clienteFinale ? commessa.clienteFinale.toString() : '',
        commessa.titoloPosizione ? commessa.titoloPosizione.toString() : '',
        commessa.distacco ? commessa.distacco.toString() : '',
        commessa.distaccoAzienda ? commessa.distaccoAzienda.toString() : '',
        this.datePipe.transform(
          commessa.distaccoData ? commessa.distaccoData.toString() : '',
          'yyyy-MM-dd'
        ),
        commessa.tariffaGiornaliera
          ? commessa.tariffaGiornaliera.toString()
          : '',
        commessa.aziendaDiFatturazioneInterna
          ? commessa.aziendaDiFatturazioneInterna.toString()
          : '',
        this.datePipe.transform(
          commessa.dataInizio ? commessa.dataInizio.toString() : '',
          'yyyy-MM-dd'
        ),
        this.datePipe.transform(
          commessa.dataFine ? commessa.dataFine.toString() : '',
          'yyyy-MM-dd'
        ),
        commessa.attivo,
      ]);
    });

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

  //metodi navbar

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.idAnagraficaLoggata = response.anagraficaDto.anagrafica.id;
        this.ruolo=response.anagraficaDto.ruolo.nome;
        console.log('ID ANAGRAFICA LOGGATA:' + this.idAnagraficaLoggata);
        if (this.id === this.idAnagraficaLoggata) {
          this.disabilitaImmagine = true;
        } else {
          this.disabilitaImmagine = false;
        }
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
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
    this.menuService.generateMenuByUserRole(this.token, this.idUtente).subscribe(
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

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
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
