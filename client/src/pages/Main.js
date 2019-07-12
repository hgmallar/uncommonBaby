import React, { Component } from "react";
import Wrapper from "../components/Wrapper";
import List from "../components/List";
import LetterForm from "../components/LetterForm";
import NumberForm from "../components/NumberForm";
import Modal from "../components/Modal";
import API from "../utils/API";

class App extends Component {
  state = {
    showModal: false,
    male: false,
    female: false,
    minLength: 1,
    maxLength: 15,
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
    numberErrorMessage: [],
    modalTitle: "",
    modalMessages: [],
    query: "",
    name: "",
    gender: "",
    count: 0,
    rank: 0,
    dataArr1: [],
    dataArr2: []
  };

  componentWillMount() {
    //Encode %25u%25,%25e%25&MF&%5B%7B%22Rank_188x%22:%7B%22$between%22:%5B3,%20500%5D%7D%7D,%7B%22Rank_201x%22:%7B%22$between%22:%5B10,%202000%5D%7D%7D%5D&100&%5B%5B%22id%22,%22ASC%22%5D%5D
    //Decode %u%,%e%&MF&[{"Rank_188x":{"$between":[3, 500]}},{"Rank_201x":{"$between":[10, 2000]}}]&100&[["id","ASC"]]
    //%25u%25,%25e%25&MF&%5B%7B"Rank_188x":%7B"$between":%5B3,%20500%5D%7D%7D,%7B"Rank_201x":%7B"$between":%5B10,%202000%5D%7D%7D%5D&100&%5B%5B"id","ASC"%5D%5D
    //%25u%25,%25e%25&MF&%5B%7B"Rank_188x":%7B"$between":%5B3,%20500%5D%7D%7D,%7B"Rank_201x":%7B"$between":%5B10,%202000%5D%7D%7D%5D
    //%25u%25,%25e%25
    //MF
    //%5B%7B%22Rank_188x%22:%7B%22$between%22:%5B3,%20500%5D%7D%7D,%7B%22Rank_201x%22:%7B%22$between%22:%5B10,%202000%5D%7D%7D%5D
    let male = false;
    let female = false;
    let lettersArr = [];
    let genderArr = [];
    let letterInputClass = [];
    let letterDropdownClass = [];
    let letterError = [];
    let letterRow = [];
    const { savedQuery } = this.props.match.params;
    let savedQueryEncode = encodeURI(savedQuery);
    let savedQueryDecode = decodeURI(savedQueryEncode);
    if (savedQuery) {
      let fields = savedQueryDecode.split("&");
      let letters = fields[0].split(",");
      for (let i = 0; i < letters.length; i++) {
        if (letters[i]) {
          letterRow[i] = i;
          lettersArr[i] = { $like: letters[i] };
          letterInputClass[i] = "no-border";
          letterDropdownClass[i] = "no-border";
          letterError[i] = "";
        }
      }
      if (fields[1] === "M") {
        male = true;
        genderArr = ["M"];
      } else if (fields[1] === "F") {
        female = true;
        genderArr = ["F"];
      } else if (fields[1] === "B") {
        female = true;
        genderArr = ["B"];
      } else if (fields[1] === "MF" || fields[1] === "FM") {
        male = true;
        female = true;
        genderArr = ["M", "F"];
      }
      let numbers = [];
      if (fields[4]) {
        numbers = JSON.parse(fields[4]);
      }
      let numberRow = [];
      let numDD = [];
      let numErr = [];
      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i]) {
          numberRow[i] = i;
          numDD[i] = "no-border";
          numErr[i] = "";
        }
      }
      this.setState({
        male: male,
        female: female,
        minLength: parseInt(fields[2]),
        maxLength: parseInt(fields[3]),
        letterrows: letterRow,
        letterInputs: lettersArr,
        letterRowLength: lettersArr.length - 1,
        letterDropdownClasses: letterDropdownClass,
        letterInputClasses: letterInputClass,
        letterErrorMessage: letterError,
        numberInputs: numbers,
        numberRowLength: numbers.length,
        numberrows: numberRow,
        numberDropdownClassesA: numDD,
        numberDropdownClassesB: numDD,
        numberErrorMessage: numErr,
        moreResults: parseInt(fields[5])
      });
      let query = {
        letters: lettersArr,
        gender: genderArr,
        min: parseInt(fields[2]),
        max: parseInt(fields[3]),
        numbers: numbers,
        limit: parseInt(fields[5]),
        sort: JSON.parse(fields[6])
      };
      console.log(query);
      API.findNames(query)
        .then(res => {
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
    }
  }

  updateModal = type => {
    let title = "Number Options";
    let messages = [
      {
        cat: "Rank",
        message:
          "orders names from most popular, 1, to least popular for a selected time period.  This search returns names whose position is in the inputted range for the selected gender(s) and time period.  (lower rank is more popular)"
      },
      {
        cat: "Count",
        message:
          "is the total number of babies given that name for a selected time period.  This search returns names whose count is in the inputted range for the selected gender(s) and time period.  (higher count is more popular)"
      }
    ];
    if (type === "letter") {
      title = "Letter Options";
      messages = [
        {
          cat: "Contains: ",
          message:
            "Returns only names that contain the letter or string inputted."
        },
        {
          cat: "Starts With: ",
          message:
            "Returns only names that start with the letter or string inputted."
        },
        {
          cat: "Ends With: ",
          message:
            "Returns only names that end with the letter or string inputted."
        }
      ];
    } else if (type === "gender") {
      title = "Gender Options";
      messages = [
        {
          cat: "Selecting Both Genders: ",
          message: "Returns the individual results for each gender."
        },
        {
          cat: "Selecting Neither Gender: ",
          message: "Ignores gender."
        }
      ];
    } else if (type === "charCount") {
      title = "Name Length Options";
      messages = [
        {
          cat: "Min Length: ",
          message:
            "Returns the names with a length greater than or equal to this number."
        },
        {
          cat: "Max Length: ",
          message:
            "Returns the names with a length less than or equal to this number."
        }
      ];
    }
    this.setState({
      showModal: true,
      modalMessages: messages,
      modalTitle: title
    });
  };

  handleClickLetter = () => {
    let rows = this.state.letterrows;
    let index = this.state.letterRowLength + 1;
    rows.push(index);
    this.setState({ letterrows: rows, letterRowLength: index });
  };

  grabLetterInput = (index, output) => {
    let realIndex = index;
    for (let i = 0; i < this.state.letterrows.length; i++) {
      if (index === this.state.letterrows[i]) {
        realIndex = i;
      }
    }
    let newArray = this.state.letterInputs;
    newArray[realIndex] = output;
    this.setState({ letterInputs: newArray });
  };

  handleClickNumber = () => {
    let rows = this.state.numberrows;
    let index = this.state.numberRowLength + 1;
    rows.push(index);
    this.setState({ numberrows: rows, numberRowLength: index });
  };

  grabNumberInput = (index, output) => {
    let realIndex = index;
    for (let i = 0; i < this.state.numberrows.length; i++) {
      if (index === this.state.numberrows[i]) {
        realIndex = i;
      }
    }
    let newArray = this.state.numberInputs;
    newArray[realIndex] = output;
    this.setState({ numberInputs: newArray });
  };

  checkErroroneousInputs = () => {
    let submit = true;
    let errorArray = [];
    let letterInputClass = this.state.letterInputClasses;
    let letterDropdowns = this.state.letterDropdownClasses;
    let letterError = this.state.letterErrorMessage;
    let dropdownA = this.state.numberDropdownClassesA;
    let dropdownB = this.state.numberDropdownClassesB;
    let numberError = this.state.numberErrorMessage;
    //loop through letterInputs
    for (let i = 0; i < this.state.letterInputs.length; i++) {
      if (this.state.letterInputs[i]) {
        if (
          this.state.letterInputs[i].$like &&
          (this.state.letterInputs[i].$like === "%%" ||
            this.state.letterInputs[i].$like === "%" ||
            this.state.letterInputs[i].$like === "%Letter(s)%")
        ) {
          //change border of letter-input-#
          submit = false;
          let index = this.state.letterrows[i];
          letterDropdowns[index] = "no-border";
          letterInputClass[index] = "red-border";
          letterError[index] = "*Input a value.*";
        } else if (this.state.letterInputs[i] === "string") {
          //change border of dropdown-toggle-#
          submit = false;
          letterInputClass[this.state.letterrows[i]] = "no-border";
          letterDropdowns[this.state.letterrows[i]] = "red-border";
          letterError[this.state.letterrows[i]] = "*Make a selection.*";
        } else {
          letterInputClass[this.state.letterrows[i]] = "no-border";
          letterDropdowns[this.state.letterrows[i]] = "no-border";
          letterError[this.state.letterrows[i]] = "";
        }
      }
      //check for 2 of the same inputs, or 2 begins withs, or 2 ends with
      if (i + 1 < this.state.letterInputs.length) {
        for (let j = i + 1; j < this.state.letterInputs.length; j++) {
          if (
            this.state.letterInputs[i] &&
            this.state.letterInputs[j] &&
            this.state.letterInputs[j][
              Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
            ][0] !== "%Letter(s)%" &&
            this.state.letterInputs[j] !== "string"
          ) {
            if (
              (Object.getOwnPropertyNames(this.state.letterInputs[i])[0] ===
                Object.getOwnPropertyNames(this.state.letterInputs[j])[0] &&
                this.state.letterInputs[i][
                  Object.getOwnPropertyNames(this.state.letterInputs[i])[0]
                ] ===
                  this.state.letterInputs[j][
                    Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                  ]) ||
              (this.state.letterInputs[i][
                Object.getOwnPropertyNames(this.state.letterInputs[i])[0]
              ][0] !== "%" &&
                this.state.letterInputs[j][
                  Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                ][0] !== "%") ||
              (this.state.letterInputs[i][
                Object.getOwnPropertyNames(this.state.letterInputs[i])[0]
              ].substr(-1) !== "%" &&
                this.state.letterInputs[j][
                  Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                ].substr(-1) !== "%")
            ) {
              errorArray.push(this.state.letterrows[i]);
              errorArray.push(this.state.letterrows[j]);
              submit = false;
            }
          }
        }
      }
      if (errorArray) {
        for (let k = 0; k < errorArray.length; k++) {
          letterInputClass[errorArray[k]] = "red-border";
          letterDropdowns[errorArray[k]] = "red-border";
          letterError[errorArray[k]] = "*Incorrect Input.*";
        }
      }
    }

    //loop through numberInputs
    errorArray = [];
    for (let i = 0; i < this.state.numberInputs.length; i++) {
      if (this.state.numberInputs[i]) {
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
            "Count_Year(s)"
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
      letterInputClasses: letterInputClass,
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
    let queryGender = "B";
    let lettersArr = this.state.letterInputs;
    let query = {
      letters: lettersArr,
      gender: ["B"],
      min: this.state.minLength,
      max: this.state.maxLength,
      numbers: this.state.numberInputs,
      limit: moreResults,
      sort: sortQuery
    };
    if (this.state.female && !this.state.male) {
      query = {
        letters: lettersArr,
        gender: ["F"],
        min: this.state.minLength,
        max: this.state.maxLength,
        numbers: this.state.numberInputs,
        limit: moreResults,
        sort: sortQuery
      };
      queryGender = "F";
    } else if (!this.state.female && this.state.male) {
      query = {
        letters: lettersArr,
        gender: ["M"],
        min: this.state.minLength,
        max: this.state.maxLength,
        numbers: this.state.numberInputs,
        limit: moreResults,
        sort: sortQuery
      };
      queryGender = "M";
    } else if (this.state.female && this.state.male) {
      query = {
        letters: lettersArr,
        gender: ["F", "M"],
        min: this.state.minLength,
        max: this.state.maxLength,
        numbers: this.state.numberInputs,
        limit: moreResults,
        sort: sortQuery
      };
      queryGender = "MF";
    }
    let queryLetter = "";
    for (let i = 0; i < this.state.letterInputs.length; i++) {
      queryLetter += this.state.letterInputs[i].$like;
      queryLetter += ",";
    }
    let queryLink =
      queryLetter +
      "&" +
      queryGender +
      "&" +
      this.state.minLength +
      "&" +
      this.state.maxLength +
      "&" +
      JSON.stringify(this.state.numberInputs) +
      "&" +
      moreResults +
      "&" +
      JSON.stringify(sortQuery);
    queryLink = encodeURI(queryLink);
    this.props.history.push("/" + encodeURI(queryLink));
    API.findNames(query)
      .then(res => {
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
    for (let j = 0; j < this.state.letterrows.length; j++) {
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

  nameClicked = (name, gender, evt) => {
    evt.preventDefault();
    this.setState({ showModal: true });
    let query = {
      name: name,
      gender: gender
    };
    API.findName(query)
      .then(res => {
        console.log("found name");
        console.log(res.data);
        this.setState({
          name: res.data[0].Name,
          gender: res.data[0].Gender,
          count: res.data[0].Count_AllTime,
          rank: res.data[0].Rank_AllTime,
          dataArr1: [
            res.data[0].Count_188x,
            res.data[0].Count_189x,
            res.data[0].Count_190x,
            res.data[0].Count_191x,
            res.data[0].Count_192x,
            res.data[0].Count_193x,
            res.data[0].Count_194x,
            res.data[0].Count_195x,
            res.data[0].Count_196x,
            res.data[0].Count_197x,
            res.data[0].Count_198x,
            res.data[0].Count_199x,
            res.data[0].Count_200x,
            res.data[0].Count_201x
          ],
          dataArr2: [
            res.data[0].Rank_188x,
            res.data[0].Rank_189x,
            res.data[0].Rank_190x,
            res.data[0].Rank_191x,
            res.data[0].Rank_192x,
            res.data[0].Rank_193x,
            res.data[0].Rank_194x,
            res.data[0].Rank_195x,
            res.data[0].Rank_196x,
            res.data[0].Rank_197x,
            res.data[0].Rank_198x,
            res.data[0].Rank_199x,
            res.data[0].Rank_200x,
            res.data[0].Rank_201x
          ]
        });
      })
      .catch(err => {
        console.log("find name error: ");
        console.log(err);
      });
  };

  handleClose = () => {
    this.setState({
      showModal: false,
      dataArr1: [],
      dataArr2: [],
      modalTitle: "",
      modalMessages: [],
      name: "",
      gender: "",
      count: 0,
      rank: 0
    });
  };

  render() {
    return (
      <Wrapper>
        <form className="justify-content-center mx-0 px-0 text-center align-items-center">
          <div className="row mr-0 justify-content-center mx-auto">
            <div className="form-inline form-check form-check-inline mb-2 col-md-5">
              <label className="my-0">
                Male
                <input
                  className="my-0"
                  type="checkbox"
                  onChange={e => this.setState({ male: !this.state.male })}
                  checked={this.state.male}
                />
              </label>
              <label className="my-0">
                Female
                <input
                  className="my-0"
                  type="checkbox"
                  onChange={e => this.setState({ female: !this.state.female })}
                  checked={this.state.female}
                />
              </label>
              <sup className="mx-0">
                <button type="button" className="info text-white mx-0">
                  <i
                    className="fas fa-info-circle"
                    onClick={() => this.updateModal("gender")}
                  />
                </button>
              </sup>
            </div>
            <div className="form-inline col-md-5 mt-xs-2 mt-md-0">
              <div className="form-group ml-1">
                <label className="mb-0 mx-auto">Min Length</label>
                <input
                  className="form-control form-control-sm mx-auto my-0 number"
                  type="number"
                  min="1"
                  max={this.state.maxLength}
                  placeholder={this.state.minLength}
                  onChange={e =>
                    this.setState({ minLength: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="form-group ml-1">
                <label className="mb-0 mx-auto">Max Length</label>
                <input
                  className="form-control form-control-sm mx-auto my-0 number"
                  type="number"
                  min={this.state.minLength}
                  max="15"
                  placeholder={this.state.maxLength}
                  onChange={e =>
                    this.setState({ maxLength: parseInt(e.target.value) })
                  }
                />
              </div>
              <sup className="mx-0">
                <button type="button" className="info text-white mx-0">
                  <i
                    className="fas fa-info-circle"
                    onClick={() => this.updateModal("charCount")}
                  />
                </button>
              </sup>
            </div>
          </div>
        </form>
        <div className="text-center row justify-content-center mx-auto">
          <div className="col-md-4 px-0">
            {this.state.letterrows.map(r => (
              <LetterForm
                key={r}
                className={r}
                inputs={
                  this.state.letterInputs[r]
                    ? this.state.letterInputs[r].$like
                    : "Letter(s)"
                }
                errorMessage={this.state.letterErrorMessage[r]}
                inputClass={this.state.letterInputClasses[r]}
                dropdownClass={this.state.letterDropdownClasses[r]}
                appendOutput={this.grabLetterInput}
                removeLetterRow={this.removeLetterRow}
                updateModal={this.updateModal}
                nth={r}
              />
            ))}
          </div>
          <div className="col-md-8 px-0">
            {this.state.numberrows.map(r => (
              <NumberForm
                key={r}
                className={r}
                inputs={this.state.numberInputs[r]}
                errorMessage={this.state.numberErrorMessage[r]}
                dropdownClassA={this.state.numberDropdownClassesA[r]}
                dropdownClassB={this.state.numberDropdownClassesB[r]}
                appendOutput={this.grabNumberInput}
                male={this.state.male}
                female={this.state.female}
                removeNumberRow={this.removeNumberRow}
                updateModal={this.updateModal}
                nth={r}
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
            className="btn btn-secondary px-1 submit"
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
            nameClicked={this.nameClicked}
          />
        </div>
        <Modal
          show={this.state.showModal}
          handleClose={this.handleClose}
          title={this.state.modalTitle}
          messages={this.state.modalMessages}
          name={this.state.name}
          gender={this.state.gender}
          count={this.state.count}
          rank={this.state.rank}
          totalCount={this.state.totalCount}
          dataArr1={this.state.dataArr1}
          dataArr2={this.state.dataArr2}
        />
      </Wrapper>
    );
  }
}

export default App;
