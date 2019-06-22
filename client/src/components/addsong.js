import React, { useState, useContext, useEffect } from 'react';
import { navigate } from '@reach/router';

import { searchTracks, addStartingTrack } from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

const AddSong = () => {
  const [stateQuery, setStateQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // TODO: Render playlist name in tuneroom...context?
  // const [playlist, setPlaylistName] = useState({
  //   playlistName: '',
  // });

  SpotifyApi.setAccessToken(user.accessToken);
  useEffect(() => {
    if (user !== null) {
      SpotifyApi.setAccessToken(user.accessToken);
    }
  }, [user]);

  const {
    searchQuery,
    setSearchQuery,
    accessCode,
    setAccessCode,
    setPlaylistId,
    setPlaylistUri,
    trackResults,
    setTrackResults,
    setPlaylistResult,
  } = useContext(SpotifyContext);

  const search = e => {
    setStateQuery({ query: e.target.value });
    // setSearchQuery({ query: e.target.value });
    // console.log('stateQuery: ', stateQuery);
  };

  const handleAddTrack = result => {
    // console.log('accessCode: ', accessCode);
    addStartingTrack(
      result,
      accessCode,
      setPlaylistUri,
      setPlaylistResult,
      setPlaylistId,
      navigate
    );
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
  }, [setTrackResults, stateQuery]);

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
          // console.log(stateQuery.query);
          searchTracks(stateQuery.query, setTrackResults);
        }}
      >
        SEARCH
      </button>
      {/* CLOSE SEARCH RESULTS */}
      {/* TODO: Automatically close search results on redirect */}
      &nbsp;
      {trackResults.data !== '' && (
        <button type="submit" onClick={() => handleCloseSearch()}>
          Close Search
        </button>
      )}
      <br />
      <div>Add a Song to begin launch your playlist!</div>
      {/** SEARCH RESULTS */}
      {/* {console.log('trackResults: ', trackResults)} */}
      {trackResults.data !== '' ? (
        trackResults.map((result, i) => (
          <div>
            <ul key={i}>
              <li>
                <img src={result.album.images[2].url} alt="album-cover" />
                {result.artists[0].name} - {result.name}
                <button
                  type="submit"
                  onClick={() =>
                    handleAddTrack(
                      result.uri.toString(),
                      result.album.images[2].url,
                      result.artists[0].name,
                      result.name
                    )
                  }
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
