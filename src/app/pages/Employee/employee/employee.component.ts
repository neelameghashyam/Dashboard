import { Component, effect, inject, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { Employee } from '../Employee';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { EmployeeStore } from '../store/employee-store';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../../../services/dark-theme/dark-mode.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit, OnDestroy {
  store = inject(EmployeeStore);
  toastr = inject(ToastrService);
  dataSource = new MatTableDataSource<Employee>([]);
  displayedColumns: string[] = ['id', 'name', 'company', 'bs', 'website', 'action'];
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 25];
  pageSize = 5;
  searchTerm: string = '';

  constructor(
    public darkModeService: DarkModeService
  ) {
    effect(() => {
      this.dataSource.data = this.store.employees();
      // Set paginator only if initialized
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.store.error()) {
        this.toastr.error(this.store.error());
      }
      // Trigger change detection after updating dataSource
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.store.loadEmployees();
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchTerm) ||
             data.company.toLowerCase().includes(searchTerm) ||
             data.bs.toLowerCase().includes(searchTerm) ||
             data.website.toLowerCase().includes(searchTerm) ||
             data.id.toString().includes(searchTerm);
    };
  }

  ngOnDestroy(): void {}

  addemployee() {
    this.openpopup(0);
  }

  DeleteEmployee(empId: number) {
    this.store.deleteEmployee(empId);
  }

  EditEmployee(empId: number) {
    this.openpopup(empId);
  }

  openpopup(empId: number) {
    this.dialog.open(AddEmployeeComponent, {
      width: '50%',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: { empId },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // Trigger change detection after filtering
    this.cdr.detectChanges();
  }
}