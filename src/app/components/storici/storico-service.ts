import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoricoService {
  token: any;

  constructor(private http: HttpClient) {}

  getStoricoContratti(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://192.168.58.196:8080/services/storico-contratti/${id}`,
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
      `http://192.168.58.196:8080/services/storico-commesse/${id}`,
      { headers: headers }
    );
  }

  riattivaCommessa(body: any, token:any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(
      `http://192.168.58.196:8080/services/retain-commessa`,body,
      { headers: headers }
    );
  }
}
