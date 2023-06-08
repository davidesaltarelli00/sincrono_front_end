import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaService } from '../anagrafica-service';

@Component({
  selector: 'app-dettaglio-anagrafica',
  templateUrl: './dettaglio-anagrafica.component.html',
  styleUrls: ['./dettaglio-anagrafica.component.scss'],
})
export class DettaglioAnagraficaComponent implements OnInit {
  id: any = this.activatedRoute.snapshot.params['id'];
  data: any;
  date: any;
  constructor(
    private anagraficaService: AnagraficaService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.anagraficaService.detailAnagraficaDto(this.id).subscribe((resp: any) => {
      console.log(resp);
      this.data = (resp as any)['anagraficaDto'];
      console.log(this.data);
    });
  }
  delete(id: number) {
    this.anagraficaService.delete(id).subscribe(
      () => {
        console.log('Commessa deleted');
      },
      (error) => {
        console.error(error);
      }
    );
    this.router.navigate(['../lista-anagrafiche'])
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
