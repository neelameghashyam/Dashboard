import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { Employee } from '../Employee';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { EmployeeStore } from '../store/employee-store';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../../../services/dark-theme/dark-mode.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    CommonModule,
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

  constructor(
    public darkModeService: DarkModeService
  ) {
    effect(() => {
      this.dataSource.data = this.store.employees();
      if (this.store.error()) {
        this.toastr.error(this.store.error());
      }
    });
  }

  ngOnInit(): void {
    this.store.loadEmployees();
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
}