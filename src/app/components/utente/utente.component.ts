import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { profileBoxService } from '../profile-box/profile-box.service';
import { MatDialog } from '@angular/material/dialog';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss'],
})
export class UtenteComponent implements OnInit {
  codiceFiscale = '';
  data: any[] = [];
  user: any;
  messaggio = '';
  id = this.activatedRoute.snapshot.params['id'];
  elencoCommesse: any;
  contratto:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileBoxService: profileBoxService,
    private dialog: MatDialog,
    private router: Router,
    private anagraficaDtoService: AnagraficaDtoService
  ) {}

  ngOnInit(): void {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.user = (resp as any)['anagraficaDto'];
          console.log(this.user);
          this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
          this.contratto = (resp as any)['anagraficaDto']['contratto'];
          this.codiceFiscale = (resp as any)['anagraficaDto']['anagrafica'][
            'codiceFiscale'
          ];
          console.log("CODICE FISCALE:"+this.codiceFiscale);
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
        },
        (error: any) => {
          console.error('ERRORE:' + JSON.stringify(error));
        }
      );
  }


  inviaRapportino() {
    const celleModificate = document.querySelectorAll('td[contenteditable="true"]');

    celleModificate.forEach((cella) => {
      const testoCella = cella.textContent;
      console.log(testoCella);
    });
  }

}

/*
{
    "esito": {
        "code": 200,
        "target": null,
        "args": null
    },
    "rapportinoDto": {
        "mese": {
            "mese": [
                {
                    "giorno": 2,
                    "cliente": "accenture",
                    "oreOrdinarie": 8.0
                },
                {
                    "giorno": 3,
                    "cliente": "accenture",
                    "oreOrdinarie": 8.0
                },
                {
                    "giorno": 4,
                    "cliente": "accenture",
                    "oreOrdinarie": 8.0
                }
            ]
        },
        "anagrafica": null
    }
}
*/
