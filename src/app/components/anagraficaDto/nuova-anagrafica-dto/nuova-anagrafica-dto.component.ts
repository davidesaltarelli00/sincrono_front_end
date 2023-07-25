import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
    anagraficaDto:any = {
      anagrafica: {
        id: null,
        utente: {
          id: null,
          username: null,
          password: null,
          tokenPassword: null,
          attivo: null,
        },
        attivo: null,
        aziendaTipo: null, //
        cognome: null, //
        nome: null,//
        codiceFiscale: null, //
        comuneDiNascita: null, //
        dataDiNascita: null, //
        residenza: null, //
        domicilio: null, //
        cellularePrivato: null, //
        cellulareAziendale: null, //
        mailPrivata: null, //
        mailAziendale: null, //
        mailPec: null, //
        titoliDiStudio: null,
        altriTitoli: null,
        coniugato: null,
        figliACarico: null,
      },
      contratto: {
        id: null,
        tipoContratto: {
          id: null,
          descrizione: null,
        },
        livelloContratto: {
          id: null,
          ccnl: null,
          descrizione: null,
          minimiRet23: null,
        },
        tipoAzienda: {
          id: null,
          descrizione: null,
        },
        contrattoNazionale: {
          id: null,
          descrizione: null,
        },
        attivo: null,
        sedeAssunzione: null,
        qualifica: null,
        dataAssunzione: null,
        dataInizioProva: null,
        dataFineProva: null,
        dataFineRapporto: null,
        mesiDurata: null,
        livelloAttuale: null,
        livelloFinale: null,
        dimissioni: null,
        partTime: null,
        partTimeA: null,
        retribuzioneMensileLorda: null,
        superminimoMensile: null,
        ralAnnua: null,
        superminimoRal: null,
        diariaMese: null,
        diariaGg: null,
        ticket: null,
        valoreTicket: null,
        categoriaProtetta: null,
        tutor: null,
        pfi: null,
        assicurazioneObbligatoria: null,
        corsoSicurezza: null,
        motivazioneFineRapporto: null,
        pc: null,
        scattiAnzianita: null,
        tariffaPartitaIva: null,
        canaleReclutamento: null,
      },
      commesse: [
        {
          id: null,
          cliente: null,
          clienteFinale: null,
          titoloPosizione: null,
          distacco: null,
          dataInizio: null,
          dataFine: null,
          costoMese: null,
          tariffaGiornaliera: null,
          nominativo: null,
          azienda: null,
          aziendaDiFatturazioneInterna: null,
          stato: null,
          attesaLavori: null,
        },
        {
          id: null,
          cliente: null,
          clienteFinale: null,
          titoloPosizione: null,
          distacco: null,
          dataInizio: null,
          dataFine: null,
          costoMese: null,
          tariffaGiornaliera: null,
          nominativo: null,
          azienda: null,
          aziendaDiFatturazioneInterna: null,
          stato: null,
          attesaLavori: null,
        },
      ],
      ruolo: {
        id: null,
        ruolo: null,
        nome: null,
        descrizione: null,
        ruoli: null,
      },
    };

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private contrattoService: ContrattoService
  ) {}

  ngOnInit(): void {}

  inserisci(value: any) {
    console.log(value)
  }
}
