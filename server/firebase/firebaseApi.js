const { FirebaseAdmin, FirebaseApp } = require('../config');

// Stores the Spotify access token each time a new one is created
function databaseCreation(
  uid,
  email,
  accessToken,
  refreshToken,
  tokenExpiration
) {
  return FirebaseAdmin.firestore()
    .doc(`users/${uid}`)
    .set({
      email,
      accessToken,
      refreshToken,
      tokenExpiration,
    });
}

// Updates or create Firebase user information
async function userUpdateOrCreateUser(uid, email) {
  return FirebaseAdmin.auth()
    .updateUser(uid, {
      email,
      emailVerified: true,
    })
    .catch(error => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return FirebaseAdmin.auth().createUser({
          uid,
          email,

          emailVerified: true,
        });
      }
      return error;
    });
}

// Creates custom Firebase authentication tokens
function createFirebaseToken(uid) {
  const token = FirebaseAdmin.auth().createCustomToken(uid, {
    admin: true,
  });
  return token;
}

// Creates a user and database entry in the `users` collection
async function createOrUpdateFirebaseAccount(
  spotifyID,
  email,
  accessToken,
  refreshToken,
  tokenExpiration
) {
  const uid = spotifyID;
  const databaseCreationTask = databaseCreation(
    uid,
    email,
    accessToken,
    refreshToken,
    tokenExpiration
  );
  const userCreationTask = userUpdateOrCreateUser(uid, email);

  // Wait til the database entry and user is made, create a custom token and send to the client.
  return Promise.all([databaseCreationTask, userCreationTask])
    .then(() => createFirebaseToken(uid))
    .catch(err => err);
}

module.exports = {
  FirebaseAdmin,
  FirebaseApp,
  createOrUpdateFirebaseAccount,
};
