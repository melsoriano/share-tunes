const serviceAccount = require('./serviceAccount.json');
const { FirebaseAdmin, FirebaseApp } = require('./firebaseConfig');
const SpotifyApi = require('./spotifyConfig');

module.exports = {
  serviceAccount,
  FirebaseAdmin,
  FirebaseApp,
  SpotifyApi,
};
