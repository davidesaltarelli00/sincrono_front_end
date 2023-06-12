import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { Router } from '@angular/router';

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
  selector: 'app-nuova-anagrafica-dto',
  templateUrl: './nuova-anagrafica-dto.component.html',
  styleUrls: ['./nuova-anagrafica-dto.component.scss'],
})
export class NuovaAnagraficaDtoComponent implements OnInit {
  data: any = [];
  utenti: any = [];

  submitted = false;
  errore = false;
  messaggio: any;
  showErrorPopup:any;
  showSuccessPopup:any;

  nuovaAnagrafica: FormGroup = new FormGroup({
    utente: new FormGroup({
      id: new FormControl(''),
    }),
    nome: new FormControl(''),
    cognome: new FormControl(''),
    dataNascita: new FormControl(),
    comuneDiNascita: new FormControl(),
    attivo: new FormControl(''),
    codiceFiscale: new FormControl(''),
    azienda_tipo: new FormControl(''),
    residenza: new FormControl(''),
    domicilio: new FormControl(''),
    cellularePrivato: new FormControl(''),
    cellulareAziendale: new FormControl(''),
    mailPrivata: new FormControl(''),
    mailAziendale: new FormControl(''),
    mailPec: new FormControl(''),
    titoliDiStudio: new FormControl(''),
    altriTitoli: new FormControl(''),
    coniugato: new FormControl(''),
    figliACarico: new FormControl(''),
  });

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nuovaAnagrafica = this.formBuilder.group({
      utente: new FormGroup({
        id: new FormControl(this.data?.utente?.id),
      }),
      nome: new FormControl(this.data?.nome),
      cognome: new FormControl(this.data?.cognome),
      dataNascita: new FormControl(this.data?.dataNascita),
      comuneDiNascita: new FormControl(this.data?.comuneDiNascita),
      attivo: new FormControl(''),
      codiceFiscale: new FormControl(this.data?.codiceFiscale),
      aziendaTipo: new FormControl(this.data?.aziendaTipo),
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
      figliACarico: new FormControl(''),
    });
    this.caricaListaUtenti();
  }
  caricaListaUtenti() {
    this.anagraficaDtoService.getListaUtenti().subscribe((result: any) => {
      console.log(result);
      this.utenti = (result as any)['list'];
    });
  }
  inserisci() {
    this.submitted = true;
    if (this.nuovaAnagrafica.invalid) {
      return;
    }

    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === null) {
          delete obj[key];
        }
        if (obj.utente && Object.keys(obj.utente).length === 0) {
          delete obj.utente;
        }
      });
    };

    removeEmpty(this.nuovaAnagrafica.value);
    console.log(JSON.stringify(this.nuovaAnagrafica.value));
    const body = JSON.stringify({
      anagrafica: this.nuovaAnagrafica.value,
    });
    console.log(body);

    this.anagraficaDtoService.insert(body).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        this.showErrorPopup = true;
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }else{

        this.showSuccessPopup = true;
        
      }
      this.router.navigate(['../lista-anagrafica-dto']);
    });
  }

  chiudiPopup() {
    this.showErrorPopup = false;
    this.showSuccessPopup = false;
  }
}
