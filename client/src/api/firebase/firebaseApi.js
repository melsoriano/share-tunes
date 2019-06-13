import * as firebase from 'firebase';
import { db } from './firebaseConfig';

function addNewPlaylistToDb(ownerId, playlistId, playlistName) {
  db.doc(`playlists/${playlistId}`).set(
    {
      ownerId,
      playlistName,
      tracks: [{ trackUri: '', timestamp: null }],
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
      return error;
    });
}

function addTrackToDb(trackUri, playlistId) {
  db.doc(`playlists/${playlistId}`)
    .update({
      tracks: firebase.firestore.FieldValue.arrayUnion({
        trackUri,
      }),
    })
    .catch(error => {
      return error;
    });
}

export { addNewPlaylistToDb, getPlaylistFromDb, addTrackToDb };
