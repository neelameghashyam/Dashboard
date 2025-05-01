import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../Employee';
import { lastValueFrom } from 'rxjs';

// Define the API response interface to match JSONPlaceholder structure
interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

type EmployeeState = {
  initialized: boolean;
  error: string | null;
  employees: Employee[];
};

const initialState: EmployeeState = {
  initialized: false,
  error: null,
  employees: [],
};

const apiUrl = 'https://jsonplaceholder.typicode.com/users';

export const EmployeeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ employees }) => ({
    employees: computed(() => employees()),
    isLoading: computed(() => !initialState.initialized),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    async loadEmployees() {
      try {
        // Check localStorage first
        const localData = localStorage.getItem('employees');
        if (localData) {
          const employees: Employee[] = JSON.parse(localData);
          patchState(store, { employees, initialized: true, error: null });
          return;
        }

        // Fetch from API if not in localStorage
        const response = await lastValueFrom(http.get<ApiUser[]>(apiUrl));
        const mappedEmployees: Employee[] = response.map(user => ({
          id: user.id,
          name: user.name,
          company: user.company.name,
          bs: user.company.bs,
          website: user.website,
        }));
        localStorage.setItem('employees', JSON.stringify(mappedEmployees));
        patchState(store, { employees: mappedEmployees, initialized: true, error: null });
      } catch (error) {
        patchState(store, { error: 'Failed to load employees' });
        throw error;
      }
    },
    addEmployee(employee: Employee) {
      try {
        const newEmployees = [...store.employees(), { ...employee, id: Date.now() }]; // Use timestamp for unique ID
        localStorage.setItem('employees', JSON.stringify(newEmployees));
        patchState(store, { employees: newEmployees, error: null });
      } catch (error) {
        patchState(store, { error: 'Failed to add employee' });
        throw error;
      }
    },
    updateEmployee(employee: Employee) {
      try {
        const updatedEmployees = store.employees().map(emp =>
          emp.id === employee.id ? employee : emp
        );
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        patchState(store, { employees: updatedEmployees, error: null });
      } catch (error) {
        patchState(store, { error: 'Failed to update employee' });
        throw error;
      }
    },
    deleteEmployee(empId: number) {
      try {
        const updatedEmployees = store.employees().filter(emp => emp.id !== empId);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        patchState(store, { employees: updatedEmployees, error: null });
      } catch (error) {
        patchState(store, { error: 'Failed to delete employee' });
        throw error;
      }
    },
    getEmployee(empId: number): Employee | undefined {
      try {
        return store.employees().find(emp => emp.id === empId);
      } catch (error) {
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