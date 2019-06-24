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
function addStartingTrack(track, setMyAccessCode, setDocumentUri, navigate) {
  getPlaylistFromDb(doc => {
    // check localStorage for current access code and match to get the correct playlist from db
    const accessCodeId = localStorage.getItem('accessCode');
    if (doc.id === accessCodeId) {
      const { playlistId, uri } = doc.data();
      SpotifyApi.addTracksToPlaylist(playlistId, [track.uri])
        .then(() => {
          addTrackToDb(track, accessCodeId);
        })
        .then(setMyAccessCode(accessCodeId), setDocumentUri({ uri }))
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

// REORDERING ALGORITHM
function reorderTrack(documentPlaylistId, accessCode) {
  let nextSong = { uri: '', name: '' };
  let highestVote = 0;
  let nextUp = {};
  // get the playlist from firestore, to check for song with most votes
  db.doc(`playlists/${accessCode}`)
    .collection('tracks')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // parse the data, and find which song has most votes. set it to access
        const { name, uri, votes } = doc.data();
        if (votes > highestVote) {
          nextSong.name = name;
          nextSong.uri = uri;
          highestVote = votes;
        }
      });
    })
    .then(() => {
      // find the index of the nextSong, which has the most votes as decided in last method
      SpotifyApi.getPlaylistTracks(documentPlaylistId.data)
        .then(data => {
          const trackList = data.body.items;
          trackList.forEach(track => {
            if ((track.name = nextSong.name)) {
              nextUp = trackList.indexOf(track);
              // nextUp is always 3???
            }
          });
        })
        .then(() => {
          // modify the playlist in Spotify to reorder the highest voted song to the next song in the playlist
          // https://github.com/JMPerez/spotify-web-api-js/blob/master/src/spotify-web-api.js line 822
          // i think this is working with hardcoded indexes
          // you need to refresh the spotify playlist console to see the change after clicking 'vote'
          // since nextUp is always 3.....it's not working......
          SpotifyApi.reorderTracksInPlaylist(
            documentPlaylistId.data,
            nextUp,
            1,
            {
              rangeStart: 1,
              insertBefore: 1,
            }
          )
            .then(data => {
              console.log(data.body.snapshot_id);
            })
            .catch(error => {
              return error;
            });
        });
    });
}

export {
  createSpotifyPlaylist,
  searchTracks,
  addTrackToPlaylist,
  addStartingTrack,
  playTrack,
  pauseTrack,
  reorderTrack,
};
