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
  password: any;

  constructor(
    private recuperoPasswordService: RecuperoPasswordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tokenProvvisorio = params['tokenProvvisorio'];
      // Ora puoi chiamare il metodo per recuperare la password
      this.recuperaPassword();
    });
  }

  recuperaPassword() {
    this.recuperoPasswordService
      .recuperaPassword(this.tokenProvvisorio, this.password)
      .subscribe(
        (res: any) => {
          this.password = res.password;
        },
        (error: any) => {
          console.log('Errore ' + error);
        }
      );
  }

  // Metodo per il reindirizzamento
  redirectToFormRecuperoPassword() {
    // Reindirizza l'utente alla pagina /form-recupero-password/token
    this.router.navigate(['/form-recupero-password', this.tokenProvvisorio]);
  }
}
