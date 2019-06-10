import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FirebaseAuth } from '../api/firebase/firebaseConfig';
import { spotifyAuthEndpoint } from '../api/spotify/spotifyConfig';
import { getCookie, getUrlParameter } from '../utils/helpers';

// TODO:
// Create one Context Provider for user
// import { FirebaseContext } from '../context/firebaseContext';
import { SpotifyContext } from '../context/spotifyContext';

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { spotifyToken, setSpotifyToken } = useContext(SpotifyContext);
  const spotifyAuthCode = getUrlParameter('code');

  useEffect(() => {
    const csrfToken = getCookie('csrfToken');
    // Check Firebase if user is logged in and session is still valid.
    // If session is not valid, user will need to login again.
    FirebaseAuth.onAuthStateChanged(authUser => {
      if (authUser) {
        authUser.getIdToken().then(idToken => {
          axios
            .post('/auth/session', { idToken, csrfToken })
            .then(response => {
              setSpotifyToken(response.data.user);
              setIsAuthenticated(response.data.isAuthenticated);
            })
            .catch(error => error);
        });
      }
    });
    // If a user logs in and generates a new Spotify access code, send the code to the server to save to db and reauthenticate.
    if (spotifyAuthCode && !isAuthenticated) {
      axios
        .post('/auth/token', { spotifyAuthCode, csrfToken })
        .then(async response => {
          FirebaseAuth.setPersistence('local').then(async () => {
            await FirebaseAuth.signInWithCustomToken(
              response.data.firebaseToken
            )
              .then(() => setIsAuthenticated(true))
              .catch(error => error);
          });
        });
    }
  }, [isAuthenticated, setSpotifyToken, spotifyAuthCode]);

  return (
    <div id="login">
      {/** Leaving this link outside of conditional for testing */}
      <a href={spotifyAuthEndpoint}>Login to Spotify</a>
      {!isAuthenticated ? (
        <div>please log in</div>
      ) : (
        <div>
          <h3>
            YOU ARE AUTHENTICATED! ^o^
            <br />
            <br />
            TO DO:
            <br />
            Redirect to playlist page when `isAuthenticated` is true :)
          </h3>
        </div>
      )}
    </div>
  );
}

export default Login;
