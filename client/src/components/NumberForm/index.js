import React, { Component } from "react";
import InputRange from "react-input-range";
import "./styles.css";
import "react-input-range/lib/css/index.css";

import myData from "./max_values_full.json";

class NumberForm extends Component {
  state = {
    numericalOptions: "Count",
    years: "All Time",
    yearCol: "AllTime",
    value: { min: 0, max: myData["Count"]["AllTime"]["B"] },
    minValue: 0,
    maxValue: myData["Count"]["AllTime"]["B"],
    slider: "",
    output: {},
    decadeArray: [
      {
        id: 0,
        label: "1880s",
        title: "1880",
        value: "188x",
      },
      {
        id: 1,
        label: "1890s",
        title: "1890",
        value: "189x",
      },
      {
        id: 2,
        label: "1900s",
        title: "1900",
        value: "190x",
      },
      {
        id: 3,
        label: "1910s",
        title: "1910",
        value: "191x",
      },
      {
        id: 4,
        label: "1920s",
        title: "1920",
        value: "192x",
      },
      {
        id: 5,
        label: "1930s",
        title: "1930",
        value: "193x",
      },
      {
        id: 6,
        label: "1940s",
        title: "1940",
        value: "194x",
      },
      {
        id: 7,
        label: "1950s",
        title: "1950",
        value: "195x",
      },
      {
        id: 8,
        label: "1960s",
        title: "1960",
        value: "196x",
      },
      {
        id: 9,
        label: "1970s",
        title: "1970",
        value: "197x",
      },
      {
        id: 10,
        label: "1980s",
        title: "1980",
        value: "198x",
      },
      {
        id: 11,
        label: "1990s",
        title: "1990",
        value: "199x",
      },
      {
        id: 12,
        label: "2000s",
        title: "2000",
        value: "200x",
      },
      {
        id: 13,
        label: "2010s",
        title: "2010",
        value: "201x",
      },
      {
        id: 14,
        label: "All Time",
        title: "All Time",
        value: "AllTime",
      },
    ],
    optionsArray: [
      {
        id: 0,
        title: "Count",
      },
      {
        id: 1,
        title: "Rank",
      },
    ],
  };

  componentDidUpdate = (prevProps) => {
    if (
      this.props.male !== prevProps.male ||
      this.props.female !== prevProps.female
    ) {
      if (this.props.inputs) {
        let key = Object.keys(this.props.inputs)[0];
        if (!key.includes("Year(s)")) {
          if (this.props.inputs.hasOwnProperty(key)) {
            let options = key.substr(0, key.indexOf("_"));
            let yearCl = key.substr(key.indexOf("_") + 1);
            this.updateNumbers(
              options,
              yearCl,
              this.props.male,
              this.props.female
            );
          }
        }
      }
    }
    if (prevProps.inputs !== this.props.inputs) {
      this.componentMount();
    }
  };

  componentDidMount = () => {
    this.componentMount();
  };

  componentMount = () => {
    let startMin = 20;
    let startMax = 80;
    let options = "Numerical Options";
    let yearCol = "Year(s)";
    let year = "Year(s)";
    let min = 5;
    let max = 100;
    let outputVal = this.state.output;
    if (this.props.inputs) {
      outputVal = this.props.inputs;
      let key = Object.keys(this.props.inputs)[0];
      if (!key.includes("Year(s)")) {
        if (this.props.inputs.hasOwnProperty(key)) {
          options = key.substr(0, key.indexOf("_"));
          year = key.substr(key.indexOf("_") + 1);
          yearCol = year;
          if (year.includes("x")) {
            year = year.replace(/x/, "0s");
          } else {
            year = "All Time";
          }
          startMin = this.props.inputs[key].$between[0];
          startMax = this.props.inputs[key].$between[1];
          let gender = "B";
          if (this.props.male && !this.props.female) {
            gender = "M";
          } else if (!this.props.male && this.props.female) {
            gender = "F";
          } else if (this.props.male && this.props.female) {
            gender = "MF";
          }
          min = key.substring(0, key.indexOf("_")) === "Count" ? 0 : 1;
          max = this.getEndpoints(key, gender);
          this.checkSliderMinMax(
            min,
            max,
            options,
            startMin,
            startMax,
            outputVal
          );
          this.setState({
            output: outputVal,
            numericalOptions: options,
            years: year,
            yearCol: yearCol,
            minValue: min,
            maxValue: max,
            value: { min: startMin, max: startMax },
          });
        }
      }
    } else {
      this.updateNumbers(
        this.state.numericalOptions,
        this.state.yearCol,
        this.props.male,
        this.props.female
      );
    }
  };

  updateNumericalOptions = (input, input2) => {
    this.updateNumbers(input, input2, this.props.male, this.props.female);
  };

