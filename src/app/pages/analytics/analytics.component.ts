import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { trigger, transition, style, animate } from '@angular/animations';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    DatePipe
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class AnalyticsComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isLinear = true;
  isMobile = window.innerWidth < 768;
  submittedData: any = null;
  showSuccessMessage = false;

  genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' },
    { value: 'other', viewValue: 'Other' },
    { value: 'prefer-not-to-say', viewValue: 'Prefer not to say' }
  ];

  ageGroups = ['Under 18', '18-30', '30-40', '40-50', 'Over 50'];

  countries = [
    { value: 'us', viewValue: 'United States' },
    { value: 'uk', viewValue: 'United Kingdom' },
    { value: 'ca', viewValue: 'Canada' },
    { value: 'au', viewValue: 'Australia' },
    { value: 'in', viewValue: 'India' }
  ];

  states = [
    { value: 'ap', viewValue: 'Andhra Pradesh' },
    { value: 'tn', viewValue: 'Tamil Nadu' },
    { value: 'ka', viewValue: 'Karnataka' },
    { value: 'ts', viewValue: 'Telangana' },
    { value: 'kl', viewValue: 'Kerala' }
  ];

  constructor(private _formBuilder: FormBuilder,
    public darkModeService: DarkModeService
  ) {
    this.initializeForms();
    
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  initializeForms() {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10,15}$/)]]
    });

    this.secondFormGroup = this._formBuilder.group({
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      ageGroup: [[], [Validators.required, Validators.minLength(1)]]
    });

    this.thirdFormGroup = this._formBuilder.group({
      address: ['', [Validators.required, Validators.minLength(10)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5,10}$/)]]
    });
  }

  get firstName() { return this.firstFormGroup.get('firstName'); }
  get lastName() { return this.firstFormGroup.get('lastName'); }
  get email() { return this.firstFormGroup.get('email'); }
  get phone() { return this.firstFormGroup.get('phone'); }
  get gender() { return this.secondFormGroup.get('gender'); }
  get dob() { return this.secondFormGroup.get('dob'); }
  get ageGroup() { return this.secondFormGroup.get('ageGroup'); }
  get address() { return this.thirdFormGroup.get('address'); }
  get country() { return this.thirdFormGroup.get('country'); }
  get state() { return this.thirdFormGroup.get('state'); }
  get zipCode() { return this.thirdFormGroup.get('zipCode'); }

  getGenderViewValue(genderValue: string): string {
    const gender = this.genders.find(g => g.value === genderValue);
    return gender ? gender.viewValue : genderValue;
  }

  getCountryViewValue(countryValue: string): string {
    const country = this.countries.find(c => c.value === countryValue);
    return country ? country.viewValue : countryValue;
  }

  getStateViewValue(stateValue: string): string {
    const state = this.states.find(s => s.value === stateValue);
    return state ? state.viewValue : stateValue;
  }

  onSubmit(stepper: any) {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      this.submittedData = {
        ...this.firstFormGroup.value,
        ...this.secondFormGroup.value,
        ...this.thirdFormGroup.value
      };
      stepper.next();
    }
  }

  finalSubmit(stepper: any) {
    console.log('Form submitted:', this.submittedData);
    this.showSuccessMessage = true;
    
    setTimeout(() => {
      this.resetForm(stepper);
      this.showSuccessMessage = false;
    }, 3000);
  }

  resetForm(stepper: any) {
    this.submittedData = null;
    this.initializeForms();
    stepper.reset();
  }
}