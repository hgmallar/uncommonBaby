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
    numberInputs: []
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
    //query API with everything in letterInputs and numberInputs
    let query = {letters: this.state.letterInputs, gender: {$in : ["F", "M"]}, numbers: this.state.numberInputs};
    if (this.state.female && !this.state.male) {
      query = { letters: this.state.letterInputs, gender: "F", numbers: this.state.numberInputs }
    }
    else if (!this.state.female && this.state.male) {
      query = { letters: this.state.letterInputs, gender: "M", numbers: this.state.numberInputs }
    }
    console.log(query)
    API.findNames(query).then(res => {
      console.log(res.data);
      this.setState({ results: res.data });
    }).catch(err => {
      console.log("find names error: ");
      console.log(err);
    });
  }

  render() {
    return (
      <Wrapper>
        <Header />
        <h4 className="subhead text-center">A tool to find names based on popularity</h4>

        <div className="letterRows">
          {this.state.letterrows.map((r) => (
            <LetterForm key={r} className={r} appendOutput={this.grabLetterInput} />))}
        </div>

        <div className="numberRows">
          {this.state.numberrows.map((r) => (
            <NumberForm key={r} className={r} appendOutput={this.grabNumberInput} />))}
        </div>

        <div className="letterAddOn text-center white-text">
          <a to="#" onClick={this.handleClickLetter}>+ More Letter Search Terms</a>
        </div>
        <div className="numberAddOn text-center white-text">
          <a to="#" onClick={this.handleClickNumber}>+ More Number Search Terms</a>
        </div>
        <div className="form-check form-check-inline centerLine">
        
          <label>
            Male
          <input type="checkbox" onChange={e => this.setState({male: !this.state.male})} checked={this.state.male} />
          </label>
          <label>
            Female
          <input type="checkbox" onChange={e => this.setState({female: !this.state.female})} checked={this.state.female} />
          </label>
        </div>
        <div className="centerLine"><button type="button" className="btn btn-secondary" onClick={this.handleSubmit}>Submit</button></div>

        <div className="centerLine">
          <List results={this.state.results}></List>
        </div>
      </Wrapper>
    );
  }
}

export default App;
