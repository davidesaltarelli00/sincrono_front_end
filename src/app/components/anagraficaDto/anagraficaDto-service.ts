import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable, filter } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnagraficaDtoService {
  // token: any;
  // url = environment.URL_locale_Sincrono;

  // constructor(private http: HttpClient) {}

  // /*CRUD ANAGRAFICA*/
  // listAnagraficaDto(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(`http://192.168.58.196:8080/services/list`, {
  //     headers: headers,
  //   });
  // }

  // getAllAziendaCliente(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(
  //     `http://localhost8080/services/tipo-azienda-cliente-map`,
  //     { headers: headers }
  //   );
  // }

  // detailAnagraficaDto(id: any, token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(
  //     `http://192.168.58.196:8080/services/dettaglio/${id}`,
  //     { headers: headers }
  //   );
  // }

  // storicizzaCommessa(body: any, token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.put<any>(
  //     `http://192.168.58.196:8080/services/commessa`,
  //     body,
  //     { headers: headers }
  //   );
  // }

  // riattivaUtente(body: any, token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.put<any>(
  //     `http://http://192.168.58.196:8080/services/retain`,
  //     body,
  //     { headers: headers }
  //   );
  // }

  // delete(body: any, token: any) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.put<any>(
  //     `http://192.168.58.196:8080/services/delete`,
  //     body,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // update(body: any, token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   console.log('BODY SERVICE:' + JSON.stringify(body));
  //   return this.http.put<any>(
  //     `http://192.168.58.196:8080/services/modifica`,
  //     body,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // filterAnagrafica(token: any, body: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.post<any>(
  //     `http://192.168.58.196:8080/services/filter`,
  //     body,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // caricaTipoCausaFineRapporto(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(this.url + `tipo-causa-fine-rapporto-map`, {
  //     headers: headers,
  //   });
  // }

  // caricaTipoCanaleReclutamento(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(
  //     `http://192.168.58.196:8080/services/tipo-canale-reclutamento-map`,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // filter(body: any, token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.post<any>(
  //     `http://192.168.58.196:8080/services/list`,
  //     body,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // getTipoContratto(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(
  //     `http://192.168.58.196:8080/services/tipo-contratto-map`,
  //     { headers: headers }
  //   );
  // }

  // getLivelloContratto(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(
  //     `http://192.168.58.196:8080/services/tipo-livelli-contrattuali-map`,
  //     { headers: headers }
  //   );
  // }

  // getTipoAzienda(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(
  //     `http://192.168.58.196:8080/services/tipo-azienda-map`,
  //     { headers: headers }
  //   );
  // }

  // getContrattoNazionale(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(
  //     `http://192.168.58.196:8080/services/tipo-ccnl-map`,
  //     {
  //       headers: headers,
  //     }
  //   ); //tipo-ccnl
  // }

  // getRuoli(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get<any>(`http://192.168.58.196:8080/services/ruoli-map`, {
  //     headers: headers,
  //   });
  // }

  // deleteCommessa(body: any, token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.put<any>(
  //     'http://192.168.58.196:8080/services/commessa',
  //     body,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // changeCCNL(token: any, ccnl: any): Observable<any> {
  //   ///livelli-by-ccnl/{ccnl}
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   const url = `http://localhost:8080/services/livelli-by-ccnl/${ccnl}`;
  //   console.log('URL CHANGE CCNL:' + url);
  //   return this.http.get<any>(url, {
  //     headers: headers,
  //   });
  // }

  // changeTipoCausaFineContrattoMap(token: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   const url = `http://localhost:8080/services/tipo-causa-fine-contratto-map`;
  //   console.log('URL changeTipoCausaFineContrattoMap:' + url);
  //   return this.http.get<any>(url, {
  //     headers: headers,
  //   });
  // }

  // salvaDocumento(body: any, token: any, options: any = {}): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${token}`,
  //   });

  //   return this.http.post(
  //     `http://localhost:8080/services/inserisci-excel`,
  //     body,
  //     {
  //       headers: headers,
  //       reportProgress: true,
  //       ...options,
  //     }
  //   );
  // }

  token: any;
  url =environment.URL_locale_Sincrono;
  testUrl = environment.URL_login_service;
  urlProd=environment.URL_PROD;

  constructor(private http: HttpClient) {}

  /*CRUD ANAGRAFICA*/
  listAnagraficaDto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url + `list`, {
      headers: headers,
    });
  }

  getAllAziendaCliente(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`tipo-azienda-cliente-map`,
      { headers: headers }
    );
  }

  detailAnagraficaDto(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`dettaglio/${id}`,
      { headers: headers }
    );
  }

  storicizzaCommessa(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.url+`commessa`, body, {
      headers: headers,
    });
  }

  riattivaUtente(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.url+`retain`, body, {
      headers: headers,
    });
  }

  delete(body: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.url+`delete`, body, {
      headers: headers,
    });
  }

  update(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    // console.log('BODY SERVICE:' + JSON.stringify(body));
    return this.http.put<any>(this.url+`modifica`, body, {
      headers: headers,
    });
  }

  insert(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      this.url+`inserisci`,
      body,
      {
        headers: headers,
      }
    );
  }

  filterAnagrafica(token: any, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.url+`filter`, body, {
      headers: headers,
    });
  }

  //GET UTENTI LIST
  getListaUtenti(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url+`utenti-list`, {
      headers: headers,
    });
  }

  caricaTipoCausaFineRapporto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`tipo-causa-fine-rapporto-map`,
      {
        headers: headers,
      }
    );
  }

  caricaTipoCanaleReclutamento(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`tipo-canale-reclutamento-map`,
      {
        headers: headers,
      }
    );
  }

  //FILTER ANAGRAFICA
  filter(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.url+`list`, body, {
      headers: headers,
    });
  }
  //GET TIPOLOGICHE
  getTipoContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`tipo-contratto-map`,
      { headers: headers }
    );
  }

  getLivelloContratto(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`tipo-livelli-contrattuali-map`,
      { headers: headers }
    );
  }

  getTipoAzienda(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(
      this.url+`tipo-azienda-map`,
      { headers: headers }
    );
  }

  getContrattoNazionale(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url+`tipo-ccnl-map`, {
      headers: headers,
    }); //tipo-ccnl
  }

  getRuoli(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(this.url+`ruoli-map`, {
      headers: headers,
    });
  }

  deleteCommessa(body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(this.url+'commessa', body, {
      headers: headers,
    });
  }

  changeCCNL(token: any, ccnl: any): Observable<any> {
    ///livelli-by-ccnl/{ccnl}
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = this.url+`livelli-by-ccnl/${ccnl}`;
    // console.log('URL CHANGE CCNL:' + url);
    return this.http.get<any>(url, {
      headers: headers,
    });
  }

  changeTipoCausaFineContrattoMap(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });
    const url = this.url+`tipo-causa-fine-contratto-map`;
    // console.log('URL changeTipoCausaFineContrattoMap:' + url);
    return this.http.get<any>(url, {
      headers: headers,
    });
  }

  salvaDocumento(body: any, token: any, options: any = {}): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.url+`inserisci-excel`, body, {
      headers: headers,
      reportProgress: true,
      ...options,
    });
  }

}
