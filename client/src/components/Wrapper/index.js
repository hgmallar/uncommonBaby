import React from "react";

function Wrapper(props) {
  return <div className="mx-auto">{props.children}</div>;
}

export default Wrapper;
