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
  selectedTipoCausaFineRapporto: any; // o il tipo appropriato per il valore selezionato
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
  tipologicaCanaliReclutamento: any[] = [];
  motivazioniFineRapporto: any[] = [];
  variabileGenerica: any;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    console.log(this.id);
    this.anagraficaDto = this.formBuilder.group({
      anagrafica: this.formBuilder.group({
        id: [this.id],
        attivo: [true],
        tipoAzienda: this.formBuilder.group({id: [''],}),
        nome: ['', Validators.required],
        cognome: ['', Validators.required],
        codiceFiscale: ['', Validators.required],
        comuneDiNascita: [''],
        dataDiNascita: [''],
        residenza: [''],
        domicilio: [''],
        cellularePrivato: ['', Validators.pattern(/^[0-9]{10}$/)],
        cellulareAziendale: ['', Validators.pattern(/^[0-9]{10}$/)],
        mailPrivata: [ '', Validators.pattern( '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$' ),],
        mailAziendale: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),],],
        mailPec: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),],],
        titoliDiStudio: [''],
        altriTitoli: [''],
        coniugato: [''],
        figliAcarico: [''],
      }),
      commesse: this.formBuilder.array([]),

      contratto: this.formBuilder.group({
        id: [''],
        attivo: [''],
        aziendaDiFatturazioneInterna: [''],
        tipoAzienda: this.formBuilder.group({
          id: [''],
        }),
        tipoContratto: this.formBuilder.group({
          id: [''],
        }),
        tipoLivelloContratto: this.formBuilder.group({
          id: [''],
        }),
        tipoCcnl: this.formBuilder.group({
          id: [''],
        }), //diariaAnnua
        qualifica: [''],
        sedeAssunzione: [''],
        dataAssunzione: ['', Validators.required],
        dataInizioProva: ['', Validators.required],
        dataFineProva: [''],
        dataFineRapporto: [''],
        mesiDurata: ['', Validators.required],
        livelloIniziale: [''],
        dimissioni: [''],
        partTime: [''],
        percentualePartTime: [''],
        retribuzioneMensileLorda: [''],
        superminimoMensile: [''],
        ralAnnua: [''],
        superminimoRal: [''],
        diariaMese: [''],
        diariaGg: [''],
        ticket: [''],
        valoreTicket: ['', Validators.maxLength(50)],
        categoriaProtetta: [''],
        tutor: [''],
        pfi: [''],
        corsoSicurezza: [''],
        dataCorsoSicurezza: [''],
        tipoCausaFineRapporto: this.formBuilder.group({
          id: [''],
          descrizione: [''],
        }),
        scattiAnzianita: [''],
        assicurazioneObbligatoria: [''],
        pc: [''],
        tariffaPartitaIva: [''],
        tipoCanaleReclutamento: this.formBuilder.group({
          id: ['', Validators.required],
          descrizione: [''],
        }),
        visitaMedica: [''],
        dataVisitaMedica: [''],
      }),

      ruolo: this.formBuilder.group({
        id: [''],
        // nome: [''],
        // descrizione: [''],
      }),
    });
  }
  getCommessas(): FormArray {
    return this.anagraficaDto.get('commesse') as FormArray;
  }

  ngOnInit(): void {
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
    this.caricaDati();
    this.caricaRuoli();
    this.creaFormCommessa();
    this.caricaTipoCanaleReclutamento();
    this.caricaTipoCausaFineRapporto();
  }

  initializeCommesse(): void {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    this.elencoCommesse.forEach((commessa) => {
      commesseFormArray.push(this.createCommessaFormGroup(commessa));
    });
  }

  createCommessaFormGroup(commessa: any): FormGroup {
    return this.formBuilder.group({
      id: [commessa.id],
      aziendaCliente: [commessa.aziendaCliente],
      clienteFinale: [commessa.clienteFinale],
      titoloPosizione: [commessa.titoloPosizione],
      distacco: [commessa.distacco],
      distaccoAzienda: [commessa.distaccoAzienda],
      distaccoData: [commessa.distaccoData],
      dataInizio: [commessa.dataInizio],
      dataFine: [commessa.dataFine],
      tariffaGiornaliera: [commessa.tariffaGiornaliera],
      // nominativo: [commessa.nominativo],
      // azienda: [commessa.azienda],
      aziendaDiFatturazioneInterna: [commessa.aziendaDiFatturazioneInterna],
      attivo: [commessa.attivo || false],
      attesaLavori: [commessa.attesaLavori || false],
    });
  }

  // caricaTipoCausaFineRapporto(event:any) {
  //   console.log('Funzione caricaTipoCausaFineRapporto chiamata');
  //   const selectedValue = event.target.value;
  //   console.log('Valore selezionato:', selectedValue);
  //   this.anagraficaDtoService
  //     .caricaTipoCausaFineRapporto(localStorage.getItem('token'))
  //     .subscribe(
  //       (res: any) => {
  //         this.motivazioniFineRapporto = (res as any)['list'];
  //         console.log(
  //           'Elenco motivazioni fine rapporto:' + JSON.stringify(res)
  //         );

  //       },
  //       (error: any) => {
  //         console.log(
  //           'Errore durante il caricamento della tipologica Motivazione fine rapporto: ' +
  //             JSON.stringify(error)
  //         );
  //       }
  //     );
  // }

 caricaTipoCausaFineRapporto() {
    this.anagraficaDtoService
      .caricaTipoCausaFineRapporto(localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          this.motivazioniFineRapporto = (res as any)['list'];
          console.log('Elenco motivazioni fine rapporto:', JSON.stringify(res));
        },
        (error: any) => {
          console.log('Errore durante il caricamento della tipologica Motivazione fine rapporto:', JSON.stringify(error));
        }
      );
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
      aziendaCliente: '',
      clienteFinale: '',
      titoloPosizione: '',
      distacco: '',
      distaccoAzienda: '',
      distaccoData: '',
      dataInizio: '',
      dataFine: '',
      tariffaGiornaliera: '',
      aziendaDiFatturazioneInterna: '',
      attivo: true,
      attesaLavori: '',
    };

    commesseFormArray.push(this.createCommessaFormGroup(nuovaCommessa));
  }

  storicizza(index: number) {
    console.log('ID COMMESSA: ' + JSON.stringify(this.elencoCommesse[index]));
  }

  rimuoviCommessa(index: number): void {
    const conferma =
      'Sei sicuro di voler eliminare la commessa con indice ' + index + '?';
    if (confirm(conferma)) {
      const body = JSON.stringify({
        commessa: this.elencoCommesse[index],
      });
      console.log(body);
      this.anagraficaDtoService
        .deleteCommessa(body, localStorage.getItem('token'))
        .subscribe(
          (res: any) => {
            console.log(
              'Commessa con indice ' +
                index +
                ' eliminata correttamente. Risposta:',
              res
            );
            // Rimuovi l'elemento dall'array locale
            this.elencoCommesse.splice(index, 1);
            // this.caricaDati();
          },
          (error: any) => {
            console.log(
              "Errore durante l'eliminazione della commessa con indice " +
                index +
                ': ' +
                error
            );
          }
        );
    }
  }

  caricaTipoCanaleReclutamento() {
    this.anagraficaDtoService
      .caricaTipoCanaleReclutamento(localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          this.tipologicaCanaliReclutamento = (res as any)['list'];
          console.log('ElencoCanali reclutamento:' + JSON.stringify(res));
        },
        (error: any) => {
          console.log(
            'Errore durante il caricamento della tipologica Motivazione fine rapporto: ' +
              JSON.stringify(error)
          );
        }
      );
  }

  aggiorna() {
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === '' || obj[key] === null) {
          delete obj[key];
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
        if (obj.tipoCcnl && Object.keys(obj.tipoCcnl).length === 0) {
          delete obj.tipoCcnl;
        }
        if (
          obj.tipoLivelloContratto &&
          Object.keys(obj.tipoLivelloContratto).length === 0
        ) {
          delete obj.tipoLivelloContratto;
        }
        if (
          obj.tipoCausaFineRapporto &&
          Object.keys(obj.tipoCausaFineRapporto).length === 0
        ) {
          delete obj.tipoCausaFineRapporto;
        }
      });
    };
    removeEmpty(this.anagraficaDto.value);

    console.log("Valore di anagrafica: "+JSON.stringify(this.anagraficaDto.get('anagrafica')?.value));
    const payload = {
      anagraficaDto: {
        anagrafica: this.anagraficaDto.get('anagrafica')?.value,
        contratto: this.anagraficaDto.get('contratto')?.value,
        commesse: this.anagraficaDto.get('commesse')?.value,
        ruolo: this.anagraficaDto.get('ruolo')?.value,
      },
    };
    console.log('Payload backend:', payload);
    this.anagraficaDtoService
      .update(payload, localStorage.getItem('token'))
      .subscribe(
        (response) => {
          if ((response as any).esito.code != 200) {
            alert('Modifica non riuscita:\n' + (response as any).esito.target);
            this.errore = true;
            this.messaggio = (response as any).esito.target;
          } else {
            console.log('Payload inviato con successo al server:', response);
            this.router.navigate(['/dettaglio-anagrafica/' + this.id]);
          }
        },
        (error) => {
          console.error("Errore nell'invio del payload al server:", error);
        }
      );
  }

  caricaDati(): void {
    this.anagraficaDtoService
      .detailAnagraficaDto(
        this.activatedRouter.snapshot.params['id'],
        localStorage.getItem('token')
      )
      .subscribe((resp: any) => {
        console.log(this.activatedRouter.snapshot.params['id']);
        this.data = (resp as any)['anagraficaDto'];
        console.log(JSON.stringify(resp));
        this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
        console.log('Dati delle commesse:', this.elencoCommesse);
        console.log(
          'Elenco commesse presenti: ' + JSON.stringify(this.elencoCommesse)
        );
        this.initializeCommesse();
        this.anagraficaDto.patchValue(this.data);
      });
  }

  getCommessaFormGroup(index: number): FormGroup {
    return (this.anagraficaDto.get('commesse') as FormArray).controls[
      index
    ] as FormGroup;
  }

  creaFormCommessa(): void {
    const nuovaCommessa: CommessaDuplicata = {
      id: this.elencoCommesse.length + 1,
      aziendaCliente: '',
      clienteFinale: '',
      titoloPosizione: '',
      distacco: '',
      distaccoAzienda: '',
      distaccoData: '',
      dataInizio: '',
      dataFine: '',
      tariffaGiornaliera: '',
      aziendaDiFatturazioneInterna: '',
      attivo: '',
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

  // transformDate(dateString: string): string {
  //   const dateObject = new Date(dateString);
  //   return dateObject.toLocaleDateString('en-GB', {
  //     day: '2-digit',
  //     month: 'numeric',
  //     year: 'numeric',
  //   });
  // }
  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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
    this.anagraficaDtoService
      .getTipoContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiContratti = (result as any)['list'];
      });
  }
  caricaLivelloContratto() {
    this.anagraficaDtoService
      .getLivelloContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.livelliContratti = (result as any)['list'];
      });
  }
  caricaTipoAzienda() {
    this.anagraficaDtoService
      .getTipoAzienda(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.tipiAziende = (result as any)['list'];
      });
  }

  caricaContrattoNazionale() {
    this.anagraficaDtoService
      .getContrattoNazionale(localStorage.getItem('token'))
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
    this.anagraficaDtoService
      .getRuoli(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.ruoli = (result as any)['list'];
      });
  }
}
