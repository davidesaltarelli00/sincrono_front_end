import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root',
})
export class StoricoService {
  token: any;

  constructor(private http: HttpClient) {}


  getStoricoContratti(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/storico-Contratti/${id}`);
  }

  getStoricoCommesse(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/storico-commesse-anagrafica/${id}`);
  }

}
