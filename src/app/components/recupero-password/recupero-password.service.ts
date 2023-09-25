import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecuperoPasswordService {
  private url = `192.168.58.196:8080/login-service/`;

  constructor(private http: HttpClient) {}

  recuperaPassword(email: string) {
    const body = {
      username: email,
    };
    return this.http.post<any>(this.url + `recupero-password`, body);
  }
}
