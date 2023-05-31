import { OrganicoService } from '../organico-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Component,OnInit } from '@angular/core';



declare var $:any;

@Component({
  selector: 'app-lista-organico',
  templateUrl: './lista-organico.component.html',
  styleUrls: ['./lista-organico.component.scss']
})

export class ListaOrganicoComponent {

  lista:any ;
  token:any;

  constructor(private organicoService: OrganicoService,private router:Router) { }

  ngOnInit(): void {

    this.organicoService.listaOrganico().subscribe((resp:any)=>{
      this.lista = resp.list;
      console.log(resp);

      $(function() {
        $('#table').DataTable({
            "autoWidth": false,
            "responsive": true,
        });
    });
    });
 
  }
}