import React, { useEffect, useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from '../context/themeContext';
import theme from '../styles/theme';
import { IconMoon, IconSun } from './icons';

const { colorOptions } = theme;

const ToggleSwitch = () => {
  // import context and assign
  const { setMode } = useContext(ThemeContext);
  const { switchState, setSwitch } = useContext(ThemeContext);

  // on state change, modify context
  useEffect(() => {
    if (switchState) {
      localStorage.setItem('mode', 'dark');
      localStorage.setItem('switchState', JSON.stringify(true));
      setMode(theme.dark);
      // add theme into localStorage to persist through refresh
    } else {
      localStorage.setItem('mode', 'light');
      localStorage.setItem('switchState', JSON.stringify(false));
      setMode(theme.light);
    }
  });

  return (
    <Switch
      checked={switchState}
      onChange={() => (switchState ? setSwitch(false) : setSwitch(true))}
      onColor={`${colorOptions.aqua}`}
      offColor={`${colorOptions.coral}`}
      handleDiameter={16}
      uncheckedIcon={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            paddingRight: 2,
          }}
        >
          <IconSun />
        </div>
      }
      checkedIcon={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            paddingRight: 2,
          }}
        >
          <IconMoon />
        </div>
      }
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      height={22}
      width={50}
      className="react-switch"
      id="small-radius-switch"
    />
  );
};

export default ToggleSwitch;
