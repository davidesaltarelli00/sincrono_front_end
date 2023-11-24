// theme.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode: boolean = false;

  constructor() {
    // Recupera il valore dal local storage all'avvio dell'app
    const savedTheme = localStorage.getItem('isDarkMode');
    this.isDarkMode = savedTheme === 'true';
  }

  // Restituisci lo stato corrente del tema
  isDarkModeEnabled(): boolean {
    return this.isDarkMode;
  }

  // Cambia lo stato del tema e aggiorna il local storage
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
  }
}
