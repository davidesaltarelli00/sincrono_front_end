import { Component, OnInit } from '@angular/core';
import { RecuperoPasswordService } from './form-recupero-password.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-recupero-password',
  templateUrl: './form-recupero-password.component.html',
  styleUrls: ['./form-recupero-password.component.scss'],
})
export class FormRecuperoPasswordComponent implements OnInit {
  tokenProvvisorio: any = '';
  password: any;

  constructor(
    private recuperoPasswordService: RecuperoPasswordService,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Estrai il token provvisorio dai parametri della URL
    this.route.params.subscribe((params) => {
      this.tokenProvvisorio = params['tokenProvvisorio'];

      // Ora puoi procedere con la richiesta per recuperare la password utilizzando questo token
      this.recuperaPassword();
    });
  }

  recuperaPassword() {
    this.recuperoPasswordService.recuperaPassword(this.tokenProvvisorio, this.password).subscribe(
      (res: any) => {
        this.password = res.password;

        // Memorizza il token provvisorio nel localStorage
        localStorage.setItem('tokenProvvisorio', this.tokenProvvisorio);

        this.router.navigate(['/form-recupero-password']);
      },
      (error: any) => {
        console.log('Errore ' + error);
      }
    );
  }
}
