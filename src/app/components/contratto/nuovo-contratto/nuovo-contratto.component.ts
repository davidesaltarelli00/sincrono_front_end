import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContrattoService } from './../contratto-service';

@Component({
  selector: 'app-nuovo-contratto',
  templateUrl: './nuovo-contratto.component.html',
  styleUrls: []
})

export class NuovoContrattoComponent implements OnInit{
  id: any = this.router.snapshot.params['id'];
  data: any = [];

  //TIPOLOGICHE
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  contrattiNazionali: any = [];

  submitted = false;

  errore = false;
  messaggio: any;

  nuovo = new FormGroup({
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
      .detail(this.router.snapshot.params['id'],localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.data = result.anagrafica;
        console.log(this.data);

        this.nuovo = this.formBuilder.group({
          id: new FormControl(),
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
          attivo: new FormControl(""),
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
          dimissioni: new FormControl(""),
          partTime: new FormControl(""),
          partTimeA: new FormControl(""),
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
          categoriaProtetta: new FormControl(""),
          tutor: new FormControl(this.data?.tutor),
          pfi: new FormControl(this.data?.pfi),
          assicurazioneObbligatoria: new FormControl(
            this.data?.assicurazioneObbligatoria
          ),
          corsoSicurezza: new FormControl(this.data?.corsoSicurezza),
          motivazioneFineRapporto: new FormControl(
            this.data?.motivazioneFineRapporto
          ),
          pc: new FormControl(""),
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

  caricaTipoContratto() {
    this.contrattoService.getTipoContratto(localStorage.getItem('token')).subscribe((result: any) => {
      console.log(result);
      this.tipiContratti = (result as any)['list'];
    });
  }
  caricaLivelloContratto() {
    this.contrattoService.getLivelloContratto(localStorage.getItem('token')).subscribe((result: any) => {
      console.log(result);
      this.livelliContratti = (result as any)['list'];
    });
  }
  caricaTipoAzienda() {
    this.contrattoService.getTipoAzienda(localStorage.getItem('token')).subscribe((result: any) => {
      console.log(result);
      this.tipiAziende = (result as any)['list'];
    });
  }

  caricaContrattoNazionale() {
    this.contrattoService.getContrattoNazionale(localStorage.getItem('token')).subscribe((result: any) => {
      console.log(result);
      this.contrattiNazionali = (result as any)['list'];
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.nuovo.controls;
  }

  
  inserisci() {
    this.submitted = true;
    if (this.nuovo.invalid) {
      return;
    }

    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === null) {
          delete obj[key];
        }
      });
    };

    removeEmpty(this.nuovo.value);
    console.log(JSON.stringify(this.nuovo.value));
    const body = JSON.stringify({
      contratto: this.nuovo.value
    });
    console.log(body);

    this.contrattoService.insert(body, localStorage.getItem('token')).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }
    });
  }
   
}
