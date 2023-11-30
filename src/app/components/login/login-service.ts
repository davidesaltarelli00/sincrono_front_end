import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthenticationResponse } from './login/AuthenticationResponse';
import { environment } from 'src/environments/environment';
// import { AuthenticationResponse } from 'path-to-authentication-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd = environment.URL_PRODUZIONE_LOGIN;
  urlLogin = environment.URL_locale_login;
  constructor(private http: HttpClient) {}

  authenticate(
    username: string,
    password: string
  ): Observable<AuthenticationResponse> {
    const body = {
      email: username,
      password: password,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authenticate: 'token',
    });

    return this.http
      .post<AuthenticationResponse>(this.urlProd + 'login', body, { headers })
      .pipe(
        tap((response) => {
          if (!response.token) {
            console.error('Token non presente.');
          } else {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  getAuthenticatedResource(resourceUrl: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token non presente.');
      // Qui puoi gestire l'errore in modo appropriato o reindirizzare l'utente alla pagina di login
      // Ad esempio, puoi utilizzare il Router per navigare all'url di login:
      // this.router.navigate(['/login']);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(resourceUrl, { headers });
  }

  // logout() {
  //   const body = {
  //     token: localStorage.getItem('token'),
  //   };
  //   console.log('Body logout:' + body.token);

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authenticate: 'token',
  //   });

  //   return this.http.put(`http://localhost:8080/services/logout`, body, { headers });
  // }

  logout() {
    const token = localStorage.getItem('token');
    console.log('Token logout:', token);
    const body = {
      token: token,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(this.url + 'logout', body, {
      headers,
    });
  }
}
