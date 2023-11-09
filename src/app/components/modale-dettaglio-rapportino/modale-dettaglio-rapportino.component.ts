import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportinoService } from '../utente/rapportino.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertLogoutComponent } from '../alert-logout/alert-logout.component';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';

@Component({
  selector: 'app-modale-dettaglio-rapportino',
  templateUrl: './modale-dettaglio-rapportino.component.html',
  styleUrls: ['./modale-dettaglio-rapportino.component.scss'],
})
export class ModaleDettaglioRapportinoComponent implements OnInit {
  id: any = this.activatedRoute.snapshot.params['id'];
  nome: any = this.activatedRoute.snapshot.params['nome'];
  cognome: any = this.activatedRoute.snapshot.params['cognome'];
  codiceFiscale: any = this.activatedRoute.snapshot.params['codiceFiscale'];
  mese: any = this.activatedRoute.snapshot.params['mese'];
  anno: any = this.activatedRoute.snapshot.params['anno'];
  token = localStorage.getItem('token');
  rapportinoDto: any[]=[];
  note: any;
  giorniUtili: any;
  giorniLavorati: any;
  @ViewChild('editableTable') editableTable!: ElementRef;
  mobile = false;
  user: any;
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  ruolo: any;
  idUtenteLoggato: any;
  dettaglioSbagliato: any;
  elencoCommesse: any[] = [];
  numeroCommessePresenti: any;
  idUtente: any;
  selectedAnno: number;
  selectedMese: number;
  anni: number[] = [];
  mesi: number[] = [];
  esitoCorretto: boolean = false;
  duplicazioniGiornoDto: any[] = [];
  //calcoli
  totaleOreLavorate: any;
  totaleFerie: any;
  totaleMalattia: any;
  totaleStraordinari: any;
  totaleOrePermessi: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rapportinoService: RapportinoService,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private profileBoxService: ProfileBoxService,
    private anagraficaDtoService: AnagraficaDtoService,
    private cdRef: ChangeDetectorRef
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

  ngOnInit() {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      console.log(
        this.id,
        this.nome,
        this.cognome,
        this.codiceFiscale,
        this.mese,
        this.anno
      );

      let body = {
        rapportinoDto: {
          anagrafica: {
            codiceFiscale: this.codiceFiscale,
          },
          annoRequest: this.selectedAnno,
          meseRequest: this.selectedMese,
        },
      };
      this.rapportinoService.getRapportino(this.token, body).subscribe(
        (result: any) => {
          if ((result as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                Image: '../../../../assets/images/logo.jpeg',
                title: 'Caricamento non riuscito:',
                message: (result as any).esito.target,
              },
            });
          } else {
            this.esitoCorretto = true;
            this.rapportinoDto = result['rapportinoDto']['mese']['giorni'];
            this.duplicazioniGiornoDto =
              result['rapportinoDto']['mese']['giorni'][
                'duplicazioniGiornoDto'
              ];
            this.giorniUtili = result['rapportinoDto']['giorniUtili'];
            this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];
            this.note = result['rapportinoDto']['note'];
            console.log(
              'Dati get rapportino:' + JSON.stringify(this.rapportinoDto)
            );
            if (this.note != null) {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: {
                  Image: '../../../../assets/images/logo.jpeg',
                  title: 'Attenzione:',
                  message: this.note,
                },
              });
            }
          }
        },
        (error: string) => {
          console.error('ERRORE:' + JSON.stringify(error));
        }
      );
      this.calcolaTotaleFerie();
      this.calcolaTotaleMalattia();
      this.calcolaTotaleOreLavorate();
      this.calcolaTotaleOrePermessi();
      this.calcolaTotaleStraordinari();
      this.cdRef.detectChanges();
    } else {
      console.error('ERRORE DI AUTENTICAZIONE');
    }
  }

  trackByFn(index: number, item: any): number {
    return index;
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
        annoRequest: this.anno,
        meseRequest: this.mese,
      },
    };
    console.log('BODY AGGIUNGI NOTE:' + JSON.stringify(body));

    this.rapportinoService.aggiungiNote(this.token, body).subscribe(
      (result: any) => {
        if (
          (result as any).esito.code !== 200 ||
          (result as any).esito.target === 'HTTP error code: 400'
        ) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Salvataggio delle note non riuscito:',
              message: (result as any).esito.target, //(result as any).esito.target,
            },
          });
          console.error(result);
        } else {
          console.log('RESULT AGGIUNGI NOTE:' + JSON.stringify(result));
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Note salvate e rapportino rispedito all utente.',
            },
          });
          this.router.navigate(['/lista-rapportini']);
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

  //calcoli
  calcolaTotaleOreLavorate() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      for (const duplicazione of giorno.duplicazioniGiornoDto) {
        if (duplicazione.oreOrdinarie) {
          totale += duplicazione.oreOrdinarie;
        }
      }
    }

    this.totaleOreLavorate = totale;
  }

  calcolaTotaleFerie() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      if (giorno.ferie) {
        totale += 1;
      }
    }

    this.totaleFerie = totale;
  }

  calcolaTotaleMalattia() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      if (giorno.malattie) {
        totale += 1;
      }
    }

    this.totaleMalattia = totale;
  }

  calcolaTotaleStraordinari() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      for (const duplicazione of giorno.duplicazioniGiornoDto) {
        // Assicurati che i campi straordinari siano definiti (potrebbero essere null o undefined)
        if (duplicazione.fascia1) {
          totale += duplicazione.fascia1;
        }
        if (duplicazione.fascia2) {
          totale += duplicazione.fascia2;
        }
        if (duplicazione.fascia3) {
          totale += duplicazione.fascia3;
        }
      }
    }

    this.totaleStraordinari = totale;
  }

  calcolaTotaleOrePermessi() {
    let totale = 0;

    for (const giorno of this.rapportinoDto) {
      if (giorno.permessi) {
        totale += giorno.permessi; // Aggiungi le ore di permesso al totale
      }
    }

    this.totaleOrePermessi = totale;
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
        this.idUtenteLoggato = response.anagraficaDto.anagrafica.id;
        console.log('ID USER LOGGATO: ' + JSON.stringify(this.idUtenteLoggato));

        if (this.idUtenteLoggato != this.id) {
          this.dettaglioSbagliato = true;
        } else {
          this.dettaglioSbagliato = false;
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `http://localhost:8080/services/funzioni-ruolo-tree/${this.idUtente}`;
    this.http.get<MenuData>(url, { headers: headers }).subscribe(
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
      }
    );
  }

  getPermissions(functionId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `http://localhost:8080/services/operazioni/${functionId}`;
    this.http.get(url, { headers: headers }).subscribe(
      (data: any) => {
        console.log('Permessi ottenuti:', data);
      },
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }
} //fine classe

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
