import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.put<any>(`http://localhost:8085/contratto`, body);
  }

  insert(body: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8085/contratto`, body);
  }

  detail(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/contratto/${id}`);
  }
}
