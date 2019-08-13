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
    output: {}
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.male !== prevProps.male ||
      this.props.female !== prevProps.female
    ) {
      if (this.state.numericalOptions !== "Numerical Options") {
        this.updateNumbers(
          this.state.numericalOptions,
          this.state.yearCol,
          this.props.male,
          this.props.female
        );
      }
    }
  }

  componentDidMount() {
    let startMin = 20;
    let startMax = 80;
    let options = "Numerical Options";
    let yearCol = "Year(s)";
    let year = "Year(s)";
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
          max = this.getEndpoints(key, gender);
          this.checkSliderMinMax(
            0,
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
            maxValue: max,
            value: { min: startMin, max: startMax }
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
  }

  updateNumericalOptions = (input, input2, evt) => {
    evt.preventDefault();
    this.updateNumbers(input, input2, this.props.male, this.props.female);
  };

  checkSliderMinMax = (min, max, input, startMin, startMax, outputVal) => {
    //update both
    this.setState({
      numericalOptions: input,
      minValue: min,
      maxValue: max,
      value: { min: startMin, max: startMax },
      output: outputVal
    });
  };

  updateNumbers = (input, input2, male, female) => {
    let max = 100;
    let prevMax = this.state.maxValue;
    let prevMin = this.state.minValue;
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
    if (input === "Rank" && input2 !== "Year(s)") {
      //set max to the highest number in the column for that rank decade
      max = this.getEndpoints(query, gender);
      startMin = Math.round(max * minPercentage);
      if (startMin === 0) {
        startMin = 1;
      }
      startMax = Math.round(max * maxPercentage);
      outputVal = { [query]: { $between: [startMin, startMax] } };
      this.checkSliderMinMax(1, max, input, startMin, startMax, outputVal);
      this.props.appendOutput(this.props.className, outputVal);
    } else if (input === "Count" && input2 !== "Year(s)") {
      //set max to the highest number in the column for that count decade
      max = this.getEndpoints(query, gender);
      startMin = Math.round(max * minPercentage);
      if (prevMin === 1) {
        startMin = 0;
      }
      startMax = Math.round(max * maxPercentage);
      outputVal = { [query]: { $between: [startMin, startMax] } };
      this.checkSliderMinMax(0, max, input, startMin, startMax, outputVal);
      this.props.appendOutput(this.props.className, outputVal);
    } else {
      this.setState({ numericalOptions: input, output: outputVal });
      this.props.appendOutput(this.props.className, outputVal);
    }
  };

  updateYearOptions = (input1, input2, evt) => {
    evt.preventDefault();
    let outputVal = {};
    if (this.state.numericalOptions !== "Numerical Options") {
      let query = this.state.numericalOptions + "_" + input2;
      outputVal = {
        [query]: { $between: [this.state.value.min, this.state.value.max] }
      };
    }
    this.setState({ years: input1, yearCol: input2, output: outputVal });
    this.props.appendOutput(this.props.className, outputVal);
    if (this.state.numericalOptions !== "Numerical Options") {
      this.updateNumericalOptions(this.state.numericalOptions, input2, evt);
    }
  };

  hideForm = () => {
    let gender = "B";
    if (this.props.male && !this.props.female) {
      gender = "M";
    } else if (!this.props.male && this.props.female) {
      gender = "F";
    } else if (this.props.male && this.props.female) {
      gender = "MF";
    }
    if (this.props.length > 1) {
      this.props.removeNumberRow(this.props.className);
    } else {
      this.setState({
        numericalOptions: "Count",
        years: "All Time",
        yearCol: "AllTime",
        value: { min: 0, max: myData["Count"]["AllTime"][gender] },
        minValue: 0,
        maxValue: myData["Count"]["AllTime"][gender],
        slider: "",
        output: {}
      });
      this.props.appendOutput(this.props.className, {"Count_AllTime": {$between: [0, myData["Count"]["AllTime"][gender]]}});
      //this.props.appendOutput(this.props.className, "");
      //this.props.clearBorders(r);
    }
  };

  getEndpoints = (key, gender) => {
    const type = key.substring(0, key.indexOf("_"));
    const year = key.substring(key.indexOf("_") + 1);
    return myData[type][year][gender];
  };

  render() {
    let gender = "B";
    if (this.props.male && !this.props.female) {
      gender = "M";
    } else if (!this.props.male && this.props.female) {
      gender = "F";
    } else if (this.props.male && this.props.female) {
      gender = "MF";
    }
    return (
      <div className="max-width">
        <div className="row justify-content-center mx-auto">
          <form className="form-inline number-form mb-0">
            <div className="dropdown ml-1">
              <button
                className={`btn btn-secondary dropdown-toggle ml-0 px-1 ${
                  this.props.dropdownClassA
                }`}
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
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1880", "188x", e)}
                >
                  1880s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1890", "189x", e)}
                >
                  1890s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1900", "190x", e)}
                >
                  1900s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1910", "191x", e)}
                >
                  1910s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1920", "192x", e)}
                >
                  1920s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1930", "193x", e)}
                >
                  1930s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1940", "194x", e)}
                >
                  1940s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1950", "195x", e)}
                >
                  1950s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1960", "196x", e)}
                >
                  1960s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1970", "197x", e)}
                >
                  1970s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1980", "198x", e)}
                >
                  1980s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("1990", "199x", e)}
                >
                  1990s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("2000", "200x", e)}
                >
                  2000s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateYearOptions("2010", "201x", e)}
                >
                  2010s
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e =>
                    this.updateYearOptions("All Time", "AllTime", e)
                  }
                >
                  All Time
                </button>
              </div>
            </div>

            <div className="dropdown ml-1">
              <button
                className={`btn btn-secondary dropdown-toggle ml-0 px-1 ${
                  this.props.dropdownClassB
                }`}
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
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e =>
                    this.updateNumericalOptions("Rank", this.state.yearCol, e)
                  }
                >
                  Rank
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e =>
                    this.updateNumericalOptions("Count", this.state.yearCol, e)
                  }
                >
                  Count
                </button>
              </div>
            </div>
            <InputRange
              className="slider"
              maxValue={this.state.maxValue}
              minValue={this.state.minValue}
              value={this.state.value}
              onChange={value => {
                let outputVal = {};
                if (this.state.numericalOptions !== "Numerical Options") {
                  let query =
                    this.state.numericalOptions + "_" + this.state.yearCol;
                  outputVal = {
                    [query]: { $between: [value.min, value.max] }
                  };
                }
                this.setState({ value: value, output: outputVal });
                this.props.appendOutput(this.props.className, outputVal);
              }}
            />
          </form>
          {this.props.length > 1 ||
          !(
            (this.state.years === "All Time" &&
              this.state.numericalOptions === "Count" &&
              this.state.value.min === 0 &&
              this.state.value.max === myData["Count"]["AllTime"][gender]) ||
            (this.state.years === "All Time" &&
              this.state.numericalOptions === "Rank" &&
              this.state.value.min === 1 &&
              this.state.value.max === myData["Rank"]["AllTime"][gender])
          ) ? (
            <button
              type="button"
              className="close text-white ml-2"
              onClick={this.hideForm}
            >
              {" "}
              &times;
            </button>
          ) : (
            <div />
          )}
          {this.props.first === this.props.nth ? (
            <sup>
              <button type="button" className="info text-white pr-0 pl-1">
                <i
                  className="fas fa-info-circle"
                  onClick={() => this.props.updateModal("number")}
                />
              </button>
            </sup>
          ) : (
            <div />
          )}
        </div>
        <div className="red-text">{this.props.errorMessage}</div>
      </div>
    );
  }
}

export default NumberForm;
