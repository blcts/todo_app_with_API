import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodos, editTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { EditForm } from './EditForm';
import { Loader } from './Loader';

interface Props {
  todos: Todo[]
  setTodos: CallableFunction
  isLoading: boolean,
  visibleTodos: Todo[] | null,
  setIsLoading: (v:boolean) => void,
}

export const TodoMain: React.FC<Props> = (props) => {
  const {
    todos,
    setTodos,
    isLoading,
    visibleTodos,
    setIsLoading,
  } = props;

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [openedTodoId, setOpenedTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const toggler = (todoId: number) => {
    setIsLoading(true);
    setOpenedTodoId(todoId);
    const changedTodo = todos.find(todo => todoId === todo.id);
    const newTodo = { ...changedTodo };
    const todoTitle = changedTodo?.title;

    if (changedTodo) {
      newTodo.completed = !changedTodo.completed;

      editTodo(todoId, todoTitle, newTodo.completed);
    }

    setTodos((prevTodos: Todo[]) => prevTodos.map(todo => {
      if (todo.id === newTodo.id) {
        return newTodo;
      }

      return todo;
    }));
    setIsLoading(false);
  };

  const onDelete = (todoId: number) => {
    deleteTodos(todoId);
    setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== todoId));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {(visibleTodos || todos).map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                toggler(todo.id);
              }}
            />
          </label>
          {
            isEditorOpen && todo.id === openedTodoId
              ? (
                <EditForm
                  editedTitle={editedTitle}
                  setIsLoading={setIsLoading}
                  openedTodoId={openedTodoId}
                  todos={todos}
                  setTodos={setTodos}
                  setIsEditorOpen={setIsEditorOpen}
                  setEditedTitle={setEditedTitle}
                />
              )
              : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setIsEditorOpen(true);
                    setOpenedTodoId(todo.id);
                    setEditedTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>
              )
          }

          {isLoading && todo.id === openedTodoId && <Loader />}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              onDelete(todo.id);
            }}
          >
            ×
          </button>

        </div>
      ))}
    </section>
  );
};
