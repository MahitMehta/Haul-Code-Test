import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";

// Redux 

import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import userDataReducer from "./Reducers/userDataReducer"; 

function App() {
  const allReducers = combineReducers({
      userData: userDataReducer,
  });

  const store = createStore(allReducers);

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" component={Home}/>
          <Redirect to="/" />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
