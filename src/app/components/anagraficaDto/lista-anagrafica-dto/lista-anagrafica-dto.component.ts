import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { Location } from '@angular/common';
import { ContrattoService } from '../../contratto/contratto-service';

declare var $: any;

@Component({
  selector: 'app-lista-anagrafica-dto',
  templateUrl: './lista-anagrafica-dto.component.html',
  styleUrls: ['./lista-anagrafica-dto.component.scss'],
})
export class ListaAnagraficaDtoComponent implements OnInit {
  lista: any;
  token: any;
  errore = false;
  messaggio: any;
  originalLista: any;
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  contrattiNazionali: any = [];
  mostraFiltri = false;
  showErrorPopup:any;
  showSuccessPopup:any;

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
        descrizione: new FormControl(''),
      }),
      ContrattoNazionale: new FormGroup({
        descrizione: new FormControl(''),
      }),
      TipoContratto: new FormGroup({
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

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private location: Location,
    private contrattoService: ContrattoService,
    private router: Router
  ) {}

  reloadPage(): void {
    this.location.go(this.location.path());
    location.reload();
  }

  ngOnInit(): void {
    this.mostraFiltri = false;
    console.log(JSON.stringify(this.filterAnagraficaDto.value));
    const body = JSON.stringify({
      anagrafica: this.filterAnagraficaDto.value,
    });
    console.log(body);
    this.anagraficaDtoService.listAnagraficaDto(body).subscribe((resp: any) => {
      this.originalLista = resp.list;  // Memorizza la lista originale nella variabile 'originalLista'
      this.lista = this.originalLista;
      console.log(resp);

      $(function () {
        $('#table').DataTable({
          autoWidth: false,
          responsive: true,
        });
      });
    });

    this.filterAnagraficaDto = this.formBuilder.group({
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
          descrizione: new FormControl(''),
        }),
        ContrattoNazionale: new FormGroup({
          descrizione: new FormControl(''),
        }),
        TipoContratto: new FormGroup({
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

    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
  }

  caricaTipoContratto() {
    this.contrattoService.getTipoContratto().subscribe((result: any) => {
      console.log(result);
      this.tipiContratti = (result as any)['list'];
    });
  }
  caricaLivelloContratto() {
    this.contrattoService.getLivelloContratto().subscribe((result: any) => {
      console.log(result);
      this.livelliContratti = (result as any)['list'];
    });
  }
  caricaTipoAzienda() {
    this.contrattoService.getTipoAzienda().subscribe((result: any) => {
      console.log(result);
      this.tipiAziende = (result as any)['list'];
    });
  }

  caricaContrattoNazionale() {
    this.contrattoService.getContrattoNazionale().subscribe((result: any) => {
      console.log(result);
      this.contrattiNazionali = (result as any)['list'];
    });
  }

  filter() {

    const filtroNome = this.filterAnagraficaDto.value.anagrafica.nome.toLowerCase();
    const filtroCognome = this.filterAnagraficaDto.value.anagrafica.cognome.toLowerCase();
    const filtroAziendaTipo = this.filterAnagraficaDto.value.anagrafica.aziendaTipo.toLowerCase();
    const filtroAttivo = this.filterAnagraficaDto.value.anagrafica.attivo;

    const filtroNominativo = this.filterAnagraficaDto.value.commessa.nominativo.toLowerCase();
    const filtroCliente = this.filterAnagraficaDto.value.commessa.cliente.toLowerCase();
    const filtroAzienda = this.filterAnagraficaDto.value.commessa.azienda.toLowerCase();

    const filtroRalAnnua = this.filterAnagraficaDto.value.contratto.ralAnnua.toLowerCase();
    const filtroDataAssunzione = this.filterAnagraficaDto.value.contratto.dataAssunzione;
    const filtroDataFineRapporto = this.filterAnagraficaDto.value.contratto.dataFineRapporto;
    const filtroDescrizioneTipoContratto = this.filterAnagraficaDto.value.contratto.TipoContratto.descrizione.toLowerCase();
    const filtroDescrizioneContrattoNazionale = this.filterAnagraficaDto.value.contratto.ContrattoNazionale.descrizione.toLowerCase();
    const filtroDescrizioneTipoAzienda = this.filterAnagraficaDto.value.contratto.tipoAzienda.descrizione.toLowerCase();





  
    
    this.lista = this.originalLista.filter((element: any) => {

    const nome = (element?.anagrafica.nome ?? 'undefined').toLowerCase();
    const cognome = (element?.anagrafica.cognome ?? 'undefined').toLowerCase();
    const aziendaTipo = (element?.anagrafica.aziendaTipo ?? 'undefined').toLowerCase();
    const attivo = (element?.anagrafica.attivo ?? 'undefined');

    const nominativo = (element?.commessa.nominativo ?? 'undefined').toLowerCase();
    const cliente = (element?.commessa.cliente ?? 'undefined').toLowerCase();
    const azienda = (element?.commessa.azienda ?? 'undefined').toLowerCase();

    const ralAnnua = (element?.contratto.ralAnnua ?? 'undefined').toLowerCase();
    const dataAssunzione = (element?.contratto.dataAssunzione ?? 'undefined');
    const dataFineRapporto = (element?.contratto.dataFineRapporto ?? 'undefined');
    var descrizioneTipoContratto="undefined";
    if(element?.contratto.tipoContratto!=null){
      descrizioneTipoContratto = (element?.contratto.tipoContratto.descrizione ?? 'undefined').toLowerCase();
    }
    var descrizioneContrattoNazionale="undefined";
    if(element?.contratto.contrattoNazionale!=null){
     descrizioneContrattoNazionale = (element?.contratto.contrattoNazionale.descrizione ?? 'undefined').toLowerCase();
    }
    var descrizioneTipoAzienda="undefined";
    if(element?.contratto.tipoAzienda!=null){
     descrizioneTipoAzienda = (element?.contratto.tipoAzienda.descrizione ?? 'undefined').toLowerCase();
    }


      return  nome==filtroNome ||
      cognome==filtroCognome ||
      aziendaTipo==filtroAziendaTipo ||
      attivo==filtroAttivo ||
      nominativo==filtroNominativo ||
      cliente==filtroCliente ||
      azienda==filtroAzienda ||
      ralAnnua==filtroRalAnnua ||
      new Date(dataAssunzione).getTime()==new Date(filtroDataAssunzione).getTime() ||
      new Date(dataFineRapporto).getTime()==new Date(filtroDataFineRapporto).getTime() ||
      descrizioneTipoContratto==filtroDescrizioneTipoContratto ||
      descrizioneContrattoNazionale==filtroDescrizioneContrattoNazionale ||
      descrizioneTipoAzienda==filtroDescrizioneTipoAzienda;
    });
  }

    
  annullaFiltri(){

    console.log(JSON.stringify(this.filterAnagraficaDto.value));
    const body = JSON.stringify({
      anagrafica: this.filterAnagraficaDto.value,
    });
    console.log(body);
    this.anagraficaDtoService.listAnagraficaDto(body).subscribe((resp: any) => {
      this.lista =resp.list;
      console.log(resp);

      this.reset();



    });

  }

  reset(){

    this.filterAnagraficaDto.reset();

  }
  

  delete(idAnagrafica: number,idContratto: number,idCommessa: number) {
    
    this.filterAnagraficaDto.value.anagrafica.id=idAnagrafica;
    this.filterAnagraficaDto.value.contratto.id=idContratto;
    this.filterAnagraficaDto.value.commessa.id=idCommessa;
    const body = JSON.stringify({
      anagraficaDto: this.filterAnagraficaDto.value,
    });
    console.log(body);
    this.anagraficaDtoService.delete(body).subscribe((result: any) => {
      if ((result as any).esito.code != 0) {
        alert('cancellazione non riuscita');
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }else{
        
        alert('cancellazione riuscita');

        this.reloadPage();
       

      }
  });

  }

  chiudiPopup(){
    this.showErrorPopup = false;
    this.showSuccessPopup = false;
    this.reloadPage();
  }

  showAlert(message: string): void {
    const alertElement = document.createElement('div');
    alertElement.className = 'alert';
    alertElement.textContent = message;
    document.body.appendChild(alertElement);
  
    setTimeout(() => {
      alertElement.remove();
    }, 3000); // Rimuovi l'alert dopo 3 secondi (puoi modificare il valore in base alle tue esigenze)
  }

 
  

  
}
