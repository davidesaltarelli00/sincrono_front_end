import { Component, OnInit } from '@angular/core';
import { CommessaService } from '../../commessa-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl,FormBuilder,FormControl, FormGroup,Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';


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
  selector: 'app-modifica-commessa',
  templateUrl: './modifica-commessa.component.html',
  styleUrls: ['./modifica-commessa.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  
})




export class ModificaCommessaComponent implements OnInit {
  id: any = this.router.snapshot.params['id'];
  data: any;
  submitted = false;
  errore = false;
  messaggio: any;
  



 modificaCommessa = new FormGroup({
  id:new FormControl(""),
  cliente:new FormControl(""),
  cliente_finale:new FormControl(""),
  titolo_posizione:new FormControl(""),
  distacco:new FormControl(""),
  data_inizio:new FormControl(""),
  data_fine:new FormControl(""),
  costo_mese:new FormControl(""),
  tariffa_giornaliera:new FormControl(""),
  nominativo:new FormControl(""),
  azienda:new FormControl(""),
  azienda_di_fatturazione_interna:new FormControl(""),
  stato:new FormControl(""),
  attesaLavori:new FormControl(""),

});


constructor(
  private CommessaService: CommessaService, 
  private router: ActivatedRoute, 
  private formBuilder: FormBuilder,
  private router2: Router
  ) { }

ngOnInit(): void {


  this.modificaCommessa=this.formBuilder.group({
   id:new FormControl(this.router.snapshot.params['id']),
   cliente:new FormControl(this.data?.cliente),
   cliente_finale:new FormControl(this.data?.cliente_finale),
   titolo_posizione:new FormControl(this.data?.titolo_posizione),
   distacco:new FormControl(this.data?.distacco),
   data_inizio:new FormControl(this.data?.data_inizio),
   data_fine:new FormControl(this.data?.data_fine),
   costo_mese:new FormControl(this.data?.costo_mese),
   tariffa_giornaliera:new FormControl(this.data?.tariffa_giornaliera),
   nominativo:new FormControl(this.data?.nominativo),
   azienda:new FormControl(this.data?.azienda),
   azienda_di_fatturazione_interna:new FormControl(this.data?.azienda_di_fatturazione_interna),
   stato:new FormControl(this.data?.stato),
   attesaLavori:new FormControl(this.data?.attesaLavori),

})
}
get f(): { [key: string]: AbstractControl } {
  return this.modificaCommessa.controls;
}

inserisci() {
  console.log(JSON.stringify(this.modificaCommessa.value));
  const body=JSON.stringify({"commessa":this.modificaCommessa.value});
  console.log(body);

  this.CommessaService.update(body).subscribe((result)=>{
    console.log(result); 
  })
}


}
