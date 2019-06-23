import React from 'react';
import styled from 'styled-components';
import ReactRouter from './router';
import { mixins } from './styles';
import ThemeSwitch from './components/switch';

const Main = styled.main`
  ${mixins.sidePadding};
  margin: 0 auto;
  width: 100%;
`;

const SwitchContainer = styled.div`
  margin: 20px;
  text-align: right;
`;

function App() {
  return (
    <Main className="App">
      <SwitchContainer>
        <ThemeSwitch />
      </SwitchContainer>
      <ReactRouter />
    </Main>
  );
}

export default App;
