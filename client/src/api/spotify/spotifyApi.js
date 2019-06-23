import { SpotifyApi } from './spotifyConfig';
import {
  addNewPlaylistToDb,
  getPlaylistFromDb,
  addTrackToDb,
} from '../firebase/firebaseApi';

function createSpotifyPlaylist(userId, playlistName, navigate) {
  const accessCodeId = Math.random()
    .toString(36)
    .substr(2, 4);
  // Every time a new playlist is created, set the new accessCode to localStorage
  // This will trigger an update to spotifyContext
  localStorage.setItem('accessCode', accessCodeId);

  SpotifyApi.createPlaylist(userId, playlistName, {
    public: false,
    collaborative: true,
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

function addTrackToPlaylist(track, navigate) {
  getPlaylistFromDb(doc => {
    const { playlistId } = doc.data();
    const accessCodeId = doc.id;

    SpotifyApi.addTracksToPlaylist(playlistId, [track])
      .then(() => {
        addTrackToDb(track, accessCodeId);
        navigate('./home');
      })
      .catch(error => {
        return error;
      });
  });
}

// Add initial track after playlist creation
function addStartingTrack(track, navigate) {
  getPlaylistFromDb(doc => {
    // check localStorage for current access code and match to get the correct playlist from db
    const accessCodeId = localStorage.getItem('accessCode');
    if (doc.id === accessCodeId) {
      const { playlistId } = doc.data();
      SpotifyApi.addTracksToPlaylist(playlistId, [track.uri])
        .then(() => {
          addTrackToDb(track, accessCodeId);
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
  playTrack,
  pauseTrack,
};
