import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoricoService } from '../storico-service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { ThemeService } from 'src/app/theme.service';
import { MenuService } from '../../menu.service';

declare var $: any;

@Component({
  selector: 'app-storico-commesse',
  templateUrl: './storico-commesse.component.html',
  styleUrls: ['./storico-commesse.component.scss'],
})
export class StoricoCommesseComponent implements OnInit {
  lista: any;
  errore = false;
  messaggio: any;
  // paginazione
  currentPage: number = 1;
  itemsPerPage: number = 3; // Numero di elementi per pagina
  id = this.activatedRouter.snapshot.params['id'];
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
  pageData: any[] = [];
  windowWidth: any;
  mobile: any;
  isHamburgerMenuOpen: boolean = false;
  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private storicoService: StoricoService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private menuService: MenuService,
    private http: HttpClient,
    public themeService: ThemeService
  ) {
    this.windowWidth = window.innerWidth;
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
    }
    var idAnagrafica = this.activatedRouter.snapshot.params['id'];
    this.storicoService
      .getStoricoCommesse(idAnagrafica, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.lista = resp.list;
          this.lista = this.getCurrentPageItems();
          console.log(JSON.stringify(resp.list));
        },
        (error: any) => {
          console.error('Errore durante il caricamento dei dati: ' + error);
        }
      );
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }

  getWindowWidth(): number {
    return this.windowWidth;
  }
  toggleHamburgerMenu(): void {
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
  }
  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
  }
  getStoricoCommesse(idAnagrafica: number): any {
    this.router.navigate(['/storico-commesse', idAnagrafica]);
  }

  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
  }

  riattivaCommessa(id: number, posizione: number) {
    console.log('ID COMMESSA DA RIATTIVARE: ' + id);
    console.log("Posizione nell'array: " + posizione);

    const payload = {
      anagraficaDto: {
        anagrafica: null,
        contratto: null,
        commesse: [this.lista[posizione]],
        ruolo: null,
      },
    };

    console.log(JSON.stringify(payload));

    this.storicoService
      .riattivaCommessa(payload, localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          console.log(
            'Commessa riattivata correttamente: ' + JSON.stringify(res)
          );
          alert('Commessa riattivata correttamente.');
          this.router.navigate(['/dettaglio-anagrafica/', this.id]);
        },
        (error: any) => {
          alert(
            'Si è verificato un errore durante la storicizzazione della commessa selezionata: ' +
            error
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

  getTotalPages(): number {
    return Math.ceil(this.lista.length / this.itemsPerPage);
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

  //fine paginazione

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
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;

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
    this.menuService.getPermissions(this.token, functionId).subscribe(
      (data: any) => {
        // console.log('Permessi ottenuti:', data);
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
