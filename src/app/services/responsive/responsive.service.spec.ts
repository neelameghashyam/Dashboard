import { TestBed } from '@angular/core/testing';
import { ResponsiveService } from './responsive.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

describe('ResponsiveService', () => {
  let service: ResponsiveService;
  let breakpointObserver: BreakpointObserver;
  let mockSubscription: Subscription;
  let mockObservable: Observable<BreakpointState>;

  beforeEach(() => {
    mockSubscription = new Subscription();
    mockObservable = new Observable<BreakpointState>(subscriber => {
      subscriber.next({
        matches: false,
        breakpoints: {
          [Breakpoints.XSmall]: false,
          [Breakpoints.Small]: false,
          [Breakpoints.Medium]: false,
          [Breakpoints.Large]: false,
          [Breakpoints.XLarge]: false
        }
      });
    });

    const breakpointObserverMock = {
      observe: jest.fn().mockReturnValue(mockObservable)
    };

    TestBed.configureTestingModule({
      providers: [
        ResponsiveService,
        { provide: BreakpointObserver, useValue: breakpointObserverMock }
      ]
    });

    service = TestBed.inject(ResponsiveService);
    breakpointObserver = TestBed.inject(BreakpointObserver);
  });

  afterEach(() => {
    mockSubscription.unsubscribe();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default breakpoint state', () => {
    expect(service['breakpointState']()).toEqual({
      isXSmall: false,
      isSmall: false,
      isMedium: false,
      isLarge: false,
      isXLarge: false
    });
  });

  it('should observe all breakpoints on construction', () => {
    expect(breakpointObserver.observe).toHaveBeenCalledWith([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]);
  });

  describe('computed properties', () => {
    beforeEach(() => {
      // Mock the signal for testing computed properties
      service['breakpointState'] = signal({
        isXSmall: false,
        isSmall: false,
        isMedium: false,
        isLarge: false,
        isXLarge: false
      });
    });

    it('isMobile should return true only for XSmall', () => {
      service['breakpointState'].set({ ...service['breakpointState'](), isXSmall: true });
      expect(service.isMobile()).toBe(true);

      service['breakpointState'].set({ ...service['breakpointState'](), isXSmall: false });
      expect(service.isMobile()).toBe(false);
    });

    it('isTablet should return true for Small or Medium', () => {
      // Small only
      service['breakpointState'].set({ ...service['breakpointState'](), isSmall: true });
      expect(service.isTablet()).toBe(true);

      // Medium only
      service['breakpointState'].set({ ...service['breakpointState'](), isSmall: false, isMedium: true });
      expect(service.isTablet()).toBe(true);

      // Both
      service['breakpointState'].set({ ...service['breakpointState'](), isSmall: true, isMedium: true });
      expect(service.isTablet()).toBe(true);

      // Neither
      service['breakpointState'].set({ ...service['breakpointState'](), isSmall: false, isMedium: false });
      expect(service.isTablet()).toBe(false);
    });

    it('isDesktop should return true for Large or XLarge', () => {
      // Large only
      service['breakpointState'].set({ ...service['breakpointState'](), isLarge: true });
      expect(service.isDesktop()).toBe(true);

      // XLarge only
      service['breakpointState'].set({ ...service['breakpointState'](), isLarge: false, isXLarge: true });
      expect(service.isDesktop()).toBe(true);

      // Both
      service['breakpointState'].set({ ...service['breakpointState'](), isLarge: true, isXLarge: true });
      expect(service.isDesktop()).toBe(true);

      // Neither
      service['breakpointState'].set({ ...service['breakpointState'](), isLarge: false, isXLarge: false });
      expect(service.isDesktop()).toBe(false);
    });

    describe('currentBreakpoint', () => {
      it('should return "xsmall" for XSmall', () => {
        service['breakpointState'].set({ ...service['breakpointState'](), isXSmall: true });
        expect(service.currentBreakpoint()).toBe('xsmall');
      });

      it('should return "small" for Small', () => {
        service['breakpointState'].set({ ...service['breakpointState'](), isSmall: true });
        expect(service.currentBreakpoint()).toBe('small');
      });

      it('should return "medium" for Medium', () => {
        service['breakpointState'].set({ ...service['breakpointState'](), isMedium: true });
        expect(service.currentBreakpoint()).toBe('medium');
      });

      it('should return "large" for Large', () => {
        service['breakpointState'].set({ ...service['breakpointState'](), isLarge: true });
        expect(service.currentBreakpoint()).toBe('large');
      });

      it('should return "xlarge" for XLarge', () => {
        service['breakpointState'].set({ ...service['breakpointState'](), isXLarge: true });
        expect(service.currentBreakpoint()).toBe('xlarge');
      });

      it('should default to "xlarge" when no breakpoint matches', () => {
        service['breakpointState'].set({
          isXSmall: false,
          isSmall: false,
          isMedium: false,
          isLarge: false,
          isXLarge: false
        });
        expect(service.currentBreakpoint()).toBe('xlarge');
      });
    });
  });

  describe('breakpoint updates', () => {
    let subscriber: (state: BreakpointState) => void;

    beforeEach(() => {
      // Create a new mock observable that captures the subscriber
      mockObservable = new Observable<BreakpointState>(sub => {
        subscriber = sub.next.bind(sub);
      });

      // Reset the mock implementation
      (breakpointObserver.observe as jest.Mock).mockReturnValue(mockObservable);

      // Recreate service to use new mock
      service = TestBed.inject(ResponsiveService);
    });

    it('should update breakpointState when XSmall breakpoint changes', () => {
      subscriber({
        matches: true,
        breakpoints: {
          [Breakpoints.XSmall]: true,
          [Breakpoints.Small]: false,
          [Breakpoints.Medium]: false,
          [Breakpoints.Large]: false,
          [Breakpoints.XLarge]: false
        }
      });

      expect(service['breakpointState']()).toEqual({
        isXSmall: true,
        isSmall: false,
        isMedium: false,
        isLarge: false,
        isXLarge: false
      });
    });

    it('should update breakpointState when Medium breakpoint changes', () => {
      subscriber({
        matches: true,
        breakpoints: {
          [Breakpoints.XSmall]: false,
          [Breakpoints.Small]: false,
          [Breakpoints.Medium]: true,
          [Breakpoints.Large]: false,
          [Breakpoints.XLarge]: false
        }
      });

      expect(service['breakpointState']()).toEqual({
        isXSmall: false,
        isSmall: false,
        isMedium: true,
        isLarge: false,
        isXLarge: false
      });
    });

    it('should update breakpointState when XLarge breakpoint changes', () => {
      subscriber({
        matches: true,
        breakpoints: {
          [Breakpoints.XSmall]: false,
          [Breakpoints.Small]: false,
          [Breakpoints.Medium]: false,
          [Breakpoints.Large]: false,
          [Breakpoints.XLarge]: true
        }
      });

      expect(service['breakpointState']()).toEqual({
        isXSmall: false,
        isSmall: false,
        isMedium: false,
        isLarge: false,
        isXLarge: true
      });
    });
  });
});