import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaDtoService } from './../anagraficaDto-service';

@Component({
  selector: 'app-modifica-anagrafica-dto',
  templateUrl: './modifica-anagrafica-dto.component.html',
  styleUrls: ['./modifica-anagrafica-dto.component.scss'],
})
export class ModificaAnagraficaDtoComponent implements OnInit {
  utenti: any = [];
  data: any = [];
  id = this.activatedRouter.snapshot.params['id'];
  submitted = false;
  errore = false;
  messaggio: any;
  showErrorPopup: any;
  showSuccessPopup: any;
  //TIPOLOGICHE
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  contrattiNazionali: any = [];
  ruoli: any = [];
  currentStep = 1;
  anagraficaDto: FormGroup;
  commesse!: FormArray;
  formsDuplicati: any;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.anagraficaDto = this.formBuilder.group({
      anagrafica: this.formBuilder.group({
        attivo: new FormControl(''),
        aziendaTipo: new FormControl(''),
        nome: new FormControl('', Validators.required),
        cognome: new FormControl('', Validators.required),
        codiceFiscale: new FormControl('', Validators.required),
        cellularePrivato: new FormControl(''),
        cellulareAziendale: new FormControl(''),
        mailPrivata: new FormControl(''),
        mailPec: new FormControl(''),
        mailAziendale: new FormControl('', Validators.required),
        titoliDiStudio: new FormControl(''),
        altriTitoli: new FormControl(''),
        comuneDiNascita: new FormControl(''),
        residenza: new FormControl(''),
        domicilio: new FormControl(''),
        dataDiNascita: new FormControl(''),
        coniugato: new FormControl(''),
        figliACarico: new FormControl(''),
      }),
      commesse: this.formBuilder.array([
        this.formBuilder.group({
          cliente: new FormControl(''),
          clienteFinale: new FormControl(''),
          titoloPosizione: new FormControl(''),
          distacco: new FormControl(''),
          costoMese: new FormControl(''),
          dataInizio: new FormControl(''),
          dataFine: new FormControl(''),
          tariffaGiornaliera: new FormControl(''),
          nominativo: new FormControl(''),
          azienda: new FormControl(''),
          aziendaDiFatturazioneInterna: new FormControl(''),
          stato: new FormControl(''),
          attesaLavori: new FormControl(''),
        }),
      ]),

      contratto: this.formBuilder.group({
        attivo: new FormControl(''),
        aziendaDiFatturazioneInterna: new FormControl(''),
        tipoAzienda: new FormGroup({
          id: new FormControl(''),
        }),
        tipoContratto: new FormGroup({
          id: new FormControl(''),
        }),
        livelloContratto: new FormGroup({
          id: new FormControl(''),
        }),
        contrattoNazionale: new FormGroup({
          id: new FormControl(''),
        }),
        qualifica: new FormControl(''),
        sedeAssunzione: new FormControl(''),
        dataAssunzione: new FormControl(''),
        dataInizioProva: new FormControl(''),
        dataFineProva: new FormControl(''),
        dataFineRapporto: new FormControl(''),
        mesiDurata: new FormControl(''),
        livelloIniziale: new FormControl(''),
        // livelloAttuale: new FormControl(''),
        // livelloFinale: new FormControl(''),
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
        corsoSicurezza: new FormControl(''),
        motivazioneFineRapporto: new FormControl(''),
        scattiAnzianita: new FormControl(''),
        pc: new FormControl(''),
        tariffaPartitaIva: new FormControl(''),
        canaleReclutamento: new FormControl(''),
      }),
      ruolo: this.formBuilder.group({
        id: new FormControl('', Validators.required),
      }),
    });

