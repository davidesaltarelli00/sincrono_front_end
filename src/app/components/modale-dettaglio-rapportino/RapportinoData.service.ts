import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RapportinoDataService {
  selectedRapportino: any;

  constructor() {}

  setRapportino(rapportino: any) {
    this.selectedRapportino = rapportino;
  }

  getRapportino() {
    return this.selectedRapportino;
  }
}
