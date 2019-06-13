import { SpotifyApi } from './spotifyConfig';

import {
  addNewPlaylistToDb,
  getPlaylistFromDb,
  addTrackToDb,
} from '../firebase/firebaseApi';

function createSpotifyPlaylist(userId, playlistName) {
  SpotifyApi.createPlaylist(userId, playlistName, {
    public: true,
  })
    .then(data => {
      const playlistId = data.body.id;
      const ownerId = data.body.owner.id;

      return addNewPlaylistToDb(ownerId, playlistId, playlistName);
    })
    .catch(error => {
      return error;
    });
}

function searchTracks(query, setTrackResults) {
  SpotifyApi.searchTracks(query)
    .then(data => {
      setTrackResults(data.body.tracks.items);
    })
    .catch(error => {
      return error;
    });
}

function addTrackToPlaylist(trackUri) {
  getPlaylistFromDb(doc => {
    const playlistId = doc.id;

    SpotifyApi.addTracksToPlaylist(playlistId, [trackUri])
      .then(() => {
        addTrackToDb(trackUri, playlistId);
      })
      .catch(error => {
        return error;
      });
  });
}

function getPlaylistTracks(next) {
  getPlaylistFromDb(doc => {
    const playlistId = doc.id.toString();

    SpotifyApi.getPlaylistTracks(playlistId)
      .then(data => {
        next(data.body);
      })
      .catch(error => console.log(error));
  });
}

export {
  createSpotifyPlaylist,
  searchTracks,
  addTrackToPlaylist,
  getPlaylistTracks,
};
