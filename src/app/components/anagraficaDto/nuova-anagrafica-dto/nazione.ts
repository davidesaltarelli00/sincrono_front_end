import { Provincia } from "./provincia";

export class Nazione {
  nazione: string;
  capitale: string;
  province: Provincia[];

  constructor(nazione: string, capitale: string, province: Provincia[] = []) {
    this.nazione = nazione;
    this.capitale = capitale;
    this.province = province;
  }
}
