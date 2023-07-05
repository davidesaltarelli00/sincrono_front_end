import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  token:any;

  constructor(private http: HttpClient) { }

  listaDashboard():Observable<any>{
    return this.http.post<any>(`http://localhost:8085/dashboard`,{
      headers: headers,});

  }

  listaScattiContratto():Observable<any>{
    return this.http.get<any>(`http://localhost:8085/anagrafica-list-contratti`,{
      headers: headers,});

  }

  deleteScattiContratto():Observable<any>{
    return this.http.delete<any>(`http://localhost:8085/anagraficaDeleteScattoContratti`,{
      headers: headers,});

  }


}
