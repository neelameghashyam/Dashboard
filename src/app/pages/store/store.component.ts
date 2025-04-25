import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoStore } from './ng/todos.store';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from '../../services/dark-theme/dark-mode.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {
  searchTerm = '';
  store = inject(TodoStore);
  newTodoTitle = ''; 

  constructor(public darkModeService: DarkModeService) {}

  
    submitNewTodo() {
      if (this.newTodoTitle.trim()) {  // Add .trim() to check for empty strings
        console.log('Adding todo:', this.newTodoTitle);  // Better logging
        this.store.addTodo(this.newTodoTitle.trim());
        this.newTodoTitle = '';
      }
  }
}