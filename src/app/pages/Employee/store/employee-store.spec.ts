import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeStore } from './employee-store';
import { Employee } from '../Employee';
import { lastValueFrom } from 'rxjs';

describe('EmployeeStore', () => {
  let store: InstanceType<typeof EmployeeStore>;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/employee';
  const mockEmployees: Employee[] = [
    { id: 1, name: 'John Doe', doj: new Date('2020-01-01'), role: 'Developer', salary: 50000 },
    { id: 2, name: 'Jane Smith', doj: new Date('2019-05-15'), role: 'Manager', salary: 70000 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeStore],
    });

    store = TestBed.inject(EmployeeStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(store.initialized()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.employees()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.resourceError()).toBeUndefined();
  });

  // Test withHooks: onInit
  it('should call loadEmployees on init', async () => {
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);

    await Promise.resolve(); // Wait for async onInit to complete

    expect(store.employees()).toEqual(mockEmployees);
    expect(store.initialized()).toBe(true);
    expect(store.error()).toBeNull();
  });

  // Test withProps: resource loader success
  it('should load employees via resource loader', async () => {
    const req = httpMock.expectOne(apiUrl);
    req.flush(mockEmployees);

    await Promise.resolve();

    expect(store.employees()).toEqual(mockEmployees);
    expect(store.isLoading()).toBe(false);
    expect(store.resourceError()).toBeUndefined();
    expect(store.initialized()).toBe(true);
  });

  // Test withProps: resource loader error
  it('should handle resource loader error', async () => {
    const req = httpMock.expectOne(apiUrl);
    req.error(new ProgressEvent('error'));

    await Promise.resolve();

    expect(store.employees()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.resourceError()).toBeDefined();
    expect((store.resourceError() as Error)?.message).toBe('Failed to fetch employees');
    expect(store.error()).toBe('Failed to load employees');
  });

  // Test withComputed: computed properties
  it('should compute employees, isLoading, and resourceError correctly', async () => {
    // Initial state
    expect(store.employees()).toEqual([]);
    expect(store.isLoading()).toBe(true); // Resource is loading initially
    expect(store.resourceError()).toBeUndefined();

    // After successful load
    const req = httpMock.expectOne(apiUrl);
    req.flush(mockEmployees);

    await Promise.resolve();

    expect(store.employees()).toEqual(mockEmployees);
    expect(store.isLoading()).toBe(false);
    expect(store.resourceError()).toBeUndefined();

    // After error
    store.loadEmployees(); // Trigger another load
    const errorReq = httpMock.expectOne(apiUrl);
    errorReq.error(new ProgressEvent('error'));

    await Promise.resolve();

    expect(store.employees()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.resourceError()).toBeDefined();
  });

  // Test withMethods: loadEmployees
  it('should load employees successfully', async () => {
    const loadPromise = store.loadEmployees();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);

    await loadPromise;

    expect(store.employees()).toEqual(mockEmployees);
    expect(store.initialized()).toBe(true);
    expect(store.error()).toBeNull();
  });

  it('should handle load employees error', async () => {
    try {
      const loadPromise = store.loadEmployees();
      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('error'));
      await loadPromise;
    } catch (error) {
      expect(store.error()).toBe('Failed to load employees');
      expect(store.employees()).toEqual([]);
      expect(store.initialized()).toBe(false);
    }
  });

  // Test withMethods: addEmployee
  it('should add an employee', async () => {
    // Initial load
    let req = httpMock.expectOne(apiUrl);
    req.flush(mockEmployees);
    await Promise.resolve();

    const newEmployee: Employee = {
      id: 3,
      name: 'New Employee',
      doj: new Date('2021-01-01'),
      role: 'Tester',
      salary: 45000,
    };

    const addPromise = store.addEmployee(newEmployee);
    req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newEmployee);
    await addPromise;

    expect(store.employees()).toEqual([...mockEmployees, newEmployee]);
    expect(store.error()).toBeNull();
  });

  it('should add an employee when employee list is empty', async () => {
    // Initial load with empty array
    let req = httpMock.expectOne(apiUrl);
    req.flush([]);
    await Promise.resolve();

    const newEmployee: Employee = {
      id: 1,
      name: 'First Employee',
      doj: new Date('2021-01-01'),
      role: 'Tester',
      salary: 45000,
    };

    const addPromise = store.addEmployee(newEmployee);
    req = httpMock.expectOne(apiUrl);
    req.flush(newEmployee);
    await addPromise;

    expect(store.employees()).toEqual([newEmployee]);
    expect(store.error()).toBeNull();
  });

  it('should handle add employee error', async () => {
    let req = httpMock.expectOne(apiUrl);
    req.flush(mockEmployees);
    await Promise.resolve();

    const newEmployee: Employee = {
      id: 3,
      name: 'New Employee',
      doj: new Date('2021-01-01'),
      role: 'Tester',
      salary: 45000,
    };

    try {
      const addPromise = store.addEmployee(newEmployee);
      req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('error'));
      await addPromise;
    } catch (error) {
      expect(store.error()).toBe('Failed to add employee');
      expect(store.employees()).toEqual(mockEmployees);
    }
  });

  // Test withMethods: updateEmployee
  it('should update an employee', async () => {
    let req = httpMock.expectOne(apiUrl);
    req.flush(mockEmployees);
    await Promise.resolve();

    const updatedEmployee: Employee = { ...mockEmployees[0], name: 'Updated Name' };

    const updatePromise = store.updateEmployee(updatedEmployee);
    req = httpMock.expectOne(`${apiUrl}/${updatedEmployee.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedEmployee);
    await updatePromise;

    expect(store.employees()).toEqual([updatedEmployee, mockEmployees[1]]);
    expect(store.error()).toBeNull();
  });

  it('should handle update employee with empty employee list', async () => {
    let req = httpMock.expectOne(apiUrl);
    req.flush([]);
    await Promise.resolve();

    const updatedEmployee: Employee = {
      id: 1,
      name: 'Updated Employee',
      doj: new Date('2021-01-01'),
      role: 'Tester',
      salary: 45000,
    };

    const updatePromise = store.updateEmployee(updatedEmployee);
    req = httpMock.expectOne(`${apiUrl}/${updatedEmployee.id}`);
    req.flush(updatedEmployee);
    await updatePromise;

    expect(store.employees()).toEqual([]);
    expect(store.error()).toBeNull();
  });

  it('should handle update employee error', async () => {
    let req = httpMock.expectOne(apiUrl);
    req.flush(mockEmployees);
    await Promise.resolve();

    const updatedEmployee: Employee = { ...mockEmployees[0], name: 'Updated Name' };

    try {
      const updatePromise = store.updateEmployee(updatedEmployee);
      req = httpMock.expectOne(`${apiUrl}/${updatedEmployee.id}`);
      req.error(new ProgressEvent('error'));
      await updatePromise;
    } catch (error) {
      expect(store.error()).toBe('Failed to update employee');
      expect(store.employees()).toEqual(mockEmployees);
    }
  });

  // Test withMethods: deleteEmployee
  it('should delete an employee', async () => {
    let req = httpMock.expectOne(apiUrl);
    req.flush(mockEmployees);
    await Promise.resolve();

    const employeeIdToDelete = mockEmployees[0].id;

    const deletePromise = store.deleteEmployee(employeeIdToDelete);
    req = httpMock.expectOne(`${apiUrl}/${employeeIdToDelete}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    await deletePromise;

    expect(store.employees()).toEqual([mockEmployees[1]]);
    expect(store.error()).toBeNull();
  });

  it('should handle delete employee with empty employee list', async () => {
    let req = httpMock.expectOne(apiUrl);
    req.flush([]);
    await Promise.resolve();

    const employeeIdToDelete = 1;

    const deletePromise = store.deleteEmployee(employeeIdToDelete);
    req = httpMock.expectOne(`${apiUrl}/${employeeIdToDelete}`);
    req.flush({});
    await deletePromise;

    expect(store.employees()).toEqual([]);
    expect(store.error()).toBeNull();
  });

  it('should handle delete employee error', async () => {
    let req = httpMock.expectOne(apiUrl);
    req.flush(mockEmployees);
    await Promise.resolve();

    const employeeIdToDelete = mockEmployees[0].id;

    try {
      const deletePromise = store.deleteEmployee(employeeIdToDelete);
      req = httpMock.expectOne(`${apiUrl}/${employeeIdToDelete}`);
      req.error(new ProgressEvent('error'));
      await deletePromise;
    } catch (error) {
      expect(store.error()).toBe('Failed to delete employee');
      expect(store.employees()).toEqual(mockEmployees);
    }
  });

  // Test withMethods: getEmployee
  it('should get a single employee', async () => {
    const employeeId = mockEmployees[0].id;
    const mockEmployee = mockEmployees[0];

    const getPromise = store.getEmployee(employeeId);
    const req = httpMock.expectOne(`${apiUrl}/${employeeId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);
    const result = await getPromise;

    expect(result).toEqual(mockEmployee);
    expect(store.error()).toBeNull();
  });

  it('should handle get employee error', async () => {
    const employeeId = 1;

    try {
      const getPromise = store.getEmployee(employeeId);
      const req = httpMock.expectOne(`${apiUrl}/${employeeId}`);
      req.error(new ProgressEvent('error'));
      await getPromise;
    } catch (error) {
      expect(store.error()).toBe(`Failed to fetch employee with ID ${employeeId}`);
    }
  });
});