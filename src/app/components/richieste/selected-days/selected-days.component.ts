import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-selected-days',
  templateUrl: './selected-days.component.html',
  styleUrls: ['./selected-days.component.scss']
})
export class SelectedDaysComponent {
  @Input() selectedDays: number[] = [];
  @Input() currentMonth: any;
  @Input() currentYear: any;

  constructor(){

  }

  getMonthName(month: number): string {
    const monthNames = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    return monthNames[month - 1];
  }

}
