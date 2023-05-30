import { Component } from '@angular/core';
import { CommessaService } from '../commessa-service.component';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-lista-commesse',
  templateUrl: './lista-commesse.component.html',
  styleUrls: ['./lista-commesse.component.scss']
})

export class ListaCommesseComponent {

  lista:any ;
  token:any;

  constructor(private commessaService: CommessaService,private router:Router) { }

  ngOnInit(): void {

    this.commessaService.list().subscribe((resp:any)=>{
      this.lista = resp.commesseList;
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
