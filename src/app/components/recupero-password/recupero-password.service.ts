import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecuperoPasswordService {
  email: string = '';
  url = `http://localhost:8080/login-service/`;

  constructor(private http: HttpClient) {}

  recuperaPassword() {
    //questo metodo invierá l username dell'utente (la email al backend che invierá una mail con un token provvisorio per recuperare la password)
    const body = {
      username: this.email,
    };
    return this.http.post<any>(this.url + `recupero-password`, body);
  }
}
