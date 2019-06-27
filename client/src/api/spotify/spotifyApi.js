import axios from 'axios';
import { SpotifyApi } from './spotifyConfig';
import {
  addNewPlaylistToDb,
  getPlaylistFromDb,
  addTrackToDb,
} from '../firebase/firebaseApi';
import { db } from '../firebase/firebaseConfig';

function createSpotifyPlaylist(userId, playlistName, navigate, props) {
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
      console.log('ACCESS CODE >>>>>>', accessCodeId);
      console.log(props);
      // await navigate('/add');
      await navigate(`/tuneroom/${accessCodeId}`);
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

function addTrack(ownerId, playlistId, track) {
  db.doc(`users/${ownerId}`)
    .get()
    .then(doc => {
      const { accessToken } = doc.data();
      if (doc.id === ownerId) {
        axios
          .post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            { uris: [track.uri] },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;charset`UTF-8',
              },
            }
          )
          .then(response => {
            if (response.status === 201) {
              const accessCode = localStorage.getItem('accessCode');
              addTrackToDb(track, accessCode);
            }
          })
          .catch(error => error);
      }
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
function reorderTrack(documentPlaylistId, accessCode, ownerId) {
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
      // Get the playlist owner's id to get token
      db.doc(`users/${ownerId}`)
        .get()
        .then(doc => {
          const { accessToken } = doc.data();

          SpotifyApi.getPlaylistTracks(documentPlaylistId).then(data => {
            const trackList = data.body.items;
            trackList.map((trackData, trackIndex) => {
              const { uri } = trackData.track;
              // nextTrackIndex` represents where in the Array the ranked tracks should go based on vote count
              nextTrackIndex = uriByHighestVotes.indexOf(uri);

              if (nextTrackIndex !== -1 && documentPlaylistId !== undefined) {
                axios
                  .put(
                    `https://api.spotify.com/v1/playlists/${documentPlaylistId}/tracks`,
                    { range_start: trackIndex, insert_before: nextTrackIndex },
                    {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json;charset`UTF-8',
                      },
                    }
                  )
                  .then(data => {
                    console.log(data);
                  })
                  .catch(error => error);
              }
            });
          });
        });
    });
}

export {
  createSpotifyPlaylist,
  searchTracks,
  addTrack,
  addStartingTrack,
  reorderTrack,
};
