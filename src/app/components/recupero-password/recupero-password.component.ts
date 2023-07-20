import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecuperoPasswordService } from './recupero-password.service';

@Component({
  selector: 'app-recupero-password',
  templateUrl: './recupero-password.component.html',
  styleUrls: ['./recupero-password.component.scss'],
})
export class RecuperoPasswordComponent implements OnInit {
  email: string = '';

  constructor(
    private router: Router,
    private recuperoPasswordService: RecuperoPasswordService
  ) {}

  ngOnInit(): void {}

  tornaAlogin() {
    this.router.navigateByUrl('/login');
    location.reload();
  }

  recuperaPassword() {
    this.recuperoPasswordService.recuperaPassword(this.email).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.log('Errore durante l invio dei dati: ' + error);
      }
    );
  }
}
