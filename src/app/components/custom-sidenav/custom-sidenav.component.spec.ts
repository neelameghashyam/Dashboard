import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSidenavComponent } from './custom-sidenav.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../services/dark-theme/dark-mode.service'; 
import { ResponsiveService } from '../../services/responsive/responsive.service';
import { ThemeService } from '../../services/theme/theme.service'
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CustomSidenavComponent', () => {
  let component: CustomSidenavComponent;
  let fixture: ComponentFixture<CustomSidenavComponent>;
  
  // Create actual signals for testing
  const darkModeSignal = signal(false);
  const currentThemeSignal = signal({ id: 'deep-blue-dark' });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [CustomSidenavComponent],
      providers: [
        { 
          provide: DarkModeService, 
          useValue: {
            darkMode: () => darkModeSignal
          }
        },
        { 
          provide: ResponsiveService,
          useValue: {
            isMobile: jest.fn().mockReturnValue(false)
          }
        },
        {
          provide: ThemeService,
          useValue: {
            currentTheme: () => currentThemeSignal
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items', () => {
    expect(component.menuItems().length).toBe(5);
    expect(component.menuItems()[0].label).toBe('Dashboard');
    expect(component.menuItems()[1].route).toBe('form');
  });

  it('should set sideNavCollapsed from input', () => {
    component.collapsed = true;
    expect(component.sideNavCollapsed()).toBe(true);
  });

  it('should apply dark mode class when dark mode is enabled', () => {
    darkModeSignal.set(true);
    fixture.detectChanges();
    
    const sideNav = fixture.debugElement.query(By.css('.side-nav'));
    expect(sideNav.nativeElement.classList.contains('dark-mode')).toBe(true);
  });

  it('should apply theme class based on current theme', () => {
    currentThemeSignal.set({ id: 'green-theme' });
    fixture.detectChanges();
    
    const sideNav = fixture.debugElement.query(By.css('.side-nav'));
    expect(sideNav.nativeElement.classList.contains('green-theme')).toBe(true);
  });

  it('should render menu items correctly', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('.menu-item'));
    expect(menuItems.length).toBe(5);
    expect(menuItems[0].nativeElement.textContent).toContain('Dashboard');
  });

  it('should collapse menu items when sideNavCollapsed is true and not mobile', () => {
    component.sideNavCollapsed.set(true);
    fixture.detectChanges();
    
    const menuItem = fixture.debugElement.query(By.css('.menu-item'));
    expect(menuItem.nativeElement.classList.contains('collapsed')).toBe(true);
    
    const label = menuItem.query(By.css('.label-text'));
    expect(label).toBeNull();
  });

  it('should not collapse menu items when sideNavCollapsed is true but on mobile', () => {
    const responsiveService = TestBed.inject(ResponsiveService);
    (responsiveService.isMobile as unknown as jest.Mock).mockReturnValue(true);
    component.sideNavCollapsed.set(true);
    fixture.detectChanges();
    
    const menuItem = fixture.debugElement.query(By.css('.menu-item'));
    expect(menuItem.nativeElement.classList.contains('collapsed')).toBe(false);
    
    const label = menuItem.query(By.css('.label-text'));
    expect(label).toBeTruthy();
  });

  it('should apply selected-menu-item class for active route', () => {
    const routerLink = fixture.debugElement.query(By.css('a'));
    routerLink.triggerEventHandler('routerLinkActive', true);
    fixture.detectChanges();
    
    expect(routerLink.nativeElement.classList.contains('selected-menu-item')).toBe(true);
  });

  it('should change icon style when active', () => {
    const routerLink = fixture.debugElement.query(By.css('a'));
    routerLink.triggerEventHandler('routerLinkActive', true);
    fixture.detectChanges();
    
    const icon = routerLink.query(By.css('mat-icon'));
    expect(icon.nativeElement.getAttribute('fontSet')).toBe('material-icons');
  });

  it('should use outlined icons when not active', () => {
    const routerLink = fixture.debugElement.query(By.css('a'));
    routerLink.triggerEventHandler('routerLinkActive', false);
    fixture.detectChanges();
    
    const icon = routerLink.query(By.css('mat-icon'));
    expect(icon.nativeElement.getAttribute('fontSet')).toBe('material-icons-outlined');
  });

  it('should apply dark icon class in dark mode', () => {
    darkModeSignal.set(true);
    fixture.detectChanges();
    
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.classList.contains('dark-icon')).toBe(true);
  });

  it('should apply different theme variables', () => {
    currentThemeSignal.set({ id: 'purple-theme' });
    fixture.detectChanges();
    
    const sideNav = fixture.debugElement.query(By.css('.side-nav'));
    expect(sideNav.nativeElement.classList.contains('purple-theme')).toBe(true);
  });

  it('should handle hover styles for menu items', () => {
    const menuItem = fixture.debugElement.query(By.css('.menu-item'));
    menuItem.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    
    expect(menuItem.nativeElement.style.backgroundColor).toBeTruthy();
  });

  it('should apply correct styles for selected menu item in dark mode', () => {
    darkModeSignal.set(true);
    fixture.detectChanges();
    
    const routerLink = fixture.debugElement.query(By.css('a'));
    routerLink.triggerEventHandler('routerLinkActive', true);
    fixture.detectChanges();
    
    expect(routerLink.nativeElement.classList.contains('selected-menu-item')).toBe(true);
  });
});