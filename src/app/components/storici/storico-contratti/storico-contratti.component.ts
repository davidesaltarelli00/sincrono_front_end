import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StoricoService } from '../storico-service';
import { ActivatedRoute} from '@angular/router';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

declare var $: any;

@Component({
  selector: 'app-storico-contratti',
  templateUrl: './storico-contratti.component.html',
  styleUrls: ['./storico-contratti.component.scss']
})



export class StoricoContrattiComponent implements OnInit  {


  lista: any;
  idAnagrafica:any;

  constructor(
    private storicoService: StoricoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog:MatDialog
  ) {}

  ngOnInit(): void {

    this.idAnagrafica = this.activatedRoute.snapshot.params['id'];
//TO DO           DA CONTROLLARE
    this.storicoService.getStoricoContratti(this.idAnagrafica, localStorage.getItem("token")).subscribe((resp: any) => {

      if ((resp as any).esito.code !== 200) {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            title: 'Caricamento non riuscito:',
            message: (resp as any).esito.target,
          },
        });
      } else{
        this.lista = resp.list;
        console.log("lista contratti:"+ resp.list);
      }
    }, (error:any)=>{
      console.error("Si e verificato un errore durante il caricamento dei dati:"+ error);
    });
  }




}
