import React, { Component } from "react";
import Wrapper from "../components/Wrapper";
import List from "../components/List";
import LetterForm from "../components/LetterForm";
import NumberForm from "../components/NumberForm";
import Modal from "../components/Modal";
import API from "../utils/API";
import { CopyToClipboard } from "react-copy-to-clipboard";

import myData from "../components/NumberForm/max_values_full.json";

class App extends Component {
  state = {
    showModal: false,
    male: false,
    female: false,
    minLength: 1,
    maxLength: 15,
    isLoading: false,
    results: [],
    letterInputs: ["Letter(s)"],
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
    dataArr2: [],
    sortArray: [
      {
        id: 0,
        value: "AllTime",
        label: "All Time",
      },
      {
        id: 1,
        value: "188x",
        label: "1880s",
      },
      {
        id: 2,
        value: "189x",
        label: "1890s",
      },
      {
        id: 3,
        value: "190x",
        label: "1900s",
      },
      {
        id: 4,
        value: "191x",
        label: "1910s",
      },
      {
        id: 5,
        value: "192x",
        label: "1920s",
      },
      {
        id: 6,
        value: "193x",
        label: "1930s",
      },
      {
        id: 7,
        value: "194x",
        label: "1940s",
      },
      {
        id: 8,
        value: "195x",
        label: "1950s",
      },
      {
        id: 9,
        value: "196x",
        label: "1960s",
      },
      {
        id: 10,
        value: "197x",
        label: "1970s",
      },
      {
        id: 11,
        value: "198x",
        label: "1980s",
      },
      {
        id: 12,
        value: "199x",
        label: "1990s",
      },
      {
        id: 13,
        value: "200x",
        label: "2000s",
      },
      {
        id: 14,
        value: "201x",
        label: "2010s",
      },
    ],
    sortOptsArray: [
      {
        id: 0,
        value: "A - Z",
      },
      {
        id: 1,
        value: "Z - A",
      },
      {
        id: 2,
        value: "Most - Least Popular",
      },
      {
        id: 3,
        value: "Least - Most Popular",
      },
      {
        id: 4,
        value: "Random",
      },
    ],
  };

