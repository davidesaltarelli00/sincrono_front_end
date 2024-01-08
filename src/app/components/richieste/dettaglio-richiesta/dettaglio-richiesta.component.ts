import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from 'src/app/theme.service';
import { AnagraficaDtoService } from '../../anagraficaDto/anagraficaDto-service';
import { ImageService } from '../../image.service';
import { AuthService } from '../../login/login-service';
import { MenuService } from '../../menu.service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { RichiesteService } from '../richieste.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-dettaglio-richiesta',
  templateUrl: './dettaglio-richiesta.component.html',
  styleUrls: ['./dettaglio-richiesta.component.scss'],
})
export class DettaglioRichiestaComponent implements OnInit {
  idRichiesta = this.activatedRoute.snapshot.params['id'];

  id: any;
  mobile: any = false;
  userLoggedName: any;
  userLoggedSurname: any;
  shouldReloadPage: any;
  idFunzione: any;
  jsonData: any;
  token = localStorage.getItem('token');
  userRoleNav: any;
  idNav: any;
  tokenProvvisorio: any;
  data: any;
  userLoggedFiscalCode: any;
  elencoCommesse: any[] = [];
  idUtente: any;
  ruolo: any;
  tipoRichiesta: any;
  note: any;
  compilaNote = false;
  windowWidth: any;
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  idAnagraficaLoggata: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public themeService: ThemeService,
    private imageService: ImageService,
    private menuService: MenuService,
    private anagraficaDtoService: AnagraficaDtoService,
    private cdRef: ChangeDetectorRef,
    private richiesteService: RichiesteService
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
      // this.getUserRole();
      console.log(this.idRichiesta);
      this.getRichiesta();
    }
  }

  vaiAlRapportino() {
    this.router.navigate(['/utente/' + this.idAnagraficaLoggata]);
  }

  getRichiesta() {
    this.richiesteService.getRichiesta(this.token, this.idRichiesta).subscribe(
      (result: any) => {
        this.data = result['richiestaDto'];
        this.note = result['richiestaDto']['note'];
        console.log(
          'Dati restituiti dalla richiesta: ' + JSON.stringify(this.data)
        );
      },
      (error: any) => {
        console.error('Errore durante il get: ' + JSON.stringify(error));
      }
    );
  }

  getTitle(): string {
    if (this.data.list.some((item: any) => item.ferie)) {
      this.tipoRichiesta = 'ferie';
      return 'Ferie per i seguenti giorni:';
    } else if (this.data.list.some((item: any) => item.permessi)) {
      this.tipoRichiesta = 'permessi';
      return 'Ore di permesso ';
    } else {
      this.tipoRichiesta = '';
      return 'Nessuna tipologia specificata';
    }
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

  /*
  {
 "richiestaDto":{
     "id": 8,
     "anno":"2023",
     "mese":"12",
     "codiceFiscale":"pnnmra94E004y25",
    "stato":"true"
 }

}

  */

  accetta(): void {
    let body = {
      richiestaDto: {
        id: this.data.id,
        anno: this.data.anno,
        mese: this.data.mese,
        codiceFiscale: this.data.codiceFiscale,
        note: this.note,
        stato: true,
      },
    };
    console.log('DATI PER ACCETTAZIONE FERIE: ' + JSON.stringify(body));
    this.richiesteService.cambiaStato(this.token, body).subscribe(
      (result: any) => {
        if ((result as any).esito.code != 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Attenzione, qualcosa é andato storto:',
              message: (result as any).esito.target,
            },
          });
        } else {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/logo.jpeg',
              title: 'Richiesta accettata.',
              message: (result as any).esito.target,
            },
          });
          this.router.navigate(['/home']);
        }
      },
      (error: any) => {
        console.error(
          'Errore durante il cambio dello stato della richiesta:' +
            JSON.stringify(error)
        );
      }
    );
  }

  rifiutaECompilaNote(): void {
    this.compilaNote = !this.compilaNote;
  }

  getNomeMese(numeroMese: number): string {
    const nomiMesi = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    return nomiMesi[numeroMese - 1];
  }

  inviaNoteEConfermaRifiuto() {
    let body = {
      richiestaDto: {
        id: this.data.id,
        anno: this.data.anno,
        mese: this.data.mese,
        codiceFiscale: this.data.codiceFiscale,
        note: this.note,
        stato: false,
      },
    };
    console.log('DATI PER ACCETTAZIONE FERIE: ' + JSON.stringify(body));
    this.richiesteService.cambiaStato(this.token, body).subscribe(
      (result: any) => {
        if ((result as any).esito.code != 200) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/danger.png',
              title: 'Attenzione, qualcosa é andato storto:',
              message: (result as any).esito.target,
            },
          });
        } else {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/logo.jpeg',
              title: 'Richiesta rifiutata.',
              message: (result as any).esito.target,
            },
          });
          this.router.navigate(['/home']);
        }
      },
      (error: any) => {
        console.error(
          'Errore durante il cambio dello stato della richiesta:' +
            JSON.stringify(error)
        );
      }
    );
  }

  logout() {
    this.dialog.open(AlertLogoutComponent);
  }

  getUserLogged() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        localStorage.getItem('token');
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.userLoggedFiscalCode =response.anagraficaDto.anagrafica.codiceFiscale;
        this.ruolo = response.anagraficaDto.ruolo.descrizione;
        this.idAnagraficaLoggata = response.anagraficaDto.anagrafica.id;
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
        this.authService.logout();
      }
    );
  }

  getUserRole() {
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));
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
    this.menuService
      .generateMenuByUserRole(this.token, this.idUtente)
      .subscribe(
        (data: any) => {
          this.jsonData = data;
          this.idFunzione = data.list[0].id;
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
      (data: any) => {},
      (error: any) => {
        console.error('Errore nella generazione dei permessi:', error);
      }
    );
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
