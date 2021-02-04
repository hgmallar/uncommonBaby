import React from "react";

const Landing = () => {
  return (
    <div className="row text-center mx-0">
      <div className="col py-sm-5 py-2">
        <div className="py-1 my-1">
          <a href="/name">
            <button
              type="button"
              className="btn btn-secondary p-2 submit font-weight-bold m-0"
            >
              Search by Name/Letter
            </button>
          </a>
        </div>
        <div className="py-1 my-1">
          <a href="/popularity">
            <button
              type="button"
              className="btn btn-secondary p-2 submit font-weight-bold m-0"
              //onClick={(e) => this.checkErroroneousInputs()}
            >
              Search by Popularity
            </button>
          </a>
        </div>
        <div className="py-1 my-1">
          <a href="/advanced">
            <button
              type="button"
              className="btn btn-secondary p-2 submit font-weight-bold m-0"
              //onClick={(e) => this.checkErroroneousInputs()}
            >
              Advanced Search
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
