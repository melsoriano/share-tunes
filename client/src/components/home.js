import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import createPlaylist from '../api/spotify/spotifyApi';
import { SpotifyApi } from '../api/spotify/spotifyConfig';

// styled components allow us to grab styles from the themeProvider object globally via props!
export const Greeting = styled.div`
  color: ${props => props.theme.colors.fontColor};
`;
function Home() {
  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });
  // check for user in localStorage:
  const localUser = JSON.parse(localStorage.getItem('user'));
  const [user] = useState(() => {
    if (!localUser) {
      return 'no user in localStorage';
    }
    return localUser;
  });

  // check for spotifyToken in localStorage (needs to be refactored in more secure way)
  const spotifyToken = localStorage.getItem('SpotifyAccessToken');

  useEffect(() => {
    return spotifyToken ? SpotifyApi.setAccessToken(spotifyToken) : null;
  }, [spotifyToken, user]);

  const handlePlaylistName = e => {
    console.log(e.target.value);
    setPlaylistName({ playlistName: e.target.value });
  };

  return (
    <div>
      <input
        type="test"
        value={playlist.playlistName}
        onChange={handlePlaylistName}
      />
      <button
        type="submit"
        onClick={() => createPlaylist(user.uid, playlist.playlistName)}
      >
        ADD PLAYLIST
      </button>
    </div>
  );
}

export default Home;
