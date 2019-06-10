import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import createPlaylist from '../api/spotify/spotifyApi';
import { SpotifyContext } from '../context/spotifyContext';

import { SpotifyApi } from '../api/spotify/spotifyConfig';

// styled components allow us to grab styles from the themeProvider object globally via props!
export const Greeting = styled.div`
  color: ${props => props.theme.colors.fontColor};
`;
function Home(props) {
  const [playlist, setPlaylistName] = useState({
    playlistName: '',
  });
  const { spotifyToken } = useContext(SpotifyContext);

  useEffect(() => {
    return spotifyToken
      ? SpotifyApi.setAccessToken(
          spotifyToken.providerData[0].spotify.access_token
        )
      : null;
  }, [spotifyToken]);

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
        onClick={() => createPlaylist(spotifyToken.uid, playlist.playlistName)}
      >
        ADD PLAYLIST
      </button>
    </div>
  );
}

export default Home;
