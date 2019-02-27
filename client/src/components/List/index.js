import React from "react";
import "./styles.css";

function List(props) {

    return (
        <ol>
            {props.results.map(result => (
                <li key={result.id}>
                    <h4 className="text-center">{result.Name} {(result.Gender === "M") ? "- male" : "- female"}</h4>
                </li>
            ))}
        </ol>
    );
}

export default List;