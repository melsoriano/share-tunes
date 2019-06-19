import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';

import { createSpotifyPlaylist } from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';
import { SpotifyApi } from '../api/spotify/spotifyConfig';

const Create = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });

  const { setAccessCode } = useContext(SpotifyContext);

  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const handlePlaylistName = e => {
    setPlaylistName({ playlistName: e.target.value });
  };

  window.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
      createSpotifyPlaylist(
        user.uid,
        playlist.playlistName,
        setAccessCode,
        navigate
      );
    }
  });

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
          createSpotifyPlaylist(
            user.uid,
            playlist.playlistName,
            setAccessCode,
            navigate
          )
        }
      >
        CREATE PLAYLIST
      </button>
    </div>
  );
};

export default Create;
