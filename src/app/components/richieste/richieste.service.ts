import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RichiesteService {
  url = environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd = environment.URL_PRODUZIONE;

  constructor(private http: HttpClient) {}

  inviaRichiesta(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + `inserisci-richiesta`, body, {
      headers: headers,
    });
  }

  getAllRichiesteDipendente(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + `list-richieste`, body, {
      headers: headers,
    });
  }

  cambiaStato(token: any, body: any): Observable<any> {
    //cambia-stato
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.urlProd + `cambia-stato`, body, {
      headers: headers,
    });
  }

  getRichiesta(token: any, idRichiesta: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = this.urlProd + `get-richiesta/${idRichiesta}`;
    return this.http.get<any>(url, {
      headers: headers,
    });
  }

  getAllRichiesteAccettate(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = this.urlProd + `list-richieste-accettate`;
    return this.http.post<any>(url, body, {
      headers: headers,
    });
  }

  checkElaborazione(token: any, body: any): Observable<any> {
    //
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = this.urlProd + `check-elaborazione`;
    return this.http.post<any>(url, body, {
      headers: headers,
    });
  }

  updateRichiesta(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = this.urlProd + `modifica-richiesta`;
    return this.http.put<any>(url, body, {
      headers: headers,
    });
  }
}
