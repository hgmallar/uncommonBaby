import React, { Component } from "react";
import "./styles.css";
import "react-input-range/lib/css/index.css";

class LetterForm extends Component {
  state = {
    letterOptions: "Letter Options",
    dropdown: "Letter Options",
    input: "Letter(s)",
    output: "",
    itemArray: [
      {
        id: 0,
        title: "Contains",
      },
      {
        id: 1,
        title: "Does Not Contain",
      },
      {
        id: 2,
        title: "Starts With",
      },
      {
        id: 3,
        title: "Does Not Start With",
      },
      {
        id: 4,
        title: "Ends With",
      },
      {
        id: 5,
        title: "Does Not End With",
      },
    ],
  };

  updateLetterOptions = async (letterInput) => {
    let output = "";
    if (letterInput === "Contains") {
      output = { $like: "%" + this.state.input + "%" };
    } else if (letterInput === "Does Not Contain") {
      output = { $notlike: "!%" + this.state.input + "%" };
    } else if (letterInput === "Starts With") {
      output = { $like: this.state.input + "%" };
    } else if (letterInput === "Does Not Start With") {
      output = { $notlike: "!" + this.state.input + "%" };
    } else if (letterInput === "Ends With") {
      output = { $like: "%" + this.state.input };
    } else if (letterInput === "Does Not End With") {
      output = { $notlike: "!%" + this.state.input };
    }
    await this.setState({
      letterOptions: letterInput,
      dropdown: letterInput,
      output: output,
    });
    await this.props.appendOutput(this.props.nth, output);
    this.props.checkErroroneousInputs();
  };

  updateOutput = async (evt) => {
    let input = evt.target.value;
    if (input === "Letter(s)") {
      input = "";
    }
    let output = "string";
    if (this.state.dropdown === "Contains") {
      output = { $like: "%" + input + "%" };
    } else if (this.state.dropdown === "Does Not Contain") {
      output = { $notlike: "!%" + input + "%" };
    } else if (this.state.dropdown === "Starts With") {
      output = { $like: input + "%" };
    } else if (this.state.dropdown === "Does Not Start With") {
      output = { $notlike: "!" + input + "%" };
    } else if (this.state.dropdown === "Ends With") {
      output = { $like: "%" + input };
    } else if (this.state.dropdown === "Does Not End With") {
      output = { $notlike: "!%" + input };
    }
    await this.setState({ input: input, output: output });
    await this.props.appendOutput(this.props.nth, output);
    this.props.checkErroroneousInputs();
  };

  hideForm = async (e, r) => {
    await this.props.removeLetterRow(this.props.nth);
    this.props.checkErroroneousInputs();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.inputs !== this.props.inputs) {
      this.componentMount();
    }
    if (
      prevProps.inputs !== this.props.inputs &&
      this.props.inputs === "Letter(s)"
    ) {
      this.setState({ input: this.props.inputs, dropdown: "Letter Options" });
    }
  };

  componentDidMount = () => {
    this.componentMount();
  };

  componentMount = () => {
    if (
      this.props.inputs &&
      !this.props.inputs.includes("Letter(s)") &&
      this.props.inputs !== "string"
    ) {
      let inputs = this.props.inputs.replace(/%/g, "");
      inputs = inputs.replace("!", "");

      let dropdowns = "Letter Options";
      if (
        this.props.inputs.charAt(0) === "%" &&
        this.props.inputs.charAt(this.props.inputs.length - 1) === "%"
      ) {
        dropdowns = "Contains";
      } else if (this.props.inputs.charAt(0) === "!") {
        if (this.props.inputs.substr(-1) === "%") {
          if (this.props.inputs.charAt(1) === "%") {
            dropdowns = "Does Not Contain";
          } else {
            dropdowns = "Does Not Start With";
          }
        } else {
          dropdowns = "Does Not End With";
        }
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

  handleKeyPress(e) {
    if (e.keyCode === 13) {
      e.target.blur();
      //Write you validation logic here
    }
  }

  render() {
    return (
      <div className="max-width my-2">
        <div className="row justify-content-center mx-auto">
          <form className="form-inline letters mb-0">
            <div className="ml-1">
              <button
                className={
                  this.state.dropdown !== "Letter Options"
                    ? `btn btn-secondary dropdown-letters dropdown-toggle ml-0 px-1 pb-2 my-0 ${this.props.dropdownClass}`
                    : `btn btn-secondary dropdown-letters dropdown-toggle ml-0 px-1 pb-2 grey my-0 ${this.props.dropdownClass}`
                }
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
                {this.state.itemArray.map((item) => (
                  <button
                    type="button"
                    className="dropdown-item"
                    href="#"
                    key={item.id}
                    onClick={() => this.updateLetterOptions(item.title)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
            <label className="ml-1 my-auto">
              <input
                type="text"
                onKeyDown={(e) => this.handleKeyPress(e)}
                className={
                  this.state.input !== "Letter(s)"
                    ? `form-control letter-input letter-input-${this.props.nth} ${this.props.inputClass}`
                    : `form-control letter-input grey letter-input-${this.props.nth} ${this.props.inputClass}`
                }
                onChange={(e) => this.updateOutput(e)}
                onClick={(e) => (e.target.value = "")}
                value={this.state.input}
              />
            </label>
          </form>
          <button
            type="button"
            className="close text-white ml-1 small"
            style={{ paddingRight: this.props.marg }}
            onClick={(e) => this.hideForm(e, this.props.nth)}
          >
            {" "}
            &times;
          </button>
          {this.props.nth === 0 && (
            <div className="mx-0 small align-self-center">
              <button type="button" className="info text-white mx-0 pr-0 pl-1">
                <i
                  className="fas fa-info-circle"
                  onClick={() => this.props.updateModal("letter")}
                />
              </button>
            </div>
          )}
        </div>
        <div className="red-text small">{this.props.errorMessage}</div>
      </div>
    );
  }
}

export default LetterForm;
