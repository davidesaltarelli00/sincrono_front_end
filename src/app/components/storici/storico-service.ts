import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoricoService {
  token: any;
  url = environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd = environment.URL_PROD;
  constructor(private http: HttpClient) {}

  getStoricoContratti(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`storico-contratti/${id}`,
      { headers: headers }
    );
  }

  getStoricoCommesse(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`storico-commesse/${id}`,
      { headers: headers }
    );
  }

  riattivaCommessa(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(
      this.url+`retain-commessa`,
      body,
      { headers: headers }
    );
  }
}
