import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoricoService {
  token: any;
  urlProd = environment.URL_PRODUZIONE;

  constructor(private http: HttpClient) {}

  getStoricoContratti(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.urlProd + `storico-contratti/${id}`, {
      headers: headers,
    });
  }

  getStoricoCommesse(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.urlProd + `storico-commesse/${id}`, {
      headers: headers,
    });
  }

  riattivaCommessa(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.urlProd + `retain-commessa`, body, {
      headers: headers,
    });
  }
}
