import React, { useState, useContext, useEffect } from 'react';
import { Link, navigate } from '@reach/router';

import {
  searchTracks,
  addTrackToPlaylist,
  addStartingTrack,
} from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

const AddSong = () => {
  // localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  SpotifyApi.setAccessToken(user.accessToken);
  // state
  // const [playlist, setPlaylistName] = useState({
  //   playlistName: '',
  // });
  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  // context
  const { searchQuery, setSearchQuery, accessCode, playlistId } = useContext(
    SpotifyContext
  );
  const { trackResults, setTrackResults } = useContext(SpotifyContext);
  const { playlistResult, setPlaylistResult } = useContext(SpotifyContext);

  // helpers
  const search = e => {
    setSearchQuery({ query: e.target.value });
  };

  const handleAddTrack = result => {
    // addTrackToPlaylist(result, navigate);
    addStartingTrack(result, accessCode, setPlaylistResult, navigate);
  };

  const handleCloseSearch = () => {
    setTrackResults({ data: '' });
  };
  return (
    <>
      {/* {console.log(accessCode)} */}
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
        <button type="submit" onClick={() => handleCloseSearch()}>
          Close Search
        </button>
      )}
      <br />
      <div>Add a Song to begin launch your playlist!</div>
      {/** SEARCH RESULTS */}
      {trackResults.data !== '' ? (
        trackResults.map((result, i) => (
          <div>
            <ul key={i}>
              <li>
                <img src={result.album.images[2].url} alt="album-cover" />
                {result.artists[0].name} - {result.name}
                {/* {console.log(result)} */}
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
    </>
  );
};

export default AddSong;
