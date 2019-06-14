import React, { useState, useContext } from 'react';
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
  const { playlistQuery, setPlaylistQuery } = useContext(SpotifyContext);
  const { setPlaylistResult } = useContext(SpotifyContext);

  // localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  SpotifyApi.setAccessToken(user.accessToken);

  // helpers
  const handlePlaylistName = e => {
    setPlaylistName({ playlistName: e.target.value });
  };

  const handlePlaylistQuery = e => {
    setPlaylistQuery({ playlistQuery: e.target.value });
  };

  return (
    <div>
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
        <input
          type="text"
          value={playlistQuery.query}
          onChange={handlePlaylistQuery}
          placeholder="Search Playlist"
        />
        <button
          type="submit"
          onClick={() => {
            getPlaylistTracks(playlistQuery.query, setPlaylistResult);
            navigate('/tuneroom');
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
