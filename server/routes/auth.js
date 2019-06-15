const express = require('express');

const router = express.Router();
const { SpotifyApi } = require('../config/index');

const {
  createOrUpdateFirebaseAccount,
  verifySession,
  revokeToken,
} = require('../firebase/firebaseApi');

router.post('/token', (req, res) => {
  const authCode = req.body.spotifyAuthCode;

  // Start the Spotify auth flow
  SpotifyApi.authorizationCodeGrant(authCode)
    .then((data) => {
      const { access_token, refresh_token } = data.body;
      // Set the access token to send on each server request
      SpotifyApi.setAccessToken(access_token);
      // Get Spotify user information
      SpotifyApi.getMe().then(async (userResults) => {
        const { email, id } = userResults.body;
        const uid = id;

        // Custom token created after receiving Spotify user information
        const firebaseToken = await createOrUpdateFirebaseAccount(
          uid,
          email,
          access_token,
          refresh_token,
        );

        // Send user information and tokens to client
        res.status(201).send({
          uid,
          email,
          firebaseToken,
        });
      });
    })
    .catch(error => error);
});

router.get('/logout', (req, res) => {
  // Clear cookie.
  const sessionCookie = req.cookies.session || '';
  res.clearCookie('session');
  // Revoke session
  if (sessionCookie) {
    verifySession(sessionCookie, true)
      .then(decodedClaims => revokeToken(decodedClaims.sub))
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
