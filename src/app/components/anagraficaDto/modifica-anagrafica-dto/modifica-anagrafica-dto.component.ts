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
  data: any;
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
  ccnl: any = [];
  ruoli: any = [];
  currentStep = 1;
  anagraficaDto: FormGroup;
  commessePresenti = false;
  elencoCommesse: any[] = [];

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.caricaListaUtenti();
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
    this.caricaDati();
    this.caricaRuoli();
    this.anagraficaDto = this.formBuilder.group({
      anagrafica: this.formBuilder.group({
        id: [this.id], // Per il campo 'id' puoi usare il valore di 'this.id' se hai già inizializzato la variabile
        attivo: [''], // Esempio di campo richiesto
        aziendaTipo: [''],
        nome: ['', Validators.required],
        cognome: ['', Validators.required],
        codiceFiscale: ['', Validators.required],
        comuneDiNascita: [''],
        dataDiNascita: [''],
        residenza: [''],
        domicilio: [''],
        cellularePrivato: ['', Validators.required],
        cellulareAziendale: ['', Validators.required],
        mailPrivata: ['', Validators.required],
        mailAziendale: ['', Validators.required],
        mailPec: [''],
        titoloDiStudio: [''],
        altriTitoli: [''],
        coniugato: [''],
        figliAcarico: [''],
      }),
      commesse: this.formBuilder.array([]),
      contratto: this.formBuilder.group({
        tipoContratto: this.formBuilder.group({
          id: [''],
          descrizione: [''],
        }),
        livelloContratto: this.formBuilder.group({
          id: [''],
          ccnl: [''],
          descrizione: [''],
          minimiRet23: [''],
        }),
        tipoAzienda: this.formBuilder.group({
          id: [''],
          descrizione: [''],
        }),
        ccnl: this.formBuilder.group({
          id: [''],
          descrizione: [''],
        }),
        attivo: [''],
        sedeAssunzione: [''],
        qualifica: [''],
        dataAssunzione: [''],
        dataInizioProva: [''],
        dataFineProva: [''],
        dataFineRapporto: [''],
        mesiDurata: [''],
        livelloAttuale: [''],
        livelloFinale: [''],
        dimissioni: [''],
        partTime: [''],
        partTimeA: [''],
        retribuzioneMensileLorda: [''],
        superminimoMensile: [''],
        ralAnnua: [''],
        superminimoRal: [''],
        diariaMese: [''],
        diariaGg: [''],
        ticket: [''],
        valoreTicket: [''],
        categoriaProtetta: [''],
        tutor: [''],
        pfi: [''],
        assicurazioneObbligatoria: [''],
        corsoSicurezza: [''],
        motivazioneFineRapporto: [''],
        pc: [''],
        scattiAnzianita: [''],
        tariffaPartitaIva: [''],
        canaleReclutamento: [''],
      }),
      ruolo: this.formBuilder.group({
        id: [''],
        nome: [''],
        descrizione: [''],
      }),
    });
  }
  getCommessas(): FormArray {
    return this.anagraficaDto.get('commesse') as FormArray;
  }

  ngOnInit(): void {
    this.caricaListaUtenti();
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
    this.caricaDati();
    this.caricaRuoli();
  }

  // caricaDati(): void {
  //   this.anagraficaDtoService
  //     .detailAnagraficaDto(this.activatedRouter.snapshot.params['id'])
  //     .subscribe((resp: any) => {
  //       this.data = (resp as any)['anagraficaDto'];
  //       console.log(JSON.stringify(resp));
  //       this.anagraficaDto.patchValue(this.data);

  //       // Assegna l'array delle commesse a elencoCommesse
  //       this.elencoCommesse = this.data?.commessa ? [this.data.commessa] : [];
  //       console.log(this.elencoCommesse)
  //     });
  // }
  caricaDati(): void {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.activatedRouter.snapshot.params['id'])
      .subscribe((resp: any) => {
        this.data = (resp as any)['anagraficaDto'];
        console.log(JSON.stringify(resp));
        this.elencoCommesse = [this.data.commessa]; // Assegna i dati delle commesse all'array elencoCommesse
        this.anagraficaDto.patchValue(this.data);
        console.log(
          'Elenco commesse presenti: ' + JSON.stringify(this.elencoCommesse)
        );
      });
  }

  getCommessaFormGroup(index: number): FormGroup {
    return (this.anagraficaDto.get('commesse') as FormArray).controls[
      index
    ] as FormGroup;
  }

  addCommessa(): void {
    const commesseArray = this.anagraficaDto.get('commesse') as FormArray;
    commesseArray.push(this.creaFormCommessa());
  }

  removeCommessa(index: number): void {
    const commesseArray = this.anagraficaDto.get('commesse') as FormArray;
    commesseArray.removeAt(index);
  }

  creaFormCommessa(): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(''),
      cliente: new FormControl(''),
      clienteFinale: new FormControl(''),
      titoloPosizione: new FormControl(''),
      distacco: new FormControl(''),
      dataInizio: new FormControl(''),
      dataFine: new FormControl(''),
      costoMese: new FormControl(''),
      tariffaGiornaliera: new FormControl(''),
      nominativo: new FormControl(''),
      azienda: new FormControl(''),
      aziendaDiFatturazioneInterna: new FormControl(''),
      stato: new FormControl(false),
      attesaLavori: new FormControl(false),
    });
  }

  aggiorna() {
    // Ottieni i dati delle commesse dall'array 'commesse' nel form
    const commesse = this.anagraficaDto.get('commesse')?.value;

    // Crea il payload con i dati delle commesse corretti
    const payload = {
      anagrafica: this.anagraficaDto.get('anagrafica')?.value,
      commesse: commesse, // Usa i dati delle commesse estratti dal form
      contratto: this.anagraficaDto.get('contratto')?.value,
      ruolo: this.anagraficaDto.get('ruolo')?.value,
    };

    console.log('payload backend:', payload);
    this.anagraficaDtoService.update(payload).subscribe(
      (response) => {
        console.log('Payload inviato con successo al server:', response);
      },
      (error) => {
        console.error("Errore nell'invio del payload al server:", error);
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

  caricaTipoContratto() {
    this.anagraficaDtoService.getTipoContratto().subscribe((result: any) => {
      this.tipiContratti = (result as any)['list'];
    });
  }
  caricaLivelloContratto() {
    this.anagraficaDtoService.getLivelloContratto().subscribe((result: any) => {
      this.livelliContratti = (result as any)['list'];
    });
  }
  caricaTipoAzienda() {
    this.anagraficaDtoService.getTipoAzienda().subscribe((result: any) => {
      this.tipiAziende = (result as any)['list'];
    });
  }

  caricaContrattoNazionale() {
    this.anagraficaDtoService
      .getContrattoNazionale()
      .subscribe((result: any) => {
        this.ccnl = (result as any)['list'];
      });
  }
  caricaListaUtenti() {
    this.anagraficaDtoService.getListaUtenti().subscribe((result: any) => {
      this.utenti = (result as any)['list'];
    });
  }

  caricaRuoli() {
    this.anagraficaDtoService.getRuoli().subscribe((result: any) => {
      this.ruoli = (result as any)['list'];
    });
  }
}
