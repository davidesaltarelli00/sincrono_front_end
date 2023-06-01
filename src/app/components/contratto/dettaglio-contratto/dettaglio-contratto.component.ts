import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ContrattoService } from '../contratto-service';
import { Component,OnInit } from '@angular/core';
declare var $: any;

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-dettaglio-contartto',
  templateUrl: './dettaglio-contratto.component.html',
  styleUrls: [],
})
export class DettaglioContrattoComponent implements OnInit {

  id: any = this.router.snapshot.params['id'];
  data: any;
  date: any;
  constructor( private contrattoService: ContrattoService, private router: ActivatedRoute, private formBuilder: FormBuilder, private router2: Router ) {}


  ngOnInit(): void {
    this.contrattoService.detail(this.id).subscribe((resp: any) => {
      console.log(resp);
      this.data = (resp as any)['contratto'];
      console.log(this.data);
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
