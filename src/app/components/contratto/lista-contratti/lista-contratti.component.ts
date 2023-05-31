import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContrattoService } from '../contratto-service';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-lista-contratti',
  templateUrl: './lista-contratti.component.html',
  styleUrls: ['./lista-contratti.component.scss'],
})
export class ListaContrattiComponent {
  lista: any;
  token: any;

  constructor(
    private contrattoService: ContrattoService,
    private router: Router,
    private location: Location
  ) {}

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }
  ngOnInit(): void {
    this.contrattoService.list().subscribe((resp: any) => {
      this.lista = resp.contrattoList;
      console.log(resp);

      $(function () {
        $('#table').DataTable({
          autoWidth: false,
          responsive: true,
        });
      });
    });
  }
  delete(id: number) {
    this.contrattoService.delete(id).subscribe(
      () => {
        console.log('Contratto eliminato');
        this.reloadPage();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
