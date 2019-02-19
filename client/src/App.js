import React, { Component } from "react";
import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import Form from "./components/Form";
import "./App.css";

class App extends Component {
  state = {
    rows: ["input-0"]
  }

  handleClick = () => {
    let rows = this.state.rows;
    let index = rows.length;
    rows.push(`input-${index}`);
    this.setState({ rows: rows });
  }

  handleSubmit = () => {
    console.log("HERE");
  }

  render() {
    return (
      <Wrapper>
        <Header />
        {this.state.rows.map((r) => (
          <Form key={r} id={r} />))}


        <div className="form-check form-check-inline addOn">
          <label>
            Male
          <input type="checkbox" className="form-check-input" id="male" value="male" />
          </label>
          <label>
            Female
          <input type="checkbox" className="form-check-input" id="female" value="female" />
          </label>
        </div>
        <div className="addOn">
          <a href="#" onClick={this.handleClick}>+ More Search Terms</a><button type="button" className="btn btn-secondary" onClick={this.handleSubmit}>Submit</button>
        </div>

      </Wrapper>
    );
  }
}

export default App;
