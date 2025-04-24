import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TodoStore } from './ngx-store/todos.store';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent {
  store = inject(TodoStore);
  newTodo = '';

  addTodo() {
    const title = this.newTodo.trim();
    if (title) {
      this.store.addTodo(title).subscribe({
        next: () => this.newTodo = '',
        error: () => this.newTodo = '' // Reset even on error
      });
    }
  }
}
