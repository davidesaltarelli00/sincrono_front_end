import { OrganicoService } from '../organico-service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../login/login-service';

@Component({
  selector: 'app-lista-organico',
  templateUrl: './lista-organico.component.html',
  styleUrls: ['./lista-organico.component.scss'],
})
export class ListaOrganicoComponent implements OnInit {
  lista: any;
  token: any;

  submitted = false;
  errore = false;
  messaggio: any;
  userlogged:any;
  role: any;

  constructor(
    private organicoService: OrganicoService,
    private router: Router,
    private authService:AuthService
  ) {
    this.userlogged = localStorage.getItem('userLogged');

    const userLogged = localStorage.getItem('userLogged');
    if (userLogged) {
      this.userlogged = userLogged;
  }
  }

  logout() {
    // this.authService.logout();
  }

  profile(){
    this.router.navigate(['/profile-box/',this.userlogged]);
  }

  ngOnInit(): void {
    this.organicoService.listaOrganico(localStorage.getItem('token')).subscribe((resp: any) => {
      const jsonResp = JSON.stringify(resp);
      console.log(jsonResp);
      this.lista = resp.list;
    },
    (error:string)=>{
      console.log("errore durante il caricamento dei dati dell'organico:"+error)
    }
    );

  }

  filter(tipoContratto: any, tipoAzienda: any) {
    this.router.navigate(['/lista-anagrafica', { tipoContratto, tipoAzienda }]);
  }

  calculateSliceRotation(element: any): number {
    const total = element.numeroDipendenti + element.indeterminati + element.determinati +
                  element.apprendistato + element.consulenza + element.stage +
                  element.partitaIva + element.potenzialeStage + element.slotStage +
                  element.potenzialeApprendistato + element.slotApprendistato;

    const percentage = (element.numeroDipendenti / total) * 360;
    return percentage;
  }

  calculatePercentage(element: any): number {
    const total = element.numeroDipendenti + element.indeterminati + element.determinati +
                  element.apprendistato + element.consulenza + element.stage +
                  element.partitaIva + element.potenzialeStage + element.slotStage +
                  element.potenzialeApprendistato + element.slotApprendistato;

    const percentage = (element.numeroDipendenti / total) * 100;
    return Math.round(percentage);
  }


}
