import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeComponent } from './employee.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../../../services/dark-theme/dark-mode.service';
import { EmployeeStore } from '../store/employee-store';
import { Employee } from '../Employee';
import { Signal, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Interface for EmployeeStore to match its structure
interface EmployeeStoreInterface {
  employees: () => Employee[];
  error: () => string | null;
  loadEmployees: () => void;
  deleteEmployee: (empId: number) => void;
}

// Mock dependencies
const mockEmployeeStore: EmployeeStoreInterface = {
  employees: jest.fn().mockReturnValue([]),
  error: jest.fn().mockReturnValue(null),
  loadEmployees: jest.fn(),
  deleteEmployee: jest.fn(),
};

const mockToastrService = {
  error: jest.fn(),
};

const mockDarkModeService = {
  darkMode: jest.fn().mockReturnValue(false),
};

const mockDialog = {
  open: jest.fn().mockReturnValue({ afterClosed: () => ({ subscribe: jest.fn() }) }),
};

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let employeeStore: EmployeeStoreInterface;
  let toastrService: ToastrService;
  let dialog: MatDialog;
  let darkModeService: DarkModeService;

  const mockEmployees: Employee[] = [
    { id: 1, name: 'John Doe', role: 'Developer', doj: new Date('2023-01-01'), salary: 50000 },
    { id: 2, name: 'Jane Smith', role: 'Manager', doj: new Date('2022-06-15'), salary: 75000 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeeComponent,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        CommonModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: EmployeeStore, useValue: mockEmployeeStore },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: DarkModeService, useValue: mockDarkModeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    employeeStore = TestBed.inject(EmployeeStore) as unknown as EmployeeStoreInterface;
    toastrService = TestBed.inject(ToastrService);
    dialog = TestBed.inject(MatDialog);
    darkModeService = TestBed.inject(DarkModeService);
    fixture.detectChanges();
  });

  // Test component creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit
  it('should call loadEmployees on ngOnInit', () => {
    jest.spyOn(employeeStore, 'loadEmployees');
    component.ngOnInit();
    expect(employeeStore.loadEmployees).toHaveBeenCalled();
  });

  // Test effect for updating dataSource
  it('should update dataSource when employees signal changes', () => {
    const employeesSignal = signal(mockEmployees);
    jest.spyOn(employeeStore, 'employees').mockReturnValue(employeesSignal());
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.dataSource.data).toEqual(mockEmployees);
  });

  // Test effect for error handling
  it('should show toastr error when store has error', () => {
    jest.spyOn(employeeStore, 'error').mockReturnValue('Failed to load employees');
    jest.spyOn(toastrService, 'error');
    component.ngOnInit();
    fixture.detectChanges();
    expect(toastrService.error).toHaveBeenCalledWith('Failed to load employees');
  });

  it('should not show toastr error when store error is null', () => {
    jest.spyOn(employeeStore, 'error').mockReturnValue(null);
    jest.spyOn(toastrService, 'error');
    component.ngOnInit();
    fixture.detectChanges();
    expect(toastrService.error).not.toHaveBeenCalled();
  });

  // Test table rendering
  it('should render table with correct columns', () => {
    const headers = fixture.debugElement.queryAll(By.css('th'));
    const expectedColumns = ['Employee Id', 'Name', 'Salary', 'Date of Joining', 'Role', 'Action'];
    headers.forEach((header, index) => {
      expect(header.nativeElement.textContent.trim()).toBe(expectedColumns[index]);
    });
  });

  it('should display employees in the table', () => {
    jest.spyOn(employeeStore, 'employees').mockReturnValue(mockEmployees);
    component.dataSource.data = mockEmployees;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tr.mat-mdc-row'));
    expect(rows.length).toBe(mockEmployees.length);

    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('1');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('John Doe');
    expect(firstRowCells[2].nativeElement.textContent.trim()).toBe('₹50000/-');
    expect(firstRowCells[3].nativeElement.textContent.trim()).toContain('2023');
    expect(firstRowCells[4].nativeElement.textContent.trim()).toBe('Developer');
  });

  // Test date formatting
  it('should format date of joining correctly', () => {
    jest.spyOn(employeeStore, 'employees').mockReturnValue(mockEmployees);
    component.dataSource.data = mockEmployees;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tr.mat-mdc-row'));
    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[3].nativeElement.textContent.trim()).toMatch(/\w+\s\d{1,2},\s2023/);
  });

  // Test add employee button
  it('should open dialog when addemployee is called', () => {
    jest.spyOn(component, 'openpopup');
    const addButton = fixture.debugElement.query(By.css('mat-card-header button[color="primary"]')).nativeElement;
    addButton.click();
    expect(component.openpopup).toHaveBeenCalledWith(0);
  });

  // Test edit employee
  it('should open dialog with employee id when EditEmployee is called', () => {
    jest.spyOn(dialog, 'open');
    component.EditEmployee(1);
    expect(dialog.open).toHaveBeenCalledWith(expect.anything(), {
      width: '50%',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: { empId: 1 },
    });
  });

  // Test delete employee
  it('should call deleteEmployee when DeleteEmployee is called', () => {
    jest.spyOn(employeeStore, 'deleteEmployee');
    component.DeleteEmployee(1);
    expect(employeeStore.deleteEmployee).toHaveBeenCalledWith(1);
  });

  // Test openpopup
  it('should open dialog with correct configuration for adding employee', () => {
    jest.spyOn(dialog, 'open');
    component.openpopup(0);
    expect(dialog.open).toHaveBeenCalledWith(expect.anything(), {
      width: '50%',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: { empId: 0 },
    });
  });

  it('should open dialog with correct configuration for editing employee', () => {
    jest.spyOn(dialog, 'open');
    component.openpopup(2);
    expect(dialog.open).toHaveBeenCalledWith(expect.anything(), {
      width: '50%',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: { empId: 2 },
    });
  });

  // Test dark mode
  it('should apply dark-mode class when darkMode is true', () => {
    jest.spyOn(darkModeService, 'darkMode').mockReturnValue(true);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card.classes['dark-mode']).toBeTruthy();
  });

  it('should not apply dark-mode class when darkMode is false', () => {
    jest.spyOn(darkModeService, 'darkMode').mockReturnValue(false);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card.classes['dark-mode']).toBeFalsy();
  });

  // Test ngOnDestroy
  it('should not throw error on ngOnDestroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  // Test table interactions
  it('should call EditEmployee when edit button is clicked', () => {
    jest.spyOn(employeeStore, 'employees').mockReturnValue(mockEmployees);
    component.dataSource.data = mockEmployees;
    fixture.detectChanges();

    jest.spyOn(component, 'EditEmployee');
    const editButtons = fixture.debugElement.queryAll(By.css('td button[color="primary"]'));
    editButtons[0].nativeElement.click();
    expect(component.EditEmployee).toHaveBeenCalledWith(1);
  });

  it('should call DeleteEmployee when delete button is clicked', () => {
    jest.spyOn(employeeStore, 'employees').mockReturnValue(mockEmployees);
    component.dataSource.data = mockEmployees;
    fixture.detectChanges();

    jest.spyOn(component, 'DeleteEmployee');
    const deleteButtons = fixture.debugElement.queryAll(By.css('td button[color="accent"]'));
    deleteButtons[0].nativeElement.click();
    expect(component.DeleteEmployee).toHaveBeenCalledWith(1);
  });

  // Test empty table
  it('should render empty table when no employees', () => {
    jest.spyOn(employeeStore, 'employees').mockReturnValue([]);
    component.dataSource.data = [];
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tr.mat-mdc-row'));
    expect(rows.length).toBe(0);
  });

  // Test table with single employee
  it('should render table with one employee', () => {
    const singleEmployee = [mockEmployees[0]];
    jest.spyOn(employeeStore, 'employees').mockReturnValue(singleEmployee);
    component.dataSource.data = singleEmployee;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tr.mat-mdc-row'));
    expect(rows.length).toBe(1);
    const cells = rows[0].queryAll(By.css('td'));
    expect(cells[1].nativeElement.textContent.trim()).toBe('John Doe');
  });

  // Test invalid employee data
  it('should handle employee with missing fields gracefully', () => {
    const invalidEmployee = [{ id: 3, name: '', role: '', doj: null, salary: 0 }];
    jest.spyOn(employeeStore, 'employees').mockReturnValue(invalidEmployee);
    component.dataSource.data = invalidEmployee;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tr.mat-mdc-row'));
    expect(rows.length).toBe(1);
    const cells = rows[0].queryAll(By.css('td'));
    expect(cells[1].nativeElement.textContent.trim()).toBe('');
    expect(cells[2].nativeElement.textContent.trim()).toBe('₹0/-');
    expect(cells[3].nativeElement.textContent.trim()).toBe('');
    expect(cells[4].nativeElement.textContent.trim()).toBe('');
  });

  // Test dialog open failure
  it('should handle dialog open failure', () => {
    jest.spyOn(dialog, 'open').mockImplementation(() => {
      throw new Error('Dialog open failed');
    });
    expect(() => component.openpopup(0)).toThrow('Dialog open failed');
  });

  // Test store loadEmployees failure
  it('should handle loadEmployees failure', () => {
    jest.spyOn(employeeStore, 'loadEmployees').mockImplementation(() => {
      throw new Error('Load employees failed');
    });
    expect(() => component.ngOnInit()).not.toThrow();
  });

  // Test store deleteEmployee failure
  it('should handle deleteEmployee failure', () => {
    jest.spyOn(employeeStore, 'deleteEmployee').mockImplementation(() => {
      throw new Error('Delete employee failed');
    });
    expect(() => component.DeleteEmployee(1)).not.toThrow();
  });

  // Test signal updates
  it('should update dataSource when employees signal updates dynamically', () => {
    const employeesSignal = signal<Employee[]>([]);
    jest.spyOn(employeeStore, 'employees').mockReturnValue(employeesSignal());
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.dataSource.data).toEqual([]);

    employeesSignal.set(mockEmployees);
    jest.spyOn(employeeStore, 'employees').mockReturnValue(employeesSignal());
    fixture.detectChanges();
    expect(component.dataSource.data).toEqual(mockEmployees);
  });

  // Test toastr service initialization
  it('should initialize toastr service correctly', () => {
    expect(toastrService).toBeDefined();
    expect(toastrService.error).toBeInstanceOf(Function);
  });

  // Test dark mode service initialization
  it('should initialize dark mode service correctly', () => {
    expect(darkModeService).toBeDefined();
    expect(darkModeService.darkMode).toBeInstanceOf(Function);
  });

  // Test dialog service initialization
  it('should initialize dialog service correctly', () => {
    expect(dialog).toBeDefined();
    expect(dialog.open).toBeInstanceOf(Function);
  });
});