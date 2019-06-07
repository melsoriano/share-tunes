import React from 'react';
import styled from 'styled-components';

// styled components allow us to grab styles from the themeProvider object globally via props!
export const Greeting = styled.div`
  color: ${props => props.theme.colors.fontColor};
`;
function Home() {
  return <Greeting>This is Mercury</Greeting>;
}

export default Home;
