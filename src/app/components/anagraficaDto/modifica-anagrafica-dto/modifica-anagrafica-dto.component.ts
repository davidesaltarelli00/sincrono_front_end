import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaDtoService } from './../anagraficaDto-service';

@Component({
  selector: 'app-modifica-anagrafica-dto',
  templateUrl: './modifica-anagrafica-dto.component.html',
  styleUrls: ['./modifica-anagrafica-dto.component.scss'],
})
export class ModificaAnagraficaDtoComponent implements OnInit {
  utenti: any = [];
  data: any = [];
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
  contrattiNazionali: any = [];

  anagraficaDto: FormGroup = new FormGroup({

    anagrafica: new FormGroup({
      id: new FormControl(''),
      nome: new FormControl(''),
      cognome: new FormControl(''),
      dataDiNascita: new FormControl(),
      comuneDiNascita: new FormControl(),
      attivo: new FormControl(''),
      codiceFiscale: new FormControl(''),
      aziendaTipo: new FormControl(''),
      residenza: new FormControl(''),
      domicilio: new FormControl(''),
      cellularePrivato: new FormControl(''),
      cellulareAziendale: new FormControl(''),
      mailPrivata: new FormControl(''),
      mailAziendale: new FormControl(''),
      mailPec: new FormControl(''),
      titoliDiStudio: new FormControl(''),
      altriTitoli: new FormControl(''),
      coniugato: new FormControl(''),
      figliACarico: new FormControl(''),
    }),
    contratto: new FormGroup({
      

      tipoContratto: new FormGroup({
        id: new FormControl(''),

      }),
      livelloContratto: new FormGroup({
        id: new FormControl(''),



      }),

      tipoAzienda: new FormGroup({
        id: new FormControl(''),

      }),

      contrattoNazionale: new FormGroup({
        id: new FormControl(''),

      }),

      attivo: new FormControl(''),
      sedeAssunzione: new FormControl(''),
      qualifica: new FormControl(''),
      dataAssunzione: new FormControl(''),
      dataInizioProva: new FormControl(''),
      dataFineProva: new FormControl(''),
      dataFineRapporto: new FormControl(''),
      mesiDurata: new FormControl(''),
      livelloAttuale: new FormControl(''),
      livelloFinale: new FormControl(''),
      dimissioni: new FormControl(''),
      partTime: new FormControl(''),
      partTimeA: new FormControl(''),
      retribuzioneMensileLorda: new FormControl(''),
      superminimoMensile: new FormControl(''),
      ralAnnua: new FormControl(''),
      superminimoRal: new FormControl(''),
      diariaMese: new FormControl(''),
      diariaGg: new FormControl(''),
      ticket: new FormControl(''),
      valoreTicket: new FormControl(''),
      categoriaProtetta: new FormControl(''),
      tutor: new FormControl(''),
      pfi: new FormControl(''),
      assicurazioneObbligatoria: new FormControl(''),
      corsoSicurezza: new FormControl(''),
      motivazioneFineRapporto: new FormControl(''),
      pc: new FormControl(''),
      scattiAnzianita: new FormControl(''),
      tariffaPartitaIva: new FormControl(''),
      canaleReclutamento: new FormControl(''),
    }),

    commessa: new FormGroup({
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
      stato: new FormControl(''),
      attesaLavori: new FormControl(''),
    }),




  });

