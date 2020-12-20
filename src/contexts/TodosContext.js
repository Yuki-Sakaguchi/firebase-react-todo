import React, { createContext, useState } from 'react';

export const TodosContext = createContext();

const TodosContextProvider = (props) => {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    const newTodo = [...todos, { text, complete: false }];
    setTodos(newTodo);
  };

  const removeTodo = (index) => {
    const newTodo = [...todos];
    newTodo.splice(index, 1);
    setTodos(newTodo);
  };

  const completeTodo = (index) => {
    const newTodo = [...todos];
    newTodo[index].complete = true;
    setTodos(newTodo);
  };

  return (
    <TodosContext.Provider value={{todos, addTodo, completeTodo, removeTodo }}>
      {props.children}
    </TodosContext.Provider>
  );
};

export default TodosContextProvider;