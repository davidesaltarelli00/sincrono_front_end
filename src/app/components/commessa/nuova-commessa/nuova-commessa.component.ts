import { DettaglioAnagraficaComponent } from './../../anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';
import { Component, OnInit } from '@angular/core';
import { CommessaService } from '../commessa-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-nuova-commessa',
  templateUrl: './nuova-commessa.component.html',
  styleUrls: ['./nuova-commessa.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class NuovaCommessaComponent implements OnInit {
  data: any;
  submitted = false;

  errore = false;
  messaggio: any;

  form: FormGroup = new FormGroup({
    cliente: new FormControl(''),
    clienteFinale: new FormControl(''),
    titoloPosizione: new FormControl(''),
    distacco: new FormControl(''),
    dataInizio: new FormControl(''),
    dataFine: new FormControl(''),
    costoMese: new FormControl(''),
    tariffaGiornaliera: new FormControl(''),
    nominativo: new FormControl(''),
    azienda: new FormControl(''),
    aziendaDiFatturazioneFnterna: new FormControl(''),
    stato: new FormControl(''),
    attesaLavori: new FormControl(''),
  });

  constructor(
    private commessaService: CommessaService,
    private formBuilder: FormBuilder,
    private router2: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cliente: new FormControl(this.data?.cliente),
      clienteFinale: new FormControl(this.data?.clienteFinale),
      titoloPosizione: new FormControl(this.data?.titoloPosizione),
      distacco: new FormControl(this.data?.distacco),
      dataInizio: new FormControl(this.data?.dataInizio),
      dataFine: new FormControl(this.data?.dataFine),
      costoMese: new FormControl(this.data?.costoMese),
      tariffaGiornaliera: new FormControl(this.data?.tariffaGiornaliera),
      nominativo: new FormControl(this.data?.nominativo),
      azienda: new FormControl(this.data?.azienda),
      aziendaDiFatturazioneInterna: new FormControl(
        this.data?.aziendaDiFatturazioneFnterna
      ),
      stato: new FormControl(this.data?.stato),
      attesaLavori: new FormControl(this.data?.attesaLavori),
    });
  }
  inserisci() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          // recursive
          removeEmpty(obj[key]);
        } else if (obj[key] === null) {
          delete obj[key];
        }
      });
    };

    removeEmpty(this.form.value);
    console.log(JSON.stringify(this.form.value));
    const body = JSON.stringify({ commessa: this.form.value });
    console.log(body);
    this.commessaService.insert(body).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }
      this.router2.navigate(['../lista-commesse']);
    });
  }
}
