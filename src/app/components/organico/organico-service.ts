import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganicoService {
  token: any;
  URL_PROD = environment.URL_PRODUZIONE;

  constructor(private http: HttpClient) {}

  listaOrganico(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.URL_PROD + `organico`, {
      headers: headers,
    });
  }
}
