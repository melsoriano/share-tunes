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

// REORDERING ALGORITHM
function reorderTrack(documentPlaylistId, accessCode) {
  const uriByHighestVotes = [];
  let nextTrackIndex;
  // get the playlist from firestore, to check for song with most votes
  db.doc(`playlists/${accessCode}`)
    .collection('tracks')
    .orderBy('votes', 'desc') // sort db items by highest votes
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const { uri } = doc.data();
        uriByHighestVotes.push(uri);
      });
    })
    .then(() => {
      SpotifyApi.getPlaylistTracks(documentPlaylistId.data).then(data => {
        const trackList = data.body.items;
        trackList.map((trackData, trackIndex) => {
          const { uri } = trackData.track;
          // Find the uri of the Spotify track in `uriByHighestVotes` and return the index
          // `nextTrackIndex` is used to order the tracks by index in the playlist by highest votes
          nextTrackIndex = uriByHighestVotes.indexOf(uri);

          SpotifyApi.reorderTracksInPlaylist(
            documentPlaylistId.data,
            trackIndex,
            nextTrackIndex
          ).catch(error => error);
        });
      });
    });
}

export {
  createSpotifyPlaylist,
  searchTracks,
  addTrackToPlaylist,
  addStartingTrack,
  reorderTrack,
};
