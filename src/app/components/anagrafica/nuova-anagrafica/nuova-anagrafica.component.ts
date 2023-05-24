import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaService } from '../anagrafica-service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { HttpClient } from '@angular/common/http';





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
  selector: 'app-nuova-anagrafica',
  templateUrl: './nuova-anagrafica.component.html',
  styleUrls: ['./nuova-anagrafica.component.css'],
  
 
})
export class NuovaAnagraficaComponent implements OnInit {

  data:any=[];
  province:any=[];
  titoli:any=[];
  aziende:any=[];
  tipiAnagrafica:any=[];
  obj:any;
  token:any;
  isChecked=false;
  base64:any;
  immagine:any
  immagineProfilo="blank.png";
  
  countries = [{'id':0, 'name':'0'},{'id':1, 'name':'1'}, {'id':2, 'name': '2'}, {'id':3, 'name': '3'},
               {'id':5, 'name':'5'},{'id':6, 'name':'6'},{'id':7, 'name':'7'},{'id':8, 'name':'8'},{'id':9, 'name':'9'}];

  dataNascita:any;
  submitted=false;
  errore=false;
  messaggio:any;


  form: FormGroup=new FormGroup({
    /*utente:new FormGroup({
      username:new FormControl("default")
    }),*/
    nome : new FormControl(""),
    cognome : new FormControl(""),
    dataNascita : new FormControl(), // DATE OF BIRTH FORM CONTROL NAME
    comuneDiNascita: new FormControl(),
    attivo : new FormControl(""),
    codiceFiscale : new FormControl(""),
    azienda_tipo : new FormControl(""),
    residenza : new FormControl(""),
    Domicilio : new FormControl(""),
    cellularePrivato: new FormControl(""),
    cellulareAziendale : new FormControl(""),
    mailPrivata : new FormControl(""),
    mailAziendale : new FormControl(""),
    mailPec : new FormControl(""),
    titoliDiStudio: new FormControl(""),
    altriTitoli: new FormControl(""),  
    coniugato:new FormControl(""), //IS MARRIED FORM CONTROL NAME
    figliCarico:new FormControl("")
  
  })
    

  constructor(private anagraficaService:AnagraficaService, 
    private router:ActivatedRoute,private formBuilder:FormBuilder, private router2:Router, private http:HttpClient) { }

  ngOnInit(): void {

    this.form=this.formBuilder.group({
      /*utente:new FormGroup({
        username:new FormControl("default")
      }),*/
        attivo : new FormControl(""),
        nome : new FormControl("",[Validators.required]),
        cognome : new FormControl("",[Validators.required]),
        dataNascita : new FormControl("",[Validators.required]), //LOAD VALUE DATE OF BIRTH IN FORM
        codiceFiscale : new FormControl("",[Validators.required,Validators.minLength(16),
          Validators.maxLength(16)]),
        Residenza : new FormControl(""),
        Domicilio : new FormControl(""),
        cellularePrivato : new FormControl("",[Validators.required]),
        cellulareAziendale : new FormControl("",[Validators.required]),
        mailPrivata : new FormControl("",[Validators.required,Validators.email]),
        mailAziendale : new FormControl("",[Validators.required,Validators.email]),
        mailPec : new FormControl("",[Validators.required,Validators.email]),
        titoliDiStudio: new FormControl("",[Validators.required]),
        coniugato:new FormControl(""), //CHECKBOX IS MARRIED
        figliCarico:new FormControl(""),
        altriTitoli: new FormControl(""),  
        comuneDiNascita: new FormControl(),
        aziendaTipo : new FormControl(""),
    });

  }

  get f(): {[key: string]: AbstractControl}{
    return this.form.controls;
  }

  inserisci(){
    this.submitted=true;
      if(this.form.invalid){ 
        return;
      } 
      if (this.form.get("provinciaNascita.id")?.value == '') {
        this.form.removeControl('provinciaNascita');
      }
  
      if (this.form.get("provinciaResidenza.id")?.value == '') {
        this.form.removeControl('provinciaResidenza');
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
      const body=JSON.stringify({"anagrafica":this.form.value,"fileBase64":this.base64});
      console.log(body);
    
      this.anagraficaService.inserisci(body).subscribe((result)=>{
        if((result as any).esito.code!=0){
          this.errore=true;
          this.messaggio=(result as any).esito.target;
          return;
        }
        this.router2.navigate(['/table']);
      })
  }

  }
    

