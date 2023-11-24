import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StoricoService } from '../storico-service';
import { ActivatedRoute } from '@angular/router';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { AnagraficaDtoService } from '../../anagraficaDto/anagraficaDto-service';
import { ThemeService } from 'src/app/theme.service';

declare var $: any;

@Component({
  selector: 'app-storico-contratti',
  templateUrl: './storico-contratti.component.html',
  styleUrls: ['./storico-contratti.component.scss'],
})
export class StoricoContrattiComponent implements OnInit {
  lista: any;
  idAnagrafica: any;
  id: any = this.activatedRoute.snapshot.params['id'];
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  idUtente: any;
  data: any[] = [];
  listaItem: any[] = [];
  anagrafica: any;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  tipoContratto: any;
  pageData: any[] = [];

  constructor(
    private storicoService: StoricoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    public themeService:ThemeService,
    private http: HttpClient,
    private anagraficaDtoService: AnagraficaDtoService
  ) { }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      this.detailAnagrafica();
    }

    this.idAnagrafica = this.activatedRoute.snapshot.params['id'];
    this.storicoService
      .getStoricoContratti(this.idAnagrafica, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          if ((resp as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Caricamento non riuscito:',
                message: (resp as any).esito.target,
              },
            });
          } else {
            this.lista = resp.list;
            this.pageData = this.getCurrentPageItems();
            this.currentPage = 1;
            console.log('currentPage:', this.currentPage);
            console.log('pageData:', this.pageData);
          }
        },
        (error: any) => {
          console.error(
            'Si e verificato un errore durante il caricamento dei dati:' + error
          );
        }
      );
  }

  //paginazione
  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.lista.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
      this.pageData = this.getCurrentPageItems(); // Update pageData when changing the page
    }
  }

  getTotalPages(): number {
    if (Array.isArray(this.lista)) {
      return Math.ceil(this.lista.length / this.itemsPerPage);
    }
    return 0; // Handle the case where lista is not an array
  }

  getPaginationArray(): number[] {
    if (Array.isArray(this.lista)) {
      const totalPages = this.getTotalPages();
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return []; // Handle the case where lista is not an array
  }

  detailAnagrafica() {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.anagrafica = (resp as any)['anagraficaDto'];

      });
  }

  //metodi nav
  logout() {
    this.dialog.open(AlertLogoutComponent);
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
