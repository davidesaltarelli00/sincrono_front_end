import { OrganicoService } from '../organico-service';
import { Router } from '@angular/router';
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
    private router: Router
  ) {}

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

  filter(tipoContratto: any, tipoAzienda: any) {
    this.router.navigate(['/lista-anagrafica', { tipoContratto, tipoAzienda }]);
  }
}
