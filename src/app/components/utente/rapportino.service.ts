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

  insertRapportino(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.url + 'invia-rapportino', body, {
      headers: headers,
    });
  }

  aggiungiNote(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.url + 'aggiungi-note', body, {
      headers: headers,
    });
  }
  aggiungiNoteDipendente(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.url + 'aggiungi-note-dipendente', body, {
      headers: headers,
    });
  }

  deleteRapportino(token: any, id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(this.url + `delete-rapportino-inviato/${id}`, {
      headers: headers,
    });
  }

  checkRapportinoInviato(token: any, body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.url + `get-check-rapportino-inviato`, body, {
      headers: headers,
    });
  }

  /*
    /get-check-rapportino-inviato
CheckRapportinoInviatoResponse
/get-check-rapportino-inviato,post
{
    "anno":2023,
    "mese":10,
    "codiceFiscale":"SLTDVDE31WS"
}
  */
}

/*
DeleteRapportinoInviato (sara sulla lista della get) (delete)
/delete-rapportino-inviato/{id}
no payload


 detailAnagraficaDto(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://localhost:8080/services/dettaglio/${id}`,
      { headers: headers }
    );
  }





















*/
