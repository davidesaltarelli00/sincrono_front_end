import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StoricoService } from '../storico-service';
import { ActivatedRoute} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-storico-contratti',
  templateUrl: './storico-contratti.component.html',
  styleUrls: ['./storico-contratti.component.scss']
})



export class StoricoContrattiComponent implements OnInit  {

  
  lista: any;

  constructor(
    private storicoService: StoricoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

    var idAnagrafica = this.activatedRoute.snapshot.params['id'];

    this.storicoService.getStoricoContratti(idAnagrafica).subscribe((resp: any) => {
      this.lista = resp.list;

      console.log("lista contratti:"+this.lista);

      $(function () {
        $('#table').DataTable({
          autoWidth: false,
          responsive: true,
        });
      });
    });
  }

  


}
