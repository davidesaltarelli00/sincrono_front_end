import { Component,OnInit } from '@angular/core';
import { CommessaService } from '../commessa-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
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
  selector: 'app-nuova-commessa',
  templateUrl: './nuova-commessa.component.html',
  styleUrls: ['./nuova-commessa.component.scss'],
  providers: [
   { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})


export class NuovaCommessaComponent implements OnInit{
  id: any = this.router.snapshot.params['id'];
  data: any;
  submitted = false;
  


form: FormGroup=new FormGroup({
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

})


constructor(private CommessaService: CommessaService,
   private router: ActivatedRoute,
   private formBuilder: FormBuilder,
   private router2: Router) {}


ngOnInit(): void {

  this.form=this.formBuilder.group({
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

})

}
inserisci(){
  this.submitted=true;
    if(this.form.invalid){ 
      return;
    } 
    

    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === "object") {
          // recursive
          removeEmpty(obj[key]);
        } else if (obj[key] === null) {
          delete obj[key];
        }
      });
    };

    removeEmpty(this.form.value);
    console.log(JSON.stringify(this.form.value));
    const body=JSON.stringify({"commessa":this.form.value,});
    console.log(body);
  
    this.CommessaService.insert(body).subscribe((result)=>{
      
      this.router2.navigate(['/table']);
    })
}

}

