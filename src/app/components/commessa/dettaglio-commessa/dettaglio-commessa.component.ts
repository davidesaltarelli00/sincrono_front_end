import { CommessaService } from './../commessa-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-dettaglio-commessa',
  templateUrl: './dettaglio-commessa.component.html',
  styleUrls: ['./dettaglio-commessa.component.scss']
})
export class DettaglioCommessaComponent implements OnInit {
  id: any = this.router.snapshot.params['id'];
  data: any;


  constructor(private CommessaService: CommessaService, private router: ActivatedRoute, private formBuilder: FormBuilder, private router2: Router, private location: Location) { }

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }
  ngOnInit(): void {
    this.CommessaService.detail(this.id).subscribe((resp: any) => {
      console.log(resp);
      this.data = (resp as any)["commessa"];
    })
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
  }



}
