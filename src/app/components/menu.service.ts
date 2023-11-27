import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  id: any;
  url = environment.URL_locale_Sincrono;
  URL_PROD=environment.URL_PRODUZIONE;

  constructor(private http: HttpClient) {}

  generateMenuByUserRole(token: any, idNav: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<MenuData>(this.URL_PROD+ `funzioni-ruolo-tree/${idNav}`, {
      headers: headers,
    });
  }

  getPermissions(token: any, functionId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<MenuData>(this.URL_PROD + `operazioni/${functionId}`, {
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
}
