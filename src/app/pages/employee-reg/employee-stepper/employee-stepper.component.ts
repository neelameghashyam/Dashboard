import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { EmployeeStore } from '../store/emp-store';
import { Employee, EmployeeSkill, EmployeeExperience } from '../employee.model';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-stepper',
  standalone: true,
  imports: [
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './employee-stepper.component.html',
  styleUrls: ['./employee-stepper.component.scss'],
})
export class EmployeeStepperComponent implements OnInit {
  basicDetailsForm: FormGroup;
  skillsForm: FormGroup;
  experienceForm: FormGroup;
  isEdit = false;
  title = 'Add Employee';
  empId: string = '0';

  private fb = inject(FormBuilder);
  private store = inject(EmployeeStore);
  private toastr = inject(ToastrService);
  private darkModeService = inject(DarkModeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.basicDetailsForm = this.fb.group({
      empName: [''],
      empEmailId: [''],
      empPersonalEmailId: [''],
      empContactNo: [''],
      empAltContactNo: [''],
      empDesignationId: [0],
      roleId: [0],
      empExpTotalYear: [0],
      empExpTotalMonth: [0],
      empCity: [''],
      empState: [''],
      empPinCode: [''],
      empAddress: [''],
      empPerCity: [''],
      empPerState: [''],
      empPerPinCode: [''],
      empPerAddress: [''],
      password: [''],
    });

    this.skillsForm = this.fb.group({
      skills: this.fb.array([]),
    });

    this.experienceForm = this.fb.group({
      experiences: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.empId = params.get('empId') || '0';
      if (this.empId !== '0') {
        this.isEdit = true;
        this.title = 'Edit Employee';
        const employee = this.store.getEmployee(this.empId);
        if (employee) {
          this.basicDetailsForm.patchValue(employee);
          employee.ErpEmployeeSkills.forEach(skill => this.addSkill(skill));
          employee.ErmEmpExperiences.forEach(exp => this.addExperience(exp));
        } else {
          this.toastr.error('Failed to load employee data');
          this.close();
        }
      }
    });
  }

  get skills(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  get experiences(): FormArray {
    return this.experienceForm.get('experiences') as FormArray;
  }

  addSkill(skill?: EmployeeSkill): void {
    const skillGroup = this.fb.group({
      empskillId: [skill?.empskillId || ''],
      skill: [skill?.skill || ''],
      totalYearExp: [skill?.totalYearExp || 0],
      lastVersionUsed: [skill?.lastVersionUsed || ''],
    });
    this.skills.push(skillGroup);
  }

  addExperience(exp?: EmployeeExperience): void {
    const expGroup = this.fb.group({
      empExpId: [exp?.empExpId || ''],
      companyName: [exp?.companyName || ''],
      startDate: [exp?.startDate || ''],
      endDate: [exp?.endDate || ''],
      designation: [exp?.designation || ''],
      projectsWorkedon: [exp?.projectsWorkedon || ''],
    });
    this.experiences.push(expGroup);
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  onSubmit(): void {
    const employee: Employee = {
      ...this.basicDetailsForm.value,
      empId: this.isEdit ? this.empId : '0',
      ErpEmployeeSkills: this.skills.value,
      ErmEmpExperiences: this.experiences.value,
    };

    try {
      if (this.isEdit) {
        this.store.updateEmployee(employee);
        this.toastr.success('Employee updated successfully');
      } else {
        this.store.addEmployee(employee);
        this.toastr.success('Employee added successfully');
      }
      this.close();
    } catch (error) {
      this.toastr.error(this.isEdit ? 'Failed to update employee' : 'Failed to add employee');
    }
  }

  close(): void {
    this.router.navigate(['/emp-reg']);
  }

  trackByIndex(index: number): number {
    return index;
  }
}