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
import { DatePipe } from '@angular/common';

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
  isDataFineRapportoDisabled: any;
  percentualePartTimeValue: number | null = null;

  //dati per i controlli nei form
  inseritoContrattoIndeterminato = true;

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private contrattoService: ContrattoService,
    private datePipe: DatePipe
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
          Validators.maxLength(15),

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
        coniugato: new FormControl(false),
        figliACarico: new FormControl(false),
        attesaLavori: new FormControl(false),
      }),
      commesse: this.formBuilder.array([]),

      contratto: this.formBuilder.group({
        attivo: new FormControl(''),
        // aziendaDiFatturazioneInterna: new FormControl(''),
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
        dataFineRapporto: new FormControl(''), //, Validators.required
        mesiDurata: new FormControl(''), //, Validators.required
        livelloAttuale: new FormControl(''), // +
        livelloFinale: new FormControl(''), //+
        ralPartTime: new FormControl(''),
        diariaAnnua: new FormControl(''), //+
        partTime: new FormControl(''),
        percentualePartTime: new FormControl(''),
        retribuzioneMensileLorda: new FormControl(''),
        superminimoMensile: new FormControl(''),
        ralAnnua: new FormControl(''),
        superminimoRal: new FormControl(''),
        diariaMensile: new FormControl(''),
        diariaGiornaliera: new FormControl(''),
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
        retribuzioneNettaGiornaliera: new FormControl(''),
        retribuzioneNettaMensile: new FormControl(''),
        tipoCanaleReclutamento: new FormGroup({
          id: new FormControl(''),
          descrizione: new FormControl(''),
        }),
        // tipoCausaFineRapporto: new FormGroup({
        //   id: new FormControl(''),
        //   descrizione: new FormControl(''),
        // }),
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

  ngOnInit(): void {
    const distaccoAziendaControl = this.AnagraficaDto.get(
      'commesse.distaccoAzienda'
    );
    const distaccoDataControl = this.AnagraficaDto.get('commesse.distaccoData');

    if (distaccoAziendaControl && distaccoDataControl) {
      distaccoAziendaControl.disable();
      distaccoDataControl.disable();
    }

    const dataCorsoSicurezzaControl = this.AnagraficaDto.get(
      'contratto.dataCorsoSicurezza'
    );
    if (dataCorsoSicurezzaControl) {
      dataCorsoSicurezzaControl.disable();
    }

    const tutorControl = this.AnagraficaDto.get('contratto.tutor');
    if (tutorControl) {
      tutorControl.disable();
    }

    const ralPartTimeControl = this.AnagraficaDto.get('contratto.ralPartTime');
    if (ralPartTimeControl) {
      ralPartTimeControl.disable();
    }

    const tipoAziendaControlAnagrafica = this.AnagraficaDto.get(
      'anagrafica.tipoAzienda.id'
    );
    const tipoAziendaControlContratto = this.AnagraficaDto.get(
      'contratto.tipoAzienda.id'
    );

    const valoreTicketControl = this.AnagraficaDto.get(
      'contratto.valoreTicket'
    );
    if (valoreTicketControl) {
      valoreTicketControl.disable();
    }

    const dataVisitaMedicaControl = this.AnagraficaDto.get(
      'contratto.dataVisitaMedica'
    );
    if (dataVisitaMedicaControl) {
      dataVisitaMedicaControl.disable();
    }

    // Aggiungi un listener valueChanges per il controllo tipoAzienda in anagrafica
    tipoAziendaControlAnagrafica?.valueChanges.subscribe((value) => {
      tipoAziendaControlContratto?.setValue(value, { emitEvent: false });
    });

    // Aggiungi un listener valueChanges per il controllo tipoAzienda in contratto
    tipoAziendaControlContratto?.valueChanges.subscribe((value) => {
      tipoAziendaControlAnagrafica?.setValue(value, { emitEvent: false });
    });

    this.AnagraficaDto.get('contratto.dataAssunzione')?.valueChanges.subscribe(
      () => {
        this.calculateDataFineRapporto();
      }
    );

    this.AnagraficaDto.get('contratto.mesiDurata')?.valueChanges.subscribe(
      () => {
        this.calculateDataFineRapporto();
      }
    );
  }

  onChangeConiugato(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  onDistaccoChange(event: Event) {
    const distaccoAziendaControl = this.AnagraficaDto.get(
      'commesse.distaccoAzienda'
    );
    const distaccoDataControl = this.AnagraficaDto.get('commesse.distaccoData');
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        distaccoAziendaControl?.enable();
        distaccoDataControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        distaccoAziendaControl?.disable();
        distaccoDataControl?.disable();
      }
    }
  }

  aggiungiCommessa() {
    const commessaFormGroup = this.creaFormCommessa();
    this.commesse.push(commessaFormGroup);
    // this.isFormDuplicated = true;
    this.formsDuplicati.push(true);
  }

  onTipoContrattoChange(event: any) {
    const selectedTipoContrattoId = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );
    console.log('SELEZIONATO TIPO CONTRATTO CON ID:' + selectedTipoContrattoId);
    const dataFineRapportoControl = this.AnagraficaDto.get(
      'contratto.dataFineRapporto'
    );
    const mesiDurataControl = this.AnagraficaDto.get('contratto.mesiDurata');
    const tutorControl = this.AnagraficaDto.get('contratto.tutor');
    const PFIcontrol = this.AnagraficaDto.get('contratto.pfi');
    const superminimoMensileControl = this.AnagraficaDto.get(
      'contratto.superminimoMensile'
    );
    const ralAnnuaControl = this.AnagraficaDto.get('contratto.ralAnnua');
    const superminimoRalControl = this.AnagraficaDto.get(
      'contratto.superminimoRal'
    );
    const diariaMensileControl = this.AnagraficaDto.get(
      'contratto.diariaMensile'
    );
    const diariaGiornalieraControl = this.AnagraficaDto.get(
      'contratto.diariaGiornaliera'
    );
    const scattiAnzianitaControl = this.AnagraficaDto.get(
      'contratto.scattiAnzianita'
    );
    const retribuzioneMensileLordaControl = this.AnagraficaDto.get(
      'contratto.retribuzioneMensileLorda'
    );
    const retribuzioneNettaMensileControl = this.AnagraficaDto.get(
      'contratto.retribuzioneNettaMensile'
    );
    const tariffaPartitaIvaControl = this.AnagraficaDto.get(
      'contratto.tariffaPartitaIva'
    );

    const livelloAttualeControl = this.AnagraficaDto.get(
      'contratto.livelloAttuale'
    );
    const livelloFinaleControl = this.AnagraficaDto.get(
      'contratto.livelloFinale'
    );

    switch (selectedTipoContrattoId) {
      case 1: // Contratto STAGE
        if (
          mesiDurataControl &&
          retribuzioneMensileLordaControl &&
          PFIcontrol &&
          tutorControl &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          superminimoRalControl &&
          diariaMensileControl &&
          diariaGiornalieraControl &&
          scattiAnzianitaControl &&
          tariffaPartitaIvaControl &&
          // livelloAttualeControl &&
          retribuzioneNettaMensileControl
          // &&
          // livelloFinaleControl
        ) {
          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(800);

          retribuzioneNettaMensileControl.enable();
          retribuzioneNettaMensileControl.setValue(600);

          livelloAttualeControl?.disable();
          livelloAttualeControl?.setValue(null);

          livelloFinaleControl?.disable();
          livelloFinaleControl?.setValue(null);

          PFIcontrol.enable();
          tutorControl.enable();

          superminimoMensileControl.disable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.disable();
          ralAnnuaControl.setValue('');

          superminimoRalControl.disable();
          superminimoRalControl.setValue('');

          diariaMensileControl.disable();
          diariaMensileControl.setValue('');

          diariaGiornalieraControl.disable();
          diariaGiornalieraControl.setValue('');

          scattiAnzianitaControl.disable();
          scattiAnzianitaControl.setValue('');

          tariffaPartitaIvaControl.disable();
          tariffaPartitaIvaControl.setValue('');

          mesiDurataControl.setValue(6);
          mesiDurataControl.enable();
          this.calculateDataFineRapporto();

          dataFineRapportoControl?.enable();
          dataFineRapportoControl?.setValue(null);
        }
        break;

      case 2: // Contratto PARTITA IVA
        if (
          tariffaPartitaIvaControl &&
          PFIcontrol &&
          tutorControl &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          retribuzioneMensileLordaControl &&
          dataFineRapportoControl &&
          mesiDurataControl
        ) {
          livelloAttualeControl?.disable();
          livelloAttualeControl?.setValue(null);

          livelloFinaleControl?.disable();
          livelloFinaleControl?.setValue(null);

          tariffaPartitaIvaControl.enable();
          tariffaPartitaIvaControl.setValue('');

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(null);

          PFIcontrol.disable();
          PFIcontrol.setValue('');

          tutorControl.disable();
          tutorControl.setValue('');

          superminimoMensileControl.disable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.disable();
          ralAnnuaControl.setValue('');

          dataFineRapportoControl.disable();
          dataFineRapportoControl.setValue('');

          mesiDurataControl.disable();
          mesiDurataControl.setValue('');
        }
        break;

      case 3: // Contratto a tempo determinato
        if (
          mesiDurataControl &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          superminimoRalControl &&
          PFIcontrol &&
          tutorControl &&
          diariaMensileControl &&
          diariaGiornalieraControl &&
          scattiAnzianitaControl &&
          tariffaPartitaIvaControl &&
          retribuzioneMensileLordaControl &&
          dataFineRapportoControl
        ) {
          mesiDurataControl.enable();
          mesiDurataControl.setValue('');

          dataFineRapportoControl.enable();
          dataFineRapportoControl.setValue(null);

          PFIcontrol.disable();
          PFIcontrol.setValue('');

          tutorControl.disable();
          tutorControl.setValue('');

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(null);

          superminimoMensileControl.enable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.enable();
          ralAnnuaControl.setValue('');

          superminimoRalControl.enable();
          superminimoRalControl.setValue('');

          diariaMensileControl.enable();
          diariaMensileControl.setValue('');

          diariaGiornalieraControl.enable();
          diariaGiornalieraControl.setValue('');

          scattiAnzianitaControl.enable();
          scattiAnzianitaControl.setValue('');

          tariffaPartitaIvaControl.disable();
          tariffaPartitaIvaControl.setValue('');

          livelloAttualeControl?.enable();
          livelloAttualeControl?.setValue(null);

          livelloFinaleControl?.enable();
          livelloFinaleControl?.setValue(null);
        }
        break;
      case 4: // Contratto a tempo indeterminato
        if (
          mesiDurataControl &&
          dataFineRapportoControl &&
          tariffaPartitaIvaControl &&
          tutorControl &&
          PFIcontrol &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          superminimoRalControl &&
          diariaMensileControl &&
          diariaGiornalieraControl &&
          scattiAnzianitaControl &&
          retribuzioneMensileLordaControl
        ) {
          mesiDurataControl.disable();
          mesiDurataControl.setValue(1000);

          dataFineRapportoControl.disable();
          dataFineRapportoControl.setValue(null);

          tariffaPartitaIvaControl.disable();
          tariffaPartitaIvaControl.setValue('');

          tutorControl.disable();
          tutorControl.setValue('');

          PFIcontrol.disable();
          PFIcontrol.setValue('');

          superminimoMensileControl.enable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.enable();
          ralAnnuaControl.setValue('');

          superminimoRalControl.enable();
          superminimoRalControl.setValue('');

          diariaMensileControl.enable();
          diariaMensileControl.setValue('');

          diariaGiornalieraControl.enable();
          diariaGiornalieraControl.setValue('');

          scattiAnzianitaControl.enable();
          scattiAnzianitaControl.setValue('');

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(null);

          livelloAttualeControl?.enable();
          livelloAttualeControl?.setValue(null);

          livelloFinaleControl?.enable();
          livelloFinaleControl?.setValue(null);
        }
        break;

      case 5: // Contratto di apprendistato
        if (
          mesiDurataControl &&
          dataFineRapportoControl &&
          tariffaPartitaIvaControl &&
          tutorControl &&
          PFIcontrol &&
          superminimoMensileControl &&
          ralAnnuaControl &&
          superminimoRalControl &&
          diariaMensileControl &&
          diariaGiornalieraControl &&
          scattiAnzianitaControl &&
          retribuzioneMensileLordaControl
        ) {
          mesiDurataControl.enable();
          mesiDurataControl.setValue(36);
          this.calculateDataFineRapporto();

          dataFineRapportoControl.enable();
          dataFineRapportoControl.setValue(null);

          tariffaPartitaIvaControl.enable();
          tariffaPartitaIvaControl.setValue('');

          livelloAttualeControl?.enable();
          livelloAttualeControl?.setValue(null);

          livelloFinaleControl?.enable();
          livelloFinaleControl?.setValue(null);

          tutorControl.enable();
          tutorControl.setValue('');

          PFIcontrol.enable();
          PFIcontrol.setValue('');

          superminimoMensileControl.enable();
          superminimoMensileControl.setValue('');

          ralAnnuaControl.enable();
          ralAnnuaControl.setValue('');

          superminimoRalControl.enable();
          superminimoRalControl.setValue('');

          diariaMensileControl.enable();
          diariaMensileControl.setValue('');

          diariaGiornalieraControl.enable();
          diariaGiornalieraControl.setValue('');

          scattiAnzianitaControl.enable();
          scattiAnzianitaControl.setValue('');

          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(null);

          this.AnagraficaDto.updateValueAndValidity();
        }
        break;

      default:
        break;
    }
  }

  calculateDataFineRapporto() {
    const mesiDurataControl = this.AnagraficaDto.get('contratto.mesiDurata');
    const dataFineRapportoControl = this.AnagraficaDto.get(
      'contratto.dataFineRapporto'
    );
    const dataAssunzioneControl = this.AnagraficaDto.get(
      'contratto.dataAssunzione'
    );

    // Verifica se mesiDurataControl e dataAssunzioneControl esistono e non sono nulli
    if (
      mesiDurataControl &&
      dataAssunzioneControl &&
      mesiDurataControl.value !== null &&
      dataAssunzioneControl.value !== null
    ) {
      // Ottieni i valori dei controlli
      const mesiDurata = mesiDurataControl.value;
      const dataAssunzione = dataAssunzioneControl.value;

      // Verifica se i valori ottenuti sono validi
      if (mesiDurata && dataAssunzione) {
        // Calcola la data di fine rapporto aggiungendo i mesi di durata alla data di assunzione
        const dataFineRapporto = new Date(dataAssunzione);
        dataFineRapporto.setMonth(dataFineRapporto.getMonth() + mesiDurata);

        // Formatta la data nel formato "yyyy-MM-dd"
        const dataFineRapportoFormatted = this.datePipe.transform(
          dataFineRapporto,
          'yyyy-MM-dd'
        );

        // Imposta il valore formattato nel controllo 'dataFineRapporto'
        dataFineRapportoControl?.setValue(dataFineRapportoFormatted);
      } else {
        // Alcuni dei valori necessari sono mancanti, gestisci di conseguenza
        console.error(
          'Impossibile calcolare la data di fine rapporto. Mancano dati.'
        );
      }
    } else {
      console.error(
        'I controlli necessari non esistono o alcuni valori sono nulli.'
      );
    }
  }

  calculateRalPartTime() {
    const percentualePartTimeControl = this.AnagraficaDto.get(
      'contratto.percentualePartTime'
    );
    const ralAnnuaControl = this.AnagraficaDto.get('contratto.ralAnnua');
    const ralPartTimeControl = this.AnagraficaDto.get('contratto.ralPartTime');

    if (percentualePartTimeControl && ralAnnuaControl && ralPartTimeControl) {
      const percentualePartTime = percentualePartTimeControl.value || 0;
      const ralAnnua = ralAnnuaControl.value || 0;

      const percentualeDecimal = percentualePartTime / 100;
      const ralPartTime = ralAnnua * percentualeDecimal;

      ralPartTimeControl.setValue(ralPartTime.toFixed(2)); // Formattato a due decimali
    }
  }

  onConiugatoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      // Adesso puoi usare isChecked in modo sicuro
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  onFigliACaricoChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }
  onAttesaLavoriChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  onValoreTicketChange(event: any) {
    const valoreTicketControl = this.AnagraficaDto.get(
      'contratto.valoreTicket'
    );
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        valoreTicketControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        valoreTicketControl?.disable();
      }
    }
  }
  onCategoriaProtettaChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }
  onPFIChange(event: any) {
    const target = event.target as HTMLInputElement;
    const tutorControl = this.AnagraficaDto.get('contratto.tutor');
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        tutorControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        tutorControl?.disable();
      }
    }
  }
  onCorsoSicurezzaChange(event: any) {
    const dataCorsoSicurezzaControl = this.AnagraficaDto.get(
      'contratto.dataCorsoSicurezza'
    );

    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        dataCorsoSicurezzaControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        dataCorsoSicurezzaControl?.disable();
      }
    }
  }
  onPChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }
    }
  }

  onVisitaMedicaChange(event: any) {
    const dataVisitaMedicaControl = this.AnagraficaDto.get(
      'contratto.dataVisitaMedica'
    );
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        dataVisitaMedicaControl?.enable();
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        dataVisitaMedicaControl?.disable();
      }
    }
  }

  onPartTimeChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      const percentualePartTimeControl = this.AnagraficaDto.get(
        'contratto.percentualePartTime'
      );
      const ralAnnuaControl = this.AnagraficaDto.get('contratto.ralAnnua');
      const ralPartTimeControl = this.AnagraficaDto.get(
        'contratto.ralPartTime'
      );

      if (percentualePartTimeControl && ralAnnuaControl && ralPartTimeControl) {
        if (isChecked) {
          percentualePartTimeControl.enable();
          ralAnnuaControl.enable();
          this.calculateRalPartTime();
        } else {
          percentualePartTimeControl.disable();
          percentualePartTimeControl.setValue('');
          ralAnnuaControl.disable();
          ralAnnuaControl.setValue('');
          ralPartTimeControl.disable();
          ralPartTimeControl.setValue('');
        }
      }
    }
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
      dataInizio: new FormControl(''),
      dataFine: new FormControl(''),
      tariffaGiornaliera: new FormControl(''),
      aziendaDiFatturazioneInterna: new FormControl(''),
      // attivo: new FormControl(true),
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
        // if (
        //   obj.tipoCausaFineRapporto &&
        //   Object.keys(obj.tipoCausaFineRapporto).length === 0
        // ) {
        //   delete obj.tipoCausaFineRapporto;
        // }
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
        console.log('TIPI DI CONTRATTI: ' + JSON.stringify(result));
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
