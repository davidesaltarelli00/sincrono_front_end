import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { profileBoxService } from '../profile-box/profile-box.service';

@Injectable({
  providedIn: 'root',
})
export class CambioPasswordService {
  urlLocale: string = `192.168.58.196:8080/services/`;
  anagrafica: any;
  idUtente: any;
  passwordVecchia: string = '';
  passwordNuova: string = '';

  constructor(
    private http: HttpClient,
    private profileBoxService: profileBoxService
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

  cambioPassword() {
    const token = localStorage.getItem('token');
    const body = {
      id: this.idUtente,
      passwordVecchia: this.passwordVecchia,
      passwordNuova: this.passwordNuova,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(this.urlLocale + `modifica-utente`, body, {
      headers,
    });
  }
}
