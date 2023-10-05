import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-modal-info-contratto',
  templateUrl: './modal-info-contratto.component.html',
  styleUrls: ['./modal-info-contratto.component.scss'],
})
export class ModalInfoContrattoComponent {
  id: any = this.activatedRoute.snapshot.params['id'];
  mobile: boolean;
  contratto: any;

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private anagraficaDtoService: AnagraficaDtoService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
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

  copy(data: any) {
    this.clipboard.copy(data);
    this.snackBar.open(data + ' copiato negli appunti', '', {
      duration: 3000,
    });
  }

  modifica(id: any) {
    console.log(id);
    this.router.navigate(['/modifica-anagrafica/' + id]);
    this.dialog.closeAll();
  }
  dettaglio(id: any) {
    console.log(id);
    this.router.navigate(['/dettaglio-anagrafica/' + id]);
    this.dialog.closeAll();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
