import { TestBed } from '@angular/core/testing';
import { ResponsiveService } from './responsive.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { of } from 'rxjs';

describe('ResponsiveService', () => {
  let service: ResponsiveService;
  let breakpointObserver: jest.Mocked<BreakpointObserver>;

  beforeEach(() => {
    const breakpointObserverMock = {
      observe: jest.fn().mockReturnValue(of({
        matches: false,
        breakpoints: {
          [Breakpoints.XSmall]: false,
          [Breakpoints.Small]: false,
          [Breakpoints.Medium]: false,
          [Breakpoints.Large]: false,
          [Breakpoints.XLarge]: false
        }
      } as BreakpointState))
    };

    TestBed.configureTestingModule({
      providers: [
        ResponsiveService,
        { provide: BreakpointObserver, useValue: breakpointObserverMock }
      ]
    });

    service = TestBed.inject(ResponsiveService);
    breakpointObserver = TestBed.inject(BreakpointObserver) as jest.Mocked<BreakpointObserver>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should observe all breakpoints', () => {
    expect(breakpointObserver.observe).toHaveBeenCalledWith([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]);
  });

  describe('initial state', () => {
    it('should initialize with all breakpoints false', () => {
      expect(service.isMobile()).toBe(false);
      expect(service.isTablet()).toBe(false);
      expect(service.isDesktop()).toBe(false);
      expect(service.currentBreakpoint()).toBe('xlarge');
    });
  });

  describe('breakpoint states', () => {
    it('should handle XSmall breakpoint (mobile)', () => {
      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.XSmall]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isMobile()).toBe(true);
      expect(service.currentBreakpoint()).toBe('xsmall');
    });

    it('should handle Small breakpoint (tablet portrait)', () => {
      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.Small]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isTablet()).toBe(true);
      expect(service.currentBreakpoint()).toBe('small');
    });

    it('should handle Medium breakpoint (tablet landscape)', () => {
      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.Medium]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isTablet()).toBe(true);
      expect(service.currentBreakpoint()).toBe('medium');
    });

    it('should handle Large breakpoint (desktop)', () => {
      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.Large]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isDesktop()).toBe(true);
      expect(service.currentBreakpoint()).toBe('large');
    });

    it('should handle XLarge breakpoint (large desktop)', () => {
      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.XLarge]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isDesktop()).toBe(true);
      expect(service.currentBreakpoint()).toBe('xlarge');
    });
  });

  describe('computed values', () => {
    it('should correctly compute isTablet for both tablet sizes', () => {
      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.Small]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isTablet()).toBe(true);

      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.Medium]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isTablet()).toBe(true);
    });

    it('should correctly compute isDesktop for both desktop sizes', () => {
      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.Large]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isDesktop()).toBe(true);

      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: { [Breakpoints.XLarge]: true }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.isDesktop()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should prioritize smallest breakpoint when multiple active', () => {
      breakpointObserver.observe.mockReturnValue(
        of({
          matches: true,
          breakpoints: {
            [Breakpoints.XSmall]: true,
            [Breakpoints.Large]: true
          }
        } as BreakpointState)
      );
      service = TestBed.inject(ResponsiveService);
      expect(service.currentBreakpoint()).toBe('xsmall');
    });
  });
});