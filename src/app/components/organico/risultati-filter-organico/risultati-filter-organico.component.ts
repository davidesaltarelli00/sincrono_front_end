import { OrganicoService } from './../organico-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaDtoService } from '../../anagraficaDto/anagraficaDto-service';
import { ContrattoService } from '../../contratto/contratto-service';
import { AuthService } from '../../login/login-service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';

@Component({
  selector: 'app-risultati-filter-organico',
  templateUrl: './risultati-filter-organico.component.html',
  styleUrls: ['./risultati-filter-organico.component.scss'],
})
export class RisultatiFilterOrganicoComponent implements OnInit {
  tipoContrattoFilter = this.activatedRoute.snapshot.params['tipoContratto'];
  tipoAziendaFilter = this.activatedRoute.snapshot.params['tipoAzienda'];
  id = this.activatedRoute.snapshot.params['id'];

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
  anagraficaLoggata: any;
  ruolo: any;
  pageData: any;
  messaggio: any;
  commesse!: FormArray;
  listaAnagraficheFromFilter: any[] = [];
  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      tipoAzienda: new FormGroup({
        descrizione: new FormControl(null),
      }),
    }),
    contratto: new FormGroup({
      tipoContratto: new FormGroup({
        descrizione: new FormControl(null),
      }),
    }),
  });
  idUtente: any;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private organicoService: OrganicoService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.filterAnagraficaDto = this.formBuilder.group({


      contratto: new FormGroup({

        tipoContratto: new FormGroup({
          descrizione: new FormControl(null),
        }),
        tipoAzienda:new FormGroup({
          descrizione: new FormControl(null),
        })

      }),

    });

    this.commesse = this.filterAnagraficaDto.get('commesse') as FormArray;

    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagraficaLoggata = response.anagraficaDto.anagrafica.id;
        console.log(
          'ID UTENTE LOGGATO: ' + JSON.stringify(this.anagraficaLoggata)
        );
        this.ruolo = response.anagraficaDto.ruolo.descrizione;
        console.log('RUOLO UTENTE LOGGATO:' + this.ruolo);
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
          error
        );
      }
    );
  }

  ngOnInit(): void {
    if (this.token != null) {

      this.activatedRoute.queryParams.subscribe((params) => {
        this.tipoContrattoFilter = params['tipoContratto'];
        this.tipoAziendaFilter = params['azienda'];

        console.log('Tipo Contratto:', this.tipoContrattoFilter);
        console.log('Azienda:', this.tipoAziendaFilter);

      });

      this.getUserLogged();
      this.getUserRole();
      this.setFilterFromOrganico(
        this.tipoContrattoFilter,
        this.tipoAziendaFilter
      );

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
                'Trovati i seguenti risultati per il filter: ' + JSON.stringify(result)
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
      this.filterValidate(this.pageData);
    }

  }

  setFilterFromOrganico(tipoContrattoFilter: any, tipoAziendaFilter: any) {
    if (tipoContrattoFilter != null && tipoAziendaFilter != null) {
      this.filterAnagraficaDto.value.contratto.tipoContratto.descrizione =
        this.tipoContrattoFilter;
      this.filterAnagraficaDto.value.contratto.tipoAzienda.descrizione =
        this.tipoAziendaFilter;

    }


  }

  filterValidate(value: any) {
    console.log('Valore del form: ' + JSON.stringify(value));
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
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
        if (
          obj.tipoLivelloContratto &&
          Object.keys(obj.tipoLivelloContratto).length === 0
        ) {
          delete obj.tipoLivelloContratto;
        }

      });

    };
    removeEmpty(this.filterAnagraficaDto.value);
    const body = {
      anagraficaDto: this.filterAnagraficaDto.value

    };
    console.log('PAYLOAD BACKEND FILTER: ' + JSON.stringify(body));




  }

  dettaglioAnagrafica(idAnagrafica: number) {

    this.anagraficaDtoService
      .detailAnagraficaDto(idAnagrafica, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.router.navigate(['/dettaglio-anagrafica/' + idAnagrafica]);
      });
  }

  vaiAModificaAnagrafica(idAnagrafica: number) {
    this.anagraficaDtoService
      .update(idAnagrafica, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.router.navigate(['/modifica-anagrafica/' + idAnagrafica]);
      });
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
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
        // console.log(
        //   JSON.stringify('DATI NAVBAR: ' + JSON.stringify(this.jsonData))
        // );
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.token}`,
    });
    const url = `http://localhost:8080/services/operazioni/${functionId}`;
    this.http.get(url, { headers: headers }).subscribe(
      (data: any) => {
        // console.log('Permessi ottenuti:', data);
      },
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  logout() {
    this.dialog.open(AlertLogoutComponent);
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
