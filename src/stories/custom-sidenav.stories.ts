// src/stories/custom-sidenav.stories.ts
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CustomSidenavComponent } from '../app/components/custom-sidenav/custom-sidenav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { DarkModeService } from '../app/services/dark-theme/dark-mode.service';
import { ResponsiveService } from '../app/services/responsive/responsive.service';
import { ThemeService } from '../app/services/theme/theme.service';

export default {
  title: 'Components/CustomSidenav',
  component: CustomSidenavComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        RouterTestingModule,
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
      ],
    }),
  ],
} as Meta<CustomSidenavComponent>;

type Story = StoryObj<CustomSidenavComponent>;

export const Expanded: Story = {
  args: {
    collapsed: false,
  },
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
};

export const IconTest: Story = {
  render: () => ({
    template: `
      <mat-icon>check_circle</mat-icon>
      <mat-icon>dashboard</mat-icon>
      <mat-icon>menu</mat-icon>
      <mat-icon>account_circle</mat-icon>
      <mat-icon class="material-icons-outlined">check_circle</mat-icon>
      <mat-icon class="material-icons-outlined">dashboard</mat-icon>
      <mat-icon class="material-icons-outlined">menu</mat-icon>
      <mat-icon class="material-icons-outlined">account_circle</mat-icon>
    `,
    styles: [
      `
        mat-icon {
          font-size: 24px;
          margin: 10px;
        }
      `,
    ],
  }),
  name: 'Icon Test',
};