import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';

import { getPlaylistTracks } from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

const Join = () => {
  // context
  const { setPlaylistResult, accessCode, setAccessCode } = useContext(
    SpotifyContext
  );

  // localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const handleAccessCode = e => {
    setAccessCode({ code: e.target.value });
  };

  window.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
      getPlaylistTracks(accessCode.code, setPlaylistResult, navigate);
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
          getPlaylistTracks(accessCode.code, setPlaylistResult, navigate);
        }}
      >
        ENTER
      </button>
    </div>
  );
};

export default Join;
