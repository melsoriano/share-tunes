import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from "../components/home";
import Login from "../components/login";

const ReactRouter = () => {
  return (
    <Router>
      <div>
        <Link to="/">Return to login</Link>
        <hr />
      </div>
      <Route exact path="/" component={Login} />
      <Route path="/home" component={Home} />
    </Router>
  );
};

export default ReactRouter;
