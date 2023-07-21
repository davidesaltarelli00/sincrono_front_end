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

  // Salva il token provvisorio nel localStorage e assegnalo alla variabile tokenProvvisorio
  localStorage.setItem('tokenProvvisorio', this.tokenProvvisorio);

  // Formatta il token provvisorio (se necessario)
  const tokenParts = this.tokenProvvisorio.split('.');
  const tokenHeader = JSON.parse(atob(tokenParts[0]));
  const tokenPayload = JSON.parse(atob(tokenParts[1]));

  // Puoi accedere alle parti del token provvisorio come oggetti JSON
  console.log('Token provvisorio header:', tokenHeader);
  console.log('Token provvisorio payload:', tokenPayload);
});
  }

  recuperaPassword() {
    console.log("Start invocation method recuperaPassword");
    this.recuperoPasswordService
      .recuperaPassword(this.tokenProvvisorio, this.password)
      .subscribe(
        (res: any) => {
          console.log("RISPOSTA: "+ res);
          this.password = res;
          console.log('Recupero password avvenuto con successo');
          console.log('Nuova password:', this.password);
        },
        (error: any) => {
          console.log('Errore durante il recupero della password: ', error);
        }
      );
      console.log("end of invocation method recuperaPassword");
  }

  tornaAlogin() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    // Effettua il logout qui
    console.log('Effettua il logout qui');
  }
}
