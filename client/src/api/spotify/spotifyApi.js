import { SpotifyApi } from './spotifyConfig';
import { FirebaseAuth } from '../firebase/firebaseConfig';

import addNewPlaylistToDb from '../firebase/firebaseApi';

function createSpotifyPlaylist(userId, playlistName) {
  SpotifyApi.createPlaylist(userId, playlistName, {
    public: true,
  })
    .then(data => {
      console.log('new playlist data >>>', data.body);
      const playlistId = data.body.id;
      const ownerId = data.body.owner.id;
      console.log(ownerId);
      return addNewPlaylistToDb(ownerId, playlistId, playlistName);
    })
    .catch(error => {
      console.log(error);
    });
}

function getPlaylist() {
  console.log('getPlaylist');
}

export default createSpotifyPlaylist;
