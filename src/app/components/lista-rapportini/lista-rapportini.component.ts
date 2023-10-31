import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../login/login-service';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { RapportinoService } from '../utente/rapportino.service';
import { ListaRapportiniService } from './lista-rapportini.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { ModaleDettaglioRapportinoComponent } from '../modale-dettaglio-rapportino/modale-dettaglio-rapportino.component';
import { RapportinoDataService } from '../modale-dettaglio-rapportino/RapportinoData.service';
import { MenuService } from '../menu.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-lista-rapportini',
  templateUrl: './lista-rapportini.component.html',
  styleUrls: ['./lista-rapportini.component.scss'],
})
export class ListaRapportiniComponent implements OnInit {
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  ruolo: any;

  elencoRapportiniFreezati: any[] = [];
  elencoRapportiniNonFreezati: any[] = [];
  checkFreeze = false;
  mobile: any = false;
  selectedAnno: any;
  selectedMese: any;
  currentDate = new Date();
  currentMonth: any;
  currentYear: any;
  codiceFiscale = '';
  note: any;
  anni: number[] = [];
  mesi: number[] = [];
  rapportinoDto: any;
  giorniUtili: any;
  giorniLavorati: any;
  selectedMeseRapportinoNonFreezato: any;
  selectedAnnoRapportinoNonFreezato: any;
  // paginazione 1 :tabella rapportini non freezati
  currentPage: number = 1;
  itemsPerPage: number = 20;
  pageData: any[] = [];
  // paginazione 2: tabella rapportini freezati
  currentPage2: number = 1;
  itemsPerPage2: number = 20;
  pageData2: any[] = [];
  idUtente: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private rapportinoService: RapportinoService,
    private listaRapportiniService: ListaRapportiniService,
    private rapportinoDataService: RapportinoDataService,
    private menuService: MenuService
  ) {
    const oggi = new Date();
    const annoCorrente = oggi.getFullYear();
    const meseCorrente = oggi.getMonth() + 1;

    for (let anno = 2010; anno <= annoCorrente; anno++) {
      this.anni.push(anno);
    }

    this.mesi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    this.selectedAnno = annoCorrente;
    this.selectedMese = meseCorrente;
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
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.getAllRapportiniNonFreezati();
      this.getAllRapportiniFreezati();
    }
  }

  getAllRapportiniNonFreezati() {
    this.listaRapportiniService
      .getAllRapportiniNonFreezati(this.token)
      .subscribe(
        (result: any) => {
          this.elencoRapportiniNonFreezati = result['list'];
          this.selectedMeseRapportinoNonFreezato = result['list']['mese'];
          this.selectedAnnoRapportinoNonFreezato = result['list']['anno'];
          this.currentPage = 1;
          this.pageData = this.getCurrentPageItems();
          console.log(
            'ELENCO RAPPORTINI NON FREEZATI:' +
              JSON.stringify(this.elencoRapportiniNonFreezati)
          );
        },
        (error: any) => {
          console.error(
            'Errore durante il caricamento dei rapportini not freeze: ' +
              JSON.stringify(error)
          );
        }
      );
  }

  getAllRapportiniFreezati() {
    this.listaRapportiniService.getAllRapportiniFreezati(this.token).subscribe(
      (result: any) => {
        this.elencoRapportiniFreezati = result['list'];
        this.currentPage2 = 1;
        this.pageData2 = this.getCurrentPageItems2();
        console.log(
          'Rapportini freezati caricati: ' +
            JSON.stringify(this.elencoRapportiniFreezati)
        );
      },
      (error: any) => {
        console.error(
          'Si é verificato un errore durante il caricamento dei rapportini freezati: ' +
            JSON.stringify(error)
        );
      }
    );
  }

  eliminaRapportinoNonFreezato(id: number) {
    console.log(id);
    this.rapportinoService.deleteRapportino(this.token, id).subscribe(
      (result: any) => {
        console.log(
          'RAPPORTINO NUMERO ' +
            id +
            ' ELIMINATO CORRETTAMENTE: ' +
            JSON.stringify(result)
        );
      },
      (error: any) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  eliminaRapportinoFreezato(index: number) {
    console.log(index);
  }

  onChangecheckFreeze(event: any, index: number, anno: number, mese: number) {
    const isChecked = event.target.checked;
    //console.log(`Valore del checkbox al rapportino numero ${index} è ${isChecked}`);

    if (isChecked) {
      const confirmation = window.confirm(
        'Sei sicuro di voler congelare il metodo?'
      );
      if (confirmation) {
        this.checkFreeze = isChecked;
        let body = {
          rapportino: {
            id: index,
            codiceFiscale: this.codiceFiscale,
            anno: anno,
            mese: mese,
            checkFreeze: this.checkFreeze,
          },
        };
        console.log('PAYLOAD CHECKFREEZE TRUE:' + JSON.stringify(body));

        this.listaRapportiniService
          .UpdateCheckFreeze(this.token, body)
          .subscribe(
            (result: any) => {
              console.log('RAPPORTINO CONGELATO:' + JSON.stringify(result));
              //fare insert db
              this.getAllRapportiniFreezati();
              this.getAllRapportiniNonFreezati();
            },
            (error: any) => {
              console.error(
                'Errore durante il congelamento del rapportino: ' +
                  JSON.stringify(error)
              );
            }
          );
      } else {
        //console.log('niente');
        // In questo caso, il checkbox non viene selezionato perché l'utente ha annullato la conferma.
        event.target.checked = false;
      }
    } else {
      const confirmation = window.confirm(
        'Sei sicuro di voler congelare il rapportino?'
      );
      if (confirmation) {
        //console.log('parte metodo false');
        this.checkFreeze = isChecked;
        let body = {
          rapportino: {
            id: index,
            codiceFiscale: this.codiceFiscale,
            anno: anno,
            mese: mese,
            checkFreeze: this.checkFreeze,
          },
        };
        console.log('PAYLOAD CHECKFREEZE FALSE :' + JSON.stringify(body));

        this.listaRapportiniService
          .UpdateCheckFreeze(this.token, body)
          .subscribe(
            (result: any) => {
              console.log('RAPPORTINO SCONGELATO:' + JSON.stringify(result));
              this.getAllRapportiniFreezati();
              this.getAllRapportiniNonFreezati();
            },
            (error: any) => {
              console.error(
                'Errore durante lo scongelamento del rapportino: ' +
                  JSON.stringify(error)
              );
            }
          );
      } else {
        console.log('niente');
        // In questo caso, il checkbox non viene deselezionato perché l'utente ha annullato la conferma.
        event.target.checked = true;
      }
    }
  }

  resetNote() {
    this.note = null;
  }

  aggiungiNote() {
    let body = {
      rapportinoDto: {
        note: this.note,
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: this.selectedAnno,
        meseRequest: this.selectedMese,
      },
    };
    console.log('BODY AGGIUNGI NOTE:' + JSON.stringify(body));

    this.rapportinoService.aggiungiNote(this.token, body).subscribe(
      (result: any) => {
        if (
          (result as any).esito.code !== 200 &&
          (result as any).esito.target === 'HTTP error code: 400'
        ) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Salvataggio delle note non riuscito:',
              message: 'Errore di validazione.', //(result as any).esito.target,
            },
          });
          console.error(result);
        } else {
          console.log('RESULT AGGIUNGI NOTE:' + JSON.stringify(result));
        }
      },
      (error: any) => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            Image: '../../../../assets/images/logo.jpeg',
            title: 'Salvataggio delle note non riuscito:',
            message: JSON.stringify(error),
          },
        });
      }
    );
  }

  onMeseSelectChange(event: any) {
    console.log('Mese selezionato:', event.target.value);
  }

  onAnnoSelectChange(event: any) {
    console.log('Anno selezionato:', event.target.value);
  }

  scarica(value: any) {
    console.log(value.value);
    if (value.valid) {
      let body = {
        anno: this.selectedAnno,
        mese: this.selectedMese,
      };
      console.log('Body per file export' + JSON.stringify(body));
      this.listaRapportiniService
        .exportFileRapportino(this.token, body)
        .subscribe(
          (result: any) => {
            // console.log('Response export rapportino: ', JSON.stringify(result));
            const rapportinoBase64 = result.rapportinoB64;
            console.log('BASE64: ' + rapportinoBase64);
            // Decodifica il Base64 in un array di byte
            const byteCharacters = atob(rapportinoBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Crea un oggetto Blob dal byte array
            const blob = new Blob([byteArray], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Salva il file Excel utilizzando FileSaver
            FileSaver.saveAs(blob, 'rapportino.xlsx');
          },
          (error: any) => {
            console.error(
              'Errore durante l export del rapportino:' + JSON.stringify(error)
            );
          }
        );
    }
  }

  getRapportino(
    id: any,
    nome: any,
    cognome: any,
    codiceFiscale: any,
    mese: any,
    anno: any
  ) {
    console.log('DATI IN LISTA RAPPORTINI PER ROTTA' + id, mese, anno);
    this.router.navigate([
      '/dettaglio-rapportino',
      id,
      nome,
      cognome,
      codiceFiscale,
      mese,
      anno,
    ]);
  }

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
        this.ruolo = response.anagraficaDto.ruolo.nome;
        this.codiceFiscale = response.anagraficaDto.anagrafica.codiceFiscale;
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
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));

        this.userRoleNav = response.anagraficaDto.ruolo.nome;
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
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

  //paginazione tabella rapportini non freezati
  getCurrentPageItems(): any[] {
    if (!this.elencoRapportiniNonFreezati) {
      return [];
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.elencoRapportiniNonFreezati.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
      this.pageData = this.getCurrentPageItems();
    }
  }

  getTotalPages(): number {
    return Math.ceil(
      (this.elencoRapportiniNonFreezati?.length || 0) / this.itemsPerPage
    );
  }

  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  //fine paginazione tabella rapportini non freezati

  //paginazione tabella rapportini  freezati
  getCurrentPageItems2(): any[] {
    if (!this.elencoRapportiniFreezati) {
      return [];
    }

    const startIndex = (this.currentPage2 - 1) * this.itemsPerPage2;
    const endIndex = startIndex + this.itemsPerPage2;
    return this.elencoRapportiniFreezati.slice(startIndex, endIndex);
  }

  goToPage2(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages2()) {
      this.currentPage2 = pageNumber;
      this.pageData2 = this.getCurrentPageItems2();
    }
  }

  getTotalPages2(): number {
    return Math.ceil(
      (this.elencoRapportiniFreezati?.length || 0) / this.itemsPerPage2
    );
  }

  getPaginationArray2(): number[] {
    const totalPages = this.getTotalPages2();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  //fine paginazione tabella rapportini  freezati
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
