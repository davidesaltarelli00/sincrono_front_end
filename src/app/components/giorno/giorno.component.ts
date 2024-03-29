import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
interface TimeSlot {
  time: string;
  checked: boolean;
  activity: string;
}

interface TimeSlot {
  time: string;
  checked: boolean;
  activity: string;
}

@Component({
  selector: 'app-giorno',
  templateUrl: './giorno.component.html',
  styleUrls: ['./giorno.component.scss'],
})
export class GiornoComponent implements OnInit {
  selectedDate: any;
  formattedDate: any;
  hours: string[] = [];
  selectedHours: boolean[] = new Array(24).fill(false);
  selectedRange: number[] = [];
  timeSlots: TimeSlot[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const dateString = params['date'];
      this.selectedDate = new Date(dateString);
      this.formatDate();
      this.generateHours();
    });
  }

  formatDate() {
    this.formattedDate = this.selectedDate.toDateString();
  }

  generateHours() {
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      this.hours.push(`${hour}:00`);
      this.timeSlots.push({ time: `${hour}:00`, checked: false, activity: '' });
    }
  }

  onInput(event: Event, index: number) {
    const target = event.target as HTMLTableCellElement;
    const activity = target.innerText.trim();
    this.timeSlots[index].activity = activity;
  }

  onCheckboxChange(index: number) {
    if (this.selectedHours[index]) {
      // Se la checkbox è selezionata, evidenzia solo l'ora corrispondente
      this.clearSelectedHours();
      this.selectedHours[index] = true;
      this.selectedRange = [index, index]; // Imposta il range selezionato come un singolo elemento
    } else {
      // Se la checkbox è deselezionata, rimuovi l'evidenziazione
      this.selectedHours[index] = false;
      this.selectedRange = []; // Rimuovi il range selezionato
    }
  }

  isHourSelected(index: number): boolean {
    return this.selectedHours[index];
  }

  onCheckboxRangeChange(startIndex: number, endIndex: number) {
    this.clearSelectedHours();
    this.selectedRange = [startIndex, endIndex];
    for (let i = startIndex; i <= endIndex; i++) {
      this.selectedHours[i] = true;
    }
  }

  isHourInSelectedRange(index: number): boolean {
    if (this.selectedRange.length === 2) {
      return index >= this.selectedRange[0] && index <= this.selectedRange[1];
    }
    return false;
  }

  clearSelectedHours() {
    this.selectedHours.fill(false);
    this.selectedRange = [];
  }

  saveActivity(index: number) {
    if (!this.timeSlots[index]) {
      this.timeSlots[index] = { time: this.hours[index], checked: false, activity: '' };
    }
    const activity = this.timeSlots[index].activity;
    console.log(`Attività salvata per l'ora ${this.timeSlots[index].time}: ${activity}`);
  }

  clearActivity(index: number) {
    if (this.timeSlots[index]) {
      const time = this.timeSlots[index].time;
      const activity = this.timeSlots[index].activity;
      this.timeSlots[index].activity = '';
      console.log(`Attività eliminata per l'orario ${time}: ${activity}`);
    }

  }

}
