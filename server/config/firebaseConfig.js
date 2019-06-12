const admin = require('firebase-admin');
const firebase = require('firebase');
const serviceAccount = require('./serviceAccount.json');

const config = {
  apiKey: process.env.REACT_APP_FBASE_API_KEY,
  authDomain: process.env.REACT_APP_FBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FBASE_MESSAGING_SENDER_ID,
};

// Firebase Admin to create tokens for custom auth providers
const FirebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// General Firebase app, does not include admin privileges
const FirebaseApp = firebase.initializeApp(config);

module.exports = {
  FirebaseAdmin,
  FirebaseApp,
};
