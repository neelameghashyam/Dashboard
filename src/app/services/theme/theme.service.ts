import { Injectable, signal } from '@angular/core';

export interface Theme {
  id: string;
  primary: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themes: Theme[] = [
    {
      id: 'deep-blue-dark',
      primary: '#1976D2',
      displayName: 'Blue',
    },
    { id: 'green', primary: '#00796B', displayName: 'Green' },
    { id: 'orange', primary: '#E65100', displayName: 'Orange' },
    { id: 'purple', primary: '#6200EE', displayName: 'Purple' },
    { id: 'red', primary: '#C2185B', displayName: 'Red' },
  ];

  currentTheme = signal<Theme>(this.themes[0]);

  getThemes(): Theme[] {
    return this.themes;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find((t) => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: Theme): void {
    // Remove all theme classes first
    document.body.classList.remove(
      ...this.themes.map((t) => `${t.id}-theme`)
    );
    
    // Add the new theme class
    document.body.classList.add(`${theme.id}-theme`);
    
    // Set CSS variables for icons and other theme properties
    document.body.style.setProperty('--mat-icon-color', 'var(--mat-sys-on-surface)');
    document.body.style.setProperty('--mat-sys-primary', theme.primary);
  }
}