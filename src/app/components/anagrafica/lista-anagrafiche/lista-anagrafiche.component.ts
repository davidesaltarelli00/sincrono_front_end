import { Component } from '@angular/core';
import { AnagraficaService } from '../anagrafica-service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-lista-anagrafiche',
  templateUrl: './lista-anagrafiche.component.html',
  styleUrls: ['./lista-anagrafiche.component.scss']
})
export class ListaAnagraficheComponent {

  lista:any ;
  token:any;

  constructor(private anagraficaService: AnagraficaService,private router:Router) { }

  ngOnInit(): void {

    this.anagraficaService.list().subscribe((resp:any)=>{
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
