import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthenticationResponse } from './login/AuthenticationResponse';
// import { AuthenticationResponse } from 'path-to-authentication-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<AuthenticationResponse> {
    const body = {
      email: username,
      password: password
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authenticate', 'token');

    // return this.http.post<AuthenticationResponse>('http://localhost:8080/login-service/authenticate', body, { headers });
    return this.http.post<AuthenticationResponse>('http://localhost:8080/login-service/authenticate', body, { headers })
    .pipe(
      tap(response => {
        if(!response.token){
          location.reload(), "Token non presente."
        } else{
          localStorage.setItem('token', response.token); // Memorizza il token nel localStorage
        }
      })
    );

  }
  getAuthenticatedResource(resourceUrl: string): Observable<any> {
    const token = localStorage.getItem('token'); // Ottieni il token dal localStorage o da una fonte sicura
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(resourceUrl, { headers });
  }

logout(){
  localStorage.clear();
}

}
