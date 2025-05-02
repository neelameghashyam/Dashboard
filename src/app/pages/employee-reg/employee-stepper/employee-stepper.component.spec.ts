import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeStepperComponent } from './employee-stepper.component';

describe('EmployeeStepperComponent', () => {
  let component: EmployeeStepperComponent;
  let fixture: ComponentFixture<EmployeeStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
