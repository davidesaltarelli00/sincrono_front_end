/*import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaService } from '../anagrafica-service';



@Component({
  selector: 'app-modifica-anagrafica',
  templateUrl: './modifica-anagrafica.component.html',
  styleUrls: ['./modifica-anagrafica.component.scss']
})
export class ModificaAnagraficaComponent {

  id:any=this.router.snapshot.params['id'];
  data:any=[];
  province:any=[];
  titoli:any=[];
  aziende:any=[];
  tipiAnagrafica:any=[];
  obj:any;
  token:any;
  isChecked=false;
  countries = [{'id':0, 'name':'0'},{'id':1, 'name':'1'}, {'id':2, 'name': '2'}, {'id':3, 'name': '3'},
               {'id':5, 'name':'5'},{'id':6, 'name':'6'},{'id':7, 'name':'7'},{'id':8, 'name':'8'},{'id':9, 'name':'9'}];

  dataNascita:any;
  submitted=false;
  base64:any;
  immagineProfilo="profiles/" + this.router.snapshot.params['id'] + ".png";
  errore=false;
  messaggio:any;

  myForm = new FormGroup({
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
      
  constructor(private anagraficaService:AnagraficaService, private router:ActivatedRoute, private formBuilder:FormBuilder, private router2:Router) { }

  ngOnInit(): void {
    this.anagraficaService.getNews(this.router.snapshot.params['id']).subscribe((result:any)=>{
      this.data=result.anagrafica;
      console.log(this.data)
      if(this.data.coniugato==true){
        this.isChecked=true;
      }

      this.modificaAnagrafica=this.formBuilder.group({
        id: new FormControl(this.router.snapshot.params['id']),
        nome : new FormControl(this.data?.nome,[Validators.required]),
        cognome : new FormControl(this.data?.cognome,[Validators.required]),
        sesso : new FormControl(this.data?.sesso,[Validators.required]),
        provinciaNascita:new FormGroup({
          id:new FormControl(this.data.provinciaNascita?.id)
        }),
        dataNascita : new FormControl(this.data?.dataNascita,[Validators.required]), //LOAD VALUE DATE OF BIRTH IN FORM
        localitaEstera : new FormControl(this.data?.localitaNascitaEstera),
        codiceFiscale : new FormControl(this.data?.codiceFiscale,[Validators.required,Validators.minLength(16),
          Validators.maxLength(16)]),
        partitaIva : new FormControl(this.data?.partitaIva),
        indirizzoResidenza : new FormControl(this.data?.indirizzoResidenza),
       provinciaResidenza:new FormGroup({
        id:new FormControl(this.data.provinciaResidenza?.id)
      }),
        capResidenza: new FormControl(this.data?.capResidenza),
        residenzaEstera : new FormControl(this.data?.residenzaEstera),
        indirizzoDomicilio : new FormControl(this.data?.indirizzoDomicilio,[Validators.required]),
        provinciaDomicilio:new FormGroup({
          id:new FormControl(this.data.provinciaDomicilio?.id,[Validators.required])
        }),
        capDomicilio : new FormControl(this.data?.capDomicilio,[Validators.required]),
        telefono : new FormControl(this.data?.telefono,[Validators.required]),
        email : new FormControl(this.data?.email,[Validators.required,Validators.email]),
        emailAziendale : new FormControl(this.data?.emailAziendale,[Validators.email]),
        pec : new FormControl(this.data?.pec,[Validators.required,Validators.email]),
        titoloStudio:new FormGroup({
          id:new FormControl(this.data.titoloStudio?.id,[Validators.required])
        }),
        coniugato:new FormControl(this.data?.coniugato), //CHECKBOX IS MARRIED
        figliCarico:new FormControl(this.data?.figliCarico),
        azienda:new FormGroup({
        id:new FormControl(this.data.azienda?.id,[Validators.required])
       }),
        tipoAnagrafica:new FormGroup({
          id:new FormControl(this.data.tipoAnagrafica?.id,[Validators.required])
        }),
        telefonoAziendale:new FormControl(this.data?.telefonoAziendale,[Validators.required]),
      },)
      
    });
    this.dataNascita=this.modificaAnagrafica.get('dataNascita')?.value
    this.caricaProvince();
    this.caricaTitoli();
    this.caricaAzienda();
    this.caricaTipoAnagrafica();
}
caricaProvince(){
this.anagraficaService.getProvince().subscribe((result:any)=>{
  console.log(result);
  this.province=(result as any)['list'];

});
}

caricaTitoli(){
  this.anagraficaService.getTitoli().subscribe((result:any)=>{
    console.log(result);
    this.titoli=(result as any)['list'];
  });
}

caricaAzienda(){
  this.anagraficaService.getAzienda().subscribe((result:any)=>{
    console.log(result);
    this.aziende=(result as any)['list'];
  });
}

caricaTipoAnagrafica(){
  this.anagraficaService.getTipoAnagrafica().subscribe((result:any)=>{
    console.log(result);
    this.tipiAnagrafica=(result as any)['list'];
  });
}

get f(): {[key: string]: AbstractControl}{
  return this.modificaAnagrafica.controls;
}

private controllo():ValidatorFn{
  return(control:AbstractControl) : ValidationErrors | null =>{
    const formGroup= control as FormGroup;
    const provincia=this.modificaAnagrafica.get("provinciaNascita.id")?.value;
    const localita=this.modificaAnagrafica.get("localitaEstera")?.value;
 
    if(provincia && localita || !provincia && (!localita || localita=="")){
      this.modificaAnagrafica.get("provinciaNascita")?.setErrors({ entrambi: true });
      this.modificaAnagrafica.get("localitaEstera")?.setErrors({ entrambi: true });
    return { entrambi: true };
    }else{
      this.modificaAnagrafica.get("provinciaNascita")?.setErrors(null);
      this.modificaAnagrafica.get("localitaEstera")?.setErrors(null);
    return null;
    }
  }
}

cambiaImmagine(event:any) {

  const reader = new FileReader();
 
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.immagineProfilo = file.name;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64 = reader.result;
    };
  }
}

changeCity(e:any) {
  this.modificaAnagrafica.get('figliCarico')?.setValue(e.target.value, {
    onlySelf: true
  })
}

  Aggiorna(){
   this.submitted=true;
   if(this.modificaAnagrafica.invalid){
    return;
  } 
   
  if (this.modificaAnagrafica.get("provinciaNascita.id")?.value == '') {
    this.modificaAnagrafica.removeControl('provinciaNascita');
  }

  if (this.modificaAnagrafica.get("provinciaResidenza.id")?.value == '') {
    this.modificaAnagrafica.removeControl('provinciaResidenza');
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

  removeEmpty(this.modificaAnagrafica.value);
    console.log(JSON.stringify(this.modificaAnagrafica.value));
    const body=JSON.stringify({"anagrafica":this.modificaAnagrafica.value,"fileBase64":this.base64});
    console.log(body);
  
    this.anagraficaService.update(body).subscribe((result)=>{
      console.log(result); 
      if((result as any).esito.code!=0){
        this.errore=true;
        this.messaggio=(result as any).esito.target;
        return;
      }
      this.router2.navigate(['/table']);
    })
   }
  
  

}

*/