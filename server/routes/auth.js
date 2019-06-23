const express = require('express');

const router = express.Router();

const { SpotifyApi } = require('../config/index');

const { createOrUpdateFirebaseAccount } = require('../firebase/firebaseApi');

router.post('/token', (req, res) => {
  const authCode = req.body.spotifyAuthCode;

  // Start the Spotify auth flow
  SpotifyApi.authorizationCodeGrant(authCode)
    .then((data) => {
      const { access_token, refresh_token, expires_in } = data.body;
      // Set the access token to send on each server request
      SpotifyApi.setAccessToken(access_token);
      SpotifyApi.setRefreshToken(refresh_token);
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
          expires_in,
        );

        // Send user information and tokens to client
        res.status(201).send({
          uid,
          email,
          firebaseToken,
          expires_in,
        });
      });
    })
    .catch(error => error);
});

router.post('/refresh_token', (req, res) => {
  const {
    accessToken, refreshToken, uid, email,
  } = req.body;

  SpotifyApi.setAccessToken(accessToken);
  SpotifyApi.setRefreshToken(refreshToken);

  SpotifyApi.refreshAccessToken().then(
    async (data) => {
      const { access_token, expires_in } = data.body;

      const tokenExpirationEpoch = new Date().getTime() / 1000 + data.body.expires_in;
      console.log(
        `Refreshed token. It now expires in ${Math.floor(
          tokenExpirationEpoch - new Date().getTime() / 1000,
        )} seconds!`,
      );
      await createOrUpdateFirebaseAccount(uid, email, access_token, refreshToken, expires_in);
      res.json(data.body);
    },
    (err) => {
      console.log('Could not refresh the token!', err.message);
      return err.message;
    },
  );
});

module.exports = router;
