import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { profileBoxService } from '../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss'],
})
export class UtenteComponent implements OnInit {
  codiceFiscale = this.activatedRoute.snapshot.params['codiceFiscale'];
  data: any[] = [];
  userLogged: any;
  messaggio = '';
  codFiscale: any; //variabile di confronto per il codice fiscale che sará sulla rotta

  constructor(
    private activatedRoute: ActivatedRoute,
    private profileBoxService: profileBoxService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.codiceFiscale);

    this.profileBoxService.getData().subscribe((res: any) => {
      this.userLogged = res;
      this.codFiscale = res.anagraficaDto.anagrafica.codiceFiscale;
      console.log('CODICE FISCALE DI CONFRONTO:' + this.codFiscale);
      console.log(this.userLogged);
    });

    this.profileBoxService
      .getRapportino(localStorage.getItem('token'), this.codiceFiscale)
      .subscribe(
        (result: any) => {
          this.data = result;
          console.log('DATA: ' + JSON.stringify(this.data));
        },
        (error: any) => {
          console.error(
            'ERRORE DURANTE IL CARICAMENTO DEL RAPPORTINO:' + error
          );
        }
      );
  }
}
