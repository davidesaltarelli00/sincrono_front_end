import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: 'root'
})
export class OrganicoService {

  token:any;

  constructor(private http: HttpClient) { }

  listaOrganico():Observable<any>{
    return this.http.post<any>(`http://localhost:8085/organico`,{
      headers: headers,});

  }
  

}