    this.commesse = this.anagraficaDto.get('commesse') as FormArray;
  }

  ngOnInit(): void {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.activatedRouter.snapshot.params['id'])
      .subscribe((resp: any) => {
        this.data = (resp as any)['anagraficaDto'];
        console.log(this.data);
        this.anagraficaDto.patchValue(this.data);
      });

    this.caricaListaUtenti();
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();

    this.caricaRuoli();
  }

  caricaTipoContratto() {
    this.anagraficaDtoService.getTipoContratto().subscribe((result: any) => {
      console.log(result);
      this.tipiContratti = (result as any)['list'];
    });
  }
  caricaLivelloContratto() {
    this.anagraficaDtoService.getLivelloContratto().subscribe((result: any) => {
      console.log(result);
      this.livelliContratti = (result as any)['list'];
    });
  }
  caricaTipoAzienda() {
    this.anagraficaDtoService.getTipoAzienda().subscribe((result: any) => {
      console.log(result);
      this.tipiAziende = (result as any)['list'];
    });
  }

  caricaContrattoNazionale() {
    this.anagraficaDtoService
      .getContrattoNazionale()
      .subscribe((result: any) => {
        console.log(result);
        this.contrattiNazionali = (result as any)['list'];
      });
  }
  caricaListaUtenti() {
    this.anagraficaDtoService.getListaUtenti().subscribe((result: any) => {
      console.log(result);
      this.utenti = (result as any)['list'];
    });
  }
  aggiorna() {
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === '' || obj[key] === null) {
          delete obj[key];
        }
        if (obj.anagrafica && Object.keys(obj.anagrafica).length === 0) {
          delete obj.anagrafica;
        }
        if (obj.commessa && Object.keys(obj.commessa).length === 0) {
          delete obj.commessa;
        }
        if (obj.contratto && Object.keys(obj.contratto).length === 0) {
          delete obj.contratto;
        }
        if (obj.tipoContratto && Object.keys(obj.tipoContratto).length === 0) {
          delete obj.tipoContratto;
        }
        if (obj.tipoAzienda && Object.keys(obj.tipoAzienda).length === 0) {
          delete obj.tipoAzienda;
        }
        if (
          obj.contrattoNazionale &&
          Object.keys(obj.contrattoNazionale).length === 0
        ) {
          delete obj.contrattoNazionale;
        }
        if (
          obj.livelloContratto &&
          Object.keys(obj.livelloContratto).length === 0
        ) {
          delete obj.livelloContratto;
        }
        if (obj.ruolo && Object.keys(obj.ruolo).length === 0) {
          delete obj.ruolo;
        }
      });
    };

    removeEmpty(this.anagraficaDto.value);

    let check = true;

    if (this.anagraficaDto.value.anagrafica != null) {
      if (
        this.checkValid([
          'anagrafica.nome',
          'anagrafica.cognome',
          'anagrafica.codiceFiscale',
          'anagrafica.mailAziendale',
        ])
      ) {
        return;
      }
    } else {
      return;
    }

    if (this.anagraficaDto.value.commessa != null) {
      if (
        this.checkValid([
          'commessa.cliente',
          'commessa.dataInizio',
          'commessa.dataFine',
          'commessa.nominativo',
        ])
      ) {
        return;
      }
    } else {
      this.reset([
        'commessa.cliente',
        'commessa.dataInizio',
        'commessa.dataFine',
        'commessa.nominativo',
      ]);
    }

    if (this.anagraficaDto.value.contratto != null) {
      if (
        (check = this.checkValid([
          'contratto.tipoContratto.id',
          'contratto.livelloContratto.id',
          'contratto.contrattoNazionale.id',
          'contratto.tipoAzienda.id',
        ]))
      ) {
        return;
      }
    } else {
      this.reset([
        'contratto.tipoContratto.id',
        'contratto.livelloContratto.id',
        'contratto.contrattoNazionale.id',
        'contratto.tipoAzienda.id',
      ]);
    }
    const body = { anagraficaDto: this.anagraficaDto.value };

    console.log("ANAGRAFICADTO: ", this.anagraficaDto, " BODY: ", body);

    this.anagraficaDtoService.update(body).subscribe(
      (result) => {
        console.log(result);
        if ((result as any).esito.code != 0) {
          alert(
            'modifica non riuscita \n' +
              'target: ' +
              (result as any).esito.target
          );
          this.showErrorPopup = true;
          this.errore = true;
          this.messaggio = (result as any).esito.target;
          return;
        } else {
          alert('modifica riuscita');
          this.anagraficaDto = result;
        }
      },
      (error: string) => {
        console.log('Si é verificato un errore durante la modifica: ' + error);
      }
    );
  }

  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
  }

  chiudiPopup() {
    this.showErrorPopup = false;
    this.showSuccessPopup = false;
  }

  checkValid(myArray: string[]) {
    let check = false;

    for (let element of myArray) {
      if (this.isControlInvalid(element)) {
        check = true;
      }
    }

    return check;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.anagraficaDto.get(controlName);
    const inputElement = document.getElementById(controlName);

    if (!(control?.value != null && control?.value != '')) {
      inputElement?.classList.add('invalid-field');
      return true;
    } else {
      inputElement?.classList.remove('invalid-field');
      return false;
    }
  }

  reset(myArray: string[]) {
    for (let element of myArray) {
      const inputElement = document.getElementById(element);

      inputElement?.classList.remove('invalid-field');
    }
  }

  caricaRuoli() {
    this.anagraficaDtoService.getRuoli().subscribe((result: any) => {
      this.ruoli = (result as any)['list'];
    });
  }

  aggiungiCommessa() {
    const commessaFormGroup = this.creaFormCommessa();
    this.commesse.push(commessaFormGroup);
    // this.isFormDuplicated = true;
    this.formsDuplicati.push(true);
  }

  creaFormCommessa(): FormGroup {
    return this.formBuilder.group({
      cliente: new FormControl(''),
      clienteFinale: new FormControl(''),
      titoloPosizione: new FormControl(''),
      distacco: new FormControl(''),
      costoMese: new FormControl(''),
      dataInizio: new FormControl(''),
      dataFine: new FormControl(''),
      tariffaGiornaliera: new FormControl(''),
      nominativo: new FormControl(''),
      azienda: new FormControl(''),
      aziendaDiFatturazioneInterna: new FormControl(''),
      stato: new FormControl(''),
      attesaLavori: new FormControl(''),
    });
  }

  rimuoviCommessa(index: number) {
    this.commesse.removeAt(index);
    this.formsDuplicati.splice(index);
  }
}
