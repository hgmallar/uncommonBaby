import React, { Component } from "react";
import Dropdown from 'react-dropdown';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "./styles.css";

class Form extends Component {
    state = {
        placeholder: "Number",
        letterOptions: "Letter Options",
        numericalOptions: "Numerical Options",
        years: "Year(s)"
    }

    updatePlaceholder = (input, evt) => {
        evt.preventDefault();
        let value = "";
        if (input === "rank") {
            value = "Numerical Rank"
        }
        else if (input === "percentage") {
            value = "Numerical %"
        }
        this.setState({ placeholder: value })
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
                            {this.state.letterOptions}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Contains", e)}>Contains</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Starts With", e)}>Starts With</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateLetterOptions("Ends With", e)}>Ends With</a>
                        </div>
                    </div>

                    <label>
                        <input type="text" className="form-control" id={this.props.id} placeholder="Letter(s)" />
                    </label>

                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.numericalOptions}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#" onClick={e => { this.updatePlaceholder("rank", e); this.updateNumericalOptions("Less Than Rank", e) }} value="ltr">Less Than Rank</a>
                            <a className="dropdown-item" href="#" onClick={e => { this.updatePlaceholder("rank", e); this.updateNumericalOptions("Greater Than Rank", e) }} value="gtr">Greater Than Rank</a>
                            <a className="dropdown-item" href="#" onClick={e => { this.updatePlaceholder("percentage", e); this.updateNumericalOptions("Less Than Percentage", e) }} value="ltp">Less Than Percentage</a>
                            <a className="dropdown-item" href="#" onClick={e => { this.updatePlaceholder("percentage", e); this.updateNumericalOptions("Greater Than Percentage", e) }} value="gtp">Greater Than Percentage</a>
                        </div>
                    </div>
                    <label>
                        <input type="text" className="form-control" id={this.props.id} placeholder={this.state.placeholder} />
                    </label>

                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.years}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2010-Present", e)}>2010-Present</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2000-2009", e)}>2000-2009</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1990-1999", e)}>1990-1999</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2019", e)}>2019</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2018", e)}>2018</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2017", e)}>2017</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2016", e)}>2016</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2015", e)}>2015</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2014", e)}>2014</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2013", e)}>2013</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2012", e)}>2012</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2011", e)}>2011</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2010", e)}>2010</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2009", e)}>2009</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2008", e)}>2008</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2007", e)}>2007</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2006", e)}>2006</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2005", e)}>2005</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2004", e)}>2004</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2003", e)}>2003</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2002", e)}>2002</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2001", e)}>2001</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("2000", e)}>2000</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1999", e)}>1999</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1998", e)}>1998</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1997", e)}>1997</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1996", e)}>1996</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1995", e)}>1995</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1994", e)}>1994</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1993", e)}>1993</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1992", e)}>1992</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1991", e)}>1991</a>
                            <a className="dropdown-item" href="#" onClick={e => this.updateYearOptions("1990", e)}>1990</a>
                        </div>
                    </div>
                </form>
            </div>

        );
    }
};

export default Form;
