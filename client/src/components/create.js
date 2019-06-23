import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

import { createSpotifyPlaylist } from '../api/spotify/spotifyApi';
import { SpotifyApi } from '../api/spotify/spotifyConfig';

const Create = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });

  useEffect(() => {
    localStorage.setItem('isLoading', false);
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const handlePlaylistName = e => {
    setPlaylistName({ playlistName: e.target.value });
  };

  useEffect(() => {
    const field = document.querySelector('input');
    const input = document.querySelector('button');
    field.addEventListener('keydown', e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        input.click();
      }
    });
  }, []);

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
        onClick={() =>
          createSpotifyPlaylist(user.uid, playlist.playlistName, navigate)
        }
      >
        CREATE PLAYLIST
      </button>
    </div>
  );
};

export default Create;
