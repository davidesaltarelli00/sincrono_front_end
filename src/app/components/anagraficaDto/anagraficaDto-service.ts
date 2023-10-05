import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnagraficaDtoService {
  token: any;

  constructor(private http: HttpClient) {}

  /*CRUD ANAGRAFICA*/
  listAnagraficaDto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`http://localhost:8080/services/list`, {
      headers: headers,
    }); 
  }

  detailAnagraficaDto(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://localhost:8080/services/dettaglio/${id}`,
      { headers: headers }
    );
  }

  storicizzaCommessa(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`http://localhost:8080/services/commessa`, body, {
      headers: headers,
    });
  }

  riattivaUtente(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`http://localhost:8080/services/retain`, body, {
      headers: headers,
    });
  }

  delete(body: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`http://localhost:8080/services/delete`, body, {
      headers: headers,
    });
  }

  update(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    console.log('BODY SERVICE:' + JSON.stringify(body));
    return this.http.put<any>(`http://localhost:8080/services/modifica`, body, {
      headers: headers,
    });
  }

  insert(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      `http://localhost:8080/services/inserisci`,
      body,
      {
        headers: headers,
      }
    );
  }

  filterAnagrafica(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`http://localhost:8080/services/filter`, body, {
      headers: headers,
    });
  }

  //GET UTENTI LIST
  getListaUtenti(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`http://localhost:8080/services/utenti-list`, {
      headers: headers,
    });
  }

  caricaTipoCausaFineRapporto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://localhost:8080/services/tipo-causa-fine-rapporto-map`,
      {
        headers: headers,
      }
    );
  }

  caricaTipoCanaleReclutamento(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://localhost:8080/services/tipo-canale-reclutamento-map`,
      {
        headers: headers,
      }
    );
  }

  //FILTER ANAGRAFICA
  filter(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`http://localhost:8080/services/list`, body, {
      headers: headers,
    });
  }
  //GET TIPOLOGICHE
  getTipoContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://localhost:8080/services/tipo-contratto-map`,
      { headers: headers }
    );
  }

  getLivelloContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://localhost:8080/services/tipo-livelli-contrattuali-map`,
      { headers: headers }
    );
  }

  getTipoAzienda(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://localhost:8080/services/tipo-azienda-map`,
      { headers: headers }
    );
  }

  getContrattoNazionale(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`http://localhost:8080/services/tipo-ccnl-map`, {
      headers: headers,
    }); //tipo-ccnl
  }

  getRuoli(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`http://localhost:8080/services/ruoli-map`, {
      headers: headers,
    });
  }

  deleteCommessa(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>('http://localhost:8080/services/commessa', body, {
      headers: headers,
    });
  }

  changeCCNL(token: any, ccnl: any): Observable<any> {
    ///livelli-by-ccnl/{ccnl}
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = `http://localhost:8080/services/livelli-by-ccnl/${ccnl}`;
    console.log('URL CHANGE CCNL:' + url);
    return this.http.get<any>(url, {
      headers: headers,
    });
  }
}
