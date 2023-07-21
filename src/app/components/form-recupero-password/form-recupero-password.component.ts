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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tokenProvvisorio = params['tokenProvvisorio'];
      // Memorizza il token provvisorio nel localStorage
      localStorage.setItem('tokenProvvisorio', this.tokenProvvisorio);
      // Ora puoi chiamare il metodo per recuperare la password
      this.recuperaPassword();
    });
  }

  recuperaPassword() {
    this.recuperoPasswordService.recuperaPassword(this.tokenProvvisorio,this.password).subscribe(
      (res: any) => {
        this.password = res.password;
        const tokenProvvisorio= localStorage.getItem('tokenProvvisorio');
        this.tokenProvvisorio=tokenProvvisorio;

      },
      (error: any) => {
        console.log('Errore ' + error);
      }
    );
  }
}
