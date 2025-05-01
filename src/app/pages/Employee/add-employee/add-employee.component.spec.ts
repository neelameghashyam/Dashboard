import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddEmployeeComponent } from './add-employee.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeeStore } from '../store/employee-store';
import { DarkModeService } from '../../../services/dark-theme/dark-mode.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Employee } from '../Employee';
import { By } from '@angular/platform-browser';
import { signal, WritableSignal } from '@angular/core';

// Interface to mock EmployeeStore methods
interface MockEmployeeStore {
  getEmployee: jest.Mock<Promise<Employee>, [number]>;
  addEmployee: jest.Mock<Promise<void>, [Employee]>;
  updateEmployee: jest.Mock<Promise<void>, [Employee]>;
}

describe('AddEmployeeComponent', () => {
  let component: AddEmployeeComponent;
  let fixture: ComponentFixture<AddEmployeeComponent>;
  let mockDialogRef: Partial<MatDialogRef<AddEmployeeComponent>>;
  let mockToastr: Partial<ToastrService>;
  let mockEmployeeStore: MockEmployeeStore;
  let mockDarkModeService: Partial<DarkModeService>;
  let darkModeSignal: WritableSignal<boolean>;

  const mockEmployee: Employee = {
    id: 1,
    name: 'John Doe',
    doj: new Date('2023-01-01'),
    role: 'manager',
    salary: 50000,
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    };

    mockToastr = {
      success: jest.fn(),
      error: jest.fn(),
    };

    mockEmployeeStore = {
      getEmployee: jest.fn().mockResolvedValue(mockEmployee),
      addEmployee: jest.fn().mockResolvedValue(undefined),
      updateEmployee: jest.fn().mockResolvedValue(undefined),
    };

    darkModeSignal = signal(false);
    mockDarkModeService = {
      darkMode: darkModeSignal,
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideNativeDateAdapter(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ToastrService, useValue: mockToastr },
        { provide: EmployeeStore, useValue: mockEmployeeStore },
        { provide: DarkModeService, useValue: mockDarkModeService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      declarations: [AddEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize in add mode when no empId is provided', () => {
      component.ngOnInit();
      expect(component.isEdit).toBe(false);
      expect(component.title).toBe('Add Employee');
      expect(component.empForm.value).toEqual({
        id: 0,
        name: '',
        doj: expect.any(Date),
        role: '',
        salary: 0,
      });
    });

    it('should initialize in edit mode when empId is provided', fakeAsync(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          MatCardModule,
          MatFormFieldModule,
          MatInputModule,
          MatButtonModule,
          MatSelectModule,
          MatDatepickerModule,
          MatIconModule,
          BrowserAnimationsModule,
        ],
        providers: [
          provideNativeDateAdapter(),
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: ToastrService, useValue: mockToastr },
          { provide: EmployeeStore, useValue: mockEmployeeStore },
          { provide: DarkModeService, useValue: mockDarkModeService },
          { provide: MAT_DIALOG_DATA, useValue: { empId: 1 } },
        ],
        declarations: [AddEmployeeComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(AddEmployeeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      tick();

      expect(component.isEdit).toBe(true);
      expect(component.title).toBe('Edit Employee');
      expect(mockEmployeeStore.getEmployee).toHaveBeenCalledWith(1);
      expect(component.empForm.value).toEqual({
        id: 1,
        name: 'John Doe',
        doj: expect.any(Date),
        role: 'manager',
        salary: 50000,
      });
    }));

    it('should handle error when loading employee data fails', fakeAsync(() => {
      mockEmployeeStore.getEmployee = jest.fn().mockRejectedValue(new Error('Load failed'));
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          MatCardModule,
          MatFormFieldModule,
          MatInputModule,
          MatButtonModule,
          MatSelectModule,
          MatDatepickerModule,
          MatIconModule,
          BrowserAnimationsModule,
        ],
        providers: [
          provideNativeDateAdapter(),
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: ToastrService, useValue: mockToastr },
          { provide: EmployeeStore, useValue: mockEmployeeStore },
          { provide: DarkModeService, useValue: mockDarkModeService },
          { provide: MAT_DIALOG_DATA, useValue: { empId: 1 } },
        ],
        declarations: [AddEmployeeComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(AddEmployeeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      tick();

      expect(mockToastr.error).toHaveBeenCalledWith('Failed to load employee data');
      expect(mockDialogRef.close).toHaveBeenCalled();
    }));
  });

  describe('SaveEmployee', () => {
    it('should show error if form is invalid', async () => {
      component.empForm.setValue({
        id: 0,
        name: '',
        doj: null,
        role: '',
        salary: 0,
      });
      await component.SaveEmployee();

      expect(mockToastr.error).toHaveBeenCalledWith('Please fill all required fields');
      expect(mockEmployeeStore.addEmployee).not.toHaveBeenCalled();
      expect(mockEmployeeStore.updateEmployee).not.toHaveBeenCalled();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should add new employee when form is valid and not in edit mode', async () => {
      const newEmployee = {
        id: 2,
        name: 'Jane Doe',
        doj: new Date('2023-02-01'),
        role: 'lead',
        salary: 60000,
      };
      component.empForm.setValue(newEmployee);
      component.isEdit = false;

      await component.SaveEmployee();

      expect(mockEmployeeStore.addEmployee).toHaveBeenCalledWith(newEmployee);
      expect(mockToastr.success).toHaveBeenCalledWith('Employee added successfully');
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should update employee when form is valid and in edit mode', async () => {
      const updatedEmployee = {
        id: 1,
        name: 'John Doe Updated',
        doj: new Date('2023-01-01'),
        role: 'manager',
        salary: 55000,
      };
      component.empForm.setValue(updatedEmployee);
      component.isEdit = true;

      await component.SaveEmployee();

      expect(mockEmployeeStore.updateEmployee).toHaveBeenCalledWith(updatedEmployee);
      expect(mockToastr.success).toHaveBeenCalledWith('Employee updated successfully');
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should handle error when adding employee fails', async () => {
      mockEmployeeStore.addEmployee = jest.fn().mockRejectedValue(new Error('Add failed'));
      component.empForm.setValue({
        id: 2,
        name: 'Jane Doe',
        doj: new Date('2023-02-01'),
        role: 'lead',
        salary: 60000,
      });
      component.isEdit = false;

      await component.SaveEmployee();

      expect(mockToastr.error).toHaveBeenCalledWith('Failed to add employee');
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should handle error when updating employee fails', async () => {
      mockEmployeeStore.updateEmployee = jest.fn().mockRejectedValue(new Error('Update failed'));
      component.empForm.setValue({
        id: 1,
        name: 'John Doe Updated',
        doj: new Date('2023-01-01'),
        role: 'manager',
        salary: 55000,
      });
      component.isEdit = true;

      await component.SaveEmployee();

      expect(mockToastr.error).toHaveBeenCalledWith('Failed to update employee');
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('closepopup', () => {
    it('should close the dialog', () => {
      component.closepopup();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Template Interactions', () => {
    it('should display "Add Employee" title when not in edit mode', () => {
      component.isEdit = false;
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
      expect(titleElement.textContent).toBe('Add Employee');
    });

    it('should display "Edit Employee" title when in edit mode', () => {
      component.isEdit = true;
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
      expect(titleElement.textContent).toBe('Edit Employee');
    });

    it('should apply dark-mode class when darkModeService.darkMode() returns true', () => {
      darkModeSignal.set(true);
      fixture.detectChanges();
      const formElement = fixture.debugElement.query(By.css('form')).nativeElement;
      expect(formElement.classList).toContain('dark-mode');
    });

    it('should not apply dark-mode class when darkModeService.darkMode() returns false', () => {
      darkModeSignal.set(false);
      fixture.detectChanges();
      const formElement = fixture.debugElement.query(By.css('form')).nativeElement;
      expect(formElement.classList).not.toContain('dark-mode');
    });

    it('should call SaveEmployee on form submission', async () => {
      jest.spyOn(component, 'SaveEmployee');
      component.empForm.setValue({
        id: 2,
        name: 'Jane Doe',
        doj: new Date('2023-02-01'),
        role: 'lead',
        salary: 60000,
      });
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
      saveButton.click();
      await fixture.whenStable();

      expect(component.SaveEmployee).toHaveBeenCalled();
    });

    it('should call closepopup when Close button is clicked', () => {
      jest.spyOn(component, 'closepopup');
      const closeButton = fixture.debugElement.query(By.css('a[mat-raised-button]')).nativeElement;
      closeButton.click();
      expect(component.closepopup).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should mark form as invalid if required fields are empty', () => {
      component.empForm.setValue({
        id: 0,
        name: '',
        doj: null,
        role: '',
        salary: 0,
      });
      expect(component.empForm.invalid).toBe(true);
    });

    it('should mark form as valid if all required fields are filled', () => {
      component.empForm.setValue({
        id: 2,
        name: 'Jane Doe',
        doj: new Date('2023-02-01'),
        role: 'lead',
        salary: 60000,
      });
      expect(component.empForm.valid).toBe(true);
    });
  });
});