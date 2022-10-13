import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodos } from '../api/todos';
import { Todo } from '../types/Todo';

interface Props{
  todos: Todo[],
  setTodos: (v: Todo[]) => void,
  setVisibleTodos: (v: Todo[] | null) => void,

}
export const TodoFooter: React.FC<Props> = (props) => {
  const { todos, setTodos, setVisibleTodos } = props;
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filter = ['All', 'Active', 'Completed'];
  const completedTodos = [...todos].filter(todo => todo.completed);

  const clearCompleted = () => {
    const filteredTodos = [...todos].filter(todo => !todo.completed);

    completedTodos.forEach(todo => deleteTodos(todo.id));
    setTodos(filteredTodos);
  };

  const filterBy = (option: string) => {
    const filteringTodos = [...todos];

    setSelectedFilter(option);

    const filteredTodos = filteringTodos.filter(todo => {
      switch (option) {
        case 'Active':
          return todo.completed === false;
        case 'Completed':
          return todo.completed === true;
        default:
          return todo;
      }
    });

    if (option === 'All') {
      setVisibleTodos(null);
    } else {
      setVisibleTodos(filteredTodos);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filter.map(item => {
          return (
            <a
              data-cy={`FilterLink${item}`}
              key={item}
              href={`#/${selectedFilter === 'All' ? '' : selectedFilter.toLowerCase()}`}
              className={classNames(
                'filter__link', (selectedFilter === item && 'selected'),
              )}
              onClick={() => filterBy(item)}
            >
              {item}
            </a>
          );
        })}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
