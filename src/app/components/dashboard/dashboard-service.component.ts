import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  token: any;

  constructor(private http: HttpClient) {}

  listaDashboard(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`http://192.168.58.196:8080/services/dashboard`, {
      headers: headers,
    });
  }

  listaScattiContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      `http://192.168.58.196:8080/services/anagrafica-list-contratti`,
      {
        headers: headers,
      }
    );
  }

  deleteScattiContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(
      `http://192.168.58.196:8080/services/anagrafica-Delete-ScattoContratti`,
      {
        headers: headers,
      }
    );
  }

  //lista commesse in scadenza 2.0


   getListaCommesseInScadenza(token:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>('http://192.168.58.196:8080/services/list-commesse',{
      headers: headers,
    });
  }





//lista contratti in scadenza 2.0
  getListaContrattiInScadenza(token:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>('http://192.168.58.196:8080/services/list-contratti',{
      headers: headers,
    });
  }

  getAllCommesseScadute(token:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>('http://192.168.58.196:8080/services/list-all-commesse',{
    headers: headers,
  });
}

commesseListFilter(token:any,body:any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${token}`,
  });

  return this.http.post<any>('http://192.168.58.196:8080/services/list-filter',body,{
  headers: headers,
  });
}

}
