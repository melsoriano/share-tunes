import { SpotifyApi } from './spotifyConfig';

import {
  addNewPlaylistToDb,
  getPlaylistFromDb,
  addTrackToDb,
} from '../firebase/firebaseApi';
import { db } from '../firebase/firebaseConfig';

function createSpotifyPlaylist(userId, playlistName, navigate) {
  const accessCodeId = Math.random()
    .toString(36)
    .substr(2, 4);

  // setAccessCode(accessCodeId);
  // Every time a new playlist is created, set the new accessCode to localStorage
  // This will trigger an update to spotifyContext
  localStorage.setItem('accessCode', accessCodeId);

  SpotifyApi.createPlaylist(userId, playlistName, {
    public: true,
  })
    .then(async data => {
      const playlistId = data.body.id;
      const ownerId = data.body.owner.id;
      const { uri } = data.body;
      await addNewPlaylistToDb(
        accessCodeId,
        ownerId,
        playlistId,
        playlistName,
        uri
      );
      await navigate('/add');
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
function addTrackToPlaylist(trackUri, navigate) {
  getPlaylistFromDb(doc => {
    const { playlistId } = doc.data();
    const accessCodeId = doc.id;

    SpotifyApi.addTracksToPlaylist(playlistId, [trackUri])
      .then(() => {
        addTrackToDb(trackUri, accessCodeId);
        navigate('./home');
      })
      .catch(error => {
        return error;
      });
  });
}

// Add initial track after playlist creation
function addStartingTrack(trackUri, navigate) {
  getPlaylistFromDb(doc => {
    // check localStorage for current access code and match to get the correct playlist from db
    const accessCodeId = localStorage.getItem('accessCode');
    if (doc.id === accessCodeId) {
      const { playlistId } = doc.data();
      SpotifyApi.addTracksToPlaylist(playlistId, [trackUri.uri])
        .then(() => {
          addTrackToDb(trackUri, accessCodeId);
        })
        .then(() => {
          SpotifyApi.getPlaylistTracks(playlistId).then(navigate('/tuneroom'));
        })
        .catch(error => {
          return error;
        });
    }
  });
}

function getPlaylistTracks(
  accessCode,
  setPlaylistUri,
  setPlaylistResult,
  setPlaylistId,
  navigate
) {
  console.log('hitting..');
  getPlaylistFromDb(doc => {
    const user = localStorage.getItem('user');
    const myAccessCode = localStorage.getItem('accessCode') || 'default';
    // console.log('accessCode: ', accessCode);
    // console.log('doc.id', doc.id);
    if (myAccessCode === doc.id) {
      const { playlistId, ownerId, uri } = doc.data();
      // localStorage.setItem('accessCode', accessCode);
      // setPlaylistId(playlistId.toString());
      if (!user) {
        db.doc(`users/${ownerId}`)
          .get()
          .then(async playlistOwner => {
            const { accessToken, refreshToken, email } = playlistOwner.data();
            const unAuthUser = {
              uid: playlistOwner.id,
              email,
              accessToken,
              refreshToken,
              playlistId,
              uri,
            };
            SpotifyApi.setAccessToken(accessToken);
            SpotifyApi.getPlaylistTracks(playlistId.toString())
              .then(async data => {
                await localStorage.setItem('user', JSON.stringify(unAuthUser));
                await setPlaylistUri(uri);
                // await localStorage.setItem('playlistUri', uri);
                await setPlaylistResult(data.body.items);
                // await localStorage.setItem(
                //   'playlistResult',
                //   JSON.stringify(data.body.items)
                // );
                await navigate('/tuneroom');
              })
              .catch(error => {
                return error;
              });
          });
      } else {
        SpotifyApi.getPlaylistTracks(playlistId.toString())
          .then(async data => {
            await setPlaylistUri(uri);
            await setPlaylistResult(data.body.items);
            await navigate('/tuneroom');
          })
          .catch(error => {
            return error;
          });
      }
    } else {
      console.log('access code not valid');
      return 'access code not valid';
    }
  });
}

function playTrack(playlistId) {
  // REMOVE HARD CODE!!!

  SpotifyApi.getPlaylist(playlistId)
    .then(data => {
      const { uri } = data.body;
      SpotifyApi.play({ context_uri: uri }).then(() => {
        SpotifyApi.getMyCurrentPlaybackState().then(state => {
          // TODO: Set state to have `isPlaying` set to true if song is playing
          return state;
        });
      });
    })
    .catch(error => {
      return error;
    });
}

function pauseTrack() {
  SpotifyApi.pause()
    .then(() => {
      SpotifyApi.getMyCurrentPlaybackState().then(state => {
        return state;
      });
    })
    .catch(error => {
      return error;
    });
}

export {
  createSpotifyPlaylist,
  searchTracks,
  addTrackToPlaylist,
  addStartingTrack,
  getPlaylistTracks,
  playTrack,
  pauseTrack,
};
