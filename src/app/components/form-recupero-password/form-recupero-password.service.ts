import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecuperoPasswordService {
  url = '192.168.58.196:8080/services/';

  constructor(private http: HttpClient) {}

  recuperaPassword(tokenProvvisorio: string, password: string) {
    const token = localStorage.getItem('tokenProvvisorio');
    console.log('TOKEN PROVVISORIO NEL SERVICE: ' + token);
    const body = {
      token: tokenProvvisorio,
      password: password,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    console.log('Mando al server i seguenti dati: ' + 'Token: ' + body.token);
    console.log(' e la nuova password: ' + body.password);

    return this.http.put<any>(this.url + 'reset-password', body, { headers });
  }
}
