import React, { Component } from "react";
import "./styles.css";
import "react-input-range/lib/css/index.css";

class LetterForm extends Component {
    state = {
        letterOptions: "Letter Options",
        dropdown: "",
        input: "",
        output: ""
    }

    updateLetterOptions = (letterInput, evt) => {
        evt.preventDefault();
        let output = "";
        if (letterInput === "Contains") {
            output = {$like: "%" + this.state.input + "%"}
        }
        else if (letterInput === "Starts With") {
            output = {$like: this.state.input + "%"}
        }
        else if (letterInput === "Ends With") {
            output = {$like: "%" + this.state.input}
        }
        this.setState({ letterOptions: letterInput, dropdown: letterInput, output: output });
        this.props.appendOutput(this.props.className, output);
    }

    updateOutput = (evt) => {
        evt.preventDefault();
        let input = evt.target.value;
        let output = "";
        if (this.state.dropdown === "Contains") {
            output = {$like: "%" + input + "%"}
        }
        else if (this.state.dropdown === "Starts With") {
            output = {$like: input + "%"}
        }
        else if (this.state.dropdown === "Ends With") {
            output = {$like: "%" + input}
        }
        this.setState({input: input, output: output});
        this.props.appendOutput(this.props.className, output);
    }


    hideForm = () => {
        this.props.removeLetterRow(this.props.className);
    }

    render() {

        return (
            <div className="letter-form row justify-content-center">
                <form className="form-inline">
                    <div className="dropdown">
                        <button className={`btn btn-secondary dropdown-toggle-${this.props.className} ${this.props.dropdownClass}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.letterOptions}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Contains", e)}>Contains</button>
                            <button className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Starts With", e)}>Starts With</button>
                            <button className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Ends With", e)}>Ends With</button>
                        </div>
                    </div>

                    <label>
                        <input type="text" className={`form-control letter-input letter-input-${this.props.className} ${this.props.inputClass}`} onChange={e => this.updateOutput(e)} placeholder="Letter(s)" />
                    </label>
                    <button type="button" className="close text-white ml-2" onClick={this.hideForm}> &times;</button>
                </form>
            </div>

        );
    }
};

export default LetterForm;
