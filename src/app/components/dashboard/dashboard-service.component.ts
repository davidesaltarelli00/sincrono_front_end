import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  token:any;

  constructor(private http: HttpClient) { }

  listaDashboard(token: any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`http://localhost:8080/services/dashboard`,{
      headers: headers,});

  }

  listaScattiContratto(token: any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`http://localhost:8080/services/anagrafica-list-contratti`,{
      headers: headers,});

  }

  deleteScattiContratto(token: any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`http://localhost:8080/services/anagraficaDeleteScattoContratti`,{
      headers: headers,});

  }


}
