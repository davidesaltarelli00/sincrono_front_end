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
    const token = this.getToken();
    if (token) {
      const url = `http://localhost:8085/dettaglio-anagrafica-token/${token}`;
      console.log(url);
      return this.http.get<any>(url);
    } else {
      console.error('Token non presente.');
      return null;
    }
  }
}
