import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AnalyticsComponent } from './analytics.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let darkModeService: DarkModeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsComponent],
      imports: [
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
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        DatePipe,
        {
          provide: DarkModeService,
          useValue: {
            darkMode: jest.fn(() => false)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    darkModeService = TestBed.inject(DarkModeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.firstFormGroup).toBeDefined();
    expect(component.secondFormGroup).toBeDefined();
    expect(component.thirdFormGroup).toBeDefined();
  });

  describe('First Form Group', () => {
    it('should validate firstName as required', () => {
      const firstName = component.firstFormGroup.get('firstName');
      firstName.setValue('');
      expect(firstName.hasError('required')).toBeTruthy();
    });

    it('should validate firstName min length', () => {
      const firstName = component.firstFormGroup.get('firstName');
      firstName.setValue('a');
      expect(firstName.hasError('minlength')).toBeTruthy();
      firstName.setValue('ab');
      expect(firstName.hasError('minlength')).toBeFalsy();
    });

    it('should validate lastName as required', () => {
      const lastName = component.firstFormGroup.get('lastName');
      lastName.setValue('');
      expect(lastName.hasError('required')).toBeTruthy();
    });

    it('should validate email format', () => {
      const email = component.firstFormGroup.get('email');
      email.setValue('invalid');
      expect(email.hasError('email')).toBeTruthy();
      email.setValue('valid@example.com');
      expect(email.hasError('email')).toBeFalsy();
    });

    it('should validate phone number pattern', () => {
      const phone = component.firstFormGroup.get('phone');
      phone.setValue('123');
      expect(phone.hasError('pattern')).toBeTruthy();
      phone.setValue('1234567890');
      expect(phone.hasError('pattern')).toBeFalsy();
    });
  });

  describe('Second Form Group', () => {
    it('should validate gender as required', () => {
      const gender = component.secondFormGroup.get('gender');
      gender.setValue('');
      expect(gender.hasError('required')).toBeTruthy();
    });

    it('should validate dob as required', () => {
      const dob = component.secondFormGroup.get('dob');
      dob.setValue('');
      expect(dob.hasError('required')).toBeTruthy();
    });

    it('should validate ageGroup as required', () => {
      const ageGroup = component.secondFormGroup.get('ageGroup');
      ageGroup.setValue([]);
      expect(ageGroup.hasError('required')).toBeTruthy();
    });
  });

  describe('Third Form Group', () => {
    it('should validate address as required', () => {
      const address = component.thirdFormGroup.get('address');
      address.setValue('');
      expect(address.hasError('required')).toBeTruthy();
    });

    it('should validate address min length', () => {
      const address = component.thirdFormGroup.get('address');
      address.setValue('short');
      expect(address.hasError('minlength')).toBeTruthy();
      address.setValue('long enough address');
      expect(address.hasError('minlength')).toBeFalsy();
    });

    it('should validate country as required', () => {
      const country = component.thirdFormGroup.get('country');
      country.setValue('');
      expect(country.hasError('required')).toBeTruthy();
    });

    it('should validate state as required', () => {
      const state = component.thirdFormGroup.get('state');
      state.setValue('');
      expect(state.hasError('required')).toBeTruthy();
    });

    it('should validate zipCode pattern', () => {
      const zipCode = component.thirdFormGroup.get('zipCode');
      zipCode.setValue('123');
      expect(zipCode.hasError('pattern')).toBeTruthy();
      zipCode.setValue('12345');
      expect(zipCode.hasError('pattern')).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    it('should combine form values on submit', () => {
      // Set valid form values
      component.firstFormGroup.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890'
      });

      component.secondFormGroup.setValue({
        gender: 'male',
        dob: new Date(),
        ageGroup: ['18-30']
      });

      component.thirdFormGroup.setValue({
        address: '123 Main St, Anytown',
        country: 'us',
        state: 'ca',
        zipCode: '12345'
      });

      const stepper = { next: jest.fn() };
      component.onSubmit(stepper);

      expect(component.submittedData).toBeTruthy();
      expect(component.submittedData.firstName).toBe('John');
      expect(component.submittedData.lastName).toBe('Doe');
      expect(stepper.next).toHaveBeenCalled();
    });

    it('should not submit if forms are invalid', () => {
      const stepper = { next: jest.fn() };
      component.onSubmit(stepper);
      expect(component.submittedData).toBeNull();
      expect(stepper.next).not.toHaveBeenCalled();
    });

    it('should show success message and reset form on final submit', fakeAsync(() => {
      component.submittedData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      const stepper = { reset: jest.fn() };
      component.finalSubmit(stepper);

      expect(component.showSuccessMessage).toBeTruthy();
      tick(3000);
      fixture.detectChanges();

      expect(component.showSuccessMessage).toBeFalsy();
      expect(stepper.reset).toHaveBeenCalled();
      expect(component.submittedData).toBeNull();
    }));
  });

  describe('View Value Getters', () => {
    it('should return correct gender view value', () => {
      expect(component.getGenderViewValue('male')).toBe('Male');
      expect(component.getGenderViewValue('invalid')).toBe('invalid');
    });

    it('should return correct country view value', () => {
      expect(component.getCountryViewValue('us')).toBe('United States');
      expect(component.getCountryViewValue('invalid')).toBe('invalid');
    });

    it('should return correct state view value', () => {
      expect(component.getStateViewValue('ca')).toBe('Canada');
      expect(component.getStateViewValue('invalid')).toBe('invalid');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should detect mobile view on resize', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 400 });
      window.dispatchEvent(new Event('resize'));
      expect(component.isMobile).toBeTruthy();

      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
      window.dispatchEvent(new Event('resize'));
      expect(component.isMobile).toBeFalsy();
    });
  });

  describe('Dark Mode', () => {
    it('should apply dark mode classes when enabled', () => {
      jest.spyOn(darkModeService, 'darkMode').mockReturnValue(true);
      fixture.detectChanges();
      
      const formContainer = fixture.debugElement.query(By.css('.form-container'));
      expect(formContainer.nativeElement.classList.contains('dark-mode')).toBeTruthy();
    });

    it('should not apply dark mode classes when disabled', () => {
      jest.spyOn(darkModeService, 'darkMode').mockReturnValue(false);
      fixture.detectChanges();
      
      const formContainer = fixture.debugElement.query(By.css('.form-container'));
      expect(formContainer.nativeElement.classList.contains('dark-mode')).toBeFalsy();
    });
  });

  describe('DOM Interactions', () => {
    it('should disable next button when first form is invalid', () => {
      const nextButton = fixture.debugElement.query(By.css('button[matStepperNext]'));
      expect(nextButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable next button when first form is valid', () => {
      component.firstFormGroup.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890'
      });
      fixture.detectChanges();
      
      const nextButton = fixture.debugElement.query(By.css('button[matStepperNext]'));
      expect(nextButton.nativeElement.disabled).toBeFalsy();
    });

    it('should show error messages when fields are invalid', () => {
      const firstName = component.firstFormGroup.get('firstName');
      firstName.setValue('');
      firstName.markAsTouched();
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      expect(errorElement.nativeElement.textContent).toContain('First name is required');
    });

    it('should show success message after final submit', fakeAsync(() => {
      component.submittedData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };
      component.finalSubmit({ reset: jest.fn() });
      fixture.detectChanges();
      
      const successMessage = fixture.debugElement.query(By.css('.success-message'));
      expect(successMessage).toBeTruthy();
      
      tick(3000);
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('.success-message'))).toBeNull();
    }));
  });
});