import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DettaglioAnagraficaComponent } from './../../anagrafica/dettaglio-anagrafica/dettaglio-anagrafica.component';
import { ContrattoService } from './../contratto-service';
import { Component } from '@angular/core';
import {FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifica-contratto',
  templateUrl: './modifica-contratto.component.html',
  styleUrls: ['./modifica-contratto.component.scss'],
})
export class ModificaContrattoComponent {
  id: any = this.router.snapshot.params['id'];
  data: any = [];

  //TIPOLOGICHE
  tipoContratto: any = [];
  livelloContratto: any = [];
  tipoAzienda: any = [];
  contrattoNazionale: any = [];

  submitted = false;

  errore = false;
  messaggio: any;


  modifica = new FormGroup({
    id: new FormControl(''),
    tipoContratto: new FormGroup({
      id: new FormControl(''),
    }),
    livelloContratto: new FormGroup({
      id: new FormControl(''),
    }),
    tipoAzienda: new FormGroup({
      id: new FormControl(''),
    }),
    contrattoNazionale: new FormGroup({
      id: new FormControl(''),
    }),
    attivo: new FormControl(''),
    sedeAssunzione: new FormControl(''),
    qualifica: new FormControl(''),
    dataAssunzione: new FormControl(''),
    dataInizioProva: new FormControl(''),
    dataFineProva: new FormControl(''),
    dataFineRapporto: new FormControl(''),
    mesiDurata: new FormControl(''),
    livelloIniziale: new FormControl(''),
    livelloAttuale: new FormControl(''),
    livelloFinale: new FormControl(''),
    dimissioni: new FormControl(''),
    partTime: new FormControl(''),
    partTimeA: new FormControl(''),
    retribuzioneMensileLorda: new FormControl(''),
    superminimoMensile: new FormControl(''),
    ralAnnua: new FormControl(''),
    superminimoRal: new FormControl(''),
    diariaMensile: new FormControl(''),
    diariaGg: new FormControl(''),
    ticket: new FormControl(''),
    valoreTicket: new FormControl(''),
    categoriaProtetta: new FormControl(''),
    tutor: new FormControl(''),
    pfi: new FormControl(''),
    assicurazioneObbligatoria: new FormControl(''),
    corsoSicurezza: new FormControl(''),
    motivazioneFineRapporto: new FormControl(''),
    pc: new FormControl(''),
    scattiAnzianita: new FormControl(''),
    tariffaPartitaIva: new FormControl(''),
    canaleReclutamento: new FormControl(''),
  });

  constructor(
    private contrattoService: ContrattoService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router2: Router
  ) {}
  ngOnInit(): void {
    this.contrattoService
      .detail(this.router.snapshot.params['id'])
      .subscribe((result: any) => {
        this.data = result.anagrafica;
        console.log(this.data);

        this.modifica = this.formBuilder.group({
          id: new FormControl(''),
          tipoContratto: new FormGroup({
            id: new FormControl(this.data?.tipoContratto.id),
          }),
          livelloContratto: new FormGroup({
            id: new FormControl(this.data?.livelloContratto.id),
          }),
          tipoAzienda: new FormGroup({
            id: new FormControl(this.data?.tipoAzienda.id),
          }),
          contrattoNazionale: new FormGroup({
            id: new FormControl(this.data?.contrattoNazionale.id),
          }),
          attivo: new FormControl(this.data?.attivo),
          sedeAssunzione: new FormControl(this.data?.sedeAssunzione),
          qualifica: new FormControl(this.data?.qualifica),
          dataAssunzione: new FormControl(this.data?.dataAssunzione),
          dataInizioProva: new FormControl(this.data?.dataInizioProva),
          dataFineProva: new FormControl(this.data?.dataFineProva),
          dataFineRapporto: new FormControl(this.data?.dataFineRapporto),
          mesiDurata: new FormControl(this.data?.mesiDurata),
          livelloIniziale: new FormControl(this.data?.livelloIniziale),
          livelloAttuale: new FormControl(this.data?.livelloAttuale),
          livelloFinale: new FormControl(this.data?.livelloFinale),
          dimissioni: new FormControl(this.data?.dimissioni),
          partTime: new FormControl(this.data?.partTime),
          partTimeA: new FormControl(this.data?.partTimeA),
          retribuzioneMensileLorda: new FormControl(
            this.data?.retribuzioneMensileLorda
          ),
          superminimoMensile: new FormControl(this.data?.superminimoMensile),
          ralAnnua: new FormControl(this.data?.ralAnnua),
          superminimoRal: new FormControl(this.data?.superminimoRal),
          diariaMensile: new FormControl(this.data?.diariaMensile),
          diariaGg: new FormControl(this.data?.diariaGg),
          ticket: new FormControl(this.data?.ticket),
          valoreTicket: new FormControl(this.data?.valoreTicket),
          categoriaProtetta: new FormControl(this.data?.categoriaProtetta),
          tutor: new FormControl(this.data?.tutor),
          pfi: new FormControl(this.data?.pfi),
          assicurazioneObbligatoria: new FormControl(
            this.data?.assicurazioneObbligatoria
          ),
          corsoSicurezza: new FormControl(this.data?.corsoSicurezza),
          motivazioneFineRapporto: new FormControl(
            this.data?.motivazioneFineRapporto
          ),
          pc: new FormControl(this.data?.pc),
          scattiAnzianita: new FormControl(this.data?.scattiAnzianita),
          tariffaPartitaIva: new FormControl(this.data?.tariffaPartitaIva),
          canaleReclutamento: new FormControl(this.data?.canaleReclutamento),
        });
      });
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
  }

  caricaTipoContratto(){
    this.contrattoService.get().subscribe((result:any)=>{
      console.log(result);
      this.province=(result as any)['list'];
  }
  caricaLivelloContratto(){

  }
  caricaTipoAzienda(){

  }

  caricaContrattoNazionale(){

  }


}
