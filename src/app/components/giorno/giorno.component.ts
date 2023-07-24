import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-giorno',
  templateUrl: './giorno.component.html',
  styleUrls: ['./giorno.component.scss'],
})
export class GiornoComponent implements OnInit {
  selectedDate: any;
  formattedDate: any;

  constructor(private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const dateString = params['date'];
      this.selectedDate = this.parseDateStringToDate(dateString);
      if (this.selectedDate) {
        this.formatDate();
      } else {
        console.error('Data non valida:', dateString);
      }
    });
  }

  parseDateStringToDate(dateString: string): Date | null {
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month - 1, day); // Mese inizia da 0 (0 = gennaio, 1 = febbraio, ecc.)
      }
    }
    return null;
  }

  formatDate() {
    this.formattedDate = this.datePipe.transform(this.selectedDate, 'dd, MMMM yyyy');
  }
}
