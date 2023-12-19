import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public themeService: ThemeService
  ) {}

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  chiudi() {
    this.dialog.closeAll();
  }
}
