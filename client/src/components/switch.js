import React, { useEffect, useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from '../context/themeContext';
import theme from '../styles/theme';

const ThemeSwitch = () => {
  // import context and assign
  let { setMode } = useContext(ThemeContext);
  let { switchState, setSwitch } = useContext(ThemeContext);

  // on state change, modify context
  useEffect(() => {
    if (switchState) {
      setMode(theme.dark);
      // add theme into localStorage to persist through refresh
      localStorage.setItem('switchState', JSON.stringify(true));
      localStorage.setItem('mode', 'dark');
    } else {
      setMode(theme.light);
      localStorage.setItem('switchState', JSON.stringify(false));
      localStorage.setItem('mode', 'light');
    }
  });

  // api: https://www.npmjs.com/package/react-switch
  return (
    <label>
      <Switch
        checked={switchState}
        onChange={() => {
          switchState ? setSwitch(false) : setSwitch(true);
        }}
        onColor="#86d3ff"
        onHandleColor="#2693e6"
        handleDiameter={30}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={20}
        width={48}
        className="react-switch"
        id="material-switch"
      />
    </label>
  );
};

export default ThemeSwitch;
