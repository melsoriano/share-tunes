import React, { useContext, useEffect } from 'react';
import { Link, navigate } from '@reach/router';
import SpotifyPlayer from 'react-spotify-web-playback';
import axios from 'axios';

import {
  searchTracks,
  addTrackToPlaylist,
  getPlaylistTracks,
} from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';
import { SpotifyApi } from '../api/spotify/spotifyConfig';
import { db } from '../api/firebase/firebaseConfig';

function TuneRoom() {
  // These four variables need to be fetched in context from the firestore database to persist through page refresh
  const user = JSON.parse(localStorage.getItem('user'));
  const playlistAccessCode = localStorage.getItem('accessCode');
  // const { documentState } = useContext(SpotifyContext);

  // context
  // TODO: can this be cleaned up?
  const {
    documentOwnerId,
    documentUri,
    documentPlaylistName,
    documentPlaylistId,
    searchQuery,
    setSearchQuery,
    documentState,
    // accessCode,
    trackResults,
    setTrackResults,
    // setting to localStorage until context gets refactored to db
    playlistResult,
    // setting to localStorage until context gets refactored to db
    // playlistUri,
    // setPlaylistResult,
    // setPlaylistId,
  } = useContext(SpotifyContext);

  useEffect(() => {
    function getRefreshToken() {
      axios
        .post('/auth/refresh_token', user)
        .then(response => {
          const { accessToken, refreshToken } = response.data;
          SpotifyApi.setAccessToken(accessToken);
          SpotifyApi.setRefreshToken(refreshToken);
        })
        .catch(err => {
          console.log(err);
          return err;
        });
    }
    getRefreshToken();
    setInterval(() => {
      getRefreshToken();
    }, 3000000);
  }, [user]);

  useEffect(() => {
    db.collection('users')
      .doc(user.uid)
      .onSnapshot(doc => {
        const { accessToken } = doc.data();
        SpotifyApi.setAccessToken(accessToken);
        localStorage.setItem(
          'user',
          JSON.stringify({ uid: doc.id, ...doc.data() })
        );
      });
  });

  // useEffect(() => {
  //   getPlaylistTracks(playlistAccessCode, setPlaylistResult, setPlaylistId);
  // }, [playlistAccessCode, setPlaylistId, setPlaylistResult]);

  // set the access code here to localStorage to fix tunes going away after page refresh
  // useEffect(() => {
  // localStorage.setItem('accessCode', accessCode);
  // console.log('this is the tuneroom accessCode: ', accessCode);
  // console.log('this is the playlistResult: ', playlistResult);
  // }, [playlistResult]);

  useEffect(() => {
    // updates in realtime from firestore
    // db.collection('playlists')
    //   .doc(accessCode)
    //   .onSnapshot(doc => {
    //     doc.data().tracks.map(data => {
    //       SpotifyApi.getPlaylistTracks(playlistId).then(tracks => {
    //         tracks.body.items.map(spotifyApi => {
    //           // TODO:
    //           // increment vote count for specific track
    //           // if (data.trackUri === spotifyApi.track.uri) {
    //           //   db.doc(`playlists/${accessCode}`).set({
    //           //   }, { merge: true });
    //           // }
    //         });
    //       });
    //     });
    //   });
  }, []);

  const search = e => {
    setSearchQuery({ query: e.target.value });
  };

  const handleAddTrack = result => {
    console.log(result);
    addTrackToPlaylist(result);
  };

  useEffect(() => {
    const field = document.querySelector('input');
    const input = document.querySelectorAll('button')[1];
    field.addEventListener('keydown', e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        input.click();
      }
    });
  }, [setTrackResults]);

  return (
    <div>
      <button type="submit" onClick={() => navigate('/')}>
        Return to Home
      </button>
      <div>
        <SpotifyPlayer token={user.accessToken} uris={[`${documentUri.uri}`]} />
        {/** PLAYLSIT RESULTS */}
        {/* {console.log('playlistResult: ', playlistResult)} */}
        {playlistResult.data !== '' ? (
          playlistResult.map((result, i) => (
            <>
              {/* what's currently playing? */}
              {i === 0 && <h2>Currently playing:</h2>}
              {/* see what's next, add voting feature here? */}
              {i === 1 && <h2>Up Next:</h2>}
              <ul key={i}>
                <li>
                  <div>{result.track.name}</div>
                  <img
                    src={result.track.album.images[2].url}
                    alt="album-cover"
                  />
                </li>
              </ul>
            </>
          ))
        ) : (
          <div>
            <h2>
              <Link to="/home">Join a playlist</Link> to see what's playing
            </h2>
          </div>
        )}
        <div>documentOwnerId: {documentOwnerId.data}</div>
        <div>documentPlaylistId: {documentPlaylistId.data}</div>
        <div>documentPlaylistName: {documentPlaylistName.data}</div>
        <div>documentUri: {documentUri.uri}</div>
        {/* <div>documentState: {documentState}</div> */}
        {console.log(documentState)}
        {/** SEARCH FOR A SONG */}
        <input
          type="text"
          value={searchQuery.query}
          onChange={search}
          placeholder="Search Tracks"
        />
        <button
          type="submit"
          onClick={() => searchTracks(searchQuery.query, setTrackResults)}
        >
          SEARCH
        </button>
        {/* CLOSE SEARCH RESULTS */}
        &nbsp;
        {trackResults.data !== '' && (
          <button type="submit" onClick={() => setTrackResults({ data: '' })}>
            Close Search
          </button>
        )}
        <br />
      </div>

      {/** SEARCH RESULTS */}
      {trackResults.data !== '' ? (
        trackResults.map((result, i) => (
          <div>
            <ul key={i}>
              <li>
                <img src={result.album.images[2].url} alt="album-cover" />
                {result.artists[0].name} - {result.name}
                <button
                  type="submit"
                  onClick={() => handleAddTrack(result.uri.toString())}
                >
                  add
                </button>
              </li>
            </ul>
          </div>
        ))
      ) : (
        <h2>Submit a song!</h2>
      )}
      {documentState.map(data => (
        <>
          {/* <div>{data}</div> */}
          {console.log(data.trackUri)}
          <div>song</div>
        </>
      ))}
    </div>
  );
}

export default TuneRoom;
