import React, { Component } from "react";
import Wrapper from "../components/Wrapper";
import List from "../components/List";
import Header from "../components/Header";
import LetterForm from "../components/LetterForm";
import NumberForm from "../components/NumberForm";
import API from "../utils/API";

class App extends Component {
  state = {
    male: false,
    female: false,
    letterrows: [0],
    numberrows: [0],
    results: [],
    letterInputs: [],
    numberInputs: [],
    showResults: 10,
    displayNoResults: false,
  }

  handleClickLetter = () => {
    let rows = this.state.letterrows;
    let index = rows.length;
    rows.push(index);
    this.setState({ letterrows: rows });
  }

  grabLetterInput = (index, output) => {
    let newArray = this.state.letterInputs;
    newArray[index] = output;
    console.log(newArray);
    this.setState({ letterInputs: newArray });
  }

  handleClickNumber = () => {
    let rows = this.state.numberrows;
    let index = rows.length;
    rows.push(index);
    this.setState({ numberrows: rows });
  }

  grabNumberInput = (index, output) => {
    let newArray = this.state.numberInputs;
    newArray[index] = output;
    console.log(newArray);
    this.setState({ numberInputs: newArray });
  }

  handleSubmit = () => {
    this.setState({ showResults: 10, displayNoResults: false });
    let query = { letters: this.state.letterInputs, gender: { $in: ["F", "M"] }, numbers: this.state.numberInputs };
    if (this.state.female && !this.state.male) {
      query = { letters: this.state.letterInputs, gender: "F", numbers: this.state.numberInputs }
    }
    else if (!this.state.female && this.state.male) {
      query = { letters: this.state.letterInputs, gender: "M", numbers: this.state.numberInputs }
    }
    console.log(query)
    API.findNames(query).then(res => {
      console.log(res.data);
      if (res.data.length) {
        this.setState({ results: res.data });
      }
      else {
        this.setState({ results: res.data, displayNoResults: true });
      }

    }).catch(err => {
      console.log("find names error: ");
      console.log(err);
    });
  }

  increaseCount = () => {
    let newCount = this.state.showResults + 10;
    this.setState({ showResults: newCount });
  }

  render() {
    return (
      <Wrapper>
        <Header />
        <h4 className="subhead text-center col-12">A tool to find names based on popularity</h4>

        <div className="text-center row justify-content-center">
          <div className="col-md-4">
            {this.state.letterrows.map((r) => (
              <LetterForm key={r} className={r} appendOutput={this.grabLetterInput} />))}
          </div>
          <div className="col-md-6">
            {this.state.numberrows.map((r) => (
              <NumberForm key={r} className={r} appendOutput={this.grabNumberInput} />))}
          </div>
        </div>

        <div className="text-center white-text row justify-content-center">
          <button className="link-button col-md-4" onClick={this.handleClickLetter}>+ More Letter Search Terms</button>
          <button className="link-button col-md-6" onClick={this.handleClickNumber}>+ More Number Search Terms</button>
        </div>
        <div className="form-check form-check-inline row justify-content-center col-12">

          <label>
            Male
          <input type="checkbox" onChange={e => this.setState({ male: !this.state.male })} checked={this.state.male} />
          </label>
          <label>
            Female
          <input type="checkbox" onChange={e => this.setState({ female: !this.state.female })} checked={this.state.female} />
          </label>
        </div>
        <div className="row justify-content-center col-12"><button type="button" className="btn btn-secondary" onClick={this.handleSubmit}>Submit</button></div>

        <div className="row justify-content-center col-12">
          {(this.state.displayNoResults) ? <h4>No results found!</h4> : <h4></h4>}
          <List results={this.state.results} count={this.state.showResults} increaseCount={this.increaseCount}></List>
        </div>
      </Wrapper>
    );
  }
}

export default App;
