import React, { Component } from "react";
import Wrapper from "../components/Wrapper";
import Modal from "../components/Modal";
import API from "../utils/API";

class Contact extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    displayErrors: false,
    showModal: false,
    modalMessages: []
  };

  handleClose = () => {
    this.setState({
      showModal: false,
      dataArr1: [],
      dataArr2: [],
      modalMessages: [],
      name: "",
      count: 0,
      rank: 0
    });
  };

  resetForm() {
    document.getElementById("contact-form").reset();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      this.setState({ displayErrors: true });
      return;
    } else {
      this.setState({ displayErrors: false });
      const data = new FormData(event.target);

      data.set("name", data.get("name").trim());
      data.set("email", data.get("email").trim());
      data.set("comments", data.get("comments").trim());

      let query = {
        name: data.get("name"),
        email: data.get("email"),
        comments: data.get("comments")
      };

      API.send(query)
        .then(response => {
          if (response.data.msg === "success") {
            this.setState({
              modalMessages: [
                {
                  cat: "",
                  message: "Message sent!"
                }
              ],
              showModal: true
            });
            this.resetForm();
          } else if (response.data.msg === "fail") {
            this.setState({
              modalMessages: [
                {
                  cat: "",
                  message: "Message failed to send."
                }
              ],
              showModal: true
            });
          }
        })
        .catch(err => {
          console.log("contact error: ");
          console.log(err);
        });
    }
  }

  render() {
    const displayErrors = this.state.displayErrors;

    return (
      <Wrapper>
        <div className="container">
          <div className="row mx-auto">
            <div className="col-md-9 mx-auto">
              <form
                id="contact-form"
                onSubmit={this.handleSubmit}
                noValidate
                className={
                  displayErrors
                    ? "form-group mx-auto displayErrors"
                    : "form-group mx-auto"
                }
              >
                <label>Name: </label>
                <input
                  type="text"
                  name="name"
                  className="form-control inputs"
                  placeholder="Enter name"
                  required
                />
                <label>Email address: </label>
                <input
                  type="email"
                  name="email"
                  className="form-control inputs"
                  placeholder="Enter email"
                  required
                />
                <label>Questions/Comments: </label>
                <textarea
                  name="comments"
                  type="text"
                  className="form-control inputs"
                  rows="5"
                  placeholder="Questions/Comments/Requests"
                  required
                />
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-secondary px-1 ml-0 submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Modal
          show={this.state.showModal}
          handleClose={this.handleClose}
          title="Contact Form"
          messages={this.state.modalMessages}
        />
      </Wrapper>
    );
  }
}

export default Contact;
