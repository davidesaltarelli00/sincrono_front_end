import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileBoxService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    console.log('TOKEN SERVICE:' + this.token);
    return this.token;
  }

  getData(): any {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(
        `http://localhost:8080/services/dettaglio-token/${token}`,
        { headers: headers }
      );
    } else {
      console.error('Token non presente.');
      return null;
    }
  }

  getRapportino(token: any, codiceFiscale: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = `http://localhost:8080/services/get-rapportino/${codiceFiscale}`;
    return this.http.get<any>(url, {
      headers: headers,
    });
  }

}