  constructor(
    private anagraficaDtoService: AnagraficaDtoService,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.anagraficaDtoService.detailAnagraficaDto(this.activatedRouter.snapshot.params['id']).subscribe((resp: any) => {
      this.data = (resp as any)['anagraficaDto'];
      console.log(this.data);
      this.anagraficaDto.patchValue(this.data);
    });

    this.anagraficaDto = this.formBuilder.group({
    
        anagrafica: new FormGroup({
          id: new FormControl(this.id),
          nome: new FormControl(this.data?.anagrafica?.nome),
          cognome: new FormControl(this.data?.anagrafica?.cognome),
          dataDiNascita: new FormControl(this.data?.anagrafica?.dataDiNascita),
          comuneDiNascita: new FormControl(this.data?.anagrafica?.comuneDiNascita),
          attivo: new FormControl(''),
          codiceFiscale: new FormControl(this.data?.anagrafica?.codiceFiscale),
          aziendaTipo: new FormControl(this.data?.anagrafica?.aziendaTipo),
          residenza: new FormControl(this.data?.anagrafica?.residenza),
          domicilio: new FormControl(this.data?.anagrafica?.domicilio),
          cellularePrivato: new FormControl(this.data?.anagrafica?.cellularePrivato),
          cellulareAziendale: new FormControl(this.data?.anagrafica?.cellulareAziendale),
          mailPrivata: new FormControl(this.data?.anagrafica?.mailPrivata),
          mailAziendale: new FormControl(this.data?.anagrafica?.mailAziendale),
          mailPec: new FormControl(this.data?.anagrafica?.mailPec),
          titoliDiStudio: new FormControl(this.data?.anagrafica?.titoliDiStudio),
          altriTitoli: new FormControl(this.data?.anagrafica?.altriTitoli),
          coniugato: new FormControl(''),
          figliACarico: new FormControl(''),
        }),

        contratto: new FormGroup({
          id: new FormControl(this.data?.contratto?.id),
          tipoContratto: new FormGroup({
            id: new FormControl(this.data?.contratto?.tipoContratto.id),

          }),
          livelloContratto: new FormGroup({
            id: new FormControl(this.data?.contratto?.livelloContratto.id),

          }),

          tipoAzienda: new FormGroup({
            id: new FormControl(this.data?.contratto?.tipoAzienda.id),

          }),

          contrattoNazionale: new FormGroup({
            id: new FormControl(this.data?.contratto?.contrattoNazionale.id),

          }),

          attivo: new FormControl(''),
          sedeAssunzione: new FormControl(this.data?.contratto?.sedeAssunzione),
          qualifica: new FormControl(this.data?.contratto?.qualifica),
          dataAssunzione: new FormControl(this.data?.contratto?.dataAssunzione),
          dataInizioProva: new FormControl(this.data?.contratto?.dataInizioProva),
          dataFineProva: new FormControl(this.data?.contratto?.dataFineProva),
          dataFineRapporto: new FormControl(this.data?.contratto?.dataFineRapporto),
          mesiDurata: new FormControl(this.data?.contratto?.mesiDurata),
          livelloAttuale: new FormControl(this.data?.contratto?.livelloAttuale),
          livelloFinale: new FormControl(this.data?.contratto?.livelloFinale),
          dimissioni: new FormControl(''),
          partTime: new FormControl(''),
          partTimeA: new FormControl(''),
          retribuzioneMensileLorda: new FormControl(this.data?.contratto?.retribuzioneMensileLorda),
          superminimoMensile: new FormControl(this.data?.contratto?.superminimoMensile),
          ralAnnua: new FormControl(this.data?.contratto?.ralAnnua),
          superminimoRal: new FormControl(this.data?.contratto?.superminimoRal),
          diariaMese: new FormControl(this.data?.contratto?.diariaMese),
          diariaGg: new FormControl(this.data?.contratto?.diariaGg),
          ticket: new FormControl(this.data?.contratto?.ticket),
          valoreTicket: new FormControl(this.data?.contratto?.valoreTicket),
          categoriaProtetta: new FormControl(''),
          tutor: new FormControl(this.data?.contratto?.tutor),
          pfi: new FormControl(this.data?.contratto?.pfi),
          assicurazioneObbligatoria: new FormControl(this.data?.contratto?.assicurazioneObbligatoria),
          corsoSicurezza: new FormControl(this.data?.contratto?.corsoSicurezza),
          motivazioneFineRapporto: new FormControl(this.data?.contratto?.motivazioneFineRapporto),
          pc: new FormControl(''),
          scattiAnzianita: new FormControl(this.data?.contratto?.scattiAnzianita),
          tariffaPartitaIva: new FormControl(this.data?.contratto?.tariffaPartitaIva),
          canaleReclutamento: new FormControl(this.data?.contratto?.canaleReclutamento),
        }),

        commessa: new FormGroup({
          id: new FormControl(this.data?.commessa?.id),
          cliente: new FormControl(this.data?.commessa?.cliente),
          clienteFinale: new FormControl(this.data?.commessa?.clienteFinale),
          titoloPosizione: new FormControl(this.data?.commessa?.titoloPosizione),
          distacco: new FormControl(this.data?.commessa?.distacco),
          dataInizio: new FormControl(this.data?.commessa?.dataInizio),
          dataFine: new FormControl(this.data?.commessa?.dataFine),
          costoMese: new FormControl(this.data?.commessa?.costoMese),
          tariffaGiornaliera: new FormControl(this.data?.commessa?.tariffaGiornaliera),
          nominativo: new FormControl(this.data?.commessa?.nominativo),
          azienda: new FormControl(this.data?.commessa?.azienda),
          aziendaDiFatturazioneInterna: new FormControl(this.data?.commessa?.aziendaDiFatturazioneInterna),
          stato: new FormControl(''),
          attesaLavori: new FormControl(this.data?.commessa?.attesaLavori),

        })
      })
    

    this.caricaListaUtenti();
    this.caricaTipoContratto();
    this.caricaLivelloContratto();
    this.caricaTipoAzienda();
    this.caricaContrattoNazionale();
  }

