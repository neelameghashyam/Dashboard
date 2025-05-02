import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { Employee } from '../employee.model';
import { v4 as uuidv4 } from 'uuid';

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

const STORAGE_KEY = 'employees';

export const EmployeeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ employees }) => ({
    employeeCount: computed(() => employees().length),
  })),
  withMethods((store) => ({
    loadEmployees(): void {
      try {
        patchState(store, { loading: true });
        const data = localStorage.getItem(STORAGE_KEY);
        const employees = data ? JSON.parse(data) : [];
        patchState(store, { employees, loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error: 'Failed to load employees' });
      }
    },

    addEmployee(employee: Employee): void {
      try {
        patchState(store, { loading: true });
        const employees = [...store.employees()];
        employee.empId = uuidv4(); // Use UUID for empId
        employee.ErpEmployeeSkills.forEach(skill => {
          skill.empskillId = uuidv4();
          skill.empId = employee.empId;
        });
        employee.ErmEmpExperiences.forEach(exp => {
          exp.empExpId = uuidv4();
          exp.empId = employee.empId;
        });
        employees.push(employee);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        patchState(store, { employees, loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error: 'Failed to add employee' });
      }
    },

    updateEmployee(employee: Employee): void {
      try {
        patchState(store, { loading: true });
        const employees = [...store.employees()];
        const index = employees.findIndex(emp => emp.empId === employee.empId);
        if (index === -1) {
          throw new Error('Employee not found');
        }
        employee.ErpEmployeeSkills.forEach(skill => {
          if (!skill.empskillId) {
            skill.empskillId = uuidv4();
            skill.empId = employee.empId;
          }
        });
        employee.ErmEmpExperiences.forEach(exp => {
          if (!exp.empExpId) {
            exp.empExpId = uuidv4();
            exp.empId = employee.empId;
          }
        });
        employees[index] = employee;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        patchState(store, { employees, loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error: 'Failed to update employee' });
      }
    },

    deleteEmployee(empId: string): void {
      try {
        patchState(store, { loading: true });
        const employees = store.employees().filter(emp => emp.empId !== empId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        patchState(store, { employees, loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error: 'Failed to delete employee' });
      }
    },

    getEmployee(empId: string): Employee | undefined {
      try {
        return store.employees().find(emp => emp.empId === empId);
      } catch (error) {
        patchState(store, { error: `Failed to fetch employee with ID ${empId}` });
        return undefined;
      }
    },
  })),
  withHooks({
    onInit(store) {
      store.loadEmployees();
    },
  })
);