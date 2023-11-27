import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  token: any;
  url = environment.URL_locale_Sincrono;
  URL_PROD = environment.URL_PRODUZIONE;

  constructor(private http: HttpClient) {}

  listaDashboard(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.URL_PROD + `dashboard`, {
      headers: headers,
    });
  }

  listaScattiContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.URL_PROD + `anagrafica-list-contratti`, {
      headers: headers,
    });
  }

  deleteScattiContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(
      this.URL_PROD + `anagrafica-Delete-ScattoContratti`,
      {
        headers: headers,
      }
    );
  }

  //lista commesse in scadenza 2.0

  getListaCommesseInScadenza(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.URL_PROD + 'list-commesse', {
      headers: headers,
    });
  }

  //lista contratti in scadenza 2.0
  getListaContrattiInScadenza(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.URL_PROD + 'list-contratti', {
      headers: headers,
    });
  }

  getAllCommesseScadute(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.URL_PROD + 'list-all-commesse', {
      headers: headers,
    });
  }

  commesseListFilter(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.URL_PROD + 'list-filter', body, {
      headers: headers,
    });
  }

  getAziendaCliente(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.URL_PROD + 'tipo-azienda-cliente-map', {
      headers: headers,
    });
  }
}
