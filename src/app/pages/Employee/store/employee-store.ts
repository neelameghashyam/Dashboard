import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../Employee';
import { lastValueFrom } from 'rxjs';

type EmployeeState = {
  initialized: boolean;
  error: string | null; // State error for general store errors
};

const initialState: EmployeeState = {
  initialized: false,
  error: null,
};

const apiUrl = 'http://localhost:3000/employee';

export const EmployeeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    _employeeResource: resource<Employee[], void>({
      request: undefined,
      loader: async () => {
        const http = inject(HttpClient);
        try {
          const response = await lastValueFrom(http.get<Employee[]>(apiUrl));
          return response || [];
        } catch (error) {
          throw new Error('Failed to fetch employees');
        }
      },
    }),
  })),
  withComputed(({ _employeeResource }) => ({
    employees: computed(() => _employeeResource.value() || []),
    isLoading: computed(() => _employeeResource.isLoading()),
    resourceError: computed(() => _employeeResource.error()), // Renamed to avoid conflict
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    async loadEmployees() {
      try {
        const response = await lastValueFrom(http.get<Employee[]>(apiUrl));
        store._employeeResource.update(() => response || []);
        patchState(store, { initialized: true, error: null });
      } catch (error) {
        patchState(store, { error: 'Failed to load employees' });
        throw error;
      }
    },
    async addEmployee(employee: Employee) {
      try {
        const newEmployee = await lastValueFrom(http.post<Employee>(apiUrl, employee));
        store._employeeResource.update((employees) => {
          if (!employees) return [newEmployee];
          return [...employees, newEmployee];
        });
        patchState(store, { error: null });
      } catch (error) {
        patchState(store, { error: 'Failed to add employee' });
        throw error;
      }
    },
    async updateEmployee(employee: Employee) {
      try {
        const updatedEmployee = await lastValueFrom(
          http.put<Employee>(`${apiUrl}/${employee.id}`, employee)
        );
        store._employeeResource.update((employees) => {
          if (!employees) return [];
          return employees.map((emp) =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp
          );
        });
        patchState(store, { error: null });
      } catch (error) {
        patchState(store, { error: 'Failed to update employee' });
        throw error;
      }
    },
    async deleteEmployee(empId: number) {
      try {
        await lastValueFrom(http.delete(`${apiUrl}/${empId}`));
        store._employeeResource.update((employees) => {
          if (!employees) return [];
          return employees.filter((emp) => emp.id !== empId);
        });
        patchState(store, { error: null });
      } catch (error) {
        patchState(store, { error: 'Failed to delete employee' });
        throw error;
      }
    },
    async getEmployee(empId: number) {
      try {
        const employee = await lastValueFrom(http.get<Employee>(`${apiUrl}/${empId}`));
        return employee;
      } catch (error: any) {
        patchState(store, { error: `Failed to fetch employee with ID ${empId}` });
        throw error;
      }
    },
  })),
  withHooks({
    onInit(store) {
      store.loadEmployees();
    },
  })
);