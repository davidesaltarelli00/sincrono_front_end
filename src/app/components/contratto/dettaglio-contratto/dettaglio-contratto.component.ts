import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ContrattoService } from '../contratto-service';
import { Component, HostListener, OnInit } from '@angular/core';
import { AnagraficaDtoService } from '../../anagraficaDto/anagraficaDto-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../login/login-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from 'src/app/theme.service';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { ImageService } from '../../image.service';
import { MenuService } from '../../menu.service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';

@Component({
  selector: 'app-dettaglio-contartto',
  templateUrl: './dettaglio-contratto.component.html',
  styleUrls: [],
})
export class DettaglioContrattoComponent implements OnInit {
  id: any = this.activatedRoute.snapshot.params['id'];
  data: any;
  codiceFiscaleDettaglio: any;
  elencoCommesse: any;
  isHamburgerMenuOpen: boolean = false;
  selectedMenuItem: string | undefined;
  windowWidth: any;
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
  immagine: any;
  immagineConvertita: string | null = null;
  immaginePredefinita: string | null = null;
  idAnagraficaLoggata: any;
  disabilitaImmagine: any;
  salvaImmagine: boolean = false;
  immagineCancellata: boolean = false;
  idUtente: any;
  vediStoricoCommesse: boolean = false;
  ruolo: any;
  mobile = false;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private profileBoxService: ProfileBoxService,
    private menuService: MenuService,
    public themeService: ThemeService,
    private router:Router
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

  ngOnInit(): void {
    if (this.token != null) {
      this.anagraficaDtoService
        .detailAnagraficaDto(this.id, this.token)
        .subscribe((resp: any) => {
          this.data = (resp as any)['anagraficaDto'];
          this.codiceFiscaleDettaglio = (resp as any)['anagraficaDto'][
            'anagrafica'
          ]['codiceFiscale'];
          this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
          console.log(JSON.stringify(this.data));
        });
      this.getUserLogged();
      this.getUserRole();
    } else {
      console.error('Errore di autenticazione: esegui il login');
    }
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
        this.idAnagraficaLoggata = response.anagraficaDto.anagrafica.id;
        this.ruolo = response.anagraficaDto.ruolo.nome;
        // console.log('ID ANAGRAFICA LOGGATA:' + this.idAnagraficaLoggata);
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
        // console.log('DATI GET USER ROLE:' + JSON.stringify(response));
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        // console.log('ID UTENTE PER NAV:' + this.idUtente);
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
