import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileBoxService } from '../profile-box/profile-box.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CambioPasswordService {
  urlLocale: string = `http://192.168.58.196:8080/services/`;
  anagrafica: any;
  idUtente: any;
  passwordVecchia: string = '';
  passwordNuova: string = '';
  url =environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd=environment.URL_PRODUZIONE;

  constructor(
    private http: HttpClient,
    private profileBoxService: ProfileBoxService
  ) {
    const token = localStorage.getItem('token');
    // console.log('profile box component token: ' + token);
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        this.idUtente = response.anagraficaDto.anagrafica.utente.id;
        // console.log(
        //   'ID UTENTE valorizzato globalmente nel service: ' + this.idUtente
        // );
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
  }

  cambioPassword(token:any, body:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(this.urlProd + `modifica-utente`, body, {
      headers,
    });
  }
}
