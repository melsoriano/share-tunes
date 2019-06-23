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
      tracks: [{ trackUri: '' }],
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

function addTrackToDb(trackUri, accessCodeId) {
  console.log('access code id>>', accessCodeId);
  db.doc(`playlists/${accessCodeId}`)
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
