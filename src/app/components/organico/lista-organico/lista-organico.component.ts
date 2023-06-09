import { AnagraficaService } from './../../anagrafica/anagrafica-service';
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
    private anagraficaService: AnagraficaService,
    private router: Router
  ) {}

  anagraficaDto: FormGroup = new FormGroup({
    azienda: new FormGroup({
      descrizione: new FormControl(''),
    }),
    tipoContratto: new FormGroup({
      descrizione: new FormControl(''),
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

  
  filter(tipoContratto: any, azienda: any) {
    console.log(JSON.stringify(tipoContratto, azienda));
    this.anagraficaDto = this.formBuilder.group({
      tipoContratto: new FormGroup({
        descrizione: new FormControl(tipoContratto),
      }),
      azienda: new FormGroup({
        descrizione: new FormControl(azienda),
      }),
    });
    const body = JSON.stringify({
      anagraficaDto: this.anagraficaDto.value,
    });
    console.log(body);
    this.anagraficaService.filter(body).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }
      //this.router.navigate(['../lista-anagrafiche']);
      console.log(result);
    });
  }
}
