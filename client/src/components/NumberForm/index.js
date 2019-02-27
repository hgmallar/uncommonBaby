import React, { Component } from "react";
import InputRange from "react-input-range";
import API from "../../utils/API";
import "./styles.css";
import "react-input-range/lib/css/index.css";

class NumberForm extends Component {
    state = {
        numericalOptions: "Numerical Options",
        years: "Year(s)",
        yearCol: "210x",
        startMinVal: 20,
        startMaxVal: 80,
        minValue: 1,
        maxValue: 100,
        dropdown: "",
        slider: "", 
        output: ""
    }

    updateNumericalOptions = (input, evt) => {
        evt.preventDefault();
        let max = 100;
        let startMin = 20;
        let startMax = 80;
        let query = input + "_" + this.state.yearCol;
        if (input === "Rank") {
            //set max to the highest number in the column for that rank decade
            API.getCount(query).then(res => {
                max = res.data;
                startMin = Math.round(res.data * .2);
                startMax = Math.round(res.data * .8);
                this.setState({ numericalOptions: input, maxValue: max, startMinVal: startMin, startMaxVal: startMax })
            }).catch(err => {
                console.log("count error: ");
                console.log(err);
            });
        }
        else if (input === "Count") {
            //set max to the highest number in the column for that count decade
            API.getCount(query).then(res => {
                max = res.data;
                startMin = Math.round(res.data * .2);
                startMax = Math.round(res.data * .8);
                this.setState({ numericalOptions: input, maxValue: max, startMinVal: startMin, startMaxVal: startMax })
            }).catch(err => {
                console.log("count error: ");
                console.log(err);
            });
        }
        else {
            this.setState({ numericalOptions: input, maxValue: max, startMinVal: startMin, startMaxVal: startMax })
        }
    }

    updateYearOptions = (input1, input2, evt) => {
        evt.preventDefault();
        let output = input2 + "_" + this.state.dropdown + "_" + this.state.slider;
        this.setState({ years: input1, yearCol: input2, output: output})
        this.props.appendOutput(this.props.className, output);
    }

    updateOutput = (evt) => {
        evt.preventDefault();
        let input = evt.target.value;
        let output = this.state.dropdown + "_" + input;
        this.setState({input: input, output: output});
        this.props.appendOutput(this.props.className, output);
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
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1880", "188x", e)}>1880s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1890", "189x", e)}>1890s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1900", "190x", e)}>1900s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1910", "191x", e)}>1910s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1920", "192x", e)}>1920s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1930", "193x", e)}>1930s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1940", "194x", e)}>1940s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1950", "195x", e)}>1950s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1960", "196x", e)}>1960s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1970", "197x", e)}>1970s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1980", "198x", e)}>1980s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1990", "199x", e)}>1990s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2000", "200x", e)}>2000s</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2010", "201x", e)}>2010s</a>
                        </div>
                    </div>

                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.numericalOptions}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#" onClick={e => this.updateNumericalOptions("Rank", e)}>Rank</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateNumericalOptions("Percentile", e)}>Percentile</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateNumericalOptions("Count", e)}>Count</a>
                        </div>
                    </div>

                    <InputRange
                        className="slider"
                        maxValue={this.state.maxValue}
                        minValue={this.state.minValue}
                        value={{ min: this.state.startMinVal, max: this.state.startMaxVal }}
                        onChange={value => this.setState({ value })} />

                </form>
            </div>

        );
    }
};

export default NumberForm;
