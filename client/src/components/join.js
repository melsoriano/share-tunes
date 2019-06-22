import React, { useContext, useEffect } from 'react';
import { navigate } from '@reach/router';

import { getPlaylistTracks } from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';
import { SpotifyApi } from '../api/spotify/spotifyConfig';

const Join = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    setPlaylistResult,
    accessCode,
    setAccessCode,
    setPlaylistId,
  } = useContext(SpotifyContext);

  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const handleAccessCode = e => {
    setAccessCode({ code: e.target.value });
  };

  // TODO: add these EVERYWHERE...classname?
  window.addEventListener('keydown', async e => {
    if (e.keyCode === 13) {
      setAccessCode(accessCode);
      getPlaylistTracks(
        accessCode.code,
        setPlaylistResult,
        setPlaylistId,
        navigate
      );
    }
  });

  return (
    <div>
      <input
        type="text"
        value={accessCode.code}
        onChange={handleAccessCode}
        placeholder="Enter Access Code"
      />
      <button
        type="submit"
        onClick={() => {
          setAccessCode(accessCode);
          getPlaylistTracks(
            accessCode,
            setPlaylistResult,
            setPlaylistId,
            navigate
          );
        }}
      >
        ENTER
      </button>
    </div>
  );
};

export default Join;
