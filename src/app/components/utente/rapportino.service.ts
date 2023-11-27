import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RapportinoService {
  url =environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd=environment.URL_PRODUZIONE;


  constructor(private http: HttpClient) {}

  getRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    // const url = this.urlProd + 'get-rapportino';
    // console.log('URL:' + url);
    return this.http.post<any>(this.urlProd + 'get-rapportino', body, {
      headers: headers,
    });
  }

  updateRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.urlProd + 'update-rapportino', body, {
      headers: headers,
    });
  }

  insertRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.urlProd + 'invia-rapportino', body, {
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
  aggiungiNoteDipendente(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.urlProd + 'aggiungi-note-dipendente', body, {
      headers: headers,
    });
  }

  deleteRapportino(token: any, id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(this.urlProd + `delete-rapportino-inviato/${id}`, {
      headers: headers,
    });
  }

  checkRapportinoInviato(token: any, body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.urlProd + `get-check-rapportino-inviato`, body, {
      headers: headers,
    });
  }


  getAllRichiesteAccettate(token:any, body:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.testUrl + `list-richieste-accettate`, body, {
      headers: headers,
    });
  }
}
