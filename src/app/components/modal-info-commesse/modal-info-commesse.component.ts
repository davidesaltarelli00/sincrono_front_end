import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { StepperService } from 'src/app/stepper.service';
import { ThemeService } from 'src/app/theme.service';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-modal-info-commesse',
  templateUrl: './modal-info-commesse.component.html',
  styleUrls: ['./modal-info-commesse.component.scss'],
})
export class ModalInfoCommesseComponent implements OnInit {
  id: any = this.activatedRoute.snapshot.params['id'];
  mobile: boolean;
  elencoCommesse: any[] = [];

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private anagraficaDtoService: AnagraficaDtoService,
    private clipboard: Clipboard,
    public themeService: ThemeService,
    private snackBar: MatSnackBar,
    private stepperService: StepperService,
    @Inject(MAT_DIALOG_DATA) public data: any
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
  }

  ngOnInit(): void {}

  copy(data: any) {
    this.clipboard.copy(data);
    this.snackBar.open(data + ' copiato negli appunti', '', {
      duration: 3000,
    });
  }

  modificaCommessa(id: any) {
    console.log(id);
    this.stepperService.setCurrentStep(2);
    this.router.navigate(['/modifica-commessa/' + id]);
    this.dialog.closeAll();
  }
  dettaglioAnagrafica(id: any) {
    console.log(id);
    this.stepperService.setCurrentStep(2);
    this.router.navigate(['/dettaglio-anagrafica/' + id]);
    this.dialog.closeAll();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  storicizza( posizione: number) {
    const payload = {
      commessa: this.elencoCommesse[posizione],
    };

    console.log(JSON.stringify(payload));

    this.anagraficaDtoService
      .storicizzaCommessa(payload, localStorage.getItem('token'))
      .subscribe(
        (res: any) => {
          console.log(
            'Commessa storicizzata correttamente: ' + JSON.stringify(res)
          );
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            data: {
              image: '../../../../assets/images/logo.jpeg',
              title: 'Commessa storicizzata correttamente.',
            },
          });
         location.reload();
        },
        (error: any) => {
          console.error(
            'Si è verificato un errore durante la storicizzazione della commessa selezionata: ' +
              error
          );
        }
      );
  }
}
