import React, { Component } from "react";
import InputRange from "react-input-range";
import "./styles.css";
import "react-input-range/lib/css/index.css";

class LetterForm extends Component {
    state = {
        letterOptions: "Letter Options",
        numericalOptions: "Numerical Options",
        years: "Year(s)",
        value: { min: 500, max: 2000 }
    }

    updateLetterOptions = (input, evt) => {
        evt.preventDefault();
        this.setState({ letterOptions: input })
    }

    updateNumericalOptions = (input, evt) => {
        evt.preventDefault();
        this.setState({ numericalOptions: input })
    }

    updateYearOptions = (input, evt) => {
        evt.preventDefault();
        this.setState({ years: input })
    }

    render() {

        return (
            <div className="letter-form">
                <form className="form-inline">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.letterOptions}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Contains", e)}>Contains</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Starts With", e)}>Starts With</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Ends With", e)}>Ends With</a>
                        </div>
                    </div>

                    <label>
                        <input type="text" className="form-control letter-input" id={this.props.id} placeholder="Letter(s)" />
                    </label>
                </form>
            </div>

        );
    }
};

export default LetterForm;
