import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';
import { SpotifyApi } from '../api/spotify/spotifyConfig';

const Join = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const handleAccessCode = e => {
    setSearchQuery({ code: e.target.value });
  };

  // handler to trigger the same event as the component on enter
  useEffect(() => {
    const field = document.querySelector('input');
    const input = document.querySelectorAll('button')[0];
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
        value={searchQuery.code}
        onChange={handleAccessCode}
        placeholder="Enter Access Code"
      />
      <button
        type="submit"
        onClick={() => {
          // set access code to localStorage
          // this will trigger an update in spotifyContext and persist through refresh
          localStorage.setItem('accessCode', searchQuery.code);
          navigate('/tuneroom');
        }}
      >
        ENTER
      </button>
    </div>
  );
};

export default Join;
