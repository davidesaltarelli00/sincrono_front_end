import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecuperoPasswordService {
  url = 'http://localhost:8080/services/';

  constructor(private http: HttpClient) {}

  recuperaPassword(tokenProvvisorio: string, password: string) {
    const body = {
      token: tokenProvvisorio,
      password: password,
    };

    return this.http.put<any>(this.url + 'reset-password', body);
  }
}
