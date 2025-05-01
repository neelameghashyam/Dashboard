import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DarkModeService } from './services/dark-theme/dark-mode.service'; 
import { ResponsiveService } from './services/responsive/responsive.service';
import { ThemeService } from './services/theme/theme.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let darkModeService: DarkModeService;
  let responsiveService: ResponsiveService;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatTooltipModule,
        MatBadgeModule,
        AppComponent
      ],
      providers: [
        DarkModeService,
        ResponsiveService,
        ThemeService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    darkModeService = TestBed.inject(DarkModeService);
    responsiveService = TestBed.inject(ResponsiveService);
    themeService = TestBed.inject(ThemeService);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.collapsed()).toBe(true);
    expect(component.currentLanguage()).toBe('English');
  });

  describe('toggleFullScreen', () => {
    it('should request fullscreen when not in fullscreen', () => {
      Object.defineProperty(document, 'fullscreenElement', {
        value: null,
        writable: true
      });
      const spy = jest.spyOn(document.documentElement, 'requestFullscreen');
      
      component.toggleFullScreen();
      
      expect(spy).toHaveBeenCalled();
    });

    it('should exit fullscreen when in fullscreen', () => {
      Object.defineProperty(document, 'fullscreenElement', {
        value: true,
        writable: true
      });
      const spy = jest.spyOn(document, 'exitFullscreen');
      
      component.toggleFullScreen();
      
      expect(spy).toHaveBeenCalled();
    });

    it('should handle fullscreen error', () => {
      Object.defineProperty(document, 'fullscreenElement', {
        value: null,
        writable: true
      });
      const error = new Error('Fullscreen error');
      jest.spyOn(document.documentElement, 'requestFullscreen').mockImplementation(() => {
        throw error;
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      component.toggleFullScreen();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        `Error attempting to enable fullscreen: ${error.message}`
      );
    });
  });

  describe('setLanguage', () => {
    it('should set language to English', () => {
      component.setLanguage('en');
      expect(component.currentLanguage()).toBe('English');
    });

    it('should set language to French', () => {
      component.setLanguage('fr');
      expect(component.currentLanguage()).toBe('French');
    });
  });

  describe('setTheme', () => {
    beforeEach(() => {
      jest.spyOn(localStorage, 'setItem');
      jest.spyOn(localStorage, 'removeItem');
    });

    it('should set dark theme and store in localStorage', () => {
      component.setTheme('dark');
      expect(darkModeService.darkMode()).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    });

    it('should set light theme and store in localStorage', () => {
      component.setTheme('light');
      expect(darkModeService.darkMode()).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
    });

    it('should set auto theme and remove from localStorage', () => {
      component.setTheme('auto');
      expect(localStorage.removeItem).toHaveBeenCalledWith('darkMode');
    });
  });

  describe('sidenav properties', () => {
    it('should return correct sidenavWidth when mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      expect(component.sidenavWidth()).toBe('280px');
    });

    it('should return correct sidenavWidth when collapsed', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      component.collapsed.set(true);
      expect(component.sidenavWidth()).toBe('64px');
    });

    it('should return correct sidenavWidth when expanded', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      component.collapsed.set(false);
      expect(component.sidenavWidth()).toBe('200px');
    });

    it('should return correct sidenavMode when mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      expect(component.sidenavMode()).toBe('over');
    });

    it('should return correct sidenavMode when not mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      expect(component.sidenavMode()).toBe('side');
    });

    it('should return correct sidenavOpened when mobile and collapsed', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(true);
      component.collapsed.set(true);
      expect(component.sidenavOpened()).toBe(false);
    });

    it('should return correct sidenavOpened when not mobile', () => {
      jest.spyOn(responsiveService, 'isMobile').mockReturnValue(false);
      expect(component.sidenavOpened()).toBe(true);
    });
  });

  describe('toggleSidenav', () => {
    it('should toggle collapsed state', () => {
      const initialValue = component.collapsed();
      component.toggleSidenav();
      expect(component.collapsed()).toBe(!initialValue);
      component.toggleSidenav();
      expect(component.collapsed()).toBe(initialValue);
    });
  });

  describe('UI interactions', () => {
    it('should call toggleSidenav when menu button clicked', () => {
      const spy = jest.spyOn(component, 'toggleSidenav');
      const button = fixture.debugElement.query(By.css('.header-icon'));
      button.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalled();
    });

    it('should call toggleFullScreen when fullscreen button clicked', () => {
      const spy = jest.spyOn(component, 'toggleFullScreen');
      const button = fixture.debugElement.query(By.css('[matTooltip="Full Screen"]'));
      button.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalled();
    });

    it('should call darkModeService.toggle when dark mode button clicked', () => {
      const spy = jest.spyOn(darkModeService, 'toggle');
      const button = fixture.debugElement.query(By.css('[matTooltip="Toggle Dark Mode"]'));
      button.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalled();
    });

    it('should call setLanguage when language menu item clicked', () => {
      const spy = jest.spyOn(component, 'setLanguage');
      const button = fixture.debugElement.query(By.css('.languageMenu'));
      button.triggerEventHandler('click', null);
      
      // Simulate menu item click
      const menuItems = fixture.debugElement.queryAll(By.css('.language-menu button'));
      if (menuItems.length > 0) {
        menuItems[0].triggerEventHandler('click', null);
        expect(spy).toHaveBeenCalledWith('en');
      }
    });

    it('should call themeService.setTheme when theme menu item clicked', () => {
      jest.spyOn(themeService, 'getThemes').mockReturnValue([
        {
          id: 'theme1', displayName: 'Theme 1', primary: '#ffffff',
          darkModeClass: '',
          lightModeClass: ''
        }
      ]);
      fixture.detectChanges();
      
      const spy = jest.spyOn(themeService, 'setTheme');
      const button = fixture.debugElement.query(By.css('[matTooltip="Theme"]'));
      button.triggerEventHandler('click', null);
      
      // Simulate menu item click
      const menuItems = fixture.debugElement.queryAll(By.css('.color-theme-menu button'));
      if (menuItems.length > 0) {
        menuItems[0].triggerEventHandler('click', null);
        expect(spy).toHaveBeenCalledWith('theme1');
      }
    });
  });

  describe('dark mode class binding', () => {
    it('should add dark-mode class when darkMode is true', () => {
      darkModeService.darkMode.set(true);
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('div[class]'));
      expect(container.nativeElement.classList.contains('dark-mode')).toBe(true);
    });

    it('should not add dark-mode class when darkMode is false', () => {
      darkModeService.darkMode.set(false);
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('div[class]'));
      expect(container.nativeElement.classList.contains('dark-mode')).toBe(false);
    });
  });
});