import { Component, ViewChild, ChangeDetectorRef, inject, effect } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeStore } from '../store/emp-store';
import { Employee } from '../employee.model';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {
  store = inject(EmployeeStore);
  toastr = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);
  darkModeService = inject(DarkModeService);
  router = inject(Router);

  dataSource = new MatTableDataSource<Employee>([]);
  displayedColumns: string[] = [
    'empId',
    'empName',
    'empEmailId',
    'empContactNo',
    'empDesignationId',
    'roleId',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 25];
  pageSize = 5;
  searchTerm: string = '';

  constructor() {
    effect(() => {
      this.dataSource.data = this.store.employees();
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      this.cdr.detectChanges();
    });

    effect(() => {
      const error = this.store.error();
      if (error) {
        this.toastr.error(error);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return (
        data.empName.toLowerCase().includes(searchTerm) ||
        data.empEmailId.toLowerCase().includes(searchTerm) ||
        data.empContactNo.includes(searchTerm) ||
        data.empId.toString().includes(searchTerm) ||
        data.empDesignationId.toString().includes(searchTerm) ||
        data.roleId.toString().includes(searchTerm)
      );
    };
  }

  addEmployee() {
    this.router.navigate(['/emp-form', '0']);
  }

  editEmployee(empId: string) {
    this.router.navigate(['/emp-form', empId]);
  }

  deleteEmployee(empId: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.store.deleteEmployee(empId);
      this.toastr.success('Employee deleted successfully');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.cdr.detectChanges();
  }
}