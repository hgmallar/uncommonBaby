import React, { Component } from "react";
import Wrapper from "../components/Wrapper";

class About extends Component {
  render() {
    return (
      <Wrapper>
        <div className="row mx-auto">
          <div className="col-md-9 mx-auto">
            <p className="mx-2 p-2 yellow-text">
              Unpopular Baby originally started as a python script that parsed
              the Social Security Administration Database to come up with a list
              of possible names to name our son, Bryce. It has morphed into a
              more user friendly web application based on friend requests. Happy
              searching!
            </p>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default About;
