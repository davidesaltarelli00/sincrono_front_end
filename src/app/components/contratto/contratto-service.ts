import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContrattoService {
  token: any;
  url = environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;

  constructor(private http: HttpClient) {}

  /*CRUD CONTRATTO*/
  list(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `contratto-list`, {
      headers: headers,
    });
  }

  delete(id: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(this.url + `contratto/${id}`, {
      headers: headers,
    });
  }

  update(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.url + `contratto`, body, {
      headers: headers,
    });
  }

  insert(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.url + `contratto`, body, {
      headers: headers,
    });
  }

  detail(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `contratto/${id}`, {
      headers: headers,
    });
  }

  //GET TIPOLOGICHE
  getTipoContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `tipo-contratto-map`, {
      headers: headers,
    });
  }

  getLivelloContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `tipo-livelli-contrattuali-map`);
  }

  getTipoAzienda(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `tipo-azienda-map`, {
      headers: headers,
    });
  }

  getAllAziendaCliente(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `tipo-azienda-cliente-map`, {
      headers: headers,
    });
  }

  getContrattoNazionale(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `tipo-ccnl-map`, {
      headers: headers,
    });
  }
}
