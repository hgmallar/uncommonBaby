import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import About from "./pages/About";
import Example from "./pages/Example";
import Contact from "./pages/Contact";
import ErrorPage from "./pages/ErrorPage";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Wrapper>
        <Header />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route
              exact
              path="/name"
              render={(props) => (
                <Main {...props} nameReq={true} countReq={false} />
              )}
            />
            <Route
              exact
              path="/popularity"
              render={(props) => (
                <Main {...props} nameReq={false} countReq={true} />
              )}
            />
            <Route
              exact
              path="/advanced"
              render={(props) => (
                <Main {...props} nameReq={true} countReq={true} />
              )}
            />
            <Route exact path="/about" component={About} />
            <Route exact path="/example" component={Example} />
            <Route exact path="/contact" component={Contact} />
            <Route
              path="/:savedQuery"
              render={(props) => (
                <Main
                  {...props}
                />
              )}
            />
            <Route component={ErrorPage} />
          </Switch>
        </BrowserRouter>
      </Wrapper>
    );
  }
}

export default App;
