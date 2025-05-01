// src/stories/analytics.stories.ts
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AnalyticsComponent } from '../app/pages/analytics/analytics.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DarkModeService } from '../app/services/dark-theme/dark-mode.service';
import { FormBuilder } from '@angular/forms';

export default {
  title: 'Components/Analytics',
  component: AnalyticsComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatIconModule,
        MatListModule,
        ReactiveFormsModule,
        RouterTestingModule,
        AnalyticsComponent, // Standalone component
      ],
      providers: [
        {
          provide: DarkModeService,
          useValue: {
            darkMode: () => false,
            toggle: () => {},
          },
        },
        FormBuilder,
      ],
    }),
  ],
} as Meta<AnalyticsComponent>;

type Story = StoryObj<AnalyticsComponent>;

export const Default: Story = {
  args: {},
};

export const DarkMode: Story = {
  args: {},
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: DarkModeService,
          useValue: {
            darkMode: () => true,
            toggle: () => {},
          },
        },
      ],
    }),
  ],
};

export const SuccessMessage: Story = {
  args: {
    showSuccessMessage: true,
  },
};