import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'AAAAAAAAAAAAAAAA',
    'Acces-Control-Allow-Origin': '*',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class ContrattoService {
  token: any;

  constructor(private http: HttpClient) {}

  /*CRUD CONTRATTO*/
  list(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/contratto-list`);
  }

  delete(id: any) {
    return this.http.delete<any>(`http://localhost:8085/contratto/${id}`);
  }

  update(body: any): Observable<any> {
    return this.http.put<any>(
      `http://localhost:8085/contratto`,
      body,
      httpOptions
    );
  }

  insert(body: any): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8085/contratto`,
      body,
      httpOptions
    );
  }

  detail(id: any): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8085/contratto/${id}`,
      httpOptions
    );
  }

  //GET TIPOLOGICHE
  getTipoContratto(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/tipo-contratto/map`);
  }

  getLivelloContratto(): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8085/tipo-livelli-contrattuali/map`
    );
  }

  getTipoAzienda(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/tipo-azienda/map`);
  }

  getContrattoNazionale(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/contratto-nazionale/map`); //tipo-ccnl
  }
}
