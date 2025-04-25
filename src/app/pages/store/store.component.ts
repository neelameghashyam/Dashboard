import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoStore } from './ng/todos.store';
import { FormsModule } from '@angular/forms';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {
  newTodoTitle = '';
  searchTerm = '';
  store = inject(TodoStore);

  constructor(
    public darkModeService: DarkModeService  ){}

  submitNewTodo() {
    if (this.newTodoTitle.trim()) {
      this.store.addTodo(this.newTodoTitle);
      this.newTodoTitle = '';
    }
  }
}