const firebaseAdmin = require('firebase-admin');
const firebase = require('firebase');
const { serviceAccount, firebaseConfig } = require('../config');

// firebase-admin to create tokens for custom auth providers
const fbaseAdmin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// general firebase app, does not include admin privileges
const fbaseApp = firebase.initializeApp(firebaseConfig);

async function _databaseCreation(uid, email, accessToken) {
  return fbaseAdmin
    .firestore()
    .doc(`users/${uid}`)
    .set({
      email,
      accessToken,
    });
}

async function _userCreation(uid, email, providerId) {
  return fbaseAdmin
    .auth()
    .updateUser(uid, {
      email,
      providerId,
    })
    .catch(error => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return fbaseAdmin.auth().createUser({
          uid,
          email,
          providerId,
        });
      }
      throw error;
    });
}

async function _createCustomClaims(uid) {
  return fbaseAdmin.auth().setCustomUserClaims(uid, {
    providerData: ['OAuthProvider'],
    admin: true,
  });
}

async function _createFirebaseAccount(spotifyID, email, accessToken) {
  // The UID we'll assign to the user.
  const uid = `spotify:${spotifyID}`;

  const databaseCreationTask = _databaseCreation(uid, email, accessToken);
  const userCreationTask = _userCreation(uid, email);
  const customClaimsTask = _createCustomClaims(uid);

  return Promise.all([
    databaseCreationTask,
    userCreationTask,
    customClaimsTask,
  ]).then(() => {
    const token = fbaseAdmin.auth().createCustomToken(uid);
    return token;
  });
}

module.exports = {
  _createFirebaseAccount,
  fbaseAdmin,
  fbaseApp,
};
