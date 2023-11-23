import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RichiesteService {
  url = `http://localhost:8080/services/`;
  testUrl = `http://localhost:8085/`;

  constructor(private http: HttpClient) {}

  inviaRichiesta(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.testUrl + `inserisci-richiesta`, body, {
      headers: headers,
    });
  }
}
