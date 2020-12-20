# firebase + React の Udemy 講座

できたの  
https://react-firebase-hosting-d3d3b.web.app/

## 初期設定

```
npm init react-app firebase-react-hosting
cd firebase-react-hosting
npm startgt
```

## firebase

管理画面からプロジェクトを作って以下のコマンドでアプリケーションを紐づける

### CLI で Firebase にログイン

```
firebase login
```

### Firebase をセットアップ

```
firebase init
```

### デプロイ

デプロイ前にビルドする  
URL が発行される  
https://react-firebase-hosting-d3d3b.web.app/

```
npm run build
firebase deploy
```

## TODO 作成

### props パターン

親コンポーネントでステータスをローカルで保持し、それを操作する関数などを定義して子コンポーネントに Props として渡す  
これだとコンポーネントが深くなった時とかにバケツリレーが大変になる

#### サンプル

```
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'reactstrap';

import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const App = () => {
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
    <div className="App">
      <Container>
        <h1 className="mt-4">TODOリスト</h1>
        <TodoForm addTodo={addTodo} />
        <TodoList todos={todos} completeTodo={completeTodo} removeTodo={removeTodo} />
      </Container>
    </div>
  );
}

export default App;
```

```
import React, { useState } from 'react'
import { Form, InputGroup, Input, InputGroupAddon, Button } from 'reactstrap';

const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(value);
    setValue('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Input type="text" value={value} onChange={e => setValue(e.target.value)} />
        <InputGroupAddon addonType="append">
          <Button type="submit" color="primary">追加</Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};

export default TodoForm;
```

```
import React from 'react';
import { Button, Table } from 'reactstrap';

const TodoList = ({ todos, completeTodo, removeTodo }) => {
  return (
    <Table>
      <tbody>
        {todos && todos.map((todo, index) => (
          <tr key={index}>
            <th className="text-left" style={{ textDecoration: todo.complete ? 'line-through' : '' }}>{todo.text}</th>
            <td className="text-right">
              <Button
                className="mr-2"
                color={todo.complete ? "secondary" : "success"}
                onClick={() => completeTodo(index)}
              >
                {todo.complete ? '完了' : '未完了'}
              </Button>
              <Button color="danger" onClick={() => removeTodo(index)}>削除</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TodoList;
```

### Context パターン（グローバルステート）

React16.3 で追加された ContextAPI を使う  
ステータスを Context 内に実装することで、これが Store の代わりになり、コンポーネントから直接触ることができる

ポイントは 2 つ

- 使いたいコンポーネントを ContextProvider で囲むこと
- 使いたいコンポーネント内では useContext を使うこと

#### createContext

`Contextオブジェクト`を作るために使う  
作ったオブジェクトは export で外から import できるようにすること  
Context オブジェクトには Provider が付属していて、このプロバイダーで子コンポーネントを囲むことでコンポーネントないから値が参照できる  
プロバイダーから渡した値を使う関数のことをコンシューマーコンポーネントと呼ぶ（プロバイダーで挟まれるコンポーネントのこと）

```
import React, { createContext, useState } from 'react';
export const TodosContext = createContext();
```

#### ContextProvider

こんな感じで Context オブジェクトの Provider を呼び出して props.children としてコンシューマーコンポーネントを受け取れるようにする

```
  return (
    <TodosContext.Provider>
      {props.children}
    </TodosContext.Provider>
  );
```

value プロパティに値を渡すとコンシューマーコンポーネントから扱えるようになる

```
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
```

```
import TodosContextProvider from './contexts/TodosContext';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const App = () => {
  return (
    <div className="App">
      <Container>
        <h1 className="mt-4">TODOリスト</h1>
        <TodosContextProvider>
          <TodoForm /> // コンシューマーコンポーネント
          <TodoList /> // コンシューマーコンポーネント
        </TodosContextProvider>
      </Container>
    </div>
  );
}
```

#### useContext

コンシューマーコンポーネント側で値を使う時は useContext を使う  
useContext で使う Context オブジェクトを渡すと value に設定した値を使うことができるようになる

```
import React, { useState, useContext } from 'react'
import { TodosContext } from '../contexts/TodosContext';

const TodoForm = () => {
  const { addTodo } = useContext(TodosContext);
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(value);
    setValue('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Input type="text" value={value} onChange={e => setValue(e.target.value)} />
        <InputGroupAddon addonType="append">
          <Button type="submit" color="primary">追加</Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};
```

#### サンプル

```
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
```

```
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'reactstrap';

import TodosContextProvider from './contexts/TodosContext';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const App = () => {
  return (
    <div className="App">
      <Container>
        <h1 className="mt-4">TODOリスト</h1>
        <TodosContextProvider>
          <TodoForm />
          <TodoList />
        </TodosContextProvider>
      </Container>
    </div>
  );
}

export default App;
```

```
import React, { useState, useContext } from 'react'
import { TodosContext } from '../contexts/TodosContext';
import { Form, InputGroup, Input, InputGroupAddon, Button } from 'reactstrap';

const TodoForm = () => {
  const { addTodo } = useContext(TodosContext);
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(value);
    setValue('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Input type="text" value={value} onChange={e => setValue(e.target.value)} />
        <InputGroupAddon addonType="append">
          <Button type="submit" color="primary">追加</Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};

export default TodoForm;
```

```
import React, { useContext } from 'react';
import { TodosContext } from '../contexts/TodosContext';
import { Button, Table } from 'reactstrap';

const TodoList = () => {
  const { todos, completeTodo, removeTodo } = useContext(TodosContext);
  return (
    <Table>
      <tbody>
        {todos && todos.map((todo, index) => (
          <tr key={index}>
            <th className="text-left" style={{ textDecoration: todo.complete ? 'line-through' : '' }}>{todo.text}</th>
            <td className="text-right">
              <Button
                className="mr-2"
                color={todo.complete ? "secondary" : "success"}
                onClick={() => completeTodo(index)}
              >
                {todo.complete ? '完了' : '未完了'}
              </Button>
              <Button color="danger" onClick={() => removeTodo(index)}>削除</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TodoList;
```
