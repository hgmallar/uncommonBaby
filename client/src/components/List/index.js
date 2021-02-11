import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./styles.css";

class List extends Component {
  renderList() {
    let newArray = this.props.results.slice(0, this.props.count);
    return (
      <div className="col-12">
        <ol>
          {newArray.map((result) => (
            <li key={result.id}>
              <h4
                onClick={(e) =>
                  this.props.nameClicked(result.Name, result.Gender, e)
                }
                className="name"
              >
                {result.Name}{" "}
                {result.Gender === "M"
                  ? "- male"
                  : result.Gender === "F"
                  ? "- female"
                  : ""}
              </h4>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.updateLoad();
  }

  render() {
    return (
      <div>
        <InfiniteScroll
          dataLength={this.props.count}
          next={() => {
            this.props.increaseCount();
          }}
          hasMore={this.props.loading}
          loader={<h4>Loading...</h4>}
        >
          {this.renderList()}
        </InfiniteScroll>
      </div>
    );
  }
}

export default List;
