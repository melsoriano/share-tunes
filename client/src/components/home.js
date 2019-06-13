import React, { useState, useContext, useEffect } from 'react';

import {
  createSpotifyPlaylist,
  searchTracks,
  addTrackToPlaylist,
  // getPlaylistTracks,
} from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

function Home() {
  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });

  const { searchQuery, setSearchQuery } = useContext(SpotifyContext);
  const { trackResults, setTrackResults } = useContext(SpotifyContext);

  const user = JSON.parse(localStorage.getItem('user'));
  SpotifyApi.setAccessToken(user.accessToken);

  const handlePlaylistName = e => {
    setPlaylistName({ playlistName: e.target.value });
  };

  const search = e => {
    setSearchQuery({ query: e.target.value });
  };

  const handleAddTrack = result => {
    addTrackToPlaylist(result);
  };

  return (
    <div>
      <div>
        {/** ADD PLAYLIST */}
        <input
          type="text"
          value={playlist.playlistName}
          onChange={handlePlaylistName}
          placeholder="Create A Playlist"
        />
        <button
          type="submit"
          onClick={() => createSpotifyPlaylist(user.uid, playlist.playlistName)}
        >
          CREATE PLAYLIST
        </button>
        <br />
        <br />

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
      </div>

      {/** SEARCH RESULTS */}
      {trackResults.data !== '' ? (
        trackResults.map((result, i) => (
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
        ))
      ) : (
        <h2>Start adding some tunes!</h2>
      )}
    </div>
  );
}

export default Home;
