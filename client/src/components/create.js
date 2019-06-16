import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';

import {
  createSpotifyPlaylist,
  getPlaylistTracks,
} from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

const Create = () => {
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
      <input
        type="text"
        value={playlist.playlistName}
        onChange={handlePlaylistName}
        placeholder="Create A Playlist"
      />
      <button
        type="submit"
        onClick={
          () =>
            createSpotifyPlaylist(
              user.uid,
              playlist.playlistName,
              setAccessCode,
              navigate
            )
          // navigate('/tuneroom')
        }
      >
        CREATE PLAYLIST
      </button>
    </div>
  );
};

export default Create;