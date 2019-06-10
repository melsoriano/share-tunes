import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import and wrap <App /> with contexts
import { ThemeProvider } from './context/themeContext';
import { SpotifyProvider } from './context/spotifyContext';
import { FirebaseProvider } from './context/firebaseContext';

ReactDOM.render(
  <ThemeProvider>
    <SpotifyProvider>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </SpotifyProvider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
