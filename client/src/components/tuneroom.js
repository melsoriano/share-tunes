import React, { useState, useContext, useEffect } from 'react';
import { Link, navigate } from '@reach/router';

import {
  searchTracks,
  addTrackToPlaylist,
  getPlaylistTracks,
} from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';
import { SpotifyApi } from '../api/spotify/spotifyConfig';

function TuneRoom() {
  const user = JSON.parse(localStorage.getItem('user'));
  const playlistAccessCode = localStorage.getItem('accessCode');

  // context
  // TODO: can this be cleaned up?
  const {
    searchQuery,
    setSearchQuery,
    accessCode,
    playlistId,
    trackResults,
    setTrackResults,
    playlistResult,
    setPlaylistResult,
    setPlaylistId,
  } = useContext(SpotifyContext);

  SpotifyApi.setAccessToken(user.accessToken);

  const search = e => {
    setSearchQuery({ query: e.target.value });
  };

  const handleAddTrack = result => {
    addTrackToPlaylist(result);
  };

  useEffect(() => {
    getPlaylistTracks(playlistAccessCode, setPlaylistResult, setPlaylistId);
  }, [accessCode.code, playlistAccessCode, setPlaylistId, setPlaylistResult]);

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

  useEffect(() => {
    if (window.location.pathname !== '/tuneroom') setTrackResults({ data: '' });
  }, [setTrackResults]);

  return (
    <div>
      <button type="submit" onClick={() => navigate('/')}>
        Return to Home
      </button>
      <div>
        {/** PLAYLSIT RESULTS */}
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
    </div>
  );
}

export default TuneRoom;
