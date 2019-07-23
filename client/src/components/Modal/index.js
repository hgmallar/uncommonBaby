import React, { Component } from "react";
import "./styles.css";
import { LineChart } from "react-chartkick";
import "chart.js";

class Modal extends Component {
  state = {
    status: "count",
    disclaimer: "*** higher count is more popular ***"
  };

  render() {
    const showHideStyle = this.props.show ? "block" : "none";
    const gender = this.props.gender === "M" ? " - Male" : this.props.gender === "F" ? " - Female" : " - Both";
    const heading = this.props.title
      ? this.props.title
      : `${this.props.name}${gender}`;

    const prettyMessage = this.props.messages.map((message, key) => (
      <p key={message.cat}>
        <span className="font-weight-bold">{message.cat}</span>{" "}
        {message.message}
      </p>
    ));
    return (
      <div className="modal" role="dialog" style={{ display: showHideStyle }}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title mx-auto">{heading}</h3>
            <button
              type="button"
              className="close white p-0 m-0"
              onClick={this.props.handleClose}
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {this.props.title ? (
            <div className="modal-body">
              <div>{prettyMessage}</div>
              <small className="font-weight-bold mx-auto">
                *** A submission will satisfy all search terms. ***
              </small>
              {}
            </div>
          ) : this.state.status === "count" ? (
            <div className="modal-body">
              <p> All Time Count = {this.props.count}</p>
              <LineChart
                colors={["#547980", "#547980"]}
                data={{
                  "1880s": this.props.dataArr1[0],
                  "1890s": this.props.dataArr1[1],
                  "1900s": this.props.dataArr1[2],
                  "1910s": this.props.dataArr1[3],
                  "1920s": this.props.dataArr1[4],
                  "1930s": this.props.dataArr1[5],
                  "1940s": this.props.dataArr1[6],
                  "1950s": this.props.dataArr1[7],
                  "1960s": this.props.dataArr1[8],
                  "1970s": this.props.dataArr1[9],
                  "1980s": this.props.dataArr1[10],
                  "1990s": this.props.dataArr1[11],
                  "2000s": this.props.dataArr1[12],
                  "2010s": this.props.dataArr1[13]
                }}
              />
              <small className="font-weight-bold mx-auto">{this.state.disclaimer}</small>
            </div>
          ) : (
            <div className="modal-body">
              <p> All Time Rank = {this.props.rank}</p>
              <LineChart
                colors={["#547980", "#547980"]}
                data={{
                  "1880s": this.props.dataArr2[0],
                  "1890s": this.props.dataArr2[1],
                  "1900s": this.props.dataArr2[2],
                  "1910s": this.props.dataArr2[3],
                  "1920s": this.props.dataArr2[4],
                  "1930s": this.props.dataArr2[5],
                  "1940s": this.props.dataArr2[6],
                  "1950s": this.props.dataArr2[7],
                  "1960s": this.props.dataArr2[8],
                  "1970s": this.props.dataArr2[9],
                  "1980s": this.props.dataArr2[10],
                  "1990s": this.props.dataArr2[11],
                  "2000s": this.props.dataArr2[12],
                  "2010s": this.props.dataArr2[13]
                }}
              />
              <small className="font-weight-bold mx-auto">{this.state.disclaimer}</small>
            </div>
          )}
          {this.props.title ? (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.props.handleClose}
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="modal-footer space-around">
              <h5
                className="hover"
                onClick={() => this.setState({ status: "count", disclaimer: "*** higher count is more popular ***" })}
              >
                {" "}
                Count{" "}
              </h5>
              <h5
                className="hover"
                onClick={() => this.setState({ status: "rank", disclaimer: "*** lower rank is more popular ***"  })}
              >
                {" "}
                Rank{" "}
              </h5>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.props.handleClose}
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Modal;
