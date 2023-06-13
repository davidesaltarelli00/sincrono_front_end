import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
      tipoContratto: new FormControl(''),
      livelloContratto: new FormGroup({
        descrizione: new FormControl(''),
      }),
      contrattoNazionale: new FormGroup({
        descrizione: new FormControl(''),
      }),
      qualifica: new FormControl(''),
      sedeAssunzione: new FormControl(''),
      dataAssunzione: new FormControl(''),
      dataInizioProva: new FormControl(''),
      dataFineProva: new FormControl(''),
      dataFineRapporto: new FormControl(''),
      mesiDurata: new FormControl(''),
      livelloDipendente: new FormGroup({
        livelloIniziale: new FormControl(''),
        livelloAttuale: new FormControl(''),
      })
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
        tipoContratto: new FormControl(''),
        livelloContratto: new FormGroup({
          descrizione: new FormControl(''),
        }),
        contrattoNazionale: new FormGroup({
          descrizione: new FormControl(''),
        }),
        qualifica: new FormControl(''),
        sedeAssunzione: new FormControl(''),
        dataAssunzione: new FormControl(''),
        dataInizioProva: new FormControl(''),
        dataFineProva: new FormControl(''),
        dataFineRapporto: new FormControl(''),
        mesiDurata: new FormControl(''),
        livelloDipendente: new FormGroup({
          livelloIniziale: new FormControl(''),
          livelloAttuale: new FormControl(''),
        })
      })
    });

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
        } else if (obj[key] === null) {
          delete obj[key];
        }
        if (obj.utente && Object.keys(obj.utente).length === 0) {
          delete obj.utente;
        }
      });
    };

    removeEmpty(this.AnagraficaDto.value);
    console.log(JSON.stringify(this.AnagraficaDto.value));
    const body = JSON.stringify({
      anagrafica: this.AnagraficaDto.value,
    });
    console.log(body);

    this.anagraficaDtoService.insert(body).subscribe((result) => {
      if ((result as any).esito.code != 0) {
        alert('inserimento non riuscito');
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

}
