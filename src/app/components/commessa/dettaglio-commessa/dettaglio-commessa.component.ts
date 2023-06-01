import { CommessaService } from './../commessa-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-dettaglio-commessa',
  templateUrl: './dettaglio-commessa.component.html',
  styleUrls: ['./dettaglio-commessa.component.scss'],
})
export class DettaglioCommessaComponent implements OnInit {
  id: any = this.activatedRouter.snapshot.params['id'];
  data: any;

  constructor(
    private CommessaService: CommessaService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  ngOnInit(): void {
    this.CommessaService.detail(this.id).subscribe((resp: any) => {
      console.log(resp);
      this.data = (resp as any)['commessa'];
    });
  }

  delete(id: number) {
    this.CommessaService.delete(id).subscribe(
      () => {
        console.log('Commessa deleted');
        this.reloadPage();
      },
      (error) => {
        console.error(error);
      }
    );
    this.router.navigate(['../lista-commesse']);
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
