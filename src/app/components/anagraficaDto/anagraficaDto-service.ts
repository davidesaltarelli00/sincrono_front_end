import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root',
})
export class AnagraficaDtoService {
  token: any;

  constructor(private http: HttpClient) {}

  /*CRUD ANAGRAFICA*/
  listAnagraficaDto(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/list`); ///lista
  }

  detailAnagraficaDto(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/dettaglio/${id}`);
  }

  delete(body: any) {
    return this.http.put<any>(`http://localhost:8085/delete`, body, {
      headers: headers,
    });
  }

  update(body: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8085/modifica`, body, {
      headers: headers,
    });
  }

  deleteCommessa(body: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8085/commessa`, body, {
      headers: headers,
    });
  }

  insert(body: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8085/inserisci`, body, {
      headers: headers,
    });
  }

  //GET UTENTI LIST
  getListaUtenti(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/utenti-list`, {
      headers: headers,
    });
  }

  //FILTER ANAGRAFICA
  filter(body: any): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8085/anagrafica-list-filter`,
      body,
      {
        headers: headers,
      }
    );
  }
  //GET TIPOLOGICHE
  getTipoContratto(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/tipo-contratto/map`);
  }

  getLivelloContratto(): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8085/tipo-livelli-contrattuali/map`
    );
  }

  getTipoAzienda(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/tipo-azienda/map`);
  }

  getContrattoNazionale(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/tipo-ccnl/map`);
  }

  getRuoli(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/ruoli/map`);
  }
}
