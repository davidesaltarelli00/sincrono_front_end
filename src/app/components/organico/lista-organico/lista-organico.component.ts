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
      console.log(resp);

      $(function () {
        $('#table').DataTable({
          autoWidth: false,
          responsive: true,
        });
      });
    });
  }

  filter(tipoContratto: any, tipoAzienda: any) {
    this.anagraficaDto = this.formBuilder.group({
      contratto: new FormGroup({
        tipoContratto: new FormGroup({
          descrizione: new FormControl(tipoContratto),
        }),
        tipoAzienda: new FormGroup({
          descrizione: new FormControl(tipoAzienda),
        }),
      }),
    });
    const body = JSON.stringify({
      anagraficaDto: this.anagraficaDto.value,
    });
    console.log(body);
    this.anagraficaDtoService.filter(body).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }
      this.router.navigate(['/lista-anagrafica', { body }]);
      console.log(result);
    });
  }
}
