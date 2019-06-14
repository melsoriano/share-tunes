const { FirebaseAdmin, FirebaseApp } = require('../config');

// Stores the Spotify access token each time a new one is created
function databaseCreation(uid, email, accessToken, refreshToken) {
 return FirebaseAdmin.firestore()
  .doc(`users/${uid}`)
  .set({
   email,
   accessToken,
   refreshToken,
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
function createFirebaseToken(uid, providerData) {
 const token = FirebaseAdmin.auth().createCustomToken(uid, {
  providerData: [{ spotify: providerData }],
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
 providerData
) {
 const uid = spotifyID;
 const databaseCreationTask = databaseCreation(
  uid,
  email,
  accessToken,
  refreshToken
 );
 const userCreationTask = userUpdateOrCreateUser(uid, email);

 // Wait til the database entry and user is made, create a custom token and send to the client.
 return Promise.all([databaseCreationTask, userCreationTask])
  .then(() => {
   return createFirebaseToken(uid, providerData);
  })
  .catch(err => {
   return err;
  });
}

// Verify identity of the user
function verifyUserIdToken(idToken) {
 return FirebaseAdmin.auth().verifyIdToken(idToken);
}

// Creates a user session to stay logged into the Firebase server
function createUserSession(idToken, expiresIn) {
 return FirebaseAdmin.auth().createSessionCookie(idToken, { expiresIn });
}

// Verify the user session
function verifySession(sessionCookie) {
 return FirebaseAdmin.auth().verifySessionCookie(sessionCookie, true);
}

// Revoke
function revokeToken(claims) {
 return FirebaseAdmin.revokeRefreshTokens(decodedClaims.sub);
}

module.exports = {
 FirebaseAdmin,
 FirebaseApp,
 createOrUpdateFirebaseAccount,
 verifyUserIdToken,
 createUserSession,
 verifySession,
 revokeToken,
};
