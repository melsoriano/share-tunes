import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';

import {
  createSpotifyPlaylist,
  getPlaylistTracks,
} from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

function Home() {
  // state
  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });

  // context
  const {
    playlistQuery,
    setPlaylistQuery,
    setPlaylistResult,
    accessCode,
    setAccessCode,
  } = useContext(SpotifyContext);
  // const { setPlaylistResult } = useContext(SpotifyContext);
  // const {accessCode, setAccessCode} = useContext(SpotifyContext)

  // localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    console.log(user);
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  // helpers
  const handlePlaylistName = e => {
    setPlaylistName({ playlistName: e.target.value });
  };

  const handlePlaylistQuery = e => {
    setPlaylistQuery({ playlistQuery: e.target.value });
  };

  const handleAccessCode = e => {
    setAccessCode({ code: e.target.value });
  };

  return (
    <div>
      <div>
        Thanks for using ShareTunes. To create a new playlist, you will need a
        Spotify Account. Otherwise, you can join an existing playlist using your
        access code.
      </div>
      <br />
      <div>
        {/** ADD PLAYLIST */}
        <input
          type="text"
          value={playlist.playlistName}
          onChange={handlePlaylistName}
          placeholder="Create A Playlist"
        />
        <button
          type="submit"
          onClick={() => createSpotifyPlaylist(user.uid, playlist.playlistName)}
        >
          CREATE PLAYLIST
        </button>
        <br />
        <br />

        <div>OR</div>
        <br />

        {/** RETRIEVE A PLAYLIST */}
        {/* <input
          type="text"
          value={accessCode.code}
          onChange={handleAccessCode}
          placeholder="Search Playlist"
        />
        <button
          type="submit"
          onClick={() => {
            getPlaylistTracks(accessCode.code, setPlaylistResult, navigate);
          }}
        >
          JOIN PLAYLIST
        </button> */}
        <button
          type="submit"
          onClick={() => {
            navigate('/join');
          }}
        >
          JOIN PLAYLIST
        </button>
      </div>
      <br />
    </div>
  );
}

export default Home;
