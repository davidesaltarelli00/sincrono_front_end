import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaService } from '../anagrafica-service';

@Component({
  selector: 'app-modifica-anagrafica',
  templateUrl: './modifica-anagrafica.component.html',
  styleUrls: ['./modifica-anagrafica.component.scss'],
})
export class ModificaAnagraficaComponent {
  data: any = [];
  oldData: any = [];

  submitted = false;
  errore = false;
  messaggio: any;

  modificaAnagrafica: FormGroup = new FormGroup({
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
    figliaCario: new FormControl(''),
  });

  constructor(
    private anagraficaService: AnagraficaService,
    private router: ActivatedRoute,
    private router2: Router,

    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.anagraficaService
      .detail(this.router.snapshot.params['id'])
      .subscribe((resp: any) => {
        this.oldData = (resp as any)['anagrafica'];
        console.log(this.oldData);
      });
    this.modificaAnagrafica = this.formBuilder.group({
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
      figliaCario: new FormControl(''),
      comuneDiNascita: new FormControl(this.data?.comuneDiNascita),
      aziendaTipo: new FormControl(this.data?.aziendaTipo),
    });
  }

  Aggiorna() {
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

    removeEmpty(this.modificaAnagrafica.value);
    console.log(JSON.stringify(this.modificaAnagrafica.value));
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
      this.router2.navigate(['../lista-anagrafiche']);
    });
  }
}
