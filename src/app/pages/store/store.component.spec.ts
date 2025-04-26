import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreComponent } from './store.component';
import { TodoStore } from './ng/todos.store';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';
import { By } from '@angular/platform-browser';

// Mock TodoStore
class MockTodoStore {
  addTodo = jest.fn();
}

// Mock DarkModeService
class MockDarkModeService {
  // Add mock methods if needed
}

describe('StoreComponent', () => {
  let component: StoreComponent;
  let fixture: ComponentFixture<StoreComponent>;
  let mockTodoStore: MockTodoStore;
  let mockDarkModeService: MockDarkModeService;

  beforeEach(async () => {
    mockTodoStore = new MockTodoStore();
    mockDarkModeService = new MockDarkModeService();

    await TestBed.configureTestingModule({
      declarations: [StoreComponent],
      providers: [
        { provide: TodoStore, useValue: mockTodoStore },
        { provide: DarkModeService, useValue: mockDarkModeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchTerm as empty string', () => {
    expect(component.searchTerm).toBe('');
  });

  it('should initialize newTodoTitle as empty string', () => {
    expect(component.newTodoTitle).toBe('');
  });

  it('should have TodoStore injected', () => {
    expect(component.store).toBe(mockTodoStore);
  });

  it('should have DarkModeService injected', () => {
    expect(component.darkModeService).toBe(mockDarkModeService);
  });

  describe('submitNewTodo', () => {
    it('should call addTodo with trimmed title when newTodoTitle is valid', () => {
      component.newTodoTitle = 'New Task  ';
      component.submitNewTodo();

      expect(mockTodoStore.addTodo).toHaveBeenCalledWith('New Task');
      expect(mockTodoStore.addTodo).toHaveBeenCalledTimes(1);
    });

    it('should reset newTodoTitle after adding a todo', () => {
      component.newTodoTitle = 'New Task';
      component.submitNewTodo();

      expect(component.newTodoTitle).toBe('');
    });

    it('should not call addTodo when newTodoTitle is empty', () => {
      component.newTodoTitle = '';
      component.submitNewTodo();

      expect(mockTodoStore.addTodo).not.toHaveBeenCalled();
    });

    it('should not call addTodo when newTodoTitle is only whitespace', () => {
      component.newTodoTitle = '   ';
      component.submitNewTodo();

      expect(mockTodoStore.addTodo).not.toHaveBeenCalled();
    });

    it('should log the todo title to console', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      component.newTodoTitle = 'Test Task';
      component.submitNewTodo();

      expect(consoleSpy).toHaveBeenCalledWith('Adding todo:', 'Test Task');
      consoleSpy.mockRestore();
    });
  });

  describe('template', () => {
    it('should render a button with "Add" text', () => {
      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      expect(button.textContent).toContain('Add');
    });

    it('should call submitNewTodo when the button is clicked', () => {
      const submitSpy = jest.spyOn(component, 'submitNewTodo');
      const button = fixture.debugElement.query(By.css('button')).nativeElement;

      button.click();
      expect(submitSpy).toHaveBeenCalled();

      submitSpy.mockRestore();
    });
  });
});