const firebaseAdmin = require('firebase-admin');
const firebase = require('firebase');
const { serviceAccount, firebaseConfig } = require('../../config');

// firebase-admin to create tokens for custom auth providers
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// general firebase app, does not include admin privileges
firebase.initializeApp(firebaseConfig);

async function _databaseCreation(uid, email, accessToken) {
  return firebaseAdmin
    .firestore()
    .doc(`users/${uid}`)
    .set({
      email,
      accessToken,
    });
}

async function _userCreation(uid, email, providerId) {
  return firebaseAdmin
    .auth()
    .updateUser(uid, {
      email,
      providerId,
    })
    .catch(error => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return firebaseAdmin.auth().createUser({
          uid,
          email,
          providerId,
        });
      }
      throw error;
    });
}

async function _createFirebaseAccount(spotifyID, email, accessToken) {
  // The UID we'll assign to the user.
  const uid = `spotify:${spotifyID}`;

  const databaseCreationTask = _databaseCreation(uid, email, accessToken);
  const userCreationTask = _userCreation(uid, email);

  return Promise.all([databaseCreationTask, userCreationTask]).then(() => {
    const token = firebaseAdmin.auth().createCustomToken(uid);
    return token;
  });
}

async function _signInWithCustomToken(firebaseToken, res) {
  return firebase
    .auth()
    .signInWithCustomToken(firebaseToken)
    .then(() => {
      res.redirect(process.env.CLIENT_URL);
    })
    .catch(err => {
      return err;
    });
}

module.exports = {
  _createFirebaseAccount,
  _signInWithCustomToken,
};
