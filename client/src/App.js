import React, { Component } from "react";
import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import LetterForm from "./components/LetterForm";
import NumberForm from "./components/NumberForm";
import "./App.css";

class App extends Component {
  state = {
    letterrows: ["input-0"],
    numberrows: ["input-0"],
  }

  handleClickLetter = () => {
    let rows = this.state.letterrows;
    let index = rows.length;
    rows.push(`input-${index}`);
    this.setState({ letterrows: rows });
  }

  handleClickNumber = () => {
    let rows = this.state.numberrows;
    let index = rows.length;
    rows.push(`input-${index}`);
    this.setState({ numberrows: rows });
  }

  handleSubmit = () => {
    console.log("HERE");
  }

  render() {
    return (
      <Wrapper>
        <Header />
        <h4 className="subhead text-center">A tool to find names based on popularity</h4>

        <div className="letterRows">
          {this.state.letterrows.map((r) => (
            <LetterForm key={r} id={r} />))}
        </div>

        <div className="numberRows">
          {this.state.numberrows.map((r) => (
            <NumberForm key={r} id={r} />))}
        </div>

        <div className="letterAddOn text-center white-text">
          <a to="#" onClick={this.handleClickLetter}>+ More Letter Search Terms</a>
        </div>
        <div className="numberAddOn text-center white-text">
          <a to="#" onClick={this.handleClickNumber}>+ More Number Search Terms</a>
        </div>
        <div className="form-check form-check-inline fullLine">
          <label>
            Male
          <input type="checkbox" className="form-check-input" id="male" value="male" />
          </label>
          <label>
            Female
          <input type="checkbox" className="form-check-input" id="female" value="female" />
          </label>
        </div>
        <div className="fullLine"><button type="button" className="btn btn-secondary" onClick={this.handleSubmit}>Submit</button></div>
      </Wrapper>
    );
  }
}

export default App;
