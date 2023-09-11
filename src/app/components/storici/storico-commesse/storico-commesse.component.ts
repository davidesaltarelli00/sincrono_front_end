import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoricoService } from '../storico-service';

declare var $: any;

@Component({
  selector: 'app-storico-commesse',
  templateUrl: './storico-commesse.component.html',
  styleUrls: ['./storico-commesse.component.scss'],
})
export class StoricoCommesseComponent implements OnInit {
  lista: any;
  token: any;
  errore = false;
  messaggio: any;
  // paginazione
  currentPage: number = 1;
  itemsPerPage: number = 5; // Numero di elementi per pagina
  id = this.activatedRouter.snapshot.params['id'];
  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private storicoService: StoricoService
  ) {}

  ngOnInit(): void {
    var idAnagrafica = this.activatedRouter.snapshot.params['id'];
    this.storicoService
      .getStoricoCommesse(idAnagrafica, localStorage.getItem('token'))
      .subscribe(
        (resp: any) => {
          this.lista = resp.list;
          console.log(JSON.stringify(resp.list));
        },
        (error: any) => {
          console.error('Errore durante il caricamento dei dati: ' + error);
        }
      );
  }
  getStoricoCommesse(idAnagrafica: number): any {
    this.router.navigate(['/storico-commesse', idAnagrafica]);
  }

  transformDate(dateString: string): string {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
  }

  riattivaCommessa(id: number, posizione: number) {
    console.log('ID COMMESSA DA RIATTIVARE: ' + id);
    console.log("Posizione nell'array: " + posizione);

    const payload = {
      anagraficaDto: {
        anagrafica: null,
        contratto: null,
        commesse: [this.lista[posizione]],
        ruolo: null,
      },
    };

    console.log(JSON.stringify(payload));

    this.storicoService
      .riattivaCommessa(payload, localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          console.log(
            'Commessa storicizzata correttamente: ' + JSON.stringify(res)
          );
        },
        (error: any) => {
          alert(
            'Si è verificato un errore durante la storicizzazione della commessa selezionata: ' +
              error
          );
        }
      );
  }

  //paginazione
  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.lista.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.lista.length / this.itemsPerPage);
  }

  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
    }
  }

  //fine paginazione
}
