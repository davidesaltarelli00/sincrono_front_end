import { AnagraficaDtoService } from './../../anagraficaDto/anagraficaDto-service';
import { OrganicoService } from '../organico-service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-lista-organico',
  templateUrl: './lista-organico.component.html',
  styleUrls: ['./lista-organico.component.scss'],
})
export class ListaOrganicoComponent implements OnInit {
  lista: any;
  token: any;

  submitted = false;
  errore = false;
  messaggio: any;

  constructor(
    private organicoService: OrganicoService,
    private formBuilder: FormBuilder,
    private anagraficaDtoService: AnagraficaDtoService,
    private router: Router
  ) {}

  anagraficaDto: FormGroup = new FormGroup({
    contratto: new FormGroup({
      azienda: new FormGroup({
        descrizione: new FormControl(''),
      }),
      tipoContratto: new FormGroup({
        descrizione: new FormControl(''),
      }),
    }),
  });

  ngOnInit(): void {
    this.organicoService.listaOrganico().subscribe((resp: any) => {
      this.lista = resp.list;

      $(function () {
        $('#table').DataTable({
          autoWidth: false,
          responsive: true,
        });
      });
    });
  }

  filter(tipoContratto: string, tipoAzienda: string) {
    this.router.navigate(['/lista-anagrafica', { tipoContratto, tipoAzienda }]);
  }
}
