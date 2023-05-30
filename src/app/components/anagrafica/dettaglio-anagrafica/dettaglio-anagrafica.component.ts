import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaService } from '../anagrafica-service';

declare var $: any;

@Component({
  selector: 'app-dettaglio-anagrafica',
  templateUrl: './dettaglio-anagrafica.component.html',
  styleUrls: ['./dettaglio-anagrafica.component.scss'],
})
export class DettaglioAnagraficaComponent implements OnInit {
  id: any = this.router.snapshot.params['id'];
  data: any;
  date: any;
  constructor(
    private anagraficaService: AnagraficaService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.anagraficaService.detail(this.id).subscribe((resp: any) => {
      console.log(resp);
      this.data = (resp as any)['anagrafica'];
      console.log(this.data);
    });
  }
}
