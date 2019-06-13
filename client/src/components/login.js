import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FirebaseAuth, db } from '../api/firebase/firebaseConfig';
import { spotifyAuthEndpoint, SpotifyApi } from '../api/spotify/spotifyConfig';
import { getCookie, getUrlParameter } from '../utils/helpers';

// TODO:
// After login, figure out a way to pass the SpotifyAccessToken without putting it in localStorage. handle in userContext?

// import contexts
import { FirebaseContext } from '../context/firebaseContext';
import { SpotifyContext } from '../context/spotifyContext';

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const spotifyAuthCode = getUrlParameter('code');

  useEffect(() => {
    // Check Firebase if user is logged in and session is still valid.
    // If session is not valid, user will need to login again.
    FirebaseAuth.onAuthStateChanged(authUser => {
      if (authUser) {
        // get user data from firestore db
        authUser.getIdToken().then(idToken => {
          const { uid, email, metadata } = authUser;
          // create an object to merge authUser data (email, uid) with data from db
          const userData = {
            uid,
            email,
            idToken,
            lastSignInTime: metadata.lastSignInTime,
            creationTime: metadata.creationTime,
          };
          // I think setting user to localStorage would work best here:
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('idToken', idToken);
        });
      }
    });
    // If a user logs in and generates a new Spotify access code, send the code to the server to save to db and reauthenticate.
    if (spotifyAuthCode && !isAuthenticated) {
      // removed csrfToken parameter, see line 15
      axios.post('/auth/token', { spotifyAuthCode }).then(async response => {
        // adding this to localStorage for now, but should probably think of a more secure solution before deployment
        localStorage.setItem(
          'SpotifyAccessToken',
          response.data.spotifyAccessToken
        );
        FirebaseAuth.setPersistence('local').then(async () => {
          await FirebaseAuth.signInWithCustomToken(response.data.firebaseToken)
            .then(() => setIsAuthenticated(true))
            .catch(error => error);
        });
      });
    }
  });

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
