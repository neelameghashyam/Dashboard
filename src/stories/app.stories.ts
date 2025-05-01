// src/stories/app.stories.ts
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AppComponent } from '../app/app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DarkModeService } from '../app/services/dark-theme/dark-mode.service';
import { ResponsiveService } from '../app/services/responsive/responsive.service';
import { ThemeService } from '../app/services/theme/theme.service';
import { UserComponent } from '../app/user/user.component';
import { CustomSidenavComponent } from '../app/components/custom-sidenav/custom-sidenav.component';
import { AnalyticsComponent } from '../app/pages/analytics/analytics.component';
import { Dashboard_Component } from '../app/pages/dashboard/dashboard.component';
import { ContentComponent } from '../app/pages/content/content.component';
import { UserFormComponent } from '../app/pages/user-form/user-form.component';
import { StoreComponent } from '../app/pages/store/store.component';
import { EmployeeComponent } from '../app/pages/Employee/employee/employee.component';

export default {
  title: 'Application/App',
  component: AppComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatMenuModule,
        MatTooltipModule,
        MatStepperModule,
        RouterModule.forRoot([
          { path: 'dashboard', component: Dashboard_Component },
          { path: 'employee', component: EmployeeComponent },
          { path: 'content', component: ContentComponent },
          { path: 'form', component: UserFormComponent },
          { path: 'analytics', component: AnalyticsComponent },
          { path: 'comments', component: ContentComponent },
          { path: 'store', component: StoreComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: '**', redirectTo: 'dashboard' },
        ]),
        UserComponent,
        CustomSidenavComponent,
        AnalyticsComponent,
        Dashboard_Component,
        ContentComponent,
        UserFormComponent,
        StoreComponent,
        EmployeeComponent,
      ],
      providers: [
        {
          provide: DarkModeService,
          useValue: {
            darkMode: () => false,
            toggle: () => {},
          },
        },
        {
          provide: ResponsiveService,
          useValue: {
            isMobile: () => false,
            isTablet: () => false,
            isDesktop: () => true,
            currentBreakpoint: () => 'large',
          },
        },
        {
          provide: ThemeService,
          useValue: {
            currentTheme: () => ({
              id: 'deep-blue',
              primary: '#1976D2',
              displayName: 'Deep-Blue',
              darkModeClass: 'deep-blue-dark-theme',
              lightModeClass: 'deep-blue-light-theme',
            }),
            getThemes: () => [
              {
                id: 'deep-blue',
                primary: '#1976D2',
                displayName: 'Deep-Blue',
                darkModeClass: 'deep-blue-dark-theme',
                lightModeClass: 'deep-blue-light-theme',
              },
            ],
            setTheme: () => {},
          },
        },
        {
          provide: 'TranslocoService',
          useValue: {
            translate: (key: string) => key,
            getActiveLang: () => 'en',
            setActiveLang: () => {},
          },
        },
      ],
    }),
  ],
} as Meta<AppComponent>;

type Story = StoryObj<AppComponent>;

export const Default: Story = {
  args: {},
};

export const DashboardRoute: Story = {
  parameters: {
    router: {
      path: '/dashboard',
    },
  },
};

export const AnalyticsRoute: Story = {
  parameters: {
    router: {
      path: '/analytics',
    },
  },
};

export const EmployeeRoute: Story = {
  parameters: {
    router: {
      path: '/employee',
    },
  },
};