  componentDidMount() {
    let male = false;
    let female = false;
    let lettersArr = [];
    let genderArr = [];
    let letterInputClass = [];
    let letterDropdownClass = [];
    let letterError = [];
    const { savedQuery } = this.props.match.params;
    console.log(savedQuery);
    let savedQueryEncode = encodeURI(savedQuery);
    console.log(savedQueryEncode);
    let savedQueryDecode = decodeURI(savedQueryEncode);
    if (savedQuery) {
      let fields = savedQueryDecode.split("&");
      let letters = fields[0].split(",");
      for (let i = 0; i < letters.length; i++) {
        if (letters[i]) {
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
      let numDD = [];
      let numErr = [];
      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i]) {
          numDD[i] = "no-border";
          numErr[i] = "";
        }
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
        letterInputs: lettersArr,
        letterDropdownClasses: letterDropdownClass,
        letterInputClasses: letterInputClass,
        letterErrorMessage: letterError,
        numberInputs: numbers,
        numberDropdownClassesA: numDD,
        numberDropdownClassesB: numDD,
        numberErrorMessage: numErr,
        moreResults: parseInt(fields[5]),
        sort: sortDD,
        sortExtra: sortDisp,
        sortDisplay: display,
        query: `https://www.unpopularbaby.com/${savedQueryEncode}`,
      });
      let query = {
        letters: lettersArr,
        gender: genderArr,
        min: parseInt(fields[2]),
        max: parseInt(fields[3]),
        numbers: numbers,
        limit: parseInt(fields[5]),
        sort: JSON.parse(fields[6]),
      };
      API.findNames(query)
        .then((res) => {
          if (res.data.count >= 20) {
            this.setState({
              totalCount: res.data.count,
              results: res.data.rows,
              isLoading: true,
            });
          } else {
            this.setState({
              totalCount: res.data.count,
              results: res.data.rows,
              isLoading: false,
            });
          }
        })
        .catch((err) => {
          console.log("find names error: ");
          console.log(err);
        });
    }
  }

  updateModal = (type) => {
    let title = "Number Options";
    let messages = [
      {
        cat: "Rank",
        message:
          "orders names from most popular, 1, to least popular for a selected time period.  This search returns names whose position is in the inputted range for the selected gender(s) and time period.  (lower rank is more popular)",
      },
      {
        cat: "Count",
        message:
          "is the total number of babies given that name for a selected time period.  This search returns names whose count is in the inputted range for the selected gender(s) and time period.  (higher count is more popular)",
      },
    ];
    if (type === "letter") {
      title = "Letter Options";
      messages = [
        {
          cat: "Contains: ",
          message:
            "Returns only names that contain the letter or string inputted.",
        },
        {
          cat: "Starts With: ",
          message:
            "Returns only names that start with the letter or string inputted.",
        },
        {
          cat: "Ends With: ",
          message:
            "Returns only names that end with the letter or string inputted.",
        },
      ];
    } else if (type === "gender") {
      title = "Gender Options";
      messages = [
        {
          cat: "Selecting Both Genders: ",
          message: "Returns the individual results for each gender.",
        },
        {
          cat: "Selecting Neither Gender: ",
          message: "Ignores gender.",
        },
      ];
    } else if (type === "charCount") {
      title = "Name Length Options";
      messages = [
        {
          cat: "Min Length: ",
          message:
            "Returns the names with a length greater than or equal to this number.",
        },
        {
          cat: "Max Length: ",
          message:
            "Returns the names with a length less than or equal to this number.",
        },
      ];
    }
    this.setState({
      showModal: true,
      modalMessages: messages,
      modalTitle: title,
    });
  };

  handleClickLetter = () => {
    let rows = this.state.letterInputs;
    rows.push("Letter(s)");
    this.setState({ letterInputs: rows });
  };

  grabLetterInput = (index, output) => {
    let newArray = this.state.letterInputs;
    newArray[index] = output;
    this.setState({ letterInputs: newArray });
  };

  handleClickNumber = () => {
    let numInputs = this.state.numberInputs;
    let max = 5173828;
    if (this.state.female && !this.state.male) {
      max = myData["Count"]["AllTime"]["F"];
    } else if (!this.state.female && this.state.male) {
      max = myData["Count"]["AllTime"]["M"];
    } else if (!this.state.female && this.state.male) {
      max = myData["Count"]["AllTime"]["MF"];
    }
    numInputs.push({ Count_AllTime: { $between: [0, max] } });
    this.setState({ numberInputs: numInputs });
  };

  grabNumberInput = (index, output) => {
    let newArray = this.state.numberInputs;
    newArray[index] = output;
    let sortDisp = Object.getOwnPropertyNames(newArray[0])[0].split("_")[1];
    let display = "All Time";
    if (sortDisp !== "AllTime") {
      display = `${sortDisp.split("x")[0]}0s`;
    }
    this.setState({
      numberInputs: newArray,
      sortExtra: sortDisp,
      sortDisplay: display,
    });
  };

  checkErroroneousInputs = () => {
    let submit = true;
    let errorArray = [];
    let letterInput = this.state.letterInputs;
    let nullRows = [];
    let letterInputClass = this.state.letterInputClasses;
    let letterDropdowns = this.state.letterDropdownClasses;
    let letterError = this.state.letterErrorMessage;
    let dropdownA = this.state.numberDropdownClassesA;
    let dropdownB = this.state.numberDropdownClassesB;
    let numberError = this.state.numberErrorMessage;
    //loop through letterInputs
    for (let i = 0; i < this.state.letterInputs.length; i++) {
      if (
        this.state.letterInputs[i] &&
        this.state.letterInputs[i] !== "Letter(s)"
      ) {
        if (
          (this.state.letterInputs[i].$like ||
            this.state.letterInputs[i].$notlike) &&
          (this.state.letterInputs[i].$like === "%%" ||
            this.state.letterInputs[i].$like === "%" ||
            this.state.letterInputs[i].$like === "%Letter(s)%" ||
            this.state.letterInputs[i].$like === "Letter(s)%" ||
            this.state.letterInputs[i].$like === "%Letter(s)" ||
            this.state.letterInputs[i].$notlike === "!%%" ||
            this.state.letterInputs[i].$notlike === "!%" ||
            this.state.letterInputs[i].$notlike === "!%Letter(s)%" ||
            this.state.letterInputs[i].$notlike === "Letter(s)%!" ||
            this.state.letterInputs[i].$notlike === "!%Letter(s)")
        ) {
          //change border of letter-input-#
          submit = false;
          letterDropdowns[i] = "no-border";
          letterInputClass[i] = "red-border";
          letterError[i] = "*Input a letter.*";
        } else if (this.state.letterInputs[i] === "string") {
          //change border of dropdown-toggle-#
          submit = false;
          letterInputClass[i] = "no-border";
          letterDropdowns[i] = "red-border";
          letterError[i] = "*Make a selection.*";
        } else {
          letterInputClass[i] = "no-border";
          letterDropdowns[i] = "no-border";
          letterError[i] = "";
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
                this.state.letterInputs[i] !== "Letter(s)" &&
                this.state.letterInputs[j] &&
                this.state.letterInputs[j] !== "Letter(s)" &&
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
                        Object.getOwnPropertyNames(
                          this.state.letterInputs[j]
                        )[0]
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
                  errorArray.push(i);
                  errorArray.push(j);
                  submit = false;
                }
              }
            }
          }
        }
      } else {
        nullRows.push(i);
      }
      if (errorArray) {
        for (let k = 0; k < errorArray.length; k++) {
          letterInputClass[errorArray[k]] = "red-border";
          letterDropdowns[errorArray[k]] = "red-border";
          letterError[errorArray[k]] = "*Incorrect Inputs.*";
        }
      }
    }
    for (let i = nullRows.length - 1; i >= 0; i--) {
      letterInput.splice(nullRows[i], 1);
      letterInputClass.splice(nullRows[i], 1);
      letterDropdowns.splice(nullRows[i], 1);
      letterError.splice(nullRows[i], 1);
    }

    //loop through numberInputs
    errorArray = [];
    for (let i = this.state.numberInputs.length - 1; i > 0; i--) {
      //check for 2 of the same inputs
      let keyI = Object.keys(this.state.numberInputs[i])[0];
      let startI = this.state.numberInputs[i][
        Object.keys(this.state.numberInputs[i])[0]
      ].$between[0];
      let endI = this.state.numberInputs[i][
        Object.keys(this.state.numberInputs[i])[0]
      ].$between[1];
      for (let j = i - 1; j >= 0; j--) {
        let keyJ = Object.keys(this.state.numberInputs[j])[0];
        let startJ = this.state.numberInputs[j][
          Object.keys(this.state.numberInputs[j])[0]
        ].$between[0];
        let endJ = this.state.numberInputs[j][
          Object.keys(this.state.numberInputs[j])[0]
        ].$between[1];
        if (keyI === keyJ && startI === startJ && endI === endJ) {
          this.removeNumberRow(i);
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
      numberDropdownClassesA: dropdownA,
      numberDropdownClassesB: dropdownB,
      numberErrorMessage: numberError,
      moreResults: 100,
      results: newResults,
      totalCount: count,
      isLoading: submit,
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
    let lettersArr = this.state.letterInputs;
    let queryGender = "B";
    if (this.state.female && !this.state.male) {
      queryGender = "F";
    } else if (!this.state.female && this.state.male) {
      queryGender = "M";
    } else if (this.state.female && this.state.male) {
      queryGender = "MF";
    }
    let numberQuery = [];
    if (this.state.numberInputs.length) {
      numberQuery = this.state.numberInputs;
    } else {
      numberQuery = [{ Count_AllTime: { $between: [0, 5173828] } }];
    }
    let genderArr = [queryGender];
    if (queryGender === "MF") {
      genderArr = ["M", "F"];
    }
    let query = {
      letters: lettersArr,
      gender: genderArr,
      min: this.state.minLength,
      max: this.state.maxLength,
      numbers: numberQuery,
      limit: moreResults,
      sort: sortQuery,
    };
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
      JSON.stringify(numberQuery) +
      "&" +
      moreResults +
      "&" +
      JSON.stringify(sortQuery);
    queryLink = encodeURI(queryLink);
    console.log(queryLink);
    let path = "/" + encodeURI(queryLink);
    console.log(path);
    let count = this.props.location.state
      ? this.props.location.state.countReq
      : this.props.countReq;
    let name = this.props.location.state
      ? this.props.location.state.nameReq
      : this.props.nameReq;
    this.props.history.push({
      pathname: path,
      state: {
        nameReq: name,
        countReq: count,
      },
    });
    API.findNames(query)
      .then((res) => {
        if (res.data.count >= 20) {
          this.setState({
            totalCount: res.data.count,
            results: res.data.rows,
            isLoading: true,
            seed: query.seed,
            query: `https://www.unpopularbaby.com/${queryLink}`,
          });
        } else {
          this.setState({
            totalCount: res.data.count,
            results: res.data.rows,
            isLoading: false,
            seed: query.seed,
            query: `https://www.unpopularbaby.com/${queryLink}`,
          });
        }
      })
      .catch((err) => {
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

  removeLetterRow = (index) => {
    let newInputClasses = this.state.letterInputClasses;
    newInputClasses.splice(index, 1);
    let newErrorMessage = this.state.letterErrorMessage;
    newErrorMessage.splice(index, 1);
    let newDropdownClasses = this.state.letterDropdownClasses;
    newDropdownClasses.splice(index, 1);
    let newArray = this.state.letterInputs;
    newArray.splice(index, 1);
    this.setState({
      letterDropdownClasses: newDropdownClasses,
      letterErrorMessage: newErrorMessage,
      letterInputClasses: newInputClasses,
      letterInputs: newArray,
    });
  };

  removeNumberRow = (index) => {
    let newErrorMsgs = this.state.numberErrorMessage;
    newErrorMsgs.splice(index, 1);
    let newDropA = this.state.numberDropdownClassesA;
    newDropA.splice(index, 1);
    let newDropB = this.state.numberDropdownClassesB;
    newDropB.splice(index, 1);
    let newArray = this.state.numberInputs;
    newArray.splice(index, 1);
    let sortDisp = "AllTime";
    if (newArray[0]) {
      sortDisp = Object.getOwnPropertyNames(newArray[0])[0].split("_")[1];
    }
    let display = "All Time";
    if (sortDisp !== "AllTime") {
      display = `${sortDisp.split("x")[0]}0s`;
    }
    this.setState({
      numberErrorMessage: newErrorMsgs,
      numberDropdownClassesA: newDropA,
      numberDropdownClassesB: newDropB,
      numberInputs: newArray,
      sortExtra: sortDisp,
      sortDisplay: display,
    });
  };

  updateDropdownOptions = (input) => {
    this.setState({ sort: input });
  };

  updateDropdownOptionsTwo = (input) => {
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
      gender: gender,
    };
    API.findName(query)
      .then((res) => {
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
            res.data[0].Count_201x,
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
            res.data[0].Rank_201x,
          ],
        });
      })
      .catch((err) => {
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
      rank: 0,
    });
  };

  clearLetterBorders = (r) => {
    let letterDropdownClasses = [];
    let letterInputClasses = [];
    let letterErrorMessage = [];
    let letterInputs = [];
    this.setState({
      letterDropdownClasses: letterDropdownClasses,
      letterInputClasses: letterInputClasses,
      letterErrorMessage: letterErrorMessage,
      letterInputs: letterInputs,
    });
  };

  render() {
    const countReq = this.props.location.state
      ? this.props.location.state.countReq
      : this.props.countReq;
    const nameReq = this.props.location.state
      ? this.props.location.state.nameReq
      : this.props.nameReq;
    return (
      <Wrapper>
        <form className="justify-content-center mx-0 px-0 text-center align-items-center">
          {nameReq && countReq && (
            <>
              <div className="row mr-0 justify-content-center mx-auto">
                <div className="form-inline my-2 mx-auto px-0">
                  <div className="checkbox">
                    <input
                      className="my-0 align-self-center"
                      type="checkbox"
                      onChange={(e) =>
                        this.setState({ male: !this.state.male })
                      }
                      checked={this.state.male}
                    />
                  </div>
                  <div className="my-0 mx-2 ">Male</div>
                  <div className="checkbox">
                    <input
                      className="my-0 align-self-center"
                      type="checkbox"
                      onChange={(e) =>
                        this.setState({ female: !this.state.female })
                      }
                      checked={this.state.female}
                    />
                  </div>
                  <div className="my-0 mx-2 ">Female</div>
                  <div className="mx-0 small align-self-center">
                    <button type="button" className="info text-white mx-0">
                      <i
                        className="fas fa-info-circle"
                        onClick={() => this.updateModal("gender")}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="row mr-0 justify-content-center mx-auto">
                <div className="form-inline px-0">
                  <div className="form-inline ml-1 my-2 mr-4">
                    <label className="mb-0 pr-1 my-auto">Min Length:</label>
                    <input
                      className="form-control m-0 number"
                      type="number"
                      min="1"
                      max={this.state.maxLength}
                      value={this.state.minLength}
                      placeholder={this.state.minLength}
                      onChange={(e) => {
                        if (
                          e.target.value &&
                          e.target.value <= this.state.maxLength
                        ) {
                          this.setState({
                            minLength: parseInt(e.target.value),
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="form-inline ml-1 my-2 mr-2">
                    <label className="mb-0 pr-1 my-auto">Max Length:</label>
                    <input
                      className="form-control m-0 number"
                      type="number"
                      min={this.state.minLength}
                      max="15"
                      value={this.state.maxLength}
                      placeholder={this.state.maxLength}
                      onChange={(e) => {
                        if (
                          e.target.value &&
                          e.target.value >= this.state.minLength
                        ) {
                          this.setState({
                            maxLength: parseInt(e.target.value),
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="mx-0 small align-self-center">
                    <button type="button" className="info text-white mx-0">
                      <i
                        className="fas fa-info-circle"
                        onClick={() => this.updateModal("charCount")}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
        <div className="text-center row justify-content-center mx-auto">
          {nameReq && (
            <div className="col-md-4 px-0">
              {this.state.letterInputs.map((output, index) => (
                <LetterForm
                  key={index}
                  nth={index}
                  inputs={
                    this.state.letterInputs[index] &&
                    this.state.letterInputs[index].$like
                      ? this.state.letterInputs[index].$like
                      : this.state.letterInputs[index] &&
                        this.state.letterInputs[index].$notlike
                      ? this.state.letterInputs[index].$notlike
                      : "Letter(s)"
                  }
                  errorMessage={this.state.letterErrorMessage[index]}
                  inputClass={this.state.letterInputClasses[index]}
                  dropdownClass={this.state.letterDropdownClasses[index]}
                  appendOutput={this.grabLetterInput}
                  removeLetterRow={this.removeLetterRow}
                  updateModal={this.updateModal}
                  length={this.state.letterInputs.length}
                  clearBorders={this.clearLetterBorders}
                  marg={index ? 20 : 0}
                />
              ))}
              <button
                className="link-button my-2"
                onClick={this.handleClickLetter}
              >
                + More Letter Search Terms
              </button>
            </div>
          )}
          {countReq && (
            <div className="col-md-8 px-0">
              {this.state.numberInputs.map((output, index) => (
                <NumberForm
                  key={index}
                  nth={index}
                  inputs={this.state.numberInputs[index]}
                  errorMessage={this.state.numberErrorMessage[index]}
                  dropdownClassA={this.state.numberDropdownClassesA[index]}
                  dropdownClassB={this.state.numberDropdownClassesB[index]}
                  appendOutput={this.grabNumberInput}
                  male={this.state.male}
                  female={this.state.female}
                  removeNumberRow={this.removeNumberRow}
                  updateModal={this.updateModal}
                  length={this.state.numberInputs.length}
                  marg={index ? 15 : 0}
                />
              ))}
              <button
                className="link-button my-2"
                onClick={this.handleClickNumber}
              >
                + More Number Search Terms
              </button>
            </div>
          )}
        </div>
        <div className="row justify-content-center col-12 mx-auto my-2">
          <button
            type="button"
            className="btn btn-secondary px-1 submit btn-width mb-2"
            onClick={(e) => this.checkErroroneousInputs()}
          >
            SUBMIT
          </button>
          {this.state.totalCount >= 0 && (
            <>
              <h4 className="ml-2 text-white mb-2">{this.state.totalCount}</h4>
              <CopyToClipboard text={this.state.query}>
                <button
                  type="button"
                  className="btn btn-secondary px-1 save btn-width mb-2"
                >
                  Save Search
                </button>
              </CopyToClipboard>
            </>
          )}
          {this.state.totalCount > 1 && (
            <form className="form-inline mb-2">
              <div>
                <button
                  className={`btn btn-secondary dropdown-toggle px-1 my-auto`}
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
                  {this.state.sortOptsArray.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      className="dropdown-item"
                      href="#"
                      onClick={() => this.updateDropdownOptions(item.value)}
                    >
                      {item.value}
                    </button>
                  ))}
                </div>
              </div>
              {(this.state.sort === "Most - Least Popular" ||
                this.state.sort === "Least - Most Popular") && (
                <div>
                  <button
                    className={`btn btn-secondary dropdown-toggle px-1 my-auto`}
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
                    {this.state.sortArray.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className="dropdown-item"
                        href="#"
                        onClick={() =>
                          this.updateDropdownOptionsTwo(item.value)
                        }
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
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
