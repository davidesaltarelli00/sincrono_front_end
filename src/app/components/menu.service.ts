import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  token = localStorage.getItem('token');
  url =environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd=environment.URL_PROD;

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
}
