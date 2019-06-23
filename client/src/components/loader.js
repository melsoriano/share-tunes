import React from 'react';
import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  0% {
	  transform: scale(1);
	  background-color: ${props => props.theme.colors.buttonFill};
	}
	20% {
	  transform: scale(1, 2.2);
	  background-color: #FFF;
	}
	40% {
	  transform: scale(1);
	  background-color: ${props => props.theme.colors.buttonFill};
	}
`;

const LoaderContainter = styled.div`
  div:nth-child(1) {
    animation-delay: 0;
  }
  div:nth-child(2) {
    animation-delay: 0.09s;
  }
  div:nth-child(3) {
    animation-delay: 0.18s;
  }
  div:nth-child(4) {
    animation-delay: 0.27s;
  }
  div:nth-child(5) {
    animation-delay: 0.36s;
  }
`;

const LoaderBars = styled.div`
  display: inline-block;
  margin: 1.5px;
  width: 5px;
  height: 25px;
  border-radius: 4px;
  animation: ${loading} 1.5s ease-in-out infinite;
  background-color: ${props => props.theme.colors.buttonFill};
`;

const Loader = () => (
  <LoaderContainter>
    <LoaderBars />
    <LoaderBars />
    <LoaderBars />
    <LoaderBars />
    <LoaderBars />
  </LoaderContainter>
);

export default Loader;
