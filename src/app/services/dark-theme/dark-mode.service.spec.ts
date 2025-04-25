import { DarkModeService } from './dark-mode.service';

describe('DarkModeService', () => {
  let service: DarkModeService;
  let localStorageMock: { [key: string]: string | null };
  let matchMediaMock: jest.Mock;
  let mediaQueryListeners: ((event: { matches: boolean }) => void)[] = [];

  beforeEach(() => {
    // Clear any previous listeners
    mediaQueryListeners = [];
    
    // Mock localStorage
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value;
        },
        removeItem: (key: string) => {
          delete localStorageMock[key];
        }
      },
      writable: true
    });

    // Mock matchMedia with proper event listener tracking
    matchMediaMock = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn((_, listener) => {
        mediaQueryListeners.push(listener);
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true
    });

    service = new DarkModeService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with saved dark mode from localStorage (true)', () => {
      localStorageMock['darkMode'] = 'true';
      service = new DarkModeService();
      expect(service.darkMode()).toBe(true);
    });

    it('should initialize with saved dark mode from localStorage (false)', () => {
      localStorageMock['darkMode'] = 'false';
      service = new DarkModeService();
      expect(service.darkMode()).toBe(false);
    });

    it('should initialize with system preference when no localStorage value (dark)', () => {
      matchMediaMock.mockImplementationOnce(query => ({
        matches: true,
        media: query,
        addEventListener: jest.fn((_, listener) => {
          mediaQueryListeners.push(listener);
        }),
      }));
      service = new DarkModeService();
      expect(service.darkMode()).toBe(true);
    });

    it('should initialize with system preference when no localStorage value (light)', () => {
      matchMediaMock.mockImplementationOnce(query => ({
        matches: false,
        media: query,
        addEventListener: jest.fn((_, listener) => {
          mediaQueryListeners.push(listener);
        }),
      }));
      service = new DarkModeService();
      expect(service.darkMode()).toBe(false);
    });
  });

  describe('system preference changes', () => {
    it('should update dark mode when preference changes and no localStorage value', () => {
      // Ensure no localStorage value
      expect(localStorageMock['darkMode']).toBeUndefined();
      
      // Initial state is false (from mock)
      expect(service.darkMode()).toBe(false);
      
      // Trigger change to dark mode
      mediaQueryListeners[0]({ matches: true });
      expect(service.darkMode()).toBe(true);
      
      // Trigger change back to light mode
      mediaQueryListeners[0]({ matches: false });
      expect(service.darkMode()).toBe(false);
    });

    it('should NOT update dark mode when preference changes but localStorage exists', () => {
      // Set localStorage value
      localStorageMock['darkMode'] = 'true';
      service = new DarkModeService();
      
      // Trigger change to light mode
      mediaQueryListeners[0]({ matches: false });
      
      // Should remain true from localStorage
      expect(service.darkMode()).toBe(true);
    });

    it('should handle multiple preference changes correctly', () => {
      // Initial state
      expect(service.darkMode()).toBe(false);
      
      // First change to dark
      mediaQueryListeners[0]({ matches: true });
      expect(service.darkMode()).toBe(true);
      
      // Second change back to light
      mediaQueryListeners[0]({ matches: false });
      expect(service.darkMode()).toBe(false);
      
      // Third change to dark again
      mediaQueryListeners[0]({ matches: true });
      expect(service.darkMode()).toBe(true);
    });
  });

  describe('toggle', () => {
    it('should toggle from false to true and update localStorage', () => {
      service.darkMode.set(false);
      service.toggle();
      expect(service.darkMode()).toBe(true);
      expect(localStorageMock['darkMode']).toBe('true');
    });

    it('should toggle from true to false and update localStorage', () => {
      service.darkMode.set(true);
      service.toggle();
      expect(service.darkMode()).toBe(false);
      expect(localStorageMock['darkMode']).toBe('false');
    });

    it('should prevent system preference updates after toggle', () => {
      // Initial state
      expect(service.darkMode()).toBe(false);
      
      // Toggle to true (sets localStorage)
      service.toggle();
      expect(service.darkMode()).toBe(true);
      
      // System preference change should now be ignored
      mediaQueryListeners[0]({ matches: false });
      expect(service.darkMode()).toBe(true); // Still true from localStorage
    });
  });
});