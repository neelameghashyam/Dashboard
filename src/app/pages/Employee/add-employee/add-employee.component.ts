import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../Employee';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeeStore } from '../store/employee-store';
import { inject } from '@angular/core';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit {
  title = 'Add Employee';
  store = inject(EmployeeStore);
  isEdit = false;

  empForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    doj: new FormControl(new Date(), Validators.required),
    role: new FormControl('', Validators.required),
    salary: new FormControl(0, Validators.required),
  });

  constructor(
    private ref: MatDialogRef<AddEmployeeComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { empId: number }
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.data?.empId) {
      this.isEdit = true;
      this.title = 'Edit Employee';
      try {
        const employee = await this.store.getEmployee(this.data.empId);
        this.empForm.patchValue({
          id: employee.id,
          name: employee.name,
          doj: new Date(employee.doj),
          role: employee.role,
          salary: employee.salary,
        });
      } catch (error) {
        this.toastr.error('Failed to load employee data');
        this.closepopup();
      }
    }
  }

  async SaveEmployee() {
    if (this.empForm.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    const employeeData: Employee = this.empForm.value as Employee;
    try {
      if (this.isEdit) {
        await this.store.updateEmployee(employeeData);
        this.toastr.success('Employee updated successfully');
      } else {
        await this.store.addEmployee({
          id:employeeData.id,
          name: employeeData.name,
          doj: employeeData.doj,
          role: employeeData.role,
          salary: employeeData.salary,
        });
        this.toastr.success('Employee added successfully');
      }
      this.closepopup();
    } catch (error) {
      this.toastr.error(this.isEdit ? 'Failed to update employee' : 'Failed to add employee');
    }
  }

  closepopup() {
    this.ref.close();
  }
}