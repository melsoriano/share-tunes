import React, { useState, useContext } from 'react';
import { Link, navigate } from '@reach/router';

import { searchTracks, addTrackToPlaylist } from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

function Home() {
  // state
  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });

  // context
  const { searchQuery, setSearchQuery } = useContext(SpotifyContext);
  const { trackResults, setTrackResults } = useContext(SpotifyContext);
  const { playlistResult } = useContext(SpotifyContext);

  // localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  SpotifyApi.setAccessToken(user.accessToken);

  // helpers
  const search = e => {
    setSearchQuery({ query: e.target.value });
  };

  const handleAddTrack = result => {
    addTrackToPlaylist(result);
  };

  const handleCloseSearch = () => {
    setTrackResults({ data: '' });
  };

  return (
    <div>
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
            <button type="submit" onClick={() => navigate('/home')} />
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
          <button type="submit" onClick={() => handleCloseSearch()}>
            Close Search
          </button>
        )}
        <br />
      </div>

      {/** SEARCH RESULTS */}
      {trackResults.data !== '' ? (
        trackResults.map(
          (result, i) => (
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
          ),
          <div>hello</div>
        )
      ) : (
        <h2>Submit a song!</h2>
      )}
    </div>
  );
}

export default Home;
