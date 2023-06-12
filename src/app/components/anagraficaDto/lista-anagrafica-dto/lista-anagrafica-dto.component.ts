import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-lista-anagrafica-dto',
  templateUrl: './lista-anagrafica-dto.component.html',
  styleUrls: ['./lista-anagrafica-dto.component.scss'],
})
export class ListaAnagraficaDtoComponent implements OnInit {
  lista: any;
  token: any;
  errore = false;
  messaggio: any;

  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      nome: new FormControl(''),
      cognome: new FormControl(''),
      attivo: new FormControl(''),
      aziendaTipo: new FormControl(''),
    }),
    contratto: new FormGroup({
      ralAnnua: new FormControl(''),
      dataAssunzione: new FormControl(''),
      dataFineRapporto: new FormControl(''),
      livelloContratto: new FormGroup({
        descrizione: new FormControl(''),
      }),
      ContrattoNazionale: new FormGroup({
        descrizione: new FormControl(''),
      }),
      TipoContratto: new FormGroup({
        descrizione: new FormControl(''),
      }),
      tipoAzienda: new FormGroup({
        descrizione: new FormControl(''),
      }),
    }),
    commessa: new FormGroup({
      cliente: new FormControl(''),
      azienda: new FormControl(''),
      nominativo: new FormControl(''),
    }),
  });

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private location: Location
  ) {}

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  ngOnInit(): void {
    console.log(JSON.stringify(this.filterAnagraficaDto.value));
    const body = JSON.stringify({
      anagrafica: this.filterAnagraficaDto.value,
    });
    console.log(body);
    this.anagraficaDtoService.listAnagraficaDto(body).subscribe((resp: any) => {
      this.lista = resp.list;
      console.log(resp);

      $(function () {
        $('#table').DataTable({
          autoWidth: false,
          responsive: true,
        });
      });
    });

    this.filterAnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        nome: new FormControl(''),
        cognome: new FormControl(''),
        attivo: new FormControl(''),
        aziendaTipo: new FormControl(''),
      }),
      contratto: new FormGroup({
        ralAnnua: new FormControl(''),
        dataAssunzione: new FormControl(''),
        dataFineRapporto: new FormControl(''),
        livelloContratto: new FormGroup({
          descrizione: new FormControl(''),
        }),
        ContrattoNazionale: new FormGroup({
          descrizione: new FormControl(''),
        }),
        TipoContratto: new FormGroup({
          descrizione: new FormControl(''),
        }),
        tipoAzienda: new FormGroup({
          descrizione: new FormControl(''),
        }),
      }),
      commessa: new FormGroup({
        cliente: new FormControl(''),
        azienda: new FormControl(''),
        nominativo: new FormControl(''),
      }),
    });
  }

  filter() {}

  delete(id: number) {
    this.anagraficaDtoService.delete(id).subscribe(
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
