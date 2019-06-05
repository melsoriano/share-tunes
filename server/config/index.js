const serviceAccount = require('./serviceAccount.json');
const firebaseConfig = require('./firebaseConfig');
const { SPOTIFY_OAUTH_SCOPES, CORS_WHITELIST } = require('./spotifyConfig');

module.exports = {
  serviceAccount,
  firebaseConfig,
  SPOTIFY_OAUTH_SCOPES,
  CORS_WHITELIST,
};
