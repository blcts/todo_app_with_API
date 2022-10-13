import React, { FormEvent, useEffect, useRef } from 'react';
import { editTodo } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props {
  setIsLoading:(v:boolean) => void,
  openedTodoId: number | null,
  editedTitle: string,
  todos: Todo[],
  setTodos: CallableFunction,
  setIsEditorOpen: (v:boolean) => void,
  setEditedTitle: (v:string) => void
}

export const EditForm: React.FC<Props> = (props) => {
  const {
    setIsLoading,
    openedTodoId,
    editedTitle,
    todos,
    setTodos,
    setIsEditorOpen,
    setEditedTitle,
  } = props;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const editHandler = (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();

    if (openedTodoId) {
      editTodo(openedTodoId, editedTitle);
      const editedTodo = todos.find(todo => todo.id === openedTodoId);

      if (editedTodo) {
        editedTodo.title = editedTitle;
      }

      setTodos(todos.map(todo => (todo.id === openedTodoId
        ? editedTodo
        : todo
      )));
    }

    setIsEditorOpen(false);
    setIsLoading(false);
  };

  return (
    <form onSubmit={editHandler}>
      <input
        ref={ref}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        onChange={(event) => setEditedTitle(event.target.value)}
      />
    </form>
  );
};
