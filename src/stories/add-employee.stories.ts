// src/stories/add-employee.stories.ts
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AddEmployeeComponent } from 'src/app/pages/Employee/add-employee/add-employee.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DarkModeService } from '../app/services/dark-theme/dark-mode.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeeStore } from 'src/app/pages/Employee/store/employee-store';

export default {
  title: 'Components/AddEmployee',
  component: AddEmployeeComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        RouterTestingModule,
        AddEmployeeComponent, // Standalone component
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
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { empId: null },
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
            addEmployee: () => {},
            updateEmployee: () => {},
            getEmployee: () => ({
              id: 1,
              name: 'John Doe',
              company: 'Example Inc.',
              bs: 'Innovate',
              website: 'https://example.com',
            }),
          },
        },
      ],
    }),
  ],
} as Meta<AddEmployeeComponent>;

type Story = StoryObj<AddEmployeeComponent>;

export const AddMode: Story = {
  args: {},
};

export const EditMode: Story = {
  args: {},
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { empId: 1 },
        },
      ],
    }),
  ],
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