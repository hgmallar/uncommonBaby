import React, { Component } from "react";
import Wrapper from "../components/Wrapper";

class Contact extends Component {
  render() {
    return (
      <Wrapper>
        <div className="container">
          <div className="row mx-auto">
            <div className="col-md-9 mx-auto">
              <form className="form-group mx-auto">
                <label>Name: </label>
                <input
                  type="name"
                  className="form-control inputs"
                  placeholder="Enter name"
                />
                <label>Email address: </label>
                <input
                  type="email"
                  className="form-control inputs"
                  placeholder="Enter email"
                />
                <label>Questions/Comments: </label>
                <textarea
                  className="form-control inputs"
                  rows="5"
                  placeholder="Questions/Comments/Requests"
                />
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-secondary px-1 ml-0 submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default Contact;
