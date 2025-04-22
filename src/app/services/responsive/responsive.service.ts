// responsive.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private breakpointState = signal({
    isXSmall: false,    // < 600px (mobile)
    isSmall: false,     // 600-959px (tablet portrait)
    isMedium: false,    // 960-1279px (tablet landscape)
    isLarge: false,     // 1280-1919px (desktop)
    isXLarge: false     // >= 1920px (large desktop)
  });

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      this.breakpointState.set({
        isXSmall: result.breakpoints[Breakpoints.XSmall],
        isSmall: result.breakpoints[Breakpoints.Small],
        isMedium: result.breakpoints[Breakpoints.Medium],
        isLarge: result.breakpoints[Breakpoints.Large],
        isXLarge: result.breakpoints[Breakpoints.XLarge]
      });
    });
  }

  // Simplified device type signals
  isMobile = computed(() => this.breakpointState().isXSmall);
  isTablet = computed(() => this.breakpointState().isSmall || this.breakpointState().isMedium);
  isDesktop = computed(() => this.breakpointState().isLarge || this.breakpointState().isXLarge);

  // More granular breakpoints
  currentBreakpoint = computed(() => {
    const state = this.breakpointState();
    if (state.isXSmall) return 'xsmall';
    if (state.isSmall) return 'small';
    if (state.isMedium) return 'medium';
    if (state.isLarge) return 'large';
    return 'xlarge';
  });
}