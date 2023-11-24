import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/theme.service';
import { ImageService } from '../../image.service';
import { AuthService } from '../../login/login-service';
import { MenuService } from '../../menu.service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { RichiesteService } from '../richieste.service';

@Component({
  selector: 'app-selected-days',
  templateUrl: './selected-days.component.html',
  styleUrls: ['./selected-days.component.scss'],
})
export class SelectedDaysComponent implements OnInit {
  @Input() selectedDays: number[] = [];
  @Input() currentMonth: any;
  @Input() currentYear: any;
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
  codiceFiscale: any;
  idUtente: any;

  constructor(
    private authService: AuthService,
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    public themeService: ThemeService,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private menuService: MenuService,
    private richiesteService:RichiesteService
  ) {}

  ngOnInit(): void {
    if (this.token != null) {
      this.getUserLogged();
      this.getUserRole();
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Attenzione:',
          message: 'Errore di autenticazione; effettua il login.',
        },
      });
    }
  }

  getMonthName(month: number): string {
    const monthNames = [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre',
    ];
    return monthNames[month - 1];
  }

  inviaRichiestaFerie() {
    const giorniFerie = this.selectedDays.map((giorno: any) => {
      return {
        ferie: true,
        permessi: null,
        nGiorno: giorno,
      };
    });

    const body = {
      richiestaDto: {
        anno: this.currentYear,
        mese: this.currentMonth,
        codiceFiscale: this.codiceFiscale,
        list: giorniFerie,
      },
    };
    console.log('PAYLOAD INVIO RICHIESTA DI FERIE: ' + JSON.stringify(body));
    this.richiesteService
    .inviaRichiesta(this.token, body)
    .subscribe((result: any) => {
      if ((result as any).esito.code != 200) {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            image: '../../../../assets/images/logo.jpeg',
            title: 'Invio non riuscito:',
            message: (result as any).esito.target,
          },
        });
      }
      else{
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            image: '../../../../assets/images/logo.jpeg',
            title: 'Invio effettuato',
            // message: "Troverai l'elenco delle tue richieste nel tuo profilo.",
          },
        });
      }
    });
    /*
{

 "richiestaDto":{
     "anno":"2023",
     "mese":"12",
     "codiceFiscale":"pnnmra94E004y25",
     "list":[
         {
             "ferie":"true",

             "nGiorno":"17"
         }
         {
             "ferie":"true",

             "nGiorno":"17"
         }
     ]
 }
}
*/
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
        console.log('DATI GET USER ROLE:' + JSON.stringify(response));

        this.userRoleNav = response.anagraficaDto.ruolo.nome;
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        console.log('ID UTENTE PER NAV:' + this.idUtente);
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

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
