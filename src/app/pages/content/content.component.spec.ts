import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentComponent } from './content.component';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  // Mock DarkModeService
  const mockDarkModeService = {
    darkMode: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentComponent],
      providers: [
        { provide: DarkModeService, useValue: mockDarkModeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject DarkModeService via constructor', () => {
    expect(component.darkModeService).toBeDefined();
    expect(component.darkModeService).toBe(mockDarkModeService);
  });

  it('should have darkModeService as public property', () => {
    expect(component.darkModeService).toBe(mockDarkModeService);
  });
});