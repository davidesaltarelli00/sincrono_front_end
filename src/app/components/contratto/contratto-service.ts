import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContrattoService {
  token: any;

  constructor(private http: HttpClient) {}

  /*CRUD CONTRATTO*/
  list(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`http://192.168.58.196:8080/services/contratto-list`, {
      headers: headers,
    });
  }

  delete(id: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`192.168.58.196:8085/contratto/${id}`, {
      headers: headers,
    });
  }

  update(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`192.168.58.196:8085/contratto`, body, {
      headers: headers,
    });
  }

  insert(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      `http://192.168.58.196:8080/services/contratto`,
      body,
      { headers: headers }
    );
  }

  detail(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://192.168.58.196:8080/services/contratto/${id}`,
      { headers: headers }
    );
  }

  //GET TIPOLOGICHE
  getTipoContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://192.168.58.196:8080/services/tipo-contratto-map`,
      { headers: headers }
    );
  }

  getLivelloContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `192.168.58.196:8085/tipo-livelli-contrattuali-map`
    );
  }

  getTipoAzienda(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`192.168.58.196:8085/tipo-azienda-map`, {
      headers: headers,
    });
  }

  getContrattoNazionale(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`192.168.58.196:8085/tipo-ccnl-map`, {
      headers: headers,
    });
  }
}
