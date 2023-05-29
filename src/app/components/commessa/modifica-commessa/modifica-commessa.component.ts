import { CommessaService } from './../commessa-service.component';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-modifica-commessa',
  templateUrl: './modifica-commessa.component.html',
  styleUrls: ['./modifica-commessa.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class ModificaCommessaComponent implements OnInit {
  id: any = this.router.snapshot.params['id'];
  data: any = [];
  data2: any = [];
  submitted = false;
  errore = false;
  messaggio: any;

  modificaCommessa = new FormGroup({
    id: new FormControl(''),
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
    aziendaDiFatturazioneInterna: new FormControl(''),
    stato: new FormControl(''),
    attesaLavori: new FormControl(''),
  });

  constructor(
    private commessaService: CommessaService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router2: Router
  ) { }

  ngOnInit(): void {
    this.commessaService.detail(this.router.snapshot.params['id']).subscribe((resp: any) => {
      this.data2 = (resp as any)['commessa'];
      console.log(this.data2);
      
    });

    this.modificaCommessa = this.formBuilder.group({
      id: new FormControl(this.router.snapshot.params['id']),
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
      aziendaDiFatturazioneInterna: new FormControl(this.data?.aziendaDiFatturazioneInterna),
      stato: new FormControl(""),
      attesaLavori: new FormControl(this.data?.attesaLavori),
    });
  }

 

  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric'
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.modificaCommessa.controls;
  }

  inserisci() {
    console.log(JSON.stringify(this.modificaCommessa.value));
    const body = JSON.stringify({ "commessa": this.modificaCommessa.value });
    console.log(body);

    this.commessaService.update(body).subscribe((result) => {
      console.log(result);
    });
  }
}
