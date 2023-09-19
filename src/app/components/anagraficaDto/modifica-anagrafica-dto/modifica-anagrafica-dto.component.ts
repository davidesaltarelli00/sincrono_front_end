import { Component, OnInit, Renderer2 } from '@angular/core';
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
import { DatePipe } from '@angular/common';

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
  commesseVuote: any;
  contratto: any;
  contrattoVuoto: any;
  nuovoId: any;
  tipologicaCanaliReclutamento: any[] = [];
  motivazioniFineRapporto: any[] = [];
  variabileGenerica: any;
  inseritoContrattoIndeterminato: boolean = false;
  contrattoStageOApprendistato: any;
  percentualePartTimeValue: number | null = null;
  dataOdierna = new Date();

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private datePipe: DatePipe
  ) {
    console.log(
      '+++++++++++++++++++++++++++ID ANAGRAFICA CORRENTE: ' + this.id
    );
    this.anagraficaDto = this.formBuilder.group({
      anagrafica: this.formBuilder.group({
        id: [this.id],
        // attivo: [true],
        tipoAzienda: this.formBuilder.group({ id: [''] }),
        nome: ['', Validators.required],
        cognome: ['', Validators.required],
        codiceFiscale: ['', Validators.required],
        comuneDiNascita: [''],
        dataDiNascita: [''],
        residenza: [''],
        domicilio: [''],
        cellularePrivato: ['', Validators.pattern(/^[0-9]{10}$/)],
        cellulareAziendale: ['', Validators.pattern(/^[0-9]{10}$/)],
        mailPrivata: [
          '',
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
        mailAziendale: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
            ),
          ],
        ],
        mailPec: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
            ),
          ],
        ],
        titoliDiStudio: [''],
        altriTitoli: [''],
        coniugato: [''],
        figliACarico: [''],
        attesaLavori: [''],
      }),
      commesse: this.formBuilder.array([]),

      contratto: this.formBuilder.group({
        id: [''],
        // attivo: [''],
        // aziendaDiFatturazioneInterna: [''],
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
        }),
        qualifica: [''],
        sedeAssunzione: [''],
        dataAssunzione: [''],
        dataInizioProva: [''],
        dataFineProva: [''],
        dataFineRapporto: [''],
        mesiDurata: [''],
        livelloAttuale: [''],
        livelloFinale: [''],
        // dimissioni: [''],
        partTime: [''],
        percentualePartTime: [''],
        retribuzioneMensileLorda: [
          '',
          [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')],
        ],
        superminimoMensile: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        ralAnnua: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        diariaAnnua: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        ralPartTime: [''], //da non mettere nel form, sara un campo calcolato
        superminimoRal: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        diariaMensile: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        diariaGiornaliera: ['', [Validators.pattern('[0-9]+(.[0-9][0-9]?)?')]],
        ticket: [''],
        valoreTicket: ['', Validators.maxLength(50)],
        categoriaProtetta: [''],
        tutor: [''],
        pfi: [''],
        retribuzioneNettaGiornaliera: [''],
        retribuzioneNettaMensile: [''],
        corsoSicurezza: [''],
        dataCorsoSicurezza: [''],
        tipoCausaFineRapporto: this.formBuilder.group({
          id: [''],
          // descrizione: [''],
        }),
        scattiAnzianita: [''],
        assicurazioneObbligatoria: [''],
        pc: [''],
        tariffaPartitaIva: [''],
        tipoCanaleReclutamento: this.formBuilder.group({
          id: [''],
          // descrizione: [''],
        }),
        visitaMedica: [''],
        dataVisitaMedica: [''],
      }),

      ruolo: this.formBuilder.group({
        id: [''],
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
    this.calculateRalPartTime();
    this.caricaRuoli();
    this.creaFormCommessa();
    this.caricaTipoCanaleReclutamento();
    this.caricaTipoCausaFineRapporto();
    const ralPartTimeControl = this.anagraficaDto.get('contratto.ralPartTime');
    if (ralPartTimeControl) {
      ralPartTimeControl.disable();
    }

    this.anagraficaDto
      .get('contratto.dataAssunzione')
      ?.valueChanges.subscribe(() => {
        this.calculateDataFineRapporto();
      });

    this.anagraficaDto
      .get('contratto.mesiDurata')
      ?.valueChanges.subscribe(() => {
        this.calculateDataFineRapporto();
      });
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

        //conversione date
        if (this.data.contratto && this.data.contratto.dataAssunzione) {
          this.data.contratto.dataAssunzione = this.datePipe.transform(
            this.data.contratto.dataAssunzione,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataInizioProva) {
          this.data.contratto.dataInizioProva = this.datePipe.transform(
            this.data.contratto.dataInizioProva,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataFineProva) {
          this.data.contratto.dataFineProva = this.datePipe.transform(
            this.data.contratto.dataFineProva,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataFineRapporto) {
          this.data.contratto.dataFineRapporto = this.datePipe.transform(
            this.data.contratto.dataFineRapporto,
            'yyyy-MM-dd'
          );
        }
        if (this.data.anagrafica && this.data.anagrafica.dataDiNascita) {
          this.data.anagrafica.dataDiNascita = this.datePipe.transform(
            this.data.anagrafica.dataDiNascita,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataCorsoSicurezza) {
          this.data.contratto.dataCorsoSicurezza = this.datePipe.transform(
            this.data.contratto.dataCorsoSicurezza,
            'yyyy-MM-dd'
          );
        }
        if (this.data.contratto && this.data.contratto.dataVisitaMedica) {
          this.data.contratto.dataVisitaMedica = this.datePipe.transform(
            this.data.contratto.dataVisitaMedica,
            'yyyy-MM-dd'
          );
        }
        console.log(
          '***************************LE DATE SONO STATE CONVERTITE COSI: *************************** \n' +
           'Data assunzione:'+ this.data.contratto.dataAssunzione +
            '\n' +
           'Data inizio prova: '+ this.data.contratto.dataInizioProva +
            '\n' +
            'Data fine prova: '+ this.data.contratto.dataFineProva +
            '\n' +
            'Data fine rapporto: '+ this.data.contratto.dataFineRapporto +
            '\n' +
            'Data di nascita: '+ this.data.anagrafica.dataDiNascita +
            '\n' +
            'data corso di sicurezza'+ this.data.contratto.dataCorsoSicurezza +
            '\n'+
            'data visita medica: '+ this.data.contratto.dataVisitaMedica +
            '\n'
        );

        console.log(
          '++++++++++++++++++++++++++++++++++++++++++++++++++ELENCO DEI DATI CARICATI: +++++++++++++++++++++++++++++++++++++++++++++++++ ' +
            JSON.stringify(resp)
        );

        this.elencoCommesse = (resp as any)['anagraficaDto']['commesse'];
        this.contratto = (resp as any)['anagraficaDto']['contratto'];
        if (this.contratto == null) {
          console.log('Niente contratto.');
          this.contrattoVuoto = true;
        } else {
          this.contrattoVuoto = false;
          console.log('Dati del contratto: ' + JSON.stringify(this.contratto));
        }
        if (this.elencoCommesse === null) {
          console.log('Niente commesse.');
          this.commesseVuote = true;
        } else {
          this.commesseVuote = false;
          console.log(
            'Elenco commesse presenti: ' + JSON.stringify(this.elencoCommesse)
          );
        }
        this.initializeCommesse();
        this.anagraficaDto.patchValue(this.data);

        // Iteriamo attraverso le chiavi dell'oggetto
        for (const key in resp) {
          if (resp.hasOwnProperty(key)) {
            // Verifichiamo se il valore associato alla chiave è null
            if (resp[key] === null) {
              // Applichiamo una classe CSS per evidenziare il campo con bordo rosso
              console.log(`Campo "${key}" è null.`);
              // Trova l'elemento HTML corrispondente al campo
              const element = document.querySelector(`[name="${key}"]`);
              if (element) {
                // Applica una classe CSS usando Renderer2
                this.renderer.addClass(element, 'campo-nullo');
              }
            }
          }
        }
      });
  }

  onPartTimeChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      const percentualePartTimeControl = this.anagraficaDto.get(
        'contratto.percentualePartTime'
      );
      const ralAnnuaControl = this.anagraficaDto.get('contratto.ralAnnua');
      const ralPartTimeControl = this.anagraficaDto.get(
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

  onChangeAssicurazioneObbligatoria(event: Event) {
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

  calculateRalPartTime() {
    const percentualePartTimeControl = this.anagraficaDto.get(
      'contratto.percentualePartTime'
    );
    const ralAnnuaControl = this.anagraficaDto.get('contratto.ralAnnua');
    const ralPartTimeControl = this.anagraficaDto.get('contratto.ralPartTime');

    if (percentualePartTimeControl && ralAnnuaControl && ralPartTimeControl) {
      const percentualePartTime = percentualePartTimeControl.value || 0;
      const ralAnnua = ralAnnuaControl.value || 0;

      const percentualeDecimal = percentualePartTime / 100;
      const ralPartTime = ralAnnua * percentualeDecimal;

      ralPartTimeControl.setValue(ralPartTime.toFixed(2)); // Formattato a due decimali
    }
  }

  /* Questo metodo gestisce il valore della  */
  onChangeDistaccoCommessa(event: Event, commessaIndex: number) {
    const commesseFormArray = this.anagraficaDto.get('commesse') as FormArray;
    const commessaFormGroup = commesseFormArray.at(commessaIndex) as FormGroup;
    const distaccoControl = commessaFormGroup.get('distacco');
    const distaccoAziendaControl = commessaFormGroup.get('distaccoAzienda');
    const distaccoDataControl = commessaFormGroup.get('distaccoData');
    const target = event.target as HTMLInputElement;
    console.log('TARGET: ' + target);
    if (target) {
      let isChecked = target.checked;
      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
        if (distaccoControl && distaccoAziendaControl && distaccoDataControl) {
          if (isChecked) {
            distaccoAziendaControl.enable();
            distaccoDataControl.enable();
          } else {
            distaccoAziendaControl.disable();
            distaccoDataControl.disable();
          }
        }
        if (distaccoControl === null) {
          isChecked = false;
        }
      } else {
        console.log('Checkbox deselezionata, il valore è false');
        if (distaccoControl && distaccoAziendaControl && distaccoDataControl) {
          if (isChecked) {
            distaccoAziendaControl.enable();
            distaccoDataControl.enable();
          } else {
            distaccoAziendaControl.disable();
            distaccoDataControl.disable();
          }
        }

        if (distaccoControl === null) {
          isChecked = false;
        }
      }
    }
  }

  onTicketChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;

      if (isChecked) {
        console.log('Checkbox selezionata, il valore è true');
      } else {
        console.log('Checkbox deselezionata, il valore è false');
      }

      const ticketControl = this.anagraficaDto.get('contratto.ticket');
      const valoreTicketControl = this.anagraficaDto.get(
        'contratto.valoreTicket'
      );

      if (ticketControl && valoreTicketControl) {
        if (isChecked) {
          valoreTicketControl.enable();
        } else {
          valoreTicketControl.disable();
        }
      }
    }
  }

  onChangeCCNL(event: Event) {
    const selectedTipoCcnlId = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );
    console.log('SELEZIONATO CCNL CON ID :' + selectedTipoCcnlId);
    const tipoCcnlControl = this.anagraficaDto.get('contratto.tipoCcnl.id');
    const retribuzioneMensileLordaControl = this.anagraficaDto.get(
      'contratto.retribuzioneMensileLorda'
    );
  }

  onChangePFI(event: Event) {
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

  onTipoContrattoChange(event: any) {
    const selectedTipoContrattoId = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );
    console.log('SELEZIONATO TIPO CONTRATTO CON ID:' + selectedTipoContrattoId);
    const dataFineRapportoControl = this.anagraficaDto.get(
      'contratto.dataFineRapporto'
    );
    const mesiDurataControl = this.anagraficaDto.get('contratto.mesiDurata');
    const tutorControl = this.anagraficaDto.get('contratto.tutor');
    const PFIcontrol = this.anagraficaDto.get('contratto.pfi');
    const superminimoMensileControl = this.anagraficaDto.get(
      'contratto.superminimoMensile'
    );
    const ralAnnuaControl = this.anagraficaDto.get('contratto.ralAnnua');
    const superminimoRalControl = this.anagraficaDto.get(
      'contratto.superminimoRal'
    );
    const diariaMensileControl = this.anagraficaDto.get(
      'contratto.diariaMensile'
    );
    const diariaGiornalieraControl = this.anagraficaDto.get(
      'contratto.diariaGiornaliera'
    );
    const scattiAnzianitaControl = this.anagraficaDto.get(
      'contratto.scattiAnzianita'
    );
    const retribuzioneMensileLordaControl = this.anagraficaDto.get(
      'contratto.retribuzioneMensileLorda'
    );
    const tariffaPartitaIvaControl = this.anagraficaDto.get(
      'contratto.tariffaPartitaIva'
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
          tariffaPartitaIvaControl
        ) {
          retribuzioneMensileLordaControl.enable();
          retribuzioneMensileLordaControl.setValue(600);

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
          mesiDurataControl.setValue('');

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

          this.anagraficaDto.updateValueAndValidity();
        }
        break;

      default:
        break;
    }
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
      aziendaDiFatturazioneInterna: [commessa.aziendaDiFatturazioneInterna],
    });
  }

  // Dichiarazione di una variabile per il valore precedente
  valorePrecedenteDataFineRapporto: any;

  onChangeCausaFineRapporto(event: any) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    console.log(value);

    const dataFineRapportoControl = this.anagraficaDto.get(
      'contratto.dataFineRapporto'
    );

    if (value && dataFineRapportoControl) {
      this.valorePrecedenteDataFineRapporto = dataFineRapportoControl.value;
      dataFineRapportoControl.setValue(this.dataOdierna);
      dataFineRapportoControl.disable();
      alert(
        'La data di fine rapporto é stata impostata a oggi.' +
          this.dataOdierna +
          ' Per reimpostare la vecchia data, elimina la causa di fine rapporto.'
      );
    } else {
      // Ripristina il valore precedente
      if (this.valorePrecedenteDataFineRapporto !== undefined) {
        dataFineRapportoControl?.setValue(
          this.valorePrecedenteDataFineRapporto
        );
      } else {
        dataFineRapportoControl?.setValue(null); // Se non esiste un valore precedente, impostalo su null o su quello che desideri
      }
      dataFineRapportoControl?.enable();
    }
  }

  caricaTipoCausaFineRapporto() {
    this.anagraficaDtoService
      .caricaTipoCausaFineRapporto(localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          this.motivazioniFineRapporto = (res as any)['list'];
          console.log('Elenco motivazioni fine rapporto:', JSON.stringify(res));
        },
        (error: any) => {
          console.log(
            'Errore durante il caricamento della tipologica Motivazione fine rapporto:',
            JSON.stringify(error)
          );
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
      distacco: false,
      distaccoAzienda: '',
      distaccoData: '',
      dataInizio: '',
      dataFine: '',
      tariffaGiornaliera: '',
      aziendaDiFatturazioneInterna: '',
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
              JSON.stringify(res)
            );
            this.elencoCommesse.splice(index, 1);
            location.reload();
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
        if (obj.commesse && Object.keys(obj.commesse).length === 0) {
          delete obj.commesse;
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
    removeEmpty(this.anagraficaDto.value);

    console.log(
      'Valore di anagrafica: ' +
        JSON.stringify(this.anagraficaDto.get('anagrafica')?.value)
    );
    const payload = {
      anagraficaDto: this.anagraficaDto.value,
      // anagrafica: this.anagraficaDto.get('anagrafica')?.value,
      // contratto: this.anagraficaDto.get('contratto')?.value,
      // commesse: this.anagraficaDto.get('commesse')?.value,
      // ruolo: this.anagraficaDto.get('ruolo')?.value,
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

  insertContratto() {
    this.contrattoVuoto = !this.contrattoVuoto;
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

  // reset(myArray: string[]) {
  //   for (let element of myArray) {
  //     const inputElement = document.getElementById(element);

  //     inputElement?.classList.remove('invalid-field');
  //   }
  // }

  reset() {
    this.router.navigate(['/lista-anagrafica']);
  }

  caricaTipoContratto() {
    this.anagraficaDtoService
      .getTipoContratto(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.tipiContratti = (result as any)['list'];
          console.log(
            '------------------------TIPI DI CONTRATTI CARICATI:------------------------ ' +
              JSON.stringify(result)
          );
        },
        (error: any) => {
          console.log(
            'Errore durante il caricamento dei tipi di contratto : ' + error
          );
        }
      );
  }
  caricaLivelloContratto() {
    this.anagraficaDtoService
      .getLivelloContratto(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.livelliContratti = (result as any)['list'];
          console.log(
            '------------------------LIVELLI CONTRATTO CARICATI:------------------------ ' +
              JSON.stringify(result)
          );
        },
        (error: any) => {
          console.log(
            'Errore durante il caricamento dei livelli contrattuali: ' + error
          );
        }
      );
  }
  caricaTipoAzienda() {
    this.anagraficaDtoService
      .getTipoAzienda(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.tipiAziende = (result as any)['list'];
          console.log(
            '------------------------AZIENDE CARICATE:------------------------ ' +
              JSON.stringify(result)
          );
        },
        (error: any) => {
          console.log('Errore durante il caricamento delle aziende: ' + error);
        }
      );
  }

  caricaContrattoNazionale() {
    this.anagraficaDtoService
      .getContrattoNazionale(localStorage.getItem('token'))
      .subscribe(
        (result: any) => {
          this.ccnl = (result as any)['list'];
          console.log(
            '------------------------CCNL CARICATI:------------------------ ' +
              JSON.stringify(result)
          );
        },
        (error: any) => {
          console.log(
            'Errore durante il caricamento dei contratti nazionali: ' + error
          );
        }
      );
  }

  caricaRuoli() {
    this.anagraficaDtoService.getRuoli(localStorage.getItem('token')).subscribe(
      (result: any) => {
        this.ruoli = (result as any)['list'];
        console.log(
          '------------------------RUOLI CARICATI:------------------------ ' +
            JSON.stringify(result)
        );
      },
      (error: any) => {
        console.log('Errore durante il caricamento dei ruoli : ' + error);
      }
    );
  }

  calculateDataFineRapporto() {
    const mesiDurataControl = this.anagraficaDto.get('contratto.mesiDurata');
    const dataFineRapportoControl = this.anagraficaDto.get(
      'contratto.dataFineRapporto'
    );
    const dataAssunzioneControl = this.anagraficaDto.get(
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
}
