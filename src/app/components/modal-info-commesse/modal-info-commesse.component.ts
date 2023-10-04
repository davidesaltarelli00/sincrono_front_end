import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaDtoService } from '../anagraficaDto/anagraficaDto-service';

@Component({
  selector: 'app-modal-info-commesse',
  templateUrl: './modal-info-commesse.component.html',
  styleUrls: ['./modal-info-commesse.component.scss'],
})
export class ModalInfoCommesseComponent implements OnInit {
  id: any = this.activatedRoute.snapshot.params['id'];
  mobile: boolean;
  elencoCommesse: any[]=[];

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private anagraficaDtoService: AnagraficaDtoService,
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

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
