import { Component } from '@angular/core';
import { AuthService } from '../login/login-service';
import { profileBoxService } from './profile-box.service';

@Component({
  selector: 'app-profile-box',
  templateUrl: './profile-box.component.html',
  styleUrls: ['./profile-box.component.scss'],
})
export class ProfileBoxComponent {
  isRisorseUmane: boolean = false;

  anagrafica: any;
  username_accesso = null;

  constructor(
    private authService: AuthService,
    private profileBoxService: profileBoxService
  ) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    // console.log("profile box component token: "+ token)
    this.profileBoxService.getData().subscribe(
      (response: any) => {
        this.anagrafica = response;
        this.username_accesso = response.anagraficaDto.anagrafica.mailAziendale;
      },
      (error: any) => {
        console.error(
          'Si é verificato il seguente errore durante il recupero dei dati : ' +
            error
        );
      }
    );
  }
}
