import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class profileBoxService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) {
  }

  getToken(): string | null {
    console.log("TOKEN SERVICE:"+ this.token)
    return this.token;
  }

  getData(): any {
    const token = localStorage.getItem('token');
    if (token) {
      const url = `http://localhost:8085/dettaglio-token/${token}`;
      return this.http.get<any>(url);
    } else {
      console.error('Token non presente.');
      return null;
    }
  }
}
