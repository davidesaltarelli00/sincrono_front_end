import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tutorial-compilazione-rapportino',
  templateUrl: './tutorial-compilazione-rapportino.component.html',
  styleUrls: ['./tutorial-compilazione-rapportino.component.scss'],
})
export class TutorialCompilazioneRapportinoComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ok() {
    this.dialog.closeAll();
  }
}
