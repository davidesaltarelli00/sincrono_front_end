import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RapportinoService {
  url = `http://localhost:8080/services/`;
  codiceFiscale: any;
  anno: any;
  mese: any;

  constructor(private http: HttpClient) {}

  getRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    // const url = this.url + 'get-rapportino';
    // console.log('URL:' + url);
    return this.http.post<any>(this.url + 'get-rapportino', body, {
      headers: headers,
    });
  }

  updateRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = this.url + 'update-rapportino';
    console.log('URL:' + url);
    return this.http.post<any>(this.url + 'update-rapportino', body, {
      headers: headers,
    });
  }
}
