import React, { useState, useEffect } from 'react';
import { fbaseApp, tempApp } from '../firebase/config';

function Login() {
  const [user, setUser] = useState({ user: null });

  useEffect(() => {
    fetch('http://localhost:8080/login', {
      mode: 'cors',
      credentials: 'include',
      redirect: 'follow',
      headers: {
        Accept: 'Authorization',
      },
    })
      .then(res => {
        return res.json();
      })
      .then(body => {
        console.log(body);
        if (!body.errorMessage) {
          const { firebaseToken, accessToken, uid, email } = body.data;
          // We sign in via a temporary Firebase app to update the profile.
          tempApp
            .auth()
            .signInWithCustomToken(firebaseToken)
            .then(async user => {
              // Saving the Spotify email & access token to firestore
              const tasks = [
                tempApp
                  .firestore()
                  .doc(`users/${uid}`)
                  .set({
                    email,
                    accessToken,
                  }),
              ];
              // Wait for completion of above tasks.
              return Promise.all(tasks).then(() => {
                Promise.all([
                  fbaseApp.auth().signInWithCustomToken(firebaseToken),
                ]).then(function() {
                  console.log('body>>>', body);
                  setUser(body);
                });
              });
            });
        } else {
          return 'nope';
        }
      });
  }, []);

  function onSignInButtonClick() {
    // Open the Auth flow in a popup.
    window.open(
      'http://localhost:8080/redirect',
      'firebaseAuth',
      'height=315,width=400'
    );
  }

  return (
    <div id="login">
      {!user.data ? (
        <div>
          <h1>First, authenticate with spotify</h1>
          <button onClick={() => onSignInButtonClick()}>
            LOGIN WITH SPOTIFY
          </button>
        </div>
      ) : (
        <div>
          <h2>you are logged in :)</h2>
        </div>
      )}
    </div>
  );
}

export default Login;
