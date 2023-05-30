import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContrattoService } from '../contratto-service';

declare var $: any;

@Component({
  selector: 'app-lista-contratti',
  templateUrl: './lista-contratti.component.html',
  styleUrls: ['./lista-contratti.component.scss']
})
export class ListaContrattiComponent {

  lista:any ;
  token:any;

  constructor(private contrattoService: ContrattoService,private router:Router) { }

  ngOnInit(): void {

    this.contrattoService.list().subscribe((resp:any)=>{
      this.lista = resp.contrattoList;
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
