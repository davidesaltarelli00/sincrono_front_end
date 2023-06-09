import { ContrattoService } from './../contratto-service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  contrattiNazionali: any = [];

  submitted = false;

  errore = false;
  messaggio: any;

  modificaContratto = new FormGroup({
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
    diariaMese: new FormControl(''),
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
    this.contrattoService.detail(this.id).subscribe((resp: any) => {
      this.data = (resp as any)['contratto'];
      console.log(this.data);
    });
    this.modificaContratto = this.formBuilder.group({
      id: new FormControl(this.id),
      tipoContratto: new FormGroup({
        id: new FormControl(this.data?.tipoContratto?.id),
      }),
      livelloContratto: new FormGroup({
        id: new FormControl(this.data?.livelloContratto?.id),
      }),
      tipoAzienda: new FormGroup({
        id: new FormControl(this.data?.tipoAzienda?.id),
      }),
      contrattoNazionale: new FormGroup({
        id: new FormControl(this.data?.contrattoNazionale?.id),
      }),
      attivo: new FormControl(''),
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
      dimissioni: new FormControl(''),
      partTime: new FormControl(''),
      partTimeA: new FormControl(''),
      retribuzioneMensileLorda: new FormControl(
        this.data?.retribuzioneMensileLorda
      ),
      superminimoMensile: new FormControl(this.data?.superminimoMensile),
      ralAnnua: new FormControl(this.data?.ralAnnua),
      superminimoRal: new FormControl(this.data?.superminimoRal),
      diariaMese: new FormControl(this.data?.diariaMensile),
      diariaGg: new FormControl(this.data?.diariaGg),
      ticket: new FormControl(this.data?.ticket),
      valoreTicket: new FormControl(this.data?.valoreTicket),
      categoriaProtetta: new FormControl(''),
      tutor: new FormControl(this.data?.tutor),
      pfi: new FormControl(this.data?.pfi),
      assicurazioneObbligatoria: new FormControl(
        this.data?.assicurazioneObbligatoria
      ),
      corsoSicurezza: new FormControl(this.data?.corsoSicurezza),
      motivazioneFineRapporto: new FormControl(
        this.data?.motivazioneFineRapporto
      ),
      pc: new FormControl(''),
      scattiAnzianita: new FormControl(this.data?.scattiAnzianita),
      tariffaPartitaIva: new FormControl(this.data?.tariffaPartitaIva),
      canaleReclutamento: new FormControl(this.data?.canaleReclutamento),
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

  inserisci() {
    this.submitted = true;

    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === null) {
          delete obj[key];
        }
      });
    };

    removeEmpty(this.modificaContratto.value);
    console.log(JSON.stringify(this.modificaContratto.value));
    const body: string = JSON.stringify({
      contratto: this.modificaContratto.value,
    });
    console.log(body);

    this.contrattoService.update(body).subscribe((result) => {
      console.log(result);
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
}
