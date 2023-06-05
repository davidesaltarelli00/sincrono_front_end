import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaService } from '../anagrafica-service';

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
  selector: 'app-modifica-anagrafica',
  templateUrl: './modifica-anagrafica.component.html',
  styleUrls: ['./modifica-anagrafica.component.scss'],
})
export class ModificaAnagraficaComponent implements OnInit {
  utenti: any = [];
  data: any = [];
  id = this.activatedRouter.snapshot.params['id'];
  submitted = false;
  errore = false;
  messaggio: any;

  modificaAnagrafica: FormGroup = new FormGroup({
    id: new FormControl(''),
    utente: new FormGroup({
      id: new FormControl(''),
    }),
    nome: new FormControl(''),
    cognome: new FormControl(''),
    dataDiNascita: new FormControl(),
    comuneDiNascita: new FormControl(),
    attivo: new FormControl(''),
    codiceFiscale: new FormControl(''),
    aziendaTipo: new FormControl(''),
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
    private anagraficaService: AnagraficaService,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.anagraficaService.detail(this.id).subscribe((resp: any) => {
      this.data = (resp as any)['anagrafica'];
      console.log(this.data);

      this.modificaAnagrafica = this.formBuilder.group({
        id: new FormControl(this.id),
        utente: new FormGroup({
          id: new FormControl(this.data?.utente?.id),
        }),
        nome: new FormControl(this.data?.nome),
        cognome: new FormControl(this.data?.cognome),
        dataDiNascita: new FormControl(this.data?.dataDiNascita),
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
      this.modificaAnagrafica.patchValue(this.data);
    });
  }
  caricaListaUtenti() {
    this.anagraficaService.getListaUtenti().subscribe((result: any) => {
      console.log(result);
      this.utenti = (result as any)['list'];
    });
  }
  aggiorna() {
    const body = JSON.stringify({
      anagrafica: this.modificaAnagrafica.value,
    });
    console.log(body);

    this.anagraficaService.update(body).subscribe((result) => {
      console.log(result);
      if ((result as any).esito.code != 0) {
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }
    });
    this.router.navigate(['../../dettaglio-anagrafica']);
  }

  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
  }
}
