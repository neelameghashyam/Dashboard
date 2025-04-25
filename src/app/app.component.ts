import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslocoRootModule } from './transloco-root.module';
import { ThemeService } from './services/theme/theme.service';
import { UserComponent } from "./user/user.component";
import { DarkModeService } from './services/dark-theme/dark-mode.service';
import { ResponsiveService } from './services/responsive/responsive.service';
import { CustomSidenavComponent } from './components/custom-sidenav/custom-sidenav.component'; // Adjust path as needed

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatMenuModule,
        MatBadgeModule,
        MatTooltipModule,
        UserComponent,
        CustomSidenavComponent, 
        TranslocoRootModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  collapsed = signal(true);
    currentLanguage = signal('English');


  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  setLanguage(lang: string) {
    this.currentLanguage.set(lang === 'en' ? 'English' : 'French');
  }

  constructor(
    public darkModeService: DarkModeService,
    public responsiveService: ResponsiveService
  ) {}

  setTheme(theme: 'light' | 'dark' | 'auto') {
    if (theme === 'auto') {
      localStorage.removeItem('darkMode');
      this.darkModeService.darkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      const isDark = theme === 'dark';
      this.darkModeService.darkMode.set(isDark);
      localStorage.setItem('darkMode', String(isDark));
    }
  }

  //theme
  themeService = inject(ThemeService);

  //sid nav 

  sidenavWidth = computed(() => {
    if (this.responsiveService.isMobile()) return '280px';
    return this.collapsed() ? '64px' : '200px';
  });

  sidenavMode = computed(() => {
    return this.responsiveService.isMobile() ? 'over' : 'side';
  });

  sidenavOpened = computed(() => {
    return !this.responsiveService.isMobile() || !this.collapsed();
  });


  toggleSidenav() {
    this.collapsed.set(!this.collapsed());
  }
}
