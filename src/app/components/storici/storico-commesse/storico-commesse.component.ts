import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoricoService } from '../storico-service';

declare var $: any;

@Component({
  selector: 'app-storico-commesse',
  templateUrl: './storico-commesse.component.html',
  styleUrls: ['./storico-commesse.component.scss']
})

export class StoricoCommesseComponent implements OnInit{
  lista: any;
  token: any;
  errore = false;
  messaggio: any;
  id = this.activatedRouter.snapshot.params['id'];
  constructor(private router: Router , private activatedRouter: ActivatedRoute, private storicoService:StoricoService ){}


ngOnInit(): void {
  var idAnagrafica = this.activatedRouter.snapshot.params['id'];
  this.storicoService.getStoricoCommesse(idAnagrafica).subscribe((resp: any) => {
    this.lista = resp.list;

    $(function () {
      $('#table').DataTable({
        autoWidth: false,
        responsive: true,
      });
    });
  });
}
getStoricoCommesse(idAnagrafica :number):any{
  this.router.navigate (['/storico-commesse',idAnagrafica]);
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



