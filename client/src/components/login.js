import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FirebaseAuth, db } from '../api/firebase/firebaseConfig';
import { spotifyAuthEndpoint, SpotifyApi } from '../api/spotify/spotifyConfig';
import { getUrlParameter } from '../utils/helpers';

// TODO:
// After login, figure out a way to pass the SpotifyAccessToken without putting it in localStorage. handle in userContext?

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const spotifyAuthCode = getUrlParameter('code');

  useEffect(() => {
    const authListener = () => {
      FirebaseAuth.onAuthStateChanged(authUser => {
        if (authUser) {
          db.doc(`users/${authUser.uid}`)
            .get()
            .then(snapshot => {
              const dbUser = snapshot.data();
              console.log(dbUser);

              // merge auth and db user
              const userData = {
                uid: authUser.uid,
                email: authUser.email,
                ...dbUser,
              };
              // I think setting user to localStorage would work best here:
              localStorage.setItem('user', JSON.stringify(userData));
            });
        }
      });
    };

    axios.post('/auth/token', { spotifyAuthCode }).then(async response => {
      FirebaseAuth.setPersistence('local').then(async () => {
        await FirebaseAuth.signInWithCustomToken(response.data.firebaseToken)
          .then(() => setIsAuthenticated(true))
          .catch(error => error);
      });
    });
    authListener();
  }, [spotifyAuthCode]);

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
