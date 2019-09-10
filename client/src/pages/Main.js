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
    numberInputs: [{ Count_AllTime: { $between: [0, 5173828] } }],
    numberDropdownClassesA: [],
    numberDropdownClassesB: [],
    showResults: 20,
    moreResults: 100,
    totalCount: -1,
    sort: "Most - Least Popular",
    sortDisplay: "All Time",
    sortExtra: "AllTime",
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

  componentDidMount() {
    let male = false;
    let female = false;
    let lettersArr = [];
    let genderArr = [];
    let letterInputClass = [];
    let letterDropdownClass = [];
    let letterError = [];
    let letterRow = [0];
    const { savedQuery } = this.props.match.params;
    let savedQueryEncode = encodeURI(savedQuery);
    let savedQueryDecode = decodeURI(savedQueryEncode);
    if (savedQuery) {
      let fields = savedQueryDecode.split("&");
      let letters = fields[0].split(",");
      for (let i = 0; i < letters.length; i++) {
        if (letters[i]) {
          letterRow[i] = i;
          if (letters[i][0] !== "!") {
            lettersArr[i] = { $like: letters[i] };
          } else {
            lettersArr[i] = { $notlike: letters[i] };
          }
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
        genderArr = ["B"];
      } else if (fields[1] === "MF") {
        male = true;
        female = true;
        genderArr = ["M", "F"];
      }
      let numbers = [];
      if (fields[4]) {
        let numbersArr = fields[4];
        numbers = JSON.parse(numbersArr);
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
      let letterArrLen = lettersArr.length - 1;
      if (!lettersArr) {
        letterArrLen = 0;
      }
      let sortDD = "Most - Least Popular";
      if (
        JSON.parse(fields[6])[0][0] === "Name" &&
        JSON.parse(fields[6])[0][1] === "ASC"
      ) {
        sortDD = "A - Z";
      } else if (
        JSON.parse(fields[6])[0][0] === "Name" &&
        JSON.parse(fields[6])[0][1] === "DESC"
      ) {
        sortDD = "Z - A";
      } else if (JSON.parse(fields[6])[0][0] === "RAND") {
        sortDD = "Random";
      } else if (
        (JSON.parse(fields[6])[0][0].split("_")[0] === "Count" &&
          JSON.parse(fields[6])[0][1] === "ASC") ||
        (JSON.parse(fields[6])[0][0].split("_")[0] === "Rank" &&
          JSON.parse(fields[6])[0][1] === "DESC")
      ) {
        sortDD = "Least - Most Popular";
      }
      let sortDisp = Object.getOwnPropertyNames(numbers[0])[0].split("_")[1];
      let display = "All Time";
      if (sortDisp !== "AllTime") {
        display = `${sortDisp.split("x")[0]}0s`;
      }
      this.setState({
        male: male,
        female: female,
        minLength: parseInt(fields[2]),
        maxLength: parseInt(fields[3]),
        letterrows: letterRow,
        letterInputs: lettersArr,
        letterRowLength: letterArrLen,
        letterDropdownClasses: letterDropdownClass,
        letterInputClasses: letterInputClass,
        letterErrorMessage: letterError,
        numberInputs: numbers,
        numberRowLength: numbers.length,
        numberrows: numberRow,
        numberDropdownClassesA: numDD,
        numberDropdownClassesB: numDD,
        numberErrorMessage: numErr,
        moreResults: parseInt(fields[5]),
        sort: sortDD,
        sortExtra: sortDisp,
        sortDisplay: display
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
    //let index = this.state.letterRowLength + 1;
    let index = this.state.letterrows.length;
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
    //let index = this.state.numberRowLength + 1;
    let index = this.state.numberrows.length;
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
    let sortDisp = Object.getOwnPropertyNames(newArray[0])[0].split("_")[1];
    let display = "All Time";
    if (sortDisp !== "AllTime") {
      display = `${sortDisp.split("x")[0]}0s`;
    }
    this.setState({
      numberInputs: newArray,
      sortExtra: sortDisp,
      sortDisplay: display
    });
  };

  checkErroroneousInputs = () => {
    let submit = true;
    let errorArray = [];
    let letterInput = this.state.letterInputs;
    //let letterRow = this.state.letterrows;
    let nullRows = [];
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
            this.state.letterInputs[i].$like === "%Letter(s)%" ||
            this.state.letterInputs[i].$like === "Letter(s)%" ||
            this.state.letterInputs[i].$like === "%Letter(s)")
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
      } else {
        nullRows.push(i);
      }
      //check for 2 of the same inputs, or 2 begins withs, or 2 ends with, or starts with/ends with/contains string and does not start with/end with/contain string
      if (i + 1 < this.state.letterInputs.length) {
        let iString = this.state.letterInputs[i][
          Object.getOwnPropertyNames(this.state.letterInputs[i])[0]
        ];
        let antiString = "";
        let startString = "";
        let endString = "";
        let dncString = "";
        if (iString.includes("!")) {
          antiString = iString.replace(/!/g, "");
          if (iString[1] === "%" && iString.substr(-1) === "%") {
            startString = antiString.replace(/%/g, "") + "%";
            endString = "%" + antiString.replace(/%/g, "");
          }
        } else {
          antiString = "!" + iString;
          dncString = "!%" + iString.replace(/%/g, "") + "%";
        }
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
                ][0] !== "%" &&
                this.state.letterInputs[i][
                  Object.getOwnPropertyNames(this.state.letterInputs[i])[0]
                ][0] !== "!" &&
                this.state.letterInputs[j][
                  Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                ][0] !== "!") ||
              (this.state.letterInputs[i][
                Object.getOwnPropertyNames(this.state.letterInputs[i])[0]
              ].substr(-1) !== "%" &&
                this.state.letterInputs[j][
                  Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                ].substr(-1) !== "%") ||
              antiString ===
                this.state.letterInputs[j][
                  Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                ] ||
              (startString &&
                this.state.letterInputs[j][
                  Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                ] === startString) ||
              (endString &&
                this.state.letterInputs[j][
                  Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                ] === endString) ||
              (dncString &&
                this.state.letterInputs[j][
                  Object.getOwnPropertyNames(this.state.letterInputs[j])[0]
                ] === dncString)
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
    for (let i = nullRows.length - 1; i >= 0; i--) {
      letterInput.splice(nullRows[i], 1);
      //letterRow.splice(nullRows[i], 1);
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
      letterInputs: letterInput,
      //letterrows: letterRow,
      numberDropdownClassesA: dropdownA,
      numberDropdownClassesB: dropdownB,
      numberErrorMessage: numberError,
      moreResults: 100,
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
      this.handleSubmit(20, 100);
    }
    errorArray = [];
  };

  handleSubmit = (results, moreResults) => {
    this.setState({ showResults: results });
    let sortOn = "id";
    if (this.state.numberInputs[0]) {
      sortOn = Object.getOwnPropertyNames(this.state.numberInputs[0])[0];
    }
    let sortQuery = [[sortOn, "ASC"]];
    if (this.state.sort === "A - Z") {
      sortQuery = [["Name", "ASC"]];
    } else if (this.state.sort === "Z - A") {
      sortQuery = [["Name", "DESC"]];
    } else if (this.state.sort === "Most - Least Popular") {
      if (sortOn.split("_")[0] === "Count") {
        sortQuery = [[sortOn, "DESC"]];
        if (sortOn.split("_")[1] !== this.state.sortExtra) {
          sortQuery = [[`Count_${this.state.sortExtra}`, "DESC"]];
        }
      } else if (sortOn.split("_")[0] === "Rank") {
        sortQuery = [[sortOn, "ASC"]];
        if (sortOn.split("_")[1] !== this.state.sortExtra) {
          sortQuery = [[`Rank_${this.state.sortExtra}`, "ASC"]];
        }
      } else {
        sortQuery = [["id", "ASC"]];
      }
    } else if (this.state.sort === "Least - Most Popular") {
      if (sortOn.split("_")[0] === "Count") {
        sortQuery = [[sortOn, "ASC"]];
        if (sortOn.split("_")[1] !== this.state.sortExtra) {
          sortQuery = [[`Count_${this.state.sortExtra}`, "ASC"]];
        }
      } else if (sortOn.split("_")[0] === "Rank") {
        sortQuery = [[sortOn, "DESC"]];
        if (sortOn.split("_")[1] !== this.state.sortExtra) {
          sortQuery = [[`Rank_${this.state.sortExtra}`, "DESC"]];
        }
      } else {
        sortQuery = [["id", "DESC"]];
      }
    } else if (this.state.sort === "Random") {
      sortQuery = [["RAND", Math.floor(Math.random() * 1000)]];
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
      if (this.state.letterInputs[i].$like) {
        queryLetter += this.state.letterInputs[i].$like;
      } else {
        queryLetter += this.state.letterInputs[i].$notlike;
      }
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
            isLoading: true,
            seed: query.seed
          });
        } else {
          this.setState({
            totalCount: res.data.count,
            results: res.data.rows,
            isLoading: false,
            seed: query.seed
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
    if (newCount >= this.state.moreResults) {
      this.increaseResults();
    }
    this.setState({ showResults: newCount, isLoading: load });
  };

  increaseResults = () => {
    let newCount = this.state.moreResults + 100;
    this.handleSubmit(newCount - 80, newCount);
    this.setState({ moreResults: newCount });
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
    // let newInputClasses = this.state.letterInputClasses;
    // newInputClasses.splice(realIndex, 1);
    // let newErrorMessage = this.state.letterErrorMessage;
    // newErrorMessage.splice(realIndex, 1);
    // let newDropdownClasses = this.state.letterDropdownClasses;
    // newDropdownClasses.splice(realIndex, 1);
    let newArray = this.state.letterInputs;
    newArray.splice(realIndex, 1);
    let newRows = this.state.letterrows;
    //newRows.splice(realIndex, 1);
    newRows.pop();
    for (let i = 0; i < newRows.length; i++) {
      newRows[i] = i;
    }
    this.setState({
      //letterDropdownClasses: newDropdownClasses,
      //letterErrorMessage: newErrorMessage,
      //letterInputClasses: newInputClasses,
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
    //newRows.splice(realIndex, 1);
    newRows.pop();
    for (let i = 0; i < newRows.length; i++) {
      newRows[i] = i;
    }
    let sortDisp = Object.getOwnPropertyNames(newArray[0])[0].split("_")[1];
    let display = "All Time";
    if (sortDisp !== "AllTime") {
      display = `${sortDisp.split("x")[0]}0s`;
    }
    this.setState({
      numberInputs: newArray,
      numberrows: newRows,
      sortExtra: sortDisp,
      sortDisplay: display
    });
    //this.handleSubmit(20, this.state.moreResults);
  };

  updateDropdownOptions = (input, evt) => {
    evt.preventDefault();
    this.setState({ sort: input });
  };

  updateDropdownOptionsTwo = (input, evt) => {
    evt.preventDefault();
    let display = "All Time";
    if (input !== "AllTime") {
      display = `${input.split("x")[0]}0s`;
    }
    this.setState({ sortDisplay: display, sortExtra: input });
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

  clearLetterBorders = r => {
    let letterDropdownClasses = [];
    let letterInputClasses = [];
    let letterErrorMessage = [];
    let letterInputs = [];
    this.setState({
      letterDropdownClasses: letterDropdownClasses,
      letterInputClasses: letterInputClasses,
      letterErrorMessage: letterErrorMessage,
      letterInputs: letterInputs
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
                nth={r}
                className={r}
                inputs={
                  this.state.letterInputs[r] && this.state.letterInputs[r].$like
                    ? this.state.letterInputs[r].$like
                    : this.state.letterInputs[r] &&
                      this.state.letterInputs[r].$notlike
                    ? this.state.letterInputs[r].$notlike
                    : "Letter(s)"
                }
                errorMessage={this.state.letterErrorMessage[r]}
                inputClass={this.state.letterInputClasses[r]}
                dropdownClass={this.state.letterDropdownClasses[r]}
                appendOutput={this.grabLetterInput}
                removeLetterRow={this.removeLetterRow}
                updateModal={this.updateModal}
                first={this.state.letterrows[0]}
                length={this.state.letterrows.length}
                clearBorders={this.clearLetterBorders}
              />
            ))}
          </div>
          <div className="col-md-8 px-0">
            {this.state.numberrows.map(r => (
              <NumberForm
                key={r}
                nth={r}
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
                first={this.state.numberrows[0]}
                length={this.state.numberrows.length}
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
            <form className="form-inline">
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
                  <button
                    className="dropdown-item"
                    href="#"
                    onClick={e => this.updateDropdownOptions("Random", e)}
                  >
                    Random
                  </button>
                </div>
              </div>
              {this.state.sort === "Most - Least Popular" ||
              this.state.sort === "Least - Most Popular" ? (
                <div>
                  <button
                    className={`btn btn-secondary dropdown-toggle px-1`}
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {this.state.sortDisplay}
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("AllTime", e)}
                    >
                      All Time
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("188x", e)}
                    >
                      1880s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("189x", e)}
                    >
                      1890s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("190x", e)}
                    >
                      1900s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("191x", e)}
                    >
                      1910s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("192x", e)}
                    >
                      1920s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("193x", e)}
                    >
                      1930s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("194x", e)}
                    >
                      1940s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("195x", e)}
                    >
                      1950s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("196x", e)}
                    >
                      1960s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("197x", e)}
                    >
                      1970s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("198x", e)}
                    >
                      1980s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("199x", e)}
                    >
                      1990s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("200x", e)}
                    >
                      2000s
                    </button>
                    <button
                      className="dropdown-item"
                      href="#"
                      onClick={e => this.updateDropdownOptionsTwo("201x", e)}
                    >
                      2010s
                    </button>
                  </div>
                </div>
              ) : (
                <div />
              )}
            </form>
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
