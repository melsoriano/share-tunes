import React, { useContext } from 'react';
import { Router, Link } from '@reach/router';
import { ThemeProvider } from 'styled-components';

import Home from '../components/home';
import Login from '../components/login';
import TuneRoom from '../components/tuneroom';

import { ThemeContext } from '../context/themeContext';

const ReactRouter = () => {
  const { mode } = useContext(ThemeContext);

  // ThemeProvider gets mode from the context wrapper and passes it down to the rest of the application through the outer router component. Since this can't be done in around the root <App /> component, the router component will serve as it's 'proxy'
  return (
    <ThemeProvider theme={mode}>
      <div>
        <nav>
          <Link to="/">Login</Link>&nbsp;
          <Link to="home">Home</Link>&nbsp;
          <Link to="tuneroom">Tuneroom</Link>&nbsp;
        </nav>
        <hr />
        <Router>
          <Login path="/" />
          <Home path="/home" />
          <TuneRoom path="/tuneroom" />
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default ReactRouter;
