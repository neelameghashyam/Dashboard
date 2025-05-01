import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../Employee';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeeStore } from '../store/employee-store';
import { inject } from '@angular/core';
import { DarkModeService } from '../../../services/dark-theme/dark-mode.service'

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit {
  title = 'Add Employee';
  store = inject(EmployeeStore);
  isEdit = false;

  empForm = new FormGroup({
    id: new FormControl({ value: 0, disabled: true }),
    name: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required),
    bs: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
  });

  constructor(
    private ref: MatDialogRef<AddEmployeeComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { empId: number },
    public darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    if (this.data?.empId) {
      this.isEdit = true;
      this.title = 'Edit Employee';
      const employee = this.store.getEmployee(this.data.empId);
      if (employee) {
        this.empForm.patchValue({
          id: employee.id,
          name: employee.name,
          company: employee.company,
          bs: employee.bs,
          website: employee.website,
        });
      } else {
        this.toastr.error('Failed to load employee data');
        this.closepopup();
      }
    }
  }

  SaveEmployee() {
    if (this.empForm.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    const employeeData: Employee = {
      id: this.isEdit ? this.empForm.getRawValue().id! : Date.now(),
      name: this.empForm.getRawValue().name!,
      company: this.empForm.getRawValue().company!,
      bs: this.empForm.getRawValue().bs!,
      website: this.empForm.getRawValue().website!,
    };

    try {
      if (this.isEdit) {
        this.store.updateEmployee(employeeData);
        this.toastr.success('Employee updated successfully');
      } else {
        this.store.addEmployee(employeeData);
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