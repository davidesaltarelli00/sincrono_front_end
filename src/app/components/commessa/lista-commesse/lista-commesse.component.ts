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
  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric'
    });
  }
}
