import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ListaRapportiniService } from '../lista-rapportini/lista-rapportini.service';

@Component({
  selector: 'app-mail-sollecita',
  templateUrl: './mail-sollecita.component.html',
  styleUrls: ['./mail-sollecita.component.scss'],
})
export class MailSollecitaComponent {
  token = localStorage.getItem('token');
  mobile = false;
  toRapportini: any[] = [];
  subject: string = '';
  body: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { elencoMail: string[] },
    public dialog: MatDialog,
    private listaRapportiniService: ListaRapportiniService
  ) {
    if (window.innerWidth >= 900) {
      // 768px portrait
      this.mobile = false;
    } else {
      this.mobile = true;
    }
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) == true
    ) {
      this.mobile = true;
    }
    this.toRapportini = data.elencoMail;
    console.log(
      'Contenuto arrivato alla modale: ' + JSON.stringify(this.toRapportini)
    );
  }

  onSubmit() {
    // Esegui azioni con i dati del form
    console.log('To:', this.toRapportini);
    console.log('Subject:', this.subject);
    console.log('Body:', this.body);
    let body = {
      body: this.body,

      subject: this.subject,

      toRapportini: this.toRapportini,
    };

    console.log('BODY PER SEND MAIL:' + JSON.stringify(body));
    this.listaRapportiniService.mailSollecita(this.token, body).subscribe(
      (result: any) => {
        console.log('Mail inviata correttamente:' + JSON.stringify(result));
      },
      (error: any) => {
        console.error(
          "Errore durante l'invio della mail: " + JSON.stringify(error)
        );
      }
    );
  }

  reset() {
    this.subject = '';
    this.body = '';
    this.toRapportini=[];
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