  checkSliderMinMax = (min, max, input, startMin, startMax, outputVal) => {
    //update both
    this.setState({
      numericalOptions: input,
      minValue: min,
      maxValue: max,
      value: { min: startMin, max: startMax },
      output: outputVal,
    });
  };

  updateNumbers = (input, input2, male, female) => {
    let min = 1;
    let max = 100;
    let prevMax = this.state.maxValue;
    let minPercentage = this.state.value.min / prevMax;
    let maxPercentage = this.state.value.max / prevMax;
    let startMin = Math.round(minPercentage * 100);
    let startMax = Math.round(maxPercentage * 100);
    let query = input + "_" + input2;
    let gender = "B";
    if (male && !female) {
      gender = "M";
    } else if (!male && female) {
      gender = "F";
    } else if (male && female) {
      gender = "MF";
    }
    let outputVal = { [query]: { $between: [startMin, startMax] } };
    max = this.getEndpoints(query, gender);
    startMin = Math.round(max * minPercentage);
    if (input === "Rank" && input2 !== "Year(s)") {
      //set max to the highest number in the column for that rank decade
      if (startMin === 0) {
        startMin = 1;
      }
    } else if (input === "Count" && input2 !== "Year(s)") {
      if (startMin === 1) {
        startMin = 0;
      }
      min = 0;
    }
    startMax = Math.round(max * maxPercentage);
    outputVal = { [query]: { $between: [startMin, startMax] } };
    this.checkSliderMinMax(min, max, input, startMin, startMax, outputVal);
    this.props.appendOutput(this.props.nth, outputVal);
    if (input2 === "Year(s)") {
      this.setState({ numericalOptions: input, output: outputVal });
      this.props.appendOutput(this.props.nth, outputVal);
    }
  };

  updateYearOptions = (input1, input2) => {
    let outputVal = {};
    if (this.state.numericalOptions !== "Numerical Options") {
      let query = this.state.numericalOptions + "_" + input2;
      outputVal = {
        [query]: { $between: [this.state.value.min, this.state.value.max] },
      };
    }
    this.setState({ years: input1, yearCol: input2, output: outputVal });
    this.props.appendOutput(this.props.nth, outputVal);
    if (this.state.numericalOptions !== "Numerical Options") {
      this.updateNumericalOptions(this.state.numericalOptions, input2);
    }
  };

  hideForm = () => {
    this.props.removeNumberRow(this.props.nth);
  };

  getEndpoints = (key, gender) => {
    const type = key.substring(0, key.indexOf("_"));
    const year = key.substring(key.indexOf("_") + 1);
    return myData[type][year][gender];
  };

  render() {
    return (
      <div className="max-width">
        <div className="row justify-content-center mx-auto">
          <form className="form-inline number-form mb-0">
            <div className="mx-1 my-auto">
              <button
                className={`btn btn-secondary dropdown dropdown-toggle ml-0 px-1 my-0 ${this.props.dropdownClassA}`}
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.years}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {this.state.decadeArray.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className="dropdown-item"
                    href="#"
                    onClick={() =>
                      this.updateYearOptions(item.title, item.value)
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-1 my-auto">
              <button
                className={`btn btn-secondary dropdown dropdown-toggle ml-0 px-1 my-0 ${this.props.dropdownClassB}`}
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.numericalOptions}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {this.state.optionsArray.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className="dropdown-item"
                    href="#"
                    onClick={() =>
                      this.updateNumericalOptions(
                        item.title,
                        this.state.yearCol
                      )
                    }
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
            <InputRange
              className="slider"
              maxValue={this.state.maxValue}
              minValue={this.state.minValue}
              value={this.state.value}
              onChange={(value) => {
                let outputVal = {};
                if (this.state.numericalOptions !== "Numerical Options") {
                  let query =
                    this.state.numericalOptions + "_" + this.state.yearCol;
                  outputVal = {
                    [query]: { $between: [value.min, value.max] },
                  };
                }
                this.setState({ value: value, output: outputVal });
                this.props.appendOutput(this.props.nth, outputVal);
              }}
            />
            <button
              type="button"
              className="close text-white ml-1"
              style={{ paddingRight: this.props.marg }}
              onClick={this.hideForm}
            >
              {" "}
              &times;
            </button>
            {this.props.nth === 0 && (
              <div className="align-self-center">
                <button
                  type="button"
                  className="info text-white pr-0 pl-1 small "
                >
                  <i
                    className="fas fa-info-circle"
                    onClick={() => this.props.updateModal("number")}
                  />
                </button>
              </div>
            )}
          </form>
        </div>
        <div className="red-text">{this.props.errorMessage}</div>
      </div>
    );
  }
}

export default NumberForm;
