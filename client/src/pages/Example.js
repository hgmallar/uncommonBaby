import React, { Component } from "react";
import ReactPlayer from "react-player";
import Wrapper from "../components/Wrapper";

class Example extends Component {
  render() {
    return (
      <Wrapper>
        <div className="mx-auto text-center">
          <div className="my-auto mx-auto player-wrapper">
            <ReactPlayer
              url="https://youtu.be/Nf3nFYc1vcI"
              width="100%"
              height="100%"
              className="react-player"
            />
          </div>
          <p className="yellow-text p-2 image-size mx-auto">
            The following inputs search for a male name with a length between 1
            and 8 characters that begins with a B, contains a y, and was
            relatively unpopular in the 2000s and 2010s. Notice that multiple
            letter rows and multiple count rows are used to search. There were
            418 names that matched this search and they can now be further
            sorted using the dropdown menus that appear next to the submit
            button. Here the names are sorted from most to least popular of all
            time.
          </p>
          <img
            className="image-size"
            src="/assets/images/unpopbaby.PNG"
            alt="example search"
          />
          <p className="yellow-text p-2 image-size mx-auto">
            You can also click on the individual names returned in the list to
            view a graph of the popularity of each individual name over time.
          </p>
          <img
            className="image-size"
            src="/assets/images/data.PNG"
            alt="example name data"
          />
        </div>
      </Wrapper>
    );
  }
}

export default Example;
