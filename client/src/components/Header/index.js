import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";

import "./styles.css";

class Header extends Component {
  
  render() {
    return (
      <div>
        <Menu noOverlay>
          <a className="menu-item" href="/">
            Search
          </a>

          <a className="menu-item" href="/about">
            About
          </a>

          <a className="menu-item" href="/example">
            Example
          </a>

          <a className="menu-item" href="/contact">
            Contact
          </a>

        </Menu>
        <header className="navbar text-center col-12 justify-content-center pb-0">
          <a href="/" className="no-underline">
            <h1>
              <i className="fas fa-baby-carriage" />
              <span className="text1"> Unpopular Baby Names </span>
              <i className="fas fa-baby" />
            </h1>
          </a>
          <h4 className="subhead text-center col-12">
            A tool to find names based on popularity
          </h4>
        </header>
      </div>
    );
  }
}

export default Header;
