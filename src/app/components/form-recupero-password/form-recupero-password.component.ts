import { Component, OnInit } from '@angular/core';
import { RecuperoPasswordService } from './form-recupero-password.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-recupero-password',
  templateUrl: './form-recupero-password.component.html',
  styleUrls: ['./form-recupero-password.component.scss'],
})
export class FormRecuperoPasswordComponent implements OnInit {
  tokenProvvisorio: string = '';
  password: string = '';

  constructor(
    private recuperoPasswordService: RecuperoPasswordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Estrai il token provvisorio dai parametri della URL
    this.route.params.subscribe((params) => {
      this.tokenProvvisorio = params['tokenProvvisorio'];
    });
  }

  recuperaPassword() {
    this.recuperoPasswordService.recuperaPassword(this.tokenProvvisorio, this.password).subscribe(
      (res: any) => {
        // Recupero password avvenuto con successo, puoi effettuare azioni aggiuntive se necessario
        // Ad esempio, puoi reindirizzare l'utente a una pagina di successo o mostrare un messaggio di conferma
        console.log('Recupero password avvenuto con successo');
        console.log('Nuova password:', this.password);

        // Effettua l'operazione di logout dopo aver recuperato la password (opzionale)
        this.logout();

        // Puoi anche reindirizzare l'utente a una pagina di successo
        this.router.navigateByUrl('/recupero-password-successo');
      },
      (error: any) => {
        console.log('Errore durante il recupero della password: ', error);
        // Puoi gestire l'errore mostrando un messaggio all'utente o effettuando altre azioni necessarie
      }
    );
  }

  tornaAlogin() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    // Esempio di funzione per effettuare il logout
    // Puoi implementare la tua logica di logout se necessario
    // Rimuovi il token dal localStorage o dall'auth service
    // Effettua altre operazioni per resettare lo stato dell'applicazione
    console.log('Effettua il logout qui');
  }
}
