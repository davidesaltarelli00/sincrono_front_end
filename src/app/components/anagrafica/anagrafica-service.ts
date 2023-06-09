import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root',
})
export class AnagraficaService {
  token: any;

  constructor(private http: HttpClient) {}

  /*CRUD ANAGRAFICA*/
  listAnagraficaDto(body: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8085/anagrafica-list-filter`, body, {
      headers: headers,
    });
  }

  detail(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/anagrafica/${id}`);
  }

  detailAnagraficaDto(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/dettaglio-anagrafica/${id}`);
  }

  delete(id: any) {
    return this.http.delete<any>(`http://localhost:8085/anagrafica/${id}`);
  }

  update(body: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8085/anagrafica`, body, {
      headers: headers,
    });
  }

  insert(body: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8085/anagrafica`, body, {
      headers: headers,
    });
  }

  //GET UTENTI LIST
  getListaUtenti(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/utenti-list`, {
      headers: headers,
    });
  }
}
