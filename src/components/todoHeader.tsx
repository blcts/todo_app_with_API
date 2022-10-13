/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useState } from 'react';
import { addTodos, editTodo } from '../api/todos';
import { NewTodo, Todo } from '../types/Todo';
import { User } from '../types/User';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  query: string,
  setQuery: (v:string) => void,
  user: User,
  setTodos: CallableFunction,
  todos: Todo[],
  setIsError:(v:boolean) => void,
  setErrorMessage: (v: string) => void
  setIsLoading: (v:boolean) => void,

}

export const TodoHeader: React.FC<Props> = (props) => {
  const {
    newTodoField,
    query,
    setQuery,
    user,
    setTodos,
    todos,
    setIsError,
    setErrorMessage,
    setIsLoading,
  } = props;

  const [, setIsAllSame] = useState(false);

  const newTodo: NewTodo = {
    userId: user.id,
    title: query.trim(),
    completed: false,
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    if (newTodo.title.length <= 0) {
      setErrorMessage('rpigejiajh');

      return;
    }

    addTodos(newTodo)
      .then((currentTodo: Todo) => {
        setIsError(false);
        setErrorMessage('');
        setTodos((prev: Todo[]) => ([...prev, currentTodo]));
        setQuery('');
      })
      .catch(() => {
        setIsError(true);
        setErrorMessage('add');
      })
      .finally(() => setIsLoading(false));
  };

  const toggleAll = () => {
    setIsLoading(true);
    const sameTodos = todos.every(todo => todo.completed === todos[0].completed);

    if (sameTodos) {
      setIsAllSame(todos[0].completed);
    }

    setTodos((prev: Todo[]) => {
      return prev.map(todo => {
        const rewrittenTodo = { ...todo };

        if (sameTodos) {
          rewrittenTodo.completed = !todos[0].completed;
        } else {
          rewrittenTodo.completed = true;
        }

        editTodo(todo.id, todo.title, rewrittenTodo.completed);
        setIsAllSame(true);

        return rewrittenTodo;
      });
    });
    setIsLoading(false);
  };

  return (
    <header className="todoapp__header">
      {
        todos.length >= 1
        && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={() => toggleAll()}
          />
        )
      }

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
