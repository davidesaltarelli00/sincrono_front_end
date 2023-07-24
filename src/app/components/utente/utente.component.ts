import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss']
})
export class UtenteComponent {
  currentDate: Date = new Date();
  currentMonthIndex: number = this.currentDate.getMonth(); // Indice del mese corrente
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendar: any[] = [];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private router: Router,private datePipe: DatePipe) {
    this.generateCalendar();
  }

  generateCalendar() {
    const currentMonth = new Date(this.currentDate.getFullYear(), this.currentMonthIndex, 1);
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    this.calendar = [];
    while (startDate <= endDate) {
      const week: any[] = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          day: startDate.getDate(),
          date: new Date(startDate)
        });
        startDate.setDate(startDate.getDate() + 1);
      }
      this.calendar.push(week);
    }
  }

  prevMonth() {
    this.currentMonthIndex--;
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11; // Torna a dicembre se il mese corrente è gennaio
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonthIndex++;
    if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0; // Torna a gennaio se il mese corrente è dicembre
    }
    this.generateCalendar();
  }

  openDayComponent(selectedDate: Date) {
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    this.router.navigate(['/giorno', formattedDate]);
  }


  isPrevButtonDisabled() {
    return this.currentMonthIndex === 0;
  }

  isNextButtonDisabled() {
    return this.currentMonthIndex === 11;
  }

}
