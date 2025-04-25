import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { DarkModeService } from '../dark-theme/dark-mode.service';
import { signal, WritableSignal } from '@angular/core';

describe('ThemeService', () => {
  let service: ThemeService;
  let darkModeServiceMock: { darkMode: WritableSignal<boolean> };
  let documentBodyClassList: DOMTokenList;
  let documentBodyStyle: CSSStyleDeclaration;

  beforeEach(() => {
    darkModeServiceMock = {
      darkMode: signal(false)
    };

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DarkModeService, useValue: darkModeServiceMock }
      ]
    });

    service = TestBed.inject(ThemeService);
    
    documentBodyClassList = document.body.classList;
    documentBodyStyle = document.body.style;
    
    jest.spyOn(documentBodyClassList, 'add');
    jest.spyOn(documentBodyClassList, 'remove');
    jest.spyOn(documentBodyStyle, 'setProperty');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default theme', () => {
    expect(service.currentTheme().id).toBe('deep-blue');
  });

  describe('getThemes', () => {
    it('should return all themes', () => {
      const themes = service.getThemes();
      expect(themes.length).toBe(5);
      expect(themes.map(t => t.id)).toEqual([
        'deep-blue', 'green', 'orange', 'purple', 'red'
      ]);
    });
  });

  describe('setTheme', () => {
    it('should change theme when valid id provided', () => {
      service.setTheme('green');
      expect(service.currentTheme().id).toBe('green');
    });

    it('should not change theme when invalid id provided', () => {
      service.setTheme('invalid');
      expect(service.currentTheme().id).toBe('deep-blue');
    });
  });

  describe('applyCurrentTheme', () => {
    it('should remove all theme classes before applying new one', () => {
      service.setTheme('orange');
      expect(documentBodyClassList.remove).toHaveBeenCalledWith(
        'deep-blue-dark-theme', 'deep-blue-light-theme',
        'green-dark-theme', 'green-light-theme',
        'orange-dark-theme', 'orange-light-theme',
        'purple-dark-theme', 'purple-light-theme',
        'red-dark-theme', 'red-light-theme'
      );
    });

    it('should apply light theme class when dark mode is off', () => {
      darkModeServiceMock.darkMode.set(false);
      service['applyCurrentTheme']();
      expect(documentBodyClassList.add).toHaveBeenCalledWith('deep-blue-light-theme');
    });

    it('should apply dark theme class when dark mode is on', () => {
      darkModeServiceMock.darkMode.set(true);
      service['applyCurrentTheme']();
      expect(documentBodyClassList.add).toHaveBeenCalledWith('deep-blue-dark-theme');
    });

    it('should set CSS variables correctly', () => {
      service.setTheme('purple');
      service['applyCurrentTheme']();
      expect(documentBodyStyle.setProperty).toHaveBeenCalledWith('--mat-sys-primary', '#6200EE');
    });
  });

  describe('effect', () => {
    it('should call applyCurrentTheme when darkMode changes', () => {
      const spy = jest.spyOn(service as any, 'applyCurrentTheme');
      darkModeServiceMock.darkMode.set(true);
      expect(spy).toHaveBeenCalled();
    });

    it('should call applyCurrentTheme when theme changes', () => {
      const spy = jest.spyOn(service as any, 'applyCurrentTheme');
      service.setTheme('red');
      expect(spy).toHaveBeenCalled();
    });
  });
});