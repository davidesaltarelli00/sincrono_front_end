import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileBoxService {
  token = localStorage.getItem('token');
  URL_PROD = environment.URL_PRODUZIONE;

  constructor(private http: HttpClient) {}

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
      return this.http.get<any>(this.URL_PROD + `dettaglio-token/${token}`, {
        headers: headers,
      });
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
    const url = this.URL_PROD + `get-rapportino/${codiceFiscale}`;
    return this.http.get<any>(url, {
      headers: headers,
    });
  }
}
