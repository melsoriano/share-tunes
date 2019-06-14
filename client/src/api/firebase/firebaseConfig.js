import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Good ol' Firebase API configurations
const config = {
  apiKey: process.env.REACT_APP_FBASE_API_KEY,
  authDomain: process.env.REACT_APP_FBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FBASE_MESSAGING_SENDER_ID,
};

// Initialize Firebase
const FirebaseApp = firebase.initializeApp(config);

// Create an instance of Firebase Auth used to authenticate users
const FirebaseAuth = firebase.auth();

// Creates an instance of Firestore Database
const db = firebase.firestore();

// Sets user session in browser
FirebaseAuth.setPersistence('local');

export { FirebaseAuth, FirebaseApp, db };
