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
    isLoading: false,
    letterrows: [0],
    numberrows: [0],
    letterRowLength: 0,
    numberRowLength: 0,
    results: [],
    letterInputs: [],
    letterInputClasses: [],
    letterDropdownClasses: [],
    numberInputs: [],
    numberDropdownClassesA: [],
    numberDropdownClassesB: [],
    showResults: 20,
    moreResults: 100,
    totalCount: -1
  }

  handleClickLetter = () => {
    let rows = this.state.letterrows;
    let index = this.state.letterRowLength + 1;
    rows.push(index);
    this.setState({ letterrows: rows, letterRowLength: index });
  }

  grabLetterInput = (index, output) => {
    let newArray = this.state.letterInputs;
    newArray[index] = output;
    console.log(newArray);
    this.setState({ letterInputs: newArray });
  }

  handleClickNumber = () => {
    let rows = this.state.numberrows;
    let index = this.state.numberRowLength + 1;
    rows.push(index);
    this.setState({ numberrows: rows, numberRowLength: index });
  }

  grabNumberInput = (index, output) => {
    let newArray = this.state.numberInputs;
    newArray[index] = output;
    console.log(newArray);
    this.setState({ numberInputs: newArray });
  }

  checkErroroneousInputs = () => {
    let submit = true;
    let letterInputs = this.state.letterInputClasses;
    let letterDropdowns = this.state.letterDropdownClasses;
    let dropdownA = this.state.numberDropdownClassesA;
    let dropdownB = this.state.numberDropdownClassesB;
    //loop through letterInputs
    for (let i = 0; i < this.state.letterInputs.length; i++) {
      console.log(this.state.letterInputs[i]);
      if ((this.state.letterInputs[i].$like === "%%") || (this.state.letterInputs[i].$like === "%")) {
        //change border of letter-input-#
        submit = false;
        letterInputs[i] = "red-border";
        letterDropdowns[i] = "no-border";
      }
      else if ((this.state.letterInputs[i] === "")) {
        //change border of dropdown-toggle-#
        submit = false;
        letterInputs[i] = "no-border";
        letterDropdowns[i] = "red-border";
      }
      else {
        letterInputs[i] = "no-border";
        letterDropdowns[i] = "no-border";
      }
    }
    //loop through numberInputs
    for (let i = 0; i < this.state.numberInputs.length; i++) {
      if (this.state.numberInputs[i]) {
        if (Object.getOwnPropertyNames(this.state.numberInputs[i]).length === 0) {
          submit = false;
          dropdownB[i] = "red-border";
        }
        else {
          dropdownA[i] = "no-border";
          dropdownB[i] = "no-border";
        }
      }
    }
    let newResults = this.state.results;
    let count = this.state.totalCount;
    if (!submit) {
      newResults = [];
      count = "";
    }
    this.setState({
      letterInputClasses: letterInputs,
      letterDropdownClasses: letterDropdowns,
      numberDropdownClassesA: dropdownA,
      numberDropdownClassesB: dropdownB, 
      results: newResults,
      totalCount: count
    });
    if (submit) {
      this.handleSubmit(20, this.state.moreResults);
    }
  }

  handleSubmit = (results, moreResults) => {
    this.setState({ showResults: results });
    let query = { letters: this.state.letterInputs, gender: { $in: ["F", "M"] }, numbers: this.state.numberInputs, limit: moreResults };
    if (this.state.female && !this.state.male) {
      query = { letters: this.state.letterInputs, gender: "F", numbers: this.state.numberInputs, limit: moreResults }
    }
    else if (!this.state.female && this.state.male) {
      query = { letters: this.state.letterInputs, gender: "M", numbers: this.state.numberInputs, limit: moreResults }
    }
    console.log(query)
    API.findNames(query).then(res => {
      console.log(res.data.count);
      if (res.data.count) {
        this.setState({ totalCount: res.data.count, results: res.data.rows, isLoading: true });
      }
      else {
        this.setState({ totalCount: res.data.count, results: res.data.rows });
      }
    }).catch(err => {
      console.log("find names error: ");
      console.log(err);
    });
  }

  increaseCount = () => {
    let newCount = this.state.showResults + 20;
    this.setState({ showResults: newCount });
  }

  increaseResults = () => {
    let newCount = this.state.moreResults + 100;
    this.setState({ moreResults: newCount });
    this.handleSubmit(newCount - 80, newCount);
  }

  updateLoad = () => {
    this.setState({ isLoading: false });
  }

  removeLetterRow = (index) => {
    let newArray = this.state.letterInputs;
    newArray[index] = { $like: "%%" };
    let newRows = this.state.letterrows;
    for (let i = 0; i < newRows.length; i++) {
      if (newRows[i] === index) {
        newRows.splice(i, 1);
      }
    }
    this.setState({ letterInputs: newArray, letterrows: newRows });
    this.handleSubmit(20, this.state.moreResults);
  }

  removeNumberRow = (index) => {
    let newArray = this.state.numberInputs;
    newArray.splice(index, 1);
    let newRows = this.state.numberrows;
    for (let i = 0; i < newRows.length; i++) {
      if (newRows[i] === index) {
        newRows.splice(i, 1);
      }
    }
    this.setState({ numberInputs: newArray, numberrows: newRows });
    this.handleSubmit(20, this.state.moreResults);
  }

  render() {
    return (
      <Wrapper>
        <Header />
        <h4 className="subhead text-center col-12">A tool to find names based on popularity</h4>

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

        <div className="text-center row justify-content-center">
          <div className="col-md-4">
            {this.state.letterrows.map((r) => (
              <LetterForm key={r} className={r} inputClass={this.state.letterInputClasses[r]} dropdownClass={this.state.letterDropdownClasses[r]} appendOutput={this.grabLetterInput} removeLetterRow={this.removeLetterRow} />))}
          </div>
          <div className="col-md-8">
            {this.state.numberrows.map((r) => (
              <NumberForm key={r} className={r} dropdownClassA={this.state.numberDropdownClassesA[r]} dropdownClassB={this.state.numberDropdownClassesB[r]} appendOutput={this.grabNumberInput} male={this.state.male} female={this.state.female} removeNumberRow={this.removeNumberRow} />))}
          </div>
        </div>

        <div className="text-center white-text row justify-content-center">
          <button className="link-button col-md-4" onClick={this.handleClickLetter}>+ More Letter Search Terms</button>
          <button className="link-button col-md-8" onClick={this.handleClickNumber}>+ More Number Search Terms</button>
        </div>

        <div className="row justify-content-center col-12">
          <button type="button" className="btn btn-secondary my-auto" onClick={e => this.checkErroroneousInputs()}>Submit</button>
          {(this.state.totalCount < 0) ? (<h4> </h4>) : (<h4 className="ml-2 my-auto text-white"> {this.state.totalCount}</h4>)}
        </div>

        <div className="row justify-content-center col-12">
          <List results={this.state.results} total={this.state.totalCount} count={this.state.showResults} increaseCount={this.increaseCount} increaseResults={this.increaseResults} updateLoad={this.updateLoad} loading={this.state.isLoading}></List>
        </div>

      </Wrapper>
    );
  }
}

export default App;
