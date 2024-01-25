import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StoricoService } from '../storico-service';
import { ActivatedRoute } from '@angular/router';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { AnagraficaDtoService } from '../../anagraficaDto/anagraficaDto-service';
import { ThemeService } from 'src/app/theme.service';
import { MenuService } from '../../menu.service';
import { AuthService } from '../../login/login-service';

declare var $: any;

@Component({
  selector: 'app-storico-contratti',
  templateUrl: './storico-contratti.component.html',
  styleUrls: ['./storico-contratti.component.scss'],
})
export class StoricoContrattiComponent implements OnInit {
  lista: any[] = [];
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
  itemsPerPage: number = 5;
  tipoContratto: any;
  pageData: any[] = [];
  windowWidth: any;
  mobile: any;
  isHamburgerMenuOpen: boolean = false;
  tokenExpirationTime: any;
  timer: any;
  idAnagraficaLoggata: any;
  tipoContrattoDettaglio: any;

  constructor(
    private storicoService: StoricoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    public themeService: ThemeService,
    private http: HttpClient,
    private menuService: MenuService,
    private anagraficaDtoService: AnagraficaDtoService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
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

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idAnagraficaLoggata]);
  }

  ngOnInit(): void {
    if (this.token) {
      const tokenParts = this.token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      this.tokenExpirationTime = Math.floor(tokenPayload.exp - currentTime);
      this.timer = setInterval(() => {
        this.tokenExpirationTime -= 1;
        this.cdRef.detectChanges();
        if (this.tokenExpirationTime === 0) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Attenzione:',
              message: 'Sessione terminata; esegui il login.',
            },
          });
          this.authService.logout().subscribe(
            (response: any) => {
              if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenProvvisorio');
                sessionStorage.clear();
                this.router.navigate(['/login']);
                this.dialog.closeAll();
              } else {
                console.log(
                  'Errore durante il logout:',
                  response.status,
                  response.body
                );
                this.handleLogoutError();
              }
            },
            (error: HttpErrorResponse) => {
              if (error.status === 403) {
                console.log('Errore 403: Accesso negato');
                this.handleLogoutError();
              } else {
                console.log('Errore durante il logout:', error.message);
                this.handleLogoutError();
              }
            }
          );
        }
      }, 1000);
    }
    if (this.token != null) {
      this.getUserLogged();
      this.detailAnagrafica();
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(
      remainingSeconds
    )}`;
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private handleLogoutError() {
    sessionStorage.clear();
    window.location.href = 'login';
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvvisorio');
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
    return 0;
  }

  getPaginationArray(): number[] {
    if (Array.isArray(this.lista)) {
      const totalPages = this.getTotalPages();
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [];
  }

  detailAnagrafica() {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          if ((resp as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Caricamento anagrafica non riuscito:',
                message: (resp as any).esito.target,
              },
            });
          } else {
            // console.log(resp);
            this.anagrafica = (resp as any)['anagraficaDto'];
            this.tipoContrattoDettaglio = (resp as any)['anagraficaDto'][
              'contratto'
            ]['tipoContratto']['descrizione'];
            console.log(
              'TIPO DI CONTRATTO DELL UTENTE: ' + this.tipoContrattoDettaglio
            );
            this.listaStoricoContratti();
          }
        },
        (error: any) => {
          console.error(
            'ERRORE Durante il dettaglio dell anagrafica: ' +
              JSON.stringify(error)
          );
        }
      );
  }

  listaStoricoContratti() {
    this.idAnagrafica = this.activatedRoute.snapshot.params['id'];
    this.storicoService
      .getStoricoContratti(this.idAnagrafica, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          if ((resp as any).esito.code !== 200) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Caricamento del contratto non riuscito:',
                message: (resp as any).esito.target,
              },
            });
          } else {
            this.lista = resp['list'];
            this.pageData = this.getCurrentPageItems();
            this.currentPage = 1;
          }
        },
        (error: any) => {
          console.error(
            'Si e verificato un errore durante il caricamento dei dati del contratto:' +
              JSON.stringify(error)
          );
        }
      );
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
        this.userRoleNav = response.anagraficaDto.ruolo.nome;
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        this.idAnagraficaLoggata = response.anagraficaDto.anagrafica.id;
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
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
  }

  // getUserRole() {
  //   this.profileBoxService.getData().subscribe(
  //     (response: any) => {
  //       console.log('DATI GET USER ROLE:' + JSON.stringify(response));

  //     },
  //     (error: any) => {
  //       console.error(
  //         'Si è verificato il seguente errore durante il recupero del ruolo: ' +
  //         error
  //       );
  //       this.shouldReloadPage = true;
  //     }
  //   );
  // }

  generateMenuByUserRole() {
    this.menuService
      .generateMenuByUserRole(this.token, this.idUtente)
      .subscribe(
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
