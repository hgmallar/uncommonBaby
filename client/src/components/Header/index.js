import React from "react";
import "./styles.css";

function Header() {
  return (
    <header className="navbar text-center col-12 justify-content-center pb-0">
      <a href="/" className="no-underline">
        <h1>
          <i className="fas fa-baby-carriage" />
          <span className="text1"> Unpopular Baby Names </span>
          <i className="fas fa-baby" />
        </h1>
      </a>
    </header>
  );
}

export default Header;
