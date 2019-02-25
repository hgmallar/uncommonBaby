import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Main from "./pages/Main";
import ErrorPage from "./pages/ErrorPage";
import "./App.css";

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Main {...props} />} />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;