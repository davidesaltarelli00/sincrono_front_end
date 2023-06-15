import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AnagraficaDtoService } from '../anagraficaDto-service';
import { Router } from '@angular/router';
import { ContrattoService } from '../../contratto/contratto-service';

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
  utenti: any = [];

  submitted = false;
  errore = false;
  messaggio: any;
  showErrorPopup:any;
  showSuccessPopup:any;
  tipiContratti: any = [];
  livelliContratti: any = [];
  tipiAziende: any = [];
  contrattiNazionali: any = [];

  AnagraficaDto = this.formBuilder.group({
    anagrafica: new FormGroup({
      attivo: new FormControl(''),
      azienda: new FormControl(''),
      nome: new FormControl(''),
      cognome: new FormControl(''),
      codiceFiscale: new FormControl(''),
      cellularePrivato:new FormControl(''),
      cellulareAziendale: new FormControl(''),
      mailPrivata: new FormControl(''),
      mailPec: new FormControl(''),
      mailAziendale: new FormControl(''),
      titoloDiStudio: new FormControl(''),
      altriTitoli:new FormControl(''),
      comuneDiNascita: new FormControl(''),
      residenza: new FormControl(''),
      domicilio: new FormControl(''),
      dataDiNascita: new FormControl(''),
      Coniugato: new FormControl(''),
      figliACarico: new FormControl(''),
    }),
    commessa: new FormGroup({
      cliente: new FormControl(''),
      clienteFinale: new FormControl(''),
      titoloPosizione: new FormControl(''),
      distacco:new FormControl(''),
      costoMese: new FormControl(''),
      dataInizio: new FormControl(''),
      dataFine:new FormControl(''),
      tariffaGiornaliera: new FormControl(''),
      nominativo: new FormControl(''),
      azienda: new FormControl(''),
      aziendaDiFatturazioneInterna: new FormControl(''),
      stato: new FormControl(''),
      attesaLavori:new FormControl(''),
    }),
    contratto: new FormGroup({
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
      livelloAttuale: new FormControl(''),
      livelloFinale: new FormControl(''),
      dimissioni: new FormControl(''),
      partTime: new FormControl(''),
      partTimeA: new FormControl(''),
      retribuzioneMensileLorda: new FormControl(''),
      Superminimo: new FormControl(''),
      ralAnnua: new FormControl(''),
      superminimoRal: new FormControl(''),
      diariaMensile: new FormControl(''),
      diariaGiornaliera: new FormControl(''),
      Ticket:new FormControl(''),
      valoreTicket:new FormControl(''),
      categoriaProtetta:new FormControl(''),
      altro:new FormControl(''),
      pfi:new FormControl(''),
      corso:new FormControl(''),
      motivazioneFineRapporto:new FormControl(''),
      scattiAnzianita:new FormControl(''),
      pc:new FormControl(''),
      tariffaPartitaIva:new FormControl(''),
      canaleReclutamento:new FormControl(''),
    })
  });

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private contrattoService: ContrattoService
  ){}

  ngOnInit(): void {
    this.AnagraficaDto = this.formBuilder.group({
      anagrafica: new FormGroup({
        attivo: new FormControl(''),
        azienda: new FormControl(''),
        nome: new FormControl('',/*[
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          (control: AbstractControl) => this.isControlInvalid('anagrafica.nome', 50, 2) ? { invalid: true } : null
        ]*/),
        cognome: new FormControl(''),
        codiceFiscale: new FormControl(''),
        cellularePrivato:new FormControl(''),
        cellulareAziendale: new FormControl(''),
        mailPrivata: new FormControl(''),
        mailPec: new FormControl(''),
        mailAziendale: new FormControl(''),
        titoloDiStudio: new FormControl(''),
        altriTitoli:new FormControl(''),
        comuneDiNascita: new FormControl(''),
        residenza: new FormControl(''),
        domicilio: new FormControl(''),
        dataDiNascita: new FormControl(''),
        Coniugato: new FormControl(''),
        figliACarico: new FormControl(''),
      }),
      commessa: new FormGroup({
        cliente: new FormControl(''),
        clienteFinale: new FormControl(''),
        titoloPosizione: new FormControl(''),
        distacco:new FormControl(''),
        costoMese: new FormControl(''),
        dataInizio: new FormControl(''),
        dataFine:new FormControl(''/*,[
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          (control: AbstractControl) => this.isControlInvalid('contratto.dataFine', 50, 2) ? { invalid: true } : null]*/),
        tariffaGiornaliera: new FormControl(''),
        nominativo: new FormControl(''),
        azienda: new FormControl(''),
        aziendaDiFatturazioneInterna: new FormControl(''),
        stato: new FormControl(''),
        attesaLavori:new FormControl(''),
      }),
      contratto: new FormGroup({
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
        livelloAttuale: new FormControl(''),
        livelloFinale: new FormControl(''),
        dimissioni: new FormControl(''),
        partTime: new FormControl(''),
        partTimeA: new FormControl(''),
        retribuzioneMensileLorda: new FormControl(''),
        Superminimo: new FormControl(''),
        ralAnnua: new FormControl(''),
        superminimoRal: new FormControl(''),
        diariaMensile: new FormControl(''),
        diariaGiornaliera: new FormControl(''),
        Ticket:new FormControl(''),
        valoreTicket:new FormControl(''),
        categoriaProtetta:new FormControl(''),
        altro:new FormControl(''),
        pfi:new FormControl(''),
        corso:new FormControl(''),
        motivazioneFineRapporto:new FormControl(''),
        scattiAnzianita:new FormControl(''),
        pc:new FormControl(''),
        tariffaPartitaIva:new FormControl(''),
        canaleReclutamento:new FormControl(''),
      })
    });

    /*const nomeControl = this.AnagraficaDto.get('anagrafica.nome');

    if ((nomeControl!=null && nomeControl.value!=null) && nomeControl.value=="") {
      nomeControl.markAsTouched();
      nomeControl.setErrors({ 'invalid': true });

      nomeControl.invalid;
      nomeControl.touched;
    }

    const cognomeControl = this.AnagraficaDto.get('anagrafica.cognome');

    if (cognomeControl!=null && cognomeControl.invalid) {
      cognomeControl.markAsTouched();
      cognomeControl.setErrors({ 'invalid': true });
    }

    const codiceFiscaleControl = this.AnagraficaDto.get('anagrafica.codiceFiscale');

    if (codiceFiscaleControl!=null && codiceFiscaleControl.invalid) {
      codiceFiscaleControl.markAsTouched();
      codiceFiscaleControl.setErrors({ 'invalid': true });
    }*/

    


    this.caricaListaUtenti();
    
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
  }
  caricaListaUtenti() {
    this.anagraficaDtoService.getListaUtenti().subscribe((result: any) => {
      console.log(result);
      this.utenti = (result as any)['list'];
    });
  }
  inserisci() {
    this.submitted = true;
    if (this.AnagraficaDto.invalid) {
      return;
    }

    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === '') {
          delete obj[key];
        }
        if (obj.commessa) console.log("Object: "+Object.keys(obj.commessa)+" lunghezza: "+Object.keys(obj.commessa).length);
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
        if (obj.contrattoNazionale && Object.keys(obj.contrattoNazionale).length === 0) {
          delete obj.contrattoNazionale;
        }
        if (obj.livelloContratto && Object.keys(obj.livelloContratto).length === 0) {
          delete obj.livelloContratto;
        }
      });
    };

    removeEmpty(this.AnagraficaDto.value);


    console.log(JSON.stringify(this.AnagraficaDto.value));
    const body = JSON.stringify({
      anagraficaDto: this.AnagraficaDto.value,
    });
    console.log(body);

    this.anagraficaDtoService.insert(body).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        alert('inserimento non riuscito\n'+'target: '+(result as any).esito.target);
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      }else{

        alert('inserimento riuscito');
        
      }
      this.router.navigate(['../lista-anagrafica-dto']);
    });
  }

  /*chiudiPopup() {
    this.showErrorPopup = false;
    this.showSuccessPopup = false;
  }*/

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

  /*isControlInvalid(controlName: string,max:number,min:number) {
    const control = this.AnagraficaDto.get(controlName);
    const inputElement = document.getElementById(controlName);
    if(!(control?.dirty && (control?.value.length<max && control?.value.length>min))){
      inputElement?.classList.add('invalid-field');
      return true;
    }else{
      inputElement?.classList.remove('invalid-field');
      return false;
    }
      }*/


      isEmpty(value: any): boolean {
        return value === null || value === undefined || value === '';
      }

}
