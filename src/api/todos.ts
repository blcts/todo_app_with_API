import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (newTodo: NewTodo) => {
  return client.post<Todo>('/todos', {
    userId: newTodo.userId,
    title: newTodo.title,
    completed: newTodo.completed,
  });
};

export const editTodo = (
  todoId: number,
  editedTitle?: string,
  editedCompleted?: boolean,
) => {
  return client.patch<Todo[]>(`/todos/${todoId}`, {
    title: editedTitle,
    completed: editedCompleted,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
