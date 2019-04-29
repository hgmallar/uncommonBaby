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
    totalCount: -1,
    sort: "Most - Least Popular",
    letterErrorMessage: [],
    numberErrorMessage: []
  };

  handleClickLetter = () => {
    let rows = this.state.letterrows;
    let index = this.state.letterRowLength + 1;
    rows.push(index);
    this.setState({ letterrows: rows, letterRowLength: index });
  };

  grabLetterInput = (index, output) => {
    let newArray = this.state.letterInputs;
    newArray[this.state.letterrows.length - 1] = output;
    console.log(this.state.letterrows.length - 1);
    console.log(this.state.letterrows);
    this.setState({ letterInputs: newArray });
  };

  handleClickNumber = () => {
    let rows = this.state.numberrows;
    let index = this.state.numberRowLength + 1;
    rows.push(index);
    this.setState({ numberrows: rows, numberRowLength: index });
  };

  grabNumberInput = (index, output) => {
    let newArray = this.state.numberInputs;
    newArray[this.state.numberrows.length - 1] = output;
    console.log(newArray);
    this.setState({ numberInputs: newArray });
  };

  checkErroroneousInputs = () => {
    let submit = true;
    let errorArray = [];
    let letterInputClasses = this.state.letterInputClasses;
    let letterDropdowns = this.state.letterDropdownClasses;
    let letterError = this.state.letterErrorMessage;
    let dropdownA = this.state.numberDropdownClassesA;
    let dropdownB = this.state.numberDropdownClassesB;
    let numberError = this.state.numberErrorMessage;
    //loop through letterInputs
    for (let i = 0; i < this.state.letterInputs.length; i++) {
      if (this.state.letterInputs[i]) {
        if (
          this.state.letterInputs[i].$like === "%%" ||
          this.state.letterInputs[i].$like === "%"
        ) {
          //change border of letter-input-#
          submit = false;
          letterInputClasses[this.state.letterrows[i]] = "red-border";
          letterDropdowns[this.state.letterrows[i]] = "no-border";
          letterError[this.state.letterrows[i]] = "*Input a value.*";
        } else if (this.state.letterInputs[i] === "string") {
          //change border of dropdown-toggle-#
          submit = false;
          letterInputClasses[this.state.letterrows[i]] = "no-border";
          letterDropdowns[this.state.letterrows[i]] = "red-border";
          letterError[this.state.letterrows[i]] = "*Make a selection.*";
        } else {
          letterInputClasses[this.state.letterrows[i]] = "no-border";
          letterDropdowns[this.state.letterrows[i]] = "no-border";
          letterError[this.state.letterrows[i]] = "";
        }
      }
    }
    //loop through numberInputs
    for (let i = 0; i < this.state.numberInputs.length; i++) {
      if (this.state.numberInputs[i]) {
        console.log(Object.getOwnPropertyNames(this.state.numberInputs[i])[0]);
        if (
          Object.getOwnPropertyNames(this.state.numberInputs[i]).length === 0
        ) {
          submit = false;
          dropdownB[this.state.numberrows[i]] = "red-border";
          numberError[this.state.numberrows[i]] = "*Make a selection.*";
        } else if (
          Object.getOwnPropertyNames(this.state.numberInputs[i])[0] ===
            "Rank_Year(s)" ||
          Object.getOwnPropertyNames(this.state.numberInputs[i])[0] ===
            "Count_Year(s)" ||
          Object.getOwnPropertyNames(this.state.numberInputs[i])[0] ===
            "Percentile_Year(s)"
        ) {
          submit = false;
          dropdownA[this.state.numberrows[i]] = "red-border";
          numberError[this.state.numberrows[i]] = "*Make a selection.*";
        } else {
          dropdownA[this.state.numberrows[i]] = "no-border";
          dropdownB[this.state.numberrows[i]] = "no-border";
          numberError[this.state.numberrows[i]] = "";
        }
      }
      //check for 2 of the same inputs
      if (i + 1 < this.state.numberInputs.length) {
        for (let j = i + 1; j < this.state.numberInputs.length; j++) {
          if (this.state.numberInputs[i] && this.state.numberInputs[j]) {
            console.log(
              Object.getOwnPropertyNames(this.state.numberInputs[i])[0]
            );
            console.log(
              Object.getOwnPropertyNames(this.state.numberInputs[j])[0]
            );
            if (
              Object.getOwnPropertyNames(this.state.numberInputs[i])[0] ===
                Object.getOwnPropertyNames(this.state.numberInputs[j])[0] &&
              Object.getOwnPropertyNames(this.state.numberInputs[i])[0]
            ) {
              errorArray.push(this.state.numberrows[i]);
              errorArray.push(this.state.numberrows[j]);
              submit = false;
            }
          }
        }
      }
      console.log(errorArray);
      if (errorArray) {
        for (let k = 0; k < errorArray.length; k++) {
          dropdownA[errorArray[k]] = "red-border";
          dropdownB[errorArray[k]] = "red-border";
          numberError[errorArray[k]] = "*Make a selection.*";
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
      letterInputClasses: letterInputClasses,
      letterDropdownClasses: letterDropdowns,
      letterErrorMessage: letterError,
      numberDropdownClassesA: dropdownA,
      numberDropdownClassesB: dropdownB,
      numberErrorMessage: numberError,
      results: newResults,
      totalCount: count,
      isLoading: submit
    });
    if (submit) {
      for (let l = 0; l < this.state.numberInputs.length; l++) {
        dropdownA[l] = "no-border";
        dropdownB[l] = "no-border";
        numberError[l] = "";
      }
      this.handleSubmit(20, this.state.moreResults);
    }
    errorArray = [];
  };

  handleSubmit = (results, moreResults) => {
    this.setState({ showResults: results });
    let sortQuery = [["id", "ASC"]];
    if (this.state.sort === "A - Z") {
      sortQuery = [["Name", "ASC"]];
    } else if (this.state.sort === "Z - A") {
      sortQuery = [["Name", "DESC"]];
    } else if (this.state.sort === "Most - Least Popular") {
      sortQuery = [["id", "ASC"]];
    } else if (this.state.sort === "Least - Most Popular") {
      sortQuery = [["id", "DESC"]];
    }
    let lettersArr = this.state.letterInputs;
    let query = {
      letters: lettersArr,
      gender: { $in: ["F", "M"] },
      numbers: this.state.numberInputs,
      limit: moreResults,
      sort: sortQuery
    };
    if (this.state.female && !this.state.male) {
      query = {
        letters: lettersArr,
        gender: "F",
        numbers: this.state.numberInputs,
        limit: moreResults,
        sort: sortQuery
      };
    } else if (!this.state.female && this.state.male) {
      query = {
        letters: lettersArr,
        gender: "M",
        numbers: this.state.numberInputs,
        limit: moreResults,
        sort: sortQuery
      };
    }
    console.log(query);
    API.findNames(query)
      .then(res => {
        console.log(res.data.count);
        console.log(res.data);
        if (res.data.count >= 20) {
          this.setState({
            totalCount: res.data.count,
            results: res.data.rows,
            isLoading: true
          });
        } else {
          this.setState({
            totalCount: res.data.count,
            results: res.data.rows,
            isLoading: false
          });
        }
      })
      .catch(err => {
        console.log("find names error: ");
        console.log(err);
      });
  };

  increaseCount = () => {
    let newCount = this.state.showResults + 20;
    let load = this.state.isLoading;
    if (newCount >= this.state.totalCount) {
      load = false;
    }
    this.setState({ showResults: newCount, isLoading: load });
  };

  increaseResults = () => {
    let newCount = this.state.moreResults + 100;
    this.setState({ moreResults: newCount });
    this.handleSubmit(newCount - 80, newCount);
  };

  updateLoad = () => {
    this.setState({ isLoading: false });
  };

  removeLetterRow = index => {
    let realIndex = index;
    for (let j=0; j < this.state.letterrows.length; j++) {
      if (this.state.letterrows[j] === index) {
        realIndex = j;
      }
    }
    let newArray = this.state.letterInputs;
    newArray.splice(realIndex, 1);
    let newRows = this.state.letterrows;
    newRows.splice(realIndex, 1);
    this.setState({
      letterInputs: newArray,
      letterrows: newRows
    });
    //this.handleSubmit(20, this.state.moreResults);
  };

  removeNumberRow = index => {
    let realIndex = index;
    for (let i = 0; i < this.state.numberrows.length; i++) {
      if (this.state.numberrows[i] === index) {
        realIndex = i;
      }
    }
    let newArray = this.state.numberInputs;
    newArray.splice(realIndex, 1);
    let newRows = this.state.numberrows;
    newRows.splice(realIndex, 1);
    this.setState({
      numberInputs: newArray,
      numberrows: newRows
    });
    //this.handleSubmit(20, this.state.moreResults);
  };

  updateDropdownOptions = (input, evt) => {
    evt.preventDefault();
    this.setState({ sort: input });
  };

  render() {
    return (
      <Wrapper>
        <Header />
        <h4 className="subhead text-center col-12">
          A tool to find names based on popularity
        </h4>

        <div className="form-check form-check-inline row justify-content-center col-12 mx-0 px-0 text-center">
          <label>
            Male
            <input
              type="checkbox"
              onChange={e => this.setState({ male: !this.state.male })}
              checked={this.state.male}
            />
          </label>
          <label>
            Female
            <input
              type="checkbox"
              onChange={e => this.setState({ female: !this.state.female })}
              checked={this.state.female}
            />
          </label>
        </div>

        <div className="text-center row justify-content-center mx-auto">
          <div className="col-md-4 px-0">
            {this.state.letterrows.map(r => (
              <LetterForm
                key={r}
                className={r}
                errorMessage={this.state.letterErrorMessage[r]}
                inputClass={this.state.letterInputClasses[r]}
                dropdownClass={this.state.letterDropdownClasses[r]}
                appendOutput={this.grabLetterInput}
                removeLetterRow={this.removeLetterRow}
              />
            ))}
          </div>
          <div className="col-md-8 px-0">
            {this.state.numberrows.map(r => (
              <NumberForm
                key={r}
                className={r}
                errorMessage={this.state.numberErrorMessage[r]}
                dropdownClassA={this.state.numberDropdownClassesA[r]}
                dropdownClassB={this.state.numberDropdownClassesB[r]}
                appendOutput={this.grabNumberInput}
                male={this.state.male}
                female={this.state.female}
                removeNumberRow={this.removeNumberRow}
              />
            ))}
          </div>
        </div>

        <div className="text-center white-text row justify-content-center mx-auto">
          <button
            className="link-button col-md-4"
            onClick={this.handleClickLetter}
          >
            + More Letter Search Terms
          </button>
          <button
            className="link-button col-md-8"
            onClick={this.handleClickNumber}
          >
            + More Number Search Terms
          </button>
        </div>

        <div className="row justify-content-center col-12 mx-auto">
          <button
            type="button"
            className="btn btn-secondary ml-0 px-1"
            onClick={e => this.checkErroroneousInputs()}
          >
            Submit
          </button>
          {this.state.totalCount < 0 ? (
            <h4> </h4>
          ) : (
            <h4 className="ml-2 my-auto text-white">
              {" "}
              {this.state.totalCount}
            </h4>
          )}
          {this.state.totalCount <= 1 ? (
            <h4> </h4>
          ) : (
            <div>
              <button
                className={`btn btn-secondary dropdown-toggle px-1`}
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.sort}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateDropdownOptions("A - Z", e)}
                >
                  A - Z
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateDropdownOptions("Z - A", e)}
                >
                  Z - A
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e =>
                    this.updateDropdownOptions("Most - Least Popular", e)
                  }
                >
                  Most - Least Popular
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e =>
                    this.updateDropdownOptions("Least - Most Popular", e)
                  }
                >
                  Least - Most Popular
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="row justify-content-center col-12 mx-auto">
          <List
            results={this.state.results}
            total={this.state.totalCount}
            count={this.state.showResults}
            increaseCount={this.increaseCount}
            increaseResults={this.increaseResults}
            updateLoad={this.updateLoad}
            loading={this.state.isLoading}
          />
        </div>
      </Wrapper>
    );
  }
}

export default App;
