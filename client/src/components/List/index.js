import React from "react";

function List(props) {

    return (
        <ul>
            {props.results.map(result => (
                <li key={result.id}>
                    <h4 className="text-center">{result.Name}</h4>
                </li>
            ))}
        </ul>
    );
}

export default List;