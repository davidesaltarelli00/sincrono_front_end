import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private apiUrl = 'assets/maps.json';
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getNomiNazioni(): Observable<string[]> {
    return this.getData().pipe(
      map((data: any) => {
        const nomiNazioni: string[] = data.map((item: any) => item.nazione);
        return nomiNazioni;
      })
    );
  }

  getNomiCapitali(): Observable<string[]> {
    return this.getData().pipe(
      map((data: any) => {
        const nomiCapitali: string[] = data.map((item: any) => item.capitale);
        return nomiCapitali;
      })
    );
  }

  getNomiProvince(): Observable<string[]> {
    return this.getData().pipe(
      map((data: any) => {
        const nomiProvince: string[] = data
          .map((item: any) => item.province)
          .filter((province: any) => province)
          .reduce((acc: any[], province: any) => {
            return acc.concat(province.map((p: any) => p.nome));
          }, []);
        return nomiProvince;
      })
    );
  }

}
