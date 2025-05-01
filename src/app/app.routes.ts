import { Routes } from '@angular/router';
import { ContentComponent } from './pages/content/content.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { Dashboard_Component } from './pages/dashboard/dashboard.component'; 
import { UserFormComponent } from './pages/user-form/user-form.component';
import { StoreComponent } from './pages/store/store.component';
import { EmployeeComponent } from './pages/Employee/employee/employee.component';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: Dashboard_Component,
  },
  { 
    path: 'employee', 
    component: EmployeeComponent,
  },
  { 
    path: 'content', 
    component: ContentComponent,
  },
  { 
    path: 'form', 
    component: UserFormComponent,
  },
  { 
    path: 'analytics', 
    component: AnalyticsComponent,
  },
  { 
    path: 'comments', 
    component: ContentComponent,
  },
  { 
    path: 'store', 
    component: StoreComponent,
  },
 
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];