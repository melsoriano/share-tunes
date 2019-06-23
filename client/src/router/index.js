import React, { useContext } from 'react';
import { Router, Link } from '@reach/router';
import { ThemeProvider } from 'styled-components';

import Home from '../components/home';
// import Login from '../components/login';
import Join from '../components/join';
import Create from '../components/create';
import TuneRoom from '../components/tuneroom';
import AddSong from '../components/addsong';

import { ThemeContext } from '../context/themeContext';

const ReactRouter = () => {
  const { mode } = useContext(ThemeContext);

  // ThemeProvider gets mode from the context wrapper and passes it down to the rest of the application through the outer router component. Since this can't be done in around the root <App /> component, the router component will serve as it's 'proxy'
  return (
    <ThemeProvider theme={mode}>
      <div>
        {/* <nav>
          <Link to="/">Home</Link>&nbsp;
          <Link to="login">Login</Link>&nbsp;
          <Link to="tuneroom">Tuneroom</Link>&nbsp;
        </nav>
        <hr /> */}
        <Router>
          <Home path="/" />
          {/* <Login path="/login" /> */}
          <Create path="/create" />
          <Join path="/join" />
          <AddSong path="/add" />
          <TuneRoom path="/tuneroom" />
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default ReactRouter;
