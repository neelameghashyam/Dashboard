// src/stories/employee.stories.ts
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { EmployeeComponent } from '../app/pages/Employee/employee/employee.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DarkModeService } from '../app/services/dark-theme/dark-mode.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeeStore } from 'src/app/pages/Employee/store/employee-store';
import { ChangeDetectorRef } from '@angular/core';

export default {
  title: 'Components/Employee',
  component: EmployeeComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        FormsModule,
        RouterTestingModule,
        EmployeeComponent, // Standalone component
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
          provide: MatDialog,
          useValue: {
            open: () => ({
              close: () => {},
            }),
          },
        },
        {
          provide: ToastrService,
          useValue: {
            success: () => {},
            error: () => {},
          },
        },
        {
          provide: EmployeeStore,
          useValue: {
            employees: () => [
              {
                id: 1,
                name: 'John Doe',
                company: 'Example Inc.',
                bs: 'Innovate',
                website: 'https://example.com',
              },
              {
                id: 2,
                name: 'Jane Smith',
                company: 'Tech Corp',
                bs: 'Scale',
                website: 'https://techcorp.com',
              },
            ],
            loadEmployees: () => {},
            addEmployee: () => {},
            updateEmployee: () => {},
            deleteEmployee: () => {},
            getEmployee: () => ({
              id: 1,
              name: 'John Doe',
              company: 'Example Inc.',
              bs: 'Innovate',
              website: 'https://example.com',
            }),
            error: () => null,
          },
        },
        {
          provide: ChangeDetectorRef,
          useValue: {
            detectChanges: () => {},
          },
        },
      ],
    }),
  ],
} as Meta<EmployeeComponent>;

type Story = StoryObj<EmployeeComponent>;

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

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};