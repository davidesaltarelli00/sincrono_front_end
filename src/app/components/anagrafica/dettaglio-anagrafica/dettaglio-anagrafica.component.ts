import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaService } from '../anagrafica-service';

declare var $: any;

@Component({
  selector: 'app-dettaglio-anagrafica',
  templateUrl: './dettaglio-anagrafica.component.html',
  styleUrls: []
})
export class DettaglioAnagraficaComponent implements OnInit {
  id: any = this.router.snapshot.params['id'];
  data: any;
  submitted = false;
  constructor(private anagraficaService:AnagraficaService, private router: ActivatedRoute, private formBuilder: FormBuilder, private router2: Router) { }

  modificaRuolo = new FormGroup({
    id: new FormControl(""),
    nome: new FormControl("")

  })

  ngOnInit(): void {
    this.anagraficaService.getNews(this.id).subscribe((resp: any) => {
      console.log(resp);
      this.data = (resp as any)["anagrafica"];
    })
    
  }

}

