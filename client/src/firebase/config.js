import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_FBASE_API_KEY,
  authDomain: process.env.REACT_APP_FBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FBASE_MESSAGING_SENDER_ID,
};

export const fbaseApp = firebase.initializeApp(config);
export const tempApp = firebase.initializeApp(config, '_temp_');
