import * as firebase from 'firebase';
import { db } from './firebaseConfig';

function addNewPlaylistToDb(
  accessCodeId,
  ownerId,
  playlistId,
  playlistName,
  uri
) {
  db.doc(`playlists/${accessCodeId}`).set(
    {
      ownerId,
      playlistId,
      playlistName,
      uri,
    },
    { merge: true }
  );
}

function getPlaylistFromDb(next) {
  db.collection('playlists')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // callback function that sends the document data to the next function
        next(doc);
      });
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

function addTrackToDb(track, accessCodeId) {
  const playlistRef = db.doc(`playlists/${accessCodeId}`);
  playlistRef
    .collection('tracks')
    .doc(track.uri)
    .set({
      ...track,
      votes: 0,
    });
}

function vote(trackUri, accessCode) {
  db.doc(`playlists/${accessCode}`)
    .collection('tracks')
    .doc(trackUri)
    .set(
      { votes: firebase.firestore.FieldValue.increment(1) },
      { merge: true }
    );
}

function checkPlaylistExists(searchQuery) {
  console.log('check if playlist exsists: ', searchQuery);
  let isMatch = false;
  db.collection('playlists')
    .get()
    .then(querySnapshot => {
      querySnapshot
        .forEach(doc => {
          if (doc.id === searchQuery) {
            isMatch = true;
          } else {
            isMatch = false;
          }
          // idArr.push(doc.id);
          // console.log(isMatch);
          return isMatch;
        })
        .then(console.log(isMatch));
    });
}

export {
  addNewPlaylistToDb,
  getPlaylistFromDb,
  addTrackToDb,
  vote,
  checkPlaylistExists,
};
