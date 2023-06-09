import { Component } from '@angular/core';
import { AnagraficaService } from '../anagrafica-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-lista-anagrafiche',
  templateUrl: './lista-anagrafiche.component.html',
  styleUrls: ['./lista-anagrafiche.component.scss'],
})
export class ListaAnagraficheComponent {
  lista: any;
  token: any;
  errore = false;
  messaggio: any;

  filterAnagraficaDto: FormGroup = new FormGroup({
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
    private router: Router,
    private formBuilder: FormBuilder,
    private location: Location
  ) {}

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  ngOnInit(): void {

    this.filterAnagraficaDto = this.formBuilder.group({
    
      anagrafica: new FormGroup({
      nome: new FormControl(''),
      cognome: new FormControl(''),
      attivo: new FormControl(''),
      aziendaTipo: new FormControl('')
    }),
    contratto: new FormGroup({
      ralAnnua: new FormControl(''),
      dataAssunzione: new FormControl(''),
      dataFineRapporto: new FormControl(''),
      livelloContratto: new FormGroup({
        descrizione: new FormControl('')
      }),
      ContrattoNazionale: new FormGroup({
        descrizione: new FormControl('')
      }),
      TipoContratto: new FormGroup({
        descrizione: new FormControl('')
      }),
      tipoAzienda: new FormGroup({
        descrizione: new FormControl('')
      }),
    }),
    commessa: new FormGroup({
      cliente: new FormControl(''),
      azienda: new FormControl(''),
      nominativo: new FormControl(''),
    }),
    });

 
    this.anagraficaService.listAnagraficaDto(JSON.stringify({anagraficaDto:{}})).subscribe((resp: any) => {
      this.lista = resp.list;
      console.log(resp);

      $(function () {
        $('#table').DataTable({
          autoWidth: false,
          responsive: true,
        });
      });
    });
  }
 
  filter(){


  }

 delete(id: number) {
    this.anagraficaService.delete(id).subscribe(
      () => {
        console.log('Anagrafica eliminata');
        this.reloadPage();
      },
      (error) => {
        console.error(error);
      }
    );
  }


}
