/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoFooter } from './components/todoFooter';
import { TodoHeader } from './components/todoHeader';
import { TodoMain } from './components/todoMain';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  let isClosedErrorMessage = false;

  const closeErrorMessage = () => {
    isClosedErrorMessage = true;
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then((todosFromServer) => setTodos(todosFromServer));
    }
  }, [user]);

  return user && (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodoField={newTodoField}
          query={query}
          setQuery={setQuery}
          user={user}
          setTodos={setTodos}
          todos={todos}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
          setIsLoading={setIsLoading}
        />
        <TodoMain
          todos={todos}
          setTodos={setTodos}
          isLoading={isLoading}
          visibleTodos={visibleTodos}
          setIsLoading={setIsLoading}
        />
        {
          todos.length >= 1
          && (
            <TodoFooter
              todos={todos}
              setTodos={setTodos}
              setVisibleTodos={setVisibleTodos}
            />
          )
        }
      </div>

      {isError && (
        <div
          data-cy="ErrorNotification"
          className="
            notification 
            is-danger 
            is-light 
            has-text-weight-normal
          "
          hidden={isClosedErrorMessage}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={closeErrorMessage}
          />

          {`Unable to ${errorMessage} a todo`}

        </div>
      )}
    </div>
  );
};
