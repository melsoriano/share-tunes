const express = require('express');
const router = express.Router();
const { SpotifyApi } = require('../config/index');

const {
  createOrUpdateFirebaseAccount,
  verifyUserIdToken,
  createUserSession,
  verifySession,
  revokeToken,
} = require('../firebase/firebaseApi');

router.post('/token', (req, res) => {
  const authCode = req.body.spotifyAuthCode;

  // Start the Spotify auth flow
  SpotifyApi.authorizationCodeGrant(authCode)
    .then(data => {
      const { access_token, refresh_token } = data.body;
      // Set the access token to send on each server request
      SpotifyApi.setAccessToken(access_token);
      // Get Spotify user information
      SpotifyApi.getMe().then(async userResults => {
        const { email, id, href } = userResults.body;
        const uid = id;

        // Custom token created after receiving Spotify user information
        const firebaseToken = await createOrUpdateFirebaseAccount(
          uid,
          email,
          access_token,
          refresh_token,
          { access_token, refresh_token, href }
        );

        // Send user information and tokens to client
        res.status(201).send({
          uid: id,
          email,
          firebaseToken,
          spotifyAccessToken: access_token,
          spotifyRefreshToken: refresh_token,
          spotifyApiHref: href,
        });
      });
    })
    .catch(error => {
      return error;
    });
});

router.post('/session', (req, res) => {
  console.log('hitting session route....');
  const idToken = req.body.idToken;
  // Get ID token and CSRF token.
  const csrfToken = req.body.csrfToken;

  // Guard against CSRF attacks.
  // TODO:
  // *** Figure out why Spotify isn't sending csrf token on request
  // if (!req.cookies || csrfToken !== req.cookies.csrfToken) {
  //   res.status(401).send('UNAUTHORIZED REQUEST!');
  //   return;
  // }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 10 * 1000;
  // Create the session cookie and verify the ID token.
  verifyUserIdToken(idToken)
    .then(user => {
      createUserSession(idToken, expiresIn).then(sessionCookie => {
        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: false, // Must be set to true in production!!
        };
        // Set a server-side user session
        res.cookie('session', sessionCookie, options);
        res.status(201).send({ user, isAuthenticated: true });
      });
    })
    .catch(error => {
      res.status(401).send({ errorMessage: 'UNAUTHORIZED REQUEST!' });
    });
});

router.get('/logout', (req, res) => {
  // Clear cookie.
  let sessionCookie = req.cookies.session || '';
  res.clearCookie('session');
  // Revoke session
  if (sessionCookie) {
    verifySession(sessionCookie, true)
      .then(decodedClaims => {
        return revokeToken(decodedClaims.sub);
      })
      .then(() => {
        // Redirect to login page on success.
        res.redirect(process.env.CLIENT_URL);
      })
      .catch(() => {
        // Redirect to login page on error.
        res.redirect(process.env.CLIENT_URL);
      });
  } else {
    // Redirect to login page when no session cookie available.
    res.redirect(process.env.CLIENT_URL);
  }
});

module.exports = router;
