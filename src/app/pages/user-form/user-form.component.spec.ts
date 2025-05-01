import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const mockDarkModeService = {
    darkMode: signal(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        NoopAnimationsModule,
        UserFormComponent // Import standalone component here
      ],
      providers: [
        { provide: DarkModeService, useValue: mockDarkModeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.userForm.contains('fullName')).toBeTruthy();
    expect(component.userForm.contains('email')).toBeTruthy();
    expect(component.userForm.contains('phoneNumber')).toBeTruthy();
    expect(component.userForm.contains('dob')).toBeTruthy();
    expect(component.userForm.contains('address')).toBeTruthy();
    expect(component.userForm.contains('country')).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.userForm.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    const email = component.userForm.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue('test');
    expect(email.hasError('email')).toBeTruthy();

    email.setValue('test@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('should require all fields', () => {
    const fullName = component.userForm.controls['fullName'];
    const email = component.userForm.controls['email'];
    const phoneNumber = component.userForm.controls['phoneNumber'];
    const dob = component.userForm.controls['dob'];
    const address = component.userForm.controls['address'];
    const country = component.userForm.controls['country'];

    expect(fullName.valid).toBeFalsy();
    expect(email.valid).toBeFalsy();
    expect(phoneNumber.valid).toBeFalsy();
    expect(dob.valid).toBeFalsy();
    expect(address.valid).toBeFalsy();
    expect(country.valid).toBeFalsy();

    fullName.setValue('John Doe');
    email.setValue('john@example.com');
    phoneNumber.setValue('1234567890');
    dob.setValue(new Date());
    address.setValue('123 Main St');
    country.setValue('USA');

    expect(component.userForm.valid).toBeTruthy();
  });

  it('should display all form fields with proper labels', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-label[for="fullName"]').textContent).toContain('Full Name');
    expect(compiled.querySelector('mat-label[for="email"]').textContent).toContain('Email');
    expect(compiled.querySelector('mat-label[for="phoneNumber"]').textContent).toContain('Phone Number');
    expect(compiled.querySelector('mat-label[for="dob"]').textContent).toContain('Date of Birth');
    expect(compiled.querySelector('mat-label[for="address"]').textContent).toContain('Address');
    expect(compiled.querySelector('mat-label[for="country"]').textContent).toContain('Country');
  });

  it('should display all required icons', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-icon[matPrefix].form-icon').textContent).toContain('person');
    expect(compiled.querySelectorAll('mat-icon[matPrefix].form-icon')[1].textContent).toContain('email');
    expect(compiled.querySelectorAll('mat-icon[matPrefix].form-icon')[2].textContent).toContain('phone');
    expect(compiled.querySelectorAll('mat-icon[matPrefix].form-icon')[3].textContent).toContain('calendar_today');
    expect(compiled.querySelectorAll('mat-icon[matPrefix].form-icon')[4].textContent).toContain('home');
    expect(compiled.querySelectorAll('mat-icon[matPrefix].form-icon')[5].textContent).toContain('public');
  });

  it('should display the submit button with proper text and icon', () => {
    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.submit-button');
    expect(submitButton.textContent).toContain('Submit Form');
    expect(submitButton.querySelector('mat-icon').textContent).toContain('send');
  });

  it('should display country options in select dropdown', () => {
    component.countries = ['India', 'USA', 'UK'];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const options = compiled.querySelectorAll('mat-option');
    expect(options.length).toBe(component.countries.length + 1); // +1 for the default option
    expect(options[1].textContent).toContain('India');
    expect(options[2].textContent).toContain('USA');
    expect(options[3].textContent).toContain('UK');
  });

  it('should display datepicker toggle', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-datepicker-toggle')).toBeTruthy();
  });

  it('should have access to form controls via f() getter', () => {
    expect(component.f['fullName']).toBe(component.userForm.controls['fullName']);
    expect(component.f['email']).toBe(component.userForm.controls['email']);
    expect(component.f['phoneNumber']).toBe(component.userForm.controls['phoneNumber']);
    expect(component.f['dob']).toBe(component.userForm.controls['dob']);
    expect(component.f['address']).toBe(component.userForm.controls['address']);
    expect(component.f['country']).toBe(component.userForm.controls['country']);
  });

  it('should toggle dark mode class based on darkModeService', () => {
    const compiled = fixture.nativeElement;
    
    // Initial state (light mode)
    expect(compiled.querySelector('.form-container.dark-mode')).toBeFalsy();
    
    // Change to dark mode
    mockDarkModeService.darkMode.set(true);
    fixture.detectChanges();
    expect(compiled.querySelector('.form-container.dark-mode')).toBeTruthy();
    
    // Change back to light mode
    mockDarkModeService.darkMode.set(false);
    fixture.detectChanges();
    expect(compiled.querySelector('.form-container.dark-mode')).toBeFalsy();
  });

  it('should display error messages when form is submitted with invalid data', () => {
    component.onSubmit();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-error').length).toBeGreaterThan(0);
  });

  it('should reset form after successful submission', () => {
    // Fill form with valid data
    component.userForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      dob: new Date(),
      address: '123 Main St',
      country: 'USA'
    });
    
    component.onSubmit();
    fixture.detectChanges();
    
    expect(component.userForm.pristine).toBeTruthy();
    expect(component.userForm.untouched).toBeTruthy();
    expect(component.submitted).toBeFalsy();
  });

  it('should display success message after successful submission', () => {
    // Fill form with valid data
    component.userForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      dob: new Date(),
      address: '123 Main St',
      country: 'USA'
    });
    
    component.onSubmit();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.success-message')).toBeTruthy();
    expect(compiled.querySelector('.success-icon').textContent).toContain('check_circle');
  });

  it('should not display success message when form is invalid', () => {
    component.onSubmit();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.success-message')).toBeFalsy();
  });
});