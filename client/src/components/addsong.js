import React, { useContext, useEffect } from 'react';
import { navigate } from '@reach/router';

import { searchTracks, addStartingTrack } from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

const AddSong = () => {
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
    trackResults,
    setTrackResults,
    setPlaylistResult,
  } = useContext(SpotifyContext);

  const search = e => {
    setSearchQuery({ query: e.target.value });
  };

  const handleAddTrack = result => {
    addStartingTrack(
      result,
      accessCode,
      setPlaylistResult,
      setPlaylistId,
      navigate
    );
    setAccessCode(accessCode);
  };

  const handleCloseSearch = () => {
    setTrackResults({ data: '' });
  };

  window.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
      searchTracks(searchQuery.query, setTrackResults);
    }
  });

  return (
    <>
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
    </>
  );
};

export default AddSong;
