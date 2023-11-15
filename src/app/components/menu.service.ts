import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
<<<<<<< HEAD
id:any;
url=`http://192.168.58.196:8085/funzioni-ruolo/tree/1`
=======
  url = `http://localhost:8080/services/`;

  constructor(private http: HttpClient) {}

  generateMenuByUserRole(token: any, idNav: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<MenuData>(this.url + `funzioni-ruolo-tree/${idNav}`, {
      headers: headers,
    });
  }

  getPermissions(token: any, functionId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<MenuData>(this.url + `operazioni/${functionId}`, {
      headers: headers,
    });
  }
}

interface MenuData {
  esito: {
    code: number;
    target: any;
    args: any;
  };
  list: {
    id: number;
    funzione: any;
    menuItem: number;
    nome: string;
    percorso: string;
    immagine: any;
    ordinamento: number;
    funzioni: any;
    privilegio: any;
  }[];
>>>>>>> develop
}
