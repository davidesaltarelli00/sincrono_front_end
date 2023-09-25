import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class profileBoxService {
  token = localStorage.getItem('token');

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
      return this.http.get<any>(
        `http://192.168.58.196:8080/services/dettaglio-token/${token}`,
        { headers: headers }
      );
    } else {
      console.error('Token non presente.');
      return null;
    }
  }
}
