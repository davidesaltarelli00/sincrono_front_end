import { Component } from '@angular/core';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from '../../login/login-service';
@Component({
  selector: 'app-dettaglio-anagrafica-dto',
  templateUrl: './dettaglio-anagrafica-dto.component.html',
  styleUrls: ['./dettaglio-anagrafica-dto.component.scss'],
})
export class DettaglioAnagraficaDtoComponent {
  id: any = this.activatedRoute.snapshot.params['id'];
  data: any;
  date: any;
  errore = false;
  messaggio: any;
  role:any;
  elencoCommesse=[];
  commesseGroupedByIndex: any[] = [];


  filterAnagraficaDto: FormGroup = new FormGroup({
    anagrafica: new FormGroup({
      nome: new FormControl(''),
      cognome: new FormControl(''),
      attivo: new FormControl(''),
      aziendaTipo: new FormControl(''),
    }),
    contratto: new FormGroup({
      ralAnnua: new FormControl(''),
      dataAssunzione: new FormControl(''),
      dataFineRapporto: new FormControl(''),
      livelloContratto: new FormGroup({
        ccnl: new FormControl(''),
      }),
      tipoCcnl: new FormGroup({
        descrizione: new FormControl(''),
      }),
      tipoContratto: new FormGroup({
        descrizione: new FormControl(''),
      }),
      tipoAzienda: new FormGroup({
        descrizione: new FormControl(''),
      }),
    }),
    commessa: new FormGroup({
      cliente: new FormControl(''),
      azienda: new FormControl(''),
      nominativo: new FormControl(''),
    }),
  });
  userlogged: any;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService:AuthService
  ) {

  }

  ngOnInit(): void {
    console.log(this.id);
    this.anagraficaDtoService
      .detailAnagraficaDto(this.id, localStorage.getItem('token'))
      .subscribe((resp: any) => {
        console.log(resp);
        this.data = (resp as any)['anagraficaDto'];
        console.log(this.data);
        this.elencoCommesse=(resp as any)['anagraficaDto']['commesse'];
        console.log(this.elencoCommesse);

      });
      const userLogged = localStorage.getItem('userLogged');
      if (userLogged) {
        this.userlogged = userLogged;
      }

  }


  modificaCommessa(){
    this.router.navigate(['/modifica-anagrafica/'+this.id]);
  }

  modificaAnagrafica(){
    this.router.navigate(['/modifica-anagrafica/'+this.id]);
  }

  logout() {
    // this.authService.logout();
  }
  profile() {
    this.router.navigate(['/profile-box/', this.userlogged]);
  }

  delete(idAnagrafica: number, idContratto: number, idCommessa: number) {
    this.filterAnagraficaDto.value.anagrafica.id = idAnagrafica;
    this.filterAnagraficaDto.value.contratto.id = idContratto;
    this.filterAnagraficaDto.value.commessa.id = idCommessa;
    const body = JSON.stringify({
      anagraficaDto: this.filterAnagraficaDto.value,
    });
    this.anagraficaDtoService.delete(body,localStorage.getItem('token')).subscribe((result: any) => {
      if ((result as any).esito.code != 0) {
        alert('cancellazione non riuscita\n'+'target: '+(result as any).esito.target);
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      } else {
        alert('cancellazione riuscita');
        this.router.navigate(['/lista-anagrafica']);
      }
    });
  }
  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
  }
  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  getStoricoContratti(idAnagrafica:any) {
    this.router.navigate(['/storico-contratti', idAnagrafica]);
  }
  getStoricoCommessa(idAnagrafica:any) {
    this.router.navigate(['/storico-commesse', idAnagrafica]);
  }
}
