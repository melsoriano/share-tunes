import React, { useState } from 'react';

// create instance of context
export const SpotifyContext = React.createContext();

// create context provider
export const SpotifyProvider = ({ children }) => {
  const [spotifyToken, setSpotifyToken] = useState();
  const [searchQuery, setSearchQuery] = useState({ query: '' });
  const [trackResults, setTrackResults] = useState({
    data: '',
  });
  const [playlistQuery, setPlaylistQuery] = useState({ query: '' });
  const [playlistResult, setPlaylistResult] = useState({ data: '' });
  const [playlistId, setPlaylistId] = useState({ data: '' });
  const [accessCode, setAccessCode] = useState({ code: '' });
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState({
    expiresIn: '',
  });
  const [playlistUri, setPlaylistUri] = useState({
    uri: '',
  });

  return (
    // inject state into the provider, and pass along to children components
    <SpotifyContext.Provider
      value={{
        playlistQuery,
        setPlaylistQuery,
        playlistResult,
        playlistId,
        setPlaylistId,
        setPlaylistResult,
        spotifyToken,
        setSpotifyToken,
        searchQuery,
        setSearchQuery,
        trackResults,
        setTrackResults,
        accessCode,
        setAccessCode,
        spotifyRefreshToken,
        setSpotifyRefreshToken,
        playlistUri,
        setPlaylistUri,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
