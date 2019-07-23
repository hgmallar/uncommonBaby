import React, { Component } from "react";
import "./styles.css";
import "react-input-range/lib/css/index.css";

class LetterForm extends Component {
  state = {
    letterOptions: "Letter Options",
    dropdown: "Letter Options",
    input: "Letter(s)",
    output: ""
  };

  updateLetterOptions = (letterInput, evt) => {
    evt.preventDefault();
    let output = "";
    if (letterInput === "Contains") {
      output = { $like: "%" + this.state.input + "%" };
    } else if (letterInput === "Starts With") {
      output = { $like: this.state.input + "%" };
    } else if (letterInput === "Ends With") {
      output = { $like: "%" + this.state.input };
    }
    this.setState({
      letterOptions: letterInput,
      dropdown: letterInput,
      output: output
    });
    this.props.appendOutput(this.props.className, output);
  };

  updateOutput = evt => {
    let input = evt.target.value;
    if (input === "Letter(s)") {
      input = "";
    }
    let output = "string";
    if (this.state.dropdown === "Contains") {
      output = { $like: "%" + input + "%" };
    } else if (this.state.dropdown === "Starts With") {
      output = { $like: input + "%" };
    } else if (this.state.dropdown === "Ends With") {
      output = { $like: "%" + input };
    }
    this.setState({ input: input, output: output });
    this.props.appendOutput(this.props.className, output);
  };

  hideForm = (e, r) => {
    if (this.props.length > 1) {
      this.props.removeLetterRow(this.props.className);
    } else {
      this.setState({
        letterOptions: "Letter Options",
        dropdown: "Letter Options",
        input: "Letter(s)",
        output: ""
      });
      this.props.appendOutput(this.props.className, "");
      this.props.clearBorders(r);
    }
  };

  componentWillMount = () => {
    if (
      this.props.inputs &&
      !this.props.inputs.includes("Letter(s)") &&
      this.props.inputs !== "string"
    ) {
      let inputs = this.props.inputs.replace(/%/g, "");
      let dropdowns = "Letter Options";
      if (
        this.props.inputs.charAt(0) === "%" &&
        this.props.inputs.charAt(this.props.inputs.length - 1) === "%"
      ) {
        dropdowns = "Contains";
      } else if (this.props.inputs.charAt(0) === "%") {
        dropdowns = "Ends With";
      } else if (
        this.props.inputs.charAt(this.props.inputs.length - 1) === "%"
      ) {
        dropdowns = "Starts With";
      }
      this.setState({ input: inputs, dropdown: dropdowns });
    }
  };

  render() {
    return (
      <div className="max-width">
        <div className="row justify-content-center mx-auto">
          <form className="form-inline letters mb-0">
            <div className="dropdown ml-1">
              <button
                className={`btn btn-secondary dropdown-toggle ml-0 px-1 ${
                  this.props.dropdownClass
                }`}
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.dropdown}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateLetterOptions("Contains", e)}
                >
                  Contains
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateLetterOptions("Starts With", e)}
                >
                  Starts With
                </button>
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={e => this.updateLetterOptions("Ends With", e)}
                >
                  Ends With
                </button>
              </div>
            </div>

            <label className="ml-1">
              <input
                type="text"
                className={`form-control letter-input letter-input-${
                  this.props.className
                } ${this.props.inputClass}`}
                onChange={e => this.updateOutput(e)}
                onClick={e => e.target.value = ""}
                value={this.state.input}
              />
            </label>
          </form>
          {this.props.length > 1 ||
          (this.state.dropdown !== "Letter Options" ||
            this.state.input !== "Letter(s)") ? (
            <button
              type="button"
              className="close text-white ml-1 small"
              onClick={e => this.hideForm(e, this.props.nth)}
            >
              {" "}
              &times;
            </button>
          ) : (
            <div />
          )}
          {this.props.first === this.props.nth ? (
            <sup className="mx-0">
              <button type="button" className="info text-white mx-0 pr-0 pl-1">
                <i
                  className="fas fa-info-circle"
                  onClick={() => this.props.updateModal("letter")}
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

export default LetterForm;
