import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RapportinoService {
  url = `http://localhost:8080/services/`;
  codiceFiscale: any;
  anno: any;
  mese: any;

  constructor(private http: HttpClient) {}

  getRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    // const url = this.url + 'get-rapportino';
    // console.log('URL:' + url);
    return this.http.post<any>(this.url + 'get-rapportino', body, {
      headers: headers,
    });
  }

  updateRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.url + 'update-rapportino', body, {
      headers: headers,
    });
  }

  /*
  /aggiungi-note (POST)
{
    "rapportinoDto": {
        "note":"PROVA 2",
        "anagrafica": {
            "codiceFiscale":"rneedpont43218k"
        },
        "annoRequest":2023,
        "meseRequest":10
    }
}
  */

  aggiungiNote(token: any, body: any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.url + 'aggiungi-note', body, {
      headers: headers,
    });
  }

}
