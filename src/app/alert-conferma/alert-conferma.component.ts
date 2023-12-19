import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-alert-conferma',
  templateUrl: './alert-conferma.component.html',
  styleUrls: ['./alert-conferma.component.scss']
})
export class AlertConfermaComponent {
  conferma = new EventEmitter<void>(); // Aggiungi un EventEmitter

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public themeService: ThemeService,
    public dialogRef: MatDialogRef<AlertConfermaComponent>
  ) {}

  chiudi() {
    this.dialogRef.close();
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  si() {
    this.conferma.emit(); // Emetti l'evento quando l'utente fa clic su "Si"
    this.dialogRef.close();
  }
}
