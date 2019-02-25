import React, { Component } from "react";
import InputRange from "react-input-range";
import "./styles.css";
import "react-input-range/lib/css/index.css";

class NumberForm extends Component {
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
            <div className="form">
                <form className="form-inline">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.years}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1880", e)}>1880s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1890", e)}>1890s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1900", e)}>1900s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1910", e)}>1910s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1920", e)}>1920s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1930", e)}>1930s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1940", e)}>1940s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1950", e)}>1950s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1960", e)}>1960s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1970", e)}>1970s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1980", e)}>1980s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1990", e)}>1990s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2000", e)}>2000s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2010", e)}>2010s</a>
                        </div>
                    </div>

                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.numericalOptions}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#" onClick={e => this.updateNumericalOptions("Rank", e)} value="ltr">Rank</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateNumericalOptions("Percentage", e)} value="gtr">Percentage</a>
                        </div>
                    </div>

                    <InputRange
                        className="slider"
                        maxValue={2353}
                        minValue={1}
                        value={this.state.value}
                        onChange={value => this.setState({ value })} />

                </form>
            </div>

        );
    }
};

export default NumberForm;
