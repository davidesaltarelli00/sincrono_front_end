import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaDtoService } from './../anagraficaDto-service';
import { CommessaDuplicata } from './commessaDuplicata';
import { Commessa } from '../nuova-anagrafica-dto/commessa';

@Component({
  selector: 'app-modifica-anagrafica-dto',
  templateUrl: './modifica-anagrafica-dto.component.html',
  styleUrls: ['./modifica-anagrafica-dto.component.scss'],
})
export class ModificaAnagraficaDtoComponent implements OnInit {
  utenti: any = [];
  maxCommessaId: any;
  data: any;
  id = this.activatedRouter.snapshot.params['id'];
  submitted = false;
  errore = false;
  messaggio: any;
  showErrorPopup: any;
  showSuccessPopup: any;
  commessaDuplicata = new CommessaDuplicata();
  currentCommessa: any;
  //TIPOLOGICHE
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  ccnl: any = [];
  ruoli: any = [];
  currentStep = 1;
  anagraficaDto: FormGroup;
  commessePresenti = false;
  elencoCommesse: any[] = []; // Dichiarazione dell'array di FormGroup
  nuovoId: any;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.anagraficaDto = this.formBuilder.group({
      anagrafica: this.formBuilder.group({
        id: [this.id],
        attivo: [true],
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
        id:[''],
        tipoContratto: this.formBuilder.group({
          id: [''],
          descrizione: [''],
        }),
        livelloContratto: this.formBuilder.group({
          id: [''],
          ccnl: [''],
          livello: [''],
          minimiRet23: [''],
        }),
        tipoAzienda: this.formBuilder.group({
          id: [''],
          descrizione: [''],
        }),
        tipoCcnl: this.formBuilder.group({
          id: [''],
          descrizione: [''],
        }),
        attivo: [true],
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
    // this.caricaListaUtenti();
    // this.maxCommessaId = Math.max(
    //   ...this.elencoCommesse.map((commessa) => commessa.id),
    //   0
    // );
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
    this.caricaDati();
    this.caricaRuoli();
    this.creaFormCommessa();
  }

  initializeCommesse(): void {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    this.elencoCommesse.forEach((commessa) => {
      commesseFormArray.push(this.createCommessaFormGroup(commessa));
    });
  }

  createCommessaFormGroup(commessa: any): FormGroup {
    // const maxId = Math.max(
    //   ...this.elencoCommesse.map((commessa) => commessa.id),
    //   0
    // );
    // console.log(maxId);
    return this.formBuilder.group({
      id: [commessa.id],
      cliente: [commessa.cliente],
      clienteFinale: [commessa.clienteFinale],
      titoloPosizione: [commessa.titoloPosizione],
      distacco: [commessa.distacco],
      dataInizio: [commessa.dataInizio],
      dataFine: [commessa.dataFine],
      costoMese: [commessa.costoMese],
      tariffaGiornaliera: [commessa.tariffaGiornaliera],
      nominativo: [commessa.nominativo],
      azienda: [commessa.azienda],
      aziendaDiFatturazioneInterna: [commessa.aziendaDiFatturazioneInterna],
      stato: [commessa.stato || false],
      attesaLavori: [commessa.attesaLavori || false],
    });
  }

  getCommesseControls(): AbstractControl[] {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    return commesseFormArray.controls;
  }

  get commesseControls(): AbstractControl[] {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    return commesseFormArray.controls;
  }

  aggiungiCommessa(): void {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;

    const nuovaCommessa = {
      id: '',
      cliente: '',
      clienteFinale: '',
      titoloPosizione: '',
      distacco: '',
      dataInizio: '',
      dataFine: '',
      costoMese: '',
      tariffaGiornaliera: '',
      nominativo: '',
      azienda: '',
      aziendaDiFatturazioneInterna: '',
      stato: true,
      attesaLavori: '',
    };

    // Aggiungi il nuovo form group al FormArray
    commesseFormArray.push(this.createCommessaFormGroup(nuovaCommessa));
  }

  rimuoviCommessa(index: number): void {
    const conferma =
      'Sei sicuro di voler eliminare la commmessa numero ' + index + '?';
    if (confirm(conferma)) {
      const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
      commesseFormArray.removeAt(index);
    } else {
      return;
    }
  }

  // aggiorna() {
  //   const payload = {
  //     anagraficaDto: {
  //       anagrafica: this.anagraficaDto.get('anagrafica')?.value,
  //       commesse: this.anagraficaDto.get('commesse')?.value,
  //       contratto: this.anagraficaDto.get('contratto')?.value,
  //       ruolo: this.anagraficaDto.get('ruolo')?.value,
  //     },
  //   };

  //   // Converti l'oggetto payload in una stringa JSON formattata
  //   const payloadJson = JSON.stringify(payload, null, 2);

  //   console.log('Payload backend:', payloadJson);
  //   this.anagraficaDtoService.update(payload).subscribe(
  //     (response) => {
  //       console.log('Payload inviato con successo al server:', response);
  //     },
  //     (error) => {
  //       console.error("Errore nell'invio del payload al server:", error);
  //     }
  //   );
  // }

  aggiorna() {
    const payload = {
      anagraficaDto: {
        anagrafica: this.anagraficaDto.get('anagrafica')?.value,
        contratto: this.anagraficaDto.get('contratto')?.value,
        commesse: this.anagraficaDto.get('commesse')?.value,
        ruolo: this.anagraficaDto.get('ruolo')?.value,
      },
    };

    // Converti l'oggetto payload in una stringa JSON formattata
    const payloadJson = JSON.stringify(payload, null, 2);

    console.log('Payload backend:', payloadJson);
    this.anagraficaDtoService.update(payload).subscribe(
      (response) => {
        console.log('Payload inviato con successo al server:', response);
      },
      (error) => {
        console.error("Errore nell'invio del payload al server:", error);
      }
    );
  }

  caricaDati(): void {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.activatedRouter.snapshot.params['id'])
      .subscribe((resp: any) => {
        this.data = (resp as any)['anagraficaDto'];
        console.log(JSON.stringify(resp));
        this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
        this.anagraficaDto.patchValue(this.data);
        console.log(
          'Elenco commesse presenti: ' + JSON.stringify(this.elencoCommesse)
        );
        this.nuovoId = (resp as any)['anagraficaDto']['commesse']['id'] + 1;
        this.initializeCommesse();
      });
  }

  getCommessaFormGroup(index: number): FormGroup {
    return (this.anagraficaDto.get('commesse') as FormArray).controls[
      index
    ] as FormGroup;
  }

  removeCommessa(index: number): void {
    console.log('rimuovo la commessa numero ' + index);
    this.elencoCommesse.splice(index);
    console.log(this.elencoCommesse.length);
  }

  incrementID() {
    this.anagraficaDtoService
      .detailAnagraficaDto(this.activatedRouter.snapshot.params['id'])
      .subscribe((resp: any) => {
        this.nuovoId = (resp as any)['anagraficaDto']['commesse']['id'] + 1;
        if (this.nuovoId == null) {
          console.log('ID vuoto');
        } else {
          console.log('Nuovo id valorizzato: ' + this.nuovoId);
        }
      });
  }

  creaFormCommessa(): void {
    const nuovaCommessa: CommessaDuplicata = {
      id: this.elencoCommesse.length + 1,
      cliente: '',
      clienteFinale: '',
      titoloPosizione: '',
      distacco: '',
      dataInizio: '',
      dataFine: '',
      costoMese: '',
      tariffaGiornaliera: '',
      nominativo: '',
      azienda: '',
      aziendaDiFatturazioneInterna: '',
      stato: '',
      attesaLavori: '',
    };

    const nuovoFormGroup = this.formBuilder.group(nuovaCommessa);

    // Se il primo form, copia i valori dal primo elemento dell'array elencoCommesse
    if (this.elencoCommesse.length === 0) {
      const primoForm = this.elencoCommesse[0];
      if (primoForm) {
        nuovoFormGroup.patchValue(primoForm.value);
      }
    }

    this.elencoCommesse.push(nuovoFormGroup);
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
  // caricaListaUtenti() {
  //   this.anagraficaDtoService.getListaUtenti().subscribe((result: any) => {
  //     this.utenti = (result as any)['list'];
  //   });
  // }

  caricaRuoli() {
    this.anagraficaDtoService.getRuoli().subscribe((result: any) => {
      this.ruoli = (result as any)['list'];
    });
  }
}

/*
      id: [commessa.id],
      cliente: [commessa.cliente],
      clienteFinale: [commessa.clienteFinale],
      titoloPosizione: [commessa.titoloPosizione],
      distacco: [commessa.distacco],
      dataInizio: [commessa.dataInizio],
      dataFine: [commessa.dataFine],
      costoMese: [commessa.costoMese],
      tariffaGiornaliera: [commessa.tariffaGiornaliera],
      nominativo: [commessa.nominativo],
      azienda: [commessa.azienda],
      aziendaDiFatturazioneInterna: [commessa.aziendaDiFatturazioneInterna],
      stato: [commessa.stato],
      attesaLavori: [commessa.attesaLavori],
*/
