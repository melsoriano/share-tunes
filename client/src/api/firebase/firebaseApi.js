import { FirebaseAuth, db } from './firebaseConfig';

/**
 * Creates a new playlist and renders the results
 * @param {String} playlistId ID of the playlist
 * @param {String} ownerId ID of the playlist owner
 * @param {String} playlistName The name of the playlist
 * @return {Object} An object containing playlist data
 */
function addNewPlaylistToDb(ownerId, playlistId, playlistName) {
  console.log('adding to firebase.....');

  db.doc(`playlists/${playlistId}`).set(
    {
      ownerId,
      playlistName,
    },
    { merge: true }
  );
}

export default addNewPlaylistToDb;
