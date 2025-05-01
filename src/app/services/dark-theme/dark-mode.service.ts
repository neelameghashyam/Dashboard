import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  darkMode = signal<boolean>(false);

  constructor() {
    // Initialize from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      this.darkMode.set(savedMode === 'true');
    } else {
      this.darkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Watch for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('darkMode')) {
        this.darkMode.set(e.matches);
      }
    });
  }

  toggle() {
    this.darkMode.update(mode => {
      const newMode = !mode;
      localStorage.setItem('darkMode', String(newMode));
      return newMode;
    });
  }
}