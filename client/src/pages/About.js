import React, { Component } from "react";
import Wrapper from "../components/Wrapper";


class About extends Component {
  render() {
    return (
      <Wrapper>
        <p className="mx-2 p-2 yellow-text">Unpopular Baby originally started as a python script that parsed the Social Security Administration Database to come up with a list of possible names to name our son, Bryce.  It has morphed into a more user friendly web application based on friend requests.  Happy searching!</p>
      </Wrapper>
    );
  }
}

export default About;