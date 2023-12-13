import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileBoxService {
  token = localStorage.getItem('token');
  url =environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd=environment.URL_PROD;
  URLPRODPROVA=environment.URL_PRODUZIONEProva;

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
        this.URLPRODPROVA+`dettaglio-token/${token}`,
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
    const url = this.url+`get-rapportino/${codiceFiscale}`;
    return this.http.get<any>(url, {
      headers: headers,
    });
  }

}
