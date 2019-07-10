import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import Main from "./pages/Main";
import About from "./pages/About";
import Example from "./pages/Example";
import ErrorPage from "./pages/ErrorPage";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Wrapper>
        <Header />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/about" component={About} />
            <Route exact path="/example" component={Example} />
            <Route path="/:savedQuery" component={Main} />
            <Route component={ErrorPage} />
          </Switch>
        </BrowserRouter>
      </Wrapper>
    );
  }
}

export default App;
