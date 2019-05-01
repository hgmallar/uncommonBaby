import React, { Component } from "react";
import InputRange from "react-input-range";
import API from "../../utils/API";
import "./styles.css";
import "react-input-range/lib/css/index.css";

class NumberForm extends Component {
  state = {
    numericalOptions: "Numerical Options",
    years: "Year(s)",
    yearCol: "Year(s)",
    value: { min: 20, max: 80 },
    minValue: 1,
    maxValue: 100,
    slider: "",
    output: {}
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.male !== nextProps.male ||
      this.props.female !== nextProps.female
    ) {
      if (this.state.numericalOptions !== "Numerical Options") {
        this.updateNumbers(
          this.state.numericalOptions,
          this.state.yearCol,
          nextProps.male,
          nextProps.female
        );
      }
    }
  }

  updateNumericalOptions = (input, input2, evt) => {
    evt.preventDefault();
    this.updateNumbers(input, input2, this.props.male, this.props.female);
  };

  checkSliderMinMax = (max, input, startMin, startMax, outputVal, query) => {
    if (
      this.state.value.min < max &&
      this.state.value.max < max &&
      this.state.value.min !== 20 &&
      this.state.value.max !== 80
    ) {
      //don't update slider values because they fall within range
      outputVal = {
        [query]: { $between: [this.state.value.min, this.state.value.max] }
      };
      this.setState({
        numericalOptions: input,
        maxValue: max,
        output: outputVal
      });
    } else if (
      this.state.value.min < max &&
      this.state.value.min !== 20 &&
      this.state.value.max !== 80
    ) {
      //update max only
      outputVal = { [query]: { $between: [this.state.value.min, startMax] } };
      this.setState({
        numericalOptions: input,
        maxValue: max,
        value: { min: this.state.value.min, max: startMax },
        output: outputVal
      });
    } else {
      //update both
      this.setState({
        numericalOptions: input,
        maxValue: max,
        value: { min: startMin, max: startMax },
        output: outputVal
      });
    }
  };

  updateNumbers = (input, input2, male, female) => {
    let max = 100;
    let startMin = 20;
    let startMax = 80;
    let query = input + "_" + input2;
    let gender = "";
    if (male && !female) {
      gender = "M";
    } else if (!male && female) {
      gender = "F";
    }
    let outputVal = { [query]: { $between: [startMin, startMax] } };
    if (input === "Rank" && input2 !== "Year(s)") {
      //set max to the highest number in the column for that rank decade
      if ((male && !female) || (!male && female)) {
        API.getCountMF(query, gender)
          .then(res => {
            max = res.data;
            startMin = Math.round(res.data * 0.2);
            startMax = Math.round(res.data * 0.8);
            outputVal = { [query]: { $between: [startMin, startMax] } };
            this.checkSliderMinMax(
              max,
              input,
              startMin,
              startMax,
              outputVal,
              query
            );
            this.props.appendOutput(this.props.className, outputVal);
          })
          .catch(err => {
            console.log("count error: ");
            console.log(err);
          });
      } else {
        API.getCount(query)
          .then(res => {
            max = res.data;
            startMin = Math.round(res.data * 0.2);
            startMax = Math.round(res.data * 0.8);
            outputVal = { [query]: { $between: [startMin, startMax] } };
            this.checkSliderMinMax(
              max,
              input,
              startMin,
              startMax,
              outputVal,
              query
            );
            this.props.appendOutput(this.props.className, outputVal);
          })
          .catch(err => {
            console.log("count error: ");
            console.log(err);
          });
      }
    } else if (input === "Count" && input2 !== "Year(s)") {
      //set max to the highest number in the column for that count decade
      if ((male && !female) || (!male && female)) {
        API.getCountMF(query, gender)
          .then(res => {
            max = res.data;
            startMin = Math.round(res.data * 0.2);
            startMax = Math.round(res.data * 0.8);
            outputVal = { [query]: { $between: [startMin, startMax] } };
            this.checkSliderMinMax(
              max,
              input,
              startMin,
              startMax,
              outputVal,
              query
            );
            this.props.appendOutput(this.props.className, outputVal);
          })
          .catch(err => {
            console.log("count error: ");
            console.log(err);
          });
      } else {
        API.getCount(query)
          .then(res => {
            max = res.data;
            startMin = Math.round(res.data * 0.2);
            startMax = Math.round(res.data * 0.8);
            outputVal = { [query]: { $between: [startMin, startMax] } };
            this.checkSliderMinMax(
              max,
              input,
              startMin,
              startMax,
              outputVal,
              query
            );
            this.props.appendOutput(this.props.className, outputVal);
          })
          .catch(err => {
            console.log("count error: ");
            console.log(err);
          });
      }
    } else if (input === "Percentile" && input2 !== "Year(s)") {
      this.checkSliderMinMax(max, input, startMin, startMax, outputVal, query);
      outputVal = {
        [query]: { $between: [this.state.value.min, this.state.value.max] }
      };
      this.setState({
        numericalOptions: input,
        maxValue: max,
        output: outputVal
      });
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
    this.props.removeNumberRow(this.props.className);
  };

  render() {
    return (
      <div className="max-width">
        <div className="row justify-content-center mx-auto">
          <form className="form-inline number-form mb-0">
            <div className="dropdown">
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

            <div className="dropdown">
              <button
                className={`btn btn-secondary dropdown-toggle px-1 ${
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
                    this.updateNumericalOptions(
                      "Percentile",
                      this.state.yearCol,
                      e
                    )
                  }
                >
                  Percentile
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
            <button
              type="button"
              className="close text-white ml-2"
              onClick={this.hideForm}
            >
              {" "}
              &times;
            </button>
          </form>
          <sup>
            <button type="button" className="info text-white">
              <i className="fas fa-info-circle" onClick={() => this.props.updateModal("number")}/>
            </button>
          </sup>
        </div>
        <div className="red-text">{this.props.errorMessage}</div>
      </div>
    );
  }
}

export default NumberForm;
