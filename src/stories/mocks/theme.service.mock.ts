import { Injectable, signal } from '@angular/core';
import { Theme } from '../../app/services/theme/theme.service';

@Injectable()
export class ThemeServiceMock {
  private themes: Theme[] = [
    {
      id: 'deep-blue',
      primary: '#1976D2',
      displayName: 'Deep-Blue',
      darkModeClass: 'deep-blue-dark-theme',
      lightModeClass: 'deep-blue-light-theme',
    },
    {
      id: 'green',
      primary: '#00796B',
      displayName: 'Green',
      darkModeClass: 'green-dark-theme',
      lightModeClass: 'green-light-theme',
    },
  ];

  currentTheme = signal<Theme>(this.themes[0]);

  getThemes(): Theme[] {
    return this.themes;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
    }
  }
}