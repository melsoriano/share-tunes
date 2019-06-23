import React, { useContext, Fragment } from 'react';
import { Router, Link } from '@reach/router';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import Home from '../components/home';
import Join from '../components/join';
import Create from '../components/create';
import TuneRoom from '../components/tuneroom';
import AddSong from '../components/addsong';
import { ThemeContext } from '../context/themeContext';

const Section = styled.section`
  margin: 0 auto;
  padding: 170px 0;
  max-width: 1000px;
`;

const ReactRouter = () => {
  const { mode } = useContext(ThemeContext);

  // ThemeProvider gets mode from the context wrapper and passes it down to the rest of the application through the outer router component. Since this can't be done in around the root <App /> component, the router component will serve as it's 'proxy'
  return (
    <ThemeProvider theme={mode}>
      <Section className="container">
        <GlobalStyle />
        <Fragment>
          <Router>
            <Home path="/" />
            <Create path="/create" />
            <Join path="/join" />
            <AddSong path="/add" />
            <TuneRoom path="/tuneroom" />
          </Router>
        </Fragment>
      </Section>
    </ThemeProvider>
  );
};

export default ReactRouter;
