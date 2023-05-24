import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContrattoService } from './../contratto-service';

@Component({
  selector: 'app-nuovo-contratto',
  templateUrl: './nuovo-contratto.component.html',
  styleUrls: []
})

export class NuovoContrattoComponent implements OnInit{
  
  submitted=false;
  errore=false;
  messaggio:any;

  form: FormGroup = new FormGroup({
    tipoContratto: new FormGroup({
      id: new FormControl(''),
    }),
    tipoLivello: new FormGroup({
      id: new FormControl(''),
    }),
    tipoAzienda: new FormGroup({
      id: new FormControl(''),
    }),
    contrattoNazionale: new FormGroup({
      id: new FormControl(''),
    }),
    attivo: new FormControl(''),
  });

  constructor(private contrattoService: ContrattoService, private formBuilder: FormBuilder, private http: HttpClient){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tipoContratto: new FormGroup({
        id: new FormControl(''
        //,[Validators.required]
        ),
      }),
      tipoLivello: new FormGroup({
        id: new FormControl(''
        //,[Validators.required]
        ),
      }),
      tipoAzienda: new FormGroup({
        id: new FormControl(''
        //,[Validators.required]
        ),
      }),
      contrattoNazionale: new FormGroup({
        id: new FormControl(''
        //,[Validators.required]
        ),
      }),
      attivo: new FormControl(''
      //,[Validators.required]
      ),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  inserisci() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          // recursive
          removeEmpty(obj[key]);
        } else if (obj[key] === null) {
          delete obj[key];
        }
      });
    };

    removeEmpty(this.form.value);
    console.log(JSON.stringify(this.form.value));
    const body = JSON.stringify({
      anagrafica: this.form.value
    });
    console.log(body);

    this.contrattoService.insert(body).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }
    });
  }
}
