import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: 'root'
})
export class CommessaService {

  token:any;

  constructor(private http: HttpClient) { }

  /*CRUD COMMESSA*/
  list():Observable<any>{
    return this.http.get<any>(`http://localhost:8085/commessa-list`);
  }
  
  delete(id:any){
    return this.http.delete<any>(`http://localhost:8085/commessa/${id}`)
  }

  update(body:any):Observable<any>{
    return this.http.put<any>(`http://localhost:8085/commessa`,body,{
      headers: headers,
    });
  }

  insert(body:any):Observable<any>{
  return this.http.post<any>(`http://localhost:8085/commessa`,body,{
    headers: headers,
  });
}

  detail(id:any):Observable<any>{
    return this.http.get<any>(`http://localhost:8085/commessa/${id}`);
}

}
