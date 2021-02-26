import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Dashboard from './dashboard';
import CreateTodo from './forms/create-todo';
import AddSubtask from './forms/add-subtask';
import EditTask from './editTask';
import TodoTaskPage from './todoTask/todoTaskPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          
          <Route exact path="/">
            <Dashboard />
          </Route>

          <Route path="/new-todo">
            <CreateTodo />
          </Route>

          <Route path="/task/:taskId">
            <TodoTaskPage />
          </Route>

          <Route path="/edit-task">
            <EditTask />
          </Route>

          <Route path="/add-subtask/:parentTempId">
            <AddSubtask />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
