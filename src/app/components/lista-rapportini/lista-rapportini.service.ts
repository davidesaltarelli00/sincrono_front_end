import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListaRapportiniService {
  url = `http://localhost:8080/services/`;
  codiceFiscale: any;
  anno: any;
  mese: any;

  constructor(private http: HttpClient) {}

  getAllRapportiniNonFreezati(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `list-not-freeze`, {
      headers: headers,
    });
  }

  getAllRapportiniFreezati(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `list-freeze`, {
      headers: headers,
    });
  }

  UpdateCheckFreeze(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.url + `update-check-freeze`, body, {
      headers: headers,
    });
  }

  aggiungiNote(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.url + 'aggiungi-note', body, {
      headers: headers,
    });
  }
}
