import {
    signalStore,
    withState,
    withComputed,
    withMethods,
    patchState,
    withHooks,
  } from '@ngrx/signals';
  import { TodoItem } from './todos.model';
  import { computed, inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { catchError, of, tap } from 'rxjs';
  
  const STORAGE_KEY = 'ng_todos';
  
  type TodoState = {
    todos: TodoItem[];
    filter: 'all' | 'active' | 'completed';
    loading: boolean;
    error: string | null;
  };
  
  const initialState: TodoState = {
    todos: [],
    filter: 'all',
    loading: false,
    error: null,
  };
  
  export const TodoStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ todos, filter }) => ({
      completedTodos: computed(() => todos().filter(t => t.completed)),
      activeTodos: computed(() => todos().filter(t => !t.completed)),
      filteredTodos: computed(() => {
        switch (filter()) {
          case 'active': return todos().filter(t => !t.completed);
          case 'completed': return todos().filter(t => t.completed);
          default: return todos();
        }
      }),
    })),
    withMethods((store, http = inject(HttpClient)) => {
        const saveToLocalStorage = () => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(store.todos()));
        };
      
        return {
          loadTodos() {
            patchState(store, { loading: true, error: null });
      
            return http.get<TodoItem[]>('https://jsonplaceholder.typicode.com/todos?userId=1')
              .pipe(
                catchError(err => {
                  console.error('API error, using localStorage', err);
                  const localTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                  return of(localTodos);
                }),
                tap(todos => {
                  patchState(store, {
                    todos,
                    loading: false
                  });
                })
              );
          },
      
          addTodo(title: string) {
            const newTodo: TodoItem = {
              id: Date.now().toString(),
              title,
              completed: false
            };
      
            patchState(store, { loading: true });
      
            return http.post('https://jsonplaceholder.typicode.com/todos', newTodo)
              .pipe(
                catchError(err => {
                  console.error('Add todo failed', err);
                  return of(null);
                }),
                tap(() => {
                  const currentTodos = store.todos();
                  patchState(store, {
                    todos: [newTodo, ...currentTodos],
                    loading: false
                  });
                  saveToLocalStorage();
                })
              );
          },
      
          toggleTodo(id: string) {
            const todos = store.todos();
            const updated = todos.map(t =>
              t.id === id ? { ...t, completed: !t.completed } : t
            );
      
            patchState(store, { loading: true });
      
            return http.patch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
              completed: !todos.find(t => t.id === id)?.completed
            }).pipe(
              catchError(err => {
                console.error('Toggle failed', err);
                return of(null);
              }),
              tap(() => {
                patchState(store, {
                  todos: updated,
                  loading: false
                });
                saveToLocalStorage();
              })
            );
          },
      
          changeFilter(filter: 'all' | 'active' | 'completed') {
            patchState(store, { filter });
          }
        };
      }),
    withHooks({
      onInit(store) {
        store.loadTodos().subscribe();
      }
    })
  );
  