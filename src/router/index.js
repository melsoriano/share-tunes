import React from "react";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";

import Home from "../components/home";
import Login from "../components/login";

const ReactRouter = () => (
  <div>
    <ul>
      <li>
        <Link to="/">Login</Link>
      </li>
      <li>
        <Link to="home">Home</Link>
      </li>
    </ul>
    <hr />
    <Router>
      <Login path="/" />
      <Home path="/home" />
    </Router>
  </div>
);

export default ReactRouter;
