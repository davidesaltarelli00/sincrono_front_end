import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ContrattoService } from '../contratto-service';
import { Component,OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-dettaglio-contartto',
  templateUrl: './dettaglio-contratto.component.html',
  styleUrls: [],
})
export class DettaglioContrattoComponent implements OnInit {

  id: any = this.router.snapshot.params['id'];
  data: any;

  constructor( private contrattoService: ContrattoService, private router: ActivatedRoute, private formBuilder: FormBuilder, private router2: Router ) {}


  ngOnInit(): void {
    this.contrattoService.detail(this.id).subscribe((resp: any) => {
      console.log(resp);
      this.data = (resp as any)['contratto'];
      
    });
  }
}
