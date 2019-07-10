import React, { Component } from "react";
import Wrapper from "../components/Wrapper";

class Example extends Component {
  render() {
    return (
      <Wrapper>
        <div className="mx-auto text-center">
          <img
            className="image-size"
            src="/assets/images/example1.PNG"
            alt="example search"
          />
          <p className="yellow-text p-2 image-size mx-auto">
            The above search searches for a male name with a length between 1
            and 8 characters that begins with a B, contains a y, and was
            relatively unpopular in the 2000s and 2010s.
          </p>
        </div>
      </Wrapper>
    );
  }
}

export default Example;
