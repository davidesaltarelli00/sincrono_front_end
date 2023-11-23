import {
  ChangeDetectorRef,
  Component,
  ElementRef,
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
  ) {}

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
      console.log(this.idRichiesta);
      this.getRichiesta();
    }
  }

  getRichiesta() {
    this.richiesteService.getRichiesta(this.token, this.idRichiesta).subscribe(
      (result: any) => {
        this.data = result['richiestaDto']['list'];
        console.log(
          'Dati restituiti dalla richiesta: ' + JSON.stringify(this.data)
        );
      },
      (error: any) => {
        console.error('Errore durante il get: ' + JSON.stringify(error));
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
        console.log(JSON.stringify(response));
        this.userLoggedName = response.anagraficaDto.anagrafica.nome;
        this.userLoggedSurname = response.anagraficaDto.anagrafica.cognome;
        this.userLoggedFiscalCode =
          response.anagraficaDto.anagrafica.codiceFiscale;
        this.elencoCommesse = response.anagraficaDto.commesse;
        this.ruolo = response.anagraficaDto.ruolo.descrizione;
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
