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

  color: ThemePalette = 'primary';
  anagraficaDto: any = {
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
      nome: null, //
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
      titoliDiStudio: null, //
      altriTitoli: null, //
      coniugato: null, //
      figliACarico: null, //
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
      categoriaProtetta: null, //bool
      tutor: null,
      pfi: null,
      assicurazioneObbligatoria: null,
      corsoSicurezza: null,
      motivazioneFineRapporto: null,
      pc: null, //bool
      scattiAnzianita: null,
      tariffaPartitaIva: null,
      canaleReclutamento: null,
    },
    commesse: [
      {
        id: null,
        cliente: null, //
        clienteFinale: null, //
        titoloPosizione: null, //
        distacco: null, //
        dataInizio: null, //
        dataFine: null, //
        costoMese: null, //
        tariffaGiornaliera: null, //
        nominativo: null, //
        azienda: null, //
        aziendaDiFatturazioneInterna: null, //
        stato: null, //
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
    console.log('Valore di anagraficaDto:', this.anagraficaDto);
  }

  selectRoleName(event: any) {
    const selectedValue = event.target.value;
    // Seleziona il ruolo corrispondente in base al valore selezionato
    switch (selectedValue) {
      case "-1":
        this.anagraficaDto.ruolo.nome = "Seleziona ruolo";
        console.log("Seleziona ruolo");
        break;
      case "1":
        this.anagraficaDto.ruolo.nome = "ADMIN";
        console.log("Settato il ruolo di "+ this.anagraficaDto.ruolo.nome);
        break;
      case "2":
        this.anagraficaDto.ruolo.nome = "DIPENDENTE";
        console.log("Settato il ruolo di "+ this.anagraficaDto.ruolo.nome);
        break;
      // case "3":
      //   // this.anagraficaDto.anagrafica.ruolo.nome = "Amministrazione";
      //   break;
      default:
        this.anagraficaDto.ruolo.nome = null;
        console.log("Ruolo non settato");
    }
  }


  aggiungiCommessa() {
    this.anagraficaDto.commesse.push({
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
    });
  }

  rimuoviCommessa(index: number) {
    this.anagraficaDto.commesse.splice(index, 1);
  }

  annulla() {
    this.anagraficaDto = {
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
        nome: null, //
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
        titoliDiStudio: null, //
        altriTitoli: null, //
        coniugato: null, //
        figliACarico: null, //
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
          cliente: null, //
          clienteFinale: null, //
          titoloPosizione: null, //
          distacco: null, //
          dataInizio: null, //
          dataFine: null, //
          costoMese: null, //
          tariffaGiornaliera: null, //
          nominativo: null, //
          azienda: null, //
          aziendaDiFatturazioneInterna: null, //
          stato: null, //
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
    };  }

}
