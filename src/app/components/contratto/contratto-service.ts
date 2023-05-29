import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root',
})
export class ContrattoService {
  token: any;

  constructor(private http: HttpClient) {}

  /*CRUD CONTRATTO*/

  delete(id: any) {
    return this.http.delete<any>(`http://localhost:8085/contratto/${id}`);
  }

  update(body: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8085/contratto`, body, {
      headers: headers,
    });
  }

  insert(body: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8085/contratto`, body, {
      headers: headers,
    });
  }

  detail(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/contratto/${id}`);
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
    return this.http.get<any>(`http://localhost:8085/contratto-nazionale/map`);
  }
}
