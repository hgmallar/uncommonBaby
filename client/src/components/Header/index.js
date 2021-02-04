import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";

import "./styles.css";

class Header extends Component {
  render() {
    return (
      <div className="d-flex justify-content-between header-border">
        <div id="outer-container">
          <Menu outerContainerId={ "outer-container" } >
            <a className="menu-item" href="/">
              Home
            </a>

            <a className="menu-item" href="/name">
              Letter Search
            </a>

            <a className="menu-item" href="/popularity">
              Popularity Search
            </a>

            <a className="menu-item" href="/advanced">
              Advanced Search
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
        </div>
        <div className="text-center justify-content-center pb-0">
          <a href="/" className="no-underline">
            <h1>
              <span className="text1"> Unpopular Baby Names </span>
            </h1>

            <h5 className="subhead">
              A tool to find names based on popularity
            </h5>
          </a>
        </div>
        <img
          src="/assets/images/baby_change_icon.png"
          alt="baby in diaper"
          className="logo mt-2 mr-3"
        />
      </div>
    );
  }
}

export default Header;
