import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListaRapportiniService {
  url =environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd=environment.URL_PRODUZIONE;

  constructor(private http: HttpClient) {}

  getAllRapportiniNonFreezati(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + `list-not-freeze`, body, {
      headers: headers,
    });
  }

  

  deleteRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    // const url = this.url + 'get-rapportino';
    // console.log('URL:' + url);
    return this.http.post<any>(this.url + `rapportino-dbdelete`, body, {
      headers: headers,
    });
  }

  getExcelRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.url + `export-rapportino`, body, {
      headers: headers,
    });
  }
  getAllRapportiniFreezati(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + `list-freeze`, body, {
      headers: headers,
    });
  }

  UpdateCheckFreeze(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + `update-check-freeze`, body, {
      headers: headers,
    });
  }

  aggiungiNote(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.urlProd + 'aggiungi-note', body, {
      headers: headers,
    });
  }

  //filtri liste rapportini

  filterNotFreeze(token: any, body: any) {
    //filtro di ricerca per lista rapportini non freezati
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + `list-not-freeze-filter`, body, {
      headers: headers,
    });
  }

  filterFreeze(token: any, body: any) {
    //filtro di ricerca per lista rapportini freezati
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + `list-freeze-filter`, body, {
      headers: headers,
    });
  }

  mailSollecita(token:any, body:any):Observable<any>{ ///mail/send-rapportini
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + `mail/send-rapportini`, body, {
      headers: headers,
    });
  }

  //converte il rapportino in un file excel

  exportFileRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.urlProd + 'export-rapportino', body, {
      headers: headers,
    });
  }
}
