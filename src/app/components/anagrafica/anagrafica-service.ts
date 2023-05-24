import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnagraficaService {

  token:any;

  constructor(private http: HttpClient) { }

    /*CRUD ANAGRAFICA*/
    listaAnagrafica():Observable<any>{
      return this.http.get<any>(`http://localhost:8080/UserService/anagrafica-personale`);
    }

    getNews(id:any):Observable<any>{
      return this.http.get<any>(`http://localhost:8085/angrafica/${id}`);
  }

  delete(id:any){
    return this.http.delete<any>(`http://localhost:8080/UserService/anagrafica-personale/${id}`)

  }

  update(body:any):Observable<any>{
    return this.http.put<any>(`http://localhost:8080/UserService/anagrafica-personale`,body);
  }

  inserisci(body:any):Observable<any>{
  return this.http.post<any>(`http://localhost:8080/UserService/anagrafica-personale`,body);
}

  /*COMMONS*/
  
  getProvince(){
    return this.http.get(`http://localhost:8080/CommonsService/province/map`);
  }

  getTitoli(){
    return this.http.get(`http://localhost:8080/CommonsService/titoli-studio/map`);
  }

  getAzienda(){
    return this.http.get(`http://localhost:8080/CommonsService/aziende/map`);
  }

  getTipoAnagrafica(){ 
    return this.http.get(`http://localhost:8080/CommonsService/tipi-anagrafica-personale/map`);
  }


}
