import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecuperoPasswordService {
  url = environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd = environment.URL_PROD;
  urlLogin = environment.URL_locale_login;

  constructor(private http: HttpClient) {}

  recuperaPassword(tokenProvvisorio: string, password: string) {
    const token = localStorage.getItem('tokenProvvisorio');
    const body = {
      token: tokenProvvisorio,
      password: password,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.url + 'reset-password', body, { headers });
  }
}