  caricaTipoContratto() {
    this.anagraficaDtoService.getTipoContratto().subscribe((result: any) => {
      console.log(result);
      this.tipiContratti = (result as any)['list'];
    });
  }
  caricaLivelloContratto() {
    this.anagraficaDtoService.getLivelloContratto().subscribe((result: any) => {
      console.log(result);
      this.livelliContratti = (result as any)['list'];
    });
  }
  caricaTipoAzienda() {
    this.anagraficaDtoService.getTipoAzienda().subscribe((result: any) => {
      console.log(result);
      this.tipiAziende = (result as any)['list'];
    });
  }

  caricaContrattoNazionale() {
    this.anagraficaDtoService.getContrattoNazionale().subscribe((result: any) => {
      console.log(result);
      this.contrattiNazionali = (result as any)['list'];
    });
  }
  caricaListaUtenti() {
    this.anagraficaDtoService.getListaUtenti().subscribe((result: any) => {
      console.log(result);
      this.utenti = (result as any)['list'];
    });
  }
  aggiorna() {

    
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === '') {
          delete obj[key];
        }
        if (obj.anagrafica && Object.keys(obj.anagrafica).length === 0) {
          delete obj.anagrafica;
        }
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

    removeEmpty(this.anagraficaDto.value);


    let check=true;

    if(this.anagraficaDto.value.anagrafica!=null){
      
      check=this.checkValid(['anagrafica.nome','anagrafica.cognome','anagrafica.codiceFiscale',
      'anagrafica.mailAziendale'])

    }else{

      return;
    }

    if(this.anagraficaDto.value.commessa!=null){

      check=this.checkValid(['commessa.cliente','commessa.dataInizo','comessa.dataFine',
      'commessa.nominativo'])

    }else{

      this.reset(['commessa.cliente','commessa.dataInizo','comessa.dataFine',
      'commessa.nominativo']);
    }

    if(this.anagraficaDto.value.contratto!=null){

      check=this.checkValid(['contratto.tipoContratto.id','contratto.livelloContratto.id',
      'contratto.contrattoNazionale.id','contratto.tipoAzienda.id'])

    }else{

      this.reset(['contratto.tipoContratto.id','contratto.livelloContratto.id',
      'contratto.contrattoNazionale.id','contratto.tipoAzienda.id']);
    }

    if(check){

      return;

    }
    const body = JSON.stringify({
      anagraficaDto: this.anagraficaDto.value,

    });
    console.log(body);

    

    this.anagraficaDtoService.update(body).subscribe((result) => {
      console.log(result);
      if ((result as any).esito.code != 0) {
        this.showErrorPopup = true;
        this.errore = true;
        this.messaggio = (result as any).esito.target;
        return;
      } else {

        this.showSuccessPopup = true;

      }
    });
    this.router.navigate(['/dettaglio-anagrafica',this.id]);
  
    }

  

  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
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

    let check=false;

    for(let element of myArray){


      if(this.isControlInvalid(element)){

        check=true;

      }
    
    }

    return check;
  }
      
    isControlInvalid(controlName: string):boolean {
      const control = this.anagraficaDto.get(controlName);
      const inputElement = document.getElementById(controlName);
     
      if(!(control?.dirty && control?.value!=null && control?.value!="" )){
        inputElement?.classList.add('invalid-field');
        return true;
    }else{
        inputElement?.classList.remove('invalid-field');
        return false;
      }
  
      }

      reset(myArray: string[]){

        for(let element of myArray){


          const inputElement = document.getElementById(element);
       
          inputElement?.classList.remove('invalid-field');
           
          }
        
        }

  }



