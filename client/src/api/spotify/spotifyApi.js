import { SpotifyApi } from './spotifyConfig';

import {
  addNewPlaylistToDb,
  getPlaylistFromDb,
  addTrackToDb,
} from '../firebase/firebaseApi';
import { db } from '../firebase/firebaseConfig';

function createSpotifyPlaylist(userId, playlistName) {
  const accessCodeId = Math.random()
    .toString(36)
    .substr(2, 4);

  SpotifyApi.createPlaylist(userId, playlistName, {
    public: true,
  })
    .then(data => {
      const playlistId = data.body.id;
      const ownerId = data.body.owner.id;

      return addNewPlaylistToDb(
        accessCodeId,
        ownerId,
        playlistId,
        playlistName
      );
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

// TODO: refactor to have data save to context for real time updates on the front end
function addTrackToPlaylist(trackUri) {
  getPlaylistFromDb(doc => {
    const { playlistId } = doc.data();
    const accessCodeId = doc.id;

    SpotifyApi.addTracksToPlaylist(playlistId, [trackUri])
      .then(() => {
        addTrackToDb(trackUri, accessCodeId);
      })
      .catch(error => {
        return error;
      });
  });
}

function getPlaylistTracks(accessCode, setPlaylistResult, navigate) {
  getPlaylistFromDb(doc => {
    const user = localStorage.getItem('user');
    if (accessCode === doc.id) {
      const { playlistId, ownerId } = doc.data();
      if (!user) {
        db.doc(`users/${ownerId}`)
          .get()
          .then(async playlistOwner => {
            const { accessToken, refreshToken } = playlistOwner.data();
            const unAuthUser = {
              accessToken,
              refreshToken,
              playlistId,
            };
            SpotifyApi.setAccessToken(accessToken);
            SpotifyApi.getPlaylistTracks(playlistId.toString())
              .then(async data => {
                await localStorage.setItem('user', JSON.stringify(unAuthUser));
                await setPlaylistResult(data.body.items);
                await navigate('/tuneroom');
              })
              .catch(error => error);
          });
      } else {
        SpotifyApi.getPlaylistTracks(playlistId.toString())
          .then(async data => {
            await setPlaylistResult(data.body.items);
            await navigate('/tuneroom');
          })
          .catch(error => error);
      }
    } else {
      console.log('access code not valid');
      return 'access code not valid';
    }
  });
}

export {
  createSpotifyPlaylist,
  searchTracks,
  addTrackToPlaylist,
  getPlaylistTracks,
};
