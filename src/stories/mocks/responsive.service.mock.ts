import { Injectable } from '@angular/core';

@Injectable()
export class ResponsiveServiceMock {
  isMobile(): boolean {
    return false;
  }

  isTablet(): boolean {
    return false;
  }

  isDesktop(): boolean {
    return true;
  }

  currentBreakpoint(): string {
    return 'large';
  }
}