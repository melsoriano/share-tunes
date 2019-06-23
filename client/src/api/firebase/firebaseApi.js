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
    });
}

function vote(trackUri, accessCode, documentState) {
  const index = documentState.findIndex(item => item.uri === trackUri);
  const playlistRef = db.doc(`playlists/${accessCode}`);
  if (index) {
    playlistRef
      .collection('tracks')
      .doc(trackUri)
      .set(
        { votes: firebase.firestore.FieldValue.increment(1) },
        { merge: true }
      );
  }
}

export { addNewPlaylistToDb, getPlaylistFromDb, addTrackToDb, vote };
