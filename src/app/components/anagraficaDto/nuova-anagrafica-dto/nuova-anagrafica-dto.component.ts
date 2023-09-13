import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { Router } from '@angular/router';
import { ContrattoService } from '../../contratto/contratto-service';
import { ThemePalette } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/GG',
  },
  display: {
    dateInput: 'YYYY/MM/GG',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-nuova-anagrafica-dto',
  templateUrl: './nuova-anagrafica-dto.component.html',
  styleUrls: ['./nuova-anagrafica-dto.component.scss'],
})
export class NuovaAnagraficaDtoComponent implements OnInit {
  data: any = [];
  variabileGenerica: any;
  utenti: any = [];
  isFormDuplicated: boolean = false;
  currentStep = 1;
  motivazioniFineRapporto: any[] = [];
  tipologicaCanaliReclutamento: any[] = [];
  submitted = false;
  errore = false;
  messaggio: any;
  showErrorPopup: any;
  showSuccessPopup: any;
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  contrattiNazionali: any = [];
  ruoli: any = [];
  userlogged: string = '';
  formsDuplicati: boolean[] = [];
  AnagraficaDto: FormGroup;
  commesse!: FormArray;
  showErrorAlert: boolean = false;
  missingFields: string[] = [];
  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private contrattoService: ContrattoService
  ) {
    this.AnagraficaDto = this.formBuilder.group({
      anagrafica: this.formBuilder.group({
        tipoAzienda: new FormGroup({
          id: new FormControl('', Validators.required),
        }),
        nome: new FormControl('', Validators.required),
        cognome: new FormControl('', Validators.required),
        codiceFiscale: new FormControl('', [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(16),
        ]),
        cellularePrivato: new FormControl('', [
          Validators.pattern(/^[0-9]{10}$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
        cellulareAziendale: new FormControl('', [
          Validators.pattern(/^[0-9]{10}$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
        mailPrivata: new FormControl(
          '',
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          )
        ),
        mailPec: new FormControl(
          '',
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          )
        ),
        mailAziendale: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ]),
        titoliDiStudio: new FormControl(''),
        altriTitoli: new FormControl(''),
        comuneDiNascita: new FormControl(''),
        residenza: new FormControl(''),
        domicilio: new FormControl(''),
        dataDiNascita: new FormControl(''),
        coniugato: new FormControl(''),
        figliACarico: new FormControl(''),
      }),
      commesse: this.formBuilder.array([]),

      contratto: this.formBuilder.group({
        attivo: new FormControl(''),
        aziendaDiFatturazioneInterna: new FormControl(''),
        tipoAzienda: new FormGroup({
          id: new FormControl(''),
        }),
        tipoContratto: new FormGroup({
          id: new FormControl(''),
        }),
        tipoLivelloContratto: new FormGroup({
          id: new FormControl(''),
        }),
        tipoCcnl: new FormGroup({
          id: new FormControl(''),
        }),
        qualifica: new FormControl(''),
        sedeAssunzione: new FormControl(''),
        dataAssunzione: new FormControl(''), //, Validators.required
        dataInizioProva: new FormControl(''),
        dataFineProva: new FormControl(''),
        dataFineRapporto: new FormControl(''),
        mesiDurata: new FormControl(''), //, Validators.required
        livelloIniziale: new FormControl(''),
        dimissioni: new FormControl(''),
        partTime: new FormControl(''),
        percentualePartTime: new FormControl(''),
        retribuzioneMensileLorda: new FormControl(''),
        superminimoMensile: new FormControl(''),
        ralAnnua: new FormControl(''),
        superminimoRal: new FormControl(''),
        diariaMese: new FormControl(''),
        diariaGg: new FormControl(''),
        ticket: new FormControl(''),
        valoreTicket: new FormControl('', Validators.maxLength(50)),
        categoriaProtetta: new FormControl(''),
        tutor: new FormControl(''),
        pfi: new FormControl(''),
        corsoSicurezza: new FormControl(''),
        dataCorsoSicurezza: new FormControl(''),
        scattiAnzianita: new FormControl(''),
        assicurazioneObbligatoria: new FormControl(''),
        pc: new FormControl(''),
        tariffaPartitaIva: new FormControl(''),
        tipoCanaleReclutamento: new FormGroup({
          id: new FormControl(''),
          descrizione: new FormControl(''),
        }),
        visitaMedica: new FormControl(''),
        dataVisitaMedica: new FormControl(''),
      }),
      ruolo: this.formBuilder.group({
        id: new FormControl(''),
      }),
    });

    this.commesse = this.AnagraficaDto.get('commesse') as FormArray;

    this.caricaListaUtenti();

    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
    // this.caricaTipoCausaFineRapporto();
    this.caricaRuoli();
    this.caricaTipoCanaleReclutamento();
  }

  ngOnInit(): void {}

  aggiungiCommessa() {
    const commessaFormGroup = this.creaFormCommessa();
    this.commesse.push(commessaFormGroup);
    // this.isFormDuplicated = true;
    this.formsDuplicati.push(true);
  }

  creaFormCommessa(): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(''),
      aziendaCliente: new FormControl(''),
      clienteFinale: new FormControl(''),
      titoloPosizione: new FormControl(''),
      distacco: new FormControl(false),
      distaccoAzienda: new FormControl(''),
      distaccoData: new FormControl(''),
      costoMese: new FormControl(''),
      dataInizio: new FormControl(''),
      dataFine: new FormControl(''),
      tariffaGiornaliera: new FormControl(''),
      nominativo: new FormControl(''),
      // azienda: new FormControl(''),
      aziendaDiFatturazioneInterna: new FormControl(''),
      attivo: new FormControl(true),
      attesaLavori: new FormControl(''),
    });
  }

  rimuoviCommessa(index: number) {
    this.commesse.removeAt(index);
    this.formsDuplicati.splice(index);
    // console.log(index);
    // const buttonDuplica = document.getElementById("button-duplica");
    // if (buttonDuplica) {
    //   if (index === 1) {
    //     buttonDuplica.setAttribute("disabled", "false");
    //   } else {
    //     buttonDuplica.setAttribute("disabled", "true");
    //   }
    // }
  }

  // caricaTipoCausaFineRapporto() {
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

  caricaListaUtenti() {
    this.anagraficaDtoService
      .getListaUtenti(localStorage.getItem('token'))
      .subscribe((result: any) => {
        // console.log(result);
        this.utenti = (result as any)['list'];
      });
  }

  setStep1() {
    this.currentStep = 1;
  }
  setStep2() {
    this.currentStep = 2;
  }
  setStep3() {
    this.currentStep = 3;
  }

  nextStep() {
    this.currentStep++;
    // console.log(this.currentStep);
  }

  prevStep() {
    this.currentStep--;
    // console.log(this.currentStep);
  }

  submitForm() {
    // Handle form submission
  }

  inserisci() {
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
        if (
          obj.tipoCanaleReclutamento &&
          Object.keys(obj.tipoCanaleReclutamento).length === 0
        ) {
          delete obj.tipoCanaleReclutamento;
        }
      });
    };
    removeEmpty(this.AnagraficaDto.value);

    this.showErrorAlert = false;
    this.missingFields = [];
    if (this.AnagraficaDto.invalid) {
      console.log('Qualcosa e andato storto, controlla i campi e riprova.');
    } else {
      const body = JSON.stringify({
        anagraficaDto: this.AnagraficaDto.value,
      });
      console.log('Backend payload: ' + body);

      this.anagraficaDtoService
        .insert(body, localStorage.getItem('token'))
        .subscribe((result) => {
          if ((result as any).esito.code !== 200) {
            alert(
              'Inserimento non riuscito\n' +
                'Target: ' +
                (result as any).esito.target
            );
            this.errore = true;
            this.messaggio = (result as any).esito.target;
          } else {
            alert('Inserimento riuscito');
            console.log(this.AnagraficaDto.value);
            this.router.navigate(['/lista-anagrafica']);
          }
        });
    }
  }

  /*chiudiPopup() {
    this.showErrorPopup = false;
    this.showSuccessPopup = false;
  }*/

  caricaTipoContratto() {
    this.contrattoService
      .getTipoContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        // console.log(result);
        this.tipiContratti = (result as any)['list'];
      });
  }
  caricaLivelloContratto() {
    this.contrattoService
      .getLivelloContratto(localStorage.getItem('token'))
      .subscribe((result: any) => {
        // console.log(result);
        this.livelliContratti = (result as any)['list'];
      });
  }
  caricaTipoAzienda() {
    this.contrattoService
      .getTipoAzienda(localStorage.getItem('token'))
      .subscribe((result: any) => {
        // console.log(result);
        this.tipiAziende = (result as any)['list'];
      });
  }

  caricaContrattoNazionale() {
    this.contrattoService
      .getContrattoNazionale(localStorage.getItem('token'))
      .subscribe((result: any) => {
        console.log('caricaContrattoNazionale' + result);
        this.contrattiNazionali = (result as any)['list'];
      });
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
    const control = this.AnagraficaDto.get(controlName);
    const inputElement = document.getElementById(controlName);

    if (!(control?.dirty && control?.value != null && control?.value != '')) {
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

  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  caricaRuoli() {
    this.anagraficaDtoService
      .getRuoli(localStorage.getItem('token'))
      .subscribe((result: any) => {
        this.ruoli = (result as any)['list'];
        console.log(this.ruoli);
      });
  }
}

// vecchio codice nel metodo inserisci:
// this.submitted = true;
// console.log('Inserisco');
// const removeEmpty = (obj: any) => {
//   Object.keys(obj).forEach((key) => {
//     if (obj[key] && typeof obj[key] === 'object') {
//       removeEmpty(obj[key]);
//     } else if (obj[key] === '') {
//       delete obj[key];
//     }
//     if (obj.anagrafica && Object.keys(obj.anagrafica).length === 0) {
//       delete obj.anagrafica;
//     }
//     if (obj.commessa && Object.keys(obj.commessa).length === 0) {
//       delete obj.commessa;
//     }
//     if (obj.contratto && Object.keys(obj.contratto).length === 0) {
//       delete obj.contratto;
//     }
//     if (obj.tipoContratto && Object.keys(obj.tipoContratto).length === 0) {
//       delete obj.tipoContratto;
//     }
//     if (obj.tipoAzienda && Object.keys(obj.tipoAzienda).length === 0) {
//       delete obj.tipoAzienda;
//     }
//     if (
//       obj.contrattoNazionale &&
//       Object.keys(obj.contrattoNazionale).length === 0
//     ) {
//       delete obj.contrattoNazionale;
//     }
//     if (
//       obj.livelloContratto &&
//       Object.keys(obj.livelloContratto).length === 0
//     ) {
//       delete obj.livelloContratto;
//     }
//     if (obj.ruolo && Object.keys(obj.ruolo).length === 0) {
//       delete obj.ruolo;
//     }
//   });
// };

// removeEmpty(this.AnagraficaDto.value);

// let check = true;

// if (this.AnagraficaDto.value.anagrafica != null) {
//   if (
//     this.checkValid([
//       'anagrafica.nome',
//       'anagrafica.cognome',
//       'anagrafica.codiceFiscale',
//       'anagrafica.mailAziendale',
//     ])
//   ) {
//     return;
//   }
// } else {
//   return;
// }

// if (this.AnagraficaDto.value.commessa != null) {
//   if (
//     this.checkValid([
//       'commessa.cliente',
//       'commessa.dataInizio',
//       'commessa.dataFine',
//       'commessa.nominativo',
//     ])
//   ) {
//     return;
//   }
// } else {
//   this.reset([
//     'commessa.cliente',
//     'commessa.dataInizio',
//     'commessa.dataFine',
//     'commessa.nominativo',
//   ]);
// }

// if (this.AnagraficaDto.value.contratto != null) {
//   if (
//     (check = this.checkValid([
//       'contratto.tipoContratto.id',
//       'contratto.livelloContratto.id',
//       'contratto.contrattoNazionale.id',
//       'contratto.tipoAzienda.id',
//     ]))
//   ) {
//     return;
//   }
// } else {
//   this.reset([
//     'contratto.tipoContratto.id',
//     'contratto.livelloContratto.id',
//     'contratto.contrattoNazionale.id',
//     'contratto.tipoAzienda.id',
//   ]);
// }
