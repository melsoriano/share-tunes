import React, { useState } from 'react';
import theme from '../styles/theme';

// create instance of context
export const ThemeContext = React.createContext();

// create context provider
export const ThemeProvider = ({ children }) => {
  // check localStorage for theme mode. this is set by the switch toggle component
  // localStorage is needed to persist theme through page refresh and multiple tabs
  const [mode, setMode] = useState(() => {
    if (localStorage.getItem('mode') === 'light') {
      return theme.light;
    }
    return theme.dark;
  });
  const [switchState, setSwitch] = useState(() => {
    if (localStorage.getItem('switchState')) {
      return JSON.parse(localStorage.getItem('switchState'));
    }
    return false;
  });
  return (
    // inject state into the provider, and pass along to children components
    <ThemeContext.Provider value={{ mode, setMode, switchState, setSwitch }}>
      {children}
    </ThemeContext.Provider>
  );
};
