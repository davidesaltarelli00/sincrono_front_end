import { Component, OnInit } from '@angular/core';
import { AlertLogoutComponent } from '../../alert-logout/alert-logout.component';
import { AuthService } from '../../login/login-service';
import { ProfileBoxService } from '../../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/theme.service';
import { ImageService } from '../../image.service';
import { MenuService } from '../../menu.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { RichiesteService } from '../richieste.service';

@Component({
  selector: 'app-insert-permesso',
  templateUrl: './insert-permesso.component.html',
  styleUrls: ['./insert-permesso.component.scss'],
})
export class InsertPermessoComponent implements OnInit {
  permessoGiorno: any;
  permessoMese: any;
  permessoAnno: any;
  codiceFiscale: any;

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
  mobile = false;
  idUtente: any;
  mesi: string[] = [
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
  daOra: string = '';
  aOra: string = '';

  arrayDaOra = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
  arrayAOra = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];


  constructor(
    private profileBoxService: ProfileBoxService,
    private dialog: MatDialog,
    private router: Router,
    private richiesteService: RichiesteService,
    public themeService: ThemeService,
    private imageService: ImageService,
    private menuService: MenuService
  ) {
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
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Attenzione:',
          message: 'Errore di autenticazione; effettua il login.',
        },
      });
    }
  }
  getMonthName(monthNumber: number): string {
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
    return monthNames[monthNumber - 1];
  }

  onChangeMese(event: any) {
    const target = event.target.value;
    this.permessoMese = target;
    console.log('Hai selezionato ' + this.permessoMese);
  }

  insertPermesso(insertPermeission:any) {
    console.log("Valore form:", JSON.stringify(insertPermeission));
    if(insertPermeission.valid){
      let body = {
        richiestaDto: {
          anno: this.permessoAnno,
          mese: this.permessoMese,
          codiceFiscale: this.codiceFiscale,
          list: [
            {
              permessi: true,
              ferie: null,
              daOra: this.daOra,
              aOra: this.aOra,
              nGiorno: this.permessoGiorno,
            },
          ],
        },
      };
      console.log('PAYLOAD INVIO PERMESSO: ' + JSON.stringify(body));
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
                title: 'Richiesta inviata',
                // message: "Troverai l'elenco delle tue richieste nel tuo profilo.",
              },
            });
          }
        });
    } else{
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          image: '../../../../assets/images/danger.png',
          title: 'Attenzione',
          message: "Qualcosa é andato storto.",
        },
      });
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
