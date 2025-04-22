import { TestBed } from '@angular/core/testing';
import { DarkModeService } from './dark-mode.service';

describe('DarkModeService', () => {
  let service: DarkModeService;
  let localStorageMock: { [key: string]: string };
  let matchMediaMock: jest.Mock;
  let mediaQueryListMock: {
    matches: boolean;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
      },
      writable: true,
    });

    // Mock matchMedia
    mediaQueryListMock = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    matchMediaMock = jest.fn().mockImplementation((query: string) => {
      if (query === '(prefers-color-scheme: dark)') {
        return mediaQueryListMock;
      }
      return { matches: false, addEventListener: jest.fn() };
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    // Mock document.body.classList
    Object.defineProperty(document.body, 'classList', {
      value: {
        toggle: jest.fn(),
      },
      writable: true,
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(DarkModeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with darkMode false by default', () => {
      expect(service.darkMode()).toBe(false);
    });

    it('should initialize from localStorage if "true" value exists', () => {
      localStorageMock['darkMode'] = 'true';
      service = TestBed.inject(DarkModeService);
      expect(service.darkMode()).toBe(true);
      expect(localStorage.getItem).toHaveBeenCalledWith('darkMode');
    });

    it('should initialize from localStorage if "false" value exists', () => {
      localStorageMock['darkMode'] = 'false';
      service = TestBed.inject(DarkModeService);
      expect(service.darkMode()).toBe(false);
    });

    it('should initialize from system preference (dark) if no localStorage value', () => {
      mediaQueryListMock.matches = true;
      service = TestBed.inject(DarkModeService);
      expect(service.darkMode()).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should initialize from system preference (light) if no localStorage value', () => {
      mediaQueryListMock.matches = false;
      service = TestBed.inject(DarkModeService);
      expect(service.darkMode()).toBe(false);
    });

    it('should set up the body class effect during initialization', () => {
      expect(document.body.classList.toggle).toHaveBeenCalledWith('dark-mode', false);
    });
  });

  describe('system preference changes', () => {
    let changeHandler: (e: { matches: boolean }) => void;

    beforeEach(() => {
      // Capture the change handler
      changeHandler = (mediaQueryListMock.addEventListener as jest.Mock).mock.calls[0][1];
    });

    it('should register system preference change listener', () => {
      expect(mediaQueryListMock.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should update darkMode when system preference changes to dark and no localStorage value', () => {
      changeHandler({ matches: true });
      expect(service.darkMode()).toBe(true);
    });

    it('should update darkMode when system preference changes to light and no localStorage value', () => {
      changeHandler({ matches: false });
      expect(service.darkMode()).toBe(false);
    });

    it('should not update darkMode when system preference changes but localStorage value exists', () => {
      localStorageMock['darkMode'] = 'false';
      service = TestBed.inject(DarkModeService);
      changeHandler({ matches: true });
      expect(service.darkMode()).toBe(false);
    });
  });

  describe('toggle', () => {
    it('should toggle darkMode from false to true and store in localStorage', () => {
      service.darkMode.set(false);
      service.toggle();
      expect(service.darkMode()).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    });

    it('should toggle darkMode from true to false and store in localStorage', () => {
      service.darkMode.set(true);
      service.toggle();
      expect(service.darkMode()).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
    });
  });

  describe('effect', () => {
    it('should add dark-mode class when darkMode becomes true', () => {
      service.darkMode.set(true);
      expect(document.body.classList.toggle).toHaveBeenCalledWith('dark-mode', true);
    });

    it('should remove dark-mode class when darkMode becomes false', () => {
      service.darkMode.set(false);
      expect(document.body.classList.toggle).toHaveBeenCalledWith('dark-mode', false);
    });

    it('should update class on multiple changes', () => {
      const initialCalls = (document.body.classList.toggle as jest.Mock).mock.calls.length;
      
      service.darkMode.set(true);
      service.darkMode.set(false);
      service.darkMode.set(true);
      
      expect(document.body.classList.toggle).toHaveBeenCalledTimes(initialCalls + 3);
    });
  });

  describe('cleanup', () => {
    it('should remove event listener when service is destroyed', () => {
      // Simulate ngOnDestroy
      const ngOnDestroy = (service as any).ngOnDestroy;
      if (ngOnDestroy) {
        ngOnDestroy();
      }
      
      expect(mediaQueryListMock.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });
});