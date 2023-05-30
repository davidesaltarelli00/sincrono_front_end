import { DashboardService } from './../dashboard-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Component,OnInit } from '@angular/core';



declare var $:any;

@Component({
  selector: 'app-lista-dashboard',
  templateUrl: './lista-dashboard.component.html',
  styleUrls: ['./lista-dashboard.component.scss']
})

export class ListaDashboardComponent {

  lista:any ;
  token:any;

  constructor(private dashboardService: DashboardService,private router:Router) { }

  ngOnInit(): void {

    this.dashboardService.listaDashboard().subscribe((resp:any)=>{
      this.lista = resp.dashboardList;
      console.log(resp);

      $(function() {
        $('#table').DataTable({
            "autoWidth": false,
            "responsive": true,
        });
    });
    });
 
  }
}