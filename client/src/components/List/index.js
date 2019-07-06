import React, { Component } from "react";
import InfiniteLoader from 'react-infinite-loader'
import "./styles.css";

class List extends Component {
    renderList() {
        let newArray = this.props.results.slice(0, this.props.count);
        return (
            <div className="col-12">
                <ol>
                    {newArray.map(result => (
                        <li key={result.id}>
                            <h4 onClick={e => this.props.nameClicked(result.Name, result.Gender, e)} className="text-center">{result.Name} {(result.Gender === "M") ? "- male" : "- female"}</h4>
                        </li>
                    ))}
                </ol>
            </div>
        )
    }

    componentWillUnmount() {
        this.props.updateLoad();
    }

    render() {

        return (
            <div>
                {this.renderList()}
                {(this.props.loading) &&
                    <InfiniteLoader rowCount={this.props.total} onVisited={() => {
                        if ((this.props.results.length > 0) && (this.props.results.length > this.props.count)) {
                            this.props.increaseCount();
                            this.renderList();
                        }
                        else if ((this.props.results.length > 0) && (this.props.results.length === this.props.count)) {
                            this.props.increaseResults();
                            this.renderList();
                        }
                        else {
                            this.props.updateLoad();
                        }
                    }} />}
            </div>
        );
    }
}

export default List;