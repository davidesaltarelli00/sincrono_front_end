import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaService } from '../anagrafica-service';
import { HttpClient } from '@angular/common/http';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/GG',
  },
  display: {
    dateInput: 'YYYY/MM/GG',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-nuova-anagrafica',
  templateUrl: './nuova-anagrafica.component.html',
  styleUrls: ['./nuova-anagrafica.component.scss'],
  
 
})
export class NuovaAnagraficaComponent implements OnInit {
  data: any = [];

  submitted = false;
  errore = false;
  messaggio: any;

  nuova: FormGroup = new FormGroup({
    nome: new FormControl(''),
    cognome: new FormControl(''),
    dataNascita: new FormControl(),
    comuneDiNascita: new FormControl(),
    attivo: new FormControl(''),
    codiceFiscale: new FormControl(''),
    azienda_tipo: new FormControl(''),
    residenza: new FormControl(''),
    Domicilio: new FormControl(''),
    cellularePrivato: new FormControl(''),
    cellulareAziendale: new FormControl(''),
    mailPrivata: new FormControl(''),
    mailAziendale: new FormControl(''),
    mailPec: new FormControl(''),
    titoliDiStudio: new FormControl(''),
    altriTitoli: new FormControl(''),
    coniugato: new FormControl(''),
    figliCarico: new FormControl(''),
  });

  constructor(
    private anagraficaService: AnagraficaService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router2: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.nuova = this.formBuilder.group({
      attivo: new FormControl(''),
      nome: new FormControl(this.data?.nome),
      cognome: new FormControl(this.data?.cognome),
      dataNascita: new FormControl(this.data?.dataNascita),
      codiceFiscale: new FormControl(this.data?.codiceFiscale),
      residenza: new FormControl(this.data?.residenza),
      domicilio: new FormControl(this.data?.domicilio),
      cellularePrivato: new FormControl(this.data?.cellularePrivato),
      cellulareAziendale: new FormControl(this.data?.cellulareAziendale),
      mailPrivata: new FormControl(this.data?.mailPrivata),
      mailAziendale: new FormControl(this.data?.mailAziendale),
      mailPec: new FormControl(this.data?.mailPec),
      titoliDiStudio: new FormControl(this.data?.titoliDiStudio),
      altriTitoli: new FormControl(this.data?.altriTitoli),
      coniugato: new FormControl(''),
      figliCarico: new FormControl(''),
      comuneDiNascita: new FormControl(this.data?.comuneDiNascita),
      aziendaTipo: new FormControl(this.data?.aziendaTipo),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.nuova.controls;
  }

  inserisci() {
    this.submitted = true;
    if (this.nuova.invalid) {
      return;
    }

    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === null) {
          delete obj[key];
        }
      });
    };

    removeEmpty(this.nuova.value);
    console.log(JSON.stringify(this.nuova.value));
    const body = JSON.stringify({
      anagrafica: this.nuova.value,
    });
    console.log(body);

    this.anagraficaService.insert(body).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }
    });
  }
}
