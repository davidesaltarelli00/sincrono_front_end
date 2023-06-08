import { Component } from '@angular/core';
import { AnagraficaService } from '../anagrafica-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-lista-anagrafiche',
  templateUrl: './lista-anagrafiche.component.html',
  styleUrls: ['./lista-anagrafiche.component.scss'],
})
export class ListaAnagraficheComponent {
  lista: any;
  token: any;
  errore = false;
  messaggio: any;

  constructor(
    private anagraficaService: AnagraficaService,
    private router: Router,
    private location: Location
  ) {}

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  ngOnInit(): void {

  this.listAnagraficaDto();
    /*this.anagraficaService.list().subscribe((resp: any) => {
      this.lista = resp.list;
      console.log(resp);

      $(function () {
        $('#table').DataTable({
          autoWidth: false,
          responsive: true,
        });
      });
    });*/
  }
  listAnagraficaDto() {
    const body = JSON.stringify({
      anagraficaDto:{} 
    });
    console.log("bodyAnagraficaDto:"+body);

    this.anagraficaService.listAnagraficaDTo(body).subscribe((result) => {
      console.log(result);
      if ((result as any).esito.code != 0) {
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }
    });

 /*delete(id: number) {
    this.anagraficaService.delete(id).subscribe(
      () => {
        console.log('Anagrafica eliminata');
        this.reloadPage();
      },
      (error) => {
        console.error(error);
      }
    );
  }*/
}

}
