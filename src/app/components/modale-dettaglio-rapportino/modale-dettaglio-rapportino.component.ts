import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RapportinoService } from '../utente/rapportino.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-modale-dettaglio-rapportino',
  templateUrl: './modale-dettaglio-rapportino.component.html',
  styleUrls: ['./modale-dettaglio-rapportino.component.scss'],
})
export class ModaleDettaglioRapportinoComponent implements OnInit {
  id: any = this.activatedRoute.snapshot.params['id'];
  codiceFiscale: any = this.activatedRoute.snapshot.params['codiceFiscale'];
  mese: any = this.activatedRoute.snapshot.params['mese'];
  anno: any = this.activatedRoute.snapshot.params['anno'];
  token = localStorage.getItem('token');
  rapportinoDto: any;
  note: any;
  giorniUtili: any;
  giorniLavorati: any;
  @ViewChild('editableTable') editableTable!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rapportinoService: RapportinoService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log(
      'OGGETTI PER PAYLOAD IN DETTAGLIO:' + this.id,
      this.codiceFiscale,
      this.mese + this.anno
    );

    let body = {
      rapportinoDto: {
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: this.anno,
        meseRequest: this.mese,
      },
    };
    console.log('BODY PER GET RAPPORTINO:' + JSON.stringify(body));
    this.rapportinoService.getRapportino(this.token, body).subscribe(
      (result: any) => {
        this.rapportinoDto = result['rapportinoDto']['mese']['giorni'];
        this.note = result['rapportinoDto']['note'];
        this.giorniUtili = result['rapportinoDto']['giorniUtili'];
        this.giorniLavorati = result['rapportinoDto']['giorniLavorati'];

        console.log(
          'RAPPORTINODTO DETTAGLIO:' + JSON.stringify(this.rapportinoDto)
        );
      },
      (error: any) => {
        console.error('ERRORE:' + JSON.stringify(error));
      }
    );
  }

  resetNote() {
    this.note = null;
  }

  aggiungiNote() {
    let body = {
      rapportinoDto: {
        note: this.note,
        anagrafica: {
          codiceFiscale: this.codiceFiscale,
        },
        annoRequest: this.anno,
        meseRequest: this.mese,
      },
    };
    console.log('BODY AGGIUNGI NOTE:' + JSON.stringify(body));

    this.rapportinoService.aggiungiNote(this.token, body).subscribe(
      (result: any) => {
        if (
          (result as any).esito.code !== 200 &&
          (result as any).esito.target === 'HTTP error code: 400'
        ) {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              Image: '../../../../assets/images/logo.jpeg',
              title: 'Salvataggio delle note non riuscito:',
              message: 'Errore di validazione.', //(result as any).esito.target,
            },
          });
          console.error(result);
        } else {
          console.log('RESULT AGGIUNGI NOTE:' + JSON.stringify(result));
        }
      },
      (error: any) => {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            Image: '../../../../assets/images/logo.jpeg',
            title: 'Salvataggio delle note non riuscito:',
            message: JSON.stringify(error),
          },
        });
      }
    );
  }
}
