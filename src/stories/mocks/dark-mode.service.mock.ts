import { Injectable, signal } from '@angular/core';

@Injectable()
export class DarkModeServiceMock {
  darkMode = signal<boolean>(false);

  toggle() {
    this.darkMode.update(mode => !mode);
  }
}