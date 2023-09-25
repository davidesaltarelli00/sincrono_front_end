// commessa.model.ts

export interface Commessa {
  id: number | null;
  cliente: string | null;
  clienteFinale: string | null;
  titoloPosizione: string | null;
  distacco: string | null;
  dataInizio: string | null;
  dataFine: string | null;
  costoMese: number | null;
  tariffaGiornaliera: number | null;
  nominativo: string | null;
  azienda: string | null;
  aziendaDiFatturazioneInterna: string | null;
  stato: boolean | null;
  attesaLavori: boolean | null;
}
