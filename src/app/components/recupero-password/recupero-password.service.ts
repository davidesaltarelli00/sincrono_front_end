import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecuperoPasswordService {
  url =environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd=environment.URL_PRODUZIONE;
  urlLogin=environment.URL_locale_login;

  constructor(private http: HttpClient) {}

  recuperaPassword(email: string) {
    const body = {
      username: email,
    };
    return this.http.post<any>(this.urlLogin + `recupero-password`, body);
  }
}
