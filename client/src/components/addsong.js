import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

import { searchTracks, addStartingTrack } from '../api/spotify/spotifyApi';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

const AddSong = () => {
  const [stateQuery, setStateQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const [trackResults, setTrackResults] = useState({
    data: '',
  });

  SpotifyApi.setAccessToken(user.accessToken);
  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const search = e => {
    setStateQuery({ query: e.target.value });
  };

  const handleAddTrack = result => {
    addStartingTrack(result, navigate);
  };

  const handleCloseSearch = () => {
    setTrackResults({ data: '' });
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
  }, [stateQuery]);

  return (
    <>
      {/** SEARCH FOR A SONG */}
      <input
        type="text"
        value={stateQuery.query}
        onChange={search}
        placeholder="Search Tracks"
      />
      <button
        id="addSong"
        type="submit"
        onClick={() => {
          searchTracks(stateQuery.query, setTrackResults);
        }}
      >
        SEARCH
      </button>
      {/* CLOSE SEARCH RESULTS */}
      &nbsp;
      {trackResults.data !== '' && (
        <button type="submit" onClick={() => handleCloseSearch()}>
          Close Search
        </button>
      )}
      <br />
      {window.location.pathname === '/tuneroom' ? (
        <div>Add a song to the list!</div>
      ) : (
        <div>Add a Song to begin launch your playlist!</div>
      )}
      {/** SEARCH RESULTS */}
      {trackResults.data !== '' ? (
        trackResults.map((result, i) => (
          <div>
            <ul key={i}>
              <li>
                <img src={result.album.images[2].url} alt="album-cover" />
                {result.artists[0].name} - {result.name}
                <button type="submit" onClick={() => handleAddTrack(result)}>
                  add
                </button>
              </li>
            </ul>
          </div>
        ))
      ) : (
        <h2>Submit a song!</h2>
      )}
    </>
  );
};

export default AddSong;
