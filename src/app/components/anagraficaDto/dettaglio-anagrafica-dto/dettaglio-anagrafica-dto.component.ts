import { Component } from '@angular/core';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-dettaglio-anagrafica-dto',
  templateUrl: './dettaglio-anagrafica-dto.component.html',
  styleUrls: ['./dettaglio-anagrafica-dto.component.scss'],
})
export class DettaglioAnagraficaDtoComponent {
  id: any = this.activatedRoute.snapshot.params['id'];
  data: any;
  date: any;
  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id)
      .subscribe((resp: any) => {
        console.log(resp);
        this.data = (resp as any)['anagraficaDto'];
        console.log(this.data);
      });
  }
  delete(id: number) {
    this.anagraficaDtoService.delete(id).subscribe(
      () => {
        console.log('Commessa deleted');
      },
      (error) => {
        console.error(error);
      }
    );
    this.router.navigate(['../lista-anagrafiche']);
  }
  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
  }
}
