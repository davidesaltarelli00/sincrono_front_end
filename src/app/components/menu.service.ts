import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  id: any;
  url = `http://localhost:8085/funzioni-ruolo/tree/1`;

  constructor(private http: HttpClient) {}

  sendRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      'http://localhost:8080/services/update-rapportino',
      body,
      {
        headers: headers,
      }
    );
  }
}

/*
 deleteCommessa(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>('http://localhost:8080/services/commessa', body, {
      headers: headers,
    });
  }
*/
